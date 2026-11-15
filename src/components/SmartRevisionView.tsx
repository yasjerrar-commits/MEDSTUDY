import React, { useMemo } from 'react';
import { AlertCircle, BookOpen, CalendarClock, Layers, ListChecks, TrendingDown } from 'lucide-react';
import { getAllFlashcards, getAllLessons, getAllQcms } from '../data/modulesRegistry';
import type { Lesson, MedicalModuleMeta, ModuleId, UserStudyState } from '../types/medstudy';

interface SmartRevisionViewProps {
  modules: MedicalModuleMeta[];
  state: UserStudyState;
  onOpenLesson: (lesson: Lesson) => void;
  onStartQcm: (moduleId?: ModuleId, filter?: 'all' | 'wrong') => void;
  onStartFlashcards: (moduleId?: ModuleId, filter?: 'due' | 'hard' | 'all') => void;
}

export const SmartRevisionView: React.FC<SmartRevisionViewProps> = ({
  modules,
  state,
  onOpenLesson,
  onStartQcm,
  onStartFlashcards,
}) => {
  const allLessons = useMemo(() => getAllLessons(modules), [modules]);
  const allQcms = useMemo(() => getAllQcms(modules), [modules]);
  const allFlashcards = useMemo(() => getAllFlashcards(modules), [modules]);
  const nowIso = new Date().toISOString();

  const unstudiedLessons = useMemo(
    () => allLessons.filter((l) => !state.completedLessonIds.includes(l.id)),
    [allLessons, state.completedLessonIds]
  );

  const missedQcms = useMemo(
    () =>
      allQcms
        .filter((q) => (state.wrongQcmCounts[q.id] || 0) > 0)
        .sort((a, b) => (state.wrongQcmCounts[b.id] || 0) - (state.wrongQcmCounts[a.id] || 0)),
    [allQcms, state.wrongQcmCounts]
  );

  const hardCards = useMemo(
    () =>
      allFlashcards.filter(
        (c) => state.flashcardProgress[c.id]?.difficultyRating === 'hard'
      ),
    [allFlashcards, state.flashcardProgress]
  );

  const dueCards = useMemo(
    () =>
      allFlashcards.filter((c) => {
        const srs = state.flashcardProgress[c.id];
        return !srs || srs.nextReviewAt <= nowIso;
      }),
    [allFlashcards, state.flashcardProgress, nowIso]
  );

  // Automatic weak module prioritization based on completion + QCM score + errors
  const prioritizedModules = useMemo(() => {
    return modules
      .map((mod) => {
        const lessons = mod.chapters.flatMap((c) => c.lessons);
        const done = lessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
        const lessonRatio = lessons.length > 0 ? done / lessons.length : 1;

        const modAttempts = state.qcmAttempts.filter((a) => a.moduleId === mod.id);
        const avgScore =
          modAttempts.length > 0
            ? modAttempts.reduce((s, a) => s + a.scorePercent, 0) / modAttempts.length
            : null;
        const modErrors = mod.qcms.reduce(
          (acc, q) => acc + (state.wrongQcmCounts[q.id] || 0),
          0
        );

        // Priority score: higher means needs more urgent attention
        const priorityScore =
          (1 - lessonRatio) * 50 +
          (avgScore !== null ? (100 - avgScore) * 0.5 : 25) +
          modErrors * 8;

        return {
          mod,
          lessonPct: lessons.length > 0 ? Math.round(lessonRatio * 100) : 0,
          avgScore: avgScore !== null ? Math.round(avgScore) : null,
          modErrors,
          priorityScore,
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [modules, state]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-[#0F2744] dark:text-white">
          Révision intelligente & Répétition espacée
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Votre programme est automatiquement priorisé selon vos leçons non étudiées, vos
          erreurs fréquentes aux QCM et vos flashcards difficiles.
        </p>

        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs text-slate-500">Leçons à découvrir</p>
            <p className="mt-1 text-xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
              {unstudiedLessons.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs text-slate-500">QCM ratés à revoir</p>
            <p className="mt-1 text-xl font-bold font-mono text-rose-600 tabular-nums">
              {missedQcms.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs text-slate-500">Concepts difficiles</p>
            <p className="mt-1 text-xl font-bold font-mono text-amber-600 tabular-nums">
              {hardCards.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs text-slate-500">Cartes dues aujourd’hui</p>
            <p className="mt-1 text-xl font-bold font-mono text-[#0D9488] tabular-nums">
              {dueCards.length}
            </p>
          </div>
        </div>
      </div>

      {/* Priority Modules */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-[#0D9488]" />
          <h2 className="text-base font-bold text-[#0F2744] dark:text-white">
            Matières priorisées automatiquement
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {prioritizedModules.map(({ mod, lessonPct, avgScore, modErrors }, idx) => (
            <div
              key={mod.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs text-slate-500">
                  Priorité {idx + 1} · Avancement cours : {lessonPct}% ·{' '}
                  {avgScore !== null ? `Moyenne QCM : ${avgScore}%` : 'Pas encore de QCM'} ·{' '}
                  {modErrors} erreur{modErrors > 1 ? 's' : ''} cumulée{modErrors > 1 ? 's' : ''}
                </p>
                <h3 className="text-sm font-semibold text-[#0F2744] dark:text-white">
                  {mod.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onStartFlashcards(mod.id, 'due')}
                  disabled={mod.flashcards.length === 0}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium disabled:opacity-40 cursor-pointer"
                >
                  Réviser cartes
                </button>
                <button
                  type="button"
                  onClick={() => onStartQcm(mod.id, 'all')}
                  disabled={mod.qcms.length === 0}
                  className="rounded-lg bg-[#0F2744] dark:bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 cursor-pointer"
                >
                  S’entraîner (QCM)
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unstudied Lessons */}
        <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0284C7]" />
            <h2 className="text-base font-bold text-[#0F2744] dark:text-white">
              Leçons non encore étudiées
            </h2>
          </div>
          {unstudiedLessons.length === 0 ? (
            <p className="text-xs text-slate-500">
              Toutes les leçons disponibles ont été marquées comme terminées.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {unstudiedLessons.slice(0, 6).map((l) => (
                <li key={l.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {l.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{l.estimatedMinutes} min</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenLesson(l)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                  >
                    Ouvrir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Frequently Missed QCMs & Hard Flashcards */}
        <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h2 className="text-base font-bold text-[#0F2744] dark:text-white">
                  Questions fréquemment ratées
                </h2>
              </div>
              {missedQcms.length > 0 && (
                <button
                  type="button"
                  onClick={() => onStartQcm(undefined, 'wrong')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Corriger ({missedQcms.length})</span>
                </button>
              )}
            </div>

            {missedQcms.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aucune erreur récurrente enregistrée. Réalisez des QCM pour alimenter cette liste.
              </p>
            ) : (
              <ul className="space-y-2">
                {missedQcms.slice(0, 4).map((q) => (
                  <li
                    key={q.id}
                    className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs flex items-start justify-between gap-3"
                  >
                    <span className="text-slate-700 dark:text-slate-200 line-clamp-2">
                      {q.question}
                    </span>
                    <span className="font-mono text-rose-600 shrink-0 tabular-nums">
                      {state.wrongQcmCounts[q.id]}× ratée
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#0D9488]" />
                <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
                  Flashcards difficiles & dues
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onStartFlashcards(undefined, hardCards.length > 0 ? 'hard' : 'due')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Lancer la session</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {hardCards.length} carte{hardCards.length > 1 ? 's' : ''} marquée
              {hardCards.length > 1 ? 's' : ''} « Difficile » et {dueCards.length} carte
              {dueCards.length > 1 ? 's' : ''} prête{dueCards.length > 1 ? 's' : ''} pour la
              répétition espacée aujourd’hui.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
