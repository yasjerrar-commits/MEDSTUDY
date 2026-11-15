import type { Chapter, Flashcard, FormulaItem, QcmQuestion } from '../types/medstudy';

export const biophysiqueFormulas: FormulaItem[] = [
  {
    id: 'biof-f-1',
    chapterTitle: 'Hémodynamique & Mécanique des fluides',
    name: 'Loi de Poiseuille (débit laminaire)',
    expression: 'Q = (π · ΔP · r⁴) / (8 · η · L)',
    variables: [
      'Q : Débit volumique (m³/s)',
      'ΔP : Gradient de pression (Pa)',
      'r : Rayon du vaisseau (m)',
      'η : Viscosité dynamique (Pa·s)',
      'L : Longueur du vaisseau (m)',
    ],
    unit: 'm³/s (ou L/min)',
    medicalApplication:
      'Une réduction de 50 % du rayon artériel (sténose ou vasoconstriction) multiplie la résistance vasculaire par 16 (2⁴) et divise le débit par 16 à ΔP constant.',
  },
  {
    id: 'biof-f-2',
    chapterTitle: 'Hémodynamique & Mécanique des fluides',
    name: 'Résistance hydrodynamique vasculaire',
    expression: 'R = ΔP / Q = (8 · η · L) / (π · r⁴)',
    variables: ['R : Résistance (Pa·s/m³)', 'ΔP : Chute de pression', 'Q : Débit'],
    unit: 'Pa·s/m³ (ou mmHg·min/L)',
    medicalApplication:
      'Calcul des résistances vasculaires systémiques (RVS) et pulmonaires ; régulation de la pression artérielle par les artérioles.',
  },
  {
    id: 'biof-f-3',
    chapterTitle: 'Hémodynamique & Mécanique des fluides',
    name: 'Loi de Laplace (tension pariétale)',
    expression: 'ΔP = T / r (cylindre)  |  ΔP = 2T / r (sphère)',
    variables: ['ΔP : Pression transmurale (Pa)', 'T : Tension pariétale (N/m)', 'r : Rayon (m)'],
    unit: 'Pa (ou N/m²)',
    medicalApplication:
      'Rôle du surfactant pulmonaire (abaisse T pour éviter le collapsus des petites alvéoles) et risque de rupture des anévrismes aortiques (r augmente → T augmente).',
  },
  {
    id: 'biof-f-4',
    chapterTitle: 'Biophysique des membranes & Osmose',
    name: 'Loi de Van ’t Hoff (pression osmotique)',
    expression: 'Π = i · C · R · T = Osm · R · T',
    variables: [
      'Π : Pression osmotique (Pa)',
      'i : Coefficient de dissociation',
      'C : Concentration molaire (mol/m³)',
      'Osm : Osmolarité (osmol/m³)',
      'R = 8,314 J/(mol·K)',
      'T : Température absolue (K)',
    ],
    unit: 'Pa (ou atm / mmHg)',
    medicalApplication:
      'Équilibre hydrique entre compartiments intra- et extracellulaire ; prévention de l’hémolyse lors des perfusions (soluté isotonique ≈ 290–300 mOsm/L).',
  },
  {
    id: 'biof-f-5',
    chapterTitle: 'Biophysique des membranes & Osmose',
    name: 'Équation de Nernst (potentiel d’équilibre)',
    expression: 'E_ion = (R · T / z · F) · ln([Ion]_ext / [Ion]_int)',
    variables: [
      'E_ion : Potentiel d’équilibre (V)',
      'z : Valence de l’ion',
      'F : Constante de Faraday (96 485 C/mol)',
      'À 37 °C pour z=+1 : (RT/F)·2,303 ≈ 61,5 mV',
    ],
    unit: 'mV (millivolts)',
    medicalApplication:
      'Calcul des potentiels d’équilibre du K⁺ (~ −90 mV) et du Na⁺ (~ +60 mV) expliquant le potentiel de repos membranaire et le potentiel d’action.',
  },
  {
    id: 'biof-f-6',
    chapterTitle: 'Optique physiologique de l’œil',
    name: 'Relation de conjugaison des lentilles minces',
    expression: 'V = 1 / f′ = 1 / OA′ − 1 / OA',
    variables: [
      'V : Vergence en dioptries (δ)',
      'f′ : Distance focale image (m)',
      'OA : Position objet',
      'OA′ : Position image',
    ],
    unit: 'Dioptrie (δ = m⁻¹)',
    medicalApplication:
      'Correction des amétropies : myopie par verre divergent (V < 0), hypermétropie par verre convergent (V > 0). L’œil emmétrope au repos a une vergence totale ≈ +60 δ.',
  },
  {
    id: 'biof-f-7',
    chapterTitle: 'Rayonnements & Imagerie médicale',
    name: 'Atténuation des rayons X (Beer-Lambert)',
    expression: 'I(x) = I₀ · e^(−μ · x)',
    variables: [
      'I(x) : Intensité transmise',
      'I₀ : Intensité incidente',
      'μ : Coefficient d’atténuation linéaire (cm⁻¹)',
      'x : Épaisseur traversée (cm)',
    ],
    unit: 'W/m² (μ en cm⁻¹)',
    medicalApplication:
      'Formation du contraste radiologique et du scanner (échelle de Hounsfield) : l’os (Z élevé) atténue fortement les rayons X (hyperdense/blanc), l’air presque pas (noir).',
  },
];

