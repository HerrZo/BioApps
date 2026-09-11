export interface EarStructure {
  id: string;
  name: string;
  latinName: string;
  section: 'aussen' | 'mittel' | 'innen';
  color: string;
  description: string;
  function: string;
  didacticNote?: string;
  highlightCoordinates?: { x: number; y: number };
}

export const EAR_STRUCTURES: EarStructure[] = [
  {
    id: 'ohrmuschel',
    name: 'Ohrmuschel',
    latinName: 'Auricula / Pinna',
    section: 'aussen',
    color: '#fb923c',
    description: 'Elastisches Knorpelgerüst mit Hautüberzug an der Außenseite des Kopfes.',
    function: 'Wirkt wie ein Schalltrichter: Sammelt Schallwellen aus der Umgebung und bricht sie je nach Einfallswinkel. Ermöglicht dadurch das Richtungshören (vorne/hinten/oben/unten).',
    highlightCoordinates: { x: 45, y: 150 }
  },
  {
    id: 'gehoergang',
    name: 'Äußerer Gehörgang',
    latinName: 'Meatus acusticus externus',
    section: 'aussen',
    color: '#f97316',
    description: 'Ca. 2,5 bis 3 cm langer, s-förmig gekrümmter Kanal vom Ohrtrichter bis zum Trommelfell.',
    function: 'Leitet Schallwellen zum Trommelfell. Schützt das empfindliche Mittelohr durch Härchen und klebriges Ohrenschmalz (Cerumen). Verstärkt durch Eigenresonanz Frequenzen um 2.000–4.000 Hz (Sprachbereich!).',
    highlightCoordinates: { x: 120, y: 155 }
  },
  {
    id: 'trommelfell',
    name: 'Trommelfell',
    latinName: 'Membrana tympani',
    section: 'mittel',
    color: '#38bdf8',
    description: 'Hauchdünne (ca. 0,1 mm), perlmuttschimmernde Membran mit einer Fläche von rund 55–65 mm².',
    function: 'Schließt den Gehörgang luftdicht ab und wandelt Luftdruckschwankungen in mechanische Schwingungen um. Überträgt die Schwingung direkt auf den Hammer.',
    didacticNote: 'Zentraler Bestandteil der Druckverstärkung: Seine Fläche ist ca. 20-mal größer als das ovale Fenster!',
    highlightCoordinates: { x: 195, y: 155 }
  },
  {
    id: 'hammer',
    name: 'Hammer',
    latinName: 'Malleus',
    section: 'mittel',
    color: '#a855f7',
    description: 'Erster der drei winzigen Gehörknöchelchen; sein Griff ist fest mit dem Trommelfell verwachsen.',
    function: 'Nimmt die Trommelfellschwingung auf und leitet sie über ein echtes Gelenk auf den Amboss weiter.',
    highlightCoordinates: { x: 215, y: 135 }
  },
  {
    id: 'amboss',
    name: 'Amboss',
    latinName: 'Incus',
    section: 'mittel',
    color: '#c084fc',
    description: 'Mittleres Gehörknöchelchen zwischen Hammer und Steigbügel.',
    function: 'Wirkt als doppelarmiger Hebel: Wandelt größere Schwingungswege mit geringer Kraft in kleinere Wege mit höherer Kraft um.',
    highlightCoordinates: { x: 245, y: 130 }
  },
  {
    id: 'steigbuegel',
    name: 'Steigbügel',
    latinName: 'Stapes',
    section: 'mittel',
    color: '#e879f9',
    description: 'Kleinstes Knöchelchen des menschlichen Körpers (ca. 3 mm groß, wiegt nur rund 3 Milligramm!).',
    function: 'Seine Fußplatte sitzt im ovalen Fenster. Wirkt wie ein winziger Stempel, der die mechanische Kraft auf die Schneckenflüssigkeit überträgt.',
    didacticNote: 'Fläche der Fußplatte nur ca. 3 mm² – das erzeugt einen enormen Druck (p = F / A)!',
    highlightCoordinates: { x: 275, y: 145 }
  },
  {
    id: 'ovales_fenster',
    name: 'Ovales Fenster',
    latinName: 'Fenestra vestibuli',
    section: 'innen',
    color: '#ec4899',
    description: 'Membranbespannte ovale Öffnung in der knöchernen Wand zwischen Mittelohr und oberer Schneckentreppe.',
    function: 'Eingangspforte der Schallwelle in die Cochlea. Hier schlägt der Steigbügel auf und versetzt die inkompressible Perilymphe in Schwingung.',
    highlightCoordinates: { x: 295, y: 145 }
  },
  {
    id: 'rundes_fenster',
    name: 'Rundes Fenster',
    latinName: 'Fenestra cochleae',
    section: 'innen',
    color: '#f43f5e',
    description: 'Zweite elastische Membranöffnung unterhalb des ovalen Fensters am Ende der Paukentreppe.',
    function: 'Druckausgleich! Da Flüssigkeiten inkompressibel sind, muss das runde Fenster gegenläufig nach außen in die Paukenhöhle nachgeben, wenn der Steigbügel hineindrückt.',
    didacticNote: 'Ohne das runde Fenster könnte die Schneckenflüssigkeit im geschlossenen Knochenraum nicht schwingen!',
    highlightCoordinates: { x: 295, y: 195 }
  },
  {
    id: 'cochlea',
    name: 'Hörschnecke',
    latinName: 'Cochlea',
    section: 'innen',
    color: '#10b981',
    description: 'Knöchernes, schneckenhausförmig gewundenes Organ (ca. 2,5 bis 2,75 Windungen, ausgerollt rund 32–35 mm lang).',
    function: 'Enthält drei flüssigkeitsgefüllte Gänge (Vorhoftreppe, Schneckengang, Paukentreppe) und trennt mechanische Schwingungen nach ihrer Tonhöhe (Tonotopie).',
    highlightCoordinates: { x: 380, y: 160 }
  },
  {
    id: 'basilarmembran',
    name: 'Basilarmembran',
    latinName: 'Lamina basilaris',
    section: 'innen',
    color: '#059669',
    description: 'Elastische Gewebebahn im Inneren der Schnecke, auf der das Corti-Organ mit den Haarzellen ruht.',
    function: 'Gradient der Resonanz: An der Schneckenbasis schmal und straff (schwingt bei hohen Frequenzen), an der Spitze (Apex) breit und locker (schwingt bei tiefen Frequenzen).',
    highlightCoordinates: { x: 410, y: 145 }
  },
  {
    id: 'corti_organ',
    name: 'Corti-Organ (Haarsinneszellen)',
    latinName: 'Organum spirale',
    section: 'innen',
    color: '#fbbf24',
    description: 'Mikroskopischer Sinnesapparat mit ca. 3.500 inneren und 12.000 äußeren Haarzellen mit feinen Sinneshärchen (Stereozilien).',
    function: 'Das eigentliche Hörorgan! Wenn die Basilarmembran schwingt, werden die Stereozilien gegen die Deckmembran (Tektorialmembran) abgeschert. Ionenkanäle öffnen sich und lösen elektrische Nervenimpulse aus.',
    didacticNote: 'Abgestorbene Haarzellen können sich beim Menschen nicht mehr teilen oder nachwachsen – Lärmschäden sind irreversibel!',
    highlightCoordinates: { x: 420, y: 175 }
  },
  {
    id: 'hoernerv',
    name: 'Hörnerv',
    latinName: 'Nervus cochlearis (VIII. Hirnnerv)',
    section: 'innen',
    color: '#eab308',
    description: 'Dicker Nervenstrang aus rund 30.000 Nervenfasern, die von den Haarzellen entspringen.',
    function: 'Leitet die frequenz- und lautstärkecodierten elektrischen Impulse direkt zum Hörzentrum im Schläfenlappen (Temporallappen) des Großhirns.',
    highlightCoordinates: { x: 470, y: 155 }
  },
  {
    id: 'ohrtrompete',
    name: 'Ohrtrompete (Eustachische Röhre)',
    latinName: 'Tuba auditiva',
    section: 'mittel',
    color: '#0284c7',
    description: 'Schmaler Verbindungskanal von der Paukenhöhle des Mittelohrs zum oberen Nasen-Rachen-Raum.',
    function: 'Sorgt für den Luftdruckausgleich zwischen Mittelohr und Außenatmosphäre (öffnet sich reflektorisch beim Schlucken und Gähnen). Verhindert, dass das Trommelfell bei Druckschwankungen (z. B. Flugzeug, Bergbahn) einreißt.',
    highlightCoordinates: { x: 260, y: 240 }
  }
];

