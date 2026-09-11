export interface EyeStructure {
  id: string;
  name: string;
  latinName: string;
  category: 'brechend' | 'rezeptor' | 'schutz' | 'leitung';
  color: string;
  description: string;
  function: string;
  didacticNote?: string;
  highlightCoordinates?: { x: number; y: number };
}

export const EYE_STRUCTURES: EyeStructure[] = [
  {
    id: 'hornhaut',
    name: 'Hornhaut',
    latinName: 'Cornea',
    category: 'brechend',
    color: '#38bdf8',
    description: 'Glasklare, gewölbte Außenhaut an der Vorderseite des Auges. Gefäßlos und wird über das Kammerwasser und Tränenflüssigkeit ernährt.',
    function: 'Liefert mit rund 43 Dioptrien etwa zwei Drittel der gesamten Lichtbrechkraft des Auges. Sie ist starr und kann sich nicht an Entfernungen anpassen.',
    didacticNote: 'Häufiger Schülerfehler: Viele glauben, die Linse mache die meiste Brecharbeit. In Wahrheit bricht die Hornhaut den Großteil des Lichts am Übergang Luft/Gewebe!',
    highlightCoordinates: { x: 95, y: 160 }
  },
  {
    id: 'vordere_kammer',
    name: 'Vordere Augenkammer',
    latinName: 'Camera anterior',
    category: 'brechend',
    color: '#7dd3fc',
    description: 'Flüssigkeitsgefüllter Hohlraum zwischen Hornhautrückseite und Iris.',
    function: 'Enthält klares Kammerwasser. Es versorgt Hornhaut und Linse mit Nährstoffen und Sauerstoff und hält den Augeninnendruck konstant.',
    highlightCoordinates: { x: 125, y: 160 }
  },
  {
    id: 'iris',
    name: 'Iris (Regenbogenhaut)',
    latinName: 'Iris',
    category: 'schutz',
    color: '#10b981',
    description: 'Farbige Gewebescheibe mit zentralem Loch (Pupille). Die Augenfarbe entsteht durch Melanin-Pigmente in der Iris.',
    function: 'Funktioniert wie die Blende einer Fotokamera: Zwei glatte Muskeln (Sphincter & Dilatator) verengen oder weiten die Pupille reflektorisch je nach Lichteinfall (Adaption).',
    didacticNote: 'Schutzfunktion: Verhindert Überblendung der Netzhaut bei hellem Sonnenlicht und maximiert die Lichtausbeute bei Dämmerung.',
    highlightCoordinates: { x: 145, y: 120 }
  },
  {
    id: 'pupille',
    name: 'Pupille',
    latinName: 'Pupilla',
    category: 'brechend',
    color: '#0f172a',
    description: 'Kein eigenes Gewebe, sondern die kreisrunde Lichtdurchtrittsöffnung in der Mitte der Iris.',
    function: 'Lässt Lichtstrahlen in das Augeninnere eintreten. Sie wirkt schwarz, weil das einfallende Licht im tiefen, pigmentierten Augeninneren absorbiert wird.',
    highlightCoordinates: { x: 145, y: 160 }
  },
  {
    id: 'linse',
    name: 'Augenlinse',
    latinName: 'Lens crystallina',
    category: 'brechend',
    color: '#a7f3d0',
    description: 'Bikonvex geformter, transparenter und hochelastischer Festkörper ohne eigene Nerven oder Blutgefäße.',
    function: 'Ermöglicht die dynamische Feinjustierung der Brechkraft (Akkommodation von ~19 bis ~33 Dioptrien). Durch Veränderung ihrer Krümmung stellt sie Gegenstände von nah bis fern scharf.',
    didacticNote: 'Zentraler Lehrplan-Schwerpunkt: Die Linse wölbt sich durch Eigenelastizität kugelig, wenn der Ziliarmuskel anspannt!',
    highlightCoordinates: { x: 165, y: 160 }
  },
  {
    id: 'ziliarmuskel',
    name: 'Ziliarmuskel (Ciliarmuskel)',
    latinName: 'Musculus ciliaris',
    category: 'brechend',
    color: '#f97316',
    description: 'Ringförmiger Muskelkörper rund um die Linse im Ziliarkörper.',
    function: 'Steuert die Linsenkrümmung: Kontrahiert er, verengt sich der Muskelring und rückt näher an die Linse heran. Dadurch erschlaffen die Zonulafasern und die Linse kugelt sich ab (Nahsicht).',
    didacticNote: 'ACHTUNG KONTRAINTUITIV: Muskelanspannung bedeutet NICHT Linsendehnung! Anspannung = Ring kleiner = Fasern locker = Linse dick!',
    highlightCoordinates: { x: 165, y: 92 }
  },
  {
    id: 'zonulafasern',
    name: 'Zonulafasern',
    latinName: 'Fibrae zonulares',
    category: 'brechend',
    color: '#fbbf24',
    description: 'Hauchdünne, elastische Aufhängefasern, die sternförmig vom Ziliarkörper zum Linsenäquator ziehen.',
    function: 'Übertragen die mechanische Spannung des Ziliarmuskels auf die Linsenkapsel. Bei entspanntem Muskel stehen sie unter Zug und ziehen die Linse flach (Fernsicht).',
    highlightCoordinates: { x: 165, y: 125 }
  },
  {
    id: 'glaskoerper',
    name: 'Glaskörper',
    latinName: 'Corpus vitreum',
    category: 'schutz',
    color: '#e0f2fe',
    description: 'Glasklare Gallerte, die den gesamten Innenraum des Augapfels hinter der Linse ausfüllt (ca. 98-99 % Wasser, 1 % Hyaluronsäure und Kollagen).',
    function: 'Verleiht dem Augapfel die kugelförmige Stabilität und presst die empfindliche Netzhaut von innen an die Aderhaut an.',
    highlightCoordinates: { x: 260, y: 160 }
  },
  {
    id: 'netzhaut',
    name: 'Netzhaut',
    latinName: 'Retina',
    category: 'rezeptor',
    color: '#facc15',
    description: 'Hauchdünne, mehrschichtige Sinnesschicht an der hinteren Innenwand des Auges. Enthält ca. 126 Millionen Fotorezeptoren.',
    function: 'Wandelt eintreffende Lichtquanten durch Fotopigmente (Rhodopsin / Iodopsin) in elektrische Nervenimpulse um. Entspricht dem Bildsensor einer Digitalkamera.',
    highlightCoordinates: { x: 345, y: 120 }
  },
  {
    id: 'gelber_fleck',
    name: 'Gelber Fleck (Fovea centralis)',
    latinName: 'Macula lutea / Fovea centralis',
    category: 'rezeptor',
    color: '#eab308',
    description: 'Kleine, gelblich pigmentierte Vertiefung auf der optischen Achse in der Mitte der Netzhaut.',
    function: 'Stelle des schärfsten Sehens! Hier stehen ausschließlich extrem dicht gedrängte Zapfen. Beim gezielten Fixieren eines Gegenstands (z. B. beim Lesen) fällt das Bild exakt hierher.',
    didacticNote: 'Hier befinden sich keine Stäbchen und keine störenden Blutgefäße im Strahlengang, daher maximale Auflösung und Farbensehen.',
    highlightCoordinates: { x: 375, y: 160 }
  },
  {
    id: 'blinder_fleck',
    name: 'Blinder Fleck (Papille)',
    latinName: 'Discus nervi optici',
    category: 'leitung',
    color: '#94a3b8',
    description: 'Kreisrunde Sammelstelle der Nervenfasern, an der der Sehnerv den Augapfel nach hinten verlässt.',
    function: 'Völlig frei von Fotorezeptoren – hier kann kein Licht wahrgenommen werden! Das Gehirn und das zweite Auge ergänzen die fehlende Bildinformation unbemerkt.',
    highlightCoordinates: { x: 360, y: 205 }
  },
  {
    id: 'sehnerv',
    name: 'Sehnerv',
    latinName: 'Nervus opticus',
    category: 'leitung',
    color: '#f87171',
    description: 'Dicker Nervenstrang aus rund 1 bis 1,2 Millionen gebündelten Nervenfasern (Axone der Ganglienzellen).',
    function: 'Leitet die verschlüsselten Aktionspotenziale der Netzhaut direkt zum Sehzentrum im Großhirn (visueller Kortex / Okzipitallappen).',
    highlightCoordinates: { x: 420, y: 215 }
  },
  {
    id: 'lederhaut',
    name: 'Lederhaut',
    latinName: 'Sclera',
    category: 'schutz',
    color: '#e2e8f0',
    description: 'Zähe, weiße Bindegewebshülle rund um den gesamten Augapfel („das Weiße im Auge“). Geht vorne in die transparente Hornhaut über.',
    function: 'Schützt das Augeninnere vor mechanischen Verletzungen und dient den äußeren Augenmuskeln als stabiler Ansatzpunkt zur Augenbewegung.',
    highlightCoordinates: { x: 260, y: 65 }
  },
  {
    id: 'aderhaut',
    name: 'Aderhaut',
    latinName: 'Chorioidea',
    category: 'schutz',
    color: '#b91c1c',
    description: 'Stark durchblutete mittlere Augenschicht zwischen Lederhaut und Netzhaut mit vielen dunklen Pigmentzellen.',
    function: 'Ernährt die anliegende Netzhaut mit Sauerstoff und Glucose. Die dunklen Pigmente verhindern, dass Licht im Auge diffus hin- und hergestreut wird (Kamera-Dunkelkammer).',
    highlightCoordinates: { x: 280, y: 73 }
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
    question: 'Du blickst von einer weit entfernten Bergspitze auf dein Smartphone in 20 cm Entfernung. Was passiert im Auge bei dieser Nahakkommodation?',
    context: 'Akkommodationsmechanismus nach Helmholtz (LehrplanPLUS B8 2)',
    options: [
      {
        text: 'Der Ziliarmuskel spannt sich an, der Muskelring wird enger, die Zonulafasern erschlaffen und die Linse krümmt sich elastisch kugelförmig.',
        isCorrect: true,
        feedback: 'Hervorragend und fachlich exakt! Bei Anspannung verringert der Ziliarmuskel seinen Durchmesser. Die Haltefasern lockern sich und die elastische Linse kann sich abkugeln.'
      },
      {
        text: 'Der Ziliarmuskel zieht kräftig an den Zonulafasern, wodurch die Linse flach und dünn gestreckt wird.',
        isCorrect: false,
        feedback: 'Häufiges Fehlkonzept! Wenn an den Fasern gezogen wird, wird die Linse flach (Fernsicht mit geringer Brechkraft). Für die Nahsicht muss sie aber dick und kugelig werden!'
      },
      {
        text: 'Der Ziliarmuskel entspannt sich vollkommen, wodurch die Linse durch Blutdruck nach vorne gewölbt wird.',
        isCorrect: false,
        feedback: 'Falsch. Der entspannte Ziliarmuskel liegt bei der Fernsicht vor. Für die Nahsicht muss der Muskel aktiv Arbeit leisten, weshalb langes Lesen ermüden kann.'
      },
      {
        text: 'Die Hornhaut verändert ihre Krümmung und übernimmt die zusätzliche Brechkraft.',
        isCorrect: false,
        feedback: 'Falsch. Die Hornhaut hat eine starre Form und ändert ihre Krümmung niemals aktiv. Nur die Linse akkommodiert!'
      }
    ],
    misconceptionAlert: 'Merke dir das Paradoxon: Muskuläre Anstrengung = Zonulafasern locker = Linse dick & kugelig (hohe Brechkraft)!',
    curriculumBadge: 'Akkommodation'
  },
  {
    id: 2,
    question: 'Welche Eigenschaften besitzt das optische Bild, das auf unserer Netzhaut entsteht?',
    context: 'Geometrische Optik der Bildentstehung (LehrplanPLUS B8 2)',
    options: [
      {
        text: 'Es ist reell, steht auf dem Kopf (umgekehrt) und ist stark verkleinert.',
        isCorrect: true,
        feedback: 'Richtig! Wie bei einer Sammellinse oder Fotokamera mit Gegenstandsweite g > 2f ist das Bild reell, umgekehrt und verkleinert. Erst das Großhirn dreht es für unser Bewusstsein wieder um!'
      },
      {
        text: 'Es ist virtuell, steht aufrecht und ist maßstabsgetreu vergrößert.',
        isCorrect: false,
        feedback: 'Falsch. Ein virtuelles Bild kann man nicht auf einem Schirm (der Netzhaut) auffangen. Sammellinsen erzeugen ein reelles Bild.'
      },
      {
        text: 'Es ist reell, steht bereits aufrecht und ist genauso groß wie das Originalobjekt.',
        isCorrect: false,
        feedback: 'Falsch. Lichtstrahlen kreuzen sich im Auge, weshalb das Bild auf dem Kopf steht. Zudem ist das Auge nur wenige Zentimeter groß, das Bild muss also verkleinert sein.'
      },
      {
        text: 'Es ist spiegelverkehrt, steht aber senkrecht aufrecht.',
        isCorrect: false,
        feedback: 'Falsch. Die Strahlen von oben landen unten auf der Netzhaut, und die Strahlen von unten landen oben. Das Bild ist vollständig invertiert.'
      }
    ],
    misconceptionAlert: 'Dass wir die Welt aufrecht sehen, ist eine reine Rechenleistung des Sehzentrums im Gehirn!',
    curriculumBadge: 'Bildentstehung'
  },
  {
    id: 3,
    question: 'Eine kurzsichtige Schülerin (Myopie) kann im Klassenzimmer die Schrift an der Tafel nicht erkennen. Welche Ursache und welches Korrekturglas liegen vor?',
    context: 'Fehlsichtigkeiten und Optik (LehrplanPLUS B8 2)',
    options: [
      {
        text: 'Der Augapfel ist zu lang. Der Brennpunkt liegt VOR der Netzhaut; Korrektur durch eine Zerstreuungslinse (Konkavlinse / Minusglas).',
        isCorrect: true,
        feedback: 'Perfekt! Bei Achsenmyopie ist der Augapfel zu lang gebaut. Die Zerstreuungslinse streut das Licht leicht vorab, sodass der Fokus nach hinten exakt auf die Netzhaut wandert.'
      },
      {
        text: 'Der Augapfel ist zu kurz. Der Brennpunkt liegt HINTER der Netzhaut; Korrektur durch eine Sammellinse (Plusglas).',
        isCorrect: false,
        feedback: 'Das beschreibt die Weitsichtigkeit (Hyperopie), nicht die Kurzsichtigkeit!'
      },
      {
        text: 'Die Linse ist zu flach. Das Licht wird zu schwach gebrochen; Korrektur durch eine stärkere Sammellinse.',
        isCorrect: false,
        feedback: 'Falsch. Bei Kurzsichtigkeit ist die Brechkraft bezogen auf die Augapfellänge zu stark, nicht zu schwach.'
      },
      {
        text: 'Die Hornhaut ist trüb. Korrektur durch eine zylindrische Lupe.',
        isCorrect: false,
        feedback: 'Falsch. Eine getrübte Hornhaut nennt man Hornhauttrübung bzw. Grauer Star bei der Linse, das hat nichts mit klassischer Kurzsichtigkeit zu tun.'
      }
    ],
    misconceptionAlert: 'Kurzsichtig = Augapfel zu lang = Brennpunkt VOR der Netzhaut = Minusglas (Zerstreuungslinse bricht nach außen)!',
    curriculumBadge: 'Fehlsichtigkeit'
  },
  {
    id: 4,
    question: 'Warum benötigt eine Person mit Weitsichtigkeit (Hyperopie) eine Sammellinse als Lesebrille?',
    context: 'Brillenoptik & Strahlenbrechung',
    options: [
      {
        text: 'Weil der Augapfel zu kurz ist und der Brennpunkt naher Gegenstände HINTER der Netzhaut läge. Die Sammellinse bündelt das Licht zusätzlich.',
        isCorrect: true,
        feedback: 'Ganz genau! Die Sammellinse (Konvexlinse) hat positive Dioptrien (+dpt), bündelt das einfallende Licht vorab und rückt den Brennpunkt nach vorne auf die Netzhaut.'
      },
      {
        text: 'Weil die Netzhaut zu wenige Stäbchen besitzt, bündelt die Sammellinse mehr Photonen.',
        isCorrect: false,
        feedback: 'Falsch. Weitsichtigkeit ist ein rein geometrisch-optisches Problem des Augapfels und der Brechkraft, kein Rezeptordefekt.'
      },
      {
        text: 'Weil eine Sammellinse das Bild im Auge auf den Kopf dreht, damit die Netzhaut es verarbeiten kann.',
        isCorrect: false,
        feedback: 'Falsch. Das Bild wird bereits durch das normale Auge auf den Kopf gestellt.'
      },
      {
        text: 'Weil der Ziliarmuskel bei Weitsichtigen dauerhaft verkrampft ist und gelöst werden muss.',
        isCorrect: false,
        feedback: 'Falsch. Die Linse kann zwar anfangs durch Dauerkontraktion kompensieren (was zu Kopfschmerzen führt), die Sammellinse entlastet aber optisch durch Vorbündelung.'
      }
    ],
    misconceptionAlert: 'Weitsichtig = Augapfel zu kurz = Brennpunkt HINTER der Netzhaut = Plusglas (Sammellinse bündelt nach innen)!',
    curriculumBadge: 'Optiker-Werkstatt'
  },
  {
    id: 5,
    question: 'Was ist der biologische Grund dafür, dass wir an der Stelle des Blinden Flecks nichts sehen können?',
    context: 'Netzhautanatomie & Sehverarbeitung',
    options: [
      {
        text: 'Dort bündeln sich alle Nervenfasern zum Sehnerv und treten aus dem Augapfel aus – es gibt an dieser Stelle keine Fotorezeptoren.',
        isCorrect: true,
        feedback: 'Exzellent! An der Sehnervpapille müssen über 1 Million Nervenfasern und Blutgefäße durch die Augenwand. Für Sinneszellen (Stäbchen/Zapfen) ist dort schlicht kein Platz.'
      },
      {
        text: 'Dort befinden sich ausschließlich Stäbchen, die nur bei völliger Dunkelheit ansprechen.',
        isCorrect: false,
        feedback: 'Falsch. Am Blinden Fleck gibt es überhaupt keine Fotorezeptoren – weder Stäbchen noch Zapfen!'
      },
      {
        text: 'Dort wird das Licht von der schwarzen Aderhaut so stark verschluckt, dass keine Signale entstehen.',
        isCorrect: false,
        feedback: 'Falsch. Die Aderhaut absorbiert Streulicht überall, aber am Blinden Fleck fehlen die Sinneszellen.'
      },
      {
        text: 'Der Blinde Fleck ist eine Alterserscheinung und tritt nur bei Erwachsenen auf.',
        isCorrect: false,
        feedback: 'Falsch. Jeder gesunde Mensch besitzt von Geburt an an beiden Augen einen Blinden Fleck (anatomische Austrittsstelle des Sehnervs).'
      }
    ],
    misconceptionAlert: 'Dass wir kein schwarzes Loch sehen, liegt daran, dass das Gehirn die Lücke mit Mustern der Umgebung nahtlos übermalt („Filling-in“) und sich die Sehfelder beider Augen ergänzen.',
    curriculumBadge: 'Sinnesphysiologie'
  },
  {
    id: 6,
    question: 'Im Sprichwort heißt es: „Nachts sind alle Katzen grau“. Welcher zelluläre Mechanismus der Netzhaut erklärt dieses Phänomen biologisch exakt?',
    context: 'Fotorezeptoren: Stäbchen vs. Zapfen (LehrplanPLUS B8 2)',
    options: [
      {
        text: 'Bei Dämmerung und Dunkelheit sind nur die hochlichtempfindlichen Stäbchen aktiv, die keine Farben unterscheiden können. Die Zapfen arbeiten erst bei Helligkeit.',
        isCorrect: true,
        feedback: 'Brillant erklärt! Zapfen benötigen viel Licht (photopisches Sehen) und ermöglichen mit 3 Typen (Rot/Grün/Blau) das Farbsehen. Stäbchen sind 1000-mal lichtempfindlicher, besitzen aber nur ein Sehpigment (Rhodopsin) für Graustufen (skotopisches Sehen).'
      },
      {
        text: 'Die Hornhaut filtert bei Nacht alle bunten Lichtwellen heraus, damit die Netzhaut geschont wird.',
        isCorrect: false,
        feedback: 'Falsch. Die Hornhaut bricht Licht aller sichtbaren Wellenlängen gleichmäßig und filtert keine Farben.'
      },
      {
        text: 'Die Pupille schließt sich bei Dunkelheit so stark, dass nur noch graues Licht hindurchpasst.',
        isCorrect: false,
        feedback: 'Falsch. Im Gegenteil: Die Pupille weitet sich bei Dunkelheit maximal (Mydriasis), um jedes Photon einzufangen!'
      },
      {
        text: 'Die Zapfen im Gelben Fleck schlafen nachts und wachen erst bei Sonnenaufgang auf.',
        isCorrect: false,
        feedback: 'Umgangssprachlich und biologisch inkorrekt. Die Zapfen haben eine höhere Reizschwelle; bei schwachem Licht reicht die Photonenenergie nicht aus, um ihr Rhodopsin zu spalten.'
      }
    ],
    misconceptionAlert: 'Zapfen = ca. 6 Millionen = Farbe, Schärfe, Fovea, Taglicht. Stäbchen = ca. 120 Millionen = Hell-Dunkel, Peripherie, Dämmerung.',
    curriculumBadge: 'Adaption & Rezeptoren'
  }
];

