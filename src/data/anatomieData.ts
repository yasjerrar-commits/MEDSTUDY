import type { Chapter, Flashcard, QcmQuestion } from '../types/medstudy';

export const ANATOMIE_IMAGES = {
  coeur: '/src/assets/images/anatomie_coeur_1794757272335.jpg',
  poumons: '/src/assets/images/anatomie_poumons_1794757273788.jpg',
  mediastin: '/src/assets/images/anatomie_mediastin_1794757274581.jpg',
  mammaire: '/src/assets/images/anatomie_glande_mammaire_1794757275311.jpg',
};

export const anatomieChapters: Chapter[] = [
  {
    id: 'anat-ch-1',
    moduleId: 'anatomie',
    order: 1,
    title: 'Le cœur',
    description:
      'Morphologie externe et interne, valves cardiaques, vascularisation coronarienne, tissu nodal et rapports médiastinaux.',
    lessons: [
      {
        id: 'anat-coeur-complet',
        moduleId: 'anatomie',
        chapterId: 'anat-ch-1',
        title: 'Anatomie descriptive et fonctionnelle du cœur',
        subtitle: 'Pompe musculaire centrale du médiastin moyen : cavités, valves, coronaires et innervation',
        estimatedMinutes: 35,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Péricarde',
            definition:
              'Sac fibro-séreux enveloppant le cœur et la racine des gros vaisseaux, constitué d’un péricarde fibreux externe et d’un péricarde séreux (feuillets pariétal et viscéral ou épicarde).',
          },
          {
            term: 'Sillon atrio-ventriculaire (coronaire)',
            definition:
              'Sillon circulaire externe séparant les atriums des ventricules et contenant le tronc des artères coronaires et le sinus coronaire.',
          },
          {
            term: 'Tissu nodal (cardionecteur)',
            definition:
              'Tissu myocardique spécialisé capable de générer et conduire spontanément l’influx électrique cardiaque (nœud sinusal, nœud atrio-ventriculaire, faisceau de His et réseau de Purkinje).',
          },
        ],
        sections: [
          {
            id: 'coeur-intro',
            kind: 'introduction',
            title: '1. Introduction et vue d’ensemble',
            paragraphs: [
              'Le cœur est un organe musculaire creux à contraction rythmique et involontaire qui assure la propulsion du sang dans deux circulations en série : la petite circulation (pulmonaire, à basse pression) et la grande circulation (systémique, à haute pression).',
              'Il est composé de quatre cavités : deux atriums (oreillettes) qui reçoivent le sang veineux ou oxygéné, et deux ventricules qui l’éjectent vers les artères pulmonaires et l’aorte. Chez l’adulte, il pèse environ 250 à 300 g et présente une consistance ferme, plus marquée au niveau du ventricule gauche.',
            ],
            image: {
              src: ANATOMIE_IMAGES.coeur,
              alt: 'Coupe frontale schématique du cœur humain montrant les quatre cavités et les gros vaisseaux',
              caption:
                'Schéma anatomique du cœur : cavités droites (sang désoxygéné), cavités gauches (sang oxygéné), valves atrio-ventriculaires et gros vaisseaux de la base.',
            },
          },
          {
            id: 'coeur-situation',
            kind: 'situation',
            title: '2. Situation et rapports anatomiques',
            paragraphs: [
              'Le cœur est situé dans le médiastin moyen (partie antéro-inférieure du médiastin), entre les deux poumons recouverts de leurs plèvres, au-dessus du centre tendineux du diaphragme et en arrière du plastron sterno-costal.',
              'Son grand axe est oblique en avant, à gauche et en bas (formant un angle d’environ 40° avec le plan sagittal). Environ deux tiers de sa masse se projettent à gauche de la ligne médiane.',
            ],
            bulletPoints: [
              'En avant : face postérieure du sternum, cartilages costaux (3e au 6e) et récessus pleuraux antérieurs.',
              'En arrière : œsophage thoracique (en rapport direct avec l’atrium gauche), aorte thoracique descendante et colonne vertébrale (T4 à T8, vertèbres cardiaques de Giacomini).',
              'En bas : coupole diaphragmatique par l’intermédiaire du péricarde fibreux.',
              'Latéralement : faces médiastinales des poumons droit et gauche, et nerfs phréniques accompagnés des vaisseaux péricardiaco-phréniques.',
            ],
          },
          {
            id: 'coeur-externe',
            kind: 'externe',
            title: '3. Configuration externe',
            paragraphs: [
              'Le cœur a la forme d’une pyramide triangulaire à base postéro-supérieure droite et à sommet (apex) antéro-inférieur gauche, palpable au niveau du 5e espace intercostal gauche sur la ligne médio-claviculaire.',
              'On lui décrit trois faces (sternocostale ou antérieure, diaphragmatique ou inférieure, pulmonaire gauche), trois bords (droit aigu, supérieur et inférieur gauches mousses), une base et un apex.',
            ],
            bulletPoints: [
              'Sillon coronaire (atrio-ventriculaire) : sépare les atriums en arrière/haut des ventricules en avant/bas.',
              'Sillons interventriculaires antérieur et postérieur : répondent au septum interventriculaire et abritent les branches interventriculaires des artères coronaires.',
              'Auricules droite et gauche : prolongements coniques des atriums embrassant l’origine des gros troncs artériels.',
            ],
          },
          {
            id: 'coeur-interne',
            kind: 'interne',
            title: '4. Configuration interne et appareil valvulaire',
            paragraphs: [
              'Un septum longitudinal (interatrial puis interventriculaire) divise le cœur en cœur droit (veineux) et cœur gauche (artériel), empêchant tout mélange sanguin après la naissance.',
              'La paroi du ventricule gauche est environ trois fois plus épaisse (10 à 15 mm) que celle du ventricule droit (3 à 5 mm) afin de générer la pression systolique systémique (~120 mmHg contre ~25 mmHg à droite).',
            ],
            table: {
              caption: 'Synthèse des quatre valves cardiaques et foyers d’auscultation',
              headers: ['Valve', 'Localisation', 'Structure', 'Foyer d’auscultation'],
              rows: [
                ['Tricuspide', 'Orifice atrio-ventriculaire droit', '3 cuspides (ant., post., septale) + cordages', 'Base de l’appendice xiphoïde'],
                ['Mitrale (bicuspide)', 'Orifice atrio-ventriculaire gauche', '2 cuspides (ant./grande, post./petite)', '5e espace intercostal gauche (ligne médio-claviculaire)'],
                ['Pulmonaire', 'Orifice du tronc pulmonaire', '3 valvules semi-lunaires (sigmoïdes)', '2e espace intercostal gauche (bord sternal)'],
                ['Aortique', 'Orifice aortique', '3 valvules semi-lunaires + sinus de Valsalva', '2e espace intercostal droit (bord sternal)'],
              ],
            },
          },
          {
            id: 'coeur-vascularisation',
            kind: 'vascularisation',
            title: '5. Vascularisation artérielle et veineuse',
            paragraphs: [
              'La vascularisation nourricière du myocarde est assurée par deux artères coronaires (gauche et droite), premières branches de l’aorte ascendante, naissant des sinus aortiques droit et gauche juste au-dessus des valvules semi-lunaires. Le remplissage coronaire s’effectue principalement en diastole.',
              'Le drainage veineux converge majoritairement vers le sinus coronaire, situé dans la partie postérieure du sillon coronaire, qui s’abouche directement dans l’atrium droit (muni de la valvule de Thébésius).',
            ],
            bulletPoints: [
              'Artère coronaire gauche (ACG) : tronc commun court se divisant en artère interventriculaire antérieure (IVA) et artère circonflexe (Cx). Irrigue l’atrium gauche, la majeure partie du ventricule gauche et les 2/3 antérieurs du septum interventriculaire.',
              'Artère coronaire droite (ACD) : chemine dans le sillon coronaire droit puis donne l’artère interventriculaire postérieure (dans 80–85 % des cas : dominance droite). Irrigue le cœur droit, le nœud sinusal (~60 %) et le nœud atrio-ventriculaire (~85 %).',
              'Veines du cœur : grande veine du cœur, veine moyenne et petite veine du cœur se jettent dans le sinus coronaire ; les petites veines antérieures et veines minimes (de Thébésius) s’ouvrent directement dans les cavités.',
            ],
          },
          {
            id: 'coeur-innervation',
            kind: 'innervation',
            title: '6. Innervation intrinsèque et extrinsèque',
            paragraphs: [
              'L’automatisme cardiaque repose sur le tissu nodal intrinsèque : le nœud sino-atrial (de Keith et Flack), situé dans la paroi de l’atrium droit près de l’abouchement de la veine cave supérieure, impose le rythme sinusal (60–80 bpm). L’onde gagne ensuite le nœud atrio-ventriculaire (d’Aschoff-Tawara) dans le triangle de Koch, puis le faisceau atrio-ventriculaire (de His), ses deux branches droite et gauche et les fibres sous-endocardiques de Purkinje.',
              'L’innervation extrinsèque autonome module ce rythme via le plexus cardiaque : le système sympathique (nerfs cardiaques cervicaux et thoraciques, noradrénaline sur récepteurs β1) est chronotrope, inotrope, dromotrope et bathmotrope positif ; le système parasympathique (nerf vague X, acétylcholine sur récepteurs M2) exerce un effet cardiomodérateur.',
            ],
          },
          {
            id: 'coeur-clinique',
            kind: 'clinique',
            title: '7. Corrélations cliniques essentielles',
            paragraphs: [
              'L’occlusion aiguë d’une artère coronaire (le plus souvent l’IVA) entraîne une ischémie puis un infarctus du myocarde, car les artères coronaires sont fonctionnellement terminales.',
              'Un épanchement péricardique abondant ou rapide provoque une tamponnade cardiaque : compression des cavités droites empêchant le remplissage diastolique (triade de Beck : hypotension, turgescence jugulaire, assourdissement des bruits du cœur).',
              'La dilatation de l’atrium gauche (ex. rétrécissement mitral) peut comprimer l’œsophage en arrière (dysphagie) ou le nerf laryngé récurrent gauche (dysphonie, syndrome d’Ortner).',
            ],
          },
          {
            id: 'coeur-memoriser',
            kind: 'memoriser',
            title: '8. Points essentiels à mémoriser & résumé examen',
            paragraphs: [
              'À retenir impérativement pour l’épreuve d’anatomie :',
            ],
            bulletPoints: [
              'Projection de l’apex : 5e espace intercostal gauche sur la ligne médio-claviculaire.',
              'L’atrium gauche forme la majeure partie de la base postérieure du cœur et répond directement à l’œsophage.',
              'Le ventricule droit forme la majeure partie de la face sternocostale (antérieure).',
              'La perfusion coronaire est maximale en diastole (quand le myocarde est relâché).',
              'Valve mitrale = 2 cuspides (cœur gauche) ; Valve tricuspide = 3 cuspides (cœur droit).',
              'Le sinus coronaire s’ouvre dans l’atrium droit entre l’orifice de la veine cave inférieure et l’orifice atrio-ventriculaire droit.',
            ],
          },
        ],
        examTips: [
          'Ne confondez pas la face antérieure (dominée par le ventricule droit) et la face pulmonaire gauche (dominée par le ventricule gauche).',
          'En QCM, vérifiez toujours si la dominance coronaire est précisée : par défaut, l’artère interventriculaire postérieure naît de la coronaire droite dans 80 % des cas.',
        ],
      },
    ],
  },
  {
    id: 'anat-ch-2',
    moduleId: 'anatomie',
    order: 2,
    title: 'Les poumons',
    description:
      'Lobes, scissures, arbre trachéo-bronchique, segmentation broncho-pulmonaire, hile et pédicule pulmonaire.',
    lessons: [
      {
        id: 'anat-poumons-complet',
        moduleId: 'anatomie',
        chapterId: 'anat-ch-2',
        title: 'Anatomie des poumons et de la segmentation bronchique',
        subtitle: 'Organes pairs asymétriques de l’hématose, pédicules fonctionnels et nourriciers',
        estimatedMinutes: 30,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Hile pulmonaire',
            definition:
              'Dépression située sur la face médiastinale de chaque poumon par laquelle pénètrent et sortent les éléments du pédicule pulmonaire (bronche principale, artère pulmonaire, veines pulmonaires, vaisseaux bronchiques, nerfs et lymphatiques).',
          },
          {
            term: 'Segment broncho-pulmonaire',
            definition:
              'Unité anatomo-fonctionnelle et chirurgicale autonome du poumon, ventilée par une bronche segmentaire (tertiaire) et vascularisée par une branche segmentaire de l’artère pulmonaire.',
          },
        ],
        sections: [
          {
            id: 'poumons-intro',
            kind: 'introduction',
            title: '1. Introduction et vue d’ensemble',
            paragraphs: [
              'Les poumons sont les organes pairs et asymétriques de la respiration, responsables de l’hématose (oxygénation du sang veineux et élimination du dioxyde de carbone). Ils occupent chacun une loge pleuro-pulmonaire latérale au médiastin.',
              'Le tissu pulmonaire sain est léger, spongieux, élastique et crépitant à la palpation du fait de la présence d’air alvéolaire.',
            ],
            image: {
              src: ANATOMIE_IMAGES.poumons,
              alt: 'Vue antérieure des poumons droit et gauche avec trachée, bronches et scissures',
              caption:
                'Poumon droit (3 lobes, 2 scissures) et poumon gauche (2 lobes, 1 scissure oblique et incisure cardiaque) avec division trachéo-bronchique.',
            },
          },
          {
            id: 'poumons-situation',
            kind: 'situation',
            title: '2. Situation, configuration externe et asymétrie',
            paragraphs: [
              'Chaque poumon a la forme d’un demi-cône à sommet supérieur (apex dépassant la 1re côte vers le creux sus-claviculaire) et à base inférieure concave moulée sur la coupole diaphragmatique correspondante.',
              'Le poumon droit est plus court (soulevé par le foie sous-jacent), plus large et plus lourd (~650 g) que le poumon gauche (~550 g), qui est échancré en avant par l’incisure cardiaque.',
            ],
            table: {
              caption: 'Comparaison anatomique entre le poumon droit et le poumon gauche',
              headers: ['Critère', 'Poumon droit', 'Poumon gauche'],
              rows: [
                ['Lobes', '3 lobes (supérieur, moyen, inférieur)', '2 lobes (supérieur avec lingula, inférieur)'],
                ['Scissures', '2 scissures (oblique et horizontale)', '1 scissure (oblique uniquement)'],
                ['Segments', '10 segments broncho-pulmonaires', '8 à 10 segments (fusion fréquente apico-post. et antéro-médial)'],
                ['Bronche principale', 'Plus courte, plus large, plus verticale', 'Plus longue, plus étroite, plus horizontale (passe sous l’arc aortique)'],
                ['Empreintes médiastinales', 'Veine cave supérieure, grande veine azygos', 'Arc de l’aorte, cœur (empreinte cardiaque marquée)'],
              ],
            },
          },
          {
            id: 'poumons-vascularisation',
            kind: 'vascularisation',
            title: '3. Double vascularisation : fonctionnelle et nourricière',
            paragraphs: [
              'Les poumons possèdent une double vascularisation artérielle bien distincte :',
            ],
            bulletPoints: [
              'Vascularisation fonctionnelle (hématose) : les artères pulmonaires droite et gauche (issues du tronc pulmonaire) amènent du sang pauvre en O2 aux capillaires alvéolaires ; quatre veines pulmonaires (deux droites, deux gauches) ramènent le sang riche en O2 vers l’atrium gauche.',
              'Vascularisation nourricière : les artères bronchiques (naissant directement de l’aorte thoracique descendante) irriguent les parois bronchiques, le tissu conjonctif et la plèvre viscérale. Les veines bronchiques se drainent dans les systèmes azygos et hémi-azygos.',
            ],
          },
          {
            id: 'poumons-lymphatique',
            kind: 'lymphatique',
            title: '4. Innervation et drainage lymphatique',
            paragraphs: [
              'L’innervation provient du plexus pulmonaire (fibres parasympathiques du nerf vague X entraînant bronchoconstriction et hypersécrétion, et fibres sympathiques assurant bronchodilatation).',
              'Le drainage lymphatique s’effectue par un réseau superficiel (sous-pleural) et un réseau profond (péri-bronchique) vers les nœuds intra-pulmonaires, broncho-pulmonaires (hilaires), trachéo-bronchiques (dont les nœuds sous-carénaires), puis vers les troncs broncho-médiastinaux.',
            ],
          },
          {
            id: 'poumons-clinique',
            kind: 'clinique',
            title: '5. Corrélations cliniques et points à mémoriser',
            paragraphs: [
              'En raison du calibre plus large et de l’orientation quasi verticale de la bronche principale droite, les corps étrangers inhalés se logent préférentiellement dans le poumon droit (souvent dans le lobe inférieur).',
              'Une tumeur de l’apex pulmonaire (syndrome de Pancoast-Tobias) peut envahir le plexus brachial (douleurs du membre supérieur) et la chaîne sympathique cervicale (syndrome de Claude Bernard-Horner : myosis, ptosis, énophtalmie).',
            ],
            bulletPoints: [
              'Au hile droit : la bronche principale est postéro-supérieure (artère pulmonaire en avant, bronche épartérielle au-dessus).',
              'Au hile gauche : l’artère pulmonaire passe au-dessus de la bronche principale gauche (bronche hypartérielle).',
              'Dans les deux hiles, les veines pulmonaires occupent la position la plus antérieure et inférieure.',
            ],
          },
        ],
        examTips: [
          'Retenez l’ordre des éléments du pédicule pulmonaire : d’avant en arrière : Veine — Artère — Bronche (VAB).',
          'Attention à la scissure horizontale : elle n’existe qu’à droite et sépare le lobe supérieur du lobe moyen.',
        ],
      },
    ],
  },
  {
    id: 'anat-ch-3',
    moduleId: 'anatomie',
    order: 3,
    title: 'La paroi thoracique',
    description:
      'Cage thoracique ostéo-cartilagineuse, côtes, sternum, espaces intercostaux, muscles respiratoires et diaphragme.',
    lessons: [
      {
        id: 'anat-paroi-complet',
        moduleId: 'anatomie',
        chapterId: 'anat-ch-3',
        title: 'Anatomie de la paroi thoracique et du diaphragme',
        subtitle: 'Charpente ostéo-articulaire, paquet vasculo-nerveux intercostal et mécanique ventilatoire',
        estimatedMinutes: 28,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Angle sternal (de Louis)',
            definition:
              'Saillie transversale palpable entre le manubrium et le corps du sternum, repère anatomique majeur situé au niveau du 2e cartilage costal et du disque intervertébral T4-T5.',
          },
          {
            term: 'Pédicule vasculo-nerveux intercostal',
            definition:
              'Ensemble constitué de haut en bas par la veine, l’artère et le nerf intercostal (VAN), logé dans le sillon costal au bord inférieur de chaque côte.',
          },
        ],
        sections: [
          {
            id: 'paroi-intro',
            kind: 'introduction',
            title: '1. Charpente osseuse et ouvertures du thorax',
            paragraphs: [
              'La cage thoracique protège les viscères cardio-respiratoires et constitue le support mécanique de la ventilation. Elle est formée en arrière par les 12 vertèbres thoraciques (T1 à T12), en avant par le sternum (manubrium, corps et processus xiphoïde) et latéralement par 12 paires de côtes et leurs cartilages costaux.',
            ],
            bulletPoints: [
              'Vraies côtes (1re à 7e) : s’articulent directement avec le sternum par leur propre cartilage costal.',
              'Fausses côtes (8e à 10e) : leur cartilage s’unit au 7e cartilage costal pour former le rebord costal.',
              'Côtes flottantes (11e et 12e) : dépourvues de cartilage antérieur, se terminent librement dans les muscles abdominaux.',
              'Ouverture supérieure du thorax : limitée par T1, la 1re paire de côtes et le bord supérieur du manubrium sternal.',
              'Ouverture inférieure : fermée par le muscle diaphragme.',
            ],
          },
          {
            id: 'paroi-espaces',
            kind: 'structures',
            title: '2. Espaces intercostaux et vascularisation',
            paragraphs: [
              'Chaque espace intercostal contient trois couches musculaires superposées de dehors en dedans : les muscles intercostaux externes (inspirateurs, fibres obliques en bas et en avant), internes (expirateurs) et intimes.',
              'Le paquet vasculo-nerveux intercostal chemine entre le muscle intercostal interne et le muscle intercostal intime, à l’abri dans la gouttière sous-costale du bord inférieur de la côte sus-jacente.',
            ],
            bulletPoints: [
              'Vascularisation artérielle : double origine — artères intercostales postérieures (issues de l’aorte thoracique descendante pour les 9 derniers espaces) anastomosées avec les artères intercostales antérieures (branches de l’artère thoracique interne, elle-même issue de l’artère subclavière).',
              'Drainage veineux : veines intercostales antérieures vers les veines thoraciques internes ; veines intercostales postérieures vers le système azygos à droite et hémi-azygos à gauche.',
              'Innervation : nerfs intercostaux (rameaux ventraux des nerfs spinaux T1 à T11) et nerf subcostal (T12).',
            ],
          },
          {
            id: 'paroi-diaphragme',
            kind: 'rapports',
            title: '3. Le diaphragme : muscle inspirateur principal',
            paragraphs: [
              'Cloison musculo-tendineuse en forme de double coupole (la coupole droite étant plus haute d’un espace intercostal en raison du foie), le diaphragme comporte un centre tendineux périphériquement entouré de portions musculaires sternale, costale et lombaire (piliers droit et gauche).',
              'Il est innervé exclusivement par les nerfs phréniques droit et gauche (issus des racines cervicales C3-C4-C5 : « C3, C4, C5 keep the diaphragm alive »).',
            ],
            table: {
              caption: 'Principaux orifices du diaphragme et repères vertébraux',
              headers: ['Orifice (hiatus)', 'Niveau vertébral', 'Éléments traversants'],
              rows: [
                ['Foramen de la veine cave inférieure', 'T8 (dans le centre tendineux)', 'Veine cave inférieure + rameaux du nerf phrénique droit'],
                ['Hiatus œsophagien', 'T10 (portion musculaire)', 'Œsophage + troncs vagaux antérieur et postérieur'],
                ['Hiatus aortique', 'T12 (en arrière du ligament arqué médian)', 'Aorte + conduit thoracique + (parfois veine azygos)'],
              ],
            },
          },
          {
            id: 'paroi-clinique',
            kind: 'clinique',
            title: '4. Application clinique : ponction et drainage thoracique',
            paragraphs: [
              'Lors d’une ponction pleurale (thoracentèse) ou de la pose d’un drain thoracique, l’aiguille doit impérativement être introduite au BORD SUPÉRIEUR de la côte inférieure de l’espace intercostal choisi (et jamais au bord inférieur de la côte supérieure) afin d’éviter toute lésion du pédicule vasculo-nerveux (Veine, Artère, Nerf) logé dans la gouttière sous-costale.',
            ],
          },
        ],
        examTips: [
          'Mémorisez l’ordre de haut en bas dans le sillon costal : V-A-N (Veine, Artère, Nerf).',
          'Mémorisez les niveaux des orifices diaphragmatiques : VCI en T8, Œsophage en T10, Aorte en T12.',
        ],
      },
    ],
  },
  {
    id: 'anat-ch-4',
    moduleId: 'anatomie',
    order: 4,
    title: 'La plèvre',
    description:
      'Feuillets viscéral et pariétal, cavité pleurale, récessus pleuraux, dôme pleural et mécanique d’accolement.',
    lessons: [
      {
        id: 'anat-plevre-complet',
        moduleId: 'anatomie',
        chapterId: 'anat-ch-4',
        title: 'Anatomie des plèvres et des récessus pleuraux',
        subtitle: 'Séreuses d’enveloppe pulmonaire, pression négative intrapleurale et zones de réflexion',
        estimatedMinutes: 22,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Cavité pleurale',
            definition:
              'Espace virtuel clos compris entre la plèvre viscérale et la plèvre pariétale, contenant une mince lame de liquide séreux (5 à 15 mL) maintenant une pression négative indispensable au déploiement pulmonaire.',
          },
          {
            term: 'Récessus costo-diaphragmatique',
            definition:
              'Cul-de-sac pleural inférieur formé par la réflexion de la plèvre pariétale costale sur la plèvre diaphragmatique, point déclive où s’accumulent initialement les épanchements pleuraux.',
          },
        ],
        sections: [
          {
            id: 'plevre-intro',
            kind: 'introduction',
            title: '1. Organisation générale de la plèvre',
            paragraphs: [
              'Chaque poumon est entouré d’une membrane séreuse close à double feuillet : la plèvre. Les deux sacs pleuraux droit et gauche sont totalement indépendants l’un de l’autre, séparés par le médiastin.',
              'Les deux feuillets se continuent l’un avec l’autre au niveau du hile pulmonaire et se prolongent en bas par le ligament pulmonaire (ligament triangulaire).',
            ],
            bulletPoints: [
              'Plèvre viscérale (pulmonaire) : adhère intimement au parenchyme pulmonaire et s’insinue dans les scissures interlobaires. Insensible à la douleur (innervation autonome).',
              'Plèvre pariétale : tapisse la face interne de la loge thoracique. Divisée topographiquement en plèvre costale, diaphragmatique, médiastinale et dôme pleural (cupule pleurale). Richement innervée par des fibres sensitives somatiques (nerfs intercostaux et nerf phrénique) : très douloureuse lorsqu’elle est irritée.',
            ],
          },
          {
            id: 'plevre-recessus',
            kind: 'rapports',
            title: '2. Récessus pleuraux et projections thoraciques',
            paragraphs: [
              'Aux zones de transition de la plèvre pariétale existent des culs-de-sac appelés récessus pleuraux, que le poumon ne remplit complètement qu’en inspiration forcée.',
            ],
            bulletPoints: [
              'Récessus costo-diaphragmatique (le plus important cliniquement) : s’étend jusqu’à la 8e côte sur la ligne médio-claviculaire, la 10e côte sur la ligne axillaire moyenne et la 12e côte en arrière.',
              'Récessus costo-médiastinaux antérieur et postérieur : entre plèvre costale et plèvre médiastinale.',
              'Dôme pleural : dépasse la 1re côte et répond au plexus brachial, aux vaisseaux subclaviers et au ganglion stellaire (cervico-thoracique). Il est fixé par l’appareil suspenseur de la plèvre (ligaments de Sebileau).',
            ],
          },
          {
            id: 'plevre-clinique',
            kind: 'clinique',
            title: '3. Corrélations cliniques : pneumothorax et pleurésie',
            paragraphs: [
              'Toute irruption d’air dans la cavité pleurale (pneumothorax) rompt la pression négative, entraînant le collapsus élastique du poumon vers son hile.',
              'La présence de liquide (pleurésie séro-fibrineuse, hémothorax, pyothorax) s’accumule par gravité dans le récessus costo-diaphragmatique, visible sur une radiographie thoracique par un comblement du cul-de-sac latéral (ligne de Damoiseau).',
            ],
          },
        ],
        examTips: [
          'Retenez l’asymétrie d’innervation : la plèvre pariétale est très sensible (douleur thoracique de type pleural), alors que la plèvre viscérale est insensible.',
        ],
      },
    ],
  },
  {
    id: 'anat-ch-5',
    moduleId: 'anatomie',
    order: 5,
    title: 'Le médiastin',
    description:
      'Limites anatomiques, subdivisions (supérieur, antérieur, moyen, postérieur) et contenu viscéral et vasculo-nerveux.',
    lessons: [
      {
        id: 'anat-mediastin-complet',
        moduleId: 'anatomie',
        chapterId: 'anat-ch-5',
        title: 'Subdivisions et contenu du médiastin',
        subtitle: 'Carrefour thoracique médian entre les deux loges pleuro-pulmonaires',
        estimatedMinutes: 30,
        difficulty: 'Intermédiaire',
        keyDefinitions: [
          {
            term: 'Médiastin',
            definition:
              'Région anatomique médiane et impaire du thorax située entre les deux plèvres médiastinales, limitée en avant par le plastron sterno-costal, en arrière par le rachis thoracique, en haut par l’ouverture supérieure du thorax et en bas par le diaphragme.',
          },
          {
            term: 'Plan thoracique transverse (de Ludwig)',
            definition:
              'Plan horizontal passant en avant par l’angle sternal (de Louis) et en arrière par le disque intervertébral T4-T5, divisant le médiastin en médiastin supérieur et médiastin inférieur.',
          },
        ],
        sections: [
          {
            id: 'mediastin-intro',
            kind: 'introduction',
            title: '1. Limites et division topographique',
            paragraphs: [
              'Selon la nomenclature anatomique internationale (Terminologia Anatomica), le plan horizontal passant par l’angle sternal (T4-T5) divise le médiastin en deux étages : le médiastin supérieur et le médiastin inférieur. Ce dernier est subdivisé d’avant en arrière par le péricarde en trois compartiments : antérieur, moyen et postérieur.',
            ],
            image: {
              src: ANATOMIE_IMAGES.mediastin,
              alt: 'Vue sagittale et antérieure de la cage thoracique et du médiastin',
              caption:
                'Rapports du médiastin avec le sternum en avant, la colonne thoracique en arrière et le diaphragme en bas.',
            },
          },
          {
            id: 'mediastin-contenu',
            kind: 'structures',
            title: '2. Contenu détaillé de chaque compartiment',
            paragraphs: [
              'Chaque compartiment médiastinal abrite des structures clés dont la connaissance oriente immédiatement le diagnostic étiologique des masses médiastinales.',
            ],
            table: {
              caption: 'Subdivisions du médiastin et éléments contenus',
              headers: ['Compartiment', 'Limites', 'Contenu principal'],
              rows: [
                [
                  'Médiastin supérieur',
                  'Au-dessus du plan angle sternal / T4-T5',
                  'Thymus (ou reliquat thymique), troncs veineux brachiocéphaliques, moitié supérieure de la VCS, crosse de l’aorte et ses 3 branches, trachée, œsophage supérieur, nerfs vagues (X), phréniques et nerf laryngé récurrent gauche, conduit thoracique',
                ],
                [
                  'Médiastin antérieur',
                  'Entre sternum et face antérieure du péricarde',
                  'Tissu graisseux et conjonctif lâche, ligaments sterno-péricardiques, nœuds lymphatiques parasternaux, partie inférieure du thymus chez l’enfant',
                ],
                [
                  'Médiastin moyen',
                  'Loge péricardique',
                  'Cœur et péricarde, racine de l’aorte ascendante, tronc pulmonaire, partie terminale de la VCS et de la VCI, bifurcation trachéale, nerfs phréniques',
                ],
                [
                  'Médiastin postérieur',
                  'Entre face postérieure du péricarde et rachis (T5-T12)',
                  'Œsophage thoracique, aorte thoracique descendante, système veineux azygos / hémi-azygos, conduit thoracique, nerfs vagues (plexus œsophagien), troncs sympathiques thoraciques et nerfs splanchniques',
                ],
              ],
            },
          },
          {
            id: 'mediastin-clinique',
            kind: 'clinique',
            title: '3. Corrélations cliniques : syndrome médiastinal',
            paragraphs: [
              'Une tumeur ou adénopathie du médiastin peut comprimer les organes de voisinage :',
            ],
            bulletPoints: [
              'Compression de la veine cave supérieure (syndrome cave supérieur) : œdème en pèlerine, turgescence jugulaire, circulation collatérale thoracique.',
              'Compression du nerf laryngé récurrent gauche (sous la crosse aortique) : dysphonie bitonale par paralysie de la corde vocale gauche.',
              'Compression du nerf phrénique : élévation et paralysie de la coupole diaphragmatique homolatérale.',
              'Orientation selon le compartiment : antéro-supérieur (thymome, goitre plongeant, lymphome, tératome) ; moyen (kyste bronchogénique, adénopathies) ; postérieur (tumeurs neurogènes).',
            ],
          },
        ],
        examTips: [
          'Le plan de séparation médiastin supérieur / inférieur passe par l’angle sternal en avant et le disque T4-T5 en arrière : c’est aussi le niveau de la bifurcation trachéale (carène) et de la terminaison de l’arc aortique.',
        ],
      },
    ],
  },
  {
    id: 'anat-ch-6',
    moduleId: 'anatomie',
    order: 6,
    title: 'Les glandes mammaires',
    description:
      'Situation, structure lobaire, ligaments de Cooper, vascularisation et drainage lymphatique axillaire et parasternal.',
    lessons: [
      {
        id: 'anat-mammaire-complet',
        moduleId: 'anatomie',
        chapterId: 'anat-ch-6',
        title: 'Anatomie des glandes mammaires et drainage lymphatique',
        subtitle: 'Glandes sudoripares modifiées de la paroi thoracique antérieure : organisation et voies ganglionnaires',
        estimatedMinutes: 25,
        difficulty: 'Fondamental',
        keyDefinitions: [
          {
            term: 'Ligaments suspenseurs du sein (de Cooper)',
            definition:
              'Tractus fibreux reliant le derme cutané au fascia pectoral profond en traversant le parenchyme glandulaire et le tissu adipeux.',
          },
          {
            term: 'Prolongement axillaire (queue de Spence)',
            definition:
              'Extension du quadrant supéro-externe de la glande mammaire perforant le fascia axillaire jusque dans le creux axillaire.',
          },
        ],
        sections: [
          {
            id: 'mammaire-intro',
            kind: 'introduction',
            title: '1. Situation, rapports et morphologie',
            paragraphs: [
              'La glande mammaire (sein) est une glande exocrine paire située dans le tissu sous-cutané de la paroi thoracique antérieure, s’étendant verticalement de la 2e à la 6e côte et transversalement du bord latéral du sternum jusqu’à la ligne axillaire moyenne.',
              'Elle repose pour ses deux tiers supéro-médiaux sur le fascia du muscle grand pectoral, et pour son tiers inféro-latéral sur le muscle dentelé antérieur (grand dentelé) et l’aponévrose du muscle oblique externe. Entre la glande et le fascia pectoral existe un plan celluleux lâche (espace rétro-mammaire de Chassaignac) permettant sa mobilité.',
            ],
            image: {
              src: ANATOMIE_IMAGES.mammaire,
              alt: 'Coupe sagittale de la glande mammaire et de la paroi thoracique avec drainage lymphatique',
              caption:
                'Organisation sagittale du sein : lobes glandulaires, conduits lactifères, muscle grand pectoral sous-jacent et réseau lymphatique axillaire.',
            },
          },
          {
            id: 'mammaire-interne',
            kind: 'interne',
            title: '2. Configuration interne',
            paragraphs: [
              'La glande mammaire est constituée de 15 à 20 lobes glandulaires disposés en rayons autour du mamelon et séparés par du tissu adipeux et des cloisons fibreuses (ligaments de Cooper).',
              'Chaque lobe est drainé par un conduit lactifère (canal galactophore) qui présente une dilatation sous-aréolaire (sinus lactifère) avant de s’aboucher au sommet du mamelon.',
            ],
          },
          {
            id: 'mammaire-vasc',
            kind: 'vascularisation',
            title: '3. Vascularisation et innervation',
            paragraphs: [
              'La vascularisation artérielle provient principalement de trois sources :',
            ],
            bulletPoints: [
              'En dedans : rameaux perforants de l’artère thoracique interne (mammaire interne, issue de l’artère subclavière) — source majoritaire (~60 %).',
              'En dehors : artère thoracique latérale et branches mammaires de l’artère thoraco-acromiale (issues de l’artère axillaire).',
              'En profondeur : rameaux perforants des artères intercostales postérieures (2e à 4e).',
              'Innervation : rameaux cutanés antérieurs et latéraux des 2e au 6e nerfs intercostaux (le mamelon est classiquement centré sur le dermatome T4).',
            ],
          },
          {
            id: 'mammaire-lymphatique',
            kind: 'lymphatique',
            title: '4. Drainage lymphatique (capital en cancérologie)',
            paragraphs: [
              'Plus de 75 % de la lymphe mammaire (notamment des quadrants externes) se draine vers les nœuds lymphatiques axillaires, organisés en cinq groupes principaux : pectoral (antérieur, premier relais habituel), subscapulaire (postérieur), huméral (latéral), central et apical.',
              'Environ 20 à 25 % (quadrants internes) se drainent vers les nœuds lymphatiques parasternaux (chaîne mammaire interne), le long des vaisseaux thoraciques internes. Une faible part gagne les nœuds supraclaviculaires ou le sein controlatéral.',
            ],
          },
          {
            id: 'mammaire-clinique',
            kind: 'clinique',
            title: '5. Corrélations cliniques',
            paragraphs: [
              'L’envahissement cancéreux des ligaments suspenseurs de Cooper provoque leur rétraction, entraînant une fossette ou rétraction cutanée (signe de capiton). L’obstruction des lymphatiques dermiques produit un œdème cutané donnant un aspect caractéristique en « peau d’orange ».',
              'La fixation de la tumeur au fascia du muscle grand pectoral limite la mobilité du sein lors de la contraction contrariée du muscle (manœuvre de Tillaux).',
            ],
          },
        ],
        examTips: [
          'Le premier relais ganglionnaire axillaire le plus fréquent (ganglion sentinelle) appartient au groupe pectoral (antérieur) situé le long du bord inférieur du grand pectoral.',
          'Dermatome du mamelon = T4.',
        ],
      },
    ],
  },
];

