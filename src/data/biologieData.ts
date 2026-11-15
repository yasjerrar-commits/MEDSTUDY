import type { Chapter, Flashcard, QcmQuestion } from '../types/medstudy';

export const biologieChapters: Chapter[] = [
  {
    id: 'biol-ch-1',
    moduleId: 'biologie',
    order: 1,
    title: 'La cellule eucaryote et la membrane plasmique',
    description:
      'Architecture des organites cellulaires, modèle de la mosaïque fluide, transports membranaires passifs, actifs et vésiculaires.',
    lessons: [
      {
        id: 'biol-cellule-membrane',
        moduleId: 'biologie',
        chapterId: 'biol-ch-1',
        title: 'Organisation de la cellule eucaryote et dynamique membranaire',
        subtitle:
          'Des compartiments intracellulaires (système endomembranaire, mitochondries) aux mécanismes de transport transmembranaire',
        estimatedMinutes: 30,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Modèle de la mosaïque fluide (Singer et Nicolson, 1972)',
            definition:
              'Structure dynamique de la membrane plasmique constituée d’une bicouche asymétrique de phospholipides dans laquelle s’insèrent des protéines intrinsèques et extrinsèques mobiles latéralement, stabilisée par le cholestérol.',
          },
          {
            term: 'Système endomembranaire',
            definition:
              'Ensemble des compartiments intracellulaires délimités par une membrane simple communiquant par flux vésiculaire : enveloppe nucléaire, réticulum endoplasmique (REG/REL), appareil de Golgi, endosomes et lysosomes.',
          },
        ],
        sections: [
          {
            id: 'biol-cell-intro',
            kind: 'introduction',
            title: '1. Vue d’ensemble : de la cellule procaryote à la cellule eucaryote',
            paragraphs: [
              'La cellule est l’unité structurale et fonctionnelle fondamentale du vivant. Contrairement aux procaryotes (bactéries, dépourvues de noyau vrai et d’organites membranaires), la cellule eucaryote humaine possède un noyau délimité par une double enveloppe nucléaire et un cytoplasme compartimenté en organites spécialisés.',
              'Cette compartimentation permet de réaliser simultanément des réactions biochimiques incompatibles (ex. synthèse protéique dans le cytosol/REG et digestion enzymatique acide dans le lysosome).',
            ],
          },
          {
            id: 'biol-cell-membrane',
            kind: 'structures',
            title: '2. Membrane plasmique et transports transmembranaires',
            paragraphs: [
              'La membrane plasmique (~7,5 nm d’épaisseur) forme une barrière sélective hydrophobe. Sa face extracellulaire porte le glycocalyx (chaînes oligosaccharidiques des glycoprotéines et glycolipides) impliqué dans la reconnaissance cellulaire.',
            ],
            table: {
              caption: 'Classification des transports à travers la membrane plasmique',
              headers: ['Type de transport', 'Sens du gradient', 'Consommation d’ATP', 'Exemples médicaux'],
              rows: [
                ['Diffusion simple', 'Du + concentré vers le − concentré', 'Non (passif)', 'O₂, CO₂, hormones stéroïdiennes, éthanol'],
                ['Diffusion facilitée', 'Selon le gradient électrochimique (via canal ou perméase)', 'Non (passif)', 'Transporteur GLUT (glucose), aquaporines (eau), canaux K⁺'],
                ['Transport actif primaire', 'Contre le gradient (pompe ATPase)', 'Oui (hydrolyse directe d’ATP)', 'Pompe Na⁺/K⁺-ATPase (sort 3 Na⁺, entre 2 K⁺)'],
                ['Transport actif secondaire', 'Couplé au gradient d’un ion (souvent Na⁺)', 'Indirecte (maintien du gradient Na⁺)', 'Cotransport SGLT1/SGLT2 (glucose + Na⁺ dans l’intestin et le rein)'],
                ['Transport vésiculaire', 'Déformation membranaire (endocytose / exocytose)', 'Oui (GTP/ATP + cytosquelette)', 'Phagocytose des bactéries, exocytose de l’insuline'],
              ],
            },
          },
          {
            id: 'biol-cell-organites',
            kind: 'interne',
            title: '3. Principaux organites cellulaires et leurs fonctions',
            paragraphs: [
              'Chaque organite assure une étape précise du métabolisme et de l’homéostasie cellulaire :',
            ],
            bulletPoints: [
              'Réticulum endoplasmique rugueux (REG) : parsemé de ribosomes ; assure la traduction et le repliement des protéines sécrétées, membranaires ou lysosomales ainsi que la N-glycosylation initiale.',
              'Réticulum endoplasmique lisse (REL) : dépourvu de ribosomes ; synthèse des lipides/stéroïdes, détoxification hépatique (cytochromes P450) et stockage du calcium (Ca²⁺, réticulum sarcoplasmique dans le muscle).',
              'Appareil de Golgi : empilement de saccules (face cis d’entrée, face trans de sortie) ; maturation (O-glycosylation, sulfatation) et adressage des protéines (ex. signal mannose-6-phosphate vers les lysosomes).',
              'Lysosomes : vésicules acides (pH ≈ 4,5–5 maintenu par une pompe à protons V-ATPase) riches en hydrolases acides assurant la digestion intracellulaire et l’autophagie.',
              'Mitochondries : organites semi-autonomes à double membrane possédant leur propre ADN circulaire (d’origine maternelle) et produisant l’essentiel de l’ATP par phosphorylation oxydative.',
              'Peroxysomes : β-oxydation des acides gras à très longue chaîne et détoxification du peroxyde d’hydrogène (H₂O₂) par la catalase.',
            ],
          },
          {
            id: 'biol-cell-clinique',
            kind: 'clinique',
            title: '4. Corrélations cliniques',
            paragraphs: [
              'Un défaut d’adressage des enzymes lysosomales (absence de phosphorylation du mannose-6-phosphate dans le Golgi) entraîne une maladie de surcharge lysosomale sévère (maladie des cellules à inclusions / mucolipidose de type II).',
              'La mucoviscidose résulte de mutations du canal chlorure CFTR (transport actif de type ABC), provoquant un défaut d’hydratation du mucus bronchique et pancréatique.',
            ],
          },
        ],
        examTips: [
          'La pompe Na⁺/K⁺-ATPase est électrogène : elle expulse 3 ions Na⁺ hors de la cellule pour 2 ions K⁺ entrés, contribuant directement à la négativité intracellulaire.',
          'Les mitochondries sont héritées exclusivement de la mère lors de la fécondation (l’ovocyte fournit la quasi-totalité du cytoplasme).',
        ],
      },
    ],
  },
  {
    id: 'biol-ch-2',
    moduleId: 'biologie',
    order: 2,
    title: 'Cycle cellulaire, mitose et méiose',
    description:
      'Réplication de l’ADN, régulation par les complexes cyclines-CDK, division somatique (mitose) et division réductionnelle (méiose).',
    lessons: [
      {
        id: 'biol-cycle-divisions',
        moduleId: 'biologie',
        chapterId: 'biol-ch-2',
        title: 'Du cycle cellulaire à la mitose et la méiose',
        subtitle: 'Maintien du patrimoine génétique diploïde et production des gamètes haploïdes',
        estimatedMinutes: 28,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Interphase (G1, S, G2)',
            definition:
              'Période préparatoire représentant environ 90 % de la durée du cycle cellulaire, comprenant la croissance (G1), la réplication semi-conservative de l’ADN (phase S) et la vérification pré-mitotique (G2).',
          },
          {
            term: 'Crossing-over (enjambement)',
            definition:
              'Échange réciproque de segments de chromatides entre chromosomes homologues appariés durant la prophase I (pachytène) de la méiose, générant un brassage intrachromosomique.',
          },
        ],
        sections: [
          {
            id: 'biol-cycle-reg',
            kind: 'principe',
            title: '1. Phases et régulation du cycle cellulaire',
            paragraphs: [
              'Les cellules somatiques humaines possèdent 2n = 46 chromosomes. En phase G1, chaque chromosome comporte 1 chromatide (quantité d’ADN = 2C). Au cours de la phase S, l’ADN polymérase réplique semi-conservativement l’ADN : chaque chromosome possède alors 2 chromatides sœurs identiques (quantité d’ADN = 4C).',
              'La progression est contrôlée par des complexes Cycline-CDK et des points de contrôle (checkpoints G1/S avec la protéine p53 et Rb, G2/M, et point d’assemblage du fuseau en métaphase).',
            ],
          },
          {
            id: 'biol-mitose-meiose',
            kind: 'structures',
            title: '2. Comparaison Mitose vs Méiose',
            paragraphs: [
              'Alors que la mitose assure le renouvellement tissulaire à l’identique, la méiose réduit de moitié le nombre de chromosomes dans les cellules germinales pour former des gamètes haploïdes (n = 23).',
            ],
            table: {
              caption: 'Différences fondamentales entre mitose et méiose',
              headers: ['Critère', 'Mitose', 'Méiose'],
              rows: [
                ['Cellules concernées', 'Cellules somatiques (2n)', 'Cellules germinales (2n → n)'],
                ['Nombre de divisions', '1 division (PMAT)', '2 divisions successives (Méiose I réductionnelle + Méiose II équationnelle)'],
                ['Appariement des homologues', 'Non', 'Oui en Prophase I (tétrades / bivalents + crossing-over)'],
                ['Cellules filles obtenues', '2 cellules diploïdes (2n) génétiquement identiques', '4 cellules haploïdes (n) génétiquement uniques'],
              ],
            },
          },
          {
            id: 'biol-div-clinique',
            kind: 'clinique',
            title: '3. Corrélations cliniques : aneuploïdies et oncologie',
            paragraphs: [
              'Une non-disjonction méiotique des chromosomes homologues (méiose I) ou des chromatides sœurs (méiose II) produit des gamètes aneuploïdes responsables de trisomies (ex. trisomie 21) ou monosomies (ex. syndrome de Turner 45,X).',
              'En cancérologie, la perte de fonction de gènes suppresseurs de tumeurs comme TP53 (« gardien du génome ») abolit le point de contrôle G1/S et permet la prolifération de cellules portant des cassures de l’ADN.',
            ],
          },
        ],
        examTips: [
          'En mitose, l’alignement des chromosomes sur la plaque équatoriale caractérise la MÉTAPHASE ; la séparation des chromatides sœurs vers les pôles caractérise l’ANAPHASE.',
        ],
      },
    ],
  },
  {
    id: 'biol-ch-3',
    moduleId: 'biologie',
    order: 3,
    title: 'Expression génique et première semaine d’embryologie',
    description:
      'Transcription, épissage des introns/exons, traduction ribosomique et premières étapes du développement embryonnaire humain.',
    lessons: [
      {
        id: 'biol-gene-embryo',
        moduleId: 'biologie',
        chapterId: 'biol-ch-3',
        title: 'Du gène à la protéine et début du développement embryonnaire',
        subtitle: 'Dogme central de la biologie moléculaire et chronologie de la 1re semaine de grossesse',
        estimatedMinutes: 25,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Épissage alternatif',
            definition:
              'Processus nucléaire assuré par le splicéosome qui excise les introns (séquences non codantes) et raccorde différemment les exons (séquences codantes), permettant à un seul gène de coder plusieurs isoformes protéiques.',
          },
          {
            term: 'Blastocyste',
            definition:
              'Stade embryonnaire atteint vers le 5e jour après fécondation, comprenant une cavité (blastocèle), un bouton embryonnaire interne (embryoblaste → futur embryon) et une couche externe (trophoblaste → futur placenta).',
          },
        ],
        sections: [
          {
            id: 'biol-dogme',
            kind: 'principe',
            title: '1. Transcription, maturation et traduction',
            paragraphs: [
              'Dans le noyau, l’ARN polymérase II transcrit l’ADN en pré-ARNm dans le sens 5′ → 3′. Avant de sortir par les pores nucléaires, le pré-ARNm reçoit une coiffe en 5′ (7-méthylguanosine), une queue poly-A en 3′ et subit l’épissage des introns.',
              'Dans le cytosol, le ribosome (sous-unités 40S + 60S chez les eucaryotes = 80S) traduit l’ARNm en protéine en lisant les codons par triplets (codon d’initiation AUG = Méthionine ; codons stop UAA, UAG, UGA). Le code génétique est universel, non chevauchant et dégénéré (redondant).',
            ],
          },
          {
            id: 'biol-embryo-s1',
            kind: 'situation',
            title: '2. Première semaine du développement embryonnaire (J1 à J7)',
            paragraphs: [
              'La fécondation a lieu habituellement dans le tiers externe (ampoule) de la trompe utérine et forme le zygote diploïde. Pendant sa migration vers la cavité utérine, le zygote subit des mitoses rapides sans augmentation de volume global (segmentation) :',
            ],
            bulletPoints: [
              'J1 : Fécondation et formation du zygote (restauration de la diploïdie, détermination du sexe génétique).',
              'J2–J3 : Stade 2, 4, 8 blastomères puis compaction.',
              'J4 : Stade morula (16 à 32 cellules) arrivant dans la cavité utérine.',
              'J5 : Formation du blastocyste (embryoblaste + trophoblaste + blastocèle) et éclosion de la zone pellucide.',
              'J6–J7 : Début de la nidation (implantation) dans l’endomètre utérin en phase sécrétoire.',
            ],
          },
        ],
        examTips: [
          'La zone pellucide empêche la polyspermie lors de la fécondation et évite une nidation précoce ectopique dans la trompe avant J5.',
        ],
      },
    ],
  },
];

