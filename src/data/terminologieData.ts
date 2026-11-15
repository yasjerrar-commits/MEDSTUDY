import type { Chapter, Flashcard, QcmQuestion, TerminologyEntry } from '../types/medstudy';

export const terminologyDictionary: TerminologyEntry[] = [
  {
    id: 'term-1',
    term: 'Brady-',
    category: 'Préfixe',
    origin: 'Grec',
    meaning: 'Lent, ralentissement',
    exampleWord: 'Bradycardie',
    exampleDecomposition: 'brady- (lent) + card(i)- (cœur) + -ie (état)',
    exampleDefinition: 'Ralentissement du rythme cardiaque en dessous de 60 battements par minute.',
  },
  {
    id: 'term-2',
    term: 'Tachy-',
    category: 'Préfixe',
    origin: 'Grec',
    meaning: 'Rapide, accélération',
    exampleWord: 'Tachypnée',
    exampleDecomposition: 'tachy- (rapide) + -pnée (respiration)',
    exampleDefinition: 'Accélération de la fréquence respiratoire.',
  },
  {
    id: 'term-3',
    term: 'Dys-',
    category: 'Préfixe',
    origin: 'Grec',
    meaning: 'Difficulté, anomalie, douleur',
    exampleWord: 'Dyspnée',
    exampleDecomposition: 'dys- (difficile) + -pnée (respiration)',
    exampleDefinition: 'Gêne respiratoire ressentie par le patient.',
  },
  {
    id: 'term-4',
    term: 'Hyper- / Hypo-',
    category: 'Préfixe',
    origin: 'Grec',
    meaning: 'Au-dessus (excès) / Au-dessous (insuffisance)',
    exampleWord: 'Hyperglycémie',
    exampleDecomposition: 'hyper- (excès) + glyc- (sucre) + -émie (dans le sang)',
    exampleDefinition: 'Élévation anormale du taux de glucose dans le sang.',
  },
  {
    id: 'term-5',
    term: 'Péri- / Endo-',
    category: 'Préfixe',
    origin: 'Grec',
    meaning: 'Autour de / À l’intérieur de',
    exampleWord: 'Péricardite',
    exampleDecomposition: 'péri- (autour) + card- (cœur) + -ite (inflammation)',
    exampleDefinition: 'Inflammation des feuillets du péricarde enveloppant le cœur.',
  },
  {
    id: 'term-6',
    term: '-ite',
    category: 'Suffixe',
    origin: 'Grec',
    meaning: 'Inflammation',
    exampleWord: 'Hépatite',
    exampleDecomposition: 'hépat- (foie) + -ite (inflammation)',
    exampleDefinition: 'Inflammation aiguë ou chronique du parenchyme hépatique.',
  },
  {
    id: 'term-7',
    term: '-ectomie',
    category: 'Suffixe',
    origin: 'Grec',
    meaning: 'Ablation chirurgicale (exérèse)',
    exampleWord: 'Appendicectomie',
    exampleDecomposition: 'appendic- (appendice) + -ectomie (ablation)',
    exampleDefinition: 'Ablation chirurgicale de l’appendice iléo-cæcal.',
  },
  {
    id: 'term-8',
    term: '-tomie / -stomie',
    category: 'Suffixe',
    origin: 'Grec',
    meaning: 'Incision, ouverture / Abouchement chirurgical à la peau ou à un autre organe',
    exampleWord: 'Trachéotomie',
    exampleDecomposition: 'trachéo- (trachée) + -tomie (ouverture)',
    exampleDefinition: 'Ouverture chirurgicale de la face antérieure de la trachée.',
  },
  {
    id: 'term-9',
    term: '-algie / -dynie',
    category: 'Suffixe',
    origin: 'Grec',
    meaning: 'Douleur',
    exampleWord: 'Névralgie',
    exampleDecomposition: 'névr- (nerf) + -algie (douleur)',
    exampleDefinition: 'Douleur ressentie sur le trajet d’un nerf sensitif.',
  },
  {
    id: 'term-10',
    term: '-mégalie',
    category: 'Suffixe',
    origin: 'Grec',
    meaning: 'Augmentation anormale de volume',
    exampleWord: 'Splénomégalie',
    exampleDecomposition: 'splén(o)- (rate) + -mégalie (gros volume)',
    exampleDefinition: 'Augmentation pathologique du volume de la rate.',
  },
  {
    id: 'term-11',
    term: 'Cardi(o)-',
    category: 'Racine',
    origin: 'Grec',
    meaning: 'Cœur',
    exampleWord: 'Électrocardiogramme',
    exampleDecomposition: 'électro- + cardi(o)- (cœur) + -gramme (tracé)',
    exampleDefinition: 'Tracé de l’activité électrique du cœur.',
  },
  {
    id: 'term-12',
    term: 'Pneum(o)- / Pulmon-',
    category: 'Racine',
    origin: 'Mixte',
    meaning: 'Poumon, air',
    exampleWord: 'Pneumothorax',
    exampleDecomposition: 'pneumo- (air) + thorax (cage thoracique)',
    exampleDefinition: 'Présence d’air dans la cavité pleurale.',
  },
  {
    id: 'term-13',
    term: 'Néphr(o)- / Rén-',
    category: 'Racine',
    origin: 'Mixte',
    meaning: 'Rein (grec néphr- / latin rén-)',
    exampleWord: 'Néphrectomie',
    exampleDecomposition: 'néphr- (rein) + -ectomie (ablation)',
    exampleDefinition: 'Ablation chirurgicale totale ou partielle d’un rein.',
  },
  {
    id: 'term-14',
    term: 'Osté(o)-',
    category: 'Racine',
    origin: 'Grec',
    meaning: 'Os',
    exampleWord: 'Ostéoporose',
    exampleDecomposition: 'ostéo- (os) + -porose (pores, fragilité)',
    exampleDefinition: 'Diminution diffuse de la densité minérale osseuse.',
  },
  {
    id: 'term-15',
    term: 'Céphal(o)-',
    category: 'Anatomique',
    origin: 'Grec',
    meaning: 'Tête, extrémité supérieure (direction crâniale)',
    exampleWord: 'Céphalée',
    exampleDecomposition: 'céphal- (tête) + -ée (douleur)',
    exampleDefinition: 'Douleur siégeant au niveau de la boîte crânienne (mal de tête).',
  },
  {
    id: 'term-16',
    term: 'Hémat(o)- / -émie',
    category: 'Physiologique',
    origin: 'Grec',
    meaning: 'Sang / Présence ou concentration dans le sang',
    exampleWord: 'Anémie',
    exampleDecomposition: 'an- (absence/diminution) + -émie (sang)',
    exampleDefinition: 'Diminution du taux d’hémoglobine fonctionnelle dans le sang.',
  },
  {
    id: 'term-17',
    term: '-pathie / -ose',
    category: 'Pathologique',
    origin: 'Grec',
    meaning: 'Affection, maladie / Dégénérescence non inflammatoire',
    exampleWord: 'Arthrose',
    exampleDecomposition: 'arthr- (articulation) + -ose (dégénérescence)',
    exampleDefinition: 'Atteinte dégénérative mécanique du cartilage articulaire.',
  },
  {
    id: 'term-18',
    term: 'Auscultation / Palpation',
    category: 'Clinique',
    origin: 'Latin',
    meaning: 'Écoute des bruits corporels / Examen tactile manuel',
    exampleWord: 'Auscultation cardiaque',
    exampleDecomposition: 'auscultare (écouter attentivement)',
    exampleDefinition: 'Temps de l’examen clinique utilisant le stéthoscope pour analyser les bruits B1/B2 et les souffles.',
  },
];

