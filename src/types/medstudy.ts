export type ModuleId =
  | 'anatomie'
  | 'biophysique'
  | 'biochimie'
  | 'biologie'
  | 'sante-publique'
  | 'terminologie'
  | 'personnalise';

export type ViewMode =
  | 'dashboard'
  | 'module'
  | 'lesson'
  | 'qcm'
  | 'flashcards'
  | 'smart-revision'
  | 'courses'
  | 'statistics'
  | 'settings';

export interface LessonSection {
  id: string;
  title: string;
  kind?:
    | 'introduction'
    | 'definition'
    | 'situation'
    | 'externe'
    | 'interne'
    | 'vascularisation'
    | 'innervation'
    | 'lymphatique'
    | 'rapports'
    | 'structures'
    | 'clinique'
    | 'memoriser'
    | 'resume'
    | 'principe'
    | 'demonstration'
    | 'exemple'
    | 'application'
    | 'methode'
    | 'reaction'
    | 'standard';
  paragraphs: string[];
  bulletPoints?: string[];
  formula?: {
    expression: string;
    variables: { symbol: string; meaning: string; unit?: string }[];
    note?: string;
  };
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
}

export interface Lesson {
  id: string;
  moduleId: ModuleId;
  chapterId: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  difficulty: 'Fondamental' | 'Intermédiaire' | 'Approfondi';
  keyDefinitions: { term: string; definition: string }[];
  sections: LessonSection[];
  examTips: string[];
}

export interface Chapter {
  id: string;
  moduleId: ModuleId;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type QcmType = 'single' | 'multiple' | 'boolean';

export interface QcmQuestion {
  id: string;
  moduleId: ModuleId;
  chapterId: string;
  chapterTitle: string;
  type: QcmType;
  question: string;
  imageSrc?: string;
  imageCaption?: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  isCalculation?: boolean;
  sourceCourseId?: string;
}

export interface Flashcard {
  id: string;
  moduleId: ModuleId;
  chapterId: string;
  chapterTitle: string;
  front: string;
  back: string;
  explanation?: string;
  category?: string;
  pronunciationText?: string;
  sourceCourseId?: string;
}

export interface FormulaItem {
  id: string;
  chapterTitle: string;
  name: string;
  expression: string;
  variables: string[];
  unit: string;
  medicalApplication: string;
}

export interface TerminologyEntry {
  id: string;
  term: string;
  category:
    | 'Préfixe'
    | 'Suffixe'
    | 'Racine'
    | 'Anatomique'
    | 'Physiologique'
    | 'Pathologique'
    | 'Clinique';
  origin: 'Grec' | 'Latin' | 'Mixte';
  meaning: string;
  exampleWord: string;
  exampleDecomposition: string;
  exampleDefinition: string;
}

export interface FlashcardSrsState {
  cardId: string;
  difficultyRating: 'hard' | 'medium' | 'easy';
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lastReviewedAt: string;
  nextReviewAt: string;
}

export interface QcmAttempt {
  id: string;
  moduleId: ModuleId | 'mixed';
  chapterId?: string;
  title: string;
  mode: 'practice' | 'exam';
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  durationSeconds: number;
  wrongQuestionIds: string[];
  completedAt: string;
}

export interface PersonalNote {
  id: string;
  moduleId: ModuleId;
  chapterId?: string;
  lessonId?: string;
  courseId?: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface LessonHighlight {
  id: string;
  lessonId: string;
  sectionId: string;
  text: string;
  color: 'amber' | 'teal';
  createdAt: string;
}

export type AiToolKind =
  | 'summarize'
  | 'beginner'
  | 'definitions'
  | 'qcm'
  | 'qcm_corrector'
  | 'custom_question'
  | 'flashcards'
  | 'exam_focus'
  | 'diagrams'
  | 'revision_sheet';

export interface AiGeneratedArtifact {
  id: string;
  tool: AiToolKind;
  title: string;
  contentMarkdown: string;
  generatedQcms?: Omit<QcmQuestion, 'id'>[];
  generatedFlashcards?: Omit<Flashcard, 'id'>[];
  createdAt: string;
}

export interface UploadedCourse {
  id: string;
  moduleId: ModuleId;
  chapterName: string;
  title: string;
  fileType: 'pdf' | 'image' | 'text';
  fileName?: string;
  storedFileName?: string;
  fileUrl?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  textContent?: string;
  notes: string;
  uploadedAt: string;
  aiArtifacts: AiGeneratedArtifact[];
}

export interface CustomChapter {
  id: string;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    content: string;
    keyPoints: string[];
    updatedAt: string;
  }[];
}

export interface CustomModuleConfig {
  title: string;
  subtitle: string;
  description: string;
  accentColor: 'navy' | 'teal' | 'sky' | 'indigo' | 'emerald' | 'amber';
  chapters: CustomChapter[];
  flashcards: Flashcard[];
  qcms: QcmQuestion[];
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  lessonsCompleted: number;
  qcmsAnswered: number;
  flashcardsReviewed: number;
}

export interface UserPreferences {
  studentName: string;
  theme: 'light' | 'dark';
  readerFontSize: 'sm' | 'md' | 'lg' | 'xl';
  dailyGoalMinutes: number;
  dailyGoalQcms: number;
}

export interface UserStudyState {
  preferences: UserPreferences;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  recentlyStudiedLessons: {
    lessonId: string;
    moduleId: ModuleId;
    chapterId: string;
    title: string;
    visitedAt: string;
  }[];
  studySecondsByModule: Record<ModuleId, number>;
  qcmAttempts: QcmAttempt[];
  favoriteQcmIds: string[];
  wrongQcmCounts: Record<string, number>;
  flashcardProgress: Record<string, FlashcardSrsState>;
  notes: PersonalNote[];
  highlights: LessonHighlight[];
  uploadedCourses: UploadedCourse[];
  customModule: CustomModuleConfig;
  importedQcms: QcmQuestion[];
  importedFlashcards: Flashcard[];
  dailyActivity: Record<string, DailyActivityRecord>;
}

export interface MedicalModuleMeta {
  id: ModuleId;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  accentHex: string;
  accentClass: string;
  chapters: Chapter[];
  qcms: QcmQuestion[];
  flashcards: Flashcard[];
}
