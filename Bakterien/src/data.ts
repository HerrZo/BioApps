export interface GrowthPhase {
  id: 'lag' | 'log' | 'stationary' | 'death';
  name: string;
  germanName: string;
  description: string;
  biologicalMechanism: string;
  color: string;
  badge: string;
}

export const GROWTH_PHASES: GrowthPhase[] = [
  {
    id: 'lag',
    name: 'Lag-Phase',
    germanName: 'Anlaufphase',
    description: 'Die Bakterien passen ihren Stoffwechsel an das Nährmedium an. Es finden noch kaum Zellteilungen statt.',
    biologicalMechanism: 'Induktion neuer Enzyme für die vorhandenen Nährstoffe, Vergrößerung des Zellvolumens, Aufbau von Ribosomen.',
    color: '#eab308',
    badge: '1. Anlauf'
  },
  {
    id: 'log',
    name: 'Log-Phase',
    germanName: 'Exponentielle Phase',
    description: 'Die Keimzahl explodiert! Optimale Bedingungen führen zu einer konstanten minimalen Generationszeit g.',
    biologicalMechanism: 'Ungehemmte Zweiteilung: 1 → 2 → 4 → 8 → 16 → 32 ... Verdopplung alle 20 Minuten bei 37 °C (N(t) = N₀ · 2^(t/g)).',
    color: '#16a34a',
    badge: '2. Verdopplung'
  },
  {
    id: 'stationary',
    name: 'Stationäre Phase',
    germanName: 'Gleichgewichtsphase',
    description: 'Das Wachstum stoppt. Die Zahl lebender Keime bleibt auf einem maximalen Plateau konstant.',
    biologicalMechanism: 'Substrat- und Sauerstoffmangel sowie Anreicherung toxischer Stoffwechselprodukte (Säuren, Alkohole). Geburtenrate = Sterberate.',
    color: '#2563eb',
    badge: '3. Plateau'
  },
  {
    id: 'death',
    name: 'Absterbephase',
    germanName: 'Lysis-Phase',
    description: 'Die Keimzahl bricht dramatisch ein. Die meisten Zellen sterben ab und lysieren.',
    biologicalMechanism: 'Nährstoffe sind restlos aufgebraucht, toxische Endprodukte vergiften die Kultur, zelleigene Autolysine lösen die Zellwand auf.',
    color: '#dc2626',
    badge: '4. Absterben'
  }
];

export interface BiotechPreset {
  id: string;
  title: string;
  organism: string;
  temperature: number;
  isAerobic: boolean;
  glucoseLevel: number;
  description: string;
  product: string;
  badge: string;
}

export const BIOTECH_PRESETS: BiotechPreset[] = [
  {
    id: 'yogurt',
    title: 'Joghurtherstellung (Fermentation)',
    organism: 'Lactobacillus delbrueckii & Streptococcus thermophilus',
    temperature: 42,
    isAerobic: false,
    glucoseLevel: 80,
    description: 'Milchsäurebakterien bauen Milchzucker anaerob zu Milchsäure ab. Der pH-Wert sinkt von 6,8 auf 4,2, wodurch das Milcheiweiß Kasein gerinnt und fest-cremig wird.',
    product: 'Milchsäure + Festes Kasein (Naturjoghurt)',
    badge: 'Milchsäuregärung'
  },
  {
    id: 'yeast',
    title: 'Bierbrauen / Hefegärung',
    organism: 'Saccharomyces cerevisiae (Bäcker-/Bierhefe)',
    temperature: 22,
    isAerobic: false,
    glucoseLevel: 90,
    description: 'Unter Sauerstoffausschluss veratmet Hefe den Zucker nicht, sondern vergärt ihn zu Alkohol und Kohlendioxid (CO₂).',
    product: 'Ethanol + CO₂ (Kohlensäure / Schaum)',
    badge: 'Alkoholische Gärung'
  },
  {
    id: 'biomass',
    title: 'Insulinproduktion im Bioreaktor',
    organism: 'Rekombinantes Escherichia coli',
    temperature: 37,
    isAerobic: true,
    glucoseLevel: 100,
    description: 'Maximale Sauerstoffzufuhr und 37 °C für maximale Zellatmung und Biomassebildung zur Gewinnung medizinischer Wirkstoffe.',
    product: 'Human-Insulin / Enzyme',
    badge: 'Aerobe Biotechnologie'
  },
  {
    id: 'fridge',
    title: 'Lebensmittellagerung im Kühlschrank',
    organism: 'Typische Küchenkeime (Pseudomonas, Enterobakterien)',
    temperature: 4,
    isAerobic: true,
    glucoseLevel: 50,
    description: 'Bei 4 °C verlangsamt sich die Enzymaktivität nach der RGT-Regel drastisch. Die Verdopplungszeit steigt von 20 Minuten auf über 30 Stunden.',
    product: 'Stoffwechselstarre / Haltbarkeit',
    badge: 'Konservierung'
  }
];