export const terminologieChapters: Chapter[] = [
  {
    id: 'term-ch-1',
    moduleId: 'terminologie',
    order: 1,
    title: 'Structure des mots médicaux : préfixes, racines et suffixes',
    description:
      'Règles de composition étymologique gréco-latine et décomposition systématique du vocabulaire médical.',
    lessons: [
      {
        id: 'term-bases-1',
        moduleId: 'terminologie',
        chapterId: 'term-ch-1',
        title: 'Décomposer et comprendre tout terme médical',
        subtitle: 'Méthode d’analyse morphologique en 3 temps : suffixe, préfixe et radical',
        estimatedMinutes: 20,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Radical (racine)',
            definition:
              'Élément central du mot qui désigne généralement l’organe, le tissu ou la substance concernée (ex. cardi- pour cœur, hépat- pour foie).',
          },
          {
            term: 'Préfixe et Suffixe',
            definition:
              'Le préfixe précise l’intensité, la localisation ou le rythme (brady-, péri-, hyper-) ; le suffixe indique l’action diagnostique, chirurgicale ou la nature de l’atteinte (-ite, -ectomie, -scopie).',
          },
        ],
        sections: [
          {
            id: 'term-methode',
            kind: 'methode',
            title: '1. Méthode de lecture d’un terme médical',
            paragraphs: [
              'Pour décoder un terme médical inconnu, lisez-le toujours à l’envers : commencez par le SUFFIXE (ce qui se passe), puis le PRÉFIXE (où / comment), et enfin le RADICAL (quel organe).',
              'Exemple : « Cholécystectomie » → -ectomie (ablation chirurgicale) + cyst(o)- (vésicule/sac) + cholé- (bile) = ablation chirurgicale de la vésicule biliaire.',
            ],
            bulletPoints: [
              'Les racines grecques servent le plus souvent à former les termes pathologiques et chirurgicaux (ex. néphrite, néphrectomie).',
              'Les racines latines forment souvent les adjectifs anatomiques correspondants (ex. artère rénale, cortex rénal).',
              'Une voyelle de liaison (souvent -o-) unit deux racines ou une racine et un suffixe débutant par une consonne (ex. électr-o-cardio-gramme).',
            ],
          },
          {
            id: 'term-plans',
            kind: 'structures',
            title: '2. Terminologie anatomique de position et d’orientation',
            paragraphs: [
              'La description anatomique utilise un référentiel universel (position anatomique de référence : sujet debout, face à l’observateur, membres supérieurs pendants, paumes tournées en avant).',
            ],
            table: {
              caption: 'Couples d’orientation anatomique fondamentaux',
              headers: ['Terme', 'Signification', 'Terme opposé'],
              rows: [
                ['Médial (interne)', 'Proche du plan sagittal médian', 'Latéral (externe)'],
                ['Crânial (supérieur)', 'Vers la tête / le haut', 'Caudal (inférieur)'],
                ['Ventral (antérieur)', 'Vers la face avant du corps', 'Dorsal (postérieur)'],
                ['Proximal', 'Proche de la racine du membre ou de l’origine', 'Distal (éloigné)'],
                ['Homolatéral (ipsilatéral)', 'Du même côté', 'Controlatéral (côté opposé)'],
              ],
            },
          },
        ],
        examTips: [
          'Ne confondez jamais -tomie (simple incision/ouverture), -stomie (création d’un orifice permanent abouché à l’extérieur) et -ectomie (ablation totale ou partielle).',
        ],
      },
    ],
  },
  {
    id: 'term-ch-2',
    moduleId: 'terminologie',
    order: 2,
    title: 'Terminologie physiologique, pathologique et clinique',
    description:
      'Vocabulaire de la sémiologie clinique, des constantes physiologiques et des grands syndromes médicaux.',
    lessons: [
      {
        id: 'term-clinique-2',
        moduleId: 'terminologie',
        chapterId: 'term-ch-2',
        title: 'Du symptôme au diagnostic : vocabulaire clinique et physiologique',
        subtitle: 'Maîtriser le langage médical dès la première année hospitalière',
        estimatedMinutes: 20,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Symptôme vs Signe clinique',
            definition:
              'Un symptôme (signe fonctionnel) est ressenti subjectivement par le patient (ex. douleur, dyspnée). Un signe clinique (physique) est objectivé par le médecin lors de l’examen (ex. souffle cardiaque, ictère).',
          },
          {
            term: 'Syndrome',
            definition:
              'Ensemble cohérent de symptômes et de signes cliniques ou paracliniques orientant vers un mécanisme commun (ex. syndrome méningé, syndrome néphrotique).',
          },
        ],
        sections: [
          {
            id: 'term-clin-1',
            kind: 'clinique',
            title: '1. Termes cliniques et physiologiques incontournables',
            paragraphs: [
              'La maîtrise des termes sémiologiques permet une communication précise et sans ambiguïté dans le dossier médical.',
            ],
            bulletPoints: [
              'Apyrétique : sans fièvre (température normale ≈ 37 °C) ; Fébrile / Hyperthermie : fièvre.',
              'Cyanose : coloration bleutée des téguments par excès d’hémoglobine réduite (> 5 g/dL dans le sang capillaire).',
              'Ictère : coloration jaune des téguments et des muqueuses par hyperbilirubinémie.',
              'Hémoptysie : rejet par la bouche de sang rouge provenant des voies respiratoires sous-glottiques lors d’un effort de toux.',
              'Hématémèse : vomissement de sang d’origine digestive haute (œsophage, estomac, duodénum).',
              'Hématurie : présence de sang dans les urines.',
            ],
          },
        ],
        examTips: [
          'Distinguez bien Hémoptysie (toux → origine respiratoire) et Hématémèse (vomissement → origine digestive haute).',
        ],
      },
    ],
  },
];

