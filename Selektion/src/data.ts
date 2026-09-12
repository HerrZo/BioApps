export interface EnvironmentPreset {
  id: string;
  name: string;
  groundColor: string;
  groundBrightness: number; // 0.0 (very dark) to 1.0 (very light)
  description: string;
  historicalEvent?: string;
  badge: string;
}

export const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  {
    id: 'sand',
    name: 'Wüstensand & Granit',
    groundColor: '#d6b88d',
    groundBrightness: 0.8,
    description: 'Heller Sandstein und Granitboden in der Sonora-Wüste. Helle Mäuse sind optimal getarnt, dunkle fallen sofort auf.',
    badge: 'Standard-Wüste'
  },
  {
    id: 'steppe',
    name: 'Halbwüste & Savannengras',
    groundColor: '#968158',
    groundBrightness: 0.5,
    description: 'Mittlerer Erdton mit vertrocknetem Gras. Mittlere Brauntöne bieten die beste Deckung.',
    badge: 'Übergangszone'
  },
  {
    id: 'forest',
    name: 'Dunkler Waldboden & Humus',
    groundColor: '#453221',
    groundBrightness: 0.25,
    description: 'Feuchter, nadelbedeckter Nadelwaldboden. Braune bis sehr dunkle Fellfarben überleben am besten.',
    badge: 'Wald-Biotop'
  },
  {
    id: 'volcano',
    name: 'Vulkanausbruch (Lavafeld)',
    groundColor: '#1a1c20',
    groundBrightness: 0.08,
    description: 'Plötzlicher Lavastrom (wie im Valley of Fires, New Mexico)! Der Boden erstarrt zu pechschwarzem Basalt. Helle Mäuse leuchten wie Leuchttürme!',
    historicalEvent: 'Vulkanausbruch vor ca. 1.000 Jahren schuf schwarzes Basaltfeld',
    badge: 'Katastrophe (Basalt)'
  }
];

export interface LamarckVsDarwinTopic {
  id: string;
  title: string;
  organism: string;
  question: string;
  lamarckView: {
    coreIdea: string;
    mechanism: string;
    fallacy: string;
  };
  darwinView: {
    coreIdea: string;
    mechanism: string;
    evidence: string;
  };
}