export const biologieFlashcards: Flashcard[] = [
  {
    id: 'biol-fc-1',
    moduleId: 'biologie',
    chapterId: 'biol-ch-1',
    chapterTitle: 'Cellule & Membrane',
    front: 'Quel est le bilan ionique d’un cycle de la pompe Na⁺/K⁺-ATPase ?',
    back: 'Elle expulse 3 ions Na⁺ vers le milieu extracellulaire et fait entrer 2 ions K⁺ dans le cytosol en hydrolysant 1 ATP.',
    explanation: 'C’est un transport actif primaire électrogène indispensable au potentiel de repos.',
  },
  {
    id: 'biol-fc-2',
    moduleId: 'biologie',
    chapterId: 'biol-ch-1',
    chapterTitle: 'Cellule & Membrane',
    front: 'Quel signal moléculaire oriente les hydrolases néosynthétisées du Golgi vers les lysosomes ?',
    back: 'Le résidu Mannose-6-Phosphate (M6P).',
  },
  {
    id: 'biol-fc-3',
    moduleId: 'biologie',
    chapterId: 'biol-ch-1',
    chapterTitle: 'Cellule & Membrane',
    front: 'Quel organite dégrade le peroxyde d’hydrogène (H₂O₂) grâce à la catalase ?',
    back: 'Le peroxysome.',
  },
  {
    id: 'biol-fc-4',
    moduleId: 'biologie',
    chapterId: 'biol-ch-2',
    chapterTitle: 'Cycle cellulaire',
    front: 'À quelle phase de la méiose se produit le crossing-over (brassage intrachromosomique) ?',
    back: 'En Prophase I (stade pachytène).',
  },
  {
    id: 'biol-fc-5',
    moduleId: 'biologie',
    chapterId: 'biol-ch-2',
    chapterTitle: 'Cycle cellulaire',
    front: 'Quelle est la quantité d’ADN d’une cellule somatique humaine en phase G2 avant la mitose ?',
    back: '4C (2n = 46 chromosomes bichromatidiens), contre 2C en G1.',
  },
  {
    id: 'biol-fc-6',
    moduleId: 'biologie',
    chapterId: 'biol-ch-3',
    chapterTitle: 'Génétique & Embryologie',
    front: 'Quels sont les trois codons STOP (non-sens) du code génétique ?',
    back: 'UAA, UAG et UGA (et AUG est le codon initiateur codant la méthionine).',
  },
  {
    id: 'biol-fc-7',
    moduleId: 'biologie',
    chapterId: 'biol-ch-3',
    chapterTitle: 'Génétique & Embryologie',
    front: 'Où se déroule normalement la fécondation et quand commence la nidation ?',
    back: 'Fécondation dans l’ampoule de la trompe utérine (J1) ; nidation dans l’endomètre à J6–J7 au stade blastocyste.',
  },
];