export const terminologieFlashcards: Flashcard[] = terminologyDictionary.slice(0, 12).map((entry, idx) => ({
  id: `term-fc-${idx + 1}`,
  moduleId: 'terminologie',
  chapterId: idx < 8 ? 'term-ch-1' : 'term-ch-2',
  chapterTitle: entry.category,
  front: `Que signifie l’élément médical « ${entry.term} » (${entry.origin}) ?`,
  back: `${entry.meaning} — Exemple : ${entry.exampleWord}`,
  explanation: `${entry.exampleDecomposition} → ${entry.exampleDefinition}`,
  category: entry.category,
  pronunciationText: `${entry.exampleWord}. ${entry.exampleDefinition}`,
}));

export const terminologieQcms: QcmQuestion[] = [
  {
    id: 'term-qcm-1',
    moduleId: 'terminologie',
    chapterId: 'term-ch-1',
    chapterTitle: 'Préfixes, suffixes et racines',
    type: 'single',
    question: 'Que signifie littéralement le terme « Cholécystectomie » ?',
    options: [
      'Incision exploratrice de la vessie',
      'Ablation chirurgicale de la vésicule biliaire',
      'Inflammation chronique des voies biliaires',
      'Abouchement du côlon à la peau',
    ],
    correctIndices: [1],
    explanation: 'cholé- (bile) + cyst- (vésicule) + -ectomie (ablation chirurgicale).',
    difficulty: 'Facile',
  },
  {
    id: 'term-qcm-2',
    moduleId: 'terminologie',
    chapterId: 'term-ch-1',
    chapterTitle: 'Préfixes, suffixes et racines',
    type: 'single',
    question: 'Quel suffixe désigne la création chirurgicale d’un abouchement ou orifice permanent ?',
    options: ['-tomie', '-ectomie', '-stomie', '-scopie'],
    correctIndices: [2],
    explanation:
      '-stomie signifie bouche/ouverture maintenue (ex. colostomie, trachéostomie), alors que -tomie est une simple incision et -ectomie une ablation.',
    difficulty: 'Facile',
  },
  {
    id: 'term-qcm-3',
    moduleId: 'terminologie',
    chapterId: 'term-ch-2',
    chapterTitle: 'Terminologie clinique',
    type: 'single',
    question: 'Comment nomme-t-on le rejet de sang rouge lors d’un effort de toux provenant des voies aériennes ?',
    options: ['Hématémèse', 'Hémoptysie', 'Méléna', 'Épistaxis'],
    correctIndices: [1],
    explanation:
      'L’hémoptysie vient des voies respiratoires (à la toux) ; l’hématémèse est un vomissement sanglant digestif ; l’épistaxis est un saignement de nez.',
    difficulty: 'Moyen',
  },
  {
    id: 'term-qcm-4',
    moduleId: 'terminologie',
    chapterId: 'term-ch-1',
    chapterTitle: 'Terminologie anatomique',
    type: 'boolean',
    question:
      'Vrai ou Faux : Sur le membre supérieur en position anatomique de référence, le poignet est PROXIMAL par rapport au coude.',
    options: ['Vrai', 'Faux'],
    correctIndices: [1],
    explanation:
      'Faux. Le poignet est plus éloigné de la racine du membre (épaule) que le coude : il est donc DISTAL par rapport au coude.',
    difficulty: 'Facile',
  },
];