export const LAMARCK_VS_DARWIN_TOPICS: LamarckVsDarwinTopic[] = [
  {
    id: 'mice',
    title: 'Felsentaschenmäuse auf schwarzer Lava',
    organism: 'Chaetodipus intermedius (New Mexico)',
    question: 'Warum haben Mäuse auf dem schwarzen Basaltfeld fast ausnahmslos schwarzes Fell, auf dem Sandboden wenige Meter daneben aber sandfarbenes?',
    lamarckView: {
      coreIdea: 'Aktive Anpassung durch Bedürfnis & Gewohnheit',
      mechanism: 'Die Mäuse spürten das Bedürfnis nach Tarnung auf der dunklen Lava. Durch den Aufenthalt auf der schwarzen Lava verdunkelte sich ihr Fell während des Lebens. Diese erworbene dunkle Färbung vererbten sie an ihre Nachkommen.',
      fallacy: 'Denkfehler: Modifikationen (Fellverfärbung durch Ruß oder Sonne) verändern nicht die DNA in Eizellen oder Spermien (Weismann-Barriere)!'
    },
    darwinView: {
      coreIdea: 'Ungerichtete Mutation vorab + differentielle Selektion',
      mechanism: 'Schon vor dem Vulkanausbruch entstanden durch zufällige Mutationen im Mc1r-Gen vereinzelt dunkle Mäuse. Auf Sand wurden sie sofort von Eulen gefressen. Als die Lava erkaltete, hatten zufällig dunkle Mäuse plötzlich einen massiven Überlebensvorteil. Sie überlebten öfter und pflanzten sich erfolgreicher fort (höhere reproduktive Fitness). Über Generationen stieg die Allelfrequenz von 1 % auf fast 100 %.',
      evidence: 'Molekulargenetischer Nachweis: Exakt 4 Punktmutationen im Mc1r-Gen steuern die Eumelanin-Synthese – rein zufällig entstanden!'
    }
  },
  {
    id: 'giraffe',
    title: 'Der lange Hals der Giraffe',
    organism: 'Giraffa camelopardalis',
    question: 'Wie entstand der extrem lange Hals der heutigen Giraffen aus kurzhalsigen Vorfahren?',
    lamarckView: {
      coreIdea: 'Gebrauch und Nichtgebrauch von Organen',
      mechanism: 'Urahnen streckten zeitlebens ihren Hals nach immer höheren Akazienblättern. Durch ständiges Dehnen verlängerte sich der Hals um wenige Zentimeter. Diese erworbene Verlängerung wurde an die Kälber weitervererbt.',
      fallacy: 'Denkfehler: Wenn ein Mensch zeitlebens Bodybuilding betreibt, werden seine Babys nicht mit trainierten Muskeln geboren!'
    },
    darwinView: {
      coreIdea: 'Variabilität + Überlebensvorteil bei Nahrungsknappheit',
      mechanism: 'In der Ur-Giraffenpopulation gab es durch Rekombination und Mutation eine natürliche Variabilität der Halslängen. In Dürrezeiten erreichten Tiere mit geringfügig längeren Hälsen noch Baumkronen, verhungerten seltener und hinterließen mehr Nachkommen.',
      evidence: 'Fossilfunde zeigen schrittweise Verlängerung über Millionen Jahre; außerdem dient der Hals heute auch dem Kampf der Männchen (sexuelle Selektion).'
    }
  },
  {
    id: 'cave',
    title: 'Rückbildung der Augen bei Höhlenfischen',
    organism: 'Astyanax mexicanus (Höhlensalmler)',
    question: 'Warum verloren Höhlenfische in stockdunklen Höhlensystemen ihre funktionsfähigen Augen?',
    lamarckView: {
      coreIdea: 'Nichtgebrauch führt zur Verkümmerung',
      mechanism: 'Weil die Fische im Dunkeln ihre Augen nicht benutzten, bildeten sie sich im Laufe des Lebens zurück. Die erworbene Blindheit vererbte sich an die Nachfahren.',
      fallacy: 'Denkfehler: Nichtgebrauch schaltet nicht gezielt Gene in den Keimzellen aus.'
    },
    darwinView: {
      coreIdea: 'Wegfall des Selektionsdrucks & Energieersparnis',
      mechanism: 'Im Dunkeln boten Augen keinen Vorteil mehr (Selektionsneutralität). Zufällige Mutationen, die das Auge beschädigten, wurden nicht mehr ausgemerzt. Zudem verbraucht ein Auge ca. 15 % der Gesamtenergie des Gehirns – blinde Fische sparten enorm Energie und hatten in nährstoffarmen Höhlen höhere Fitness!',
      evidence: 'Mehrere unabhängige Höhlenpopulationen zeigen jeweils andere Mutationen in verschiedenen Augen-Genen (konvergente Evolution).'
    }
  },
  {
    id: 'bacteria',
    title: 'Antibiotika-Resistenz bei Bakterien',
    organism: 'Staphylococcus aureus / E. coli',
    question: 'Warum wirken Antibiotika nach einiger Zeit oft nicht mehr gegen bakterielle Infektionen?',
    lamarckView: {
      coreIdea: 'Reaktive Anpassung an das Gift',
      mechanism: 'Bakterien spüren das Antibiotikum, lernen sich dagegen zu wehren und bauen aktiv Abwehrmechanismen auf, um nicht zu sterben.',
      fallacy: 'Denkfehler: Bakterien können nicht "wollen" oder "lernen". Das Gift tötet nicht-resistente Bakterien sofort ab, bevor sie etwas "entwickeln" könnten.'
    },
    darwinView: {
      coreIdea: 'Vorhandene Spontanmutationen werden selektiert',
      mechanism: 'In einer Kultur von 1 Milliarde Bakterien existieren durch Kopierfehler der DNA immer schon 2–3 Zellen mit zufälliger Resistenz. Gibt der Arzt das Antibiotikum, sterben 99,99 % der Bakterien. Nur die zufällig resistenten Mutanten überleben, vermehren sich explosionsartig und bilden die neue resistente Population.',
      evidence: 'Luria-Delbrück-Fluktuationstest (1943, Nobelpreis): Mutationen entstehen nachweisbar VOR dem Kontakt mit dem Selektionsmittel!'
    }
  }
];