export interface DecibelScenario {
  level: number;
  title: string;
  source: string;
  dangerClass: 'safe' | 'caution' | 'danger' | 'extreme';
  maxExposure: string;
  color: string;
  description: string;
}

export const DECIBEL_SCENARIOS: DecibelScenario[] = [
  {
    level: 20,
    title: 'Blätterrauschen & Flüstern',
    source: 'Ruhiger Wald, Bibliothek',
    dangerClass: 'safe',
    maxExposure: 'Unbegrenzt',
    color: '#22c55e',
    description: 'Sehr leise Geräusche. Völlig unbedenklich, ideal für Erholung und tiefen Schlaf.'
  },
  {
    level: 50,
    title: 'Normales Zimmergespräch',
    source: 'Wohnzimmer, Büro',
    dangerClass: 'safe',
    maxExposure: 'Unbegrenzt',
    color: '#10b981',
    description: 'Normale Sprachlautstärke im Alltag. Das Gehör arbeitet im entspannten Wohlfühlbereich.'
  },
  {
    level: 75,
    title: 'Straßenverkehr & Staubsauger',
    source: 'Hauptstraße, Föhn',
    dangerClass: 'caution',
    maxExposure: 'Mehrere Stunden',
    color: '#eab308',
    description: 'Bereits als störend und ermüdend empfunden. Setzt das vegetative Nervensystem unter Dauerstress.'
  },
  {
    level: 85,
    title: 'Baustelle & Rasenmäher',
    source: 'Arbeitsplatz-Schallpegel, laute Werkzeuge',
    dangerClass: 'danger',
    maxExposure: 'Max. 8 Stunden täglich (Gehörschutz!)',
    color: '#f97316',
    description: 'Gesetzliche Gehörschutzgrenze! Ab 85 dB droht bei regelmäßiger Dauerbelastung schleichender, unumkehrbarer Haarzellentod.'
  },
  {
    level: 100,
    title: 'Club & MP3-Player auf Maximum',
    source: 'Diskothek, Kopfhörer bei 100 %',
    dangerClass: 'danger',
    maxExposure: 'Max. 15 Minuten pro Woche!',
    color: '#ef4444',
    description: 'Akute Überlastung der Stereozilien. Typisches dumpfes Hören und Ohrensausen (Tinnitus) nach der Party sind Alarmsignale sterbender Haarzellen!'
  },
  {
    level: 120,
    title: 'Rockkonzert vor den Boxen',
    source: 'Sirene nah, Kettensäge',
    dangerClass: 'extreme',
    maxExposure: 'Wenige Sekunden',
    color: '#dc2626',
    description: 'Erreicht die Schmerzgrenze. Massive Scherkräfte zerstören die feinen Zellmembranen der Haarsinneszellen sofort.'
  },
  {
    level: 140,
    title: 'Düsenjäger-Start & Silvesterböller',
    source: 'Böller 1 m entfernt, Flugzeugtriebwerk',
    dangerClass: 'extreme',
    maxExposure: 'Sofortige Schädigung (0 Sekunden!)',
    color: '#991b1b',
    description: 'Schmerzgrenze überschritten! Akutes Knalltrauma: Zerreißung des Trommelfells und sofortiger irreversibler Zelltod im Innenohr.'
  }
];