export const biophysiqueChapters: Chapter[] = [
  {
    id: 'biof-ch-1',
    moduleId: 'biophysique',
    order: 1,
    title: 'Mécanique des fluides et hémodynamique',
    description:
      'Fluides parfaits et réels, loi de Bernoulli, loi de Poiseuille, nombre de Reynolds et loi de Laplace appliqués au système cardiovasculaire.',
    lessons: [
      {
        id: 'biof-hemo-1',
        moduleId: 'biophysique',
        chapterId: 'biof-ch-1',
        title: 'Loi de Poiseuille, Bernoulli et hémodynamique artérielle',
        subtitle: 'Comprendre la pression artérielle, les sténoses vasculaires et l’écoulement sanguin',
        estimatedMinutes: 30,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Fluide newtonien vs non newtonien',
            definition:
              'Un fluide newtonien a une viscosité constante quel que soit le gradient de vitesse (ex. plasma). Le sang total est non newtonien rhéofluidifiant : sa viscosité apparente diminue lorsque la vitesse d’écoulement augmente (dissociation des rouleaux d’hématies).',
          },
          {
            term: 'Nombre de Reynolds (Re)',
            definition:
              'Nombre sans dimension prédisant le régime d’écoulement : Re = (ρ · v · D) / η. Si Re < 2000, l’écoulement est laminaire ; si Re > 3000, il devient turbulent (audible sous forme de souffle cardiaque ou vasculaire).',
          },
        ],
        sections: [
          {
            id: 'biof-hemo-principe',
            kind: 'principe',
            title: '1. Principes physiques de l’écoulement sanguin',
            paragraphs: [
              'Le sang circule de l’aorte vers l’atrium droit grâce à un gradient de pression ΔP généré par le ventricule gauche. Dans un vaisseau cylindrique rigide, si l’on néglige d’abord la viscosité (fluide parfait), l’énergie mécanique par unité de volume reste constante selon le théorème de Bernoulli : P + ½ρv² + ρgz = constante.',
              'En réalité, le sang possède une viscosité η (environ 3 à 4 mPa·s à 37 °C) qui dissipe de l’énergie par frottements internes : c’est la perte de charge, décrite par la loi de Hagen-Poiseuille en régime laminaire.',
            ],
            formula: {
              expression: 'Q = (π · ΔP · r⁴) / (8 · η · L)',
              variables: [
                { symbol: 'Q', meaning: 'Débit sanguin volumique', unit: 'm³/s' },
                { symbol: 'ΔP', meaning: 'Différence de pression P₁ − P₂', unit: 'Pa' },
                { symbol: 'r', meaning: 'Rayon interne du vaisseau', unit: 'm' },
                { symbol: 'η', meaning: 'Viscosité dynamique du sang', unit: 'Pa·s' },
                { symbol: 'L', meaning: 'Length / Longueur du segment', unit: 'm' },
              ],
              note: 'Attention à la puissance 4 du rayon : c’est le facteur dominant de la régulation vasomotrice.',
            },
          },
          {
            id: 'biof-hemo-demo',
            kind: 'demonstration',
            title: '2. Démonstration mathématique étape par étape de l’effet d’une sténose',
            paragraphs: [
              'Supposons une artère coronaire de rayon initial r₁ qui subit un rétrécissement athéromateux réduisant son rayon de 20 % (donc r₂ = 0,8 · r₁), à ΔP, η et L constants.',
            ],
            bulletPoints: [
              'Étape 1 : Exprimer la résistance hydrodynamique R = (8 · η · L) / (π · r⁴).',
              'Étape 2 : Calculer le rapport des résistances : R₂ / R₁ = (r₁ / r₂)⁴ = (1 / 0,8)⁴ = (1,25)⁴.',
              'Étape 3 : (1,25)² = 1,5625 ; puis (1,5625)² ≈ 2,44. La résistance est multipliée par 2,44 !',
              'Étape 4 : Comme Q = ΔP / R, le débit Q₂ = Q₁ / 2,44 ≈ 0,41 · Q₁, soit une chute de 59 % du débit pour seulement 20 % de perte de rayon.',
            ],
          },
          {
            id: 'biof-hemo-exemple',
            kind: 'exemple',
            title: '3. Exemple numérique résolu',
            paragraphs: [
              'Énoncé : Une artériole de rayon r = 0,5 mm (5 × 10⁻⁴ m) et de longueur L = 2 cm (0,02 m) est traversée par du sang de viscosité η = 4 × 10⁻³ Pa·s sous un gradient ΔP = 4000 Pa (~30 mmHg). Quel est le débit Q ?',
              'Résolution : r⁴ = (5 × 10⁻⁴)⁴ = 625 × 10⁻¹⁶ = 6,25 × 10⁻¹⁴ m⁴. Numérateur = π × 4000 × 6,25 × 10⁻¹⁴ ≈ 7,85 × 10⁻¹⁰. Dénominateur = 8 × 4 × 10⁻³ × 0,02 = 6,4 × 10⁻⁴. Donc Q = 7,85 × 10⁻¹⁰ / 6,4 × 10⁻⁴ ≈ 1,23 × 10⁻⁶ m³/s = 1,23 mL/s.',
            ],
          },
          {
            id: 'biof-hemo-app',
            kind: 'application',
            title: '4. Applications médicales : souffle vasculaire et tensiomètre',
            paragraphs: [
              'Lors d’une sténose serrée, la conservation du débit (Q = S · v) impose une accélération locale brutale de la vitesse v du sang au niveau du rétrécissement. Le nombre de Reynolds dépasse alors le seuil critique (~2000), générant des turbulences audibles au stéthoscope (souffle carotidien ou fémoral).',
              'De même, la mesure de la pression artérielle au brassard (bruits de Korotkoff) repose sur la création transitoire d’un écoulement turbulent entre la pression systolique et la pression diastolique.',
            ],
          },
        ],
        examTips: [
          'Convertissez toujours les unités dans le Système International (mm → m, mmHg → Pa avec 1 mmHg ≈ 133,3 Pa, mPa·s → 10⁻³ Pa·s) avant d’appliquer Poiseuille.',
        ],
      },
    ],
  },
  {
    id: 'biof-ch-2',
    moduleId: 'biophysique',
    order: 2,
    title: 'Biophysique des membranes, osmose et électrophysiologie',
    description:
      'Diffusion (loi de Fick), osmolarité, pression osmotique (Van ’t Hoff), équilibre de Donnan et potentiel de Nernst.',
    lessons: [
      {
        id: 'biof-osmose-1',
        moduleId: 'biophysique',
        chapterId: 'biof-ch-2',
        title: 'Osmose, tonicité et potentiels membranaires',
        subtitle: 'Transferts passifs à travers la membrane plasmique et calcul du potentiel d’équilibre ionique',
        estimatedMinutes: 30,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Osmolarité vs Osmolalité',
            definition:
              'L’osmolarité est le nombre d’osmoles de solutés par litre de solution (Osm/L). L’osmolalité est le nombre d’osmoles par kilogramme de solvant (Osm/kg), indépendante de la température.',
          },
          {
            term: 'Tonicité',
            definition:
              'Capacité d’une solution extracellulaire à modifier le volume d’une cellule par flux osmotique d’eau ; elle ne dépend que des solutés non diffusibles (osmolalité efficace).',
          },
        ],
        sections: [
          {
            id: 'biof-osm-principe',
            kind: 'principe',
            title: '1. Loi de Fick et pression osmotique de Van ’t Hoff',
            paragraphs: [
              'La diffusion passive d’un soluté non chargé suit la première loi de Fick : le flux molaire J est proportionnel à la surface S, au coefficient de diffusion D et au gradient de concentration (ΔC / Δx).',
              'Lorsque la membrane est semi-perméable (perméable au solvant eau, imperméable au soluté), l’eau migre du compartiment le moins concentré (hypo-osmolaire) vers le compartiment le plus concentré (hyper-osmolaire) jusqu’à l’équilibre de pression hydrostatique : c’est la pression osmotique Π.',
            ],
            formula: {
              expression: 'Π = i · C · R · T',
              variables: [
                { symbol: 'i', meaning: 'Facteur de Van ’t Hoff (nombre de particules libérées par molécule)', unit: 'sans unité' },
                { symbol: 'C', meaning: 'Concentration molaire', unit: 'mol/m³' },
                { symbol: 'R', meaning: 'Constante des gaz parfaits (8,314)', unit: 'J/(mol·K)' },
                { symbol: 'T', meaning: 'Température absolue (t°C + 273,15)', unit: 'K' },
              ],
            },
          },
          {
            id: 'biof-osm-exemple',
            kind: 'exemple',
            title: '2. Exemple résolu : calcul de l’osmolarité d’un soluté de NaCl',
            paragraphs: [
              'Énoncé : Quelle est l’osmolarité d’un sérum physiologique de NaCl à 9 g/L (masse molaire M(NaCl) = 58,5 g/mol), en supposant une dissociation totale (i = 2) ?',
              'Résolution étape par étape : 1) Molarité C = m / M = 9 / 58,5 ≈ 0,154 mol/L = 154 mmol/L. 2) Osmolarité = i × C = 2 × 154 = 308 mOsm/L. Cette valeur est très proche de l’osmolarité plasmatique normale (~290–300 mOsm/L) : le NaCl à 0,9 % est donc isotonique aux hématies.',
            ],
          },
          {
            id: 'biof-nernst',
            kind: 'application',
            title: '3. Équation de Nernst et potentiel de repos',
            paragraphs: [
              'Pour un ion de valence z inégalement réparti de part et d’autre d’une membrane perméable à cet ion, le gradient chimique et le gradient électrique s’équilibrent au potentiel de Nernst : E_ion = (61,5 / z) · log₁₀([Ion]_ext / [Ion]_int) en mV à 37 °C.',
              'Exemple : pour K⁺ (z = +1, [K⁺]_ext = 4 mM, [K⁺]_int = 140 mM), E_K = 61,5 · log₁₀(4 / 140) ≈ 61,5 · (−1,544) ≈ −95 mV. La membrane au repos étant principalement perméable au K⁺, le potentiel de repos d’un neurone ou myocyte (~ −70 à −90 mV) est très proche de E_K.',
            ],
          },
        ],
        examTips: [
          'Attention au piège classique : une solution iso-osmolaire d’urée à 300 mOsm/L est HYPOTONIQUE pour le globule rouge car l’urée diffuse librement dans la cellule, provoquant un appel d’eau et une hémolyse !',
        ],
      },
    ],
  },
  {
    id: 'biof-ch-3',
    moduleId: 'biophysique',
    order: 3,
    title: 'Optique physiologique et biophysique des rayonnements',
    description:
      'Dioptrique de l’œil réduit, accommodation, amétropies (myopie, hypermétropie, presbytie) et bases physiques des rayons X.',
    lessons: [
      {
        id: 'biof-optique-1',
        moduleId: 'biophysique',
        chapterId: 'biof-ch-3',
        title: 'Optique de l’œil et correction des amétropies',
        subtitle: 'Vergence, punctum remotum, punctum proximum et calcul du verre correcteur',
        estimatedMinutes: 25,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Punctum Remotum (PR)',
            definition:
              'Point le plus éloigné vu nettement par l’œil sans accommodation (au repos). Chez l’œil emmétrope, il est situé à l’infini.',
          },
          {
            term: 'Punctum Proximum (PP)',
            definition:
              'Point le plus proche vu nettement grâce à l’accommodation maximale du cristallin. L’amplitude d’accommodation A = 1/PP − 1/PR diminue avec l’âge (presbytie).',
          },
        ],
        sections: [
          {
            id: 'biof-opt-principe',
            kind: 'principe',
            title: '1. L’œil réduit et les troubles de la réfraction',
            paragraphs: [
              'L’œil emmétrope au repos se comporte comme un système convergent d’environ +60 dioptries (cornée ~ +43 δ, cristallin ~ +17 δ au repos) dont le foyer image coïncide exactement avec la rétine.',
              'Dans la myopie, l’œil est trop puissant ou trop long : l’image d’un objet à l’infini se forme en avant de la rétine. Le PR est à distance finie (ex. 50 cm). On corrige par une lentille divergente de focale f′ = −PR (ex. V = −1 / 0,5 = −2 δ).',
              'Dans l’hypermétropie, l’œil est insuffisamment convergent ou trop court : l’image se forme virtuellement en arrière de la rétine. On corrige par une lentille convergente (V > 0).',
            ],
          },
          {
            id: 'biof-opt-rx',
            kind: 'application',
            title: '2. Rayons X et imagerie médicale',
            paragraphs: [
              'Les rayons X sont des photons électromagnétiques ionisants de courte longueur d’onde produits dans un tube de Coolidge par freinage d’électrons (rayonnement de Bremsstrahlung) et transitions électroniques sur une cible de tungstène.',
              'Leur atténuation exponentielle I = I₀·e^(−μx) dépend fortement du numéro atomique Z (effet photoélectrique ∝ Z³) : le calcium osseux (Z=20) absorbe beaucoup plus que les tissus mous (Z≈7) ou l’air.',
            ],
          },
        ],
        examTips: [
          'Pour calculer rapidement la puissance d’un verre correcteur de myope (verre collé à l’œil) : V (en dioptries) = −1 / d_PR (avec d_PR en mètres).',
        ],
      },
    ],
  },
];

