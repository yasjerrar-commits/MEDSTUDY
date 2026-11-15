import type { Chapter, Flashcard, QcmQuestion } from '../types/medstudy';

export const biochimieChapters: Chapter[] = [
  {
    id: 'bioch-ch-1',
    moduleId: 'biochimie',
    order: 1,
    title: 'Biomolécules, acides aminés et protéines',
    description:
      'Liaisons chimiques du vivant, classification des 20 acides aminés, pHi, liaison peptidique et niveaux structuraux des protéines.',
    lessons: [
      {
        id: 'bioch-aa-prot',
        moduleId: 'biochimie',
        chapterId: 'bioch-ch-1',
        title: 'Acides aminés, peptides et structure des protéines',
        subtitle: 'Des briques élémentaires (α-aminoacides) à l’architecture tridimensionnelle fonctionnelle',
        estimatedMinutes: 30,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Acide aminé (AA) protéinogène',
            definition:
              'Molécule organique possédant sur le même carbone α une fonction acide carboxylique (–COOH), une fonction amine (–NH₂), un atome d’hydrogène et une chaîne latérale R spécifique.',
          },
          {
            term: 'Zwitterion (ion dipolaire)',
            definition:
              'Forme électriquement neutre d’un acide aminé à son pH isoélectrique (pHi), portant simultanément une charge positive (–NH₃⁺) et une charge négative (–COO⁻).',
          },
          {
            term: 'Liaison peptidique',
            definition:
              'Liaison amide covalente plane et rigide (caractère partiel de double liaison) formée par condensation entre le groupe α-COOH d’un AA et le groupe α-NH₂ du suivant avec libération d’une molécule d’eau.',
          },
        ],
        sections: [
          {
            id: 'bioch-aa-intro',
            kind: 'introduction',
            title: '1. Explication simple : comment se construisent les protéines ?',
            paragraphs: [
              'Imaginez une protéine comme un collier de perles qui se replie ensuite sur lui-même pour former une clé tridimensionnelle capable d’ouvrir une serrure biologique. Chaque perle est un acide aminé (il en existe 20 standards dans le code génétique humain).',
              'Tous les acides aminés naturels dans les protéines humaines appartiennent à la série L (à l’exception de la glycine, qui n’a pas de carbone asymétrique car R = H). La nature chimique du radical R détermine si l’acide aminé aime l’eau (hydrophile/polaire) ou la fuit (hydrophobe/apolaire).',
            ],
          },
          {
            id: 'bioch-aa-table',
            kind: 'structures',
            title: '2. Classification des 20 acides aminés standards',
            paragraphs: [
              'La connaissance de la polarité et de la charge des chaînes latérales R est essentielle pour comprendre le repliement protéique et les sites actifs enzymatiques.',
            ],
            table: {
              caption: 'Classification fonctionnelle des 20 acides aminés protéinogènes',
              headers: ['Classe chimique', 'Acides aminés (code 3 lettres)', 'Particularités essentielles'],
              rows: [
                ['Apolaires aliphatiques', 'Gly, Ala, Val*, Leu*, Ile*, Pro', 'Hydrophobes, cœur des protéines globulaires ; Proline rigidifie la chaîne (coude)'],
                ['Apolaires aromatiques', 'Phe*, Trp*, Tyr', 'Absorbent les UV à 280 nm (surtout Trp et Tyr) ; Tyr est polaire par son –OH'],
                ['Polaires non chargés', 'Ser, Thr*, Cys, Met*, Asn, Gln', 'Ser/Thr/Tyr phosphorylables ; Cystéine forme des ponts disulfures (–S–S–)'],
                ['Acides (chargés − à pH 7)', 'Asp, Glu', 'Donneurs de protons (chaîne latérale –COO⁻ à pH physiologique)'],
                ['Basiques (chargés + à pH 7)', 'Lys*, Arg, His', 'Histidine possède un pKr ≈ 6,0 : excellent tampon physiologique (hémoglobine)'],
              ],
            },
          },
          {
            id: 'bioch-prot-struct',
            kind: 'interne',
            title: '3. Les 4 niveaux d’organisation des protéines',
            paragraphs: [
              'La fonction d’une protéine dépend strictement de sa conformation spatiale native.',
            ],
            bulletPoints: [
              'Structure primaire : séquence linéaire des acides aminés reliés par des liaisons peptidiques (lue de l’extrémité N-terminale vers C-terminale). Déterminée par le gène.',
              'Structure secondaire : repliement local régulier stabilisé par des liaisons hydrogène entre atomes du squelette peptidique (hélice α droite, feuillet β plissé parallèle ou antiparallèle, coudes β).',
              'Structure tertiaire : repliement global tridimensionnel d’une chaîne polypeptidique stabilisé par interactions hydrophobes, liaisons ioniques (ponts salins), liaisons H et ponts disulfures (covalents).',
              'Structure quaternaire : association de plusieurs sous-unités polypeptidiques (protomères), par exemple l’hémoglobine adulte HbA (tétramère α₂β₂).',
            ],
          },
          {
            id: 'bioch-aa-memoriser',
            kind: 'memoriser',
            title: '4. Points essentiels à mémoriser',
            paragraphs: [
              'Les 8 acides aminés essentiels (indispensables chez l’adulte, non synthétisés par l’organisme) marqués par * : Valine, Leucine, Isoleucine, Phénylalanine, Tryptophane, Thréonine, Méthionine, Lysine (moyen mnémotechnique : « Mets La Valise Dans Le Train De Philippe » ; Histidine et Arginine sont semi-essentiels chez le nourrisson).',
            ],
          },
        ],
        examTips: [
          'Pour un acide aminé neutre (sans radical ionisable), pHi = (pK₁ + pK₂) / 2. À pH < pHi, l’AA est chargé positivement (cation) et migre vers la cathode (−) en électrophorèse.',
        ],
      },
    ],
  },
  {
    id: 'bioch-ch-2',
    moduleId: 'biochimie',
    order: 2,
    title: 'Glucides et lipides structuraux',
    description:
      'Oses simples, cyclisation de Haworth, disaccharides, polysaccharides (glycogène, cellulose), acides gras, triglycérides et phospholipides membranaires.',
    lessons: [
      {
        id: 'bioch-glucides-lipides',
        moduleId: 'biochimie',
        chapterId: 'bioch-ch-2',
        title: 'Structure et rôle biologique des glucides et lipides',
        subtitle: 'Sources d’énergie cellulaire, réserves métaboliques et architecture des bicouches membranaires',
        estimatedMinutes: 28,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Épimères',
            definition:
              'Stéréoisomères ne différant par la configuration absolue que d’un seul carbone asymétrique (ex. D-glucose et D-galactose sont épimères en C4 ; D-glucose et D-mannose en C2).',
          },
          {
            term: 'Molécule amphiphile (amphipathique)',
            definition:
              'Molécule possédant à la fois un pôle hydrophile (polaire) et un pôle hydrophobe (apolaire), comme les phospholipides et le cholestérol, permettant la formation spontanée de bicouches membranaires.',
          },
        ],
        sections: [
          {
            id: 'bioch-gluc-1',
            kind: 'structures',
            title: '1. Glucides : des oses aux polyosides',
            paragraphs: [
              'Les glucides ont pour formule brute générale (CH₂O)ₙ. On distingue les aldoses (fonction aldéhyde en C1, ex. glucose) et les cétoses (fonction cétone en C2, ex. fructose). En solution aqueuse, les hexoses se cyclisent par réaction intramoléculaire formant un hémiacétal et un nouveau carbone asymétrique dit anomérique (anomères α ou β).',
            ],
            table: {
              caption: 'Comparaison des principaux glucides d’intérêt médical',
              headers: ['Glucide', 'Composition / Liaison', 'Pouvoir réducteur', 'Rôle biologique'],
              rows: [
                ['Saccharose', 'α-D-Glucose (1→2) β-D-Fructose', 'Non réducteur', 'Sucre alimentaire (les deux C anomériques sont engagés)'],
                ['Lactose', 'β-D-Galactose (1→4) D-Glucose', 'Réducteur', 'Sucre du lait (déficit en lactase → intolérance)'],
                ['Maltose', 'α-D-Glucose (1→4) D-Glucose', 'Réducteur', 'Produit de digestion de l’amidon'],
                ['Glycogène', 'Polymère ramifié de D-glucose (α 1→4 et α 1→6 tous les 8–12 résidus)', 'Non réducteur (1 extrémité)', 'Réserve énergétique rapide du foie et du muscle'],
                ['Cellulose', 'Polymère linéaire de D-glucose en β(1→4)', 'Non réducteur', 'Fibres végétales non digestibles chez l’humain'],
              ],
            },
          },
          {
            id: 'bioch-lip-1',
            kind: 'structures',
            title: '2. Lipides : acides gras, triglycérides et membranes',
            paragraphs: [
              'Les lipides sont des biomolécules hydrophobes solubles dans les solvants apolaires. Les acides gras sont des acides monocarboxyliques à chaîne aliphatique (souvent à nombre pair de carbones). La présence de doubles liaisons cis (acides gras insaturés, ex. acide oléique C18:1 ω-9) introduit un coude dans la chaîne et augmente la fluidité membranaire.',
              'Les acides gras essentiels que l’organisme humain ne peut pas désaturer au-delà du C9 sont l’acide linoléique (C18:2 ω-6) et l’acide α-linolénique (C18:3 ω-3).',
            ],
            bulletPoints: [
              'Triglycérides (triacylglycérols) : 1 glycérol + 3 acides gras estérifiés. Stockage énergétique anhdyre très rentable dans les adipocytes (9 kcal/g contre 4 kcal/g pour les glucides).',
              'Glycérophospholipides : 1 glycérol + 2 acides gras + 1 acide phosphorique + 1 alcool aminé (choline, éthanolamine, sérine). Constituants majeurs des membranes.',
              'Cholestérol : stéroïde à 27 carbones régulant la fluidité membranaire et précurseur des acides biliaires, de la vitamine D et des hormones stéroïdiennes.',
            ],
          },
        ],
        examTips: [
          'Le saccharose est le seul disaccharide alimentaire courant NON réducteur car ses deux carbones anomériques (C1 du glucose et C2 du fructose) sont engagés dans la liaison osidique.',
        ],
      },
    ],
  },
  {
    id: 'bioch-ch-3',
    moduleId: 'biochimie',
    order: 3,
    title: 'Enzymologie et métabolisme énergétique (ATP)',
    description:
      'Cinétique de Michaelis-Menten, inhibitions réversibles, allostérie, glycolyse, cycle de Krebs et phosphorylation oxydative.',
    lessons: [
      {
        id: 'bioch-enzymo-metabo',
        moduleId: 'biochimie',
        chapterId: 'bioch-ch-3',
        title: 'Cinétique enzymatique et production d’ATP',
        subtitle: 'Catalyse biologique, paramètres Km / Vmax et grandes voies du catabolisme glucidique',
        estimatedMinutes: 35,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Constante de Michaelis (Km)',
            definition:
              'Concentration en substrat [S] pour laquelle la vitesse initiale de la réaction enzymatique vaut la moitié de la vitesse maximale (Vmax / 2). Plus Km est faible, plus l’affinité apparente de l’enzyme pour son substrat est élevée.',
          },
          {
            term: 'ATP (Adénosine triphosphate)',
            definition:
              'Nucléotide universel de transfert d’énergie chimique libre grâce à ses deux liaisons phosphoanhydrides riches en énergie (ΔG°′ d’hydrolyse en ADP + Pi ≈ −30,5 kJ/mol).',
          },
        ],
        sections: [
          {
            id: 'bioch-enz-1',
            kind: 'principe',
            title: '1. Cinétique de Michaelis-Menten et types d’inhibition',
            paragraphs: [
              'Une enzyme est un catalyseur biologique (presque toujours protéique) qui accélère la vitesse d’une réaction en abaissant l’énergie d’activation (ΔG‡), sans modifier l’équilibre thermodynamique final et sans être consommée.',
              'L’équation de Michaelis-Menten relie la vitesse initiale v₀ à la concentration en substrat [S] : v₀ = (Vmax · [S]) / (Km + [S]).',
            ],
            table: {
              caption: 'Effets des inhibiteurs réversibles sur Km et Vmax',
              headers: ['Type d’inhibition', 'Site de fixation', 'Effet sur Vmax', 'Effet sur Km apparent'],
              rows: [
                ['Compétitive', 'Site actif (compétition avec S)', 'Inchangée (surmontable par excès de S)', 'Augmente (affinité apparente diminue)'],
                ['Non compétitive pure', 'Site distinct du site actif (sur E et ES)', 'Diminue', 'Inchangé'],
                ['Incompétitive', 'Uniquement sur le complexe ES', 'Diminue', 'Diminue'],
              ],
            },
          },
          {
            id: 'bioch-metabo-1',
            kind: 'reaction',
            title: '2. Métabolisme énergétique : glycolyse, cycle de Krebs et chaîne respiratoire',
            paragraphs: [
              'L’oxydation complète d’une molécule de glucose en CO₂ et H₂O passe par trois étapes coordonnées qui produisent environ 30 à 32 molécules d’ATP :',
            ],
            bulletPoints: [
              '1) Glycolyse (cytosol, anaérobie possible) : 1 Glucose (C6) → 2 Pyruvate (C3) + 2 ATP nets + 2 NADH,H⁺. Les 3 enzymes irréversibles régulatrices sont l’hexokinase/glucokinase, la phosphofructokinase-1 (PFK-1, enzyme clé) et la pyruvate kinase.',
              '2) Décarboxylation oxydative (matrice mitochondriale) : Pyruvate + CoA-SH + NAD⁺ → Acétyl-CoA + CO₂ + NADH,H⁺ (via le complexe pyruvate déshydrogénase).',
              '3) Cycle de Krebs / de l’acide citrique (matrice mitochondriale) : chaque tour oxyde 1 Acétyl-CoA en 2 CO₂ et génère 3 NADH,H⁺, 1 FADH₂ et 1 GTP (= 1 ATP).',
              '4) Chaîne respiratoire & phosphorylation oxydative (membrane interne mitochondriale) : réoxydation des coenzymes NADH et FADH₂ créant un gradient électrochimique de protons H⁺ qui actionne l’ATP synthase (complexe V). L’accepteur final des électrons est le dioxygène O₂ (formant H₂O).',
            ],
          },
        ],
        examTips: [
          'Retenez les localisations cellulaires : Glycolyse = Cytosol ; Cycle de Krebs = Matrice mitochondriale ; Chaîne respiratoire = Membrane interne mitochondriale.',
          'En anaérobiose (ou dans les hématies dépourvues de mitochondries), le pyruvate est réduit en lactate par la lactate déshydrogénase afin de régénérer le NAD⁺ indispensable à la poursuite de la glycolyse.',
        ],
      },
    ],
  },
];

