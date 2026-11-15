import React from 'react';
import {
  Activity,
  ArrowRight,
  Atom,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Dna,
  FlaskConical,
  FolderPlus,
  HeartPulse,
  Languages,
  Play,
  Target,
} from 'lucide-react';
import { getAllFlashcards, getAllLessons, getAllQcms } from '../data/modulesRegistry';
import { calculateStreakDays, getTodayKey } from '../hooks/useStudyStore';
import type { Lesson, MedicalModuleMeta, ModuleId, UserStudyState } from '../types/medstudy';

interface DashboardViewProps {
  modules: MedicalModuleMeta[];
  state: UserStudyState;
  onOpenModule: (moduleId: ModuleId) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onStartQcm: (moduleId?: ModuleId) => void;
  onOpenSmartRevision: () => void;
  onUpdateGoal: (minutes: number) => void;
}

const moduleIcons: Record<ModuleId, React.ComponentType<{ className?: string }>> = {
  anatomie: HeartPulse,
  biophysique: Atom,
  biochimie: FlaskConical,
  biologie: Dna,
  'sante-publique': Activity,
  terminologie: Languages,
  personnalise: FolderPlus,
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  modules,
  state,
  onOpenModule,
  onOpenLesson,
  onStartQcm,
  onOpenSmartRevision,
  onUpdateGoal,
}) => {
  const allLessons = getAllLessons(modules);
  const allQcms = getAllQcms(modules);
  const allFlashcards = getAllFlashcards(modules);

  const completedCount = state.completedLessonIds.filter((id) =>
    allLessons.some((l) => l.id === id)
  ).length;
  const totalLessons = allLessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const totalQcmAnswered = state.qcmAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const averageQcmScore =
    state.qcmAttempts.length > 0
      ? Math.round(
          state.qcmAttempts.reduce((acc, a) => acc + a.scorePercent, 0) /
            state.qcmAttempts.length
        )
      : null;

  const streakDays = calculateStreakDays(state.dailyActivity);
  const todayRec = state.dailyActivity[getTodayKey()];
  const todayMinutes = Math.round(todayRec?.minutesStudied || 0);
  const todayGoal = state.preferences.dailyGoalMinutes || 60;
  const goalPct = Math.min(100, Math.round((todayMinutes / todayGoal) * 100));

  // Upcoming / due flashcards count
  const nowIso = new Date().toISOString();
  const dueFlashcardsCount = allFlashcards.filter((card) => {
    const srs = state.flashcardProgress[card.id];
    if (!srs) return false;
    return srs.nextReviewAt <= nowIso;
  }).length;
  const hardFlashcardsCount = Object.values(state.flashcardProgress).filter(
    (s) => s.difficultyRating === 'hard'
  ).length;
  const unstudiedCount = totalLessons - completedCount;

  // Continue learning target
  const lastVisited = state.recentlyStudiedLessons[0];
  const continueLesson =
    (lastVisited && allLessons.find((l) => l.id === lastVisited.lessonId)) ||
    allLessons.find((l) => !state.completedLessonIds.includes(l.id)) ||
    allLessons[0];

  return (
    <div className="space-y-8">
      {/* Hero & Continue Learning Anchor */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#0D9488] dark:text-teal-400">
              1ère année de médecine · Espace d’apprentissage
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F2744] dark:text-white">
              Bonjour, prêt à apprendre aujourd&apos;hui ?
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Retrouvez vos six modules médicaux, vos séries de QCM, vos flashcards à répétition
              espacée et vos supports de cours universitaires en un seul endroit.
            </p>
          </div>

          {continueLesson && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpenLesson(continueLesson)}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-[#173961] dark:hover:bg-teal-500 transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continuer l’apprentissage</span>
              </button>
              <button
                type="button"
                onClick={() => onStartQcm()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer"
              >
                <span>Lancer un QCM rapide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Overall progress bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span>Progression globale du programme</span>
            <span className="font-mono font-semibold text-[#0F2744] dark:text-slate-200 tabular-nums">
              {overallProgress}% ({completedCount}/{totalLessons} leçons)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0D9488] transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* 4 Key Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Leçons terminées</p>
          <p className="mt-2 text-2xl font-bold text-[#0F2744] dark:text-white tabular-nums">
            {completedCount}{' '}
            <span className="text-sm font-normal text-slate-400">/ {totalLessons}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {unstudiedCount} restante{unstudiedCount > 1 ? 's' : ''}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">QCM complétés</p>
          <p className="mt-2 text-2xl font-bold text-[#0F2744] dark:text-white tabular-nums">
            {totalQcmAnswered}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Banque active : {allQcms.length} questions
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Score moyen aux QCM</p>
          <p className="mt-2 text-2xl font-bold text-[#0D9488] dark:text-teal-400 tabular-nums">
            {averageQcmScore !== null ? `${averageQcmScore}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {state.qcmAttempts.length > 0
              ? `Sur ${state.qcmAttempts.length} session${state.qcmAttempts.length > 1 ? 's' : ''}`
              : 'Aucune session enregistrée'}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Série quotidienne</p>
          <p className="mt-2 text-2xl font-bold text-[#0F2744] dark:text-white tabular-nums">
            {streakDays} jour{streakDays > 1 ? 's' : ''}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Aujourd’hui : {todayMinutes} min étudiées
          </p>
        </div>
      </section>

      {/* Seven Medical Modules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#0F2744] dark:text-white">
            Les modules médicaux
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Cliquez sur un module pour accéder aux chapitres, flashcards et QCM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = moduleIcons[mod.id] || BookOpen;
            const modLessons = mod.chapters.flatMap((c) => c.lessons);
            const modCompleted = modLessons.filter((l) =>
              state.completedLessonIds.includes(l.id)
            ).length;
            const modPct =
              modLessons.length > 0 ? Math.round((modCompleted / modLessons.length) * 100) : 0;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onOpenModule(mod.id)}
                className="group text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${mod.accentHex}15`,
                        color: mod.accentHex,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                      {mod.code}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[#0F2744] dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-teal-400 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span>
                      {mod.chapters.length} chapitre{mod.chapters.length > 1 ? 's' : ''} ·{' '}
                      {mod.qcms.length} QCM
                    </span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                      {modPct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${modPct}%`,
                        backgroundColor: mod.accentHex,
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom 3-column Utility Row: Daily Goal, Recently Studied, Upcoming Revision Reminders */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Goal */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0D9488]" />
                <h3 className="text-sm font-semibold text-[#0F2744] dark:text-white">
                  Objectif d’étude quotidien
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {todayMinutes} / {todayGoal} min
              </span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0284C7] transition-all"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              {goalPct >= 100
                ? 'Objectif quotidien atteint. Excellent travail !'
                : `Il reste ${Math.max(0, todayGoal - todayMinutes)} min pour atteindre votre objectif du jour.`}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Ajuster la cible :</span>
            <div className="flex items-center gap-1">
              {[30, 60, 90, 120].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onUpdateGoal(m)}
                  className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                    todayGoal === m
                      ? 'bg-[#0F2744] text-white dark:bg-teal-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Studied Lessons */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#0284C7]" />
            <h3 className="text-sm font-semibold text-[#0F2744] dark:text-white">
              Leçons récemment étudiées
            </h3>
          </div>
          {state.recentlyStudiedLessons.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed py-4">
              Vous n’avez encore ouvert aucune leçon. Choisissez un module ci-dessus pour
              commencer votre première session d’étude.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {state.recentlyStudiedLessons.slice(0, 4).map((item) => {
                const targetLesson = allLessons.find((l) => l.id === item.lessonId);
                if (!targetLesson) return null;
                const isDone = state.completedLessonIds.includes(item.lessonId);
                return (
                  <li key={item.lessonId}>
                    <button
                      type="button"
                      onClick={() => onOpenLesson(targetLesson)}
                      className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:text-[#0D9488] transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Upcoming Revision Reminders */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="w-4 h-4 text-[#0D9488]" />
              <h3 className="text-sm font-semibold text-[#0F2744] dark:text-white">
                Rappels de révision à venir
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Cartes dues (répétition espacée)</span>
                <span className="font-mono font-semibold tabular-nums">{dueFlashcardsCount}</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Concepts marqués difficiles</span>
                <span className="font-mono font-semibold tabular-nums">{hardFlashcardsCount}</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>QCM avec erreurs passées</span>
                <span className="font-mono font-semibold tabular-nums">
                  {Object.keys(state.wrongQcmCounts).length}
                </span>
              </li>
              <li className="flex items-center justify-between py-1">
                <span>Leçons non encore étudiées</span>
                <span className="font-mono font-semibold tabular-nums">{unstudiedCount}</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={onOpenSmartRevision}
            className="mt-4 w-full rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-[#0F2744] dark:text-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px]"
          >
            Ouvrir la révision intelligente
          </button>
        </div>
      </section>
    </div>
  );
};
