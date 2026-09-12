export interface AthleteProfile {
  id: 'untrained' | 'athlete';
  name: string;
  role: string;
  age: number;
  weightKg: number;
  restingHR: number; // Spm
  maxHR: number; // Spm
  restingSV: number; // ml
  maxSV: number; // ml
  aerobicThresholdWatt: number; // 2 mmol/l
  anaerobicThresholdWatt: number; // 4 mmol/l
  maxWatt: number;
  heartVolumeMl: number;
  description: string;
  badge: string;
}

export const ATHLETE_PROFILES: AthleteProfile[] = [
  {
    id: 'untrained',
    name: 'Untrainierter Jugendlicher',
    role: 'Schüler (Wenig Schulsport)',
    age: 16,
    weightKg: 65,
    restingHR: 75,
    maxHR: 205,
    restingSV: 70,
    maxSV: 105,
    aerobicThresholdWatt: 90,
    anaerobicThresholdWatt: 145,
    maxWatt: 220,
    heartVolumeMl: 720,
    description: 'Normales Herzvolumen (~720 ml). Begrenztes Schlagvolumen: Bei Belastung muss die Herzfrequenz sofort steil ansteigen, um den Sauerstoffbedarf zu decken.',
    badge: 'Untrainiert'
  },
  {
    id: 'athlete',
    name: 'Ausdauersportler (Triathlet)',
    role: 'Kaderathlet (Leistungssport)',
    age: 22,
    weightKg: 68,
    restingHR: 42,
    maxHR: 190,
    restingSV: 120,
    maxSV: 185,
    aerobicThresholdWatt: 200,
    anaerobicThresholdWatt: 290,
    maxWatt: 400,
    heartVolumeMl: 1180,
    description: 'Sportherz-Hypertrophie (~1180 ml Herzvolumen): Stark vergrößerte Herzkammern fördern bei jedem Schlag fast doppelt so viel Blut. Extrem ökonomischer Ruhepuls (Bradykardie) und späte Laktatakkumulation.',
    badge: 'Sportherz'
  }
];

export interface EnergySystem {
  id: string;
  name: string;
  pathway: 'anaerobic_alactic' | 'anaerobic_lactic' | 'aerobic_glucose' | 'aerobic_fat';
  duration: string;
  rate: string; // ATP per min
  atpYield: string;
  limitation: string;
  reaction: string;
  color: string;
}

