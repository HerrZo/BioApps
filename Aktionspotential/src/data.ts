// Fachdaten, physiologische Parameter & Glossar
// Basierend auf den Schulbuchseiten 1.4 (Ruhepotential), 1.5 (Aktionspotential), 1.6 (Refraktärphase)

export type TabType = 'simulation' | 'refraktaer' | 'codierung' | 'glossar';

export interface PhaseInfo {
  id: string;
  name: string;
  shortName: string;
  timeRange: string;
  voltage: string;
  badgeClass: string;
  description: string;
  naGate1: 'closed' | 'open'; // Spannungsabhängiges Tor 1
  naGate2: 'open' | 'inactivated'; // Zeitgesteuertes Inaktivierungstor 2 (Kugel-Leine)
  naOverall: 'geschlossen' | 'geöffnet' | 'inaktiviert';
  kGate: 'closed' | 'open' | 'closing';
  ionFlow: string;
  membranePolarity: 'normal' | 'depolarized' | 'inverted' | 'hyperpolarized';
  schulbuchRef: string;
}

export const AP_PHASES: PhaseInfo[] = [
  {
    id: 'ruhe',
    name: '1. Ruhezustand (Ruhepotential)',
    shortName: 'Ruhepotential',
    timeRange: '0.0 - 0.5 ms',
    voltage: '-70 mV',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    description: 'Das Membranpotential liegt stabil bei ca. -70 mV. Die spannungsgesteuerten Na⁺- und K⁺-Kanäle sind geschlossen (Tor 1 zu, Tor 2 offen). K⁺-Leckkanäle sind ständig geöffnet und ermöglichen den K⁺-Ausstrom bis zum Gleichgewicht. Die Na⁺/K⁺-ATPase hält den Gradienten aktiv unter ATP-Verbrauch aufrecht.',
    naGate1: 'closed',
    naGate2: 'open',
    naOverall: 'geschlossen',
    kGate: 'closed',
    ionFlow: 'Nur K⁺-Hintergrundstrom (Leckkanal) nach außen; Na⁺/K⁺-Pumpe aktiv (3 Na⁺ raus, 2 K⁺ rein).',
    membranePolarity: 'normal',
    schulbuchRef: 'Buch S. 30 (M2/M3) & S. 32 (M2 Zustand 1)'
  },
  {
    id: 'schwelle',
    name: '2. Reizung & Schwellenwert',
    shortName: 'Schwellenwert',
    timeRange: '0.5 - 0.7 ms',
    voltage: '-50 mV',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
    description: 'Ein ankommender Reizstrom depolarisiert die Membran. Bleibt der Reiz unterschwellig (< -50 mV), kehrt die Zelle ohne AP zur Ruhe zurück (passive Antwort). Erreicht die Depolarisation jedoch den Schwellenwert von ca. -50 mV, greift das Alles-oder-Nichts-Prinzip: Erste spannungsgesteuerte Na⁺-Kanäle öffnen sich, was lawinenartig weitere Kanäle öffnet (positive Rückkopplung).',
    naGate1: 'open',
    naGate2: 'open',
    naOverall: 'geöffnet',
    kGate: 'closed',
    ionFlow: 'Erster Na⁺-Einstrom beginnt; positive Rückkopplung setzt ein.',
    membranePolarity: 'depolarized',
    schulbuchRef: 'Buch S. 32 (M1/B1 & M3 Alles-oder-Nichts)'
  },
  {
    id: 'depolarisation',
    name: '3. Depolarisation & Overshoot (Aufstrich)',
    shortName: 'Depolarisation',
    timeRange: '0.7 - 1.2 ms',
    voltage: '-50 mV bis +30 mV',
    badgeClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700',
    description: 'Massiver, explosionsartiger Einstrom von Na⁺-Ionen durch geöffnete spannungsgesteuerte Na⁺-Kanäle. Na⁺ folgt sowohl der chemischen Kraft (hoher Konzentrationsgradient) als auch der elektrostatischen Anziehung. Die Membran polarisiert sich komplett um: Ladungsumkehr (Overshoot) bis ca. +30 mV.',
    naGate1: 'open',
    naGate2: 'open',
    naOverall: 'geöffnet',
    kGate: 'closed',
    ionFlow: 'Massiver Na⁺-Einstrom entlang des elektrochemischen Gradienten ins Zellinnere.',
    membranePolarity: 'inverted',
    schulbuchRef: 'Buch S. 32 (M2 Zustand 2)'
  },
  {
    id: 'repolarisation',
    name: '4. Repolarisation',
    shortName: 'Repolarisation',
    timeRange: '1.2 - 2.0 ms',
    voltage: '+30 mV bis -70 mV',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700',
    description: 'Nach weniger als 1 ms schließt das zeitgesteuerte Tor 2 (Inaktivierungstor / Ball-and-Chain) der Na⁺-Kanäle automatisch: Der Kanal ist inaktiviert! Zeitverzögert haben sich die spannungsgesteuerten K⁺-Kanäle geöffnet. K⁺ strömt getrieben durch Konzentrationsgradient und die positive Innenladung schlagartig nach außen. Das Membranpotential fällt steil wieder ab.',
    naGate1: 'open',
    naGate2: 'inactivated',
    naOverall: 'inaktiviert',
    kGate: 'open',
    ionFlow: 'Na⁺-Einstrom gestoppt (Inaktivierung!). Starker K⁺-Ausstrom durch spannungsgesteuerte K⁺-Kanäle.',
    membranePolarity: 'normal',
    schulbuchRef: 'Buch S. 32 (M2 Zustand 3) & S. 34 (M2 Tor 2)'
  },
  {
    id: 'hyperpolarisation',
    name: '5. Hyperpolarisation (Überregulation)',
    shortName: 'Hyperpolarisation',
    timeRange: '2.0 - 3.2 ms',
    voltage: '-70 mV bis -80 mV',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700',
    description: 'Die spannungsgesteuerten K⁺-Kanäle schließen nur sehr langsam und zeitverzögert. Durch den anhaltenden K⁺-Ausstrom sinkt das Membranpotential kurzzeitig unter das normale Ruhepotential (auf ca. -80 mV). Die Na⁺-Kanäle kehren allmählich aus dem inaktivierten in den geschlossenen, wieder erregbaren Zustand zurück.',
    naGate1: 'closed',
    naGate2: 'open',
    naOverall: 'geschlossen',
    kGate: 'closing',
    ionFlow: 'Verzögerter K⁺-Ausstrom klingt ab; Na⁺/K⁺-Pumpe und Leckkanäle stellen das Ruhepotential wieder her.',
    membranePolarity: 'hyperpolarized',
    schulbuchRef: 'Buch S. 32 (M2 Zustand 4)'
  },
  {
    id: 'regeneriert',
    name: '6. Wiederherstellung des Ruhepotentials',
    shortName: 'Regeneration',
    timeRange: '3.2 - 4.0 ms',
    voltage: '-70 mV',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    description: 'Alle spannungsgesteuerten Kanäle sind wieder vollständig geschlossen und reaktivierbar. Die geringfügigen Ionenverschiebungen eines einzelnen APs werden kontinuierlich von der Na⁺/K⁺-ATPase ausgeglichen (Hinweis: Für ein einzelnes AP strömt nur ein winziger Bruchteil der Ionen, ca. 0,001 %!). Die Zelle ist voll erregbar.',
    naGate1: 'closed',
    naGate2: 'open',
    naOverall: 'geschlossen',
    kGate: 'closed',
    ionFlow: 'Stationäres Gleichgewicht über K⁺-Leckkanäle und Na⁺/K⁺-Pumpe stabilisiert.',
    membranePolarity: 'normal',
    schulbuchRef: 'Buch S. 30 (M3) & S. 32'
  }
];

