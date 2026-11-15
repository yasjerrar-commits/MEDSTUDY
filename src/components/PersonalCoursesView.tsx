import React, { useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  ListChecks,
  Loader2,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import type {
  AiGeneratedArtifact,
  AiToolKind,
  Flashcard,
  MedicalModuleMeta,
  ModuleId,
  QcmQuestion,
  UploadedCourse,
  UserStudyState,
} from '../types/medstudy';

interface PersonalCoursesViewProps {
  modules: MedicalModuleMeta[];
  state: UserStudyState;
  initialModuleId?: ModuleId;
  initialCourseId?: string;
  initialOpenUpload?: boolean;
  requestKey?: number;
  onAddCourse: (course: Omit<UploadedCourse, 'id' | 'uploadedAt' | 'aiArtifacts'>) => UploadedCourse;
  onUpdateCourse: (courseId: string, patch: Partial<UploadedCourse>) => void;
  onAddAiArtifact: (courseId: string, artifact: Omit<AiGeneratedArtifact, 'id' | 'createdAt'>) => void;
  onDeleteCourse: (course: UploadedCourse) => void;
  onImportQcms: (questions: QcmQuestion[]) => void;
  onImportFlashcards: (cards: Flashcard[]) => void;
}

const aiToolsList: { id: AiToolKind; label: string; desc: string }[] = [
  { id: 'summarize', label: '1. Résumer le cours', desc: 'Synthèse fidèle structurée en français' },
  {
    id: 'beginner',
    label: '2. Expliquer au débutant',
    desc: 'Explication progressive en 7 étapes simples',
  },
  { id: 'definitions', label: '3. Extraire les définitions', desc: 'Glossaire exact du support' },
  { id: 'qcm', label: '4. Générer des QCM', desc: 'Questions strictement issues du cours' },
  { id: 'flashcards', label: '5. Générer des flashcards', desc: 'Cartes recto/verso importables' },
  { id: 'exam_focus', label: '6. Infos pour l’examen', desc: 'Notions tombables et pièges' },
  { id: 'diagrams', label: '7. Expliquer schémas/tableaux', desc: 'Analyse des figures du support' },
  { id: 'revision_sheet', label: '8. Fiche de révision', desc: 'Plan complet prêt pour les révisions' },
];

export const PersonalCoursesView: React.FC<PersonalCoursesViewProps> = ({
  modules,
  state,
  initialModuleId = 'anatomie',
  initialCourseId,
  initialOpenUpload = false,
  requestKey = 0,
  onAddCourse,
  onUpdateCourse,
  onAddAiArtifact,
  onDeleteCourse,
  onImportQcms,
  onImportFlashcards,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<ModuleId | 'all'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || state.uploadedCourses[0]?.id || ''
  );

  // Upload form
  const [showUploadForm, setShowUploadForm] = useState(
    initialOpenUpload || state.uploadedCourses.length === 0
  );
  const [newTitle, setNewTitle] = useState('');
  const [newModuleId, setNewModuleId] = useState<ModuleId>(initialModuleId);
  const [newChapter, setNewChapter] = useState('');
  const [newText, setNewText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // AI running & interactive prompt states
  const [aiLoadingTool, setAiLoadingTool] = useState<AiToolKind | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [importedFlags, setImportedFlags] = useState<Record<string, boolean>>({});
  const [qcmStudentAnswers, setQcmStudentAnswers] = useState('');
  const [customQuestionText, setCustomQuestionText] = useState('');

  useEffect(() => {
    setNewModuleId(initialModuleId);
    if (requestKey > 0) {
      if (initialOpenUpload) {
        setShowUploadForm(true);
        setFilterModule(initialModuleId);
      }
      if (initialCourseId) {
        setSelectedCourseId(initialCourseId);
        setShowUploadForm(false);
        setFilterModule(initialModuleId);
      }
    }
  }, [initialModuleId, initialCourseId, initialOpenUpload, requestKey]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.uploadedCourses.filter((c) => {
      const modOk = filterModule === 'all' || c.moduleId === filterModule;
      const qOk =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.chapterName.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        (c.fileName || '').toLowerCase().includes(q);
      return modOk && qOk;
    });
  }, [state.uploadedCourses, filterModule, searchQuery]);

  const activeCourse =
    state.uploadedCourses.find((c) => c.id === selectedCourseId) || filteredCourses[0] || null;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!selectedFile && !newText.trim()) {
      setUploadError('Sélectionnez un fichier (PDF ou image) ou collez le texte de votre cours.');
      return;
    }

    setUploading(true);
    try {
      let uploadedMeta: {
        storedFileName: string;
        originalName: string;
        mimeType: string;
        size: number;
        fileUrl: string;
      } | null = null;

      if (selectedFile) {
        const fd = new FormData();
        fd.append('file', selectedFile);
        const resp = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error || 'Échec du téléversement.');
        }
        uploadedMeta = data;
      }

      const fileType: UploadedCourse['fileType'] = uploadedMeta
        ? uploadedMeta.mimeType === 'application/pdf'
          ? 'pdf'
          : uploadedMeta.mimeType.startsWith('image/')
            ? 'image'
            : 'text'
        : 'text';

      const created = onAddCourse({
        moduleId: newModuleId,
        chapterName: newChapter.trim() || 'Chapitre général',
        title:
          newTitle.trim() ||
          uploadedMeta?.originalName.replace(/\.[^.]+$/, '') ||
          'Cours importé',
        fileType,
        fileName: uploadedMeta?.originalName,
        storedFileName: uploadedMeta?.storedFileName,
        fileUrl: uploadedMeta?.fileUrl,
        mimeType: uploadedMeta?.mimeType,
        fileSizeBytes: uploadedMeta?.size,
        textContent: newText.trim() || undefined,
        notes: '',
      });

      setSelectedCourseId(created.id);
      setShowUploadForm(false);
      setNewTitle('');
      setNewChapter('');
      setNewText('');
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l’importation.');
    } finally {
      setUploading(false);
    }
  };

  const runAiTool = async (tool: AiToolKind, customPrompt?: string) => {
    if (!activeCourse) return;
    setAiError(null);
    setAiLoadingTool(tool);
    try {
      const modTitle =
        modules.find((m) => m.id === activeCourse.moduleId)?.title || activeCourse.moduleId;
      const resp = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          storedFileName: activeCourse.storedFileName,
          mimeType: activeCourse.mimeType,
          textContent: [activeCourse.textContent, activeCourse.notes].filter(Boolean).join('\n\n'),
          courseTitle: activeCourse.title,
          moduleTitle: modTitle,
          chapterName: activeCourse.chapterName,
          customPrompt,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Impossible d’analyser le document.');
      }

      const qcmsMapped = Array.isArray(data.generatedQcms)
        ? data.generatedQcms.map(
            (q: Omit<QcmQuestion, 'id' | 'moduleId' | 'chapterId' | 'chapterTitle'>) => ({
              ...q,
              moduleId: activeCourse.moduleId,
              chapterId: `course-${activeCourse.id}`,
              chapterTitle: activeCourse.chapterName,
              sourceCourseId: activeCourse.id,
            })
          )
        : undefined;

      const fcMapped = Array.isArray(data.generatedFlashcards)
        ? data.generatedFlashcards.map((f: { front: string; back: string; explanation?: string }) => ({
            ...f,
            moduleId: activeCourse.moduleId,
            chapterId: `course-${activeCourse.id}`,
            chapterTitle: activeCourse.chapterName,
            sourceCourseId: activeCourse.id,
          }))
        : undefined;

      onAddAiArtifact(activeCourse.id, {
        tool,
        title: data.title,
        contentMarkdown: data.contentMarkdown,
        generatedQcms: qcmsMapped,
        generatedFlashcards: fcMapped,
      });

      if (tool === 'custom_question') {
        setCustomQuestionText('');
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur inattendue.');
    } finally {
      setAiLoadingTool(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2744] dark:text-white">
            Cours PDF, Explications IA & Correcteur QCM
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Importez vos polycopiés PDF, schémas ou annales QCM. Obtenez des explications
            détaillées, posez vos questions sur le PDF ou corrigez automatiquement vos QCM.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploadForm((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#173961] dark:hover:bg-teal-500 whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{showUploadForm ? 'Fermer le formulaire' : 'Importer un PDF / cours'}</span>
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <form
          onSubmit={handleUploadSubmit}
          className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-[#0F2744] dark:text-white">
            Importer un PDF de cours, une annale QCM ou des notes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="text-xs space-y-1">
              <span className="font-medium">Module concerné</span>
              <select
                value={newModuleId}
                onChange={(e) => setNewModuleId(e.target.value as ModuleId)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs space-y-1">
              <span className="font-medium">Chapitre</span>
              <input
                type="text"
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
                placeholder="Ex. Biologie cellulaire / Annales 2025"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs space-y-1">
              <span className="font-medium">Titre du document</span>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex. Polycopié Membrane plasmique"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-5 text-center cursor-pointer hover:border-[#0D9488] transition-colors">
              <Upload className="w-6 h-6 text-[#0D9488] mb-2" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {selectedFile ? selectedFile.name : 'Choisir un fichier PDF ou une image (PNG, JPG)'}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">Taille max : 25 Mo</span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <label className="text-xs space-y-1">
              <span className="font-medium">Ou collez directement le texte / énoncés QCM</span>
              <textarea
                rows={4}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Collez ici un extrait de cours ou une liste de QCM à corriger..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
          </div>

          {uploadError && <p className="text-xs font-medium text-rose-600">{uploadError}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploading ? 'Importation en cours...' : 'Enregistrer dans ma bibliothèque'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Library + Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Searchable Course Library */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans vos PDF et notes..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs"
              />
            </div>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value as ModuleId | 'all')}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
            >
              <option value="all">Tous les modules</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredCourses.length === 0 ? (
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
                Aucun document importé pour ce filtre. Cliquez sur « Importer un PDF / cours » pour
                ajouter votre premier document.
              </div>
            ) : (
              filteredCourses.map((course) => {
                const modTitle = modules.find((m) => m.id === course.moduleId)?.shortTitle;
                const isSelected = activeCourse?.id === course.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#0D9488] shadow-xs'
                        : 'bg-white/75 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {course.fileType === 'pdf' ? (
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                        ) : course.fileType === 'image' ? (
                          <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <BookMarked className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        <span>{modTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.chapterName}</span>
                      </div>
                    </div>
                    <h3 className="mt-1.5 text-sm font-semibold text-[#0F2744] dark:text-white truncate">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {course.aiArtifacts.length} analyse{course.aiArtifacts.length > 1 ? 's' : ''}{' '}
                      IA enregistrée{course.aiArtifacts.length > 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Active Course Reader & AI Tools */}
        <section className="lg:col-span-8 space-y-6">
          {!activeCourse ? (
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center space-y-2">
              <GraduationCap className="w-8 h-8 text-[#0D9488] mx-auto" />
              <h3 className="text-base font-semibold text-[#0F2744] dark:text-white">
                Sélectionnez ou importez un PDF / support de cours
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Vos PDF et annales restent sauvegardés pour la lecture, les explications IA et la
                correction détaillée des QCM.
              </p>
            </div>
          ) : (
            <>
              {/* Document Preview & Personal Notes */}
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      {modules.find((m) => m.id === activeCourse.moduleId)?.title} ·{' '}
                      {activeCourse.chapterName}
                    </p>
                    <h2 className="text-xl font-bold text-[#0F2744] dark:text-white">
                      {activeCourse.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeCourse.fileUrl && (
                      <a
                        href={activeCourse.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ouvrir le fichier</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteCourse(activeCourse)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      title="Supprimer ce cours"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PDF Preview */}
                {activeCourse.fileType === 'pdf' && activeCourse.fileUrl && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <iframe
                      src={activeCourse.fileUrl}
                      title={activeCourse.title}
                      className="w-full h-[420px]"
                    />
                  </div>
                )}

                {/* Image Preview */}
                {activeCourse.fileType === 'image' && activeCourse.fileUrl && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white p-3">
                    <img
                      src={activeCourse.fileUrl}
                      alt={activeCourse.title}
                      className="max-h-[400px] mx-auto object-contain"
                    />
                  </div>
                )}

                {/* Text content */}
                {activeCourse.textContent && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {activeCourse.textContent}
                  </div>
                )}

                {/* Editable Personal Notes on this course */}
                <div className="pt-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Notes personnelles sur ce document
                  </label>
                  <textarea
                    rows={3}
                    value={activeCourse.notes}
                    onChange={(e) =>
                      onUpdateCourse(activeCourse.id, { notes: e.target.value })
                    }
                    placeholder="Ajoutez vos annotations, remarques du professeur ou points à éclaircir..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Dedicated QCM Corrector + Custom PDF Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                    <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                      Correcteur IA de QCM & Annales
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Corrige chaque QCM de ce PDF/image, justifie les items vrais et faux, et
                    vérifie vos propres réponses si vous les saisissez ci-dessous.
                  </p>
                  <textarea
                    rows={2}
                    value={qcmStudentAnswers}
                    onChange={(e) => setQcmStudentAnswers(e.target.value)}
                    placeholder="Optionnel : vos réponses (ex. Q1: A, C ; Q2: B ; Q3: Faux)"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    disabled={aiLoadingTool !== null}
                    onClick={() => runAiTool('qcm_corrector', qcmStudentAnswers)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 py-2.5 px-4 text-xs font-semibold text-white hover:bg-[#173961] disabled:opacity-50 cursor-pointer"
                  >
                    {aiLoadingTool === 'qcm_corrector' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Corriger les QCM de ce document</span>
                  </button>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="w-4 h-4 text-[#0284C7]" />
                    <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                      Poser une question / Explication sur ce PDF
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Demandez une explication claire d’un mécanisme, d’une page ou d’un concept
                    précis tiré de votre support.
                  </p>
                  <textarea
                    rows={2}
                    value={customQuestionText}
                    onChange={(e) => setCustomQuestionText(e.target.value)}
                    placeholder="Ex. Explique-moi simplement le transport actif secondaire de la page 3..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    disabled={aiLoadingTool !== null || !customQuestionText.trim()}
                    onClick={() => runAiTool('custom_question', customQuestionText)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] py-2.5 px-4 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
                  >
                    {aiLoadingTool === 'custom_question' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Expliquer ce point</span>
                  </button>
                </div>
              </div>

              {/* 8 AI Tools Panel */}
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0D9488]" />
                  <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
                    Outils pédagogiques IA sur votre document
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Priorité stricte aux informations de votre support. Tout complément scientifique
                  externe est clairement identifié dans une rubrique séparée.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {aiToolsList.map((tool) => {
                    const busy = aiLoadingTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        disabled={aiLoadingTool !== null}
                        onClick={() => runAiTool(tool.id)}
                        className="text-left rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 hover:border-[#0D9488] hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#0F2744] dark:text-white">
                            {tool.label}
                          </span>
                          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D9488]" />}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {tool.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {aiError && (
                  <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-700 dark:text-rose-300">
                    {aiError}
                  </div>
                )}
              </div>

              {/* Generated AI Artifacts */}
              {activeCourse.aiArtifacts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
                    Contenus générés à partir de ce cours ({activeCourse.aiArtifacts.length})
                  </h3>

                  {activeCourse.aiArtifacts.map((art) => {
                    const alreadyImported = !!importedFlags[art.id];
                    return (
                      <div
                        key={art.id}
                        className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div>
                            <h4 className="text-sm font-bold text-[#0F2744] dark:text-white">
                              {art.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Généré le {new Date(art.createdAt).toLocaleString('fr-FR')}
                            </p>
                          </div>

                          {art.generatedQcms && art.generatedQcms.length > 0 && (
                            <button
                              type="button"
                              disabled={alreadyImported}
                              onClick={() => {
                                const withIds: QcmQuestion[] = art.generatedQcms!.map((q, i) => ({
                                  ...q,
                                  id: `ai-qcm-${art.id}-${i}`,
                                }));
                                onImportQcms(withIds);
                                setImportedFlags((p) => ({ ...p, [art.id]: true }));
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60 cursor-pointer"
                            >
                              {alreadyImported ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <ListChecks className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {alreadyImported
                                  ? 'QCM ajoutés à votre banque'
                                  : `Ajouter ces ${art.generatedQcms.length} QCM au module`}
                              </span>
                            </button>
                          )}

                          {art.generatedFlashcards && art.generatedFlashcards.length > 0 && (
                            <button
                              type="button"
                              disabled={alreadyImported}
                              onClick={() => {
                                const withIds: Flashcard[] = art.generatedFlashcards!.map(
                                  (f, i) => ({
                                    ...f,
                                    id: `ai-fc-${art.id}-${i}`,
                                  })
                                );
                                onImportFlashcards(withIds);
                                setImportedFlags((p) => ({ ...p, [art.id]: true }));
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60 cursor-pointer"
                            >
                              {alreadyImported ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Layers className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {alreadyImported
                                  ? 'Flashcards ajoutées'
                                  : `Importer ces ${art.generatedFlashcards.length} flashcards`}
                              </span>
                            </button>
                          )}
                        </div>

                        <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {art.contentMarkdown}
                        </div>

                        {art.generatedQcms && art.generatedQcms.length > 0 && (
                          <div className="space-y-2 pt-2">
                            {art.generatedQcms.map((q, qi) => (
                              <div
                                key={qi}
                                className="rounded-lg bg-slate-50 dark:bg-slate-800/70 p-3 text-xs space-y-1"
                              >
                                <p className="font-semibold text-[#0F2744] dark:text-white">
                                  Q{qi + 1}. {q.question}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                  Réponse(s) :{' '}
                                  {q.correctIndices.map((idx) => q.options[idx]).join(' / ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {art.generatedFlashcards && art.generatedFlashcards.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {art.generatedFlashcards.map((f, fi) => (
                              <div
                                key={fi}
                                className="rounded-lg bg-slate-50 dark:bg-slate-800/70 p-3 text-xs space-y-1"
                              >
                                <p className="font-semibold text-[#0F2744] dark:text-white">
                                  {f.front}
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">{f.back}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};
