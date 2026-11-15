import type { Chapter, Flashcard, QcmQuestion } from '../types/medstudy';

export const santePubliqueChapters: Chapter[] = [
  {
    id: 'sp-ch-1',
    moduleId: 'sante-publique',
    order: 1,
    title: 'Introduction, déterminants et indicateurs de santé',
    description:
      'Définition de la santé (OMS), déterminants de la santé (Lalonde, Dahlgren-Whitehead) et principaux indicateurs démographiques et sanitaires.',
    lessons: [
      {
        id: 'sp-intro-det-ind',
        moduleId: 'sante-publique',
        chapterId: 'sp-ch-1',
        title: 'Santé publique, déterminants et indicateurs de santé',
        subtitle: 'De la santé individuelle à l’action collective : mesurer l’état de santé d’une population',
        estimatedMinutes: 25,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Santé (OMS, 1946)',
            definition:
              '« État de complet bien-être physique, mental et social, et ne consiste pas seulement en une absence de maladie ou d’infirmité. »',
          },
          {
            term: 'Santé publique (Winslow / OMS)',
            definition:
              'Science et art de prévenir les maladies, prolonger la vie et promouvoir la santé physique et mentale par les efforts organisés de la collectivité.',
          },
        ],
        sections: [
          {
            id: 'sp-det-1',
            kind: 'introduction',
            title: '1. Déterminants de la santé (Modèle de Lalonde)',
            paragraphs: [
              'La santé d’une population ne dépend pas uniquement de la qualité des soins médicaux : elle résulte de l’interaction de quatre grands groupes de déterminants identifiés par le rapport Lalonde (1974) et enrichis par les déterminants sociaux de l’OMS.',
            ],
            bulletPoints: [
              'Biologie humaine & génétique : patrimoine génétique, âge, sexe, vieillissement.',
              'Environnement : qualité de l’eau, de l’air, logement, hygiène, contexte socio-économique, niveau d’éducation et accès au revenu.',
              'Habitudes de vie et comportements : tabagisme, alimentation, activité physique, alcool, observance.',
              'Système de soins et services de santé : accessibilité géographique et financière, qualité et continuité des soins (ne compte que pour ~10–20 % de la réduction de mortalité globale).',
            ],
          },
          {
            id: 'sp-ind-2',
            kind: 'structures',
            title: '2. Principaux indicateurs de santé',
            paragraphs: [
              'Un indicateur de santé est une variable quantitative permettant d’évaluer l’état de santé d’une population, de suivre les tendances et d’orienter les politiques sanitaires.',
            ],
            table: {
              caption: 'Indicateurs démographiques et sanitaires de référence',
              headers: ['Indicateur', 'Définition / Formule', 'Intérêt'],
              rows: [
                ['Taux brut de mortalité (TBM)', '(Décès annuels / Population moyenne) × 1 000', 'Mesure globale (sensible à la structure d’âge)'],
                ['Taux de mortalité infantile (TMI)', '(Décès < 1 an / Naissances vivantes) × 1 000', 'Reflet majeur du niveau sanitaire et socio-économique'],
                ['Ratio de mortalité maternelle (RMM)', '(Décès maternels / Naissances vivantes) × 100 000', 'Évalue la qualité du suivi obstétrical'],
                ['Espérance de vie à la naissance', 'Durée moyenne de vie estimée à la mortalité du moment', 'Indicateur synthétique de développement sanitaire'],
                ['DALY (AVCI)', 'Années de vie perdues (YLL) + Années vécues avec incapacité (YLD)', 'Mesure le fardeau global des maladies'],
              ],
            },
          },
        ],
        examTips: [
          'Attention au dénominateur du Taux de Mortalité Infantile (TMI) : ce sont les naissances vivantes de l’année (pour 1 000), et non la population totale !',
        ],
      },
    ],
  },
  {
    id: 'sp-ch-2',
    moduleId: 'sante-publique',
    order: 2,
    title: 'Épidémiologie, prévention et promotion de la santé',
    description:
      'Prévalence vs incidence, types d’études épidémiologiques, risques (RR, OR), niveaux de prévention (primaire à quaternaire) et Charte d’Ottawa.',
    lessons: [
      {
        id: 'sp-epidemio-prev',
        moduleId: 'sante-publique',
        chapterId: 'sp-ch-2',
        title: 'Épidémiologie, prévention et promotion de la santé',
        subtitle: 'Mesurer la fréquence des maladies, tester les facteurs de risque et agir avant l’apparition de la maladie',
        estimatedMinutes: 30,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Prévalence',
            definition:
              'Proportion d’individus atteints d’une maladie (anciens + nouveaux cas) dans une population à un moment donné (prévalence ponctuelle) ou sur une période.',
          },
          {
            term: 'Incidence',
            definition:
              'Nombre de NOUVEAUX cas d’une maladie apparaissant dans une population à risque pendant une période donnée (mesure le risque d’apparition).',
          },
        ],
        sections: [
          {
            id: 'sp-epi-1',
            kind: 'structures',
            title: '1. Types d’études épidémiologiques et mesures d’association',
            paragraphs: [
              'L’épidémiologie se divise en descriptive (qui, où, quand ?), analytique (pourquoi ? recherche des facteurs de risque) et évaluative/expérimentale (quel effet d’une intervention ?).',
            ],
            table: {
              caption: 'Comparaison des grands schémas d’études analytiques et expérimentales',
              headers: ['Type d’étude', 'Sens chronologique', 'Mesure d’association', 'Avantages / Limites'],
              rows: [
                ['Transversale', 'Instantanée (mesure simultanée exposition & maladie)', 'Prévalence, Rapport de cotes de prévalence', 'Rapide, peu coûteuse ; ne prouve pas la causalité'],
                ['Cohorte (exposés / non-exposés)', 'Prospective (ou rétrospective) : Exposition → Maladie', 'Risque Relatif (RR = Ie / Ine)', 'Calcule directement l’incidence ; longue et coûteuse pour maladies rares'],
                ['Cas-témoins', 'Rétrospective : Maladie (cas/témoins) → Exposition passée', 'Odds Ratio (OR ≈ RR si maladie rare)', 'Idéale pour maladies rares ; sujette au biais de mémorisation'],
                ['Essai contrôlé randomisé (ECR)', 'Expérimentale prospective avec tirage au sort', 'Risque Relatif, Réduction absolue du risque', 'Plus haut niveau de preuve pour évaluer un traitement'],
              ],
            },
          },
          {
            id: 'sp-prev-2',
            kind: 'rapports',
            title: '2. Les 4 niveaux de prévention et la promotion de la santé',
            paragraphs: [
              'La prévention vise à éviter l’apparition, le développement ou l’aggravation des maladies, tandis que la promotion de la santé (Charte d’Ottawa, 1986) donne aux populations les moyens de maîtriser davantage leur propre santé.',
            ],
            bulletPoints: [
              'Prévention primaire : agir AVANT la maladie en réduisant les facteurs de risque (vaccination, lutte antitabac, hygiène de l’eau, port de la ceinture). Diminue l’incidence.',
              'Prévention secondaire : dépistage et diagnostic précoce au stade asymptomatique pour stopper l’évolution (frottis cervico-utérin, mammographie, dépistage néonatal).',
              'Prévention tertiaire : limiter les complications, séquelles et rechutes d’une maladie déjà installée (rééducation après AVC, éducation thérapeutique du diabétique).',
              'Prévention quaternaire : éviter le surdiagnostic, la surmédicalisation et les actes inutiles ou iatrogènes (principe « primum non nocere »).',
              'Charte d’Ottawa (5 axes) : politique publique saine, environnements favorables, action communautaire, aptitudes individuelles, réorientation des services de santé.',
            ],
          },
        ],
        examTips: [
          'Dans une maladie chronique dont la survie s’allonge grâce aux progrès thérapeutiques sans guérison définitive, l’incidence reste stable mais la PRÉVALENCE augmente (P ≈ I × Durée moyenne).',
        ],
      },
    ],
  },
  {
    id: 'sp-ch-3',
    moduleId: 'sante-publique',
    order: 3,
    title: 'Système de santé, santé communautaire et statistiques sanitaires',
    description:
      'Modèles de systèmes de santé, organisation du système de santé marocain, santé communautaire et tests diagnostiques (sensibilité, spécificité, VPP, VPN).',
    lessons: [
      {
        id: 'sp-maroc-stats',
        moduleId: 'sante-publique',
        chapterId: 'sp-ch-3',
        title: 'Organisation du système de santé marocain, santé communautaire et biostatistiques',
        subtitle: 'Pyramide sanitaire, couverture médicale (AMO) et évaluation des tests diagnostiques',
        estimatedMinutes: 35,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Sensibilité (Se)',
            definition:
              'Probabilité qu’un test soit positif sachant que le sujet est réellement malade : Se = VP / (VP + FN). Utile pour exclure une maladie lorsqu’il est négatif.',
          },
          {
            term: 'Spécificité (Sp)',
            definition:
              'Probabilité qu’un test soit négatif sachant que le sujet est réellement sain : Sp = VN / (VN + FP). Utile pour confirmer une maladie lorsqu’il est positif.',
          },
        ],
        sections: [
          {
            id: 'sp-sys-1',
            kind: 'structures',
            title: '1. Grands modèles et organisation du système de santé marocain',
            paragraphs: [
              'Au niveau international, on distingue classiquement le système national de santé beveridgien (financé par l’impôt, accès universel, ex. Royaume-Uni) et le système d’assurance sociale bismarckien (financé par cotisations sociales professionnelles, ex. Allemagne, France en partie).',
              'Le système de santé marocain est un système mixte structuré autour du secteur public (Ministère de la Santé et de la Protection Sociale), du secteur privé (à but lucratif et non lucratif) et des services de santé des Forces Armées Royales.',
            ],
            bulletPoints: [
              'Offre de soins publique organisée en 3 niveaux hiérarchisés : Niveau 1 (Soins de santé primaires : Réseau des Établissements de Soins de Santé Primaires — ESSP : dispensaires ruraux, centres de santé ruraux et urbains de 1er et 2e niveau) ; Niveau 2 (Hôpitaux de proximité, provinciaux et préfectoraux) ; Niveau 3 (Hôpitaux régionaux et Centres Hospitaliers Universitaires — CHU, soins tertiaires, recherche et formation).',
              'Régionalisation sanitaire (Groupements Sanitaires Territoriaux — GST) et territorialisation des soins.',
              'Couverture Sanitaire Universelle : généralisation de l’Assurance Maladie Obligatoire (AMO) incluant les salariés, les travailleurs non-salariés (AMO-TNS) et l’AMO-Tadamoun (remplaçant le RAMED pour les populations vulnérables).',
            ],
          },
          {
            id: 'sp-comm-2',
            kind: 'application',
            title: '2. Santé communautaire',
            paragraphs: [
              'La santé communautaire est une démarche participative par laquelle les membres d’une communauté géographique ou sociale identifient ensemble leurs problèmes de santé prioritaires, planifient des actions avec les professionnels et évaluent les résultats (exemple : programmes de santé maternelle et infantile, campagnes de vaccination de proximité, agents de santé communautaire).',
            ],
          },
          {
            id: 'sp-stats-3',
            kind: 'methode',
            title: '3. Notions essentielles de statistiques sanitaires',
            paragraphs: [
              'En statistique descriptive, une série quantitative est résumée par des paramètres de position (moyenne arithmétique, médiane insensible aux valeurs extrêmes, mode) et des paramètres de dispersion (étendue, variance, écart-type σ, intervalle interquartile).',
              'Pour évaluer un test diagnostique ou de dépistage par rapport à un examen de référence (Gold Standard), on utilise un tableau de contingence 2×2 (VP, FP, FN, VN) :',
            ],
            bulletPoints: [
              'Sensibilité Se = VP / (VP + FN) — propriété intrinsèque du test.',
              'Spécificité Sp = VN / (VN + FP) — propriété intrinsèque du test.',
              'Valeur Prédictive Positive VPP = VP / (VP + FP) — probabilité d’être malade si test positif (DÉPEND de la prévalence : augmente quand la prévalence augmente).',
              'Valeur Prédictive Négative VPN = VN / (VN + FN) — probabilité d’être sain si test négatif (augmente quand la prévalence diminue).',
            ],
          },
        ],
        examTips: [
          'Piège d’examen fréquent : Se et Sp sont indépendantes de la prévalence de la maladie, alors que la VPP et la VPN dépendent fortement de la prévalence !',
        ],
      },
    ],
  },
];