export interface IonConcentration {
  name: string;
  formula: string;
  intra: number; // mmol/L
  extra: number; // mmol/L
  equilibriumPotential: number; // mV nach Nernst
  permeabilityRest: string;
  color: string;
  role: string;
}

export const ION_CONCENTRATIONS: IonConcentration[] = [
  {
    name: 'Kalium-Ionen',
    formula: 'K⁺',
    intra: 140,
    extra: 5,
    equilibriumPotential: -88,
    permeabilityRest: 'Sehr hoch (offene Leckkanäle)',
    color: '#8b5cf6', // violett
    role: 'Bestimmt maßgeblich das Ruhepotential; strömt bei Repolarisation aus der Zelle.'
  },
  {
    name: 'Natrium-Ionen',
    formula: 'Na⁺',
    intra: 10,
    extra: 145,
    equilibriumPotential: +66,
    permeabilityRest: 'Sehr gering (minimaler Leckstrom)',
    color: '#ef4444', // rot
    role: 'Träger des Aufstrichs (Depolarisation); strömt schlagartig bei Schwellenüberschreitung ein.'
  },
  {
    name: 'Chlorid-Ionen',
    formula: 'Cl⁻',
    intra: 5,
    extra: 120,
    equilibriumPotential: -84,
    permeabilityRest: 'Gering bis mäßig',
    color: '#10b981', // smaragdgrün
    role: 'Extrazelluläres Hauptanion; stabilisiert Membranpotential.'
  },
  {
    name: 'Organische Anionen',
    formula: 'A⁻',
    intra: 155,
    extra: 5,
    equilibriumPotential: 0,
    permeabilityRest: 'Vollkommen impermeabel (0)',
    color: '#f59e0b', // bernstein
    role: 'Große intrazelluläre Protein- und Phosphat-Anionen; können die Membran nicht passieren, erzeugen negative Innenladung.'
  }
];

