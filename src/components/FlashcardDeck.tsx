import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Volume2 } from 'lucide-react';
import { getAllFlashcards } from '../data/modulesRegistry';
import type { MedicalModuleMeta, ModuleId, UserStudyState } from '../types/medstudy';

interface FlashcardDeckProps {
  modules: MedicalModuleMeta[];
  state: UserStudyState;
  initialModuleId?: ModuleId | 'all';
  initialChapterId?: string;
  initialFilter?: 'due' | 'all' | 'hard';
  onReviewCard: (cardId: string, rating: 'hard' | 'medium' | 'easy') => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  modules,
  state,
  initialModuleId = 'all',
  initialChapterId = '',
  initialFilter = 'all',
  onReviewCard,
}) => {
  const allCards = useMemo(() => getAllFlashcards(modules), [modules]);
  const [moduleFilter, setModuleFilter] = useState<ModuleId | 'all'>(initialModuleId);
  const [deckMode, setDeckMode] = useState<'all' | 'due' | 'hard'>(initialFilter);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nowIso = new Date().toISOString();

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (moduleFilter !== 'all' && card.moduleId !== moduleFilter) return false;
      if (initialChapterId && moduleFilter === initialModuleId && card.chapterId !== initialChapterId) {
        return false;
      }
      const srs = state.flashcardProgress[card.id];
      if (deckMode === 'due') {
        return !srs || srs.nextReviewAt <= nowIso;
      }
      if (deckMode === 'hard') {
        return srs?.difficultyRating === 'hard';
      }
      return true;
    });
  }, [allCards, moduleFilter, deckMode, state.flashcardProgress, nowIso, initialChapterId, initialModuleId]);

  const safeIndex = filteredCards.length > 0 ? Math.min(index, filteredCards.length - 1) : 0;
  const activeCard = filteredCards[safeIndex];

  const masteredCount = allCards.filter(
    (c) => state.flashcardProgress[c.id]?.difficultyRating === 'easy'
  ).length;
  const reviewedCount = allCards.filter((c) => !!state.flashcardProgress[c.id]).length;

  const handleGrade = (rating: 'hard' | 'medium' | 'easy') => {
    if (!activeCard) return;
    onReviewCard(activeCard.id, rating);
    setIsFlipped(false);
    if (safeIndex < filteredCards.length - 1) {
      setIndex(safeIndex + 1);
    } else {
      setIndex(0);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Progress */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2744] dark:text-white">
              Flashcards & Répétition espacée
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Mémorisation active inspirée d’Anki : évaluez chaque carte pour planifier sa
              prochaine révision.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-semibold text-[#0D9488] tabular-nums">
              {masteredCount}
            </span>{' '}
            maîtrisées ·{' '}
            <span className="font-mono font-semibold tabular-nums">{reviewedCount}</span> /{' '}
            <span className="font-mono tabular-nums">{allCards.length}</span> révisées
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value as ModuleId | 'all');
              setIndex(0);
              setIsFlipped(false);
            }}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium"
          >
            <option value="all">Tous les modules ({allCards.length})</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.flashcards.length})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'due', label: 'Session du jour' },
              { id: 'hard', label: 'Difficiles' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setDeckMode(tab.id as typeof deckMode);
                  setIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  deckMode === tab.id
                    ? 'bg-white dark:bg-slate-900 text-[#0F2744] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Flashcard Stage */}
      {!activeCard ? (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
          <p className="text-base font-semibold text-[#0F2744] dark:text-white">
            Aucune carte dans cette file pour le moment
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Vous avez terminé les cartes dues ou aucune carte ne correspond à ce filtre.
          </p>
          <button
            type="button"
            onClick={() => setDeckMode('all')}
            className="rounded-lg bg-[#0F2744] dark:bg-teal-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            Afficher toutes les flashcards
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {activeCard.chapterTitle}
              {state.flashcardProgress[activeCard.id]
                ? ` · Intervalle actuel : ${state.flashcardProgress[activeCard.id].intervalDays} j`
                : ' · Nouvelle carte'}
            </span>
            <span className="font-mono tabular-nums">
              Carte {safeIndex + 1} / {filteredCards.length}
            </span>
          </div>

          {/* 3D Flip Card */}
          <div className="perspective-1000">
            <div
              onClick={() => setIsFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setIsFlipped((f) => !f);
                }
              }}
              className={`relative min-h-[280px] md:min-h-[320px] w-full transition-transform duration-500 transform-style-3d cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-xs">
                <p className="text-xs font-medium text-[#0D9488] mb-3">Recto · Question / Concept</p>
                <h2 className="text-lg md:text-2xl font-bold text-[#0F2744] dark:text-white max-w-2xl leading-snug">
                  {activeCard.front}
                </h2>
                <p className="mt-6 text-xs text-slate-400 inline-flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Cliquez pour retourner la carte</span>
                </p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#0F2744] dark:bg-slate-800 border border-[#0F2744] dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center text-white shadow-xs">
                <p className="text-xs font-medium text-teal-300 mb-3">Verso · Réponse</p>
                <p className="text-lg md:text-xl font-semibold max-w-2xl leading-relaxed">
                  {activeCard.back}
                </p>
                {activeCard.explanation && (
                  <p className="mt-4 text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                    {activeCard.explanation}
                  </p>
                )}
                {activeCard.pronunciationText && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(activeCard.pronunciationText!);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Écouter la prononciation</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grading & Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setIndex((i) => (i > 0 ? i - 1 : filteredCards.length - 1));
                }}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 cursor-pointer"
                aria-label="Carte précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setIndex((i) => (i + 1) % filteredCards.length);
                }}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 cursor-pointer"
                aria-label="Carte suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleGrade('hard')}
                className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer min-h-[44px]"
              >
                Difficile (1 j)
              </button>
              <button
                type="button"
                onClick={() => handleGrade('medium')}
                className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-2.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 cursor-pointer min-h-[44px]"
              >
                Moyen (2-3 j)
              </button>
              <button
                type="button"
                onClick={() => handleGrade('easy')}
                className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer min-h-[44px]"
              >
                Facile (4+ j)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