export const biochimieFlashcards: Flashcard[] = [
  {
    id: 'bioch-fc-1',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-1',
    chapterTitle: 'Acides aminés & Protéines',
    front: 'Quel acide aminé forme des ponts disulfures covalents stabilisant la structure tertiaire ?',
    back: 'La Cystéine (Cys), par oxydation de deux groupements thiol (–SH) en cystine (–S–S–).',
  },
  {
    id: 'bioch-fc-2',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-1',
    chapterTitle: 'Acides aminés & Protéines',
    front: 'Quel acide aminé protéinogène est dépourvu de carbone asymétrique (non chiral) ?',
    back: 'La Glycine (Gly), car sa chaîne latérale R est un simple atome d’hydrogène (–H).',
  },
  {
    id: 'bioch-fc-3',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-2',
    chapterTitle: 'Glucides & Lipides',
    front: 'Quelle est la différence structurale entre le glycogène et la cellulose ?',
    back: 'Le glycogène est un polymère ramifié de D-glucose en liaisons α(1→4) et α(1→6), digestible ; la cellulose est linéaire en β(1→4), non digestible par l’homme.',
  },
  {
    id: 'bioch-fc-4',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-3',
    chapterTitle: 'Enzymologie & Métabolisme',
    front: 'Comment un inhibiteur compétitif modifie-t-il Vmax et Km apparent ?',
    back: 'Vmax reste inchangée ; Km apparent augmente (diminution de l’affinité apparente).',
  },
  {
    id: 'bioch-fc-5',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-3',
    chapterTitle: 'Enzymologie & Métabolisme',
    front: 'Quelle est l’enzyme allostérique limitante principale de la glycolyse ?',
    back: 'La phosphofructokinase-1 (PFK-1), activée par l’AMP et le fructose-2,6-bisphosphate, et inhibée par l’ATP et le citrate.',
  },
];