export interface AudioPreset {
  label: string;
  frequency: number;
  description: string;
}

export const AUDIO_PRESETS: AudioPreset[] = [
  { label: 'Tiefbass (60 Hz)', frequency: 60, description: 'Sehr tiefe Sub-Bassfrequenz – regt den Apex an der Schneckenspitze an.' },
  { label: 'Bass-Stimme (150 Hz)', frequency: 150, description: 'Tiefe männliche Sprach-Grundfrequenz.' },
  { label: 'Kammerton A (440 Hz)', frequency: 440, description: 'Internationaler Stimmton für Orchester und Instrumente.' },
  { label: 'Sprachbereich (1.000 Hz)', frequency: 1000, description: 'Wichtigster Bereich für die menschliche Sprachverständlichkeit.' },
  { label: 'Zischlaute (3.500 Hz)', frequency: 3500, description: 'Hier liegen Zischlaute ("s", "f", "sch"). Hier beginnt typischerweise der Lärmschaden (C5-Senke).' },
  { label: 'Hoher Pfeifton (8.000 Hz)', frequency: 8000, description: 'Hoher Ton – Schwingungsmaximum liegt nahe der Schneckenbasis.' },
  { label: 'Jugend-Hörgrenze (15.000 Hz)', frequency: 15000, description: 'Sehr hoher Ton, der von Jugendlichen noch gut gehört wird, ab ca. 25–30 Jahren oft verloren geht.' }
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
    question: 'Warum reicht der direkte Luftschall nicht aus, um die Flüssigkeit in der Hörschnecke in Schwingung zu versetzen? Welche Lösung hat die Evolution entwickelt?',
    context: 'Schallleitung & Druckverstärkung im Mittelohr (LehrplanPLUS B8 2)',
    options: [
      {
        text: 'Die Luftschallwellen sind zu heiß; das Trommelfell kühlt sie ab, bevor sie eintreffen.',
        isCorrect: false,
        feedback: 'Falsch. Temperatur hat mit der Schalleitung im Mittelohr nichts zu tun.'
      },
      {
        text: 'Flüssigkeit ist viel dichter als Luft und würde 99,9 % der Schallenergie reflektieren. Trommelfell und Gehörknöchelchen verstärken den Schalldruck um das ca. 20-fache (Hebelwirkung & Flächenverkleinerung).',
        isCorrect: true,
        feedback: 'Absolut meisterhaft! Durch das Flächenverhältnis Trommelfell (ca. 60 mm²) zu Steigbügelfußplatte (ca. 3 mm²) und die Hebelübersetzung wird der Druck enorm gesteigert (Impedanzanpassung).'
      },
      {
        text: 'Die Gehörknöchelchen schlagen das Trommelfell an wie eine Pauke, wodurch elektrischer Strom entsteht.',
        isCorrect: false,
        feedback: 'Falsch. Das Trommelfell bewegt die Knöchelchen, nicht umgekehrt, und im Mittelohr fließt noch kein Nervenstrom.'
      },
      {
        text: 'Die Ohrmuschel saugt Luft an und drückt sie mit Hochdruck durch die Gehörknöchelchen in die Schnecke.',
        isCorrect: false,
        feedback: 'Falsch. Die Ohrmuschel ist ein passiver Schalltrichter ohne Pumpfunktion.'
      }
    ],
    misconceptionAlert: 'Merksatz: Große Fläche (Trommelfell) auf kleine Fläche (ovales Fenster) = massive Druckverstärkung nach p = F / A!',
    curriculumBadge: 'Mittelohr & Physik'
  },
  {
    id: 2,
    question: 'Wo in der Hörschnecke (Cochlea) werden hohe Töne (z. B. 10.000 Hz) wahrgenommen und warum?',
    context: 'Frequenzortsprinzip / Tonotopie nach Békésy',
    options: [
      {
        text: 'Ganz an der Schneckenspitze (Apex), weil dort die meisten Haarzellen sitzen.',
        isCorrect: false,
        feedback: 'Falsch. An der Spitze (Apex) werden die tiefsten Töne registriert, nicht die hohen!'
      },
      {
        text: 'In der Ohrtrompete, weil dort der Luftdruck am höchsten ist.',
        isCorrect: false,
        feedback: 'Falsch. Die Ohrtrompete dient nur dem Druckausgleich zum Rachen und besitzt keinerlei Sinneszellen.'
      },
      {
        text: 'Nahe der Schneckenbasis am ovalen Fenster, weil die Basilarmembran dort besonders schmal und straff gespannt ist.',
        isCorrect: true,
        feedback: 'Hervorragend! Wie bei einer kurzen, straffen Geigensaiten schwingt die schmale, steife Membran an der Basis bei hohen Frequenzen mit maximaler Amplitude.'
      },
      {
        text: 'Gleichmäßig verteilt über die gesamte Schnecke, da alle Haarzellen synchron auf jede Frequenz feuern.',
        isCorrect: false,
        feedback: 'Falsch. Das wäre die Telefonie-Theorie, die physikalisch widerlegt ist. Es gilt das Frequenzortsprinzip (Tonotopie)!'
      }
    ],
    misconceptionAlert: 'Basis (nah am Steigbügel) = schmal & straff = HOHE Töne. Apex (Schneckenspitze) = breit & elastisch = TIEFE Töne.',
    curriculumBadge: 'Tonotopie'
  },
  {
    id: 3,
    question: 'Welche physikalische Eigenschaft zeichnet die Wanderwelle eines tiefen Basstons (z. B. 80 Hz) aus?',
    context: 'Mechanik der Wanderwelle in der Cochlea',
    options: [
      {
        text: 'Sie wandert die gesamte Schnecke entlang bis zur Spitze (Apex / Helicotrema), wo die Membran breit und locker ist und ihr Schwingungsmaximum bildet.',
        isCorrect: true,
        feedback: 'Richtig! Tiefe Frequenzen erzeugen lange Wellenlängen. Sie laufen an der steifen Basis vorbei und bringen erst die weiche, breite Membran an der Schneckenspitze zur Resonanz.'
      },
      {
        text: 'Sie wird bereits am Trommelfell absorbiert und gelangt überhaupt nicht in die Schnecke.',
        isCorrect: false,
        feedback: 'Falsch. Tiefe Töne bringen das Trommelfell kräftig in Schwingung und gelangen ungehindert ins Innenohr.'
      },
      {
        text: 'Sie stoppt sofort an der Basis und bricht dort das runde Fenster.',
        isCorrect: false,
        feedback: 'Falsch. An der Basis stoppen nur sehr hohe Töne ihr Schwingungsmaximum.'
      },
      {
        text: 'Sie verwandelt sich im Mittelohr in Lichtwellen um.',
        isCorrect: false,
        feedback: 'Völliger Unsinn.'
      }
    ],
    misconceptionAlert: 'Tiefe Töne müssen den ganzen Weg bis zur Schneckenspitze zurücklegen, hohe Töne erreichen ihr Schwingungsmaximum schon am Anfang der Schnecke.',
    curriculumBadge: 'Wanderwelle'
  },
  {
    id: 4,
    question: 'Welche unverzichtbare mechanische Aufgabe erfüllt das membranöse runde Fenster?',
    context: 'Flüssigkeitsmechanik des Innenohrs',
    options: [
      {
        text: 'Es lässt frische Luft in die Schnecke strömen, damit die Haarzellen atmen können.',
        isCorrect: false,
        feedback: 'Falsch. Die Schnecke ist vollständig mit Flüssigkeit gefüllt; Luft würde die Schwingungsübertragung zerstören.'
      },
      {
        text: 'Es fängt störendes Streulicht ab, ähnlich wie die Pupille im Auge.',
        isCorrect: false,
        feedback: 'Falsch. Im Felsenbein des Schädels ist es stockdunkel, es gibt dort kein Licht.'
      },
      {
        text: 'Es verbindet das Ohr mit den Stimmbändern, um die eigene Stimme zu dämpfen.',
        isCorrect: false,
        feedback: 'Falsch. Dafür ist der Stapediusmuskel zuständig, nicht das runde Fenster.'
      },
      {
        text: 'Es dient dem elastischen Druckausgleich: Da Flüssigkeiten nicht komprimierbar sind, wölbt es sich gegenläufig in die Paukenhöhle vor, wenn der Steigbügel ins ovale Fenster drückt.',
        isCorrect: true,
        feedback: 'Perfekt! In einem allseits starren Knochenraum könnte sich eine inkompressible Flüssigkeit nicht bewegen. Das runde Fenster ermöglicht die Auslenkung der Flüssigkeitssäule.'
      }
    ],
    misconceptionAlert: 'Ohne das runde Fenster wäre die Schnecke eine starre Dose – die Flüssigkeit könnte nicht schwingen und wir wären taub!',
    curriculumBadge: 'Innenohrmechanik'
  },
  {
    id: 5,
    question: 'Was passiert auf zellulärer Ebene im Corti-Organ bei einer dauerhaften Lärmbelastung über 85 dB (z. B. durch laute Kopfhörer)?',
    context: 'Lärmschäden & Haarsinneszellen (LehrplanPLUS Gesundheit)',
    options: [
      {
        text: 'Das Ohrenschmalz verfestigt sich zu Stein und blockiert den Hörnerv dauerhaft.',
        isCorrect: false,
        feedback: 'Falsch. Ohrenschmalz entsteht im äußeren Gehörgang und schädigt nicht die Sinneszellen des Innenohrs.'
      },
      {
        text: 'Die feinen Stereozilien (Sinneshärchen) der Haarzellen werden mechanisch überdehnt, knicken um oder reißen ab; abgestorbene Haarzellen können beim Menschen nicht nachwachsen.',
        isCorrect: true,
        feedback: 'Exakt und erschreckend wahr! Menschliche Haarsinneszellen besitzen keine Regenerationsfähigkeit. Einmal abgeknickte oder zerstörte Stereozilien sind für immer verloren (irreversibler Hörverlust).'
      },
      {
        text: 'Die Gehörknöchelchen wachsen zusammen und verwandeln sich in Knorpel.',
        isCorrect: false,
        feedback: 'Falsch. Eine Verknöcherung des Steigbügels nennt man Otosklerose, das ist eine Erkrankung, aber keine Folge von Lärm.'
      },
      {
        text: 'Die Haarzellen teilen sich explosionsartig, wodurch das Ohr überempfindlich wird.',
        isCorrect: false,
        feedback: 'Falsch. Haarzellen teilen sich im adulten Säugetiergehör niemals.'
      }
    ],
    misconceptionAlert: 'Haarsinneszellen sind wie Grashalme: Einmal leicht niedergetreten erholen sie sich (vorübergehende Schwellenabwanderung). Werden sie niedergetrampelt, sterben sie ab!',
    curriculumBadge: 'Lärmprävention'
  },
  {
    id: 6,
    question: 'Warum klagen Menschen mit beginnendem Lärmschaden oft: „Ich höre zwar, dass jemand spricht, aber ich verstehe den Inhalt nicht mehr!“?',
    context: 'Sprachverständlichkeit & Hochtonverlust (C5-Senke)',
    options: [
      {
        text: 'Weil das Gehirn durch Lärm die deutsche Grammatik vergisst.',
        isCorrect: false,
        feedback: 'Falsch. Die Sprachverarbeitung im Gehirn ist intakt, das Problem liegt im Signalempfang des Ohrs.'
      },
      {
        text: 'Weil das Trommelfell nur noch Vokale durchlässt und Konsonanten reflektiert.',
        isCorrect: false,
        feedback: 'Falsch. Das Trommelfell schwingt bei allen Frequenzen gleichermaßen mit.'
      },
      {
        text: 'Weil Lärmschäden an der Schneckenbasis beginnen und hohe Frequenzen ausfallen. Vokale ("a", "o") sind tieffrequent und laut, aber Konsonanten ("s", "f", "sch", "t") sind hochfrequent und liefern die Wortunterscheidung.',
        isCorrect: true,
        feedback: 'Brillant erklärt! Vokale tragen rund 80 % der Schallenergie, aber Konsonanten und Zischlaute tragen 90 % der Informations- und Sinnbedeutung. Fehlen die hohen Frequenzen, verschwimmt Sprache zu unverständlichem Murmeln.'
      },
      {
        text: 'Weil der Hörnerv bei Lärm die Signale spiegelverkehrt ans Sehzentrum schickt.',
        isCorrect: false,
        feedback: 'Falsch. Die Reizleitung bleibt anatomisch korrekt verschaltet.'
      }
    ],
    misconceptionAlert: 'Lautstärke hören $\\neq$ Sprache verstehen! Konsonanten und Zischlaute ("s", "f", "t") liegen im Hochtonbereich, der bei Lärm als Erstes zerstört wird.',
    curriculumBadge: 'Audiologie & Sprache'
  }
];