export const anatomieFlashcards: Flashcard[] = [
  {
    id: 'anat-fc-1',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-1',
    chapterTitle: 'Le cœur',
    front: 'Où se projette l’apex (pointe) du cœur sur la paroi thoracique ?',
    back: 'Au 5e espace intercostal gauche, sur la ligne médio-claviculaire.',
    explanation: 'C’est également le foyer d’auscultation de la valve mitrale.',
  },
  {
    id: 'anat-fc-2',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-1',
    chapterTitle: 'Le cœur',
    front: 'À quel moment du cycle cardiaque la perfusion coronaire est-elle maximale ?',
    back: 'Pendant la diastole ventriculaire.',
    explanation:
      'En systole, la contraction myocardique comprime les branches perforantes intramyocardiques, surtout au niveau du ventricule gauche.',
  },
  {
    id: 'anat-fc-3',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-1',
    chapterTitle: 'Le cœur',
    front: 'Quel organe est directement en rapport avec la face postérieure de l’atrium gauche ?',
    back: 'L’œsophage thoracique (séparé par le sinus oblique du péricarde).',
    explanation: 'Une dilatation de l’atrium gauche peut ainsi provoquer une dysphagie.',
  },
  {
    id: 'anat-fc-4',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-2',
    chapterTitle: 'Les poumons',
    front: 'Combien de lobes et de scissures possède chaque poumon ?',
    back: 'Poumon droit : 3 lobes et 2 scissures (oblique et horizontale). Poumon gauche : 2 lobes et 1 scissure (oblique).',
    explanation: 'Le lobe supérieur gauche possède la lingula, équivalent embryologique du lobe moyen droit.',
  },
  {
    id: 'anat-fc-5',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-2',
    chapterTitle: 'Les poumons',
    front: 'Dans quel ordre se disposent les éléments principaux du hile pulmonaire d’avant en arrière ?',
    back: 'Veine pulmonaire (en avant) → Artère pulmonaire → Bronche principale (en arrière).',
    explanation: 'Moyen mnémotechnique : VAB (Veine, Artère, Bronche).',
  },
  {
    id: 'anat-fc-6',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-3',
    chapterTitle: 'La paroi thoracique',
    front: 'À quels niveaux vertébraux se situent les 3 principaux orifices du diaphragme ?',
    back: 'Veine cave inférieure : T8 · Œsophage : T10 · Aorte : T12.',
    explanation: 'Chaque orifice descend progressivement d’avant en arrière le long des coupoles et piliers.',
  },
  {
    id: 'anat-fc-7',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-3',
    chapterTitle: 'La paroi thoracique',
    front: 'Où doit-on ponctionner un espace intercostal pour éviter le paquet vasculo-nerveux ?',
    back: 'Au bord supérieur de la côte inférieure de l’espace intercostal.',
    explanation: 'Le paquet VAN (Veine, Artère, Nerf) est logé dans le sillon costal au bord inférieur de la côte supérieure.',
  },
  {
    id: 'anat-fc-8',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-4',
    chapterTitle: 'La plèvre',
    front: 'Quel feuillet pleural est responsable de la douleur thoracique pleurale ?',
    back: 'La plèvre pariétale (innervation somatique par les nerfs intercostaux et le nerf phrénique).',
    explanation: 'La plèvre viscérale ne possède qu’une innervation autonome et est insensible à la douleur.',
  },
  {
    id: 'anat-fc-9',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-5',
    chapterTitle: 'Le médiastin',
    front: 'Quels repères définissent le plan séparant le médiastin supérieur du médiastin inférieur ?',
    back: 'En avant : l’angle sternal (de Louis). En arrière : le disque intervertébral T4-T5.',
    explanation: 'Ce plan passe par la bifurcation trachéale (carène) et le passage de la crosse aortique.',
  },
  {
    id: 'anat-fc-10',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-6',
    chapterTitle: 'Les glandes mammaires',
    front: 'Vers quel groupe ganglionnaire se draine majoritairement la lymphe de la glande mammaire ?',
    back: 'Les nœuds lymphatiques axillaires (> 75 %), en premier lieu le groupe pectoral (antérieur).',
    explanation: 'Les quadrants internes se drainent aussi vers les nœuds parasternaux (20–25 %).',
  },
];

