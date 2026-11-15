import React, { useMemo } from 'react';
import { BarChart3, CheckCircle2, Clock, Award, TrendingUp } from 'lucide-react';
import { getAllLessons } from '../data/modulesRegistry';
import type { MedicalModuleMeta, UserStudyState } from '../types/medstudy';

interface StatisticsViewProps {
  modules: MedicalModuleMeta[];
  state: UserStudyState;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ modules, state }) => {
  const allLessons = useMemo(() => getAllLessons(modules), [modules]);
  const completedLessons = state.completedLessonIds.filter((id) =>
    allLessons.some((l) => l.id === id)
  ).length;

  const totalStudySeconds = Object.values(state.studySecondsByModule).reduce(
    (acc, s) => acc + s,
    0
  );
  const totalStudyMinutes = Math.round(totalStudySeconds / 60);

  const totalQcmQuestions = state.qcmAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const totalQcmCorrect = state.qcmAttempts.reduce((acc, a) => acc + a.correctCount, 0);
  const successRate =
    totalQcmQuestions > 0 ? Math.round((totalQcmCorrect / totalQcmQuestions) * 100) : null;

  // Last 7 days real activity
  const weeklyDays = useMemo(() => {
    const out: { label: string; date: string; minutes: number; qcms: number }[] = [];
    const today = new Date();
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const rec = state.dailyActivity[key];
      out.push({
        label: dayNames[d.getDay()],
        date: key,
        minutes: Math.round(rec?.minutesStudied || 0),
        qcms: rec?.qcmsAnswered || 0,
      });
    }
    return out;
  }, [state.dailyActivity]);

  const maxWeeklyMinutes = Math.max(30, ...weeklyDays.map((d) => d.minutes));

  // Chapter performance ranking based on real QCM & completion data
  const chapterMetrics = useMemo(() => {
    return modules.flatMap((mod) =>
      mod.chapters.map((ch) => {
        const chQcms = mod.qcms.filter((q) => q.chapterId === ch.id);
        const errorSum = chQcms.reduce((s, q) => s + (state.wrongQcmCounts[q.id] || 0), 0);
        const doneLessons = ch.lessons.filter((l) =>
          state.completedLessonIds.includes(l.id)
        ).length;
        const completion =
          ch.lessons.length > 0 ? Math.round((doneLessons / ch.lessons.length) * 100) : 0;
        const attempts = state.qcmAttempts.filter((a) => a.chapterId === ch.id);
        const avg =
          attempts.length > 0
            ? Math.round(attempts.reduce((s, a) => s + a.scorePercent, 0) / attempts.length)
            : null;
        return {
          id: ch.id,
          moduleTitle: mod.shortTitle,
          chapterTitle: ch.title,
          completion,
          errorSum,
          avg,
        };
      })
    );
  }, [modules, state]);

  const weakestChapters = [...chapterMetrics]
    .sort((a, b) => b.errorSum - a.errorSum || a.completion - b.completion)
    .slice(0, 4);

  const strongestChapters = [...chapterMetrics]
    .filter((c) => c.completion > 0 || c.avg !== null)
    .sort((a, b) => (b.avg ?? b.completion) - (a.avg ?? a.completion))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-[#0F2744] dark:text-white">
          Statistiques & Suivi de progression
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Analyse en temps réel de votre temps d’étude, de vos résultats aux QCM et de la maîtrise
          de chaque chapitre.
        </p>

        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Temps d’étude total</span>
            </div>
            <p className="mt-1.5 text-2xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
              {totalStudyMinutes} min
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Leçons terminées</span>
            </div>
            <p className="mt-1.5 text-2xl font-bold font-mono text-[#0D9488] tabular-nums">
              {completedLessons} / {allLessons.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>QCM répondus</span>
            </div>
            <p className="mt-1.5 text-2xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
              {totalQcmQuestions}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Award className="w-3.5 h-3.5" />
              <span>Taux de réussite global</span>
            </div>
            <p className="mt-1.5 text-2xl font-bold font-mono text-[#0284C7] tabular-nums">
              {successRate !== null ? `${successRate}%` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Activity SVG Chart + Time & Score by Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0D9488]" />
            <h2 className="text-base font-bold text-[#0F2744] dark:text-white">
              Activité des 7 derniers jours
            </h2>
          </div>

          <div className="pt-2">
            <svg viewBox="0 0 350 160" className="w-full h-44" role="img" aria-label="Graphique d’activité hebdomadaire">
              {weeklyDays.map((day, idx) => {
                const barH = Math.max(4, Math.round((day.minutes / maxWeeklyMinutes) * 105));
                const x = idx * 48 + 14;
                const y = 125 - barH;
                return (
                  <g key={day.date}>
                    <rect
                      x={x}
                      y={y}
                      width={26}
                      height={barH}
                      rx={5}
                      className={day.minutes > 0 ? 'fill-[#0D9488]' : 'fill-slate-200 dark:fill-slate-800'}
                    />
                    <text
                      x={x + 13}
                      y={144}
                      textAnchor="middle"
                      className="fill-slate-500 text-[10px]"
                    >
                      {day.label}
                    </text>
                    <text
                      x={x + 13}
                      y={y - 5}
                      textAnchor="middle"
                      className="fill-slate-600 dark:fill-slate-300 text-[9px] font-mono"
                    >
                      {day.minutes > 0 ? `${day.minutes}m` : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0F2744] dark:text-white">
            Temps d’étude et score moyen par module
          </h2>
          <div className="space-y-3">
            {modules.map((mod) => {
              const mins = Math.round((state.studySecondsByModule[mod.id] || 0) / 60);
              const modAtt = state.qcmAttempts.filter((a) => a.moduleId === mod.id);
              const avg =
                modAtt.length > 0
                  ? Math.round(modAtt.reduce((s, a) => s + a.scorePercent, 0) / modAtt.length)
                  : null;
              const modLessons = mod.chapters.flatMap((c) => c.lessons);
              const modDone = modLessons.filter((l) =>
                state.completedLessonIds.includes(l.id)
              ).length;
              const pct = modLessons.length > 0 ? Math.round((modDone / modLessons.length) * 100) : 0;

              return (
                <div key={mod.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0F2744] dark:text-white">
                      {mod.title}
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                      {mins} min · {avg !== null ? `Score : ${avg}%` : 'Pas de QCM'} · {pct}% lu
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: mod.accentHex }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weakest vs Strongest Chapters + Revision History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
            Chapitres à consolider
          </h3>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {weakestChapters.map((c) => (
              <li key={c.id} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.chapterTitle}
                  </p>
                  <p className="text-slate-500">{c.moduleTitle}</p>
                </div>
                <span className="font-mono text-rose-600 tabular-nums">
                  {c.errorSum > 0 ? `${c.errorSum} err.` : `${c.completion}%`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
            Chapitres les mieux maîtrisés
          </h3>
          {strongestChapters.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">
              Terminez une leçon ou un QCM pour identifier vos points forts.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {strongestChapters.map((c) => (
                <li key={c.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {c.chapterTitle}
                    </p>
                    <p className="text-slate-500">{c.moduleTitle}</p>
                  </div>
                  <span className="font-mono text-emerald-600 tabular-nums">
                    {c.avg !== null ? `${c.avg}%` : `${c.completion}%`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
            Historique récent des QCM
          </h3>
          {state.qcmAttempts.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">
              Aucune session de QCM enregistrée pour l’instant.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {state.qcmAttempts.slice(0, 6).map((att) => (
                <li key={att.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                      {att.title}
                    </p>
                    <p className="text-slate-500">
                      {new Date(att.completedAt).toLocaleDateString('fr-FR')} ·{' '}
                      {att.correctCount}/{att.totalQuestions}
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-[#0D9488] tabular-nums">
                    {att.scorePercent}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
