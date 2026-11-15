import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AiGeneratedArtifact,
  CustomModuleConfig,
  Flashcard,
  FlashcardSrsState,
  LessonHighlight,
  ModuleId,
  PersonalNote,
  QcmAttempt,
  QcmQuestion,
  UploadedCourse,
  UserPreferences,
  UserStudyState,
} from '../types/medstudy';

const STORAGE_KEY = 'medstudy_state_v1';

export function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const defaultStudyState: UserStudyState = {
  preferences: {
    studentName: 'Étudiant(e) en 1ère Année',
    theme: 'light',
    readerFontSize: 'md',
    dailyGoalMinutes: 60,
    dailyGoalQcms: 20,
  },
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  recentlyStudiedLessons: [],
  studySecondsByModule: {
    anatomie: 0,
    biophysique: 0,
    biochimie: 0,
    biologie: 0,
    'sante-publique': 0,
    terminologie: 0,
    personnalise: 0,
  },
  qcmAttempts: [],
  favoriteQcmIds: [],
  wrongQcmCounts: {},
  flashcardProgress: {},
  notes: [],
  highlights: [],
  uploadedCourses: [],
  customModule: {
    title: 'Module Personnalisable',
    subtitle: 'Votre espace d’étude sur mesure',
    description:
      'Renommez ce module selon votre matière (Embryologie, Histologie, Biologie cellulaire...) et importez vos propres cours, PDF et fiches.',
    accentColor: 'teal',
    chapters: [],
    flashcards: [],
    qcms: [],
  },
  importedQcms: [],
  importedFlashcards: [],
  dailyActivity: {},
};

function mergeWithDefault(raw: Partial<UserStudyState> | null | undefined): UserStudyState {
  if (!raw || typeof raw !== 'object') return defaultStudyState;
  return {
    ...defaultStudyState,
    ...raw,
    preferences: { ...defaultStudyState.preferences, ...(raw.preferences || {}) },
    studySecondsByModule: {
      ...defaultStudyState.studySecondsByModule,
      ...(raw.studySecondsByModule || {}),
    },
    customModule: {
      ...defaultStudyState.customModule,
      ...(raw.customModule || {}),
    },
  };
}

