export type TabType = 'simulation' | 'regelkreis' | 'zellulaer' | 'diabetes' | 'quiz' | 'wissen';
export type HealthMode = 'healthy' | 'type1' | 'type2';
export type TermMode = 'bio8' | 'kybernetik';

export interface HistoryPoint {
  time: number;
  glucose: number;
  insulin: number;
  glucagon: number;
  label?: string;
}

export interface GlossaryItem {
  term: string;
  termKybernetik?: string;
  category: 'Organ' | 'Hormon' | 'Zelle' | 'Regelkreis' | 'Krankheit';
  definition: string;
  details: string;
  misconception?: string;
}

export interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  misconceptionAlert: string;
}

export const TERM_MAP = [
  {
    bio8: 'Sollwert (gesunder Zielwert)',
    kybernetik: 'Führungsgröße (w)',
    beispiel: '80–120 mg/dl Glukose im Blut (~100 mg/dl)',
    erklaerung: 'Der optimale Zustand, den der Körper stabil halten möchte.'
  },
  {
    bio8: 'Istwert (aktueller Blutzucker)',
    kybernetik: 'Regelgröße (x)',
    beispiel: 'Gemessene Glukosekonzentration im Blut',
    erklaerung: 'Der momentane Wert, der laufend überwacht wird.'
  },
  {
    bio8: 'Messfühler (Sensor-Zellen)',
    kybernetik: 'Fühler / Rezeptor',
    beispiel: 'Alpha- und Beta-Zellen der Langerhans-Inseln',
    erklaerung: 'Registrieren Abweichungen des Blutzuckers vom Sollwert.'
  },
  {
    bio8: 'Steuerzentrale / Regler',
    kybernetik: 'Regler / Vergleicher',
    beispiel: 'Bauchspeicheldrüse (Pankreas)',
    erklaerung: 'Vergleicht Istwert mit Sollwert und entscheidet über Hormonausschüttung.'
  },
  {
    bio8: 'Botenstoffe (Hormone)',
    kybernetik: 'Stellgröße (y)',
    beispiel: 'Insulin (senkend) & Glukagon (steigernd)',
    erklaerung: 'Übertragen die Steuerbefehle über das Blut an die Zielorgane.'
  },
  {
    bio8: 'Wirkorte / Zielorgane',
    kybernetik: 'Stellglieder / Effektoren',
    beispiel: 'Leberzellen & Muskelzellen',
    erklaerung: 'Führen die eigentliche Handlung aus (Glukose aufnehmen/speichern oder abgeben).'
  },
  {
    bio8: 'Einflüsse von außen',
    kybernetik: 'Störgröße (z)',
    beispiel: 'Nahrungsaufnahme (+), Sport (-), Fasten (-)',
    erklaerung: 'Bringen den Blutzucker aus dem Gleichgewicht.'
  },
  {
    bio8: 'Gegenspieler-Prinzip',
    kybernetik: 'Antagonistische Regelung',
    beispiel: 'Insulin (Gas) vs. Glukagon (Bremse)',
    erklaerung: 'Zwei entgegengesetzt wirkende Hormone ermöglichen präzise Feinsteuerung.'
  },
  {
    bio8: 'Negative Rückkopplung',
    kybernetik: 'Gegenkopplung (- Rückmeldung)',
    beispiel: 'Blutzucker steigt -> Insulin senkt ihn wieder',
    erklaerung: 'Die Wirkung wirkt ihrer eigenen Ursache entgegen, um Stabilität zu schaffen.'
  }
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'Bauchspeicheldrüse (Pankreas)',
    termKybernetik: 'Regler & Messfühler',
    category: 'Organ',
    definition: 'Ca. 15–20 cm langes Organ im Oberbauch hinter dem Magen.',
    details: 'Enthält neben Verdauungsenzymen die endokrinen Langerhans-Inseln, die laufend den Blutzuckerspiegel messen und Insulin bzw. Glukagon ins Blut abgeben.'
  },
  {
    term: 'Langerhans-Inseln',
    termKybernetik: 'Sensor- und Steuerareale',
    category: 'Zelle',
    definition: 'Kleine, inselartige Zellhaufen in der Bauchspeicheldrüse (ca. 1–2 Millionen insgesamt).',
    details: 'Bestehen hauptsächlich aus Beta-Zellen (produzieren Insulin, ~70%) und Alpha-Zellen (produzieren Glukagon, ~20%).'
  },
  {
    term: 'Beta-Zellen (B-Zellen)',
    termKybernetik: 'Messfühler für Hyperglykämie',
    category: 'Zelle',
    definition: 'Zellen in den Langerhans-Inseln, die Insulin herstellen und ausschütten.',
    details: 'Sobald Glukose im Blut über ca. 100 mg/dl steigt, geben sie vermehrt Insulin ab. Bei Typ-1-Diabetes werden sie durch eine Autoimmunreaktion zerstört.'
  },
  {
    term: 'Alpha-Zellen (A-Zellen)',
    termKybernetik: 'Messfühler für Hypoglykämie',
    category: 'Zelle',
    definition: 'Zellen in den Langerhans-Inseln, die Glukagon herstellen und ausschütten.',
    details: 'Aktivieren sich bei fallendem Blutzucker (<80 mg/dl), beim Fasten oder bei intensiver Muskelarbeit, um den Körper vor Unterzuckerung zu schützen.'
  },
  {
    term: 'Insulin',
    termKybernetik: 'Stellgröße (blutzuckersenkend)',
    category: 'Hormon',
    definition: 'Das einzige Hormon des menschlichen Körpers, das den Blutzuckerspiegel senken kann.',
    details: 'Besteht aus 51 Aminosäuren. Wirkt nach dem Schlüssel-Schloss-Prinzip am Insulin-Rezeptor von Muskel-, Fett- und Leberzellen und veranlasst diese, Glukose aus dem Blut aufzunehmen.',
    misconception: 'Fehlkonzept: Insulin "frisst" den Zucker nicht auf! Es ist lediglich der molekulare Schlüssel, der die Glukosetransporter (GLUT4) in die Membran einbaut.'
  },
  {
    term: 'Glukagon',
    termKybernetik: 'Stellgröße (blutzuckersteigernd)',
    category: 'Hormon',
    definition: 'Wichtigster Gegenspieler (Antagonist) des Insulins.',
    details: 'Besteht aus 29 Aminosäuren. Bindet an Rezeptoren der Leberzellen und aktiviert den Abbau von gespeichertem Glykogen zu Glukose, die sofort ins Blut strömt.',
    misconception: 'Fehlkonzept: Schüler vergessen oft das Glukagon. Ohne Glukagon würde ein gesunder Mensch bei jeder Sportstunde oder über Nacht ins Koma fallen!'
  },
  {
    term: 'Glukose (Traubenzucker)',
    termKybernetik: 'Regelgröße (Substrat)',
    category: 'Hormon',
    definition: 'Einfachzucker (Monosaccharid, C6H12O6), wichtigster Energielieferant der Körperzellen.',
    details: 'Besonders Gehirn- und Nervenzellen sowie rote Blutkörperchen sind auf eine ständige Glukosezufuhr aus dem Blut angewiesen (ca. 120 g/Tag allein für das Gehirn!).'
  },
  {
    term: 'Glykogen',
    termKybernetik: 'Energiespeicher',
    category: 'Organ',
    definition: 'Verzweigte Speicherform der Glukose bei Mensch und Tier (tierische Stärke).',
    details: 'Wird vor allem in Leber (ca. 100–150 g) und Skelettmuskulatur (ca. 300–400 g) gespeichert. Leberglykogen dient der Konstanthaltung des Blutzuckers für den gesamten Körper.'
  },
  {
    term: 'GLUT4-Transporter',
    termKybernetik: 'Zelluläre Schleuse / Ventil',
    category: 'Zelle',
    definition: 'Spezifisches Tunnelprotein in der Zellmembran von Muskel- und Fettzellen.',
    details: 'Liegt im Ruhezustand in intrazellulären Vesikeln vor. Erst wenn Insulin bindet ODER Muskelkontraktion stattfindet, verschmelzen die Vesikel mit der Membran und lassen Glukose einströmen.',
    misconception: 'Fehlkonzept: Muskelarbeit kann GLUT4-Transporter auch völlig ohne Insulin aktivieren. Das ist die biologische Grundlage, warum Sport bei Typ-2-Diabetes so heilsam ist!'
  },
  {
    term: 'Insulin-Rezeptor',
    termKybernetik: 'Schloss am Stellglied',
    category: 'Zelle',
    definition: 'Transmembranprotein an der Außenseite von Zielzellen.',
    details: 'Besitzt eine hochspezifische Bindungstasche für Insulin (Schlüssel-Schloss-Prinzip). Nach Bindung wird im Zellinneren eine Signalkaskade ausgelöst.'
  },
  {
    term: 'Negative Rückkopplung',
    termKybernetik: 'Gegenkopplung (-)',
    category: 'Regelkreis',
    definition: 'Grundprinzip biologischer Regelkreise zur Erhaltung des Gleichgewichts (Homöostase).',
    details: 'Eine Erhöhung des Istwerts (mehr Zucker) führt über Regler und Stellglieder zu einer Reaktion, die die Erhöhung rückgängig macht (Zuckersenkung). Dadurch schwingt der Wert stets um den Sollwert.'
  },
  {
    term: 'Hypoglykämie (Unterzuckerung)',
    termKybernetik: 'Regelabweichung nach unten',
    category: 'Krankheit',
    definition: 'Abfall des Blutzuckers unter 60–70 mg/dl.',
    details: 'Symptome: Zittern, Schweißausbrüche, Heißhunger, Konzentrationsschwäche, im Extremfall Bewusstlosigkeit. Notfalltherapie: Schnelle Zufuhr von Traubenzucker oder Glukagon-Notfallspritze.'
  },
  {
    term: 'Hyperglykämie (Überzuckerung)',
    termKybernetik: 'Regelabweichung nach oben',
    category: 'Krankheit',
    definition: 'Anstieg des Blutzuckers über 140–180 mg/dl.',
    details: 'Übersteigt der Wert die Nierenschwelle (~180 mg/dl), wird Zucker mit dem Urin ausgeschieden ("Honigsüßer Durchfluss" = Diabetes mellitus). Führt langfristig zu Gefäß- und Nervenschäden.'
  },
  {
    term: 'Diabetes mellitus Typ 1',
    termKybernetik: 'Defekt des Reglers / Stellgrößen-Ausfall',
    category: 'Krankheit',
    definition: 'Autoimmunerkrankung, bei der körpereigene Immunzellen die Beta-Zellen zerstören.',
    details: 'Beginnt meist im Kindes- oder Jugendalter. Führt zu absolutem Insulinmangel. Betroffene müssen lebenslang Blutzucker messen und Insulin spritzen oder über eine Pumpe zuführen.'
  },
  {
    term: 'Diabetes mellitus Typ 2',
    termKybernetik: 'Defekt der Stellglieder / Signalresistenz',
    category: 'Krankheit',
    definition: 'Stoffwechselstörung mit verminderter Insulinempfindlichkeit (Insulinresistenz) der Zielzellen.',
    details: 'Insulin ist vorhanden (oft anfangs sogar zu viel!), aber die "Schlösser" (Rezeptoren) reagieren kaum. Ursachen: Übergewicht, Bewegungsmangel, genetische Veranlagung. Haupttherapie: Bewegung, Gewichtsreduktion, Ernährungsumstellung.'
  }
];