export const decompositionExercises = [
  {
    id: 'decomp-1',
    word: 'Péricardite',
    parts: [
      { segment: 'péri-', role: 'Préfixe', meaning: 'autour de' },
      { segment: 'card-', role: 'Racine', meaning: 'cœur' },
      { segment: '-ite', role: 'Suffixe', meaning: 'inflammation' },
    ],
    fullDefinition: 'Inflammation des feuillets enveloppant le cœur (le péricarde).',
  },
  {
    id: 'decomp-2',
    word: 'Bradycardie',
    parts: [
      { segment: 'brady-', role: 'Préfixe', meaning: 'lent' },
      { segment: 'card-', role: 'Racine', meaning: 'cœur' },
      { segment: '-ie', role: 'Suffixe', meaning: 'état / phénomène' },
    ],
    fullDefinition: 'Ralentissement de la fréquence cardiaque (< 60 battements/min).',
  },
  {
    id: 'decomp-3',
    word: 'Néphrectomie',
    parts: [
      { segment: 'néphr-', role: 'Racine', meaning: 'rein' },
      { segment: '-ectomie', role: 'Suffixe', meaning: 'ablation chirurgicale' },
    ],
    fullDefinition: 'Ablation chirurgicale totale ou partielle d’un rein.',
  },
  {
    id: 'decomp-4',
    word: 'Hyperglycémie',
    parts: [
      { segment: 'hyper-', role: 'Préfixe', meaning: 'au-dessus / excès' },
      { segment: 'glyc-', role: 'Racine', meaning: 'sucre / glucose' },
      { segment: '-émie', role: 'Suffixe', meaning: 'dans le sang' },
    ],
    fullDefinition: 'Concentration élevée de glucose dans le sang.',
  },
];

export const translationExercises = [
  {
    id: 'trad-1',
    layman: 'Douleur au niveau d’un nerf',
    medical: 'Névralgie',
    accepted: ['nevralgie', 'névralgie'],
    hint: 'névr- (nerf) + -algie (douleur)',
  },
  {
    id: 'trad-2',
    layman: 'Augmentation anormale du volume du foie',
    medical: 'Hépatomégalie',
    accepted: ['hepatomegalie', 'hépatomégalie'],
    hint: 'hépat(o)- (foie) + -mégalie (gros volume)',
  },
  {
    id: 'trad-3',
    layman: 'Difficulté à respirer',
    medical: 'Dyspnée',
    accepted: ['dyspnee', 'dyspnée'],
    hint: 'dys- (difficile) + -pnée (respiration)',
  },
  {
    id: 'trad-4',
    layman: 'Présence de sang dans les urines',
    medical: 'Hématurie',
    accepted: ['hematurie', 'hématurie'],
    hint: 'hémat- (sang) + -urie (urine)',
  },
];
