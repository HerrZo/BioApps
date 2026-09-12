export interface PathwayStep {
  stepNumber: number;
  title: string;
  actor: string;
  mechanism: string;
  molecularDetail: string;
  badge: string;
}

export const HUMORAL_STEPS: PathwayStep[] = [
  {
    stepNumber: 1,
    title: 'Phagozytose & Antigenpräsentation (MHC-II)',
    actor: 'Makrophage / Dendritische Zelle (APC)',
    mechanism: 'Der Makrophage nimmt das Virus durch Phagozytose auf, zerlegt es im Lysosom in Peptidfragmente und präsentiert diese an der Zelloberfläche auf MHC-II-Proteinen.',
    molecularDetail: 'MHC-II kommt ausschließlich auf professionellen Antigen-präsentierenden Zellen vor.',
    badge: '1. Erkennung'
  },
  {
    stepNumber: 2,
    title: 'Aktivierung der T-Helferzelle (CD4+)',
    actor: 'T-Helferzelle (TH)',
    mechanism: 'Die passende T-Helferzelle bindet mit ihrem T-Zell-Rezeptor (TCR) und dem CD4-Korezeptor hochspezifisch an den MHC-II-Antigen-Komplex. Sie schüttet Zytokine (Interleukine) als chemische Signalsubstanzen aus.',
    molecularDetail: 'Schlüssel-Schloss-Prinzip: Nur T-Zellen mit exakt passender variabler Rezeptorregion werden aktiviert.',
    badge: '2. Signal'
  },
  {
    stepNumber: 3,
    title: 'B-Zell-Aktivierung & Klonselektion',
    actor: 'B-Lymphozyt',
    mechanism: 'Eine B-Zelle, deren membrangebundene Antikörper an das freie Antigen gebunden haben, empfängt Zytokine der T-Helferzelle (Zweitsignal). Sie beginnt eine rasante mitotische Teilung (klonale Selektion).',
    molecularDetail: 'Klonale Selektion: Aus Millionen ruhenden B-Zellen vermehrt sich gezielt nur der passende Klon.',
    badge: '3. Proliferation'
  },
  {
    stepNumber: 4,
    title: 'Differenzierung in Plasma- & Gedächtniszellen',
    actor: 'Plasmazellen & B-Gedächtniszellen',
    mechanism: 'Die Klone differenzieren sich: 1. Kurzlebige Plasmazellen mit riesigem rauem ER schütten bis zu 2.000 Antikörper pro Sekunde ins Blut aus. 2. Langlebige B-Gedächtniszellen wandern in Lymphknoten.',
    molecularDetail: 'B-Gedächtniszellen überleben Jahre bis Jahrzehnte und sichern die immunologische Erinnerung.',
    badge: '4. Differenzierung'
  },
  {
    stepNumber: 5,
    title: 'Agglutination & Opsonierung',
    actor: 'Antikörper (Immunglobuline)',
    mechanism: 'Die frei zirkulierenden Y-förmigen Antikörper binden Antigene. Durch ihre zwei Bindungsarme verklumpen sie Viren zu Riesenkomplexen (Agglutination) und markieren sie (Opsonierung) für Fresszellen.',
    molecularDetail: 'Antikörper fressen nichts selbst! Sie blockieren und markieren Erreger für die Phagozytose.',
    badge: '5. Erreger-Elimination'
  }
];