export interface GlossaryItem {
  term: string;
  definition: string;
  curriculumReference: string;
}

export const GLOSSARY: GlossaryItem[] = [
  {
    term: 'Tonotopie (Frequenzortsprinzip)',
    definition: 'Ortsabhängige Frequenzzerlegung in der Hörschnecke: Hohe Töne regen die steife, schmale Membran an der Basis an; tiefe Töne wandern bis zur weichen, breiten Membran an der Spitze (Apex). Entdeckt von Nobelpreisträger Georg von Békésy.',
    curriculumReference: 'LehrplanPLUS B8 2 – Informationsaufnahme & -verarbeitung'
  },
  {
    term: 'Dezibel (dB)',
    definition: 'Logarithmisches Maß für den Schalldruckpegel. Eine Erhöhung um +10 dB entspricht etwa einer Verdopplung der empfundenen Lautstärke und einer Verzehnfachung der Schallenergie!',
    curriculumReference: 'Physik & Biologie Klasse 8 – Akustik'
  },
  {
    term: 'Basilarmembran',
    definition: 'Trennende Gewebemembran in der Hörschnecke, auf der das Corti-Organ sitzt. Schwingt als frequenzabhängige Wanderwelle und schert die Haarsinneszellen ab.',
    curriculumReference: 'LehrplanPLUS B8 2 – Sinnesorgane'
  },
  {
    term: 'Corti-Organ',
    definition: 'Das eigentliche Hörorgan des Menschen im Schneckengang, bestehend aus ca. 15.000 inneren und äußeren Haarsinneszellen mit Stereozilien.',
    curriculumReference: 'LehrplanPLUS B8 2 – Feinbau der Sinnesorgane'
  },
  {
    term: 'Tinnitus',
    definition: 'Wahrnehmung von Schein-Ohrgeräuschen (Pfeifen, Rauschen, Klingeln) ohne äußere Schallquelle. Häufig Folge einer Lärmüberlastung, bei der geschädigte Haarzellen oder übererregte Nervenzellen Fehlsignale feuern.',
    curriculumReference: 'LehrplanPLUS B8 2 – Gesundheit & Lärmschutz'
  },
  {
    term: 'Ohrtrompete (Eustachi-Röhre)',
    definition: 'Kanal zwischen Mittelohr und Rachenraum. Öffnet sich beim Schlucken und Gähnen zum atmosphärischen Druckausgleich, damit das Trommelfell frei schwingen kann.',
    curriculumReference: 'LehrplanPLUS B8 2 – Bau des Ohrs'
  }
];