export interface GlossaryEntry {
  term: string;
  category: 'Grundlagen' | 'Ionenkanäle' | 'Phasen' | 'Erregungsleitung';
  definition: string;
  details: string;
  misconception?: string;
  formula?: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: 'Ruhepotential',
    category: 'Grundlagen',
    definition: 'Elektrische Potentialdifferenz (Spannung) von ca. -70 mV zwischen Zellinnerem (-) und Extrazellularraum (+) einer nicht erregten Nervenzelle.',
    details: 'Kommt durch die selektive Permeabilität der Membran (hohe K⁺-Durchlässigkeit via Leckkanäle) und die ungleiche Ionenverteilung zustande. Es entspricht annähernd dem K⁺-Gleichgewichtspotential.',
    misconception: 'Fehlvorstellung: Im Ruhezustand bewegen sich keine Ionen. Richtig: Es herrscht ein dynamisches Fliessgleichgewicht zwischen K⁺-Diffusionsausstrom und elektrostatischer Rückhaltekraft.',
    formula: 'U_m \\approx -70\\text{ mV}'
  },
  {
    term: 'Aktionspotential (AP)',
    category: 'Phasen',
    definition: 'Kurzzeitige, stereotype Abweichung des Membranpotentials vom Ruhewert bis in den positiven Bereich (+30 mV), ausgelöst durch überschwellige Depolarisation.',
    details: 'Dauert 1–2 ms und dient der verlustfreien Signalübertragung über weite Strecken entlang des Axons.',
    misconception: 'Fehlvorstellung: Ein stärkerer Reiz erzeugt ein höheres Aktionspotential. Richtig: APs gehorchen dem Alles-oder-Nichts-Prinzip und haben immer die gleiche Amplitude (~100 mV).'
  },
  {
    term: 'Alles-oder-Nichts-Prinzip',
    category: 'Grundlagen',
    definition: 'Grundgesetz der neuronalen Erregung: Ein Reiz löst entweder ein vollständiges Aktionspotential maximaler Amplitude aus oder gar keines.',
    details: 'Wird der Schwellenwert (-50 mV) erreicht, öffnet sich eine kritische Masse an Na⁺-Kanälen, was eine unaufhaltsame positive Rückkopplung startet. Reize oberhalb der Schwelle verändern die Amplitude des APs nicht.',
    misconception: 'Unterschwellige Reize gehen nicht völlig verloren: Sie erzeugen lokale elektrotonische Potentiale, die aber passiv rasch abklingen.'
  },
  {
    term: 'Schwellenwert / Schwellenpotential',
    category: 'Grundlagen',
    definition: 'Das kritische Membranpotential (ca. -50 mV), ab dem der Na⁺-Einstrom den K⁺-Ausstrom übertrifft und ein AP unausweichlich zündet.',
    details: 'Bei Erreichen des Schwellenwerts öffnen sich genügend spannungsgesteuerte Na⁺-Kanäle, sodass die Depolarisation sich selbst verstärkt.'
  },
  {
    term: 'Spannungsgesteuerter Natriumkanal',
    category: 'Ionenkanäle',
    definition: 'Transmembranprotein mit zwei funktionellen Toren (Aktivierungstor 1 und Inaktivierungstor 2), das die schnelle Depolarisation ermöglicht.',
    details: 'Besitzt drei Konformationen: 1. Geschlossen (Ruhe: Tor 1 zu, Tor 2 offen), 2. Geöffnet (Depolarisation: Tor 1 offen, Tor 2 offen), 3. Inaktiviert (Refraktär: Tor 1 offen, Tor 2 durch Ball-and-Chain geschlossen).',
    misconception: '"Geschlossen" und "Inaktiviert" sind nicht dasselbe! Nur ein geschlossener Kanal kann durch Depolarisation geöffnet werden; ein inaktivierter Kanal ist absolut blockiert.'
  },
  {
    term: 'Inaktivierungstor (Ball-and-Chain / Tor 2)',
    category: 'Ionenkanäle',
    definition: 'Ein zeitgesteuertes, zellinneres Peptidsegment, das ca. 1 ms nach Kanalöffnung wie ein Stöpsel in die Kanalpore schwingt.',
    details: 'Schließt den Kanal unabhängig von der Membranspannung und ist die molekulare Ursache der absoluten Refraktärphase. Öffnet sich erst wieder, wenn die Membran repolarisiert ist.',
    formula: 't_{\\text{inaktiv}} \\approx 1\\text{ ms}'
  },
  {
    term: 'Absolute Refraktärphase',
    category: 'Phasen',
    definition: 'Zeitspanne während des APs und der frühen Repolarisation (ca. 1–2 ms), in der kein noch so starker Reiz ein erneutes AP auslösen kann.',
    details: 'Molekulare Ursache: Na⁺-Kanäle sind inaktiviert (Tor 2 geschlossen). Da keine Na⁺-Kanäle aktivierbar sind, ist die Membran unerrregbar. Begrenzt die maximale Impulsfrequenz auf ca. 500 Hz.',
    misconception: 'Fehlvorstellung: Durch extreme Reizstromstärke kann man die absolute Refraktärphase überwinden. Richtig: Völlig unmöglich, da die physikalische Pore durch die Kugel verstopft ist.'
  },
  {
    term: 'Relative Refraktärphase',
    category: 'Phasen',
    definition: 'Zeitspanne nach der absoluten Refraktärphase (ca. 2–5 ms), in der ein AP auslösbar ist, jedoch nur durch überdurchschnittlich starke Reize und mit verminderter Amplitude.',
    details: 'Ursache: Ein Teil der Na⁺-Kanäle hat den geschlossenen Zustand wiedererlangt, aber noch nicht alle; zudem sind K⁺-Kanäle noch teilweise offen (Hyperpolarisation erhöht den Abstand zur Schwelle).',
    misconception: 'Fehlvorstellung: Nach 2 ms ist das Axon sofort wieder im Normalzustand. Richtig: Wegen der Nach-Hyperpolarisation ist die Schwelle vorübergehend erhöht.'
  },
  {
    term: 'Signalcodierung & Frequenzmodulation',
    category: 'Erregungsleitung',
    definition: 'Die Übersetzung kontinuierlicher Reizparameter (Stärke, Dauer) in digitale Folgen von Aktionspotentialen.',
    details: 'Da die Amplitude von APs immer gleich ist, wird die Reizstärke über die Frequenz (Zahl der APs pro Sekunde) und die Reizdauer über die Länge der Salve codiert. Stärkerer Reiz = kürzere Erholungszeit in der relativen Refraktärphase = höhere AP-Frequenz.',
    formula: 'f \\propto \\text{Reizst\'arke}'
  },
  {
    term: 'Natrium-Kalium-Pumpe (Na⁺/K⁺-ATPase)',
    category: 'Ionenkanäle',
    definition: 'Aktives, ATP-abhängiges Transportprotein in der Zellmembran, das pro Zyklus 3 Na⁺ nach außen und 2 K⁺ nach innen pumpt (Antiport).',
    details: 'Verbraucht 50–70 % des gesamten Energiebedarfs einer Nervenzelle. Ist elektrogen (erzeugt einen winzigen Netto-Strom von +1 nach außen) und dient der langfristigen Erhaltung der Ionenkonzentrationsgradienten.',
    formula: '3\\text{ Na}^+_{\\text{innen}} + 2\\text{ K}^+_{\\text{au\ss en}} + \\text{ATP} \\rightarrow 3\\text{ Na}^+_{\\text{au\ss en}} + 2\\text{ K}^+_{\\text{innen}} + \\text{ADP} + \\text{P}_i'
  },
  {
    term: 'Kalium-Gleichgewichtspotential',
    category: 'Grundlagen',
    definition: 'Die Membranspannung, bei der die chemische Diffusionskraft für K⁺ exakt gleich groß ist wie die elektrostatische Rückhaltekraft der negativen Innenladung.',
    details: 'Wird durch die Nernst-Gleichung berechnet und liegt bei ca. -88 mV bis -90 mV. Da die Membran in Ruhe fast nur für K⁺ durchlässig ist, liegt das Ruhepotential (-70 mV) sehr nahe an diesem Wert.',
    formula: 'E_K = \\frac{R \\cdot T}{z \\cdot F} \\cdot \\ln \\left(\\frac{[K^+]_{\\text{aussen}}}{[K^+]_{\\text{innen}}}\\right) \\approx -88\\text{ mV}'
  },
  {
    term: 'Einbahnstraße der Erregungsleitung',
    category: 'Erregungsleitung',
    definition: 'Die biologische Tatsache, dass Aktionspotentiale im Axon physiologisch nur in eine Richtung (vom Axonhügel zur Synapse) wandern.',
    details: 'Grund: Der soeben erregte Membranabschnitt hinter der Erregungswelle befindet sich in der absoluten Refraktärphase (Na⁺-Kanäle inaktiviert). Die lokalen Ausgleichsströme können diesen Bereich nicht erneut depolarisieren.',
    misconception: 'Wird ein Axon künstlich in der Mitte gereizt, läuft das AP tatsächlich in beide Richtungen, da beide Seiten zuvor unerregt waren!'
  }
];

