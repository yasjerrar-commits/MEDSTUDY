import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  FolderOpen,
  Home,
  Layers,
  ListChecks,
  Moon,
  Search,
  Settings,
  Sun,
} from 'lucide-react';
import { DashboardView } from './components/DashboardView';
import { FlashcardDeck } from './components/FlashcardDeck';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LessonReader } from './components/LessonReader';
import { ModuleView } from './components/ModuleView';
import { PersonalCoursesView } from './components/PersonalCoursesView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';
import { QcmEngine } from './components/QcmEngine';
import { SettingsView } from './components/SettingsView';
import { SmartRevisionView } from './components/SmartRevisionView';
import { StatisticsView } from './components/StatisticsView';
import { buildModules, getAllLessons } from './data/modulesRegistry';
import { useStudyStore } from './hooks/useStudyStore';
import type { Lesson, ModuleId, ViewMode } from './types/medstudy';

export default function App() {
  const {
    state,
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
  } = useStudyStore();

  const modules = useMemo(() => buildModules(state), [state]);
  const allLessons = useMemo(() => getAllLessons(modules), [modules]);

  const [view, setView] = useState<ViewMode>('dashboard');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('anatomie');
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [qcmTarget, setQcmTarget] = useState<{
    moduleId: ModuleId | 'all';
    chapterId?: string;
    filter?: 'all' | 'wrong' | 'favorites';
    key: number;
  }>({ moduleId: 'all', key: 0 });
  const [fcTarget, setFcTarget] = useState<{
    moduleId: ModuleId | 'all';
    chapterId?: string;
    filter?: 'all' | 'due' | 'hard';
    key: number;
  }>({ moduleId: 'all', key: 0 });
  const [coursesTarget, setCoursesTarget] = useState<{
    moduleId: ModuleId;
    courseId?: string;
    openUpload?: boolean;
    key: number;
  }>({ moduleId: 'anatomie', key: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);

  // Keyboard shortcut Cmd/Ctrl + K for global search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Track real active study time every 30s when in lesson, module, qcm, or flashcards
  useEffect(() => {
    if (view !== 'lesson' && view !== 'module' && view !== 'qcm' && view !== 'flashcards') {
      return;
    }
    const trackedModule: ModuleId =
      view === 'qcm' && qcmTarget.moduleId !== 'all'
        ? qcmTarget.moduleId
        : view === 'flashcards' && fcTarget.moduleId !== 'all'
          ? fcTarget.moduleId
          : activeModuleId;

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        addStudySeconds(trackedModule, 30);
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [view, activeModuleId, qcmTarget.moduleId, fcTarget.moduleId, addStudySeconds]);

  const activeModule =
    modules.find((m) => m.id === activeModuleId) || modules[0];
  const activeLesson =
    allLessons.find((l) => l.id === activeLessonId) || null;

  const openModule = (modId: ModuleId) => {
    setActiveModuleId(modId);
    setView('module');
    setMobileModulesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLesson = (lesson: Lesson) => {
    setActiveModuleId(lesson.moduleId);
    setActiveLessonId(lesson.id);
    recordLessonVisit({
      lessonId: lesson.id,
      moduleId: lesson.moduleId,
      chapterId: lesson.chapterId,
      title: lesson.title,
    });
    setView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startQcm = (
    modId?: ModuleId,
    chapterId?: string,
    filter: 'all' | 'wrong' | 'favorites' = 'all'
  ) => {
    if (modId) setActiveModuleId(modId);
    setQcmTarget((prev) => ({
      moduleId: modId || 'all',
      chapterId,
      filter,
      key: prev.key + 1,
    }));
    setView('qcm');
    setMobileModulesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startFlashcards = (
    modId?: ModuleId,
    chapterId?: string,
    filter: 'all' | 'due' | 'hard' = 'all'
  ) => {
    if (modId) setActiveModuleId(modId);
    setFcTarget((prev) => ({
      moduleId: modId || 'all',
      chapterId,
      filter,
      key: prev.key + 1,
    }));
    setView('flashcards');
    setMobileModulesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCourses = (
    modId?: ModuleId,
    options?: { courseId?: string; openUpload?: boolean }
  ) => {
    if (modId || options) {
      setCoursesTarget((prev) => ({
        moduleId: modId || prev.moduleId,
        courseId: options?.courseId,
        openUpload: options?.openUpload,
        key: prev.key + 1,
      }));
    }
    setView('courses');
    setMobileModulesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: {
    id: ViewMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'smart-revision', label: 'Révision intelligente', icon: BrainCircuit },
    { id: 'qcm', label: 'QCM', icon: ListChecks },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'courses', label: 'Cours & IA', icon: FolderOpen },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Préférences', icon: Settings },
  ];

  const isDark = state.preferences.theme === 'dark';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="text-lg font-extrabold tracking-tight text-[#0F2744] dark:text-white whitespace-nowrap cursor-pointer"
          >
            MEDSTUDY
          </button>
          <button
            type="button"
            onClick={() => updatePreferences({ theme: isDark ? 'light' : 'dark' })}
            className="p-2 rounded-lg text-slate-500 hover:text-[#0F2744] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
            aria-label="Basculer le thème"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-500 hover:border-[#0D9488] transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Rechercher...</span>
            </span>
            <kbd className="text-[10px] font-mono text-slate-400">⌘K</kbd>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'qcm') startQcm();
                    else if (item.id === 'flashcards') startFlashcards();
                    else setView(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#0F2744] text-white dark:bg-teal-600'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400">
              Modules de 1ère année
            </p>
            <div className="space-y-1">
              {modules.map((m) => {
                const active = (view === 'module' || view === 'lesson') && activeModuleId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => openModule(m.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-[#0F2744] dark:text-teal-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">{m.shortTitle}</span>
                    <span className="text-[10px] font-mono text-slate-400">{m.code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <PWAInstallButton />
          <p className="text-[11px] text-slate-500 truncate">{state.preferences.studentName}</p>
        </div>
      </aside>

      {/* Mobile Compact Top Bar */}
      <header className="md:hidden sticky top-0 z-30 h-14 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setView('dashboard')}
          className="text-base font-extrabold tracking-tight text-[#0F2744] dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          MEDSTUDY
        </button>

        <div className="flex items-center gap-1.5">
          <PWAInstallButton compact />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Rechercher"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => updatePreferences({ theme: isDark ? 'light' : 'dark' })}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Changer de thème"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setView('settings')}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 lg:pl-72 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {syncError && (
            <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
              {syncError}
            </div>
          )}

          {view === 'dashboard' && (
            <DashboardView
              modules={modules}
              state={state}
              onOpenModule={openModule}
              onOpenLesson={openLesson}
              onStartQcm={(modId) => startQcm(modId)}
              onOpenSmartRevision={() => setView('smart-revision')}
              onUpdateGoal={(mins) => updatePreferences({ dailyGoalMinutes: mins })}
            />
          )}

          {view === 'module' && (
            <ModuleView
              key={activeModule.id}
              module={activeModule}
              state={state}
              onBack={() => setView('dashboard')}
              onOpenLesson={openLesson}
              onStartQcm={(modId, chId) => startQcm(modId, chId)}
              onStartFlashcards={(modId, chId) => startFlashcards(modId, chId)}
              onOpenCourses={(modId, opts) => openCourses(modId, opts)}
              onUpdateCustomModule={updateCustomModule}
            />
          )}

          {view === 'lesson' && activeLesson && (
            <LessonReader
              lesson={activeLesson}
              module={modules.find((m) => m.id === activeLesson.moduleId) || activeModule}
              state={state}
              onBack={() => openModule(activeLesson.moduleId)}
              onToggleCompleted={toggleLessonCompleted}
              onToggleBookmark={toggleLessonBookmark}
              onUpdateFontSize={(sz) => updatePreferences({ readerFontSize: sz })}
              onToggleHighlight={toggleHighlight}
              onSaveNote={saveNote}
              onDeleteNote={deleteNote}
              onOpenLesson={openLesson}
              onStartChapterQcm={(modId, chId) => startQcm(modId, chId)}
            />
          )}

          {view === 'qcm' && (
            <QcmEngine
              key={qcmTarget.key}
              modules={modules}
              state={state}
              initialModuleId={qcmTarget.moduleId}
              initialChapterId={qcmTarget.chapterId}
              initialFilter={qcmTarget.filter}
              onRecordAttempt={recordQcmAttempt}
              onToggleFavorite={toggleFavoriteQcm}
            />
          )}

          {view === 'flashcards' && (
            <FlashcardDeck
              key={fcTarget.key}
              modules={modules}
              state={state}
              initialModuleId={fcTarget.moduleId}
              initialChapterId={fcTarget.chapterId}
              initialFilter={fcTarget.filter}
              onReviewCard={reviewFlashcard}
            />
          )}

          {view === 'smart-revision' && (
            <SmartRevisionView
              modules={modules}
              state={state}
              onOpenLesson={openLesson}
              onStartQcm={(modId, filter) => startQcm(modId, undefined, filter)}
              onStartFlashcards={(modId, filter) => startFlashcards(modId, undefined, filter)}
            />
          )}

          {view === 'courses' && (
            <PersonalCoursesView
              modules={modules}
              state={state}
              initialModuleId={coursesTarget.moduleId}
              initialCourseId={coursesTarget.courseId}
              initialOpenUpload={coursesTarget.openUpload}
              requestKey={coursesTarget.key}
              onAddCourse={addUploadedCourse}
              onUpdateCourse={updateUploadedCourse}
              onAddAiArtifact={addAiArtifactToCourse}
              onDeleteCourse={deleteUploadedCourse}
              onImportQcms={importGeneratedQcms}
              onImportFlashcards={importGeneratedFlashcards}
            />
          )}

          {view === 'statistics' && <StatisticsView modules={modules} state={state} />}

          {view === 'settings' && (
            <SettingsView
              state={state}
              onUpdatePreferences={updatePreferences}
              onResetProgress={resetProgressOnly}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (compact <= 64px height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="grid grid-cols-5 h-16 items-center">
          <button
            type="button"
            onClick={() => {
              setMobileModulesOpen(false);
              setView('dashboard');
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
              view === 'dashboard'
                ? 'text-[#0D9488]'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="mt-1">Accueil</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileModulesOpen((v) => !v)}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
              view === 'module' || view === 'lesson' || mobileModulesOpen
                ? 'text-[#0D9488]'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="mt-1">Modules</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileModulesOpen(false);
              startQcm();
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
              view === 'qcm' ? 'text-[#0D9488]' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ListChecks className="w-5 h-5" />
            <span className="mt-1">QCM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileModulesOpen(false);
              setView('smart-revision');
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
              view === 'smart-revision' || view === 'flashcards'
                ? 'text-[#0D9488]'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span className="mt-1">Révision</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileModulesOpen(false);
              setView('courses');
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
              view === 'courses' ? 'text-[#0D9488]' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="mt-1">Cours</span>
          </button>
        </div>
      </nav>

      {/* Mobile Modules & Quick Tools Drawer */}
      {mobileModulesOpen && (
        <div
          className="md:hidden fixed inset-0 z-35 bg-slate-950/50 backdrop-blur-xs flex items-end"
          onClick={() => setMobileModulesOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-5 pb-24 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
            <h3 className="text-sm font-bold text-[#0F2744] dark:text-white">
              Modules & Outils d’étude
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openModule(m.id)}
                  className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm font-semibold text-[#0F2744] dark:text-white">
                    {m.title}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{m.code}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => startFlashcards()}
                className="rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#0D9488]" />
                <span>Flashcards</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileModulesOpen(false);
                  setView('statistics');
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-[#0284C7]" />
                <span>Statistiques</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        modules={modules}
        state={state}
        onOpenModule={openModule}
        onOpenLesson={openLesson}
        onStartQcm={(modId) => startQcm(modId)}
        onStartFlashcards={(modId) => startFlashcards(modId)}
        onOpenCourses={() => openCourses()}
      />

      <OfflineIndicator />
    </div>
  );
}