export const santePubliqueFlashcards: Flashcard[] = [
  {
    id: 'sp-fc-1',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-1',
    chapterTitle: 'Déterminants & Indicateurs',
    front: 'Quel est le dénominateur utilisé pour calculer le Taux de Mortalité Infantile (TMI) ?',
    back: 'Le nombre total de naissances vivantes au cours de la même année (exprimé pour 1 000 naissances vivantes).',
  },
  {
    id: 'sp-fc-2',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-2',
    chapterTitle: 'Épidémiologie & Prévention',
    front: 'Quelle est la différence entre Prévalence et Incidence ?',
    back: 'La prévalence mesure tous les cas existants (anciens + nouveaux) à un instant donné ; l’incidence mesure uniquement les NOUVEAUX cas apparus pendant une période.',
  },
  {
    id: 'sp-fc-3',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-2',
    chapterTitle: 'Épidémiologie & Prévention',
    front: 'À quel niveau de prévention correspond le dépistage organisé d’un cancer chez des sujets asymptomatiques ?',
    back: 'Prévention secondaire (détection précoce avant l’apparition des symptômes).',
  },
  {
    id: 'sp-fc-4',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-3',
    chapterTitle: 'Système marocain & Statistiques',
    front: 'Quels sont les trois niveaux de recours aux soins dans le secteur public marocain ?',
    back: '1) ESSP (centres de santé / dispensaires) · 2) Hôpitaux provinciaux/préfectoraux et régionaux · 3) CHU (soins tertiaires de référence).',
  },
  {
    id: 'sp-fc-5',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-3',
    chapterTitle: 'Système marocain & Statistiques',
    front: 'Comment la prévalence influence-t-elle la Valeur Prédictive Positive (VPP) d’un test ?',
    back: 'Lorsque la prévalence augmente, la VPP augmente (et la VPN diminue), alors que Sensibilité et Spécificité restent constantes.',
  },
];