export function calculateStreakDays(dailyActivity: UserStudyState['dailyActivity']): number {
  const today = new Date();
  let streak = 0;
  for (let offset = 0; offset < 365; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const rec = dailyActivity[key];
    const hasActivity =
      rec &&
      (rec.minutesStudied > 0 ||
        rec.lessonsCompleted > 0 ||
        rec.qcmsAnswered > 0 ||
        rec.flashcardsReviewed > 0);
    if (hasActivity) {
      streak++;
    } else if (offset === 0) {
      // Allow streak to continue if user hasn't logged today yet but studied yesterday
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function useStudyStore() {
  const [state, setState] = useState<UserStudyState>(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return mergeWithDefault(JSON.parse(local));
    } catch {
      // ignore localStorage errors
    }
    return defaultStudyState;
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  // Sync theme to documentElement immediately
  useEffect(() => {
    const root = document.documentElement;
    if (state.preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.preferences.theme]);

  // Initial load from Express persistent backend
  useEffect(() => {
    let active = true;
    fetch('/api/state')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then((serverData: Partial<UserStudyState>) => {
        if (!active) return;
        const merged = mergeWithDefault(serverData);
        setState(merged);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        setIsLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setIsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persistState = useCallback((next: UserStudyState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota error
    }
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => {
      fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Échec de synchronisation');
          setSyncError(null);
        })
        .catch(() => {
          setSyncError('Mode hors ligne : modifications enregistrées localement.');
        });
    }, 250);
  }, []);

  const updateState = useCallback(
    (updater: (prev: UserStudyState) => UserStudyState) => {
      setState((prev) => {
        const next = updater(prev);
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const updatePreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      updateState((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...patch },
      }));
    },
    [updateState]
  );

  const recordLessonVisit = useCallback(
    (item: { lessonId: string; moduleId: ModuleId; chapterId: string; title: string }) => {
      updateState((prev) => {
        const filtered = prev.recentlyStudiedLessons.filter((l) => l.lessonId !== item.lessonId);
        return {
          ...prev,
          recentlyStudiedLessons: [
            { ...item, visitedAt: new Date().toISOString() },
            ...filtered,
          ].slice(0, 8),
        };
      });
    },
    [updateState]
  );

  const toggleLessonCompleted = useCallback(
    (lessonId: string) => {
      const today = getTodayKey();
      updateState((prev) => {
        const exists = prev.completedLessonIds.includes(lessonId);
        const completedLessonIds = exists
          ? prev.completedLessonIds.filter((id) => id !== lessonId)
          : [...prev.completedLessonIds, lessonId];
        const curDay = prev.dailyActivity[today] || {
          date: today,
          minutesStudied: 0,
          lessonsCompleted: 0,
          qcmsAnswered: 0,
          flashcardsReviewed: 0,
        };
        return {
          ...prev,
          completedLessonIds,
          dailyActivity: {
            ...prev.dailyActivity,
            [today]: {
              ...curDay,
              lessonsCompleted: exists
                ? Math.max(0, curDay.lessonsCompleted - 1)
                : curDay.lessonsCompleted + 1,
            },
          },
        };
      });
    },
    [updateState]
  );

  const toggleLessonBookmark = useCallback(
    (lessonId: string) => {
      updateState((prev) => {
        const exists = prev.bookmarkedLessonIds.includes(lessonId);
        return {
          ...prev,
          bookmarkedLessonIds: exists
            ? prev.bookmarkedLessonIds.filter((id) => id !== lessonId)
            : [...prev.bookmarkedLessonIds, lessonId],
        };
      });
    },
    [updateState]
  );

  const addStudySeconds = useCallback(
    (moduleId: ModuleId, seconds: number) => {
      if (seconds <= 0) return;
      const today = getTodayKey();
      updateState((prev) => {
        const curDay = prev.dailyActivity[today] || {
          date: today,
          minutesStudied: 0,
          lessonsCompleted: 0,
          qcmsAnswered: 0,
          flashcardsReviewed: 0,
        };
        return {
          ...prev,
          studySecondsByModule: {
            ...prev.studySecondsByModule,
            [moduleId]: (prev.studySecondsByModule[moduleId] || 0) + seconds,
          },
          dailyActivity: {
            ...prev.dailyActivity,
            [today]: {
              ...curDay,
              minutesStudied: curDay.minutesStudied + Math.round((seconds / 60) * 10) / 10,
            },
          },
        };
      });
    },
    [updateState]
  );

  const recordQcmAttempt = useCallback(
    (attempt: Omit<QcmAttempt, 'id' | 'completedAt'>) => {
      const today = getTodayKey();
      updateState((prev) => {
        const nextAttempt: QcmAttempt = {
          ...attempt,
          id: `qcm-att-${Date.now()}`,
          completedAt: new Date().toISOString(),
        };
        const wrongQcmCounts = { ...prev.wrongQcmCounts };
        for (const qId of attempt.wrongQuestionIds) {
          wrongQcmCounts[qId] = (wrongQcmCounts[qId] || 0) + 1;
        }
        const curDay = prev.dailyActivity[today] || {
          date: today,
          minutesStudied: 0,
          lessonsCompleted: 0,
          qcmsAnswered: 0,
          flashcardsReviewed: 0,
        };
        return {
          ...prev,
          qcmAttempts: [nextAttempt, ...prev.qcmAttempts].slice(0, 100),
          wrongQcmCounts,
          dailyActivity: {
            ...prev.dailyActivity,
            [today]: {
              ...curDay,
              qcmsAnswered: curDay.qcmsAnswered + attempt.totalQuestions,
              minutesStudied:
                curDay.minutesStudied +
                Math.max(1, Math.round((attempt.durationSeconds / 60) * 10) / 10),
            },
          },
        };
      });
    },
    [updateState]
  );

  const toggleFavoriteQcm = useCallback(
    (qcmId: string) => {
      updateState((prev) => {
        const exists = prev.favoriteQcmIds.includes(qcmId);
        return {
          ...prev,
          favoriteQcmIds: exists
            ? prev.favoriteQcmIds.filter((id) => id !== qcmId)
            : [...prev.favoriteQcmIds, qcmId],
        };
      });
    },
    [updateState]
  );

  const reviewFlashcard = useCallback(
    (cardId: string, rating: 'hard' | 'medium' | 'easy') => {
      const today = getTodayKey();
      updateState((prev) => {
        const existing = prev.flashcardProgress[cardId];
        const prevEase = existing?.easeFactor ?? 2.5;
        const prevInterval = existing?.intervalDays ?? 0;
        const prevReps = existing?.repetitions ?? 0;

        let nextInterval = 1;
        let nextEase = prevEase;
        let nextReps = prevReps + 1;

        if (rating === 'hard') {
          nextInterval = 1;
          nextEase = Math.max(1.3, prevEase - 0.2);
          nextReps = 0;
        } else if (rating === 'medium') {
          nextInterval = prevReps === 0 ? 2 : Math.max(2, Math.round(prevInterval * 1.6));
          nextEase = Math.max(1.3, prevEase - 0.05);
        } else {
          nextInterval =
            prevReps === 0 ? 4 : prevReps === 1 ? 6 : Math.round(prevInterval * prevEase);
          nextEase = prevEase + 0.1;
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextInterval);

        const srs: FlashcardSrsState = {
          cardId,
          difficultyRating: rating,
          intervalDays: nextInterval,
          easeFactor: nextEase,
          repetitions: nextReps,
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: nextDate.toISOString(),
        };

        const curDay = prev.dailyActivity[today] || {
          date: today,
          minutesStudied: 0,
          lessonsCompleted: 0,
          qcmsAnswered: 0,
          flashcardsReviewed: 0,
        };

        return {
          ...prev,
          flashcardProgress: {
            ...prev.flashcardProgress,
            [cardId]: srs,
          },
          dailyActivity: {
            ...prev.dailyActivity,
            [today]: {
              ...curDay,
              flashcardsReviewed: curDay.flashcardsReviewed + 1,
            },
          },
        };
      });
    },
    [updateState]
  );

  const saveNote = useCallback(
    (note: Omit<PersonalNote, 'id' | 'updatedAt'> & { id?: string }) => {
      updateState((prev) => {
        const now = new Date().toISOString();
        if (note.id) {
          return {
            ...prev,
            notes: prev.notes.map((n) =>
              n.id === note.id ? { ...n, ...note, updatedAt: now } : n
            ),
          };
        }
        const created: PersonalNote = {
          ...note,
          id: `note-${Date.now()}`,
          updatedAt: now,
        };
        return {
          ...prev,
          notes: [created, ...prev.notes],
        };
      });
    },
    [updateState]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      updateState((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== noteId),
      }));
    },
    [updateState]
  );

  const toggleHighlight = useCallback(
    (item: Omit<LessonHighlight, 'id' | 'createdAt'>) => {
      updateState((prev) => {
        const existing = prev.highlights.find(
          (h) => h.lessonId === item.lessonId && h.sectionId === item.sectionId && h.text === item.text
        );
        if (existing) {
          return {
            ...prev,
            highlights: prev.highlights.filter((h) => h.id !== existing.id),
          };
        }
        return {
          ...prev,
          highlights: [
            {
              ...item,
              id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              createdAt: new Date().toISOString(),
            },
            ...prev.highlights,
          ],
        };
      });
    },
    [updateState]
  );

  const addUploadedCourse = useCallback(
    (course: Omit<UploadedCourse, 'id' | 'uploadedAt' | 'aiArtifacts'>) => {
      const created: UploadedCourse = {
        ...course,
        id: `course-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        aiArtifacts: [],
      };
      updateState((prev) => ({
        ...prev,
        uploadedCourses: [created, ...prev.uploadedCourses],
      }));
      return created;
    },
    [updateState]
  );

  const updateUploadedCourse = useCallback(
    (courseId: string, patch: Partial<UploadedCourse>) => {
      updateState((prev) => ({
        ...prev,
        uploadedCourses: prev.uploadedCourses.map((c) =>
          c.id === courseId ? { ...c, ...patch } : c
        ),
      }));
    },
    [updateState]
  );

  const addAiArtifactToCourse = useCallback(
    (courseId: string, artifact: Omit<AiGeneratedArtifact, 'id' | 'createdAt'>) => {
      updateState((prev) => ({
        ...prev,
        uploadedCourses: prev.uploadedCourses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                aiArtifacts: [
                  {
                    ...artifact,
                    id: `ai-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                  },
                  ...c.aiArtifacts,
                ],
              }
            : c
        ),
      }));
    },
    [updateState]
  );

  const deleteUploadedCourse = useCallback(
    (course: UploadedCourse) => {
      if (course.storedFileName) {
        fetch(`/api/files/${encodeURIComponent(course.storedFileName)}`, {
          method: 'DELETE',
        }).catch(() => {});
      }
      updateState((prev) => ({
        ...prev,
        uploadedCourses: prev.uploadedCourses.filter((c) => c.id !== course.id),
      }));
    },
    [updateState]
  );

  const importGeneratedQcms = useCallback(
    (questions: QcmQuestion[]) => {
      updateState((prev) => ({
        ...prev,
        importedQcms: [...questions, ...prev.importedQcms],
      }));
    },
    [updateState]
  );

  const importGeneratedFlashcards = useCallback(
    (cards: Flashcard[]) => {
      updateState((prev) => ({
        ...prev,
        importedFlashcards: [...cards, ...prev.importedFlashcards],
      }));
    },
    [updateState]
  );

  const updateCustomModule = useCallback(
    (updater: (cfg: CustomModuleConfig) => CustomModuleConfig) => {
      updateState((prev) => ({
        ...prev,
        customModule: updater(prev.customModule),
      }));
    },
    [updateState]
  );

  const resetProgressOnly = useCallback(() => {
    updateState((prev) => ({
      ...defaultStudyState,
      preferences: prev.preferences,
      uploadedCourses: prev.uploadedCourses,
      customModule: prev.customModule,
    }));
  }, [updateState]);

  return {
    state,
    isLoaded,
    syncError,
    updatePreferences,
    recordLessonVisit,
    toggleLessonCompleted,
    toggleLessonBookmark,
    addStudySeconds,
    recordQcmAttempt,
    toggleFavoriteQcm,
    reviewFlashcard,
    saveNote,
    deleteNote,
    toggleHighlight,
    addUploadedCourse,
    updateUploadedCourse,
    addAiArtifactToCourse,
    deleteUploadedCourse,
    importGeneratedQcms,
    importGeneratedFlashcards,
    updateCustomModule,
    resetProgressOnly,
  };
}