export const biochimieQcms: QcmQuestion[] = [
  {
    id: 'bioch-qcm-1',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-1',
    chapterTitle: 'Acides aminés & Protéines',
    type: 'multiple',
    question: 'Concernant les acides aminés et les protéines, quelles propositions sont exactes ?',
    options: [
      'La liaison peptidique présente un caractère partiel de double liaison et est plane',
      'L’histidine possède une chaîne latérale dont le pKr (~6,0) permet un pouvoir tampon près du pH physiologique',
      'Le tryptophane et la tyrosine absorbent fortement la lumière UV à 280 nm',
      'Tous les acides aminés naturels de l’organisme appartiennent à la série D',
    ],
    correctIndices: [0, 1, 2],
    explanation:
      'Les acides aminés des protéines humaines appartiennent à la série L (à l’exception de la glycine qui est achirale).',
    difficulty: 'Moyen',
  },
  {
    id: 'bioch-qcm-2',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-2',
    chapterTitle: 'Glucides & Lipides',
    type: 'single',
    question: 'Lequel de ces disaccharides ne possède PAS de pouvoir réducteur ?',
    options: ['Maltose', 'Lactose', 'Cellobiose', 'Saccharose'],
    correctIndices: [3],
    explanation:
      'Dans le saccharose (α-D-glucopyranosyl-(1→2)-β-D-fructofuranoside), les deux carbones anomériques C1 et C2 sont engagés dans la liaison osidique : il n’y a plus d’hémiacétal libre.',
    difficulty: 'Facile',
  },
  {
    id: 'bioch-qcm-3',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-3',
    chapterTitle: 'Enzymologie & Métabolisme',
    type: 'single',
    question:
      'En présence d’un inhibiteur compétitif réversible, comment évoluent les paramètres cinétiques d’une enzyme michaélienne ?',
    options: [
      'Vmax diminue et Km reste constant',
      'Vmax reste constante et Km apparent augmente',
      'Vmax diminue et Km diminue',
      'Vmax augmente et Km diminue',
    ],
    correctIndices: [1],
    explanation:
      'Un excès de substrat déplace l’inhibiteur compétitif du site actif : Vmax reste donc atteignable (inchangée), mais il faut plus de substrat pour atteindre Vmax/2 (Km apparent augmente).',
    difficulty: 'Facile',
  },
  {
    id: 'bioch-qcm-4',
    moduleId: 'biochimie',
    chapterId: 'bioch-ch-3',
    chapterTitle: 'Enzymologie & Métabolisme',
    type: 'single',
    question: 'Quel est le bilan net direct en ATP et NADH,H⁺ de la glycolyse pour 1 molécule de glucose transformée en 2 pyruvates ?',
    options: [
      '2 ATP et 2 NADH,H⁺',
      '4 ATP et 2 NADH,H⁺',
      '2 ATP et 4 NADH,H⁺',
      '36 ATP directement dans le cytosol',
    ],
    correctIndices: [0],
    explanation:
      'La phase préparatoire consomme 2 ATP et la phase de remboursement produit 4 ATP et 2 NADH,H⁺, soit un bilan net de +2 ATP et +2 NADH,H⁺ par glucose.',
    difficulty: 'Moyen',
  },
];
