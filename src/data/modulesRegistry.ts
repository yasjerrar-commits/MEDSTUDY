import { anatomieChapters, anatomieFlashcards, anatomieQcms } from './anatomieData';
import { biophysiqueChapters, biophysiqueFlashcards, biophysiqueQcms } from './biophysiqueData';
import { biochimieChapters, biochimieFlashcards, biochimieQcms } from './biochimieData';
import { biologieChapters, biologieFlashcards, biologieQcms } from './biologieData';
import {
  santePubliqueChapters,
  santePubliqueFlashcards,
  santePubliqueQcms,
} from './santePubliqueData';
import {
  terminologieChapters,
  terminologieFlashcards,
  terminologieQcms,
} from './terminologieData';
import type {
  Chapter,
  CustomModuleConfig,
  Flashcard,
  Lesson,
  MedicalModuleMeta,
  ModuleId,
  QcmQuestion,
  UserStudyState,
} from '../types/medstudy';

export function buildModules(state?: UserStudyState): MedicalModuleMeta[] {
  const customCfg: CustomModuleConfig = state?.customModule || {
    title: 'Module Personnalisable',
    subtitle: 'Votre espace d’étude sur mesure',
    description:
      'Renommez ce module, ajoutez vos chapitres, leçons, PDF, notes, flashcards et QCM.',
    accentColor: 'teal',
    chapters: [],
    flashcards: [],
    qcms: [],
  };

  const customChapters: Chapter[] = customCfg.chapters.map((ch, idx) => ({
    id: ch.id,
    moduleId: 'personnalise',
    order: idx + 1,
    title: ch.title,
    description: ch.description,
    lessons: ch.lessons.map((l) => ({
      id: l.id,
      moduleId: 'personnalise',
      chapterId: ch.id,
      title: l.title,
      subtitle: 'Leçon personnalisée créée par l’étudiant',
      estimatedMinutes: Math.max(10, Math.ceil(l.content.split(/\s+/).length / 120) * 5),
      difficulty: 'Fondamental',
      keyDefinitions: [],
      sections: [
        {
          id: `${l.id}-sec-1`,
          kind: 'standard',
          title: 'Contenu de votre cours',
          paragraphs: l.content
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean),
          bulletPoints: l.keyPoints.filter((k) => k.trim().length > 0),
        },
      ],
      examTips: l.keyPoints.filter((k) => k.trim().length > 0),
    })),
  }));

  const importedByModule = (modId: ModuleId) => ({
    qcms: (state?.importedQcms || []).filter((q) => q.moduleId === modId),
    flashcards: (state?.importedFlashcards || []).filter((f) => f.moduleId === modId),
  });

  const accentMap: Record<CustomModuleConfig['accentColor'], { hex: string; cls: string }> = {
    navy: { hex: '#0F2744', cls: 'text-[#0F2744] dark:text-sky-300' },
    teal: { hex: '#0D9488', cls: 'text-teal-600 dark:text-teal-400' },
    sky: { hex: '#0284C7', cls: 'text-sky-600 dark:text-sky-400' },
    indigo: { hex: '#4338CA', cls: 'text-indigo-600 dark:text-indigo-400' },
    emerald: { hex: '#059669', cls: 'text-emerald-600 dark:text-emerald-400' },
    amber: { hex: '#B45309', cls: 'text-amber-700 dark:text-amber-400' },
  };
  const customAccent = accentMap[customCfg.accentColor] || accentMap.teal;

  return [
    {
      id: 'anatomie',
      code: 'UE 1',
      title: 'Anatomie',
      shortTitle: 'Anatomie',
      description:
        'Anatomie thoracique complète : cœur, poumons, paroi thoracique, plèvre, médiastin et glandes mammaires.',
      accentHex: '#0F2744',
      accentClass: 'text-[#0F2744] dark:text-sky-300',
      chapters: anatomieChapters,
      qcms: [...anatomieQcms, ...importedByModule('anatomie').qcms],
      flashcards: [...anatomieFlashcards, ...importedByModule('anatomie').flashcards],
    },
    {
      id: 'biophysique',
      code: 'UE 2',
      title: 'Biophysique',
      shortTitle: 'Biophysique',
      description:
        'Hémodynamique, membranes et osmose, optique oculaire, rayonnements médicaux et bibliothèque de formules.',
      accentHex: '#0284C7',
      accentClass: 'text-sky-700 dark:text-sky-400',
      chapters: biophysiqueChapters,
      qcms: [...biophysiqueQcms, ...importedByModule('biophysique').qcms],
      flashcards: [...biophysiqueFlashcards, ...importedByModule('biophysique').flashcards],
    },
    {
      id: 'biochimie',
      code: 'UE 3',
      title: 'Biochimie',
      shortTitle: 'Biochimie',
      description:
        'Biomolécules, acides aminés, protéines, glucides, lipides, enzymologie et métabolisme énergétique (ATP).',
      accentHex: '#0D9488',
      accentClass: 'text-teal-700 dark:text-teal-400',
      chapters: biochimieChapters,
      qcms: [...biochimieQcms, ...importedByModule('biochimie').qcms],
      flashcards: [...biochimieFlashcards, ...importedByModule('biochimie').flashcards],
    },
    {
      id: 'biologie',
      code: 'UE 4',
      title: 'Biologie',
      shortTitle: 'Biologie',
      description:
        'Biologie cellulaire, membrane plasmique et organites, cycle cellulaire (mitose/méiose), expression génique et embryologie.',
      accentHex: '#059669',
      accentClass: 'text-emerald-700 dark:text-emerald-400',
      chapters: biologieChapters,
      qcms: [...biologieQcms, ...importedByModule('biologie').qcms],
      flashcards: [...biologieFlashcards, ...importedByModule('biologie').flashcards],
    },
    {
      id: 'sante-publique',
      code: 'UE 5',
      title: 'Santé Publique',
      shortTitle: 'Santé Publique',
      description:
        'Déterminants, indicateurs, épidémiologie, prévention, système de santé marocain et biostatistiques.',
      accentHex: '#0369A1',
      accentClass: 'text-cyan-700 dark:text-cyan-400',
      chapters: santePubliqueChapters,
      qcms: [...santePubliqueQcms, ...importedByModule('sante-publique').qcms],
      flashcards: [...santePubliqueFlashcards, ...importedByModule('sante-publique').flashcards],
    },
    {
      id: 'terminologie',
      code: 'UE 6',
      title: 'Terminologie Médicale',
      shortTitle: 'Terminologie',
      description:
        'Préfixes, suffixes, racines gréco-latines, dictionnaire médical consultable, décomposition et prononciation.',
      accentHex: '#334155',
      accentClass: 'text-slate-700 dark:text-slate-300',
      chapters: terminologieChapters,
      qcms: [...terminologieQcms, ...importedByModule('terminologie').qcms],
      flashcards: [...terminologieFlashcards, ...importedByModule('terminologie').flashcards],
    },
    {
      id: 'personnalise',
      code: 'UE 7',
      title: customCfg.title || 'Module Personnalisable',
      shortTitle: customCfg.title || 'Module Libre',
      description: customCfg.description,
      accentHex: customAccent.hex,
      accentClass: customAccent.cls,
      chapters: customChapters,
      qcms: [...customCfg.qcms, ...importedByModule('personnalise').qcms],
      flashcards: [...customCfg.flashcards, ...importedByModule('personnalise').flashcards],
    },
  ];
}

export function getAllLessons(modules: MedicalModuleMeta[]): Lesson[] {
  return modules.flatMap((m) => m.chapters.flatMap((c) => c.lessons));
}

export function getAllQcms(modules: MedicalModuleMeta[]): QcmQuestion[] {
  return modules.flatMap((m) => m.qcms);
}

export function getAllFlashcards(modules: MedicalModuleMeta[]): Flashcard[] {
  return modules.flatMap((m) => m.flashcards);
}