export interface GlossaryItem {
  term: string;
  pronunciation?: string;
  definition: string;
  curriculumReference: string;
}

export const GLOSSARY: GlossaryItem[] = [
  {
    term: 'Akkommodation',
    definition: 'Dynamische Anpassung der Brechkraft des Auges durch den Ziliarmuskel und die elastische Augenlinse, um Gegenstände in unterschiedlichen Entfernungen (nah bis fern) scharf auf der Netzhaut abzubilden.',
    curriculumReference: 'LehrplanPLUS B8 2 – Informationsaufnahme & -verarbeitung'
  },
  {
    term: 'Adaption',
    definition: 'Anpassung des Auges an unterschiedliche Helligkeitsverhältnisse durch den Pupillenreflex (Iris-Muskeln) sowie die Umschaltung zwischen Zapfen (Tag) und Stäbchen (Nacht).',
    curriculumReference: 'LehrplanPLUS B8 2 – Sinnesorgane'
  },
  {
    term: 'Dioptrie (dpt)',
    definition: 'Maßeinheit für die Brechkraft eines optischen Systems (Kehrwert der Brennweite in Metern: D = 1 / f). Ein Auge hat in Ruhe rund 59 dpt Gesamtbrechkraft.',
    curriculumReference: 'Physik & Biologie Klasse 8 – Optik'
  },
  {
    term: 'Myopie (Kurzsichtigkeit)',
    definition: 'Fehlsichtigkeit, bei der der Augapfel meist zu lang ist (Achsenmyopie). Parallele Strahlen aus der Ferne schneiden sich vor der Netzhaut. Korrektur durch Zerstreuungslinse (Minusgläser).',
    curriculumReference: 'LehrplanPLUS B8 2 – Sehfehler'
  },
  {
    term: 'Hyperopie (Weitsichtigkeit)',
    definition: 'Fehlsichtigkeit, bei der der Augapfel meist zu kurz gebaut ist. Der Brennpunkt naher Gegenstände liegt hinter der Netzhaut. Korrektur durch Sammellinse (Plusgläser).',
    curriculumReference: 'LehrplanPLUS B8 2 – Sehfehler'
  },
  {
    term: 'Fovea centralis (Gelber Fleck)',
    definition: 'Zentrale Einsenkung der Macula lutea auf der Netzhaut mit der höchsten Dichte an Zapfen (keine Stäbchen). Ort des schärfsten Sehens und der besten Farbauflösung.',
    curriculumReference: 'LehrplanPLUS B8 2 – Netzhautfeinbau'
  },
  {
    term: 'Papilla nervi optici (Blinder Fleck)',
    definition: 'Austrittsstelle des Sehnervs aus der Netzhaut. Da an dieser Stelle sämtliche Nervenfasern austreten, existieren dort keinerlei Fotorezeptoren.',
    curriculumReference: 'LehrplanPLUS B8 2 – Bau der Netzhaut'
  }
];