export const santePubliqueQcms: QcmQuestion[] = [
  {
    id: 'sp-qcm-1',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-2',
    chapterTitle: 'Épidémiologie & Prévention',
    type: 'single',
    question:
      'Quel schéma d’étude épidémiologique est le plus adapté pour étudier l’étiologie d’une maladie très rare en partant de sujets malades comparés à des sujets indemnes ?',
    options: [
      'Étude de cohorte prospective',
      'Étude cas-témoins',
      'Étude transversale',
      'Étude écologique',
    ],
    correctIndices: [1],
    explanation:
      'L’étude cas-témoins sélectionne des cas (malades) et des témoins (non malades) puis recherche rétrospectivement l’exposition : elle est rapide et adaptée aux maladies rares.',
    difficulty: 'Facile',
  },
  {
    id: 'sp-qcm-2',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-2',
    chapterTitle: 'Épidémiologie & Prévention',
    type: 'multiple',
    question: 'Parmi les actions suivantes, lesquelles relèvent de la prévention PRIMAIRE ?',
    options: [
      'La vaccination obligatoire des nourrissons',
      'La mammographie de dépistage chez la femme de 50 ans asymptomatique',
      'La campagne de lutte contre le tabagisme chez les adolescents',
      'La rééducation motrice après un accident vasculaire cérébral',
    ],
    correctIndices: [0, 2],
    explanation:
      'La vaccination et la lutte antitabac empêchent l’apparition de la maladie (prévention primaire). La mammographie est une prévention secondaire ; la rééducation post-AVC est une prévention tertiaire.',
    difficulty: 'Facile',
  },
  {
    id: 'sp-qcm-3',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-3',
    chapterTitle: 'Système marocain & Statistiques',
    type: 'single',
    question:
      'Dans l’organisation du système de santé marocain, quelle structure constitue la porte d’entrée principale du niveau 1 (soins de santé primaires) ?',
    options: [
      'Le Centre Hospitalier Universitaire (CHU)',
      'L’Hôpital Régional de spécialités',
      'Le Réseau des Établissements de Soins de Santé Primaires (ESSP : centres de santé et dispensaires)',
      'L’Institut National d’Hygiène',
    ],
    correctIndices: [2],
    explanation:
      'Les ESSP (centres de santé urbains/ruraux et dispensaires) assurent les soins de proximité, la prévention, la santé maternelle et infantile et orientent vers le niveau hospitalier.',
    difficulty: 'Facile',
  },
  {
    id: 'sp-qcm-4',
    moduleId: 'sante-publique',
    chapterId: 'sp-ch-3',
    chapterTitle: 'Système marocain & Statistiques',
    type: 'single',
    isCalculation: true,
    question:
      'Un test diagnostique identifie correctement 90 malades sur 100 malades réels (10 faux négatifs) et donne 20 faux positifs parmi 100 sujets sains (80 vrais négatifs). Quelle est sa sensibilité ?',
    options: ['80 %', '90 %', '81,8 %', '75 %'],
    correctIndices: [1],
    explanation: 'Sensibilité = VP / (VP + FN) = 90 / (90 + 10) = 90 / 100 = 90 %.',
    difficulty: 'Moyen',
  },
];