export const CELLULAR_STEPS: PathwayStep[] = [
  {
    stepNumber: 1,
    title: 'Virusinfektion der Wirtszelle',
    actor: 'Körperzelle (z. B. Epithelzelle)',
    mechanism: 'Das Virus dringt in eine körpereigene Zelle ein, schleust sein Erbgut ein und zwingt die Wirtszelle, neue Virusproteine im Zytoplasma herzustellen.',
    molecularDetail: 'Viren sind intrazelluläre Parasiten und können im Inneren von Wirtszellen nicht direkt von Antikörpern erreicht werden.',
    badge: '1. Infektion'
  },
  {
    stepNumber: 2,
    title: 'MHC-I-Präsentation viraler Peptide',
    actor: 'Infizierte Körperzelle',
    mechanism: 'Das zelluläre Proteasom spaltet virale Proteine. Die Bruchstücke werden auf MHC-I-Molekülen an der Außenmembran präsentiert: Die Zelle signalisiert „Ich bin infiziert!“.',
    molecularDetail: 'MHC-I befindet sich auf JEDER kernhaltigen Körperzelle des Menschen.',
    badge: '2. Warnsignal'
  },
  {
    stepNumber: 3,
    title: 'Erkennung durch zytotoxische T-Zelle (CD8+)',
    actor: 'Zytotoxische T-Zelle (TC / T-Killerzelle)',
    mechanism: 'Eine spezifische CD8+ T-Killerzelle dockt mit ihrem T-Zell-Rezeptor und dem CD8-Korezeptor passgenau an den MHC-I-Antigen-Komplex der infizierten Zelle an.',
    molecularDetail: 'CD8 bindet an die konstante Region von MHC-I und sichert den festen Zellkontakt (immunologische Synapse).',
    badge: '3. Arretierung'
  },
  {
    stepNumber: 4,
    title: 'Ausschüttung von Perforinen & Granzymen',
    actor: 'Zytotoxische T-Zelle',
    mechanism: 'Die T-Killerzelle schleust Perforine aus, die Poren in die Membran der Wirtszelle bohren. Durch diese Poren dringen Granzyme (Proteasen) ein und aktivieren zelluläre Kaskaden.',
    molecularDetail: 'Perforin bildet zylindrische Poren, ähnlich wie der Membranangriffskomplex (MAC) des Komplementsystems.',
    badge: '4. Todesstoß'
  },
  {
    stepNumber: 5,
    title: 'Einleitung der Apoptose (Programmierter Zelltod)',
    actor: 'Sterbende Wirtszelle',
    mechanism: 'Granzyme aktivieren Caspasen: Die infizierte Zelle schrumpft, ihre DNA wird fragmentiert, und sie zerfällt in Membranvesikel (Apoptose), bevor neue Viren freigesetzt werden.',
    molecularDetail: 'Vorteil der Apoptose: Kein Zerstören der Nachbarzellen (keine Nekrose) und Makrophagen räumen die Reste sauber ab.',
    badge: '5. Apoptose'
  }
];

export interface VaccinePreset {
  id: string;
  title: string;
  type: 'active' | 'passive';
  substance: string;
  onset: string;
  duration: string;
  memoryCells: boolean;
  indication: string;
  description: string;
  badge: string;
}