export interface TeleologyExercise {
  id: number;
  flawedStatement: string;
  flawExplanation: string;
  correctOptions: {
    text: string;
    isCorrect: boolean;
    reason: string;
  }[];
}

export const TELEOLOGY_EXERCISES: TeleologyExercise[] = [
  {
    id: 1,
    flawedStatement: '„Die Mäuse haben ihr Fell dunkel gefärbt, DAMIT sie auf der schwarzen Lava nicht von der Eule entdeckt werden.“',
    flawExplanation: 'Typische Teleologie-Falle: „DAMIT“ unterstellt eine bewusste Absicht oder ein Ziel. Mäuse können ihre Fellfarbe nicht willentlich anpassen.',
    correctOptions: [
      {
        text: 'Mäuse mit zufällig dunklerem Fell hatten auf der dunklen Lava einen Selektionsvorteil, überlebten häufiger und vererbten ihre dunklen Allele an mehr Nachkommen.',
        isCorrect: true,
        reason: 'Exakt nach Darwin: Zufällige genetische Variabilität VORAB, Umwelt selektiert NACHHER über differentielle Fitness.'
      },
      {
        text: 'Die Mäuse brauchten Schutz vor der Eule, weshalb das Erbgut reagierte und dunkle Pigmente bildete.',
        isCorrect: false,
        reason: 'Falsch: Das Erbgut "spürt" keine Bedürfnisse und mutiert niemals zielgerichtet.'
      },
      {
        text: 'Weil die Eule Hunger hatte, färbten sich die Mäuse dunkel, um der Eule das Jagen schwerer zu machen.',
        isCorrect: false,
        reason: 'Falsch: Das ist doppelt teleologisch und vermenschlicht biologische Prozesse.'
      }
    ]
  },
  {
    id: 2,
    flawedStatement: '„Die Giraffen streckten ihre Hälse immer länger, UM an die saftigen Blätter in den Baumkronen heranzukommen.“',
    flawExplanation: 'Die Formulierung „UM ZU“ suggeriert, dass die Dehnung während des Lebens die Ursache für die evolutionäre Veränderung der Art war (Lamarck-Irrtum).',
    correctOptions: [
      {
        text: 'Durch ständiges Strecken wuchs der Hals bei jedem Tier, und diese Dehnung übertrugen die Eltern auf die Erbanlagen der Nachkommen.',
        isCorrect: false,
        reason: 'Das ist die widerlegte Lamarck-Hypothese der Vererbung erworbener Eigenschaften.'
      },
      {
        text: 'Individuen mit genetisch bedingt längeren Hälsen hatten in Dürrezeiten besseren Zugang zu Blättern, litten seltener an Nahrungsmangel und erzielten eine höhere Fortpflanzungsrate.',
        isCorrect: true,
        reason: 'Perfekt formuliert! Unterschiedlicher Fortpflanzungserfolg (Fitness) aufgrund erblicher Unterschiede.'
      },
      {
        text: 'Die Bäume wuchsen absichtlich höher, damit die Giraffen sich mehr anstrengen mussten.',
        isCorrect: false,
        reason: 'Absurde Teleologie.'
      }
    ]
  },
  {
    id: 3,
    flawedStatement: '„Bakterien entwickeln Resistenzen, WEIL sie das Antibiotikum überleben wollen.“',
    flawExplanation: 'Bakterien haben weder ein Gehirn noch Wünsche. Die Selektion wirkt passiv von außen.',
    correctOptions: [
      {
        text: 'Zufällige Mutationen im Genom einzelner Bakterien ermöglichten das Überleben bei Gabe des Antibiotikums, während nicht-resistente Bakterien starben; die Resistenten vermehrten sich selektiv.',
        isCorrect: true,
        reason: 'Präzise biologische Formulierung des Selektionsmechanismus.'
      },
      {
        text: 'Das Antibiotikum regt die Bakterien an, einen Schutzschild aufzubauen, den sie an die nächste Generation vererben.',
        isCorrect: false,
        reason: 'Falsch: Antibiotika töten Bakterien, sie regen keine zielgerichteten Mutationen an.'
      },
      {
        text: 'Die Bakterien tauschten sich aus und beschlossen, gemeinsam immun gegen das Medikament zu werden.',
        isCorrect: false,
        reason: 'Falsch: Anthropomorphismus (Vermenschlichung).'
      }
    ]
  }
];