export const biophysiqueFlashcards: Flashcard[] = [
  {
    id: 'biof-fc-1',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-1',
    chapterTitle: 'Mécanique des fluides',
    front: 'Si le rayon d’une artériole est divisé par 2, par combien est multipliée sa résistance vasculaire (loi de Poiseuille) ?',
    back: 'Elle est multipliée par 16 (car R ∝ 1/r⁴, et 2⁴ = 16).',
    explanation: 'À gradient de pression constant, le débit sanguin est divisé par 16.',
  },
  {
    id: 'biof-fc-2',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-1',
    chapterTitle: 'Mécanique des fluides',
    front: 'Quel est le seuil du nombre de Reynolds au-delà duquel un écoulement devient turbulent ?',
    back: 'Re > 2000 à 3000 (laminaire si Re < 2000).',
    explanation: 'La turbulence explique l’apparition des souffles cardiaques et des bruits de Korotkoff.',
  },
  {
    id: 'biof-fc-3',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-2',
    chapterTitle: 'Membranes & Osmose',
    front: 'Quelle est l’osmolarité physiologique approximative du plasma humain ?',
    back: 'Environ 290 à 300 mOsm/L.',
    explanation: 'Une solution à 9 g/L de NaCl (~308 mOsm/L) est isotonique au plasma.',
  },
  {
    id: 'biof-fc-4',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-2',
    chapterTitle: 'Membranes & Osmose',
    front: 'Que devient le potentiel d’équilibre de Nernst d’un ion K⁺ à 37 °C si [K⁺]ext = 5 mM et [K⁺]int = 50 mM ?',
    back: 'E_K = 61,5 × log₁₀(5 / 50) = 61,5 × (−1) = −61,5 mV.',
    explanation: 'log₁₀(0,1) = −1 et z = +1.',
  },
  {
    id: 'biof-fc-5',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-3',
    chapterTitle: 'Optique & Rayonnements',
    front: 'Quelle lentille corrige un œil myope dont le Punctum Remotum est à 25 cm ?',
    back: 'Une lentille divergente de vergence −4 dioptries.',
    explanation: 'V = −1 / 0,25 m = −4 δ.',
  },
];

