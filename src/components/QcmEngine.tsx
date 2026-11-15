import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Star,
  XCircle,
} from 'lucide-react';
import { getAllQcms } from '../data/modulesRegistry';
import type {
  MedicalModuleMeta,
  ModuleId,
  QcmAttempt,
  QcmQuestion,
  UserStudyState,
} from '../types/medstudy';

interface QcmEngineProps {
  modules: MedicalModuleMeta[];
  state: UserStudyState;
  initialModuleId?: ModuleId | 'all';
  initialChapterId?: string;
  initialFilter?: 'all' | 'wrong' | 'favorites';
  onRecordAttempt: (attempt: Omit<QcmAttempt, 'id' | 'completedAt'>) => void;
  onToggleFavorite: (qcmId: string) => void;
}

interface PreparedQuestion {
  original: QcmQuestion;
  shuffledOptions: { text: string; isCorrect: boolean }[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const QcmEngine: React.FC<QcmEngineProps> = ({
  modules,
  state,
  initialModuleId = 'all',
  initialChapterId = '',
  initialFilter = 'all',
  onRecordAttempt,
  onToggleFavorite,
}) => {
  const allQuestions = useMemo(() => getAllQcms(modules), [modules]);

  const [selectedModule, setSelectedModule] = useState<ModuleId | 'all'>(initialModuleId);
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId);
  const [filterKind, setFilterKind] = useState<'all' | 'wrong' | 'favorites'>(initialFilter);
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [correctionMode, setCorrectionMode] = useState<'instant' | 'end'>('instant');
  const [randomizeQ, setRandomizeQ] = useState(true);
  const [randomizeOpts, setRandomizeOpts] = useState(true);
  const [examMinutes, setExamMinutes] = useState(10);

  // Active session state
  const [phase, setPhase] = useState<'setup' | 'running' | 'results'>('setup');
  const [prepared, setPrepared] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const selectedModMeta = modules.find((m) => m.id === selectedModule);

  const matchingPool = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedModule !== 'all' && q.moduleId !== selectedModule) return false;
      if (selectedChapter && q.chapterId !== selectedChapter) return false;
      if (filterKind === 'wrong' && !(state.wrongQcmCounts[q.id] > 0)) return false;
      if (filterKind === 'favorites' && !state.favoriteQcmIds.includes(q.id)) return false;
      return true;
    });
  }, [allQuestions, selectedModule, selectedChapter, filterKind, state.wrongQcmCounts, state.favoriteQcmIds]);

  // Timer when running
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // Auto-submit in timed exam mode
  useEffect(() => {
    if (phase === 'running' && mode === 'exam' && elapsedSeconds >= examMinutes * 60) {
      finishQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds, phase, mode, examMinutes]);

  const startSession = (customPool?: QcmQuestion[]) => {
    const source = customPool || matchingPool;
    if (source.length === 0) return;

    const ordered = randomizeQ ? shuffleArray(source) : [...source];
    const prep: PreparedQuestion[] = ordered.map((q) => {
      const tagged = q.options.map((text, idx) => ({
        text,
        isCorrect: q.correctIndices.includes(idx),
      }));
      // Keep Vrai / Faux natural order for boolean questions
      const opts =
        randomizeOpts && q.type !== 'boolean' ? shuffleArray(tagged) : tagged;
      return { original: q, shuffledOptions: opts };
    });

    setPrepared(prep);
    setCurrentIndex(0);
    setUserAnswers({});
    setRevealedIds({});
    setElapsedSeconds(0);
    setPhase('running');
  };

  const isQuestionCorrect = (pq: PreparedQuestion, chosen: number[] = []) => {
    const expected = pq.shuffledOptions
      .map((o, i) => (o.isCorrect ? i : -1))
      .filter((i) => i !== -1);
    if (chosen.length !== expected.length) return false;
    return expected.every((idx) => chosen.includes(idx));
  };

  const finishQuiz = () => {
    let correctCount = 0;
    const wrongQuestionIds: string[] = [];

    prepared.forEach((pq) => {
      const chosen = userAnswers[pq.original.id] || [];
      if (isQuestionCorrect(pq, chosen)) {
        correctCount++;
      } else {
        wrongQuestionIds.push(pq.original.id);
      }
    });

    const total = prepared.length;
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    onRecordAttempt({
      moduleId: selectedModule === 'all' ? 'mixed' : selectedModule,
      chapterId: selectedChapter || undefined,
      title:
        selectedModule === 'all'
          ? 'QCM Transversal (Tous modules)'
          : selectedModMeta?.title || 'QCM',
      mode,
      totalQuestions: total,
      correctCount,
      scorePercent,
      durationSeconds: Math.max(1, elapsedSeconds),
      wrongQuestionIds,
    });

    setPhase('results');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2744] dark:text-white">
              Système d’entraînement QCM
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Configurez votre série de questions à choix unique, multiple, vrai/faux ou sur
              schémas anatomiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-xs space-y-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Module</span>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value as ModuleId | 'all');
                  setSelectedChapter('');
                }}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm"
              >
                <option value="all">Tous les modules ({allQuestions.length} questions)</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.qcms.length})
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs space-y-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Chapitre</span>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                disabled={selectedModule === 'all'}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm disabled:opacity-50"
              >
                <option value="">Tous les chapitres du module</option>
                {selectedModMeta?.chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Filter segment */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Sélection des questions
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Toutes les questions' },
                {
                  id: 'wrong',
                  label: `Erreurs fréquentes (${Object.keys(state.wrongQcmCounts).length})`,
                },
                { id: 'favorites', label: `Favoris (${state.favoriteQcmIds.length})` },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilterKind(item.id as typeof filterKind)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    filterKind === item.id
                      ? 'bg-[#0F2744] text-white dark:bg-teal-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modes & Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Mode de passage
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('practice');
                    setCorrectionMode('instant');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                    mode === 'practice'
                      ? 'border-[#0D9488] bg-teal-50 dark:bg-teal-950/40 text-[#0D9488]'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Entraînement libre
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('exam');
                    setCorrectionMode('end');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                    mode === 'exam'
                      ? 'border-[#0F2744] bg-slate-100 dark:bg-slate-800 text-[#0F2744] dark:text-white'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Examen chronométré
                </button>
              </div>
              {mode === 'exam' && (
                <label className="block text-xs pt-1">
                  <span>Durée limite (minutes) : </span>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={examMinutes}
                    onChange={(e) => setExamMinutes(Math.max(1, Number(e.target.value)))}
                    className="ml-2 w-16 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 font-mono"
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Affichage des corrections & ordre
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectionMode('instant')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border cursor-pointer ${
                    correctionMode === 'instant'
                      ? 'border-[#0D9488] bg-teal-50 dark:bg-teal-950/40 text-[#0D9488]'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Correction immédiate
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectionMode('end')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border cursor-pointer ${
                    correctionMode === 'end'
                      ? 'border-[#0D9488] bg-teal-50 dark:bg-teal-950/40 text-[#0D9488]'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Correction à la fin
                </button>
              </div>
              <div className="flex flex-wrap gap-4 pt-1 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeQ}
                    onChange={(e) => setRandomizeQ(e.target.checked)}
                    className="accent-[#0D9488]"
                  />
                  <span>Mélanger les questions</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeOpts}
                    onChange={(e) => setRandomizeOpts(e.target.checked)}
                    className="accent-[#0D9488]"
                  />
                  <span>Mélanger les propositions</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong className="font-mono tabular-nums">{matchingPool.length}</strong> question
              {matchingPool.length > 1 ? 's' : ''} prête{matchingPool.length > 1 ? 's' : ''} pour
              cette session
            </p>
            <button
              type="button"
              disabled={matchingPool.length === 0}
              onClick={() => startSession()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-[#173961] dark:hover:bg-teal-500 disabled:opacity-40 cursor-pointer min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Démarrer le QCM</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const total = prepared.length;
    const correctCount = prepared.filter((pq) =>
      isQuestionCorrect(pq, userAnswers[pq.original.id] || [])
    ).length;
    const wrongCount = total - correctCount;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const wrongQuestions = prepared
      .filter((pq) => !isQuestionCorrect(pq, userAnswers[pq.original.id] || []))
      .map((pq) => pq.original);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#0D9488]">Bilan de votre session QCM</p>
              <h1 className="mt-1 text-2xl font-bold text-[#0F2744] dark:text-white">
                Résultat final : {pct}%
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {wrongQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => startSession(wrongQuestions)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-[#0F2744] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retravailler mes erreurs ({wrongQuestions.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Nouvelle série
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">Score</p>
              <p className="mt-1 text-xl font-bold font-mono text-[#0F2744] dark:text-white tabular-nums">
                {correctCount} / {total}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">Réussite</p>
              <p className="mt-1 text-xl font-bold font-mono text-[#0D9488] tabular-nums">
                {pct}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">Erreurs à réviser</p>
              <p className="mt-1 text-xl font-bold font-mono text-rose-600 tabular-nums">
                {wrongCount}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">Temps passé</p>
              <p className="mt-1 text-xl font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                {formatTimer(elapsedSeconds)}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Corrections */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0F2744] dark:text-white">
            Correction détaillée question par question
          </h2>
          {prepared.map((pq, idx) => {
            const chosen = userAnswers[pq.original.id] || [];
            const ok = isQuestionCorrect(pq, chosen);
            const isFav = state.favoriteQcmIds.includes(pq.original.id);
            return (
              <div
                key={pq.original.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-slate-500">Question {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className={ok ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                        {ok ? 'Réponse exacte' : 'À réviser'}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-[#0F2744] dark:text-white">
                      {pq.original.question}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(pq.original.id)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
                    title="Enregistrer en favori"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {pq.shuffledOptions.map((opt, oIdx) => {
                    const wasChosen = chosen.includes(oIdx);
                    return (
                      <li
                        key={oIdx}
                        className={`rounded-lg px-3 py-2 text-xs md:text-sm border flex items-center justify-between gap-2 ${
                          opt.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : wasChosen
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <span className="shrink-0 font-medium">
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : wasChosen ? (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/80 p-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Explication :</strong> {pq.original.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // RUNNING PHASE
  const active = prepared[currentIndex];
  const q = active.original;
  const chosen = userAnswers[q.id] || [];
  const isRevealed = !!revealedIds[q.id];
  const isFav = state.favoriteQcmIds.includes(q.id);
  const remainingSec = Math.max(0, examMinutes * 60 - elapsedSeconds);

  const toggleOption = (optIdx: number) => {
    if (isRevealed) return;
    setUserAnswers((prev) => {
      const current = prev[q.id] || [];
      if (q.type === 'multiple') {
        const next = current.includes(optIdx)
          ? current.filter((i) => i !== optIdx)
          : [...current, optIdx];
        return { ...prev, [q.id]: next };
      }
      return { ...prev, [q.id]: [optIdx] };
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top Runner Status */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-600 dark:text-slate-300">
          Question{' '}
          <strong className="font-mono text-[#0F2744] dark:text-white tabular-nums">
            {currentIndex + 1} / {prepared.length}
          </strong>{' '}
          · {q.chapterTitle}
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-200 tabular-nums">
            <Clock className="w-4 h-4 text-[#0D9488]" />
            <span>
              {mode === 'exam'
                ? `Reste ${formatTimer(remainingSec)}`
                : formatTimer(elapsedSeconds)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
          >
            Quitter
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {q.type === 'multiple'
                ? 'Choix multiple (plusieurs réponses possibles)'
                : q.type === 'boolean'
                  ? 'Vrai ou Faux'
                  : 'Choix unique'}{' '}
              · {q.difficulty}
            </p>
            <h2 className="text-base md:text-lg font-semibold text-[#0F2744] dark:text-white leading-snug">
              {q.question}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(q.id)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
            title="Ajouter aux favoris"
          >
            <Star
              className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`}
            />
          </button>
        </div>

        {q.imageSrc && (
          <figure className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white">
            <img
              src={q.imageSrc}
              alt={q.imageCaption || 'Illustration anatomique du QCM'}
              referrerPolicy="no-referrer"
              className="w-full max-h-72 object-contain mx-auto p-2"
            />
            {q.imageCaption && (
              <figcaption className="px-3 py-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-200">
                {q.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="space-y-2.5">
          {active.shuffledOptions.map((opt, idx) => {
            const selected = chosen.includes(idx);
            let stateStyle =
              'border-slate-200 dark:border-slate-700 hover:border-[#0D9488] bg-white dark:bg-slate-900';

            if (isRevealed) {
              if (opt.isCorrect) {
                stateStyle =
                  'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
              } else if (selected) {
                stateStyle =
                  'border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
              }
            } else if (selected) {
              stateStyle =
                'border-[#0F2744] dark:border-teal-400 bg-slate-50 dark:bg-slate-800';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleOption(idx)}
                className={`w-full text-left rounded-xl border p-4 text-sm transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[48px] ${stateStyle}`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt.text}</span>
                </span>
                {isRevealed && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isRevealed && !opt.isCorrect && selected && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {isRevealed && (
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-700 dark:text-slate-300">
            <strong className="text-[#0F2744] dark:text-teal-300">Explication :</strong>{' '}
            {q.explanation}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-medium disabled:opacity-40 cursor-pointer"
          >
            Précédent
          </button>

          <div className="flex items-center gap-2">
            {correctionMode === 'instant' && !isRevealed && (
              <button
                type="button"
                disabled={chosen.length === 0}
                onClick={() => setRevealedIds((prev) => ({ ...prev, [q.id]: true }))}
                className="rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 cursor-pointer"
              >
                Valider la réponse
              </button>
            )}

            {currentIndex < prepared.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="rounded-lg bg-[#0F2744] dark:bg-teal-600 px-5 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Question suivante
              </button>
            ) : (
              <button
                type="button"
                onClick={finishQuiz}
                className="rounded-lg bg-[#0F2744] dark:bg-teal-600 px-5 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Terminer et voir le bilan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