export const biologieQcms: QcmQuestion[] = [
  {
    id: 'biol-qcm-1',
    moduleId: 'biologie',
    chapterId: 'biol-ch-1',
    chapterTitle: 'Cellule & Membrane',
    type: 'multiple',
    question: 'Concernant les organites de la cellule eucaryote, quelles propositions sont exactes ?',
    options: [
      'Le réticulum endoplasmique lisse participe à la détoxification hépatique et au stockage calcique',
      'Les lysosomes maintiennent un pH acide grâce à des pompes à protons ATP-dépendantes',
      'L’ADN mitochondrial humain est transmis de façon exclusivement paternelle',
      'La face cis de l’appareil de Golgi reçoit les vésicules provenant du réticulum endoplasmique',
    ],
    correctIndices: [0, 1, 3],
    explanation:
      'L’ADN mitochondrial humain est d’origine exclusivement MATERNELLE (apporté par le cytoplasme ovocytaire). Les autres affirmations sont exactes.',
    difficulty: 'Facile',
  },
  {
    id: 'biol-qcm-2',
    moduleId: 'biologie',
    chapterId: 'biol-ch-1',
    chapterTitle: 'Cellule & Membrane',
    type: 'single',
    question:
      'Par quel mécanisme le transporteur GLUT permet-il l’entrée du glucose selon son gradient de concentration sans hydrolyser directement d’ATP ?',
    options: [
      'Diffusion simple à travers la bicouche lipidique',
      'Diffusion facilitée (transport passif via perméase)',
      'Transport actif primaire',
      'Endocytose par cavéoles',
    ],
    correctIndices: [1],
    explanation:
      'Les transporteurs GLUT (ex. GLUT1, GLUT4) assurent une diffusion facilitée passive selon le gradient de concentration du glucose.',
    difficulty: 'Facile',
  },
  {
    id: 'biol-qcm-3',
    moduleId: 'biologie',
    chapterId: 'biol-ch-2',
    chapterTitle: 'Cycle cellulaire',
    type: 'single',
    question:
      'À quelle phase de la mitose les chromatides sœurs se séparent-elles pour migrer vers les pôles opposés du fuseau ?',
    options: ['Prophase', 'Métaphase', 'Anaphase', 'Télophase'],
    correctIndices: [2],
    explanation:
      'La séparation synchrone des chromatides sœurs après clivage des cohésines définit l’anaphase.',
    difficulty: 'Facile',
  },
  {
    id: 'biol-qcm-4',
    moduleId: 'biologie',
    chapterId: 'biol-ch-2',
    chapterTitle: 'Cycle cellulaire',
    type: 'boolean',
    question:
      'Vrai ou Faux : La méiose I est une division équationnelle qui sépare les chromatides sœurs sans appariement des chromosomes homologues.',
    options: ['Vrai', 'Faux'],
    correctIndices: [1],
    explanation:
      'Faux. La méiose I est RÉDUCTIONNELLE : elle apparie les chromosomes homologues en prophase I (crossing-over) puis les sépare en anaphase I (2n → n). La méiose II est équationnelle.',
    difficulty: 'Moyen',
  },
  {
    id: 'biol-qcm-5',
    moduleId: 'biologie',
    chapterId: 'biol-ch-3',
    chapterTitle: 'Génétique & Embryologie',
    type: 'multiple',
    question: 'Concernant l’expression des gènes chez les eucaryotes, quelles réponses sont justes ?',
    options: [
      'L’épissage consiste à retirer les introns et à relier les exons dans le noyau',
      'La traduction s’effectue au niveau des ribosomes cytosoliques ou liés au REG',
      'Le codon AUG correspond au signal stop de la traduction',
      'Un gène unique peut donner plusieurs protéines différentes grâce à l’épissage alternatif',
    ],
    correctIndices: [0, 1, 3],
    explanation:
      'AUG est le codon INITIATEUR (Méthionine). Les codons stop sont UAA, UAG et UGA.',
    difficulty: 'Moyen',
  },
  {
    id: 'biol-qcm-6',
    moduleId: 'biologie',
    chapterId: 'biol-ch-3',
    chapterTitle: 'Génétique & Embryologie',
    type: 'single',
    question:
      'Au cours de la 1re semaine du développement embryonnaire, à quel stade l’embryon s’implante-t-il dans la muqueuse utérine (J6–J7) ?',
    options: ['Stade zygote', 'Stade 4 blastomères', 'Stade morula compacte', 'Stade blastocyste'],
    correctIndices: [3],
    explanation:
      'Après la compaction (morula à J4), la cavitation forme le blastocyste à J5, qui éclot de la zone pellucide et s’implante à J6–J7.',
    difficulty: 'Facile',
  },
];