export const biophysiqueQcms: QcmQuestion[] = [
  {
    id: 'biof-qcm-1',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-1',
    chapterTitle: 'Mécanique des fluides',
    type: 'single',
    isCalculation: true,
    question:
      'Selon la loi de Poiseuille, si la longueur d’un vaisseau double et que son rayon reste constant (même ΔP et même viscosité), que devient le débit Q ?',
    options: [
      'Il est multiplié par 2',
      'Il est divisé par 2',
      'Il est divisé par 4',
      'Il est divisé par 16',
    ],
    correctIndices: [1],
    explanation:
      'Q = (π·ΔP·r⁴) / (8·η·L). Le débit est inversement proportionnel à la longueur L ; si L double, Q est divisé par 2.',
    difficulty: 'Facile',
  },
  {
    id: 'biof-qcm-2',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-1',
    chapterTitle: 'Mécanique des fluides',
    type: 'single',
    isCalculation: true,
    question:
      'Une sténose artérielle réduit le rayon luminal de 50 % (r₂ = r₁ / 2). À pression ΔP constante, par quel facteur le débit sanguin est-il réduit ?',
    options: ['Par 2', 'Par 4', 'Par 8', 'Par 16'],
    correctIndices: [3],
    explanation: 'Comme Q ∝ r⁴, si r₂ = r₁ / 2 alors Q₂ = Q₁ / 2⁴ = Q₁ / 16.',
    difficulty: 'Facile',
  },
  {
    id: 'biof-qcm-3',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-2',
    chapterTitle: 'Membranes & Osmose',
    type: 'single',
    isCalculation: true,
    question:
      'On dissout 0,1 mol de CaCl₂ (dissociation complète : i = 3) dans 1 litre d’eau. Quelle est l’osmolarité de la solution ?',
    options: ['100 mOsm/L', '200 mOsm/L', '300 mOsm/L', '600 mOsm/L'],
    correctIndices: [2],
    explanation:
      'CaCl₂ → Ca²⁺ + 2 Cl⁻ libère i = 3 particules par molécule. Osm = i × C = 3 × 0,1 = 0,3 Osm/L = 300 mOsm/L.',
    difficulty: 'Moyen',
  },
  {
    id: 'biof-qcm-4',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-2',
    chapterTitle: 'Membranes & Osmose',
    type: 'single',
    isCalculation: true,
    question:
      'À 37 °C, pour un ion divalent Ca²⁺ (z = +2) dont [Ca²⁺]ext = 2 mM et [Ca²⁺]int = 0,0002 mM (rapport = 10⁴), quel est son potentiel d’équilibre de Nernst ?',
    options: ['+61,5 mV', '+123 mV', '+246 mV', '−123 mV'],
    correctIndices: [1],
    explanation:
      'E_Ca = (61,5 / 2) × log₁₀(10⁴) = 30,75 × 4 = +123 mV.',
    difficulty: 'Difficile',
  },
  {
    id: 'biof-qcm-5',
    moduleId: 'biophysique',
    chapterId: 'biof-ch-3',
    chapterTitle: 'Optique & Rayonnements',
    type: 'single',
    isCalculation: true,
    question:
      'Un patient myope voit net sans lunettes au maximum jusqu’à 50 cm (PR = −0,50 m). Quelle doit être la vergence du verre correcteur placé près de l’œil ?',
    options: ['+2,0 δ', '−2,0 δ', '−0,5 δ', '−5,0 δ'],
    correctIndices: [1],
    explanation:
      'Le verre doit former d’un objet à l’infini une image au PR situé à −0,50 m : V = 1/f′ = 1/(−0,50) − 1/∞ = −2,0 dioptries.',
    difficulty: 'Moyen',
  },
];