export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 1,
    question: 'Welche Aussage beschreibt die Wirkung des Hormons Insulin auf zellulärer Ebene physikalisch und biologisch korrekt?',
    options: [
      'Insulin zersetzt Glukose-Moleküle direkt im Blutplasma durch enzymatische Verdauung.',
      'Insulin bindet an Membranrezeptoren, wodurch GLUT4-Kanäle eingebaut werden und Glukose in die Zelle strömt.',
      'Insulin transportiert Glukose-Moleküle als Trägerprotein durch die Membran.',
      'Insulin wandelt Glukose im Blutkreislauf direkt in Fette und Eiweiße um.'
    ],
    correct: 1,
    explanation: 'Insulin ist weder ein Enzym noch frisst es Zucker. Es bindet als hormoneller Botenstoff an spezifische Insulin-Rezeptoren. Dies veranlasst die Zelle, Vesikel mit GLUT4-Glukosetransportern zur Zellmembran zu senden, sodass Glukose passiv entlang des Konzentrationsgefälles einströmen kann.',
    misconceptionAlert: 'Häufiges Fehlkonzept: Viele Schüler glauben, Insulin "fresse" oder "vernichte" den Zucker direkt im Blut.'
  },
  {
    id: 2,
    question: 'Ein Schüler joggt 45 Minuten im Sportunterricht, ohne vorher etwas gegessen zu haben. Was geschieht in seinem Körper?',
    options: [
      'Die Beta-Zellen schütten massenhaft Insulin aus, um die Muskeln mit Energie zu versorgen.',
      'Die Alpha-Zellen schütten Glukagon aus, welches in der Leber den Abbau von Glykogen zu Glukose veranlasst.',
      'Der Blutzuckerspiegel fällt unweigerlich auf 0 mg/dl ab, da keine Nahrung verdaut wird.',
      'Die Leber wandelt Glukose in Glykogen um, um Energie für die nächste Woche zu sparen.'
    ],
    correct: 1,
    explanation: 'Beim Sport verbrauchen Muskeln viel Glukose. Um eine Unterzuckerung zu verhindern, registrieren die Alpha-Zellen der Bauchspeicheldrüse den Abfall und schütten Glukagon aus. Glukagon regt die Leber an, gespeichertes Glykogen in Glukose zu spalten und ins Blut abzugeben.',
    misconceptionAlert: 'Häufiges Fehlkonzept: Glukagon wird oft vergessen – dabei ist es der lebenswichtige Schutz vor Hypoglykämie!'
  },
  {
    id: 3,
    question: 'Warum ist regelmäßige körperliche Bewegung die wichtigste Therapiemaßnahme bei Diabetes mellitus Typ 2?',
    options: [
      'Weil Sport die zerstörten Beta-Zellen in der Bauchspeicheldrüse nachwachsen lässt.',
      'Weil Muskelkontraktion den Einbau von GLUT4-Glukosetransportern auch völlig unabhängig von Insulin stimuliert.',
      'Weil durch Schwitzen der Zucker über die Schweißdrüsen der Haut ausgeschieden wird.',
      'Weil Sport das Hormon Glukagon komplett zerstört.'
    ],
    correct: 1,
    explanation: 'Bei Typ 2 sind die Insulin-Rezeptoren unempfindlich. Die bahnbrechende Entdeckung der Zellbiologie ist: Bei Muskelarbeit löst die Kontraktion über intrazelluläre Signalwege (AMPK) die Wanderung von GLUT4-Transportern in die Membran aus – ganz ohne Insulin! Dadurch sinkt der Blutzucker effektiv.',
    misconceptionAlert: 'Aha-Moment: Bewegung ist das natürliche "Insulin" des Körpers, weil es den Rezeptordefekt bei Typ 2 einfach umgeht.'
  },
  {
    id: 4,
    question: 'Im kybernetischen Regelkreis-Modell der Blutzuckerregulation: Welche Entsprechung ist KORREKT?',
    options: [
      'Bauchspeicheldrüse = Störgröße | Leber = Messfühler | Mahlzeit = Regler',
      'Blutzuckerkonzentration = Regelgröße (Istwert) | Bauchspeicheldrüse = Regler | Leber & Muskel = Stellglieder',
      'Insulin = Führungsgröße (Sollwert) | Sport = Regelgröße | Blutgefäß = Stellglied',
      'Gehirn = Regler | Magen = Messfühler | Glukose = Stellgröße'
    ],
    correct: 1,
    explanation: 'Die Regelgröße (der Istwert) ist die aktuelle Blutzuckerkonzentration. Der Regler mit Messfühlern ist die Bauchspeicheldrüse. Die Stellgrößen sind Insulin und Glukagon. Die Stellglieder (Effektoren) sind Leber und Muskulatur, die den Zucker aufnehmen oder abgeben.',
    misconceptionAlert: 'Didaktischer Kern: Die Bauchspeicheldrüse vereint Messfühler (Sensor) und Regler in einem Organ!'
  },
  {
    id: 5,
    question: 'Was versteht man unter dem Prinzip der "negativen Rückkopplung" (Gegenkopplung)?',
    options: [
      'Ein biologischer Prozess, bei dem der Blutzucker immer weiter ins Negative absinkt, bis der Mensch stirbt.',
      'Eine schlechte Stimmung im Körper, die zu Depressionen führt.',
      'Die Wirkung (z. B. Zuckersenkung) wirkt ihrer eigenen Ursache (dem Zuckeranstieg) entgegen und stellt das Gleichgewicht wieder her.',
      'Dass Insulin und Glukagon sich gegenseitig im Blut zerstören.'
    ],
    correct: 2,
    explanation: '"Negativ" bedeutet hier Gegenwirkung (- Vorzeichen): Steigt der Blutzucker, wird ein Prozess in Gang gesetzt, der ihn senkt. Sinkt er, wird ein Prozess gestartet, der ihn hebt. Das verhindert ein Entgleisen und sorgt für Homöostase (Fließgleichgewicht).',
    misconceptionAlert: 'Achtung Sprachfalle: "Negativ" bedeutet in der Kybernetik nicht "schlecht", sondern "entgegengesetzt gerichtet"!'
  },
  {
    id: 6,
    question: 'Was unterscheidet den Blutzuckerverlauf nach dem Verzehr von reinem Traubenzucker im Vergleich zu Vollkornbrot?',
    options: [
      'Traubenzucker führt zu einem extrem steilen, raschen Peak mit schneller Gegenregulation; Vollkornbrot führt zu einem sanften, langanhaltenden Anstieg.',
      'Vollkornbrot erhöht den Blutzucker überhaupt nicht, weil es Ballaststoffe enthält.',
      'Traubenzucker senkt den Blutzucker sofort, weil der Körper erschrickt.',
      'Beide führen zu exakt derselben Blutzuckerkurve, da Kohlenhydrate chemisch identisch sind.'
    ],
    correct: 0,
    explanation: 'Reiner Traubenzucker (Monosaccharid) gelangt ohne Verdauung direkt über die Mund- und Darmschleimhaut ins Blut (steiler Peak). Die komplexe Stärke im Vollkornbrot muss von Amylasen erst langsam in einzelne Glukosebausteine zerlegt werden, was einen sanften, nachhaltigen Verlauf bewirkt.',
    misconceptionAlert: 'Alltagsbezug: Vollkornbrot verhindert die typische "Heißhunger-Falle" nach schnellen Zuckerspitzen.'
  }
];