export const anatomieQcms: QcmQuestion[] = [
  {
    id: 'anat-qcm-1',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-1',
    chapterTitle: 'Le cœur',
    type: 'single',
    question:
      'En observant la coupe anatomique du cœur ci-dessous, quelle affirmation concernant la configuration valvulaire et pariétale est exacte ?',
    imageSrc: ANATOMIE_IMAGES.coeur,
    imageCaption: 'Coupe schématique frontale du cœur et des gros vaisseaux',
    options: [
      'La valve mitrale sépare l’atrium droit du ventricule droit et possède trois cuspides',
      'La paroi du ventricule gauche est environ trois fois plus épaisse que celle du ventricule droit',
      'Le sinus coronaire s’abouche directement dans l’atrium gauche',
      'L’artère coronaire gauche naît directement du tronc pulmonaire',
    ],
    correctIndices: [1],
    explanation:
      'Le ventricule gauche propulse le sang dans la circulation systémique à haute pression ; son myocarde mesure 10 à 15 mm contre 3 à 5 mm pour le ventricule droit. La valve mitrale (2 cuspides) est à gauche, le sinus coronaire se jette dans l’atrium droit et les coronaires naissent de l’aorte ascendante.',
    difficulty: 'Facile',
  },
  {
    id: 'anat-qcm-2',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-1',
    chapterTitle: 'Le cœur',
    type: 'multiple',
    question: 'Concernant la vascularisation et le tissu nodal du cœur, quelles propositions sont exactes ?',
    options: [
      'Les artères coronaires naissent des sinus aortiques juste au-dessus des valvules semi-lunaires aortiques',
      'Le nœud sino-atrial est situé dans la paroi de l’atrium gauche',
      'L’artère coronaire gauche se divise en artère interventriculaire antérieure et artère circonflexe',
      'Dans environ 85 % des cas, l’artère du nœud atrio-ventriculaire provient de l’artère coronaire droite',
    ],
    correctIndices: [0, 2, 3],
    explanation:
      'Le nœud sino-atrial (Keith et Flack) est situé dans l’atrium DROIT près de l’orifice de la veine cave supérieure. Les trois autres propositions sont exactes.',
    difficulty: 'Moyen',
  },
  {
    id: 'anat-qcm-3',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-2',
    chapterTitle: 'Les poumons',
    type: 'single',
    question:
      'D’après l’anatomie de l’arbre trachéo-bronchique et des poumons illustrée ci-contre, pourquoi un corps étranger inhalé pénètre-t-il plus souvent dans le poumon droit ?',
    imageSrc: ANATOMIE_IMAGES.poumons,
    imageCaption: 'Trachée, bronches principales et lobes pulmonaires',
    options: [
      'Parce que la bronche principale droite est plus longue et plus horizontale',
      'Parce que le poumon droit ne possède que deux lobes',
      'Parce que la bronche principale droite est plus large, plus courte et plus verticale',
      'Parce que la pression pleurale droite est toujours positive',
    ],
    correctIndices: [2],
    explanation:
      'La bronche principale droite prolonge presque l’axe de la trachée (angle d’environ 25°), elle est plus courte (~2,5 cm) et plus large que la gauche (~5 cm, plus horizontale sous l’arc aortique).',
    difficulty: 'Facile',
  },
  {
    id: 'anat-qcm-4',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-3',
    chapterTitle: 'La paroi thoracique',
    type: 'multiple',
    question: 'Concernant la paroi thoracique et le diaphragme, cochez les réponses justes :',
    options: [
      'Le hiatus œsophagien du diaphragme se situe en regard de T10',
      'Les 8e, 9e et 10e côtes sont dites « fausses côtes » car elles s’unissent au 7e cartilage costal',
      'Le paquet vasculo-nerveux intercostal est disposé de haut en bas : Nerf, Artère, Veine',
      'Le nerf phrénique provient principalement des racines cervicales C3, C4 et C5',
    ],
    correctIndices: [0, 1, 3],
    explanation:
      'Dans la gouttière sous-costale, l’ordre de haut en bas est Veine, Artère, Nerf (VAN), et non l’inverse. Les niveaux diaphragmatiques sont T8 (VCI), T10 (œsophage) et T12 (aorte).',
    difficulty: 'Moyen',
  },
  {
    id: 'anat-qcm-5',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-4',
    chapterTitle: 'La plèvre',
    type: 'boolean',
    question:
      'Vrai ou Faux : La plèvre viscérale est très richement innervée sur le plan somatique et est responsable de la douleur aiguë des pleurésies.',
    options: ['Vrai', 'Faux'],
    correctIndices: [1],
    explanation:
      'Faux. C’est la plèvre PARIÉTALE qui possède une innervation somatique (nerfs intercostaux et nerf phrénique) responsable de la douleur pleurale. La plèvre viscérale ne reçoit qu’une innervation autonome.',
    difficulty: 'Facile',
  },
  {
    id: 'anat-qcm-6',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-5',
    chapterTitle: 'Le médiastin',
    type: 'single',
    question: 'Lequel de ces éléments appartient au médiastin POSTÉRIEUR ?',
    imageSrc: ANATOMIE_IMAGES.mediastin,
    imageCaption: 'Rapports sagittaux et antérieurs du médiastin',
    options: [
      'Le thymus',
      'Le cœur et le péricarde',
      'Le conduit thoracique et le système azygos',
      'Les troncs veineux brachiocéphaliques',
    ],
    correctIndices: [2],
    explanation:
      'Le médiastin postérieur (entre péricarde en avant et T5-T12 en arrière) contient l’œsophage, l’aorte thoracique descendante, les veines azygos/hémi-azygos, le conduit thoracique, les nerfs vagues et les chaînes sympathiques.',
    difficulty: 'Moyen',
  },
  {
    id: 'anat-qcm-7',
    moduleId: 'anatomie',
    chapterId: 'anat-ch-6',
    chapterTitle: 'Les glandes mammaires',
    type: 'multiple',
    question:
      'En vous appuyant sur la coupe sagittale de la glande mammaire ci-contre, quelles affirmations sont exactes ?',
    imageSrc: ANATOMIE_IMAGES.mammaire,
    imageCaption: 'Coupe sagittale du sein et drainage lymphatique',
    options: [
      'La glande mammaire repose en grande partie sur le fascia du muscle grand pectoral',
      'Les ligaments suspenseurs de Cooper relient le derme au fascia pectoral profond',
      'Plus de 75 % du drainage lymphatique du sein rejoint les nœuds lymphatiques axillaires',
      'La glande mammaire est vascularisée exclusivement par les artères intercostales postérieures',
    ],
    correctIndices: [0, 1, 2],
    explanation:
      'La vascularisation artérielle provient surtout de l’artère thoracique interne (médialement) et de l’artère thoracique latérale / thoraco-acromiale (latéralement), complétées par les intercostales.',
    difficulty: 'Moyen',
  },
];