export const ENERGY_SYSTEMS: EnergySystem[] = [
  {
    id: 'kp',
    name: 'Kreatinphosphat (KP)',
    pathway: 'anaerobic_alactic',
    duration: '0 bis 10 Sekunden',
    rate: 'Sehr hoch (~50 mmol/kg/min)',
    atpYield: 'Gering (nur Sofortreserve)',
    limitation: 'Speicher nach 8–10 s maximaler Belastung entleert.',
    reaction: 'ADP + Kreatinphosphat ➔ ATP + Kreatin (durch Kreatinkinase)',
    color: '#8b5cf6'
  },
  {
    id: 'glycolysis_anaerobic',
    name: 'Anaerobe Glykolyse (Milchsäuregärung)',
    pathway: 'anaerobic_lactic',
    duration: '10 bis 60 Sekunden',
    rate: 'Hoch (~25 mmol/kg/min)',
    atpYield: '2 ATP pro Glukose',
    limitation: 'Akkumulation von Laktat und H⁺-Ionen (Azidose) hemmt Enzyme.',
    reaction: 'Glukose ➔ 2 Laktat⁻ + 2 H⁺ + 2 ATP',
    color: '#ef4444'
  },
  {
    id: 'glycolysis_aerobic',
    name: 'Aerobe Glykolyse (Kohlenhydrat-Veratmung)',
    pathway: 'aerobic_glucose',
    duration: '1 Minute bis ca. 90 Minuten',
    rate: 'Mittel (~13 mmol/kg/min)',
    atpYield: '32 ATP pro Glukose',
    limitation: 'Glykogenspeicher der Leber und Muskeln (ca. 400–500 g).',
    reaction: 'Glukose + 6 O₂ ➔ 6 CO₂ + 6 H₂O + 32 ATP',
    color: '#eab308'
  },
  {
    id: 'lipolysis',
    name: 'Lipolyse / β-Oxidation (Fettverbrennung)',
    pathway: 'aerobic_fat',
    duration: 'Ab 20 Minuten bis viele Stunden',
    rate: 'Niedrig (~6 mmol/kg/min)',
    atpYield: 'Extrem hoch (~106 ATP pro Palmitat)',
    limitation: 'Träger Fluss, benötigt ca. 10 % mehr O₂ pro ATP als Glukose.',
    reaction: 'Fettsäuren + O₂ ➔ CO₂ + H₂O + ~106 ATP',
    color: '#16a34a'
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
    question: 'Warum besitzt ein gut trainierter Ausdauersportler in Ruhe oft einen Puls von nur 40 bis 45 Schlägen pro Minute (physiologische Bradykardie)?',
    context: 'Herz-Kreislauf-Anpassung: Das Sportherz (LehrplanPLUS B10 2)',
    options: [
      {
        text: 'Weil das Herz im Ruhezustand einschläft und fast aufhört zu schlagen.',
        isCorrect: false,
        feedback: 'Falsch. Das Herz schlägt hochgradig koordiniert und kräftig.'
      },
      {
        text: 'Weil Sportler weniger Sauerstoff zum Leben benötigen als untrainierte Menschen.',
        isCorrect: false,
        feedback: 'Falsch. Der Ruhesauerstoffbedarf ist bei beiden Gruppen mit ca. 250–300 ml O₂/min praktisch identisch.'
      },
      {
        text: 'Weil das Sportherz ein stark vergrößertes Schlagvolumen (~120 ml) besitzt: Pro Herzschlag wird so viel Blut gefördert, dass 40 Schläge genügen, um das Ruhe-Herzminutenvolumen von 5 l/min bereitzustellen.',
        isCorrect: true,
        feedback: 'Hervorragend! Nach der Formel HMV = HF · SV erbringt der Sportler (42 Spm · 120 ml = 5,04 l/min) dieselbe Pumpleistung wie der Untrainierte (72 Spm · 70 ml = 5,04 l/min), arbeitet aber viel ökonomischer!'
      },
      {
        text: 'Weil das Blut von Sportlern dickflüssiger ist und das Herz bremst.',
        isCorrect: false,
        feedback: 'Falsch. Im Gegenteil: Ausdauertraining erhöht das Plasmavolumen und senkt den Strömungswiderstand.'
      }
    ],
    misconceptionAlert: 'Formel merken: HMV = HF · SV. Großes Schlagvolumen = niedriger, schonender Ruhepuls!',
    curriculumBadge: 'Sportherz'
  },
  {
    id: 2,
    question: 'Was versteht die Leistungsdiagnostik unter der „anaeroben Schwelle“ (ca. 4 mmol/l Laktat im Blut)?',
    context: 'Laktat-Kinetik & Schwellenkonzept',
    options: [
      {
        text: 'Das maximale Laktat-Steady-State (MLSS): Die höchste Belastungsintensität, bei der Laktatbildung und Laktatabbau (in Herz und Leber) sich gerade noch im Gleichgewicht befinden.',
        isCorrect: true,
        feedback: 'Perfekt! Oberhalb dieser Schwelle von 4 mmol/l übersteigt die Laktatproduktion die Eliminationsrate exponentiell. Die Muskelzelle übersäuert (Azidose) und der Sportler muss das Tempo drosseln.'
      },
      {
        text: 'Den Punkt, an dem der Sportler schlagartig ohnmächtig wird und stirbt.',
        isCorrect: false,
        feedback: 'Falsch. Man muss lediglich die Intensität senken, da die Beine „brennen“.'
      },
      {
        text: 'Die Grenze, ab der überhaupt kein Sauerstoff mehr im Blut transportiert werden kann.',
        isCorrect: false,
        feedback: 'Falsch. Sauerstoff wird weiterhin mit maximaler Rate transportiert; nur reicht die aerobe Kapazität nicht mehr allein aus.'
      },
      {
        text: 'Den Zustand bei absolutem Ruhepuls im Schlaf.',
        isCorrect: false,
        feedback: 'Falsch. In Ruhe liegt der Laktatspiegel bei ca. 1,0 mmol/l.'
      }
    ],
    misconceptionAlert: 'Anaerobe Schwelle (4 mmol/l) = Kipppunkt zwischen Gleichgewicht und unaufhaltsamer Übersäuerung!',
    curriculumBadge: 'Laktatschwellen'
  },
  {
    id: 3,
    question: 'Welcher Energiespeicher liefert in den ersten 5 bis 8 Sekunden eines explosiven 100-Meter-Sprints die Hauptmenge an ATP?',
    context: 'Energiebereitstellungs-Phasen',
    options: [
      {
        text: 'Die Verbrennung von Unterhautfettgewebe (Lipolyse).',
        isCorrect: false,
        feedback: 'Falsch. Lipolyse läuft viel zu träge an und liefert viel zu wenig ATP pro Sekunde für einen Sprint.'
      },
      {
        text: 'Vollständige aerobe Glukoseveratmung in den Mitochondrien.',
        isCorrect: false,
        feedback: 'Falsch. Die Sauerstoffzufuhr und aerobe Zellatmung benötigen mindestens 1–2 Minuten Anlaufzeit.'
      },
      {
        text: 'Eiweißabbau aus Muskelproteinen.',
        isCorrect: false,
        feedback: 'Falsch. Proteine werden im Muskel nur bei extremer Hungersnot zur Energiegewinnung herangezogen.'
      },
      {
        text: 'Kreatinphosphat (anaerob-alaktazide Energiebereitstellung): Es überträgt seine Phosphatgruppe blitzschnell auf ADP, ohne dass Laktat oder Sauerstoff nötig sind.',
        isCorrect: true,
        feedback: 'Brillant! Kreatinphosphat ist die zelleigene Schnellfeuer-Batterie. Seine Spaltung läuft sofort ohne Sauerstoff und ohne Laktatbildung ab, ist aber nach ca. 8–10 Sekunden erschöpft.'
      }
    ],
    misconceptionAlert: 'Reihenfolge: 1. Kreatinphosphat (0–10 s) → 2. Anaerobe Glykolyse (10–60 s) → 3. Aerobe Glykolyse (ab 1 min) → 4. Fette (Dauer).',
    curriculumBadge: 'Energiephasen'
  },
  {
    id: 4,
    question: 'Warum atmet ein Sportler nach einem 400-Meter-Lauf im Ziel noch minutenlang schwer und schnell weiter, obwohl die mechanische Leistung bereits 0 Watt beträgt (Sauerstoffschuld / EPOC)?',
    context: 'Sauerstoffdefizit und Nachbelastungsphase',
    options: [
      {
        text: 'Weil das Gehirn vergessen hat, wie man die Lunge anhält.',
        isCorrect: false,
        feedback: 'Falsch. Die Atmung wird über Chemosensoren durch CO₂ und pH-Wert gesteuert.'
      },
      {
        text: 'Zur Begleichung der Sauerstoffschuld: Auffüllen der entleerten Kreatinphosphat- und Myoglobinspeicher sowie energieaufwendiger Abbau des akkumulierten Laktats in Leber und Herz.',
        isCorrect: true,
        feedback: 'Exakt! Zu Beginn entstand ein Sauerstoffdefizit, da der O₂-Transport hinterherhinkte. Nach Belastungsende bleibt die O₂-Aufnahme erhöht (EPOC = Excess Post-exercise Oxygen Consumption), um ATP/KP zu resynthetisieren und Laktat über Glukoneogenese abzubauen.'
      },
      {
        text: 'Weil die Lunge beim Sprint gerissen ist und repariert werden muss.',
        isCorrect: false,
        feedback: 'Falsch. Ein gesunder Sportler erleidet beim Sprint keinen Lungenriss.'
      },
      {
        text: 'Weil der Körper nach dem Laufen die gesamte Luft aus der Atmosphäre absaugen will.',
        isCorrect: false,
        feedback: 'Unsinn.'
      }
    ],
    misconceptionAlert: 'Sauerstoffdefizit beim Start = Sauerstoffschuld im Ziel! Nachatmen ist biologische Schuldentilgung.',
    curriculumBadge: 'Sauerstoffschuld'
  },
  {
    id: 5,
    question: 'Warum greift der Körper bei maximaler Belastung (> 85 % der VO2max) fast ausschließlich auf Kohlenhydrate und nicht mehr auf Fette zurück?',
    context: 'Ökonomie der Substratverbrennung',
    options: [
      {
        text: 'Weil der Abbau von Fetten (β-Oxidation) ca. 10 % mehr Sauerstoff pro gebildetem Mol ATP benötigt und die maximale Flussrate (ATP pro Zeiteinheit) bei Fett viel zu gering ist.',
        isCorrect: true,
        feedback: 'Meisterhaft! Kohlenhydrate sind der Sauerstoff-effizientere Brennstoff: Aus 1 Liter O₂ gewinnt der Körper bei Glukose ca. 21,1 kJ, bei Fett nur 19,6 kJ. Zudem läuft die Glykolyse doppelt so schnell ab wie die Lipolyse.'
      },
      {
        text: 'Weil Fette im Körper nur zum Wärmen da sind und gar keine Energie enthalten.',
        isCorrect: false,
        feedback: 'Falsch. Fett enthält mit ca. 39 kJ/g mehr als doppelt so viel Energie wie Kohlenhydrate (17 kJ/g).'
      },
      {
        text: 'Weil die Muskeln Fettmoleküle für Steine halten und abstoßen.',
        isCorrect: false,
        feedback: 'Unsinn.'
      },
      {
        text: 'Weil das Blut bei hoher Belastung so sauer wird, dass Fettflüssigkeit verdampft.',
        isCorrect: false,
        feedback: 'Falsch. Fette verdampfen nicht im Blut.'
      }
    ],
    misconceptionAlert: 'Kohlenhydrate liefern pro Liter O₂ mehr Energie als Fett und brennen deutlich schneller ab!',
    curriculumBadge: 'Brennstoff-Wahl'
  },
  {
    id: 6,
    question: 'Ein Mitschüler behauptet: „Muskelkater entsteht, weil sich Laktat-Kristalle wie Glasscherben in den Muskelfasern ablagern.“ Wie widerlegst du diesen Mythos fachlich?',
    context: 'Laktat-Abbau vs. Muskelkater-Pathogenese',
    options: [
      {
        text: 'Die Aussage stimmt; man kann Laktatkristalle mit einer Lupe unter der Haut glitzern sehen.',
        isCorrect: false,
        feedback: 'Falsch. Laktat kristallisiert im Körper niemals; es ist ein gelöstes Anion der Milchsäure.'
      },
      {
        text: 'Laktat entsteht gar nicht bei Muskelarbeit, sondern nur beim Käsen.',
        isCorrect: false,
        feedback: 'Falsch. Laktat ist das physiologische Stoffwechselprodukt der anaeroben Glykolyse im menschlichen Muskel.'
      },
      {
        text: 'Laktat hat eine Halbwertszeit von nur 15–20 Minuten und ist 1–2 Stunden nach Belastung komplett abgebaut. Muskelkater tritt erst nach 24–48 Stunden auf und beruht auf Mikrotraumata (mechanischen Rissen) in den Z-Scheiben der Sarkomere mit nachfolgender Entzündung.',
        isCorrect: true,
        feedback: 'Hervorragend entlarvt! Dieser Mythos hält sich hartnäckig. Wenn Laktat Muskelkater verursachen würde, hätten 400m-Läufer ihren stärksten Muskelkater direkt nach dem Rennen, nicht 2 Tage später!'
      },
      {
        text: 'Muskelkater entsteht ausschließlich durch zu viel Kohlensäure im Mineralwasser.',
        isCorrect: false,
        feedback: 'Falsch. Kohlensäure im Magen hat mit Muskelkater nichts zu tun.'
      }
    ],
    misconceptionAlert: 'Muskelkater ≠ Laktat! Laktat ist nach 90 min weg. Muskelkater = Mikrorisse in den Sarkomer-Z-Scheiben!',
    curriculumBadge: 'Mythen-Check'
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
    term: 'Aerobe Schwelle',
    definition: 'Belastungsintensität (meist bei ca. 2,0 mmol/l Blutlaktat), bei der die rein oxidative Energiegewinnung nicht mehr ausreicht und die Laktatbildung erstmals über den Ruhewert ansteigt.',
    curriculumContext: 'Leistungsdiagnostik 10',
    example: 'Unterhalb der aeroben Schwelle (z. B. 120 W beim Ausdauersportler) kann ein Marathonläufer stundenlang ökonomisch laufen.'
  },
  {
    term: 'Anaerobe Schwelle (MLSS)',
    definition: 'Maximales Laktat-Steady-State (ca. 4,0 mmol/l): Die höchste Belastung, bei der Laktatbildung und Laktatelimination im Gleichgewicht stehen.',
    curriculumContext: 'Schwellenkonzept',
    example: 'Wird die anaerobe Schwelle überschritten, kumulieren H⁺-Ionen und führen innerhalb weniger Minuten zum Leistungsabbruch.'
  },
  {
    term: 'Atemminutenvolumen (AMV)',
    definition: 'Das Volumen an Atemluft, das in einer Minute ein- und ausgeatmet wird. Produkt aus Atemfrequenz (AF) und Atemzugvolumen (AZV): AMV = AF · AZV.',
    curriculumContext: 'Atmungsphysiologie',
    example: 'In Ruhe: 12 Atemzüge · 0,5 l = 6 l/min. Bei Maximalbelastung: 50 Atemzüge · 2,5 l = 125 l/min!'
  },
  {
    term: 'Bradykardie (Sportler-Bradykardie)',
    pronunciation: '[bradykaʁˈdiː]',
    definition: 'Physiologisch verlangsamter Herzschlag in Ruhe (< 50–60 Spm), hervorgerufen durch eine Hypertrophie des Herzmuskels (Sportherz) mit stark erhöhtem Schlagvolumen.',
    curriculumContext: 'Herz-Kreislauf-System',
    example: 'Radsportler mit Ruhepuls von 38 Spm versorgen ihren Körper mühelos mit 5 Litern Blut pro Minute.'
  },
  {
    term: 'EPOC (Sauerstoffschuld)',
    pronunciation: '[ˈiːpɔk]',
    definition: '„Excess Post-exercise Oxygen Consumption“: Die nach Belastungsende über dem Ruheniveau bleibende Sauerstoffaufnahme zum Ausgleich des anfänglichen Sauerstoffdefizits.',
    curriculumContext: 'Stoffwechseldynamik',
    example: 'Nach einem 400m-Sprint atmet der Sportler minutenlang intensiv nach, um ATP/KP zu regenerieren und Laktat abzubauen.'
  },
  {
    term: 'Herzminutenvolumen (HMV)',
    definition: 'Das von einer Herzkammer pro Minute in den Kreislauf gepumpte Blutvolumen. Produkt aus Herzfrequenz (HF) und Schlagvolumen (SV): HMV = HF · SV.',
    curriculumContext: 'Kardiovaskuläres System',
    example: 'In Ruhe ca. 5 l/min; beim Ausdauersportler unter Vollast bis zu 35–40 l/min.'
  },
  {
    term: 'Kreatinphosphat (KP)',
    definition: 'Hochenergetische Phosphatverbindung in der Muskelzelle zur anaerob-alaktaziden Sofort-Resynthese von ATP in den ersten 5–10 Belastungssekunden.',
    curriculumContext: 'Energiebereitstellung',
    example: 'Ein Gewichtheber oder 60m-Sprinter schöpft seine Maximalleistung fast vollständig aus Kreatinphosphat.'
  },
  {
    term: 'Laktat',
    pronunciation: '[lakˈtaːt]',
    definition: 'Das Anion der Milchsäure, das beim anaeroben Abbau von Glukose zur Regeneration von NAD⁺ entsteht.',
    curriculumContext: 'Glykolyse',
    example: 'Laktat ist kein Abfall, sondern ein wertvoller Brennstoff, der im Herzmuskel veratmet und in der Leber zu Glukose recycliert wird (Cori-Zyklus).'
  },
  {
    term: 'Lipolyse (β-Oxidation)',
    pronunciation: '[lipoˈlyːzə]',
    definition: 'Spaltung von Triglyzeriden in Glycerin und freie Fettsäuren sowie deren aerober Abbau in den Mitochondrien zur Bildung von Acetyl-CoA und ATP.',
    curriculumContext: 'Fettstoffwechsel',
    example: 'Grundlage für Ultraläufe und lange Wanderungen, da die körpereigenen Fettdepots zehntausende Kilokalorien speichern.'
  },
  {
    term: 'Schlagvolumen (SV)',
    definition: 'Die Blutmenge, die die linke Herzkammer bei einer einzigen Kontraktion (Systole) in die Aorta auswirft.',
    curriculumContext: 'Herzfunktion',
    example: 'Beim Untrainierten ca. 70 ml in Ruhe, beim Ausdauersportler bis zu 180 ml unter maximaler Belastung.'
  },
  {
    term: 'Sportherz (Cor athleticum)',
    definition: 'Harmonische, physiologische Vergrößerung des Herzens (Muskelwandverdickung und Herzhöhlenerweiterung) als Anpassung an jahrelanges Ausdauertraining.',
    curriculumContext: 'Sportbiologie 10',
    example: 'Das Herzvolumen steigt von normal 700–800 ml auf über 1.200–1.400 ml bei Elitesportlern.'
  }
];