export interface CodingPreset {
  id: string;
  title: string;
  stimulusPercent: number; // 0 bis 100
  stimulusCurrentNA: number;
  expectedFreqHz: number;
  description: string;
  sensoryExample: string;
}

export const CODING_PRESETS: CodingPreset[] = [
  {
    id: 'subthreshold',
    title: '1. Sehr schwacher Reiz (unterschwellig)',
    stimulusPercent: 15,
    stimulusCurrentNA: 4,
    expectedFreqHz: 0,
    description: 'Reiz reicht nicht aus, um den Schwellenwert (-50 mV) zu erreichen. Es entstehen nur passive elektrotonische Verformungen, keine APs.',
    sensoryExample: 'Sanfter Luftzug auf der Haut, kaum spürbar.'
  },
  {
    id: 'weak',
    title: '2. Schwacher Schwellenreiz',
    stimulusPercent: 35,
    stimulusCurrentNA: 12,
    expectedFreqHz: 35,
    description: 'Schwellenwert wird knapp überschritten. Nach jedem AP muss die Membran die relative Refraktärphase fast vollständig durchlaufen, bis ein neues AP zündet. Niedrige Entladungsfrequenz.',
    sensoryExample: 'Berührung mit einer Feder.'
  },
  {
    id: 'medium',
    title: '3. Mittlerer Reiz',
    stimulusPercent: 65,
    stimulusCurrentNA: 25,
    expectedFreqHz: 110,
    description: 'Der stärkere Reizstrom kann die Membran bereits früh in der relativen Refraktärphase erneut erregen. Deutlich höhere AP-Frequenz.',
    sensoryExample: 'Spürbarer Druck mit der Fingerspitze.'
  },
  {
    id: 'strong',
    title: '4. Maximaler Reiz (Sättigungsgrenze)',
    stimulusPercent: 100,
    stimulusCurrentNA: 50,
    expectedFreqHz: 280,
    description: 'Sehr starker Reiz. Ein neues AP wird gezündet, sobald die absolute Refraktärphase vorüber ist. Die Frequenz nähert sich dem biologischen Limit (~300–400 Hz).',
    sensoryExample: 'Schmerzhafter Nadelstich oder Verbrennung.'
  }
];
