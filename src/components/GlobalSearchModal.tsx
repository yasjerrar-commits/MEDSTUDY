import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, FileText, Layers, ListChecks, Search, StickyNote, X } from 'lucide-react';
import { getAllFlashcards, getAllLessons, getAllQcms } from '../data/modulesRegistry';
import type { Lesson, MedicalModuleMeta, ModuleId, UserStudyState } from '../types/medstudy';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: MedicalModuleMeta[];
  state: UserStudyState;
  onOpenModule: (moduleId: ModuleId) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onStartQcm: (moduleId: ModuleId) => void;
  onStartFlashcards: (moduleId: ModuleId) => void;
  onOpenCourses: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  modules,
  state,
  onOpenModule,
  onOpenLesson,
  onStartQcm,
  onStartFlashcards,
  onOpenCourses,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const allLessons = getAllLessons(modules);
    const allQcms = getAllQcms(modules);
    const allFlashcards = getAllFlashcards(modules);

    const matchedModules = modules.filter(
      (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );

    const matchedChapters = modules.flatMap((m) =>
      m.chapters
        .filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
        .map((c) => ({ moduleId: m.id, moduleTitle: m.shortTitle, chapter: c }))
    );

    const matchedLessons = allLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.sections.some((s) => s.paragraphs.some((p) => p.toLowerCase().includes(q)))
    );

    const matchedDefinitions = allLessons.flatMap((l) =>
      l.keyDefinitions
        .filter(
          (d) => d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q)
        )
        .map((d) => ({ ...d, lesson: l }))
    );

    const matchedFlashcards = allFlashcards.filter(
      (f) => f.front.toLowerCase().includes(q) || f.back.toLowerCase().includes(q)
    );

    const matchedQcms = allQcms.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.explanation.toLowerCase().includes(q)
    );

    const matchedNotes = state.notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );

    const matchedCourses = state.uploadedCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.chapterName.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q)
    );

    return {
      matchedModules,
      matchedChapters,
      matchedLessons,
      matchedDefinitions,
      matchedFlashcards,
      matchedQcms,
      matchedNotes,
      matchedCourses,
    };
  }, [query, modules, state.notes, state.uploadedCourses]);

  if (!isOpen) return null;

  const totalHits = results
    ? results.matchedModules.length +
      results.matchedChapters.length +
      results.matchedLessons.length +
      results.matchedDefinitions.length +
      results.matchedFlashcards.length +
      results.matchedQcms.length +
      results.matchedNotes.length +
      results.matchedCourses.length
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs p-4 pt-12 md:pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-[#0D9488] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un module, chapitre, définition, QCM, flashcard ou note..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Fermer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {!results ? (
            <p className="text-xs text-slate-500 text-center py-8">
              Tapez un mot-clé médical (ex. « mitrale », « Poiseuille », « glycolyse », « Maroc », «
              bradycardie ») pour rechercher instantanément dans toute la plateforme.
            </p>
          ) : totalHits === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              Aucun résultat trouvé pour « {query} ».
            </p>
          ) : (
            <>
              {results.matchedModules.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Modules</p>
                  {results.matchedModules.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onOpenModule(m.id);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-[#0F2744] dark:text-white">
                        {m.title}
                      </span>
                      <span className="text-slate-500">{m.code}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.matchedChapters.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Chapitres</p>
                  {results.matchedChapters.slice(0, 5).map((item) => (
                    <button
                      key={item.chapter.id}
                      type="button"
                      onClick={() => {
                        onOpenModule(item.moduleId);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                    >
                      <span className="font-semibold text-[#0F2744] dark:text-white">
                        {item.chapter.title}
                      </span>{' '}
                      <span className="text-slate-500">· {item.moduleTitle}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.matchedLessons.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Leçons</p>
                  {results.matchedLessons.slice(0, 6).map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        onOpenLesson(l);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-100 truncate">
                        {l.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.matchedDefinitions.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Définitions</p>
                  {results.matchedDefinitions.slice(0, 5).map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onOpenLesson(d.lesson);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                    >
                      <span className="font-semibold text-[#0F2744] dark:text-teal-300">
                        {d.term} :
                      </span>{' '}
                      <span className="text-slate-600 dark:text-slate-400 line-clamp-1">
                        {d.definition}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.matchedFlashcards.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Flashcards</p>
                  {results.matchedFlashcards.slice(0, 5).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        onStartFlashcards(f.moduleId);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                      <span className="truncate">{f.front}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.matchedQcms.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">QCM</p>
                  {results.matchedQcms.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onStartQcm(item.moduleId);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <ListChecks className="w-3.5 h-3.5 text-[#0F2744] dark:text-teal-400 shrink-0" />
                      <span className="truncate">{item.question}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.matchedNotes.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Notes personnelles</p>
                  {results.matchedNotes.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs flex items-center gap-2"
                    >
                      <StickyNote className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-semibold">{n.title} :</span>
                      <span className="text-slate-600 dark:text-slate-300 truncate">
                        {n.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {results.matchedCourses.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 px-2">Cours importés</p>
                  {results.matchedCourses.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onOpenCourses();
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate">{c.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
