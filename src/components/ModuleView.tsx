import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  Edit3,
  FileText,
  Layers,
  ListChecks,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
} from 'lucide-react';
import { biophysiqueFormulas } from '../data/biophysiqueData';
import {
  decompositionExercises,
  terminologyDictionary,
  translationExercises,
} from '../data/terminologieData';
import type {
  CustomModuleConfig,
  Lesson,
  MedicalModuleMeta,
  ModuleId,
  UserStudyState,
} from '../types/medstudy';

interface ModuleViewProps {
  module: MedicalModuleMeta;
  state: UserStudyState;
  onBack: () => void;
  onOpenLesson: (lesson: Lesson) => void;
  onStartQcm: (moduleId: ModuleId, chapterId?: string) => void;
  onStartFlashcards: (moduleId: ModuleId, chapterId?: string) => void;
  onOpenCourses: (
    moduleId: ModuleId,
    options?: { courseId?: string; openUpload?: boolean }
  ) => void;
  onUpdateCustomModule: (updater: (cfg: CustomModuleConfig) => CustomModuleConfig) => void;
}

type ModuleTab =
  | 'chapters'
  | 'pdfs'
  | 'formulas'
  | 'simulator'
  | 'dictionary'
  | 'exercises'
  | 'customize';

export const ModuleView: React.FC<ModuleViewProps> = ({
  module,
  state,
  onBack,
  onOpenLesson,
  onStartQcm,
  onStartFlashcards,
  onOpenCourses,
  onUpdateCustomModule,
}) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    module.chapters[0]?.id || ''
  );

  // Biophysics formula filter & interactive Poiseuille / Osmolarity simulator
  const [formulaFilter, setFormulaFilter] = useState('');
  const [radiusPct, setRadiusPct] = useState(100);
  const [osmConc, setOsmConc] = useState(154);
  const [osmI, setOsmI] = useState(2);

  // Public health epi calculator
  const [vp, setVp] = useState(90);
  const [fp, setFp] = useState(20);
  const [fn, setFn] = useState(10);
  const [vn, setVn] = useState(80);

  // Terminology dictionary & interactive exercises
  const [dictSearch, setDictSearch] = useState('');
  const [dictCategory, setDictCategory] = useState<string>('Toutes');
  const [translationInputs, setTranslationInputs] = useState<Record<string, string>>({});
  const [translationChecked, setTranslationChecked] = useState<Record<string, boolean>>({});
  const [matchingSelectedRoot, setMatchingSelectedRoot] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, boolean>>({});

  // Custom module form states
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDesc, setNewChapterDesc] = useState('');
  const [targetChapterId, setTargetChapterId] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonPoints, setNewLessonPoints] = useState('');
  const [newFcFront, setNewFcFront] = useState('');
  const [newFcBack, setNewFcBack] = useState('');
  const [newQcmQuestion, setNewQcmQuestion] = useState('');
  const [newQcmOptA, setNewQcmOptA] = useState('');
  const [newQcmOptB, setNewQcmOptB] = useState('');
  const [newQcmOptC, setNewQcmOptC] = useState('');
  const [newQcmCorrect, setNewQcmCorrect] = useState(0);
  const [newQcmExp, setNewQcmExp] = useState('');

  const speakFrench = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'fr-FR';
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    }
  };

  const modLessons = module.chapters.flatMap((c) => c.lessons);
  const completedCount = modLessons.filter((l) =>
    state.completedLessonIds.includes(l.id)
  ).length;
  const progressPct =
    modLessons.length > 0 ? Math.round((completedCount / modLessons.length) * 100) : 0;
  const moduleCourses = useMemo(
    () => state.uploadedCourses.filter((c) => c.moduleId === module.id),
    [state.uploadedCourses, module.id]
  );

  const filteredFormulas = useMemo(() => {
    const q = formulaFilter.trim().toLowerCase();
    if (!q) return biophysiqueFormulas;
    return biophysiqueFormulas.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.chapterTitle.toLowerCase().includes(q) ||
        f.medicalApplication.toLowerCase().includes(q)
    );
  }, [formulaFilter]);

  const filteredTerms = useMemo(() => {
    const q = dictSearch.trim().toLowerCase();
    return terminologyDictionary.filter((t) => {
      const catOk = dictCategory === 'Toutes' || t.category === dictCategory;
      const qOk =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.meaning.toLowerCase().includes(q) ||
        t.exampleWord.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [dictSearch, dictCategory]);

  const activeChapter =
    module.chapters.find((c) => c.id === selectedChapterId) || module.chapters[0];

  const matchingPairs = [
    { root: 'Cardi(o)-', meaning: 'Cœur' },
    { root: 'Néphr(o)-', meaning: 'Rein' },
    { root: 'Hépat(o)-', meaning: 'Foie' },
    { root: 'Pneum(o)-', meaning: 'Poumon / Air' },
    { root: 'Osté(o)-', meaning: 'Os' },
  ];
  const shuffledMeanings = ['Poumon / Air', 'Cœur', 'Os', 'Rein', 'Foie'];

  const handleMatchAttempt = (meaning: string) => {
    if (!matchingSelectedRoot) return;
    const expected = matchingPairs.find((p) => p.root === matchingSelectedRoot)?.meaning;
    if (expected === meaning) {
      setMatchedPairs((prev) => ({ ...prev, [matchingSelectedRoot]: true }));
      setMatchingSelectedRoot(null);
    }
  };

  // Calculations for biophysics & public health interactive simulators
  const relativeFlowPct = Math.round(Math.pow(radiusPct / 100, 4) * 1000) / 10;
  const relativeResistance =
    radiusPct > 0 ? Math.round((1 / Math.pow(radiusPct / 100, 4)) * 100) / 100 : Infinity;
  const calcOsm = osmConc * osmI;

  const se = vp + fn > 0 ? Math.round((vp / (vp + fn)) * 1000) / 10 : 0;
  const sp = vn + fp > 0 ? Math.round((vn / (vn + fp)) * 1000) / 10 : 0;
  const vpp = vp + fp > 0 ? Math.round((vp / (vp + fp)) * 1000) / 10 : 0;
  const vpn = vn + fn > 0 ? Math.round((vn / (vn + fn)) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0F2744] dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </button>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {module.code} · {module.chapters.length} chapitre{module.chapters.length > 1 ? 's' : ''} ·{' '}
              {modLessons.length} leçon{modLessons.length > 1 ? 's' : ''}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0F2744] dark:text-white">
              {module.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {module.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onStartFlashcards(module.id)}
              disabled={module.flashcards.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Flashcards ({module.flashcards.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onStartQcm(module.id)}
              disabled={module.qcms.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-[#173961] dark:hover:bg-teal-500 disabled:opacity-40 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
            >
              <ListChecks className="w-4 h-4" />
              <span>QCM du module ({module.qcms.length})</span>
            </button>
          </div>
        </div>

        {/* Progress strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, backgroundColor: module.accentHex }}
            />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
            {progressPct}% terminé
          </span>
        </div>

        {/* Module sub-navigation tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'chapters'
                ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Chapitres & Leçons
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdfs')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'pdfs'
                ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Supports PDF & IA ({moduleCourses.length})
          </button>

          {module.id === 'biophysique' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('formulas')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'formulas'
                    ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Bibliothèque des formules
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'simulator'
                    ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Exercices interactifs
              </button>
            </>
          )}

          {module.id === 'sante-publique' && (
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calculateur statistique (Se / Sp)
            </button>
          )}

          {module.id === 'terminologie' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('dictionary')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'dictionary'
                    ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dictionnaire médical
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('exercises')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'exercises'
                    ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Exercices (Décomposition & Traduction)
              </button>
            </>
          )}

          {module.id === 'personnalise' && (
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'customize'
                  ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Configurer & Créer
            </button>
          )}
        </div>
      </div>

      {/* TAB: CHAPTERS & LESSONS */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chapter List */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1 mb-2">
              Chapitres du module
            </h2>
            {module.chapters.length === 0 ? (
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-sm text-slate-600 dark:text-slate-400 space-y-3">
                <p>Aucun chapitre personnalisé n’a encore été créé dans ce module.</p>
                {module.id === 'personnalise' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('customize')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer mon premier chapitre</span>
                  </button>
                )}
              </div>
            ) : (
              module.chapters.map((ch) => {
                const isSelected = activeChapter?.id === ch.id;
                const chDone =
                  ch.lessons.length > 0 &&
                  ch.lessons.every((l) => state.completedLessonIds.includes(l.id));
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`w-full text-left rounded-xl p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#0D9488] shadow-xs'
                        : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        Chapitre {String(ch.order).padStart(2, '0')}
                      </span>
                      {chDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-[#0F2744] dark:text-white">
                      {ch.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {ch.description}
                    </p>
                  </button>
                );
              })
            )}

            {/* Quick link to uploaded courses for this module */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenCourses(module.id, { openUpload: true })}
                className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-left hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2744] dark:text-teal-300">
                  <Upload className="w-4 h-4" />
                  <span>Importer un PDF / support de cours</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Ajoutez vos polycopiés ou annales QCM pour obtenir explications et corrections par IA.
                </p>
              </button>
            </div>
          </div>

          {/* Active Chapter Detail & Lessons */}
          <div className="lg:col-span-8">
            {activeChapter ? (
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-mono text-slate-500">
                      Chapitre {activeChapter.order}
                    </p>
                    <h2 className="text-xl font-bold text-[#0F2744] dark:text-white">
                      {activeChapter.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {activeChapter.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartFlashcards(module.id, activeChapter.id)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Flashcards
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartQcm(module.id, activeChapter.id)}
                      className="rounded-lg bg-[#0D9488] px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer"
                    >
                      QCM du chapitre
                    </button>
                  </div>
                </div>

                {activeChapter.lessons.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 py-4">
                    Ce chapitre ne contient pas encore de leçon. Utilisez l’onglet « Configurer &
                    Créer » pour en ajouter une.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeChapter.lessons.map((lesson) => {
                      const isDone = state.completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-[#0D9488]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>{lesson.difficulty}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{lesson.estimatedMinutes} min</span>
                              {isDone && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    Terminée
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="text-base font-semibold text-[#0F2744] dark:text-white">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {lesson.subtitle}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenLesson(lesson)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#173961] dark:hover:bg-slate-700 whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>{isDone ? 'Relire le cours' : 'Étudier'}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB: MODULE PDFS & AI */}
      {activeTab === 'pdfs' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-[#0F2744] dark:text-white">
                Supports PDF & Assistant IA — {module.shortTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Importez les PDF de vos professeurs ou vos annales QCM pour obtenir des
                explications ciblées, des résumés fidèles et une correction détaillée des QCM.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCourses(module.id, { openUpload: true })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Ajouter un PDF à ce module</span>
            </button>
          </div>

          {moduleCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-[#0D9488] mx-auto" />
              <h3 className="text-sm font-semibold text-[#0F2744] dark:text-white">
                Aucun PDF importé dans {module.shortTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Téléversez un cours PDF ou une série de QCM pour poser vos questions à l’IA,
                générer des explications simples ou corriger vos réponses item par item.
              </p>
              <button
                type="button"
                onClick={() => onOpenCourses(module.id, { openUpload: true })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Importer mon premier PDF</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {course.chapterName} ·{' '}
                      {course.fileType === 'pdf'
                        ? 'Document PDF'
                        : course.fileType === 'image'
                          ? 'Image / Schéma'
                          : 'Notes texte'}
                    </p>
                    <h3 className="text-base font-semibold text-[#0F2744] dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {course.aiArtifacts.length} analyse{course.aiArtifacts.length > 1 ? 's' : ''}{' '}
                      IA enregistrée{course.aiArtifacts.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCourses(module.id, { courseId: course.id })}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#173961] dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Ouvrir, expliquer & corriger QCM</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: BIOPHYSICS FORMULA LIBRARY */}
      {activeTab === 'formulas' && module.id === 'biophysique' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#0F2744] dark:text-white">
              Bibliothèque des formules de biophysique
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formulaFilter}
                onChange={(e) => setFormulaFilter(e.target.value)}
                placeholder="Filtrer (Poiseuille, Nernst...)"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.map((f) => (
              <div
                key={f.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {f.chapterTitle} · Unité : {f.unit}
                </p>
                <h3 className="text-base font-semibold text-[#0F2744] dark:text-white">
                  {f.name}
                </h3>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 font-mono text-sm text-[#0F2744] dark:text-teal-300 overflow-x-auto">
                  {f.expression}
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {f.variables.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">
                    Application médicale :
                  </strong>{' '}
                  {f.medicalApplication}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: INTERACTIVE SIMULATOR (BIOPHYSIQUE OR SANTE PUBLIQUE) */}
      {activeTab === 'simulator' && module.id === 'biophysique' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#0284C7]" />
              <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
                Simulateur interactif : Loi de Poiseuille (Sténose)
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Modifiez le rayon luminal de l’artère (en % du rayon normal) pour observer l’impact en
              puissance 4 sur le débit et la résistance vasculaire à ΔP constant.
            </p>
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span>Rayon luminal r / r₀</span>
                <span className="font-mono font-bold tabular-nums">{radiusPct}%</span>
              </div>
              <input
                type="range"
                min={25}
                max={120}
                value={radiusPct}
                onChange={(e) => setRadiusPct(Number(e.target.value))}
                className="w-full accent-[#0D9488]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-xs text-slate-500">Débit relatif (Q / Q₀)</p>
                <p className="mt-1 text-xl font-bold font-mono text-[#0284C7] tabular-nums">
                  {relativeFlowPct}%
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-xs text-slate-500">Résistance (R / R₀)</p>
                <p className="mt-1 text-xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
                  ×{relativeResistance}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#0D9488]" />
              <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
                Calculateur d’osmolarité & tonicité
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-slate-600 dark:text-slate-300">Concentration (mmol/L)</span>
                <input
                  type="number"
                  min={0}
                  value={osmConc}
                  onChange={(e) => setOsmConc(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </label>
              <label className="text-xs space-y-1">
                <span className="text-slate-600 dark:text-slate-300">
                  Coefficient i (ex. NaCl=2, CaCl₂=3)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={osmI}
                  onChange={(e) => setOsmI(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </label>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Osmolarité calculée</p>
                <p className="text-xl font-bold font-mono text-[#0D9488] tabular-nums">
                  {calcOsm} mOsm/L
                </p>
              </div>
              <div className="text-right text-xs font-medium text-slate-700 dark:text-slate-200">
                {calcOsm < 275
                  ? 'Hypo-osmolaire (< 275)'
                  : calcOsm <= 315
                    ? 'Iso-osmolaire au plasma'
                    : 'Hyper-osmolaire (> 315)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulator' && module.id === 'sante-publique' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
              Calculateur interactif de validité d’un test diagnostique
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Modifiez les effectifs du tableau de contingence 2×2 pour calculer Sensibilité,
              Spécificité, VPP et VPN.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="text-xs space-y-1">
              <span>Vrais Positifs (VP)</span>
              <input
                type="number"
                min={0}
                value={vp}
                onChange={(e) => setVp(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono"
              />
            </label>
            <label className="text-xs space-y-1">
              <span>Faux Positifs (FP)</span>
              <input
                type="number"
                min={0}
                value={fp}
                onChange={(e) => setFp(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono"
              />
            </label>
            <label className="text-xs space-y-1">
              <span>Faux Négatifs (FN)</span>
              <input
                type="number"
                min={0}
                value={fn}
                onChange={(e) => setFn(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono"
              />
            </label>
            <label className="text-xs space-y-1">
              <span>Vrais Négatifs (VN)</span>
              <input
                type="number"
                min={0}
                value={vn}
                onChange={(e) => setVn(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">Sensibilité (Se)</p>
              <p className="mt-1 text-xl font-bold font-mono text-[#0284C7] tabular-nums">{se}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">Spécificité (Sp)</p>
              <p className="mt-1 text-xl font-bold font-mono text-[#0D9488] tabular-nums">{sp}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">VPP</p>
              <p className="mt-1 text-xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
                {vpp}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">VPN</p>
              <p className="mt-1 text-xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
                {vpn}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TERMINOLOGY SEARCHABLE DICTIONARY */}
      {activeTab === 'dictionary' && module.id === 'terminologie' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  placeholder="Rechercher un préfixe, suffixe, racine ou exemple..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {[
                  'Toutes',
                  'Préfixe',
                  'Suffixe',
                  'Racine',
                  'Anatomique',
                  'Physiologique',
                  'Pathologique',
                  'Clinique',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDictCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      dictCategory === cat
                        ? 'bg-[#0F2744] text-white dark:bg-teal-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTerms.map((entry) => (
                <div
                  key={entry.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{entry.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Origine : {entry.origin}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#0F2744] dark:text-white">
                      {entry.term} — <span className="font-normal">{entry.meaning}</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Exemple : {entry.exampleWord}</strong> ({entry.exampleDecomposition})
                      → {entry.exampleDefinition}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakFrench(`${entry.exampleWord}. ${entry.exampleDefinition}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                    title="Écouter la prononciation française"
                  >
                    <Volume2 className="w-4 h-4 text-[#0D9488]" />
                    <span>Prononcer</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: TERMINOLOGY INTERACTIVE EXERCISES */}
      {activeTab === 'exercises' && module.id === 'terminologie' && (
        <div className="space-y-6">
          {/* 1. Word Decomposition */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
              1. Décomposition morphologique des termes médicaux
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decompositionExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#0F2744] dark:text-white">{ex.word}</h4>
                    <button
                      type="button"
                      onClick={() => speakFrench(ex.word)}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      aria-label={`Prononcer ${ex.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ex.parts.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs"
                      >
                        <span className="font-mono font-semibold text-[#0D9488]">{p.segment}</span>{' '}
                        <span className="text-slate-500">({p.role})</span> : {p.meaning}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ex.fullDefinition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Matching Exercise */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
                  2. Exercice d’appariement (Racine ↔ Signification)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cliquez sur une racine à gauche puis sur sa signification correspondante à droite.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMatchedPairs({});
                  setMatchingSelectedRoot(null);
                }}
                className="text-xs font-medium text-[#0D9488] hover:underline cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                {matchingPairs.map((pair) => {
                  const done = !!matchedPairs[pair.root];
                  const active = matchingSelectedRoot === pair.root;
                  return (
                    <button
                      key={pair.root}
                      type="button"
                      disabled={done}
                      onClick={() => setMatchingSelectedRoot(pair.root)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                        done
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : active
                            ? 'bg-[#0F2744] text-white border-[#0F2744]'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {pair.root} {done ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2">
                {shuffledMeanings.map((meaning) => {
                  const alreadyMatched = matchingPairs.some(
                    (p) => p.meaning === meaning && matchedPairs[p.root]
                  );
                  return (
                    <button
                      key={meaning}
                      type="button"
                      disabled={alreadyMatched}
                      onClick={() => handleMatchAttempt(meaning)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                        alreadyMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-[#0D9488]'
                      }`}
                    >
                      {meaning}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Translation Exercise */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
              3. Exercice de traduction (Langage courant → Terme médical)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {translationExercises.map((tr) => {
                const val = translationInputs[tr.id] || '';
                const isChecked = !!translationChecked[tr.id];
                const isRight = tr.accepted.includes(val.trim().toLowerCase());
                return (
                  <div
                    key={tr.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5"
                  >
                    <p className="text-sm font-medium text-[#0F2744] dark:text-white">
                      {tr.layman}
                    </p>
                    <p className="text-xs text-slate-500">Indice : {tr.hint}</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          setTranslationInputs((prev) => ({ ...prev, [tr.id]: e.target.value }))
                        }
                        placeholder="Votre réponse médicale..."
                        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setTranslationChecked((prev) => ({ ...prev, [tr.id]: true }))
                        }
                        className="rounded-lg bg-[#0F2744] dark:bg-teal-600 px-3 py-2 text-xs font-semibold text-white cursor-pointer"
                      >
                        Vérifier
                      </button>
                    </div>
                    {isChecked && (
                      <p
                        className={`text-xs font-medium ${
                          isRight ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isRight
                          ? `Exact ! « ${tr.medical} »`
                          : `Réponse attendue : ${tr.medical}`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MODULE 6 CONFIGURABLE / CUSTOMIZABLE */}
      {activeTab === 'customize' && module.id === 'personnalise' && (
        <div className="space-y-6">
          {/* Rename & Style Module 6 */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#0D9488]" />
              <h3 className="text-base font-bold text-[#0F2744] dark:text-white">
                Identité de votre 6e module
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-xs space-y-1">
                <span className="font-medium">Nom du module (ex. Histologie, Embryologie...)</span>
                <input
                  type="text"
                  value={state.customModule.title}
                  onChange={(e) =>
                    onUpdateCustomModule((cfg) => ({ ...cfg, title: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs space-y-1">
                <span className="font-medium">Couleur d’accentuation</span>
                <select
                  value={state.customModule.accentColor}
                  onChange={(e) =>
                    onUpdateCustomModule((cfg) => ({
                      ...cfg,
                      accentColor: e.target.value as CustomModuleConfig['accentColor'],
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="teal">Turquoise médical</option>
                  <option value="navy">Bleu marine</option>
                  <option value="sky">Bleu ciel</option>
                  <option value="indigo">Indigo</option>
                  <option value="emerald">Émeraude</option>
                  <option value="amber">Ambre</option>
                </select>
              </label>
            </div>
            <label className="block text-xs space-y-1">
              <span className="font-medium">Description</span>
              <input
                type="text"
                value={state.customModule.description}
                onChange={(e) =>
                  onUpdateCustomModule((cfg) => ({ ...cfg, description: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Chapter */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                Ajouter un chapitre
              </h3>
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="Titre du chapitre..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={newChapterDesc}
                onChange={(e) => setNewChapterDesc(e.target.value)}
                placeholder="Brève description..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newChapterTitle.trim()) return;
                  const id = `custom-ch-${Date.now()}`;
                  onUpdateCustomModule((cfg) => ({
                    ...cfg,
                    chapters: [
                      ...cfg.chapters,
                      {
                        id,
                        title: newChapterTitle.trim(),
                        description: newChapterDesc.trim() || 'Chapitre personnalisé',
                        lessons: [],
                      },
                    ],
                  }));
                  setTargetChapterId(id);
                  setSelectedChapterId(id);
                  setNewChapterTitle('');
                  setNewChapterDesc('');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter le chapitre</span>
              </button>

              {state.customModule.chapters.length > 0 && (
                <ul className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  {state.customModule.chapters.map((c) => (
                    <li key={c.id} className="flex items-center justify-between text-xs">
                      <span className="font-medium">{c.title}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateCustomModule((cfg) => ({
                            ...cfg,
                            chapters: cfg.chapters.filter((ch) => ch.id !== c.id),
                          }))
                        }
                        className="text-rose-600 hover:text-rose-700 p-1 cursor-pointer"
                        aria-label="Supprimer le chapitre"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add Lesson */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                Créer une leçon
              </h3>
              <select
                value={targetChapterId || state.customModule.chapters[0]?.id || ''}
                onChange={(e) => setTargetChapterId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">Sélectionner un chapitre...</option>
                {state.customModule.chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="Titre de la leçon..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <textarea
                rows={4}
                value={newLessonContent}
                onChange={(e) => setNewLessonContent(e.target.value)}
                placeholder="Contenu détaillé de la leçon (séparez les paragraphes par une ligne vide)..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={newLessonPoints}
                onChange={(e) => setNewLessonPoints(e.target.value)}
                placeholder="Points clés à retenir (séparés par ;)..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const chId = targetChapterId || state.customModule.chapters[0]?.id;
                  if (!chId || !newLessonTitle.trim() || !newLessonContent.trim()) return;
                  onUpdateCustomModule((cfg) => ({
                    ...cfg,
                    chapters: cfg.chapters.map((ch) =>
                      ch.id === chId
                        ? {
                            ...ch,
                            lessons: [
                              ...ch.lessons,
                              {
                                id: `custom-les-${Date.now()}`,
                                title: newLessonTitle.trim(),
                                content: newLessonContent.trim(),
                                keyPoints: newLessonPoints
                                  .split(';')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                                updatedAt: new Date().toISOString(),
                              },
                            ],
                          }
                        : ch
                    ),
                  }));
                  setNewLessonTitle('');
                  setNewLessonContent('');
                  setNewLessonPoints('');
                  setActiveTab('chapters');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer la leçon</span>
              </button>
            </div>

            {/* Add Custom Flashcard */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                Créer une flashcard personnalisée
              </h3>
              <input
                type="text"
                value={newFcFront}
                onChange={(e) => setNewFcFront(e.target.value)}
                placeholder="Recto (Question ou concept)..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                value={newFcBack}
                onChange={(e) => setNewFcBack(e.target.value)}
                placeholder="Verso (Réponse exacte)..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newFcFront.trim() || !newFcBack.trim()) return;
                  onUpdateCustomModule((cfg) => ({
                    ...cfg,
                    flashcards: [
                      ...cfg.flashcards,
                      {
                        id: `custom-fc-${Date.now()}`,
                        moduleId: 'personnalise',
                        chapterId: 'custom',
                        chapterTitle: cfg.title,
                        front: newFcFront.trim(),
                        back: newFcBack.trim(),
                      },
                    ],
                  }));
                  setNewFcFront('');
                  setNewFcBack('');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter la flashcard</span>
              </button>
            </div>

            {/* Add Custom QCM */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                Ajouter un QCM personnalisé
              </h3>
              <input
                type="text"
                value={newQcmQuestion}
                onChange={(e) => setNewQcmQuestion(e.target.value)}
                placeholder="Énoncé de la question..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <div className="space-y-1.5">
                {[
                  { label: 'A', val: newQcmOptA, set: setNewQcmOptA, idx: 0 },
                  { label: 'B', val: newQcmOptB, set: setNewQcmOptB, idx: 1 },
                  { label: 'C', val: newQcmOptC, set: setNewQcmOptC, idx: 2 },
                ].map((opt) => (
                  <div key={opt.label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="customQcmCorrect"
                      checked={newQcmCorrect === opt.idx}
                      onChange={() => setNewQcmCorrect(opt.idx)}
                      aria-label={`Bonne réponse ${opt.label}`}
                    />
                    <input
                      type="text"
                      value={opt.val}
                      onChange={(e) => opt.set(e.target.value)}
                      placeholder={`Proposition ${opt.label}`}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm"
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newQcmExp}
                onChange={(e) => setNewQcmExp(e.target.value)}
                placeholder="Explication de la correction..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const opts = [newQcmOptA, newQcmOptB, newQcmOptC].map((s) => s.trim());
                  if (!newQcmQuestion.trim() || opts.some((o) => !o)) return;
                  onUpdateCustomModule((cfg) => ({
                    ...cfg,
                    qcms: [
                      ...cfg.qcms,
                      {
                        id: `custom-qcm-${Date.now()}`,
                        moduleId: 'personnalise',
                        chapterId: 'custom',
                        chapterTitle: cfg.title,
                        type: 'single',
                        question: newQcmQuestion.trim(),
                        options: opts,
                        correctIndices: [newQcmCorrect],
                        explanation: newQcmExp.trim() || 'Réponse définie par l’étudiant.',
                        difficulty: 'Moyen',
                      },
                    ],
                  }));
                  setNewQcmQuestion('');
                  setNewQcmOptA('');
                  setNewQcmOptB('');
                  setNewQcmOptC('');
                  setNewQcmExp('');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter le QCM</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
