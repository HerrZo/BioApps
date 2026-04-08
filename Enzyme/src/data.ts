export const TOPICS_DATA = {
  chapters: [
    { id: 'history',    title: 'Geschichte der Enzyme', icon: '📜', shortTitle: 'Geschichte' },
    { id: 'structure',  title: 'Aufbau der Enzyme',     icon: '🧬', shortTitle: 'Aufbau' },
    { id: 'mechanism',  title: 'Wirkweise der Enzyme',  icon: '⚙️', shortTitle: 'Wirkweise' },
    { id: 'energy',     title: 'Energetik',             icon: '⚡', shortTitle: 'Energetik' },
    { id: 'factors',    title: 'Einflussfaktoren',      icon: '📊', shortTitle: 'Einflussfaktoren' },
    { id: 'minigame',   title: 'Bio-Challenge',         icon: '🏆', shortTitle: 'Challenge' }
  ],

  history: [
    { year: '1752', text: 'Verdauung gilt als rein mechanischer Vorgang', detail: 'Man dachte, der Magen zerkleinere Nahrung nur durch Muskelkraft – ähnlich einer Mühle.' },
    { year: '1783', text: 'Magensaft reicht aus, um Fleisch zu verflüssigen', detail: 'Experiment mit Magensaft von Greifvögeln zeigt: Eine chemische Komponente ist beteiligt.' },
    { year: '1831', text: 'Mundspeichel „verzuckert" Stärke', detail: 'Speichel kann Stärke in Zucker umwandeln – ein Hinweis auf chemische Katalysatoren im Körper.' },
    { year: '1835', text: 'Zuckerspaltung ist eine chemische Reaktion', detail: 'Es handelt sich nicht um eine bloße Stofftrennung, sondern um eine echte chemische Umwandlung.' },
    { year: '1837', text: 'Hefe ist ein Mikroorganismus', detail: 'Hefe besteht aus winzigen, mit dem bloßen Auge nicht sichtbaren Lebewesen.' },
    { year: '1862', text: 'Fermentation funktioniert auch nach Tod der Mikroorganismen', detail: 'Pasteur zeigt: Die Gärung hängt mit Mikroorganismen zusammen, aber die Substanz bleibt auch nach deren Tod aktiv.' },
    { year: '1878', text: 'Begriff „Enzym" wird eingeführt', detail: 'Kühne prägt den Begriff aus dem Griechischen: en = in, zyme = Sauerteig/Hefe → „im Sauerteig".' },
    { year: '1890', text: 'Fischer: Schlüssel-Schloss-Prinzip', detail: 'Emil Fischer beschreibt: Enzym und Substrat passen wie Schlüssel und Schloss zusammen → Substratspezifität.' },
    { year: '1897', text: 'Buchner: Gärung ohne lebende Zellen', detail: 'Eduard Buchner zeigt: Alkoholische Gärung funktioniert auch mit zellfreiem Hefeextrakt → Enzyme sind die Ursache!' },
    { year: '1908', text: 'Röhm isoliert erstmals Enzyme', detail: 'Erste industrielle Isolation von Enzymen – Beginn der Enzymtechnologie.' },
    { year: '~1900er', text: 'Streit: Sind Enzyme Proteine?', detail: 'Große Debatte: Sind Enzyme selbst Proteine, oder transportieren Proteine nur die eigentlichen Wirkstoffe?' },
    { year: '1926', text: 'Sumner: Urease ist ein Protein', detail: 'James Sumner kristallisiert das Enzym Urease und weist nach, dass es ein Protein ist – Nobelpreis!' },
    { year: '1930', text: 'Northrop & Stanley bestätigen: Enzyme = Proteine', detail: 'Sie beweisen am Beispiel Pepsin endgültig: Enzyme bestehen aus Proteinen. Nobelpreis 1946.' }
  ],

  structures: [
    { id: 'primary', title: 'Primärstruktur', subtitle: 'Aminosäuresequenz', desc: 'Die lineare Abfolge der Aminosäuren, verbunden durch Peptidbindungen. Sie bestimmt alle weiteren Strukturebenen.', color: '#16a34a' },
    { id: 'secondary', title: 'Sekundärstruktur', subtitle: 'α-Helix & β-Faltblatt', desc: 'Regelmäßige, lokale Faltungsmuster durch Wasserstoffbrücken zwischen benachbarten Aminosäuren.', color: '#0ea5e9' },
    { id: 'tertiary', title: 'Tertiärstruktur', subtitle: '3D-Faltung', desc: 'Die vollständige dreidimensionale Raumstruktur eines Proteins, stabilisiert durch verschiedene Wechselwirkungen (Disulfidbrücken, hydrophobe WW, Ionenbindungen).', color: '#8b5cf6' },
    { id: 'quaternary', title: 'Quartärstruktur', subtitle: 'Untereinheiten', desc: 'Zusammenlagerung mehrerer Polypeptidketten (Untereinheiten) zu einem funktionellen Proteinkomplex, z.B. Hämoglobin aus 4 Untereinheiten.', color: '#f59e0b' }
  ],

  mechanismSteps: [
    { id: 'step1', title: 'Substrat nähert sich', desc: 'Das Substrat bewegt sich zum aktiven Zentrum des Enzyms und wird durch seine komplementäre Form angezogen.' },
    { id: 'step2', title: 'Enzym-Substrat-Komplex', desc: 'Das Substrat bindet an das aktive Zentrum – es entsteht der Enzym-Substrat-Komplex (nach dem Schlüssel-Schloss-Prinzip).' },
    { id: 'step3', title: 'Katalyse / Umsetzung', desc: 'Das Enzym senkt die Aktivierungsenergie und wandelt das Substrat in die Produkte um.' },
    { id: 'step4', title: 'Produkte werden freigesetzt', desc: 'Die Produkte lösen sich vom Enzym ab. Das aktive Zentrum ist wieder frei für ein neues Substrat.' }
  ],

  quizQuestions: [
    { q: 'Was bedeutet der Begriff "Enzym"?', options: ['Im Sauerteig/Hefe', 'Schneller Stoff', 'Verdauungshelfer', 'Zellbaustein'], correct: 0, explanation: 'Der Begriff kommt aus dem Griechischen: en = in, zyme = Sauerteig/Hefe.' },
    { q: 'Was beschreibt die Substratspezifität?', options: ['Enzyme können alle Substrate umsetzen', 'Jedes Enzym setzt nur bestimmte Substrate um', 'Substrate wählen ihr Enzym aus', 'Enzyme verändern ihre Form beliebig'], correct: 1, explanation: 'Wie ein Schlüssel nur in ein bestimmtes Schloss passt, setzt jedes Enzym nur bestimmte Substrate um (Schlüssel-Schloss-Prinzip nach Fischer).' },
    { q: 'Woraus bestehen Enzyme?', options: ['Aus Fetten', 'Aus Kohlenhydraten', 'Aus Proteinen (Aminosäuren)', 'Aus Nukleinsäuren'], correct: 2, explanation: 'Sumner (1926) wies nach, dass das Enzym Urease ein Protein ist. Enzyme bestehen aus Aminosäureketten.' },
    { q: 'Was bewirkt ein Enzym als Biokatalysator?', options: ['Es erhöht die Aktivierungsenergie', 'Es senkt die Aktivierungsenergie', 'Es verändert die Reaktionsenergie', 'Es erzeugt neue Energie'], correct: 1, explanation: 'Enzyme senken die Aktivierungsenergie einer Reaktion, ohne selbst verbraucht zu werden.' },
    { q: 'Was passiert bei Denaturierung eines Enzyms?', options: ['Es wird stärker', 'Die 3D-Struktur wird zerstört', 'Es verdoppelt sich', 'Nichts Besonderes'], correct: 1, explanation: 'Bei hohen Temperaturen oder extremem pH-Wert wird die Tertiärstruktur zerstört und das aktive Zentrum verliert seine Form.' },
    { q: 'Was ist das Optimum bei der Temperaturabhängigkeit?', options: ['Die niedrigste Temperatur', 'Die höchste Temperatur', 'Die Temperatur mit maximaler Aktivität', 'Raumtemperatur immer'], correct: 2, explanation: 'Am Temperaturoptimum arbeitet das Enzym am schnellsten. Darüber wird es denaturiert.' },
    { q: 'Wer formulierte das Schlüssel-Schloss-Prinzip?', options: ['Buchner', 'Sumner', 'Emil Fischer', 'Pasteur'], correct: 2, explanation: 'Emil Fischer beschrieb 1890, dass Enzym und Substrat sich wie Schlüssel und Schloss verhalten.' },
    { q: 'Was entsteht, wenn das Substrat an das Enzym bindet?', options: ['Ein Produkt-Enzym-Komplex', 'Ein Enzym-Substrat-Komplex', 'Ein Enzym-Inhibitor-Komplex', 'Eine kovalente Bindung'], correct: 1, explanation: 'Wenn das Substrat an das aktive Zentrum bindet, entsteht vorübergehend ein Enzym-Substrat-Komplex (E+S → ES → E+P).' },
    { q: 'Wie wirkt eine hohe Substratkonzentration?', options: ['linear steigend, unbegrenzt', 'Sättigungskinetik: erst schnell, dann Plateau', 'Gar nicht', 'Hemmend'], correct: 1, explanation: 'Bei steigender Substratkonzentration sind irgendwann alle Enzyme besetzt → Sättigung (Vmax).' },
    { q: 'Welche Strukturebene ist für die Funktion des aktiven Zentrums entscheidend?', options: ['Primärstruktur', 'Sekundärstruktur', 'Tertiärstruktur', 'Keine davon'], correct: 2, explanation: 'Die Tertiärstruktur formt die 3D-Gestalt und damit das aktive Zentrum, in das das Substrat passt.' }
  ]
};