
    import React, { useState, useEffect, useMemo, useRef } from 'react';

    /* ── icons ── */
    const IconDNA = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c0-4 4-8 10-8s10 4 10 8-4 8-10 8-10-4-10-8z"/>
            <path d="M12 4v16"/>
        </svg>
    );
    const IconCheck = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    );
    const IconX = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    );
    const IconBook = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    );
    const IconMicroscope = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/>
            <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
        </svg>
    );
    const IconChromosome = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3c0 4 4 5 4 9s-4 5-4 9"/><path d="M18 3c0 4-4 5-4 9s4 5 4 9"/>
            <path d="M4 12h4"/><path d="M16 12h4"/>
        </svg>
    );
    const IconTree = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L8 8H16L12 2Z"/><path d="M12 8V22"/><path d="M8 22H16"/>
            <path d="M9 14L5 10"/><path d="M15 14L19 10"/>
        </svg>
    );
    const IconStar = ({filled, className}) => (
        <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    );
    const IconHint = ({className}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
    );

    /* ── module registry ── */
    const MODULES = {
        KNOWLEDGE: 'Wissen',
        CELLCHECK: 'Zell-Check',
        DNAPACKER: 'DNA-Packer',
        DETECTIVE: 'Karyotyp-Detektive',
        STAMMBAUM: 'Stammbaum',
        QUIZ: 'Quiz'
    };

    /* ── data ── */
    const CELL_CHECK_DATA = [
        { id: 1, q: "Prokaryoten besitzen einen Zellkern.", a: false, exp: "Falsch. Prokaryoten (z.B. Bakterien) haben keinen membranumhüllten Zellkern." },
        { id: 2, q: "Plasmide sind kleine DNA-Ringe in Bakterien.", a: true, exp: "Richtig. Neben dem Hauptchromosom besitzen Bakterien oft kleine ringförmige DNA-Moleküle." },
        { id: 3, q: "Tierzellen gehören zu den Eukaryoten.", a: true, exp: "Richtig. Tiere, Pflanzen und Pilze sind Eukaryoten." },
        { id: 4, q: "Die DNA von Prokaryoten ist linear.", a: false, exp: "Falsch. Das Bakterienchromosom ist ringförmig geschlossen." },
        { id: 5, q: "Mitochondrien findet man in Procyten.", a: false, exp: "Falsch. Mitochondrien sind Organellen der Eucyten." },
        { id: 6, q: "Die Chromosomenanzahl in diploiden Körperzellen ist gerade.", a: true, exp: "Richtig. Da Chromosomen paarweise auftreten (2n), ist die Summe meist gerade." },
        { id: 7, q: "Je mehr Chromosomen, desto intelligenter.", a: false, exp: "Falsch. Die Natternzunge hat über 500 Chromosomen." },
        { id: 8, q: "Die Anzahl der Chromosomen ist artspezifisch.", a: true, exp: "Richtig. Jede Art hat eine charakteristische Anzahl." },
        { id: 9, q: "Alle Körperzellen enthalten den kompletten Chromosomensatz.", a: true, exp: "Richtig. Ausgenommen sind Keimzellen und rote Blutkörperchen." }
    ];

    const REFERENCE_TABLE = [
        { name: "Pferdespulwurm", count: 2 },
        { name: "Taufliege", count: 8 },
        { name: "Tomate", count: 24 },
        { name: "Katze", count: 38 },
        { name: "Mensch", count: 46 },
        { name: "Schimpanse", count: 48 },
        { name: "Hund", count: 78 },
        { name: "Amsel", count: 80 },
        { name: "Goldfisch", count: 94 },
        { name: "Natternzunge (Farn)", count: 520 },
    ];

    const DETECTIVE_CASES = [
        {
            id: 1,
            text: "Zelle mit 46 Chromosomen, Gonosomen XY.",
            correct: "Mensch (Mann)",
            options: ["Mensch (Mann)", "Mensch (Frau)", "Schimpanse", "Katze"],
            hint: "Gonosomen XY → männlich. Wie viele Chromosomen hat ein Mensch?"
        },
        {
            id: 2,
            text: "Zelle mit 48 Chromosomen.",
            correct: "Schimpanse",
            options: ["Mensch", "Gorilla", "Schimpanse", "Kartoffel"],
            hint: "Der Mensch hat 46 – unser nächster Verwandter hat 2 mehr."
        },
        {
            id: 3,
            text: "Zelle mit 8 Chromosomen.",
            correct: "Taufliege",
            options: ["Pferdespulwurm", "Taufliege", "Erbse", "Tomate"],
            hint: "Das Modellorganismus der Genetik – bekannt aus dem Labor."
        },
        {
            id: 4,
            text: "Zelle mit 46 Chromosomen, Gonosomen XX.",
            correct: "Mensch (Frau)",
            options: ["Mensch (Mann)", "Mensch (Frau)", "Schimpanse", "Goldfisch"],
            hint: "XX bedeutet weiblich. Anzahl = 46 passt zu welcher Art?"
        },
        {
            id: 5,
            text: "Rekordhalter mit 520 Chromosomen.",
            correct: "Natternzunge",
            options: ["Elefant", "Natternzunge", "Amsel", "Riesenmammutbaum"],
            hint: "Kein Tier – ein Farn mit unerreichter Chromosomenzahl."
        },
        {
            id: 6,
            text: "Zelle mit 38 Chromosomen.",
            correct: "Katze",
            options: ["Hund", "Katze", "Maus", "Löwe"],
            hint: "Hunde haben deutlich mehr. Katzen sind etwas näher am Menschen."
        },
        {
            id: 7,
            text: "Zelle mit 94 Chromosomen.",
            correct: "Goldfisch",
            options: ["Goldfisch", "Hund", "Amsel", "Tomate"],
            hint: "Fast 100 Chromosomen – ein beliebtes Haustier im Teich."
        },
        {
            id: 8,
            text: "Zelle mit 80 Chromosomen.",
            correct: "Amsel",
            options: ["Amsel", "Hund", "Goldfisch", "Schimpanse"],
            hint: "Ein Singvogel mit mehr Chromosomen als der Hund."
        },
        {
            id: 9,
            text: "Zelle mit 78 Chromosomen, Gonosomen XY.",
            correct: "Hund (Rüde)",
            options: ["Hund (Rüde)", "Hund (Hündin)", "Amsel", "Goldfisch"],
            hint: "XY = männlich. 78 Chromosomen gehören zu einem treuen Haustier."
        },
        {
            id: 10,
            text: "Zelle mit 2 Chromosomen.",
            correct: "Pferdespulwurm",
            options: ["Pferdespulwurm", "Bakterium", "Taufliege", "Virus"],
            hint: "Die kleinste bekannte Chromosomenzahl bei einem Tier – ein Parasit."
        },
    ];

    const QUIZ_DATA = [
        { q: "Was unterscheidet Eukaryoten von Prokaryoten?", options: ["Zellwand", "Zellkern", "DNA", "Ribosomen"], correct: 1 },
        { q: "Wie nennt man die verdichtete Form der DNA?", options: ["Arbeitsform", "Transportform", "Replikationsform", "Mutation"], correct: 1 },
        { q: "Wie viele Chromosomen hat ein Mensch?", options: ["23", "44", "46", "92"], correct: 2 },
        { q: "Was sind Histone?", options: ["Zucker", "Proteine", "Lipide", "Enzyme"], correct: 1 },
        { q: "Welches Geschlechtschromosomen-Paar hat ein Mann?", options: ["XX", "XY", "YY", "X0"], correct: 1 }
    ];

    const STAMMBAUM_CASES = [
        {
            id: 1,
            title: "Fall 1: Gleiche Chromosomenzahl",
            szenario: "Tier A (46 Chromosomen) und Tier B (46 Chromosomen) sollen sich fortpflanzen. Ist eine fruchtbare Nachkommenschaft möglich?",
            antwort: "ja",
            erklaerung: "Als Vereinfachung gilt: Gleiche Chromosomenzahl = Fortpflanzung möglich. (In der Realität kann die Chromosomenstruktur trotzdem abweichen – als 9.-Klässler merken wir uns: gleiche Anzahl ist ein gutes Zeichen.)",
            tipp: "Für die Zellteilung müssen sich homologe Chromosomen paaren. Gleiche Anzahl erleichtert das.",
            diagramm: { a: 46, b: 46, result: 46, sterile: false }
        },
        {
            id: 2,
            title: "Fall 2: Tetraploidie – neue Art?",
            szenario: "Eine Pflanze ist diploid (2n = 24). Durch einen Fehler bei der Zellteilung entsteht eine tetraploide Pflanze (4n = 48). Ist die neue Pflanze eine neue Art?",
            antwort: "ja",
            erklaerung: "Ja! Die tetraploide Pflanze (4n = 48) kann sich nicht mehr mit der Ausgangspflanze (2n = 24) fortpflanzen, weil die Chromosomenzahl verschieden ist. Reproduktive Isolation = neue Art. Dieses Phänomen nennt man Polyploidie und ist bei Nutzpflanzen (Weizen, Erdbeere) häufig.",
            tipp: "Kann die neue Pflanze (48 Chr.) noch mit der Ausgangspflanze (24 Chr.) fruchtbare Nachkommen zeugen?",
            diagramm: { a: 24, b: 48, result: 36, sterile: true, label: "tetraploid" }
        },
        {
            id: 3,
            title: "Fall 3: Das Maultier",
            szenario: "Pferd (2n = 64) und Esel (2n = 62) können sich paaren. Das Maultier hat 63 Chromosomen. Warum ist das Maultier unfruchtbar?",
            antwort: "unfruchtbar",
            erklaerung: "Das Maultier hat 63 Chromosomen – eine ungerade Zahl! Bei der Meiose (Bildung von Keimzellen) können sich die Chromosomen nicht mehr gleichmäßig auf zwei Tochterzellen aufteilen. Paarung ist unmöglich → Maultiere sind steril.",
            tipp: "Was passiert bei der Meiose, wenn man 63 Chromosomen gleichmäßig aufteilen will?",
            diagramm: { a: 64, b: 62, result: 63, sterile: true, label: "Maultier" }
        }
    ];

    /* ── helper ── */
    const StarRating = ({ score, total }) => {
        const pct = total > 0 ? score / total : 0;
        const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
        return (
            <div className="flex justify-center gap-1 my-3">
                {[1, 2, 3].map(s => (
                    <IconStar key={s} filled={s <= stars} className={`w-10 h-10 ${s <= stars ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
            </div>
        );
    };

    /* ── Header ── */
    const Header = ({ setModule }) => (
        <header className="bg-green-600 text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setModule(MODULES.KNOWLEDGE)}>
                    <IconDNA className="w-8 h-8" />
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">Genetik: Organisation & Zellen</h1>
                </div>
                <a href="../index.html" className="text-xs md:text-sm bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-full transition-colors font-medium border border-green-500">
                    Sammlung
                </a>
            </div>
        </header>
    );

    /* ── Navigation ── */
    const Navigation = ({ current, setModule }) => (
        <nav className="bg-white shadow-sm border-b border-green-100 overflow-x-auto">
            <div className="max-w-4xl mx-auto flex p-2 space-x-2 md:justify-center min-w-max">
                {Object.values(MODULES).map(mod => (
                    <button
                        key={mod}
                        onClick={() => setModule(mod)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${current === mod ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'}`}
                    >
                        {mod}
                    </button>
                ))}
            </div>
        </nav>
    );

    /* ── Maßstabs-Vergleich SVG ── */
    const ScaleSVG = ({ factor }) => {
        // factor: 0..10000
        const t = factor / 10000; // 0..1
        // thread thickness: 1px (loose) → 20px (chromosome)
        const threadW = 1 + t * 19;
        // thread color
        const r = Math.round(96 + t * 34);
        const g = Math.round(165 - t * 75);
        const b = Math.round(250 - t * 230);
        const strokeColor = `rgb(${r},${g},${b})`;

        // nucleus fill opacity grows with compaction
        const nucleusOpacity = 0.1 + t * 0.5;

        // show chromosome X-shape when >70%
        const showChrom = t > 0.7;
        const chromOpacity = Math.max(0, (t - 0.7) / 0.3);
        const threadOpacity = Math.max(0, 1 - (t * 2));

        return (
            <svg viewBox="0 0 340 180" className="w-full max-w-lg mx-auto rounded-xl bg-gray-900 border border-gray-700">
                {/* nucleus */}
                <ellipse cx="270" cy="90" rx="55" ry="55" fill={`rgba(34,197,94,${nucleusOpacity})`} stroke="#22c55e" strokeWidth="2"/>
                <text x="270" y="155" fill="#4ade80" fontSize="10" textAnchor="middle">Zellkern (6 µm)</text>

                {/* DNA thread (loose) */}
                {!showChrom && (
                    <g opacity={1 - t * 0.9}>
                        <path d="M10,60 Q40,30 70,60 T130,60 T190,60 T240,60 T270,70" fill="none" stroke={strokeColor} strokeWidth={threadW}/>
                        <path d="M10,80 Q40,110 70,80 T130,80 T190,80 T240,80 T270,90" fill="none" stroke={strokeColor} strokeWidth={threadW}/>
                        <path d="M10,100 Q40,70 70,100 T130,100 T190,100 T240,100 T270,110" fill="none" stroke={strokeColor} strokeWidth={Math.max(0.5, threadW * 0.7)}/>
                    </g>
                )}

                {/* folded chromosome inside nucleus */}
                <g style={{ opacity: chromOpacity, transition: 'opacity 0.2s' }}>
                    <path d="M252 65 L268 90 L252 115" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" fill="none"/>
                    <path d="M288 65 L272 90 L288 115" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" fill="none"/>
                    <circle cx="270" cy="90" r="7" fill="#15803d"/>
                </g>

                {/* scale labels */}
                <text x="120" y="22" fill="#94a3b8" fontSize="10" textAnchor="middle">DNA-Faden (2 m lang)</text>
                <line x1="10" x2="230" y1="28" y2="28" stroke="#64748b" strokeWidth="0.5" strokeDasharray="4"/>

                {/* arrow */}
                <text x="238" y="93" fill="#94a3b8" fontSize="11" textAnchor="middle">→</text>

                {/* factor label */}
                <text x="170" y="170" fill="#64748b" fontSize="9" textAnchor="middle">
                    Verdichtungsfaktor: ×{factor.toLocaleString('de')}
                </text>
            </svg>
        );
    };

    /* ── Stammbaum chromosome diagram ── */
    const ChromosomeDiagram = ({ caseData }) => {
        const { a, b, result, sterile, label } = caseData;
        return (
            <svg viewBox="0 0 320 130" className="w-full max-w-sm mx-auto">
                {/* A */}
                <rect x="10" y="30" width="70" height="70" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
                <text x="45" y="60" fill="#1d4ed8" fontSize="11" textAnchor="middle" fontWeight="bold">Tier A</text>
                <text x="45" y="78" fill="#1d4ed8" fontSize="13" textAnchor="middle" fontWeight="bold">{a} Chr.</text>

                {/* + */}
                <text x="98" y="72" fill="#6b7280" fontSize="20" fontWeight="bold">×</text>

                {/* B */}
                <rect x="120" y="30" width="70" height="70" rx="10" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
                <text x="155" y="60" fill="#be185d" fontSize="11" textAnchor="middle" fontWeight="bold">Tier B</text>
                <text x="155" y="78" fill="#be185d" fontSize="13" textAnchor="middle" fontWeight="bold">{b} Chr.</text>

                {/* arrow */}
                <text x="208" y="72" fill="#6b7280" fontSize="16">→</text>

                {/* result */}
                <rect x="222" y="30" width="88" height="70" rx="10" fill={sterile ? "#fee2e2" : "#dcfce7"} stroke={sterile ? "#ef4444" : "#22c55e"} strokeWidth="2"/>
                <text x="266" y="55" fill={sterile ? "#b91c1c" : "#15803d"} fontSize="10" textAnchor="middle" fontWeight="bold">{label || "Nachkomme"}</text>
                <text x="266" y="73" fill={sterile ? "#b91c1c" : "#15803d"} fontSize="13" textAnchor="middle" fontWeight="bold">{result} Chr.</text>
                <text x="266" y="90" fill={sterile ? "#ef4444" : "#16a34a"} fontSize="9" textAnchor="middle">{sterile ? "steril" : "fruchtbar"}</text>
            </svg>
        );
    };

    /* ── KnowledgeHub ── */
    const KnowledgeHub = () => {
        const [scaleVal, setScaleVal] = useState(0);
        const factor = Math.round(scaleVal * 100); // 0..10000

        return (
            <div className="space-y-8 animate-fade-in p-4 pb-12">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
                        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                            <IconMicroscope className="w-6 h-6"/> Prokaryoten vs. Eukaryoten
                        </h2>
                        <div className="space-y-4 text-sm md:text-base">
                            <div className="bg-orange-50 p-3 rounded-lg">
                                <strong className="block text-orange-800 mb-1">Prokaryoten</strong>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Kein Zellkern</li>
                                    <li>DNA als Ringchromosom</li>
                                    <li>Beispiel: Bakterien</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <strong className="block text-blue-800 mb-1">Eukaryoten</strong>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Echter Zellkern</li>
                                    <li>DNA in Chromosomen</li>
                                    <li>Beispiel: Tiere, Pflanzen</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
                        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                            <IconBook className="w-6 h-6"/> Verpackung der DNA
                        </h2>
                        <div className="space-y-3 text-sm md:text-base text-gray-700">
                            <div>
                                <span className="font-bold text-green-700">Arbeitsform:</span>
                                <p>Langgestreckter Faden für Transkription.</p>
                            </div>
                            <div>
                                <span className="font-bold text-green-700">Transportform:</span>
                                <p>Maximal verkürzt für Zellteilung.</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded text-xs font-mono mt-2">
                                Doppelstrang → Histone → Perlenkette → Chromosom
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                        <IconChromosome className="w-6 h-6"/> Chromosomen &amp; Karyogramm
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base text-gray-700">
                        <div>
                            <ul className="space-y-2">
                                <li><strong>Karyogramm:</strong> Geordnete Darstellung aller Chromosomen.</li>
                                <li><strong>Homologe Chromosomen:</strong> Paare (eins von Mama, eins von Papa).</li>
                                <li><strong>Diploider Satz:</strong> Doppelter Satz in Körperzellen (2n).</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <h3 className="font-bold text-purple-900 mb-2">Typen:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Autosomen:</strong> Paar 1-22</li>
                                <li><strong>Gonosomen:</strong> XX = Frau, XY = Mann</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── Maßstabs-Vergleich ── */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-teal-800 mb-2 flex items-center gap-2">
                        <IconDNA className="w-6 h-6 text-teal-600"/> Maßstabs-Vergleich: DNA im Zellkern
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">Wie passt 2 Meter DNA in einen 6-Mikrometer-Kern?</p>

                    {/* fact cards */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-6 text-sm">
                        {[
                            { icon: "🧬", text: "Ein menschliches Chromosom enthält ~150 Millionen Basenpaare" },
                            { icon: "📏", text: "Alle DNA eines Zellkerns aufgerollt: ~2 Meter lang" },
                            { icon: "🔬", text: "Der Zellkern ist nur ~6 Mikrometer groß → Verdichtungsfaktor ~10.000" },
                            { icon: "✏️", text: "Wenn die DNA 2 m lang wäre und wir sie auf Bleistiftdicke verdicken: Sie würde vom Boden bis zur Decke reichen" }
                        ].map((f, i) => (
                            <div key={i} className="flex gap-2 bg-teal-50 rounded-lg p-3 border border-teal-100">
                                <span className="text-2xl leading-none">{f.icon}</span>
                                <p className="text-gray-700 leading-snug">{f.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* interactive slider */}
                    <div className="bg-gray-900 rounded-xl p-4 mb-4">
                        <ScaleSVG factor={factor} />
                    </div>
                    <div className="px-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1 font-mono">
                            <span>Locker (×1)</span>
                            <span className="font-bold text-teal-600 text-sm">Vergrößert ×{factor.toLocaleString('de')}</span>
                            <span>Chromosom (×10.000)</span>
                        </div>
                        <input
                            type="range" min="0" max="100" value={scaleVal}
                            onChange={e => setScaleVal(Number(e.target.value))}
                            aria-label="Vergrößerungsfaktor"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    {factor < 1000 && (
                        <p className="text-xs text-center text-gray-400 mt-2">← Schiebe den Regler nach rechts, um die DNA zu verdichten</p>
                    )}
                    {factor >= 7000 && (
                        <p className="text-xs text-center text-teal-600 font-semibold mt-2 animate-fade-in">Maximale Verdichtung – das Chromosom ist sichtbar!</p>
                    )}
                </div>
            </div>
        );
    };

    /* ── CellCheck ── */
    const CellCheck = () => {
        const [index, setIndex] = useState(0);
        const [answered, setAnswered] = useState(false);
        const [selected, setSelected] = useState(null);
        const [score, setScore] = useState(0);

        const currentQ = CELL_CHECK_DATA[index];

        const handleAnswer = (choice) => {
            if (answered) return;
            setSelected(choice);
            setAnswered(true);
            if (choice === currentQ.a) setScore(s => s + 1);
        };

        const next = () => {
            setIndex(i => i + 1);
            setAnswered(false);
            setSelected(null);
        };

        if (index >= CELL_CHECK_DATA.length) {
            const pct = Math.round((score / CELL_CHECK_DATA.length) * 100);
            return (
                <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center animate-fade-in">
                    <h2 className="text-2xl font-bold mb-2 text-green-700">Check Abgeschlossen!</h2>
                    <StarRating score={score} total={CELL_CHECK_DATA.length} />
                    <p className="text-lg mb-2">Du hast {score} von {CELL_CHECK_DATA.length} richtig.</p>
                    <p className="text-3xl font-bold text-green-600 mb-6">{pct}%</p>
                    <button onClick={() => { setIndex(0); setScore(0); setAnswered(false); }} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">Neu starten</button>
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto mt-8 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-green-600 p-4 text-white flex justify-between">
                        <span className="font-bold flex items-center gap-2"><IconBook className="w-4 h-4"/> Frage {index + 1} / {CELL_CHECK_DATA.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <div className="p-8 text-center">
                        <h3 className="text-xl md:text-2xl font-semibold mb-8 text-gray-800 leading-relaxed">"{currentQ.q}"</h3>

                        {!answered ? (
                            <div className="flex justify-center gap-6">
                                <button onClick={() => handleAnswer(true)} className="flex-1 max-w-[150px] bg-green-100 hover:bg-green-200 text-green-800 py-3 rounded-xl font-bold transition transform hover:scale-105 border-2 border-green-300">WAHR</button>
                                <button onClick={() => handleAnswer(false)} className="flex-1 max-w-[150px] bg-red-100 hover:bg-red-200 text-red-800 py-3 rounded-xl font-bold transition transform hover:scale-105 border-2 border-red-300">FALSCH</button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className={`p-4 rounded-lg mb-6 ${selected === currentQ.a ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        {selected === currentQ.a ? <IconCheck className="w-8 h-8"/> : <IconX className="w-8 h-8"/>}
                                        <span className="font-bold text-lg">{selected === currentQ.a ? "Korrekt!" : "Leider falsch."}</span>
                                    </div>
                                    <p className="text-gray-700">{currentQ.exp}</p>
                                </div>
                                <button onClick={next} className="bg-gray-800 text-white px-8 py-2 rounded-full hover:bg-gray-900 transition">Weiter →</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    /* ── DNAPacker ── */
    const DNAPacker = () => {
        const [val, setVal] = useState(0);
        const [info, setInfo] = useState(null);

        let feedback = "Arbeitsform (Ablesbar)";
        let color = "text-blue-600";
        if (val > 10 && val < 80) { feedback = "Verdichtung läuft..."; color = "text-orange-500"; }
        if (val >= 80) { feedback = "Transportform (Transportfähig)"; color = "text-green-600"; }

        const opacityChromatin = Math.max(0, 1 - (val / 40));
        let opacityBeads = 0;
        if (val > 20 && val <= 50) opacityBeads = (val - 20) / 30;
        if (val > 50 && val < 90) opacityBeads = 1 - ((val - 50) / 40);
        const opacityChrom = Math.max(0, (val - 60) / 40);
        const scaleChrom = 0.5 + (val / 200);

        const showInfo = (type) => {
            if (type === 'chromatin') setInfo({ title: "Chromatin (Arbeitsform)", text: "Die DNA liegt als langer, dünner Faden vor. In diesem Zustand können Enzyme Gene ablesen." });
            if (type === 'histone') setInfo({ title: "Histone (Verpackung)", text: "Die DNA wickelt sich um Histone. Das entstehende Nukleosomen-Kette nennt man 'Perlenkette'." });
            if (type === 'chromosome') setInfo({ title: "Chromosom (Transportform)", text: "Für die Zellteilung wird die DNA maximal verdichtet. So können Erbanlagen sicher transportiert werden." });
        };

        return (
            <div className="max-w-3xl mx-auto mt-8 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <IconChromosome className="w-7 h-7 text-green-600"/> DNA-Presse
                    </h2>
                    <p className="text-gray-500 mb-8">Ziehe den Regler, um die DNA zu verpacken. <br/><span className="text-green-600 font-semibold text-sm">Klicke auf die Strukturen für Erklärungen!</span></p>

                    <div className="relative h-64 w-full bg-gray-900 rounded-xl mb-8 overflow-hidden flex items-center justify-center border-4 border-gray-200 shadow-inner group">
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                            <g onClick={() => showInfo('chromatin')} style={{ opacity: opacityChromatin, transition: 'opacity 0.2s', cursor: 'pointer' }}>
                                <path d="M10,150 Q50,100 90,150 T170,150 T250,150 T330,150 T410,150" fill="none" stroke="#60A5FA" strokeWidth="2"/>
                                <path d="M10,160 Q50,210 90,160 T170,160 T250,160 T330,160 T410,160" fill="none" stroke="#93C5FD" strokeWidth="2"/>
                                <text x="200" y="280" fill="white" fontSize="14" textAnchor="middle" opacity="0.7">Lange, dünne Fäden</text>
                            </g>
                            <g onClick={() => showInfo('histone')} style={{ opacity: opacityBeads, transition: 'opacity 0.2s', cursor: 'pointer' }}>
                                <line x1="20" y1="150" x2="380" y2="150" stroke="#F59E0B" strokeWidth="4"/>
                                {[50, 100, 150, 200, 250, 300, 350].map(x => (
                                    <circle key={x} cx={x} cy="150" r="16" fill="#FCD34D"/>
                                ))}
                                <text x="200" y="280" fill="#FCD34D" fontSize="14" textAnchor="middle">Wicklung um Histone</text>
                            </g>
                            <g onClick={() => showInfo('chromosome')} style={{ opacity: opacityChrom, transform: `scale(${scaleChrom})`, transformOrigin: 'center', transition: 'all 0.3s', cursor: 'pointer' }}>
                                <path d="M140 50 L180 150 L140 250" stroke="#22C55E" strokeWidth="35" strokeLinecap="round"/>
                                <path d="M260 50 L220 150 L260 250" stroke="#22C55E" strokeWidth="35" strokeLinecap="round"/>
                                <circle cx="200" cy="150" r="15" fill="#15803D"/>
                                <text x="200" y="280" fill="#4ADE80" fontSize="20" fontWeight="bold" textAnchor="middle">Chromosom</text>
                            </g>
                        </svg>

                        {info && (
                            <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setInfo(null)}>
                                <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full relative border-l-4 border-green-500" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => setInfo(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
                                        <IconX className="w-5 h-5"/>
                                    </button>
                                    <h3 className="text-xl font-bold text-green-800 mb-2">{info.title}</h3>
                                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{info.text}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative pt-6 pb-2">
                        <div className={`text-xl font-bold mb-4 transition-colors duration-300 ${color}`}>{feedback}</div>
                        <input type="range" min="0" max="100" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                            <span>0% (Lose)</span><span>50% (Histone)</span><span>100% (X-Form)</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── Detective ── */
    const Detective = () => {
        const [showTable, setShowTable] = useState(false);
        const [caseIdx, setCaseIdx] = useState(0);
        const [score, setScore] = useState(0);
        const [feedback, setFeedback] = useState(null);
        const [hintUsed, setHintUsed] = useState(false);
        const [showHint, setShowHint] = useState(false);
        const [hintPenalty, setHintPenalty] = useState(0);

        const currentCase = DETECTIVE_CASES[caseIdx];

        const checkAnswer = (ans) => {
            if (feedback) return;
            const correct = ans === currentCase.correct;
            const pts = correct ? (hintUsed ? 0 : 1) : 0;
            setScore(s => s + pts);
            setFeedback({ type: correct ? 'success' : 'error', msg: correct ? (hintUsed ? 'Richtig! (Kein Punkt wegen Tipp)' : 'Richtig kombiniert! +1 Punkt') : `Falsch! Richtige Antwort: ${currentCase.correct}` });
        };

        const useHint = () => {
            if (hintUsed || feedback) return;
            setHintUsed(true);
            setShowHint(true);
        };

        const nextCase = () => {
            setFeedback(null);
            setHintUsed(false);
            setShowHint(false);
            if (caseIdx < DETECTIVE_CASES.length - 1) setCaseIdx(c => c + 1);
            else setCaseIdx(-1);
        };

        if (caseIdx === -1) {
            const pct = Math.round((score / DETECTIVE_CASES.length) * 100);
            return (
                <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center animate-fade-in">
                    <h2 className="text-3xl font-bold mb-2 text-purple-700 flex items-center justify-center gap-2">
                        <IconChromosome className="w-8 h-8"/> Alle Fälle gelöst!
                    </h2>
                    <StarRating score={score} total={DETECTIVE_CASES.length} />
                    <p className="text-lg mb-2">Ergebnis: {score} von {DETECTIVE_CASES.length} Punkten</p>
                    <p className="text-3xl font-bold text-purple-600 mb-6">{pct}%</p>
                    <button onClick={() => { setCaseIdx(0); setScore(0); setFeedback(null); setHintUsed(false); setShowHint(false); }} className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">Neue Ermittlung</button>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto mt-6 p-4 animate-fade-in flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <IconChromosome className="w-5 h-5"/> Akte #{caseIdx + 1} / {DETECTIVE_CASES.length}
                            </h3>
                            <span className="bg-purple-900 px-3 py-1 rounded text-sm">Punkte: {score}</span>
                        </div>

                        <div className="p-6">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <h4 className="font-bold text-yellow-800 uppercase text-xs mb-1">Laborbericht:</h4>
                                <p className="text-xl font-medium text-gray-800">{currentCase.text}</p>
                            </div>

                            {/* hint area */}
                            {showHint && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800 animate-fade-in flex items-start gap-2">
                                    <IconHint className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                    <span><strong>Tipp:</strong> {currentCase.hint}</span>
                                </div>
                            )}

                            {!feedback ? (
                                <div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {currentCase.options.map(opt => (
                                            <button key={opt} onClick={() => checkAnswer(opt)} className="bg-gray-50 hover:bg-purple-100 border border-gray-200 hover:border-purple-300 text-gray-700 py-3 rounded-lg transition font-medium">
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    {!hintUsed && (
                                        <button onClick={useHint} className="w-full mt-1 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg py-2 transition bg-blue-50 hover:bg-blue-100">
                                            <IconHint className="w-4 h-4"/> Tipp anzeigen (-1 Punkt)
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center animate-fade-in">
                                    <div className={`p-4 rounded-lg mb-4 ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        <strong>{feedback.msg}</strong>
                                    </div>
                                    <button onClick={nextCase} className="bg-purple-600 text-white px-8 py-2 rounded-full hover:bg-purple-700 shadow-md">Nächster Fall →</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:w-1/3 flex flex-col">
                    <button onClick={() => setShowTable(!showTable)} className="w-full mb-4 bg-gray-200 hover:bg-gray-300 py-2 rounded text-gray-700 font-bold transition-colors flex items-center justify-center gap-2">
                        <IconBook className="w-4 h-4"/>
                        {showTable ? "Referenztabelle verbergen" : "Referenztabelle zeigen"}
                    </button>

                    {showTable && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                            <div className="bg-gray-100 p-3 font-bold text-gray-700 border-b">Referenz-Datenbank</div>
                            <div className="max-h-[400px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                        <tr><th className="px-4 py-2">Lebewesen</th><th className="px-4 py-2 text-right">2n</th></tr>
                                    </thead>
                                    <tbody>
                                        {REFERENCE_TABLE.map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-2 font-medium">{row.name}</td>
                                                <td className="px-4 py-2 text-right font-mono text-purple-700">{row.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    /* ── Stammbaum-Rätsel ── */
    const Stammbaum = () => {
        const [caseIdx, setCaseIdx] = useState(0);
        const [chosen, setChosen] = useState(null);
        const [showExplanation, setShowExplanation] = useState(false);
        const [showTipp, setShowTipp] = useState(false);
        const [score, setScore] = useState(0);
        const [done, setDone] = useState(false);

        const current = STAMMBAUM_CASES[caseIdx];

        const handleAnswer = (ans) => {
            if (chosen) return;
            setChosen(ans);
            setShowExplanation(true);
            if (ans === current.antwort) setScore(s => s + 1);
        };

        const next = () => {
            if (caseIdx < STAMMBAUM_CASES.length - 1) {
                setCaseIdx(c => c + 1);
                setChosen(null);
                setShowExplanation(false);
                setShowTipp(false);
            } else {
                setDone(true);
            }
        };

        const restart = () => {
            setCaseIdx(0); setChosen(null); setShowExplanation(false);
            setShowTipp(false); setScore(0); setDone(false);
        };

        if (done) {
            return (
                <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center animate-fade-in">
                    <h2 className="text-2xl font-bold mb-2 text-green-700 flex items-center justify-center gap-2">
                        <IconTree className="w-7 h-7"/> Stammbaum-Rätsel gelöst!
                    </h2>
                    <StarRating score={score} total={STAMMBAUM_CASES.length} />
                    <p className="text-lg mb-2">{score} von {STAMMBAUM_CASES.length} Fällen richtig</p>
                    <p className="text-3xl font-bold text-green-600 mb-6">{Math.round(score/STAMMBAUM_CASES.length*100)}%</p>
                    <p className="text-sm text-gray-600 mb-6 bg-green-50 rounded-lg p-3">
                        <strong>Merke:</strong> Unterschiedliche Chromosomenzahlen führen zu reproduktiver Isolation – das ist einer der Mechanismen, durch die neue Arten entstehen!
                    </p>
                    <button onClick={restart} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">Nochmal lösen</button>
                </div>
            );
        }

        const isCorrect = chosen === current.antwort;

        const btnOptions = current.antwort === "ja"
            ? ["ja", "nein", "vielleicht"]
            : current.antwort === "nein"
            ? ["ja", "nein", "vielleicht"]
            : ["fruchtbar", "unfruchtbar", "vielleicht"];

        const labelMap = {
            ja: "Ja – fruchtbare Nachkommen möglich",
            nein: "Nein – nicht möglich",
            vielleicht: "Vielleicht – unter Umständen",
            fruchtbar: "Fruchtbar",
            unfruchtbar: "Unfruchtbar (steril)"
        };

        return (
            <div className="max-w-2xl mx-auto mt-6 p-4 animate-fade-in">
                {/* intro concept box */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-gray-700">
                    <h3 className="font-bold text-green-800 mb-1 flex items-center gap-2">
                        <IconTree className="w-5 h-5"/> Reproduktive Isolation durch Chromosomenunterschiede
                    </h3>
                    <p>Damit zwei Lebewesen fruchtbare Nachkommen zeugen können, müssen sich ihre Chromosomen bei der Meiose (Keimzellbildung) paarweise zusammenfinden. Unterschiedliche Chromosomenzahlen machen das unmöglich – die Arten sind <em>reproduktiv isoliert</em>.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-green-700 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <IconTree className="w-5 h-5"/> {current.title}
                        </h3>
                        <span className="bg-green-900 px-3 py-1 rounded text-sm">Punkte: {score}</span>
                    </div>

                    <div className="p-6">
                        {/* chromosome diagram */}
                        <div className="mb-5">
                            <ChromosomeDiagram caseData={current.diagramm} />
                        </div>

                        {/* scenario */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded-r-lg">
                            <p className="text-gray-800 font-medium leading-relaxed">{current.szenario}</p>
                        </div>

                        {/* tipp */}
                        {showTipp && !chosen && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800 animate-fade-in flex gap-2">
                                <IconHint className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                <span><strong>Tipp:</strong> {current.tipp}</span>
                            </div>
                        )}

                        {!chosen ? (
                            <div>
                                <p className="text-center text-sm text-gray-500 mb-3 font-semibold uppercase tracking-wide">Deine Antwort:</p>
                                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                    {btnOptions.map(opt => (
                                        <button key={opt} onClick={() => handleAnswer(opt)}
                                            className="flex-1 py-3 rounded-xl font-bold border-2 transition
                                                bg-gray-50 hover:bg-green-100 border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-800">
                                            {labelMap[opt] || opt}
                                        </button>
                                    ))}
                                </div>
                                {!showTipp && (
                                    <button onClick={() => setShowTipp(true)} className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg py-2 transition bg-blue-50 hover:bg-blue-100">
                                        <IconHint className="w-4 h-4"/> Tipp anzeigen
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {isCorrect ? <IconCheck className="w-6 h-6 text-green-700"/> : <IconX className="w-6 h-6 text-red-700"/>}
                                        <strong className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                                            {isCorrect ? 'Richtig!' : `Falsch – richtige Antwort: ${labelMap[current.antwort] || current.antwort}`}
                                        </strong>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{current.erklaerung}</p>
                                </div>
                                <button onClick={next} className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition font-bold shadow">
                                    {caseIdx < STAMMBAUM_CASES.length - 1 ? 'Nächster Fall →' : 'Ergebnis anzeigen'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* progress */}
                    <div className="px-6 pb-4">
                        <div className="flex gap-2 justify-center">
                            {STAMMBAUM_CASES.map((_, i) => (
                                <div key={i} className={`h-2 flex-1 rounded-full ${i < caseIdx ? 'bg-green-500' : i === caseIdx ? 'bg-green-300' : 'bg-gray-200'}`}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── FinalQuiz ── */
    const FinalQuiz = () => {
        const [qIdx, setQIdx] = useState(0);
        const [score, setScore] = useState(0);
        const [finished, setFinished] = useState(false);
        const [feedback, setFeedback] = useState(null);

        const current = QUIZ_DATA[qIdx];

        const handleChoice = (idx) => {
            if (feedback) return;
            const isCorrect = idx === current.correct;
            if (isCorrect) setScore(s => s + 1);
            setFeedback({ correct: isCorrect, selected: idx });

            setTimeout(() => {
                if (qIdx < QUIZ_DATA.length - 1) { setQIdx(q => q + 1); setFeedback(null); }
                else { setFinished(true); }
            }, 1500);
        };

        if (finished) {
            const pct = Math.round((score / QUIZ_DATA.length) * 100);
            return (
                <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl text-center animate-fade-in border-t-8 border-green-500">
                    <h2 className="text-3xl font-extrabold mb-2 text-gray-800 flex items-center justify-center gap-2">
                        <IconBook className="w-8 h-8 text-green-600"/> Quiz beendet!
                    </h2>
                    <StarRating score={score} total={QUIZ_DATA.length} />
                    <div className="text-6xl font-bold text-green-600 mb-4">{pct}%</div>
                    <p className="text-lg text-gray-600 mb-8">Du hast {score} von {QUIZ_DATA.length} Fragen richtig.</p>
                    <button onClick={() => { setQIdx(0); setScore(0); setFinished(false); setFeedback(null); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">Nochmal spielen</button>
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto mt-8 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="w-full bg-gray-200 h-2"><div className="bg-green-500 h-2 transition-all duration-300" style={{width: `${((qIdx)/QUIZ_DATA.length)*100}%`}}></div></div>
                    <div className="p-8">
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide flex items-center gap-1">
                            <IconBook className="w-4 h-4"/> Frage {qIdx + 1} von {QUIZ_DATA.length}
                        </span>
                        <h3 className="text-xl font-bold mt-2 mb-6 text-gray-800">{current.q}</h3>
                        <div className="space-y-3">
                            {current.options.map((opt, i) => {
                                let btnClass = "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700";
                                if (feedback) {
                                    if (i === current.correct) btnClass = "bg-green-500 border-green-600 text-white shadow-md scale-[1.02]";
                                    else if (i === feedback.selected && !feedback.correct) btnClass = "bg-red-500 border-red-600 text-white opacity-50";
                                    else btnClass = "opacity-50 bg-gray-100";
                                }
                                return (
                                    <button key={i} onClick={() => handleChoice(i)} className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium ${btnClass}`} disabled={!!feedback}>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── App ── */
    const App = () => {
        const [currentModule, setModule] = useState(MODULES.KNOWLEDGE);

        const renderContent = () => {
            switch(currentModule) {
                case MODULES.KNOWLEDGE:  return <KnowledgeHub />;
                case MODULES.CELLCHECK:  return <CellCheck />;
                case MODULES.DNAPACKER: return <DNAPacker />;
                case MODULES.DETECTIVE: return <Detective />;
                case MODULES.STAMMBAUM: return <Stammbaum />;
                case MODULES.QUIZ:       return <FinalQuiz />;
                default:                 return <KnowledgeHub />;
            }
        };

        return (
            <div className="min-h-screen pb-10">
                <Header setModule={setModule} />
                <Navigation current={currentModule} setModule={setModule} />
                <main className="container mx-auto max-w-5xl">
                    {renderContent()}
                </main>
                <footer className="bg-white border-t py-4 text-center text-xs md:text-sm text-gray-500 mt-8">
                    <p>Johannes-Scharrer-Gymnasium &bull; Zollfrank &bull; &copy; {new Date().getFullYear()}</p>
                </footer>
            </div>
        );
    };

    

export default App;