export interface SpeciationStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  geneFlow: string;
  mechanism: string;
  badge: string;
}

export const SPECIATION_STEPS: SpeciationStep[] = [
  {
    stepNumber: 1,
    title: 'Ausgangspopulation im gemeinsamen Habitat',
    subtitle: 'Einheitlicher Genpool',
    description: 'Eine zusammenhängende Population von Taschenmäusen lebt in einem einheitlichen Lebensraum. Alle Tiere können sich untereinander uneingeschränkt paaren.',
    geneFlow: 'Ungehindert (m = 1,0) – Allele verteilen sich homogen.',
    mechanism: 'Stabilisierende Selektion, keine Artbildung.',
    badge: 'Panmixie'
  },
  {
    stepNumber: 2,
    title: 'Geographische Isolation (Separation)',
    subtitle: 'Räumliche Barriere entsteht',
    description: 'Ein geologisches Ereignis (z. B. Entstehung eines tiefen Canyons, Flussdurchbruch, Lavastrom, Kontinentaldrift) spaltet das Verbreitungsgebiet in zwei getrennte Areale (A und B).',
    geneFlow: 'Vollständig unterbrochen (m = 0,0) – Kein genetischer Austausch mehr möglich!',
    mechanism: 'Physische Barriere trennt den Genpool in zwei Hälften.',
    badge: 'Separation'
  },
  {
    stepNumber: 3,
    title: 'Unabhängige Evolution in Teilpopulationen',
    subtitle: 'Divergenz durch Mutation & Selektion',
    description: 'In beiden Gebieten herrschen unterschiedliche Umweltbedingungen (z. B. A: dunkler Vulkanboden, heiß; B: heller Sandstein, kalt). Unabhängig voneinander treten zufällige Mutationen auf. Unterschiedliche Selektionsdrücke und Gendrift verändern die Allelfrequenzen beider Genpools.',
    geneFlow: 'Weiterhin null (m = 0,0).',
    mechanism: 'Gerichtete Selektion in unterschiedliche Richtungen + Rekombination + Mutation.',
    badge: 'Divergenz'
  },
  {
    stepNumber: 4,
    title: 'Entstehung von Isolationsmechanismen',
    subtitle: 'Prä- und postzygotische Barrieren',
    description: 'Durch die lange getrennte Evolution verändern sich nicht nur Fellfarben, sondern auch Verhaltensweisen (z. B. Paarungsrufe, Duftmarken/Pheromone, Paarungszeiten) und Chromosomenstrukturen.',
    geneFlow: 'Biologisch blockiert.',
    mechanism: 'Präzygotisch (z. B. ethologische Isolation) oder postzygotisch (Hybridsterilität).',
    badge: 'Isolation'
  },
  {
    stepNumber: 5,
    title: 'Sekundärer Kontakt & Biospezies',
    subtitle: 'Artbildung vollendet',
    description: 'Fällt die geographische Barriere weg (Canyon verlandet, Fluss trocknet aus), treffen die Tiere wieder aufeinander. Da sie sich nicht mehr erfolgreich miteinander fortpflanzen können, existieren nun ZWEI ECHTE ARTEN (Biospezies) nebeneinander!',
    geneFlow: 'Dauerhaft unterbunden trotz räumlicher Überlappung (Sympatrie).',
    mechanism: 'Reproduktive Isolation sichert die genetische Eigenständigkeit beider Arten.',
    badge: 'Neue Art!'
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
    question: 'Worin liegt der fundamentale biologische Denkfehler der Evolutionstheorie von Jean-Baptiste de Lamarck?',
    context: 'Lamarckismus vs. Darwinismus (LehrplanPLUS B9 3)',
    options: [
      {
        text: 'Lamarck nahm an, dass Arten unveränderlich seien und seit der Schöpfung exakt gleich blieben.',
        isCorrect: false,
        feedback: 'Falsch. Das war die Artkonstanz von Carl von Linné und Georges Cuvier. Lamarck war einer der ersten, der erkannte, dass sich Arten überhaupt verändern!'
      },
      {
        text: 'Lamarck behauptete, dass während des Lebens erworbene Eigenschaften (Modifikationen durch Gebrauch/Nichtgebrauch) an die Nachkommen vererbt werden können. Dies widerspricht der Genetik (Weismann-Barriere).',
        isCorrect: true,
        feedback: 'Hervorragend! Veränderungen an Körperzellen (Soma) wie trainierte Muskeln oder rußgefärbtes Fell verändern nicht die DNA der Keimbahn (Spermien/Eizellen).'
      },
      {
        text: 'Lamarck glaubte, dass Dinosaurier durch Meteoriteneinschläge ausgestorben sind.',
        isCorrect: false,
        feedback: 'Falsch. Die Meteoriten-Hypothese stammt aus der modernen Paläontologie des 20. Jahrhunderts.'
      },
      {
        text: 'Lamarck behauptete, dass nur der Stärkste im Kampf ums Dasein überlebt („Survival of the Fittest“).',
        isCorrect: false,
        feedback: 'Falsch. Der Begriff „Survival of the Fittest“ stammt von Herbert Spencer und wurde von Darwin übernommen, nicht von Lamarck.'
      }
    ],
    misconceptionAlert: 'Merke: Modifikation = nicht erblich (Phänotyp ändert sich, Genotyp bleibt gleich). Mutation = erblich (Änderung im Genotyp).',
    curriculumBadge: 'Evolutionstheorien'
  },
  {
    id: 2,
    question: 'Auf dem schwarzen Lavagestein des Valley of Fires (New Mexico) besitzen fast alle Felsentaschenmäuse pechschwarzes Fell, auf dem nahen Sandboden jedoch sandfarbenes. Wie erklärt die moderne Selektionstheorie (Darwinismus) diesen Sachverhalt?',
    context: 'Selektionsmechanismus & Variabilität',
    options: [
      {
        text: 'Die Mäuse wanderten auf die Lava und fraßen schwarze Mineralien, wodurch ihr Fell allmählich schwarz wurde.',
        isCorrect: false,
        feedback: 'Falsch. Ernährung verändert bei diesen Säugetieren nicht dauerhaft die genetische Melaninproduktion des Fells.'
      },
      {
        text: 'Die schwarze Lava strahlte starke Hitze ab, die das Genom aller Mäuse gleichzeitig und zielgerichtet ins Dunkle mutieren ließ.',
        isCorrect: false,
        feedback: 'Falsch. Mutationen sind stets zufällig und ungerichtet; Hitze erzeugt keine maßgeschneiderten Tarnfarben-Gene.'
      },
      {
        text: 'Durch ungerichtete Spontanmutationen traten vorab vereinzelt dunkle Tiere auf. Auf dem Basalt wurden helle Mäuse von Eulen leicht erbeutet; die dunklen überlebten häufiger und vererbten ihre vorteilhaften Allele (differentielle Fitness).',
        isCorrect: true,
        feedback: 'Brillant! Genau das ist der darwinistische Kern: Variabilität VORAB durch Mutation, Selektion NACHHER durch die Umwelt!'
      },
      {
        text: 'Die Eulen jagten absichtlich nur helle Mäuse, um den dunklen Mäusen eine Chance zu geben, sich zu vermehren.',
        isCorrect: false,
        feedback: 'Falsch. Räuber jagen instinktiv das, was sie am schnellsten sehen und schlagen können (Beute-Kontrast).'
      }
    ],
    misconceptionAlert: 'Ungerichtete Mutation erzeugt die Varianten; die Umwelt wählt nur aus (Selektion)!',
    curriculumBadge: 'Selektion & Fitness'
  },
  {
    id: 3,
    question: 'Was versteht die moderne Evolutionsbiologie unter dem Begriff „Reproduktive Fitness“ (Tauglichkeit)?',
    context: 'Grundbegriffe der Populationsgenetik',
    options: [
      {
        text: 'Den relativen Fortpflanzungserfolg eines Individuums – also wie viele fruchtbare Nachkommen es im Vergleich zu Artgenossen zur nächsten Generation beiträgt.',
        isCorrect: true,
        feedback: 'Absolut meisterhaft! „Fit“ bedeutet in der Biologie nicht sportlich oder muskulös, sondern optimal angepasst an die Umweltbedingungen für maximalen Fortpflanzungserfolg.'
      },
      {
        text: 'Die körperliche Muskelkraft, Schnelligkeit und Kampffähigkeit eines Tieres gegenüber Feinden.',
        isCorrect: false,
        feedback: 'Falsch. Ein extrem starker Stier, der keine Nachkommen zeugt, hat eine biologische Fitness von genau 0!'
      },
      {
        text: 'Das maximale Lebensalter, das ein Organismus in Gefangenschaft erreichen kann.',
        isCorrect: false,
        feedback: 'Falsch. Ein hohes Alter nützt evolutionär nichts, wenn keine Nachkommen gezeugt werden.'
      },
      {
        text: 'Die Fähigkeit eines Tieres, sich jeder beliebigen Umwelt sofort fehlerfrei anzupassen.',
        isCorrect: false,
        feedback: 'Falsch. Individuen können sich genetisch nicht beliebig verwandeln.'
      }
    ],
    misconceptionAlert: 'Fitness = Anzahl fruchtbarer Nachkommen! Nicht: Wer stemmt die schwersten Gewichte.',
    curriculumBadge: 'Fitness-Begriff'
  },
  {
    id: 4,
    question: 'Welches Ereignis muss bei der allopatrischen Artbildung zwingend als Erstes stattfinden, damit sich zwei neue Arten bilden können?',
    context: 'Mechanismen der Artbildung',
    options: [
      {
        text: 'Alle Fressfeinde im Gebiet müssen vollständig aussterben.',
        isCorrect: false,
        feedback: 'Falsch. Fressfeinde üben Selektionsdruck aus, ihr Aussterben ist keine Voraussetzung für allopatrische Artbildung.'
      },
      {
        text: 'Die Tiere müssen beschließen, getrennte Wege zu gehen und nicht mehr miteinander zu reden.',
        isCorrect: false,
        feedback: 'Falsch. Tiere treffen keine solchen Beschlüsse; Artbildung ist kein bewusster Akt.'
      },
      {
        text: 'Es muss sofort eine Genmutation auftreten, die alle Tiere unfruchtbar macht.',
        isCorrect: false,
        feedback: 'Falsch. Eine solche Mutation würde sofort aussterben, da sich die Träger nicht vermehren könnten.'
      },
      {
        text: 'Eine geographische Barriere (Separation durch Canyon, Fluss, Gebirge, Meer) muss den Genfluss zwischen zwei Teilpopulationen vollständig unterbrechen.',
        isCorrect: true,
        feedback: 'Hervorragend! „Allos“ = fremd, „patris“ = Vaterland/Heimat. Ohne Unterbrechung des Genflusses würde ständige Durchmischung die Ausbildung separater Arten verhindern.'
      }
    ],
    misconceptionAlert: 'Allopatrisch beginnt IMMER mit geographischer Trennung (Separation)!',
    curriculumBadge: 'Artbildung'
  },
  {
    id: 5,
    question: 'Zwei Finkenarten leben im selben Waldgebiet, paaren sich aber nie, weil die Männchen beider Arten völlig unterschiedliche Gesangsstrophen singen. Um welche Form der Isolation handelt es sich?',
    context: 'Isolationsmechanismen',
    options: [
      {
        text: 'Mechanische Isolation (die Begattungsorgane passen anatomisch nicht zusammen).',
        isCorrect: false,
        feedback: 'Falsch. Die Organe würden anatomisch passen, aber die Paarung scheitert schon am Verhalten.'
      },
      {
        text: 'Postzygotische Isolation (die Nachkommen sterben im Ei ab oder sind steril).',
        isCorrect: false,
        feedback: 'Falsch. Postzygotisch wirkt erst NACH der Befruchtung (Zygote). Hier kommt es gar nicht erst zur Paarung!'
      },
      {
        text: 'Präzygotische Isolation, genauer: Ethologische Isolation (Verhaltensisolation durch artspezifische Balzsignale).',
        isCorrect: true,
        feedback: 'Perfekt! Da die Weibchen nur auf den Gesang ihrer eigenen Art reagieren, wird die Bildung einer Zygote bereits VOR der Befruchtung (präzygotisch) verhindert.'
      },
      {
        text: 'Geographische Isolation, da Vögel in verschiedenen Baumkronenhöhen nisten.',
        isCorrect: false,
        feedback: 'Falsch. Sie leben im selben Gebiet (Sympatrie); die Barriere ist biologisch/ethologisch, nicht geographisch.'
      }
    ],
    misconceptionAlert: 'Präzygotisch = VOR der Befruchtung (Balz, Zeit, Organe). Postzygotisch = NACH der Befruchtung (steril, lebensunfähig).',
    curriculumBadge: 'Isolationsmechanismen'
  },
  {
    id: 6,
    question: 'In einer Population wirken drei verschiedene Selektionsformen. Wenn bei einer Schmetterlingsart sowohl sehr helle als auch sehr dunkle Individuen auf geflecktem Untergrund überleben, die mittelbraunen aber gefressen werden, spricht man von:',
    context: 'Selektionstypen im Vergleich',
    options: [
      {
        text: 'Gerichteter Selektion (Verschiebung des Mittelwerts in genau eine Richtung).',
        isCorrect: false,
        feedback: 'Falsch. Gerichtete Selektion begünstigt nur EIN Extrem (z. B. nur dunkel).'
      },
      {
        text: 'Disruptiver Selektion (Spaltungsselektion, die beide Extreme begünstigt und die mittlere Form benachteiligt).',
        isCorrect: true,
        feedback: 'Richtig! Disruptive Selektion spaltet die Häufigkeitsverteilung in zwei Gipfel auf und kann langfristig zur Artbildung führen.'
      },
      {
        text: 'Stabilisierender Selektion (Aussortieren beider Extreme zugunsten des Mittelwerts).',
        isCorrect: false,
        feedback: 'Falsch. Bei stabilisierender Selektion würde genau die mittlere Form überleben und die Extreme würden verschwinden.'
      },
      {
        text: 'Sexueller Selektion (Auswahl des Partners anhand von Schmuckfedern).',
        isCorrect: false,
        feedback: 'Falsch. Hier geht es um Tarnung vor Fressfeinden (natürliche Selektion), nicht um Partnerwahl.'
      }
    ],
    misconceptionAlert: 'Gerichtet = 1 Extrem gewinnt. Stabilisierend = Mitte gewinnt. Disruptiv = Beide Extreme gewinnen, Mitte verliert!',
    curriculumBadge: 'Selektionstypen'
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
    term: 'Allel',
    pronunciation: '[aˈleːl]',
    definition: 'Zustandsform oder Variante eines Gens, die für ein bestimmtes Merkmal (z. B. Enzymaktivität bei der Melaninbildung) codiert.',
    curriculumContext: 'Genetik & Evolution 9',
    example: 'Das Allel D führt zu starker Melanin-Synthese (dunkles Fell), das Allel d zu geringer Pigmentierung (helles Fell).'
  },
  {
    term: 'Allelfrequenz',
    pronunciation: '[aˈleːl-freˈkvɛnt͡s]',
    definition: 'Die relative Häufigkeit eines bestimmten Allels in einem Genpool einer Population (Wert zwischen 0,0 und 1,0 bzw. 0 % und 100 %).',
    curriculumContext: 'Populationsgenetik',
    example: 'Auf Sand beträgt die Frequenz des Allels D für dunkles Fell nur 0,01 (1 %), auf Basalt nach 50 Generationen 0,98 (98 %).'
  },
  {
    term: 'Allopatrische Artbildung',
    pronunciation: '[aloˈpaːtrɪʃ]',
    definition: 'Artbildung, die durch die räumliche Trennung (geographische Isolation / Separation) einer Ausgangspopulation in mindestens zwei Teilpopulationen eingeleitet wird.',
    curriculumContext: 'Artbildung B9 3',
    example: 'Entstehung der Darwinfinken auf verschiedenen Galapagosinseln oder von Eichhörnchenarten an den Rändern des Grand Canyon.'
  },
  {
    term: 'Darwinismus',
    definition: 'Die von Charles Darwin begründete Selektionstheorie: Ungerichtete Variabilität entsteht vorab durch Mutation & Rekombination; die Umwelt wählt über die natürliche Selektion die am besten angepassten Träger aus.',
    curriculumContext: 'Evolutionstheorien',
    example: 'Nicht die Giraffe dehnt ihren Hals aktiv, sondern Vorfahren mit erblich längeren Hälsen hatten höhere Überlebenschancen.'
  },
  {
    term: 'Disruptive Selektion (Spaltende Selektion)',
    definition: 'Selektionsform, bei der Individuen mit extremen Merkmalsausprägungen zu beiden Seiten des Mittelwerts gegenüber Individuen mit mittleren Merkmalen im Vorteil sind.',
    curriculumContext: 'Selektionstypen',
    example: 'Vögel mit sehr großen Schnäbeln knacken dicke Nüsse, solche mit feinen Schnäbeln fangen Insekten; Vögel mit mittleren Schnäbeln sind bei beidem ineffizient.'
  },
  {
    term: 'Fitness (Reproduktive Fitness)',
    definition: 'Maß für den Fortpflanzungserfolg eines Individuums. Gemessen an der Anzahl fruchtbarer Nachkommen, die das Individuum im Vergleich zu Artgenossen zur nächsten Generation beiträgt.',
    curriculumContext: 'Selektionstheorie',
    example: 'Eine gut getarnte Maus zeugt im Schnitt 12 überlebende Junge, eine auffällige nur 2. Die gut getarnte Maus besitzt eine sechsfach höhere Fitness.'
  },
  {
    term: 'Gendrift',
    definition: 'Zufällige, nicht durch Selektion bedingte Veränderung der Allelfrequenzen im Genpool einer Population (besonders wirksam in kleinen Populationen, z. B. nach Katastrophen oder Gründerereignissen).',
    curriculumContext: 'Evolutionsfaktoren',
    example: 'Ein Erdrutsch verschüttet zufällig 80 % der dunklen Mäuse, unabhängig von ihrer Fitness.'
  },
  {
    term: 'Gerichtete Selektion (Transformierende Selektion)',
    definition: 'Selektionsform, bei der sich der Mittelwert eines Merkmals in der Population im Laufe der Zeit in eine bestimmte Richtung verschiebt, weil ein Extremwert begünstigt wird.',
    curriculumContext: 'Selektionstypen',
    example: 'Verschiebung der Fellfarbe von Hell nach Schwarz nach einem Vulkanausbruch.'
  },
  {
    term: 'Lamarckismus',
    definition: 'Historische Hypothese von J.-B. de Lamarck: Organismen verändern ihre Organe durch zielgerichteten Gebrauch oder Nichtgebrauch und vererben diese erworbenen Eigenschaften an Nachkommen (wissenschaftlich widerlegt).',
    curriculumContext: 'Wissenschaftsgeschichte',
    example: 'Die Vorstellung, dass Giraffen durch ständiges Halsstrecken längere Hälse an ihre Kälber weitervererben.'
  },
  {
    term: 'Modifikation',
    definition: 'Umweltbedingte, nicht-erbliche Veränderung des Phänotyps innerhalb der genetisch vorgegebenen Reaktionsbreite (verändert nicht das Genom in den Keimzellen).',
    curriculumContext: 'Genetik & Umwelt',
    example: 'Bräunung der Haut durch Sonnenstrahlung oder Verfärbung des Fells durch Ruß.'
  },
  {
    term: 'Reproduktive Isolation',
    definition: 'Fortpflanzungsbarriere zwischen Individuen zweier Populationen, die einen erfolgreichen Genfluss verhindert (Kriterium für getrennte biologische Arten / Biospezies).',
    curriculumContext: 'Artbegriff B9 3',
    example: 'Unterschiedliche Balzgesänge (präzygotisch) oder sterile Nachkommen wie das Maultier (postzygotisch).'
  }
];