export const VACCINE_PRESETS: VaccinePreset[] = [
  {
    id: 'tetanus_active',
    title: 'Tetanus-Schutzimpfung (Aktiv)',
    type: 'active',
    substance: 'Tetanus-Toxoid (unschädlich gemachtes Toxin)',
    onset: 'Nach 1–2 Wochen (Latenzzeit)',
    duration: 'Ca. 10 Jahre (Gedächtniszellen)',
    memoryCells: true,
    indication: 'Präventive Standard-Schutzimpfung für alle Menschen.',
    description: 'Der Körper bildet selbst aktiv B- und T-Gedächtniszellen gegen das Tetanustoxin. Bei späterer Infektion greift der Sofortschutz.',
    badge: 'Aktiv (Langzeit)'
  },
  {
    id: 'tetanus_passive',
    title: 'Tetanus-Heilserum (Passiv / Notfall)',
    type: 'passive',
    substance: 'Spender-Antikörper gegen Tetanustoxin (Immunglobuline)',
    onset: 'Sofort nach Injektion (Minuten)',
    duration: 'Nur 3–4 Wochen (Abbau fremder Proteine)',
    memoryCells: false,
    indication: 'Verdacht auf Tetanus nach tiefer Wunde (z. B. rostiger Nagel) bei ungeimpften Patienten.',
    description: 'Fertige Antikörper fangen das Toxin sofort im Blut ab. Da keine eigenen Gedächtniszellen entstehen, ist der Patient nach 4 Wochen wieder ungeschützt!',
    badge: 'Passiv (Notfall)'
  },
  {
    id: 'measles',
    title: 'Masern-Impfung (Aktiv)',
    type: 'active',
    substance: 'Abgeschwächte Masernviren (Lebendimpfstoff)',
    onset: 'Nach ca. 10 Tagen',
    duration: 'Lebenslanger Schutz',
    memoryCells: true,
    indication: 'Kinder-Standardimpfung (Masernschutzgesetz).',
    description: 'Erzeugt eine milde, symptomfreie Immunreaktion, die extrem langlebige B- und T-Gedächtniszellen etabliert.',
    badge: 'Aktiv (Lebenslang)'
  },
  {
    id: 'rabies_combined',
    title: 'Simultanimpfung bei Tollwutbiss',
    type: 'active', // Combined
    substance: 'Tollwut-Totimpfstoff (aktiv) + Tollwut-Immunglobuline (passiv)',
    onset: 'Sofortschutz + zeitverzögerter Dauerschutz',
    duration: 'Sofort wirksam und dauerhaft geschützt',
    memoryCells: true,
    indication: 'Biss eines tollwutverdächtigen Tieres.',
    description: 'Goldstandard im Notfall: Passive Antikörper schützen sofort, während der aktive Impfstoff parallel eigene Gedächtniszellen aufbaut.',
    badge: 'Simultan (Kombiniert)'
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  misconceptionAlert?: string;
  curriculumBadge: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Worin liegt der fundamentale Unterschied zwischen einem Antigen und einem Antikörper?',
    context: 'Grundbegriffe der Immunbiologie (LehrplanPLUS B10 1)',
    options: [
      {
        text: 'Antigene sind Antikörper, die von T-Zellen gefressen wurden.',
        isCorrect: false,
        feedback: 'Falsch. Das ist eine fehlerhafte Vermischung der Begriffe.'
      },
      {
        text: 'Ein Antigen ist eine körperfremde molekulare Struktur (z. B. Virushüllprotein), die eine Immunantwort auslöst. Ein Antikörper ist ein vom Körper (Plasmazellen) hergestelltes, Y-förmiges Abwehrprotein.',
        isCorrect: true,
        feedback: 'Hervorragend! Antigen = Antibody-generating (Erkennungsmerkmal des Erregers); Antikörper = Immunglobulin des Körpers.'
      },
      {
        text: 'Antikörper sitzen auf Viren, während Antigene im Blut schwimmen und Viren jagen.',
        isCorrect: false,
        feedback: 'Genau umgekehrt! Antigene sitzen auf dem Virus, Antikörper schwimmen im Blut.'
      },
      {
        text: 'Es gibt keinen Unterschied; beides sind synonyme Fachbegriffe für weiße Blutkörperchen.',
        isCorrect: false,
        feedback: 'Falsch. Es sind völlig unterschiedliche molekulare Strukturen.'
      }
    ],
    misconceptionAlert: 'Merke: ANTIGEN = Auf dem Erreger (Feind). ANTIKÖRPER = Vom Körper gebaut (Waffe)!',
    curriculumBadge: 'Begriffe'
  },
  {
    id: 2,
    question: 'Welche Aufgabe erfüllen MHC-II-Proteine auf Antigen-präsentierenden Zellen (z. B. Makrophagen)?',
    context: 'MHC-Proteine & Zellinteraktion (B10 2)',
    options: [
      {
        text: 'MHC-II bohrt Löcher in Bakterien und bringt sie zum Platzen.',
        isCorrect: false,
        feedback: 'Falsch. Das tun Perforine oder das Komplementsystem, nicht MHC-Proteine.'
      },
      {
        text: 'MHC-II transportiert Sauerstoff im Blutkreislauf ähnlich wie Hämoglobin.',
        isCorrect: false,
        feedback: 'Falsch. MHC hat keine Transportfunktion für Gase.'
      },
      {
        text: 'MHC-II signalisiert gesunden Körperzellen, dass sie sofort absterben müssen.',
        isCorrect: false,
        feedback: 'Falsch. MHC-II leitet keine Apoptose ein.'
      },
      {
        text: 'MHC-II präsentiert verdaute Bruchstücke phagozytierter Erreger an der Oberfläche, um passende CD4+ T-Helferzellen über deren T-Zell-Rezeptor zu aktivieren.',
        isCorrect: true,
        feedback: 'Perfekt! MHC-II ist der molekulare "Präsentierteller" für CD4+ T-Helferzellen. MHC-I hingegen sitzt auf allen kernhaltigen Zellen für CD8+ Killerzellen!'
      }
    ],
    misconceptionAlert: 'MHC-II = Auf APCs für CD4+ T-Helferzellen. MHC-I = Auf allen Zellen für CD8+ zytotoxische T-Zellen.',
    curriculumBadge: 'MHC & T-Zellen'
  },
  {
    id: 3,
    question: 'Wie zerstören zytotoxische CD8+ T-Zellen (T-Killerzellen) virusinfizierte Körperzellen?',
    context: 'Zelluläre Immunabwehr & Apoptose',
    options: [
      {
        text: 'Sie binden an MHC-I-Antigen-Komplexe, setzen Perforine (Porenbildner) und Granzyme frei und lösen so die gezielte Apoptose (programmierten Zelltod) der Wirtszelle aus.',
        isCorrect: true,
        feedback: 'Brillant! Durch die Apoptose stirbt die Wirtszelle mitsamt den noch unfertigen Viren kontrolliert ab, bevor neue Viren freigesetzt werden.'
      },
      {
        text: 'Sie verschlingen die infizierte Zelle mit Pseudopodien und verdauen sie mit Magensäure.',
        isCorrect: false,
        feedback: 'Falsch. T-Killerzellen phagozytieren nicht; sie induzieren chemisch den programmierten Zelltod.'
      },
      {
        text: 'Sie schütten Unmengen Antikörper aus, die die Zelle ersticken.',
        isCorrect: false,
        feedback: 'Falsch. T-Zellen schütten niemals Antikörper aus! Antikörper werden ausschließlich von B-Zell-Abkömmlingen (Plasmazellen) produziert.'
      },
      {
        text: 'Sie kühlen die Wirtszelle auf 0 °C ab, sodass das Virus einfriert.',
        isCorrect: false,
        feedback: 'Absurder Unsinn.'
      }
    ],
    misconceptionAlert: 'T-Killerzellen schütten KEINE Antikörper aus! Sie nutzen Perforine und induzieren Apoptose.',
    curriculumBadge: 'Zelluläre Abwehr'
  },
  {
    id: 4,
    question: 'Warum erkrankt ein gesunder Mensch bei einem Zweitkontakt mit demselben Erreger in der Regel nicht mehr (Immunität)?',
    context: 'Immunologisches Gedächtnis & Titer-Kinetik',
    options: [
      {
        text: 'Weil das Virus beim zweiten Mal aus Angst vor dem Immunsystem sofort flieht.',
        isCorrect: false,
        feedback: 'Falsch. Viren haben keine Gefühle oder Absichten.'
      },
      {
        text: 'Weil die Haut nach der Erstinfektion dicker wird und keine Viren mehr durchlässt.',
        isCorrect: false,
        feedback: 'Falsch. Die Hautbarriere verändert ihre Dicke durch eine Infektion nicht.'
      },
      {
        text: 'Die vorhandenen langlebigen B- und T-Gedächtniszellen erkennen das Antigen sofort ohne Latenzzeit und produzieren explosionsartig riesige Mengen hochaffiner Antikörper (Sekundärantwort).',
        isCorrect: true,
        feedback: 'Meisterhaft! Bei der Erstinfektion dauert es 5–7 Tage (Latenzzeit), bis Antikörper messbar sind. Bei der Zweitinfektion schießt der Titer innerhalb von Stunden in die Höhe und tilgt den Erreger symptomlos.'
      },
      {
        text: 'Weil das Blut bei der Zweitinfektion kocht und den Erreger verbrennt.',
        isCorrect: false,
        feedback: 'Falsch. Fieber ist zwar eine Immunreaktion, aber das Blut kocht nicht.'
      }
    ],
    misconceptionAlert: 'Gedächtniszellen verkürzen die Latenzzeit auf nahezu null und vervielfachen die Antikörpermenge!',
    curriculumBadge: 'Gedächtniszellen'
  },
  {
    id: 5,
    question: 'Ein Forstwirt tritt tief in einen verrosteten Nagel im Waldboden. Er ist nicht gegen Tetanus geimpft. Welche Impfung muss der Notarzt sofort verabreichen und warum?',
    context: 'Aktive vs. Passive Immunisierung im Notfall',
    options: [
      {
        text: 'Nur eine aktive Impfung, weil sie sofort nach 2 Minuten wirkt.',
        isCorrect: false,
        feedback: 'Falsch. Eine aktive Impfung benötigt 1–2 Wochen, um Gedächtniszellen aufzubauen – bis dahin wäre der Patient an Tetanus verstorben!'
      },
      {
        text: 'Eine passive Immunisierung (Heilserum mit fertigen Tetanus-Antikörpern), weil die Antikörper das tödliche Toxin sofort binden und neutralisieren müssen.',
        isCorrect: true,
        feedback: 'Absolut lebensrettend! Im Akutfall bleibt keine Zeit für eine Primärantwort. Die fertigen Antikörper wirken sofort. Meist wird simultan auch aktiv geimpft, um Dauerschutz aufzubauen.'
      },
      {
        text: 'Gar keine Impfung, da Tetanus durch Trinken von Kamillentee geheilt wird.',
        isCorrect: false,
        feedback: 'Lebensgefährlicher Irrglaube. Tetanus ist eine oft tödliche bakterielle Vergiftung.'
      },
      {
        text: 'Ein Antibiotikum reicht immer aus, da Tetanus-Toxin durch Penicillin aufgelöst wird.',
        isCorrect: false,
        feedback: 'Falsch. Antibiotika töten Bakterien, aber neutralisieren nicht das bereits im Körper zirkulierende Toxin.'
      }
    ],
    misconceptionAlert: 'Im Notfall: PASSIV (fertige Antikörper = Sofortschutz). Zur Vorsorge: AKTIV (Antigene = Gedächtniszellen).',
    curriculumBadge: 'Impfbiologie'
  },
  {
    id: 6,
    question: 'Ein Schüler behauptet: „Antikörper fressen Bakterien auf wie weiße Blutkörperchen.“ Welche Erklärung korrigiert diese Fehlvorstellung fachlich präzise?',
    context: 'Wirkungsweise von Antikörpern (Opsonierung & Agglutination)',
    options: [
      {
        text: 'Die Aussage stimmt; Antikörper besitzen Münder und verdauen Zellwände.',
        isCorrect: false,
        feedback: 'Falsch. Antikörper sind Proteine, keine lebenden Zellen.'
      },
      {
        text: 'Antikörper fressen Bakterien nicht, sondern verwandeln sie in Viren.',
        isCorrect: false,
        feedback: 'Falsch. Viren und Bakterien können sich nicht ineinander umwandeln.'
      },
      {
        text: 'Antikörper zersetzen Bakterien mit starker Schwefelsäure.',
        isCorrect: false,
        feedback: 'Falsch. Antikörper produzieren keine Schwefelsäure.'
      },
      {
        text: 'Antikörper sind unbelebte Proteine ohne Verdauungsorgane. Sie binden Erreger (Neutralisation), verklumpen sie netzartig (Agglutination) und markieren sie über ihren Fc-Stamm für Fresszellen wie Makrophagen (Opsonierung).',
        isCorrect: true,
        feedback: 'Hervorragend! Antikörper fressen nicht – sie sind die Handschellen und Leuchtmarkierungen des Immunsystems. Gefressen wird anschließend von Makrophagen und Granulozyten!'
      }
    ],
    misconceptionAlert: 'Antikörper verdauen nichts! Sie neutralisieren, agglutinieren (verklumpen) und opsonieren (markieren).',
    curriculumBadge: 'Antikörper-Wirkung'
  }
];

