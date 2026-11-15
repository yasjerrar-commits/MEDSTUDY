import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  Maximize2,
  Minimize2,
  Search,
  StickyNote,
  Trash2,
} from 'lucide-react';
import type {
  Lesson,
  LessonHighlight,
  MedicalModuleMeta,
  ModuleId,
  PersonalNote,
  UserPreferences,
  UserStudyState,
} from '../types/medstudy';

interface LessonReaderProps {
  lesson: Lesson;
  module: MedicalModuleMeta;
  state: UserStudyState;
  onBack: () => void;
  onToggleCompleted: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onUpdateFontSize: (size: UserPreferences['readerFontSize']) => void;
  onToggleHighlight: (item: Omit<LessonHighlight, 'id' | 'createdAt'>) => void;
  onSaveNote: (note: Omit<PersonalNote, 'id' | 'updatedAt'> & { id?: string }) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onStartChapterQcm: (moduleId: ModuleId, chapterId: string) => void;
}

const fontSizes: Record<UserPreferences['readerFontSize'], string> = {
  sm: 'text-sm leading-relaxed',
  md: 'text-base leading-7',
  lg: 'text-lg leading-8',
  xl: 'text-xl leading-9',
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, idx) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={idx}
        className="bg-amber-200 dark:bg-amber-700/70 text-slate-900 dark:text-white px-0.5 rounded-xs"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  module,
  state,
  onBack,
  onToggleCompleted,
  onToggleBookmark,
  onUpdateFontSize,
  onToggleHighlight,
  onSaveNote,
  onDeleteNote,
  onOpenLesson,
  onStartChapterQcm,
}) => {
  const [focusMode, setFocusMode] = useState(false);
  const [inLessonQuery, setInLessonQuery] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [highlightMode, setHighlightMode] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const articleRef = useRef<HTMLDivElement>(null);

  const isCompleted = state.completedLessonIds.includes(lesson.id);
  const isBookmarked = state.bookmarkedLessonIds.includes(lesson.id);
  const fontSize = state.preferences.readerFontSize;

  const lessonNotes = useMemo(
    () => state.notes.filter((n) => n.lessonId === lesson.id),
    [state.notes, lesson.id]
  );

  const lessonHighlights = useMemo(
    () => state.highlights.filter((h) => h.lessonId === lesson.id),
    [state.highlights, lesson.id]
  );

  const allModuleLessons = useMemo(
    () => module.chapters.flatMap((c) => c.lessons),
    [module]
  );
  const currentIdx = allModuleLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? allModuleLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < allModuleLessons.length - 1
      ? allModuleLessons[currentIdx + 1]
      : null;

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollPct(100);
      } else {
        setScrollPct(Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100))));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [lesson.id]);

  const matchCount = useMemo(() => {
    const q = inLessonQuery.trim().toLowerCase();
    if (!q) return 0;
    let count = 0;
    const scan = (s: string) => {
      let pos = 0;
      const low = s.toLowerCase();
      while ((pos = low.indexOf(q, pos)) !== -1) {
        count++;
        pos += q.length;
      }
    };
    lesson.sections.forEach((sec) => {
      scan(sec.title);
      sec.paragraphs.forEach(scan);
      sec.bulletPoints?.forEach(scan);
    });
    return count;
  }, [inLessonQuery, lesson]);

  return (
    <div className={focusMode ? 'fixed inset-0 z-50 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B1120] p-4 md:p-8' : 'space-y-6'}>
      {/* Sticky Reader Toolbar */}
      <div className="sticky top-0 z-20 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={focusMode ? () => setFocusMode(false) : onBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0F2744] dark:hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{focusMode ? 'Quitter le mode lecture' : `Retour à ${module.shortTitle}`}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search inside lesson */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inLessonQuery}
                onChange={(e) => setInLessonQuery(e.target.value)}
                placeholder="Chercher dans le cours..."
                className="w-40 sm:w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
              {inLessonQuery.trim() && (
                <span className="ml-1.5 text-[11px] font-mono text-slate-500 tabular-nums">
                  {matchCount}
                </span>
              )}
            </div>

            {/* Font size switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz, i) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdateFontSize(sz)}
                  className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    fontSize === sz
                      ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                  title="Ajuster la taille du texte"
                >
                  {['A-', 'A', 'A+', 'A++'][i]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setHighlightMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                highlightMode
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Activer le mode surligneur puis cliquez sur un paragraphe"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Surligner</span>
            </button>

            <button
              type="button"
              onClick={() => setShowNotesPanel((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                showNotesPanel
                  ? 'border-[#0D9488] bg-teal-50 dark:bg-teal-950/40 text-[#0D9488]'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes ({lessonNotes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(lesson.id)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title={isBookmarked ? 'Retirer des favoris' : 'Ajouter aux signets'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-[#0D9488]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setFocusMode((v) => !v)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title={focusMode ? 'Vue normale' : 'Mode lecture sans distraction'}
            >
              {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-[#0D9488] transition-all duration-150"
              style={{ width: `${scrollPct}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">{scrollPct}%</span>
        </div>
      </div>

      {highlightMode && (
        <div className="max-w-4xl mx-auto rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
          Mode surligneur actif : cliquez sur n’importe quel paragraphe ou point clé pour le
          surligner ou retirer le surlignage.
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lesson Document */}
        <article
          ref={articleRef}
          className={`${showNotesPanel ? 'lg:col-span-8' : 'lg:col-span-12'} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-10 space-y-8`}
        >
          <header className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {module.title} · {lesson.difficulty} · {lesson.estimatedMinutes} min de lecture
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F2744] dark:text-white">
              {lesson.title}
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              {lesson.subtitle}
            </p>
          </header>

          {/* Key Definitions */}
          {lesson.keyDefinitions.length > 0 && (
            <section className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#0F2744] dark:text-teal-300">
                Définitions fondamentales
              </h2>
              <dl className="space-y-2.5 text-sm">
                {lesson.keyDefinitions.map((def, i) => (
                  <div key={i}>
                    <dt className="font-semibold text-slate-900 dark:text-white">{def.term}</dt>
                    <dd className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {highlightMatch(def.definition, inLessonQuery)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Sections */}
          <div className="space-y-8">
            {lesson.sections.map((sec) => (
              <section key={sec.id} className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold text-[#0F2744] dark:text-white">
                  {highlightMatch(sec.title, inLessonQuery)}
                </h2>

                {sec.paragraphs.map((p, idx) => {
                  const isHighlighted = lessonHighlights.some(
                    (h) => h.sectionId === sec.id && h.text === p
                  );
                  return (
                    <p
                      key={idx}
                      onClick={() => {
                        if (highlightMode) {
                          onToggleHighlight({
                            lessonId: lesson.id,
                            sectionId: sec.id,
                            text: p,
                            color: 'amber',
                          });
                        }
                      }}
                      className={`${fontSizes[fontSize]} text-slate-700 dark:text-slate-300 ${
                        highlightMode ? 'cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-md px-2 -mx-2' : ''
                      } ${
                        isHighlighted
                          ? 'bg-amber-100/80 dark:bg-amber-900/35 px-2.5 py-1.5 rounded-lg'
                          : ''
                      }`}
                    >
                      {highlightMatch(p, inLessonQuery)}
                    </p>
                  );
                })}

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className={`space-y-2 pl-5 list-disc text-slate-700 dark:text-slate-300 ${fontSizes[fontSize]}`}>
                    {sec.bulletPoints.map((bp, idx) => {
                      const isHighlighted = lessonHighlights.some(
                        (h) => h.sectionId === sec.id && h.text === bp
                      );
                      return (
                        <li
                          key={idx}
                          onClick={() => {
                            if (highlightMode) {
                              onToggleHighlight({
                                lessonId: lesson.id,
                                sectionId: sec.id,
                                text: bp,
                                color: 'teal',
                              });
                            }
                          }}
                          className={`${highlightMode ? 'cursor-pointer' : ''} ${
                            isHighlighted
                              ? 'bg-teal-100/70 dark:bg-teal-900/35 px-2 py-0.5 rounded-md'
                              : ''
                          }`}
                        >
                          {highlightMatch(bp, inLessonQuery)}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {sec.formula && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-5 space-y-3">
                    <div className="font-mono text-base md:text-lg font-semibold text-[#0F2744] dark:text-teal-300 overflow-x-auto">
                      {sec.formula.expression}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {sec.formula.variables.map((v, idx) => (
                        <div key={idx}>
                          <strong className="font-mono text-slate-800 dark:text-white">
                            {v.symbol}
                          </strong>{' '}
                          : {v.meaning} {v.unit ? `(${v.unit})` : ''}
                        </div>
                      ))}
                    </div>
                    {sec.formula.note && (
                      <p className="text-xs text-[#0D9488] dark:text-teal-400 font-medium">
                        {sec.formula.note}
                      </p>
                    )}
                  </div>
                )}

                {sec.table && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    {sec.table.caption && (
                      <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                        {sec.table.caption}
                      </div>
                    )}
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200">
                        <tr>
                          {sec.table.headers.map((h, i) => (
                            <th key={i} className="px-4 py-2.5 font-semibold border-b border-slate-200 dark:border-slate-700">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-2.5 text-slate-700 dark:text-slate-300 align-top">
                                {highlightMatch(cell, inLessonQuery)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {sec.image && (
                  <figure className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white">
                    {!failedImages[sec.id] ? (
                      <img
                        src={sec.image.src}
                        alt={sec.image.alt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [sec.id]: true }))
                        }
                        className="w-full max-h-96 object-contain mx-auto p-3"
                      />
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-500 bg-slate-50">
                        Schéma anatomique : {sec.image.alt}
                      </div>
                    )}
                    <figcaption className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      {sec.image.caption}
                    </figcaption>
                  </figure>
                )}
              </section>
            ))}
          </div>

          {/* Exam Tips */}
          {lesson.examTips.length > 0 && (
            <section className="rounded-xl bg-teal-50/70 dark:bg-teal-950/25 border border-teal-200 dark:border-teal-800/60 p-5 space-y-2">
              <h3 className="text-sm font-bold text-[#0F2744] dark:text-teal-300">
                Conseils méthodologiques pour l’examen
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                {lesson.examTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Footer Completion & Navigation */}
          <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onToggleCompleted(lesson.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#0F2744] dark:bg-teal-600 text-white hover:bg-[#173961] dark:hover:bg-teal-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCompleted ? 'Leçon terminée (cliquer pour annuler)' : 'Marquer la leçon comme terminée'}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStartChapterQcm(module.id, lesson.chapterId)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-[#0F2744] dark:text-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tester mes connaissances (QCM)
              </button>
              {prevLesson && (
                <button
                  type="button"
                  onClick={() => onOpenLesson(prevLesson)}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  title={`Précédent : ${prevLesson.title}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {nextLesson && (
                <button
                  type="button"
                  onClick={() => onOpenLesson(nextLesson)}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  title={`Suivant : ${nextLesson.title}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </footer>
        </article>

        {/* Personal Notes Panel */}
        {showNotesPanel && (
          <aside className="lg:col-span-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 h-fit lg:sticky lg:top-24">
            <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
              Notes personnelles sur ce cours
            </h3>
            <div className="space-y-2.5">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Titre de la note..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
              />
              <textarea
                rows={4}
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Vos remarques, moyens mnémotechniques..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!noteBody.trim()) return;
                  onSaveNote({
                    moduleId: module.id,
                    chapterId: lesson.chapterId,
                    lessonId: lesson.id,
                    title: noteTitle.trim() || lesson.title,
                    content: noteBody.trim(),
                  });
                  setNoteTitle('');
                  setNoteBody('');
                }}
                className="w-full rounded-lg bg-[#0D9488] py-2 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer"
              >
                Enregistrer la note
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {lessonNotes.length === 0 ? (
                <p className="text-xs text-slate-500">Aucune note enregistrée pour cette leçon.</p>
              ) : (
                lessonNotes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-lg bg-slate-50 dark:bg-slate-800/70 p-3 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {n.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(n.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label="Supprimer la note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