export interface FoodChallengeScenario {
  id: string;
  name: string;
  initialCount: number; // KBE/ml
  spoilageThreshold: number; // KBE/ml
  defaultTemp: number; // °C
  defaultPh: number;
  defaultWaterActivity: number; // 0.0 to 1.0
  isAerobic: boolean;
  unpreservedHoursToSpoil: number;
  description: string;
  threatOrganisms: string;
  imageIcon: string;
}

export const FOOD_CHALLENGE_SCENARIOS: FoodChallengeScenario[] = [
  {
    id: 'milk',
    name: 'Frische Vollmilch',
    initialCount: 2000,
    spoilageThreshold: 1000000,
    defaultTemp: 22,
    defaultPh: 6.8,
    defaultWaterActivity: 0.99,
    isAerobic: true,
    unpreservedHoursToSpoil: 8,
    description: 'Frisch gemolkene Milch bietet Keimen ideale Nährstoffe (Zucker, Fette, Proteine) und nahezu neutralen pH-Wert.',
    threatOrganisms: 'Milchsäurebakterien, Enterobakterien (saures Gerinnen, Fäulnis)',
    imageIcon: '🥛'
  },
  {
    id: 'broth',
    name: 'Rinder-Fleischbrühe',
    initialCount: 5000,
    spoilageThreshold: 1000000,
    defaultTemp: 25,
    defaultPh: 6.5,
    defaultWaterActivity: 0.98,
    isAerobic: true,
    unpreservedHoursToSpoil: 6,
    description: 'Reich an Peptiden und freien Aminosäuren. Bei Raumtemperatur vermehren sich Sporenbildner und Fäulniserreger rasant.',
    threatOrganisms: 'Bacillus cereus, Clostridium perfringens',
    imageIcon: '🍲'
  },
  {
    id: 'strawberries',
    name: 'Frische Erdbeeren',
    initialCount: 1500,
    spoilageThreshold: 500000,
    defaultTemp: 22,
    defaultPh: 3.8,
    defaultWaterActivity: 0.96,
    isAerobic: true,
    unpreservedHoursToSpoil: 16,
    description: 'Sauer, aber sehr zuckerreich und weich. Schimmelpilze und wilde Hefen nutzen die freie Feuchtigkeit.',
    threatOrganisms: 'Botrytis cinerea (Grauschimmel), Hefepilze',
    imageIcon: '🍓'
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
    question: 'Ein einzelnes Bakterium teilt sich bei optimalen 37 °C alle 20 Minuten durch Zweiteilung. Wie viele Bakterien sind nach 4 Stunden (12 Generationen) theoretisch entstanden?',
    context: 'Mathematik des exponentiellen Wachstums (LehrplanPLUS B9 2)',
    options: [
      {
        text: '24 Bakterien (12 Verdopplungen · 2)',
        isCorrect: false,
        feedback: 'Falsch. Das wäre lineares Wachstum! Exponentielles Wachstum bedeutet 2 hoch 12, nicht 12 mal 2.'
      },
      {
        text: '240 Bakterien',
        isCorrect: false,
        feedback: 'Falsch. Du unterschätzt die gewaltige Dynamik des exponentiellen Anstiegs.'
      },
      {
        text: '4.096 Bakterien (N = 1 · 2¹² = 4.096)',
        isCorrect: true,
        feedback: 'Hervorragend gerechnet! Nach der Formel N(t) = N₀ · 2ⁿ mit n = 12 Verdopplungen ergibt sich 2¹² = 4.096 Keime. Nach 8 Stunden wären es bereits über 16 Millionen!'
      },
      {
        text: 'Genau 12 Bakterien, weil pro Stunde nur 3 Teilungen stattfinden.',
        isCorrect: false,
        feedback: 'Falsch. Bei jeder Teilung verdoppelt sich die GESAMTE vorhandene Population.'
      }
    ],
    misconceptionAlert: 'Merksatz: Bei der Zweiteilung wächst die Zahl mit Potenzen: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096!',
    curriculumBadge: 'Wachstumskinetik'
  },
  {
    id: 2,
    question: 'Warum überwuchern Bakterien trotz ihres exponentiellen Wachstums nicht innerhalb weniger Tage die gesamte Erde? Welche Phase folgt auf die Log-Phase?',
    context: 'Begrenzungsfaktoren & Stationäre Phase',
    options: [
      {
        text: 'Die stationäre Phase: Nährstofferschöpfung, toxische Stoffwechselprodukte und Platzmangel bremsen das Wachstum, sodass Geburtenrate = Sterberate wird.',
        isCorrect: true,
        feedback: 'Absolut richtig! In jedem echten Lebensraum greifen Umweltkapazität und Dichteabhängigkeit: Sobald Glukose oder Sauerstoff knapp werden oder Säuren ansteigen, stoppt die Vermehrung.'
      },
      {
        text: 'Bakterien hören nach 100 Teilungen freiwillig auf, um ihren Nachkommen Platz zu machen.',
        isCorrect: false,
        feedback: 'Falsch. Bakterien handeln nicht altruistisch; das Stoppen ist eine rein physikochemische Folge von Ressourcenmangel.'
      },
      {
        text: 'Die Schwerkraft der Erde zerquetscht Bakterienkolonien, sobald sie zu hoch werden.',
        isCorrect: false,
        feedback: 'Unsinn.'
      },
      {
        text: 'Es folgt sofort die Lag-Phase, in der sich alle Zellen zurück ins Ei verwandeln.',
        isCorrect: false,
        feedback: 'Falsch. Die Lag-Phase liegt am Anfang des Wachstums, nicht nach der Log-Phase.'
      }
    ],
    misconceptionAlert: 'Wachstumskurve im geschlossenen System: 1. Lag → 2. Log → 3. Stationär → 4. Absterben.',
    curriculumBadge: 'Wachstumsphasen'
  },
  {
    id: 3,
    question: 'Auf welchem biophysikalischen Prinzip beruht die Haltbarmachung von Früchten durch das Einkochen mit viel Zucker zu Marmelade?',
    context: 'Lebensmittelkonservierung: Osmose & Plasmolyse',
    options: [
      {
        text: 'Zucker ist ein chemisches Gift, das die DNA der Bakterien sofort zersetzt.',
        isCorrect: false,
        feedback: 'Falsch. Zucker ist an sich ein Nährstoff, kein Zellgift.'
      },
      {
        text: 'Zucker kühlt die Marmelade dauerhaft auf unter 0 °C ab.',
        isCorrect: false,
        feedback: 'Falsch. Zucker kühlt nicht.'
      },
      {
        text: 'Zucker verklebt die Geißeln der Bakterien, sodass sie sich nicht mehr bewegen können.',
        isCorrect: false,
        feedback: 'Falsch. Die Bewegung ist für das Überleben nicht entscheidend.'
      },
      {
        text: 'Hoher osmotischer Druck: Die extrem hohe Zuckerkonzentration entzieht den Bakterien- und Schimmelpilzzellen durch Osmose das Wasser (Plasmolyse), wodurch ihr Stoffwechsel lahmgelegt wird.',
        isCorrect: true,
        feedback: 'Perfekt! Wasser strömt immer zur höheren Konzentration gelöster Teilchen. In 50 %iger Zuckerlösung dehydrieren Mikroorganismen völlig und können sich nicht mehr vermehren.'
      }
    ],
    misconceptionAlert: 'Gleiches Prinzip wie beim Pökeln von Schinken mit Salz: Osmotische Dehydrierung (Plasmolyse)!',
    curriculumBadge: 'Konservierung'
  },
  {
    id: 4,
    question: 'Was geschieht mit Bakterien bei einer Pasteurisierung (z. B. Erhitzen auf 75 °C für 15 bis 30 Sekunden)?',
    context: 'Temperatureinfluss & Enzymdenaturierung',
    options: [
      {
        text: 'Die Bakterien vermehren sich bei 75 °C doppelt so schnell wie bei 37 °C.',
        isCorrect: false,
        feedback: 'Falsch. Bei 75 °C ist die Hitzetoleranz mesophiler Bakterien weit überschritten.'
      },
      {
        text: 'Die lebensnotwendigen Proteine und Enzyme der Bakterien denaturieren irreversibel (Verlust der Tertiärstruktur), wodurch vegetative Keime absterben.',
        isCorrect: true,
        feedback: 'Hervorragend! Die thermische Energie zerstört Wasserstoffbrücken und Ionenbindungen der Enzyme. Das Bakterium kann keinen Stoffwechsel mehr durchführen und stirbt.'
      },
      {
        text: 'Alle Bakterien verwandeln sich in gasförmigen Stickstoff.',
        isCorrect: false,
        feedback: 'Falsch. Materie verdampft bei 75 °C nicht zu Stickstoff.'
      },
      {
        text: 'Die Zellwand wird dicker und schützt die Bakterien vor zukünftiger Kälte.',
        isCorrect: false,
        feedback: 'Falsch. Hitze schwächt und zerstört die Zellmembran.'
      }
    ],
    misconceptionAlert: 'Enzymdenaturierung ab ca. 60–75 °C ist unumkehrbar – genau wie das Stocken von Eiklar beim Kochen!',
    curriculumBadge: 'Enzymkinetik'
  },
  {
    id: 5,
    question: 'Welcher biochemische Prozess läuft im Bioreaktor bei der Herstellung von Naturjoghurt ab?',
    context: 'Biotechnologie: Milchsäuregärung',
    options: [
      {
        text: 'Bakterien verbrennen Fett zu Asche, wodurch die Milch fest wird.',
        isCorrect: false,
        feedback: 'Völlig falsch.'
      },
      {
        text: 'Milchsäurebakterien nutzen aerobe Zellatmung, um Alkohol zu produzieren.',
        isCorrect: false,
        feedback: 'Falsch. Hefe produziert Alkohol, Milchsäurebakterien gären anaerob zu Milchsäure.'
      },
      {
        text: 'Milchsäurebakterien bauen Milchzucker (Laktose) anaerob zu Milchsäure ab. Der sinkende pH-Wert (ca. 4,2) bringt das Milcheiweiß Kasein zum Gerinnen.',
        isCorrect: true,
        feedback: 'Meisterhaft! Der saure pH-Wert zerstört die Lösungsstruktur des Kaseins (Säurefällung), die Milch dickt ein und wird gleichzeitig vor Fäulnisbakterien geschützt (biologische Konservierung)!'
      },
      {
        text: 'Es wird künstlicher Klebstoff zugesetzt, der die Milchpartikel vernetzt.',
        isCorrect: false,
        feedback: 'Falsch. Joghurt entsteht durch rein mikrobielle Säuerung.'
      }
    ],
    misconceptionAlert: 'Säure senkt den pH-Wert → Kasein gerinnt → Joghurt wird fest UND sauer (schützt vor anderen Keimen)!',
    curriculumBadge: 'Biotechnologie'
  },
  {
    id: 6,
    question: 'Warum verdirbt frisches Rindfleisch in einer dichten Vakuumverpackung deutlich langsamer als bei Lagerung an der Luft?',
    context: 'Sauerstoffbedarf von Mikroorganismen',
    options: [
      {
        text: 'Der vollständige Entzug von Sauerstoff (O₂) hemmt das Wachstum obligat aerober Fäulnisbakterien und Schimmelpilze drastisch.',
        isCorrect: true,
        feedback: 'Exakt! Typische Fäulniserreger wie Pseudomonas oder Schimmelpilze benötigen zwingend Sauerstoff für ihre Zellatmung. Ohne O₂ können sie sich nicht vermehren.'
      },
      {
        text: 'Vakuum erzeugt eine Temperatur von minus 273 °C innerhalb der Verpackung.',
        isCorrect: false,
        feedback: 'Falsch. Vakuum bedeutet nur Luftleere, keine Kälte.'
      },
      {
        text: 'Im Vakuum können Bakterien nicht atmen, weil sie ersticken wie Säugetiere mit Lungen.',
        isCorrect: false,
        feedback: 'Falsch. Bakterien haben keine Lungen, sondern betreiben Zellatmung über Enzyme in der Plasmamembran.'
      },
      {
        text: 'Durch den Druckunterschied werden alle Bakterien mechanisch zerdrückt.',
        isCorrect: false,
        feedback: 'Falsch. Bakterien mit fester Mureinhülle überstehen den Druckunterschied eines Haushaltsvakuums problemlos.'
      }
    ],
    misconceptionAlert: 'Aerobe Keime brauchen Sauerstoff; ohne O₂ wachsen sie nicht. Achtung vor Anaerobiern wie Clostridium botulinum!',
    curriculumBadge: 'Konservierung'
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
    term: 'Bioreaktor (Fermenter)',
    pronunciation: '[bi̯o-reˈak-toːɐ̯]',
    definition: 'Ein geschlossener Behälter zur großtechnischen Kultivierung von Mikroorganismen (Bakterien, Hefen) unter streng kontrollierten Umweltbedingungen (Temperatur, pH, Sauerstoff, Rührung).',
    curriculumContext: 'Biotechnologie 9',
    example: 'Große Edelstahltanks zur Produktion von Joghurt, Bier, Penicillin oder Human-Insulin.'
  },
  {
    term: 'Denaturierung',
    pronunciation: '[denatuˈriːrʊŋ]',
    definition: 'Irreversible strukturelle Veränderung von Proteinen (Enzymen) durch Hitze, extreme pH-Werte oder Schwermetalle, wodurch ihre katalytische Funktion dauerhaft verloren geht.',
    curriculumContext: 'Enzymkinetik & Konservierung',
    example: 'Gerinnen von Hühnereiweiß beim Kochen oder Absterben von Bakterien bei über 70 °C.'
  },
  {
    term: 'Exponentielles Wachstum',
    pronunciation: '[ɛkspo-nɛnˈtsi̯eːl]',
    definition: 'Wachstum einer Population, bei dem die Zunahme proportional zur aktuellen Größe ist; die Keimzahl verdoppelt sich in konstanten Zeitintervallen (Generationszeit).',
    curriculumContext: 'Mikrobiologie & Populationsdynamik',
    example: 'Zweiteilung von E. coli alle 20 Minuten: Nach 2 Stunden aus 1 Zelle bereits 64 Zellen.'
  },
  {
    term: 'Generationszeit (g)',
    definition: 'Die Zeitspanne, die eine Bakterienpopulation benötigt, um ihre Zellzahl durch Zweiteilung exakt zu verdoppeln.',
    curriculumContext: 'Wachstumskinetik',
    example: 'Bei optimalen 37 °C beträgt die Generationszeit von E. coli ca. 20 Minuten, bei 4 °C im Kühlschrank über 30 Stunden.'
  },
  {
    term: 'Lag-Phase (Anlaufphase)',
    definition: 'Erste Phase des bakteriellen Wachstums nach dem Beimpfen eines neuen Nährbodens, in der die Zellen Enzyme für die neuen Substrate synthetisieren, ohne sich merklich zu teilen.',
    curriculumContext: 'Wachstumskurve',
    example: 'Bakterien schalten von Glukose- auf Laktoseverwertung um (Genregulation / Operon-Modell).'
  },
  {
    term: 'Milchsäuregärung',
    definition: 'Anaerober Stoffwechselweg, bei dem Glukose oder Laktose ohne Sauerstoff zu Milchsäure (Laktat) abgebaut wird, um ATP zu regenerieren.',
    curriculumContext: 'Gärung vs. Zellatmung',
    example: 'Säuerung von Milch zu Joghurt durch Lactobacillus oder Sauerkrautherstellung aus Weißkohl.'
  },
  {
    term: 'Osmose & Plasmolyse',
    pronunciation: '[ɔsˈmoːzə / plasmoˈlyːzə]',
    definition: 'Spontane Diffusion von Wasser durch eine semipermeable Membran zur höheren Teilchenkonzentration. Bei hohem Außendruck (Salz/Zucker) schrumpft das Zytoplasma von Keimen (Plasmolyse).',
    curriculumContext: 'Zellbiologie & Konservierung',
    example: 'Pökeln von Schinken oder Einkochen von Marmelade verhindert Keimwachstum durch Wasserentzug.'
  },
  {
    term: 'Pasteurisierung',
    pronunciation: '[pastœriˈziːrʊŋ]',
    definition: 'Kurzzeitige thermische Behandlung von flüssigen Lebensmitteln (meist 72–75 °C für 15–30 Sekunden) zur Abtötung vegetativer pathogener Keime ohne Geschmacksverlust.',
    curriculumContext: 'Hygiene & Lebensmittelkunde',
    example: 'Pasteurisierte Frischmilch im Kühlregal ist ca. 7–10 Tage haltbar.'
  },
  {
    term: 'RGT-Regel (Reaktionsgeschwindigkeit-Temperatur)',
    definition: 'Faustregel der Biochemie: Eine Erhöhung der Temperatur um 10 °C verdoppelt bis verdreifacht die Geschwindigkeit enzymatischer Reaktionen (bis zum Erreichen des Temperaturoptimums).',
    curriculumContext: 'Enzymatik 9',
    example: 'Im Kühlschrank (4 °C) laufen bakterielle Stoffwechselprozesse ca. 8-mal langsamer ab als bei 34 °C.'
  },
  {
    term: 'Stationäre Phase',
    definition: 'Wachstumsphase einer geschlossenen Kultur, in der die Keimzahl konstant bleibt, weil Geburtenrate und Sterberate sich aufgrund limitierender Faktoren die Waage halten.',
    curriculumContext: 'Wachstumskurve',
    example: 'Im Fermenter erreicht die Kultur ein Plateau von ca. 10⁹ Keimen pro Milliliter.'
  }
];