export interface GlossaryItem {
  term: string;
  pronunciation?: string;
  definition: string;
  curriculumContext: string;
  example: string;
}

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'Agglutination',
    pronunciation: '[aɡlutinaˈtsi̯oːn]',
    definition: 'Verklumpung von zellulären Erregern (Bakterien, Viren, fremden Erythrozyten) durch zweiwertige oder mehrwertige Antikörper, die mehrere Erreger vernetzen.',
    curriculumContext: 'Humorale Abwehr',
    example: 'IgG- und IgM-Antikörper binden Viren zu großen Komplexen, die von Fresszellen leicht verschlungen werden.'
  },
  {
    term: 'Antigen',
    pronunciation: '[antiˈɡeːn]',
    definition: 'Körperfremde Substanz oder Oberflächenstruktur (meist Proteine oder Polysaccharide auf Erregern), die vom Immunsystem als fremd erkannt wird und eine spezifische Immunantwort auslöst.',
    curriculumContext: 'Immunbiologie 10',
    example: 'Das Spike-Protein auf der Hülle des Influenzavirus oder Kapselproteine von Pneumokokken.'
  },
  {
    term: 'Antikörper (Immunglobulin)',
    pronunciation: '[ˈantiˌkœʁpɐ]',
    definition: 'Y-förmiges lösliches Glykoprotein, das von Plasmazellen als Reaktion auf ein spezifisches Antigen gebildet wird und hochaffin an dieses bindet (Schlüssel-Schloss-Prinzip).',
    curriculumContext: 'Humorale Abwehr',
    example: 'Immunglobulin G (IgG) im Blutplasma zum Schutz vor bakteriellen Infektionen.'
  },
  {
    term: 'Apoptose',
    pronunciation: '[apɔpˈtoːzə]',
    definition: 'Genetisch programmierter, geordneter Zelltod ohne Entzündungsreaktion, eingeleitet durch zellinterne Signale oder zytotoxische T-Zellen.',
    curriculumContext: 'Zelluläre Abwehr',
    example: 'Eine virusinfizierte Körperzelle wird durch Perforine und Granzyme in den Selbstmord getrieben, um Virusvermehrung zu stoppen.'
  },
  {
    term: 'B-Gedächtniszelle',
    definition: 'Langlebige, ruhende B-Lymphozyten, die bei erneutem Kontakt mit demselben Antigen ohne nennenswerte Latenzzeit eine massive Sekundärantwort auslösen.',
    curriculumContext: 'Immunologisches Gedächtnis',
    example: 'Gedächtniszellen nach überstandenen Windpocken schützen ein Leben lang vor Wiedererkrankung.'
  },
  {
    term: 'CD4 & CD8 Korezeptoren',
    definition: 'Oberflächenglykoproteine auf T-Lymphozyten. CD4 bindet an MHC-II (T-Helferzellen), CD8 bindet an MHC-I (zytotoxische T-Zellen).',
    curriculumContext: 'T-Zell-Aktivierung',
    example: 'Das HI-Virus befällt gezielt CD4-positive T-Helferzellen und schwächt dadurch das gesamte Immunsystem.'
  },
  {
    term: 'Klonale Selektion',
    definition: 'Aktivierung und massenhafte mitotische Vermehrung exakt derjenigen B- oder T-Zelle, deren spezifischer Rezeptor zufällig an das eingedrungene Antigen passt.',
    curriculumContext: 'Spezifische Abwehr',
    example: 'Aus einer einzelnen passenden B-Zelle entstehen innerhalb weniger Tage Tausende identische Plasmazellen.'
  },
  {
    term: 'MHC-I (Haupthistokompatibilitätskomplex I)',
    definition: 'Auf allen kernhaltigen Körperzellen vorkommende Proteine, die intrazellulär abgebaute Peptide präsentieren; Zielstruktur für CD8+ zytotoxische T-Zellen.',
    curriculumContext: 'Zelluläre Abwehr',
    example: 'Eine von Grippeviren befallene Lungenzelle präsentiert virale Bruchstücke auf MHC-I.'
  },
  {
    term: 'MHC-II (Haupthistokompatibilitätskomplex II)',
    definition: 'Proteine auf professionellen Antigen-präsentierenden Zellen (Makrophagen, dendritische Zellen, B-Zellen), die phagozytierte Peptide präsentieren; Zielstruktur für CD4+ T-Helferzellen.',
    curriculumContext: 'Antigenpräsentation',
    example: 'Ein Makrophage verdaut Tetanusbakterien und präsentiert deren Toxoidbruchstücke auf MHC-II.'
  },
  {
    term: 'Opsonierung',
    pronunciation: '[ɔpsoniːˈrʊŋ]',
    definition: 'Markierung von Krankheitserregern durch Antikörper oder Komplementfaktoren, wodurch Phagozyten (Fresszellen) den Erreger über Fc-Rezeptoren wesentlich schneller erkennen und aufnehmen.',
    curriculumContext: 'Antikörperwirkung',
    example: 'Mit IgG-Antikörpern besetzte Streptokokken werden bis zu 100-mal schneller von Makrophagen phagozytiert.'
  },
  {
    term: 'Plasmazelle',
    definition: 'Enddifferenzierte, kurzlebige B-Lymphozyten mit stark ausgeprägtem rauem endoplasmatischem Retikulum, die als „Proteinfabriken“ bis zu 2.000 Antikörper pro Sekunde sezernieren.',
    curriculumContext: 'Humorale Abwehr',
    example: 'Plasmazellen im Knochenmark und in den Lymphknoten produzieren nach einer Impfung schützende Antikörper.'
  }
];
