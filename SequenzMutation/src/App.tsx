
        import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

        // --- DATA & CONSTANTS ---

        const BASES = ['U', 'C', 'A', 'G'];

        const GLOSSARY = {
            'Transkription': 'Der erste Schritt der Proteinbiosynthese: Umschreiben der DNA-Information in mRNA.',
            'Translation': 'Übersetzung der mRNA-Basensequenz in die Aminosäuresequenz eines Proteins am Ribosom.',
            'Code-Sonne': 'Schematische Darstellung des genetischen Codes zur Übersetzung von mRNA-Tripletts in Aminosäuren.',
            'DNA': 'Desoxyribonukleinsäure: Träger der Erbinformation.',
            'mRNA': 'Messenger-RNA: Botenmolekül, das die genetische Information zum Ribosom transportiert.',
            'Codon': 'Ein Basentriplett (drei aufeinanderfolgende Basen) auf der mRNA, das für eine Aminosäure codiert.',
            'Leseraster': 'Die Einteilung der Basensequenz in aufeinanderfolgende Tripletts.',
            'Punktmutation': 'Veränderung einer einzelnen Base in der DNA-Sequenz.',
            'Substitution': 'Austausch einer Base gegen eine andere.',
            'Insertion': 'Einfügung einer oder mehrerer Basen in die DNA-Sequenz.',
            'Deletion': 'Entfernung einer oder mehrerer Basen aus der DNA-Sequenz.',
            'Frameshift': 'Verschiebung des Leserasters durch Insertion oder Deletion, die nicht durch 3 teilbar ist.',
            'Nonsense-Mutation': 'Eine Punktmutation, die zu einem vorzeitigen Stopp-Codon führt und das Protein verkürzt.',
            'Missense-Mutation': 'Eine Mutation, die den Einbau einer anderen Aminosäure zur Folge hat.',
            'Stille-Mutation': 'Eine Mutation, die trotz Basenaustausch die gleiche Aminosäure ergibt (Redundanz des Codes).',
            'Hydrophob': 'Wasserabweisend. Hydrophobe Aminosäuren meiden Kontakt mit Wasser.',
            'Polymerisation': 'Verknüpfung von Molekülen zu größeren Strukturen (hier: Verklumpung von Hämoglobin).',
            'Phänotyp': 'Das sichtbare Erscheinungsbild oder die physiologischen Eigenschaften eines Organismus.',
            'Gen': 'Ein Abschnitt auf der DNA, der die Information für ein bestimmtes Merkmal (z.B. ein Protein) enthält.',
            'Stopp-Codon': 'Ein Codon, das das Ende der Translation signalisiert.',
            'Start-Codon': 'Das Codon (AUG), bei dem die Translation beginnt.',
            'Polypeptidkette': 'Eine Kette aus verknüpften Aminosäuren, Vorstufe eines Proteins.',
            'Hämophilie': 'Bluterkrankheit, bei der die Blutgerinnung gestört ist.',
            'Sichelzellenanämie': 'Erbkrankheit, bei der sich rote Blutkörperchen verformen.',
            'Mukoviszidose': 'Erbkrankheit, die vor allem Lunge und Verdauungsorgane betrifft.',
            'Tay-Sachs': 'Seltene Erbkrankheit mit fortschreitendem Nervenzelluntergang.'
        };

        const CODON_TABLE = {
            'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
            'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
            'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'STOP', 'UAG': 'STOP',
            'UGU': 'Cys', 'UGC': 'Cys', 'UGA': 'STOP', 'UGG': 'Trp',
            'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
            'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
            'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
            'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
            'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile', 'AUG': 'Met',
            'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
            'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
            'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
            'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
            'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
            'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
            'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
        };

        const AMINO_ACID_INFO = {
            'Phe': { name: 'Phenylalanin', type: 'hydrophob', color: 'bg-blue-100 text-blue-800' },
            'Leu': { name: 'Leucin', type: 'hydrophob', color: 'bg-blue-100 text-blue-800' },
            'Ile': { name: 'Isoleucin', type: 'hydrophob', color: 'bg-blue-100 text-blue-800' },
            'Met': { name: 'Methionin', type: 'hydrophob', color: 'bg-green-100 text-green-800' },
            'Val': { name: 'Valin', type: 'hydrophob', color: 'bg-blue-100 text-blue-800' },
            'Pro': { name: 'Prolin', type: 'special', color: 'bg-purple-100 text-purple-800' },
            'Trp': { name: 'Tryptophan', type: 'hydrophob', color: 'bg-blue-100 text-blue-800' },
            'Ala': { name: 'Alanin', type: 'hydrophob', color: 'bg-blue-100 text-blue-800' },
            'Gly': { name: 'Glycin', type: 'special', color: 'bg-purple-100 text-purple-800' },
            'Cys': { name: 'Cystein', type: 'polar', color: 'bg-yellow-100 text-yellow-800' },
            'Ser': { name: 'Serin', type: 'polar', color: 'bg-yellow-100 text-yellow-800' },
            'Thr': { name: 'Threonin', type: 'polar', color: 'bg-yellow-100 text-yellow-800' },
            'Tyr': { name: 'Tyrosin', type: 'polar', color: 'bg-yellow-100 text-yellow-800' },
            'Asn': { name: 'Asparagin', type: 'polar', color: 'bg-yellow-100 text-yellow-800' },
            'Gln': { name: 'Glutamin', type: 'polar', color: 'bg-yellow-100 text-yellow-800' },
            'Asp': { name: 'Asparaginsäure', type: 'negativ', color: 'bg-red-100 text-red-800' },
            'Glu': { name: 'Glutaminsäure', type: 'negativ', color: 'bg-red-100 text-red-800' },
            'Lys': { name: 'Lysin', type: 'positiv', color: 'bg-green-100 text-green-800' },
            'Arg': { name: 'Arginin', type: 'positiv', color: 'bg-green-100 text-green-800' },
            'His': { name: 'Histidin', type: 'positiv', color: 'bg-green-100 text-green-800' },
            'STOP': { name: 'Stopp', type: 'stop', color: 'bg-gray-200 text-gray-800' }
        };

        const SCENARIOS = [
            {
                id: 'sichel',
                title: 'Sichelzellenanämie',
                gene: 'HBB (Hämoglobin Beta)',
                mutationType: 'substitution',
                wildtype: { dna: 'CTC', mrna: 'GAG', protein: 'Glu', desc: 'Glutaminsäure (Polar, negativ)' },
                mutant: { dna: 'CAC', mrna: 'GUG', protein: 'Val', desc: 'Valin (Unpolar, hydrophob)' },
                effect: 'Punktmutation (Substitution). Die hydrophobe Stelle lässt Hämoglobin-Moleküle bei Sauerstoffmangel verkleben ("Polymerisation"). Die roten Blutkörperchen verformen sich sichelförmig und verstopfen Kapillaren.',
                symptoms: 'Müdigkeit (Anämie), starke Schmerzkrisen, Organschäden durch Durchblutungsstörungen, erhöhte Infektanfälligkeit.',
                explanation: 'Ein einzelner Basenaustausch (T→A) führt zum Austausch einer geladenen Aminosäure (Glutaminsäure) gegen eine unpolare (Valin). Dies verändert die Oberflächeneigenschaften des Hämoglobins.'
            },
            {
                id: 'haemo',
                title: 'Hämophilie A',
                gene: 'F8 (Faktor VIII)',
                mutationType: 'substitution',
                wildtype: { dna: 'TCT', mrna: 'AGA', protein: 'Arg', desc: 'Arginin (Funktionell)' },
                mutant: { dna: 'ACT', mrna: 'UGA', protein: 'STOP', desc: 'Stopp-Codon (Nonsense)' },
                effect: 'Nonsense-Mutation. Die Translation bricht vorzeitig ab. Das entstehende Protein ist zu kurz und kann seine Funktion in der Blutgerinnungskaskade nicht erfüllen. Blutungen stoppen nicht.',
                symptoms: 'Großflächige blaue Flecken, langanhaltende Blutungen nach Verletzungen, spontane Einblutungen in Gelenke (Hämarthros) und Muskeln.',
                explanation: 'Die Mutation erzeugt ein vorzeitiges Stopp-Codon. Das Protein wird verkürzt und ist funktionsunfähig.'
            },
            {
                id: 'albino',
                title: 'Albinismus',
                gene: 'TYR (Tyrosinase)',
                mutationType: 'substitution',
                wildtype: { dna: 'GGA', mrna: 'CCU', protein: 'Pro', desc: 'Prolin (Korrekt gefaltet)' },
                mutant: { dna: 'AGA', mrna: 'UCU', protein: 'Ser', desc: 'Serin (Strukturfehler)' },
                effect: 'Missense-Mutation. Das Enzym Tyrosinase ist instabil oder inaktiv. Der Körper kann Tyrosin nicht in Melanin umwandeln. Es fehlen Pigmente in Haut, Haaren und Augen.',
                symptoms: 'Sehr helle Haut und Haare, rötlich schimmernde Augen (durchscheinende Blutgefäße), extreme Lichtempfindlichkeit, erhöhtes Hautkrebsrisiko.',
                explanation: 'Der Austausch von Prolin gegen Serin verändert die Proteinfaltung. Das Enzym verliert seine Funktion.'
            },
            {
                id: 'mukoviszidose',
                title: 'Mukoviszidose',
                gene: 'CFTR (Chloridkanal)',
                mutationType: 'deletion',
                wildtype: { dna: 'ATCTTT', mrna: 'UAGAAA', protein: 'STOP-Lys', desc: 'Funktioneller Chloridkanal' },
                mutant: { dna: 'ATT', mrna: 'UAA', protein: 'STOP', desc: 'Verkürztes Protein (Deletion)' },
                effect: 'Deletion von 3 Basen führt zu einem verkürzten, funktionsunfähigen Protein. Der Chloridkanal kann nicht richtig arbeiten, Schleim wird zähflüssig.',
                symptoms: 'Chronischer Husten, wiederkehrende Lungenentzündungen, Verdauungsprobleme, schlechte Gewichtszunahme.',
                explanation: 'Die Deletion führt zu einem vorzeitigen Stopp-Codon. Das CFTR-Protein ist verkürzt und kann keine Chloridionen transportieren.'
            },
            {
                id: 'taysachs',
                title: 'Tay-Sachs',
                gene: 'HEXA (Hexosaminidase A)',
                mutationType: 'insertion',
                wildtype: { dna: 'ATGGCT', mrna: 'UACCGA', protein: 'Tyr-Arg', desc: 'Funktionelles Enzym' },
                mutant: { dna: 'ATGGGCT', mrna: 'UACCCGA', protein: 'Tyr-Pro', desc: 'Frameshift-Mutation (Insertion)' },
                effect: 'Insertion einer Base verschiebt das Leseraster (Frameshift). Alle nachfolgenden Aminosäuren sind falsch. Das Enzym ist komplett funktionsunfähig.',
                symptoms: 'Fortschreitender Verlust motorischer Fähigkeiten, Krampfanfälle, Blindheit, geistiger Verfall im Kindesalter.',
                explanation: 'Die Insertion einer Base verschiebt das gesamte Leseraster. Ab dem Mutationspunkt werden völlig andere Aminosäuren eingebaut.'
            }
        ];

        const DIFFICULTY_LEVELS = {
            easy: { label: 'Einfach', description: 'Nur Substitutionen, direkte Zuordnung', timeBonus: 1.5 },
            medium: { label: 'Mittel', description: 'Alle Mutationstypen, Code-Sonne nutzen', timeBonus: 1.0 },
            hard: { label: 'Schwer', description: 'Komplexe Sequenzen, Zeitlimit', timeBonus: 0.7 }
        };

        // --- ICONS (SVG Components) ---
        const IconDna = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="M17 6l-2.5-2.5"/><path d="M14 8l-1-1"/><path d="M7 18l2.5 2.5"/><path d="M3.5 14.5l-1 1"/><path d="M20 9l-1 1"/><path d="M14.5 20.5l1-1"/><path d="M15 12l-1 1"/><path d="M22 6l-1-1"/><path d="M10 2l-1 1"/></svg>
        );
        const IconMicroscope = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>
        );
        const IconBook = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        );
        const IconActivity = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        );
        const IconCheck = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        );
        const IconSun = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        );
        const IconMoon = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        );
        const IconPrint = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        );
        const IconTrophy = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
        );
        const IconAlert = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        );

        // --- HELPER COMPONENTS ---

        const Term = ({ children }) => {
            const definition = GLOSSARY[children] || GLOSSARY[children?.replace(/s$/, '')] || GLOSSARY[children?.replace(/-$/, '')];
            if (!definition) return <span>{children}</span>;
            return <span className="glossary-term" data-tooltip={definition} tabIndex="0" role="button" aria-label={`${children}: ${definition}`}>{children}</span>;
        };

        const HighlightedText = ({ text }) => {
            if (!text) return null;
            const parts = text.split(/(\b\w+\b)/g);
            return (
                <span>
                    {parts.map((part, i) => {
                        const cleanPart = part.trim().replace(/[.,()]/g, '');
                        if (GLOSSARY[cleanPart] || GLOSSARY[part]) return <Term key={i}>{part}</Term>;
                        return part;
                    })}
                </span>
            );
        };

        const FeedbackMessage = ({ type, message, explanation }) => {
            const styles = {
                success: 'bg-green-50 border-green-200 text-green-800',
                error: 'bg-red-50 border-red-200 text-red-800',
                info: 'bg-blue-50 border-blue-200 text-blue-800'
            };
            
            return (
                <div className={`p-4 rounded-lg border ${styles[type]} ${type === 'success' ? 'success-animation' : type === 'error' ? 'error-animation' : ''}`} role="alert" aria-live="polite">
                    <div className="flex items-start gap-3">
                        {type === 'success' && <IconCheck />}
                        {type === 'error' && <IconAlert />}
                        <div>
                            <p className="font-bold">{message}</p>
                            {explanation && <p className="text-sm mt-1 opacity-90">{explanation}</p>}
                        </div>
                    </div>
                </div>
            );
        };

        const ProgressBar = ({ current, total, label }) => (
            <div className="mb-4" role="progressbar" aria-valuenow={current} aria-valuemin="0" aria-valuemax={total} aria-label={label}>
                <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>{label}</span>
                    <span>{current} / {total}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }}></div>
                </div>
            </div>
        );

        // --- HELPER FUNCTIONS ---

        const dnaToMrna = (dna) => {
            return dna.toUpperCase().split('').map(base => {
                switch(base) {
                    case 'A': return 'U';
                    case 'T': return 'A';
                    case 'G': return 'C';
                    case 'C': return 'G';
                    default: return '?';
                }
            }).join('');
        };

        const translateMrna = (mrna) => {
            const codons = [];
            for (let i = 0; i < mrna.length; i += 3) {
                if (i + 3 <= mrna.length) {
                    const triplet = mrna.substring(i, i + 3);
                    codons.push({
                        triplet,
                        aa: CODON_TABLE[triplet] || '?'
                    });
                }
            }
            return codons;
        };

        const getMutationTypeLabel = (type) => {
            const labels = {
                'substitution': 'Substitution (Punktmutation)',
                'insertion': 'Insertion (Einfügung)',
                'deletion': 'Deletion (Entfernung)'
            };
            return labels[type] || type;
        };

        const getMutationTypeColor = (type) => {
            const colors = {
                'substitution': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                'insertion': 'bg-blue-100 text-blue-800 border-blue-300',
                'deletion': 'bg-red-100 text-red-800 border-red-300'
            };
            return colors[type] || 'bg-gray-100 text-gray-800';
        };

        // --- LOCAL STORAGE HELPERS ---

        const saveProgress = (key, data) => {
            try {
                localStorage.setItem(`sequenzmutation_${key}`, JSON.stringify(data));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }
        };

        const loadProgress = (key, defaultValue) => {
            try {
                const saved = localStorage.getItem(`sequenzmutation_${key}`);
                return saved ? JSON.parse(saved) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        };

        // --- SUB-COMPONENTS ---

        const MethodikView = () => (
            <div className="space-y-6 fade-in p-2" role="region" aria-labelledby="methodik-heading">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
                    <h2 id="methodik-heading" className="font-bold text-xl text-green-800 mb-2">Vorgehen zur Sequenzanalyse</h2>
                    <p className="text-green-700">Die <Term>Proteinbiosynthese</Term> ist der Prozess, bei dem der genetische Code in Proteine übersetzt wird. Wir analysieren diesen Weg in 3 Hauptschritten.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-8">
                    <article className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <div className="text-4xl font-bold text-slate-300 mb-2" aria-hidden="true">1</div>
                        <h3 className="font-bold text-lg mb-2"><Term>Transkription</Term></h3>
                        <p className="text-sm text-slate-600"><Term>DNA</Term> wird in <Term>mRNA</Term> umgeschrieben.</p>
                        <div className="mt-4 font-mono bg-slate-100 p-2 rounded text-xs" aria-label="Beispiel Transkription">
                            DNA: 3'-TAC-5'<br/>
                            ↓<br/>
                            mRNA: 5'-AUG-3'
                        </div>
                        <p className="text-xs text-green-600 mt-2 font-bold">T → A, A → U</p>
                    </article>
                    <article className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <div className="text-4xl font-bold text-slate-300 mb-2" aria-hidden="true">2</div>
                        <h3 className="font-bold text-lg mb-2"><Term>Codon</Term>s lesen</h3>
                        <p className="text-sm text-slate-600">mRNA wird in Tripletts (3er-Pakete) zerlegt.</p>
                        <div className="mt-4 font-mono bg-slate-100 p-2 rounded text-xs" aria-label="Beispiel Codons">
                            mRNA<br/>
                            AUG | CCC | GUA
                        </div>
                        <p className="text-xs text-green-600 mt-2 font-bold"><Term>Leseraster</Term> beachten!</p>
                    </article>
                    <article className="bg-white p-6 rounded-lg shadow border border-slate-200">
                        <div className="text-4xl font-bold text-slate-300 mb-2" aria-hidden="true">3</div>
                        <h3 className="font-bold text-lg mb-2"><Term>Translation</Term></h3>
                        <p className="text-sm text-slate-600">Übersetzung in Aminosäuren mithilfe der <Term>Code-Sonne</Term>.</p>
                        <div className="mt-4 font-mono bg-slate-100 p-2 rounded text-xs" aria-label="Beispiel Translation">
                            Met - Pro - Val
                        </div>
                        <p className="text-xs text-green-600 mt-2 font-bold"><Term>Start-Codon</Term> & <Term>Stopp-Codon</Term></p>
                    </article>
                </div>

                {/* Mutation Types Section */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow border border-slate-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Mutationstypen im Überblick</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 mb-2">Substitution</h4>
                            <p className="text-sm text-yellow-700">Eine Base wird durch eine andere ersetzt. Kann zu <Term>Missense</Term>- oder <Term>Nonsense-Mutation</Term> führen.</p>
                            <div className="mt-2 font-mono text-xs bg-yellow-100 p-2 rounded">
                                ATG<strong className="text-red-600">C</strong>GA → ATG<strong className="text-green-600">T</strong>GA
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-blue-800 mb-2">Insertion</h4>
                            <p className="text-sm text-blue-700">Eine oder mehrere Basen werden eingefügt. Verursacht oft einen <Term>Frameshift</Term>.</p>
                            <div className="mt-2 font-mono text-xs bg-blue-100 p-2 rounded">
                                ATG CGA → ATG <strong className="text-blue-600">A</strong>CG A..
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <h4 className="font-bold text-red-800 mb-2">Deletion</h4>
                            <p className="text-sm text-red-700">Eine oder mehrere Basen werden entfernt. Verursacht oft einen <Term>Frameshift</Term>.</p>
                            <div className="mt-2 font-mono text-xs bg-red-100 p-2 rounded">
                                ATG CGA → AT _GA...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        const SimulationView = () => {
            const [dnaInput, setDnaInput] = useState('TACGGGCATATT');
            const [validationError, setValidationError] = useState('');
            const mrna = useMemo(() => dnaToMrna(dnaInput), [dnaInput]);
            const proteinChain = useMemo(() => translateMrna(mrna), [mrna]);

            const handleInput = (e) => {
                const val = e.target.value.toUpperCase().replace(/[^ATCG]/g, '');
                setDnaInput(val);
                
                // Validation
                if (val.length > 0 && val.length % 3 !== 0) {
                    setValidationError(`Hinweis: Die Sequenz ist ${val.length} Basen lang. Für vollständige Codons sollte sie durch 3 teilbar sein.`);
                } else {
                    setValidationError('');
                }
            };

            const hasStopCodon = proteinChain.some(c => c.aa === 'STOP');
            const hasStartCodon = mrna.startsWith('AUG');

            return (
                <div className="space-y-8 fade-in" role="region" aria-labelledby="simulation-heading">
                    <h2 id="simulation-heading" className="sr-only">DNA-Translations-Simulation</h2>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <label htmlFor="dna-input" className="block text-sm font-bold text-slate-700 mb-2">
                            Codogener DNA-Strang (3' → 5')
                        </label>
                        <input 
                            id="dna-input"
                            type="text" 
                            value={dnaInput}
                            onChange={handleInput}
                            className="w-full font-mono text-lg p-3 border-2 border-dashed border-blue-400 rounded focus:border-green-500 focus:outline-none uppercase tracking-widest bg-white text-slate-800 shadow-inner"
                            placeholder="ATCG..."
                            aria-describedby="dna-help dna-validation"
                        />
                        <p id="dna-help" className="text-xs text-slate-500 mt-2">Nur Basen A, T, C, G erlaubt. Tippen Sie zum Ändern.</p>
                        {validationError && (
                            <p id="dna-validation" className="text-xs text-amber-600 mt-1" role="alert">{validationError}</p>
                        )}
                    </div>

                    {/* Warnings */}
                    {!hasStartCodon && dnaInput.length >= 3 && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-800 text-sm" role="alert">
                            <strong>Hinweis:</strong> Die mRNA beginnt nicht mit dem Start-Codon AUG. Die Translation würde hier nicht beginnen.
                        </div>
                    )}
                    {hasStopCodon && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-800 text-sm" role="alert">
                            <strong>Info:</strong> Ein Stopp-Codon wurde gefunden. Die Translation würde hier enden.
                        </div>
                    )}

                    <div className="grid gap-4">
                        {/* mRNA Visualization */}
                        <div className="bg-slate-100 border border-slate-200 text-slate-800 p-4 rounded-lg font-mono overflow-x-auto shadow-inner">
                            <div className="text-xs text-slate-400 mb-1"><Term>mRNA</Term> (5' → 3') - Komplementär zur DNA</div>
                            <div className="text-xl tracking-[0.2em] break-all text-green-600 font-medium" aria-label={`mRNA Sequenz: ${mrna}`}>{mrna}</div>
                        </div>

                        {/* Protein Visualization */}
                        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
                            <div className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider"><Term>Polypeptidkette</Term> (Protein)</div>
                            <div className="flex flex-wrap gap-2" role="list" aria-label="Aminosäuresequenz">
                                {proteinChain.map((codon, idx) => {
                                    const aaInfo = AMINO_ACID_INFO[codon.aa] || { color: 'bg-slate-50 text-slate-700 border-slate-200' };
                                    let styleClass = aaInfo.color + " border";
                                    if (codon.aa === 'Met') styleClass = "bg-green-50 text-green-800 border-green-200 ring-2 ring-green-100 border"; 
                                    if (codon.aa === 'STOP') styleClass = "bg-red-50 text-red-800 border-red-200 font-bold border";

                                    return (
                                        <div key={idx} className={`flex flex-col items-center p-2 rounded min-w-[60px] ${styleClass}`} role="listitem">
                                            <span className="text-xs text-slate-400 mb-1">{codon.triplet}</span>
                                            <span className="font-bold text-sm">{codon.aa}</span>
                                            {aaInfo.name && <span className="text-[10px] opacity-75">{aaInfo.name}</span>}
                                        </div>
                                    )
                                })}
                                {proteinChain.length === 0 && <span className="text-slate-400 italic">Geben Sie oben DNA ein...</span>}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const CaseStudyView = () => {
            const [activeCase, setActiveCase] = useState(SCENARIOS[0]);

            return (
                <div className="fade-in" role="region" aria-labelledby="cases-heading">
                    <h2 id="cases-heading" className="sr-only">Fallbeispiele</h2>
                    
                    <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Fallbeispiele Auswahl">
                        {SCENARIOS.map(sc => (
                            <button 
                                key={sc.id}
                                onClick={() => setActiveCase(sc)}
                                role="tab"
                                aria-selected={activeCase.id === sc.id}
                                aria-controls={`case-panel-${sc.id}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeCase.id === sc.id 
                                    ? 'bg-green-600 text-white shadow-md' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {sc.title}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden" role="tabpanel" id={`case-panel-${activeCase.id}`}>
                        <div className="bg-slate-50 p-6 border-b border-slate-200">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800">{activeCase.title}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMutationTypeColor(activeCase.mutationType)}`}>
                                    {getMutationTypeLabel(activeCase.mutationType)}
                                </span>
                            </div>
                            <p className="text-green-600 font-mono text-sm mt-1">Betroffenes <Term>Gen</Term>: {activeCase.gene}</p>
                        </div>

                        <div className="p-6 grid lg:grid-cols-2 gap-8">
                            {/* Comparison Section */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3">Wildtyp (Gesund)</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="w-16 text-xs text-slate-500 font-mono">DNA</span>
                                            <div className="font-mono bg-green-50 px-3 py-1 rounded border border-green-200 text-slate-700">
                                                ...{activeCase.wildtype.dna}...
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-16 text-xs text-slate-500 font-mono">mRNA</span>
                                            <div className="font-mono px-3 py-1 text-slate-500">
                                                ...{activeCase.wildtype.mrna}...
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-16 text-xs text-slate-500 font-mono">Protein</span>
                                            <div className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded">
                                                {activeCase.wildtype.protein}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 pl-16 pt-1"><HighlightedText text={activeCase.wildtype.desc} /></p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3">Mutante (Krankheit)</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="w-16 text-xs text-slate-500 font-mono">DNA</span>
                                            <div className="font-mono bg-red-50 px-3 py-1 rounded border border-red-200 text-slate-700 relative">
                                                ...{activeCase.mutant.dna}...
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-16 text-xs text-slate-500 font-mono">mRNA</span>
                                            <div className="font-mono px-3 py-1 text-slate-500">
                                                ...{activeCase.mutant.mrna}...
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-16 text-xs text-slate-500 font-mono">Protein</span>
                                            <div className="font-bold text-red-700 bg-red-100 px-3 py-1 rounded">
                                                {activeCase.mutant.protein}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 pl-16 pt-1"><HighlightedText text={activeCase.mutant.desc} /></p>
                                    </div>
                                </div>

                                {/* Explanation Box */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-bold text-blue-800 mb-2 text-sm">Erklärung der Mutation</h4>
                                    <p className="text-sm text-blue-700">{activeCase.explanation}</p>
                                </div>
                            </div>

                            {/* Effect & Symptoms Description */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <IconActivity />
                                        <Term>Phänotyp</Term>ische Auswirkung
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        <HighlightedText text={activeCase.effect} />
                                    </p>
                                </div>
                                
                                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                                    <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                                        <IconAlert />
                                        Symptome
                                    </h3>
                                    <p className="text-red-800 leading-relaxed text-sm">
                                        <HighlightedText text={activeCase.symptoms} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // --- EXERCISE VIEW & SVG SUN ---

        const createSectorPath = (innerR, outerR, startAngle, endAngle) => {
            const x1 = 200 + innerR * Math.cos(Math.PI * startAngle / 180);
            const y1 = 200 + innerR * Math.sin(Math.PI * startAngle / 180);
            const x2 = 200 + outerR * Math.cos(Math.PI * startAngle / 180);
            const y2 = 200 + outerR * Math.sin(Math.PI * startAngle / 180);
            const x3 = 200 + outerR * Math.cos(Math.PI * endAngle / 180);
            const y3 = 200 + outerR * Math.sin(Math.PI * endAngle / 180);
            const x4 = 200 + innerR * Math.cos(Math.PI * endAngle / 180);
            const y4 = 200 + innerR * Math.sin(Math.PI * endAngle / 180);
            return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1} Z`;
        };

        const CodonSun = ({ onClickBase, currentPath, interactive = true }) => {
            const colors = { 'U': '#fbbf24', 'C': '#60a5fa', 'A': '#f87171', 'G': '#4ade80' };

            const renderInnerRing = () => {
                return BASES.map((base, i) => {
                    const startAngle = i * 90;
                    const endAngle = (i + 1) * 90;
                    const isActive = currentPath.length === 0 || currentPath[0] === base;
                    
                    return (
                        <g key={`inner-${base}`} onClick={() => interactive && onClickBase(base, 0)} className={isActive ? "opacity-100" : "opacity-20 pointer-events-none"}>
                            <path d={createSectorPath(30, 80, startAngle, endAngle)} fill={colors[base]} stroke="white" strokeWidth="2" className={interactive ? "codon-sun-segment" : ""} />
                            <text x={200 + 55 * Math.cos(Math.PI * (startAngle+45)/180)} y={200 + 55 * Math.sin(Math.PI * (startAngle+45)/180)} textAnchor="middle" dominantBaseline="middle" className="font-bold text-white text-lg pointer-events-none">{base}</text>
                        </g>
                    )
                });
            };

            const renderMiddleRing = () => {
                let segments = [];
                BASES.forEach((b1, i1) => {
                    BASES.forEach((b2, i2) => {
                        const startAngle = (i1 * 90) + (i2 * 22.5);
                        const endAngle = startAngle + 22.5;
                        const isParentSelected = currentPath.length > 0 && currentPath[0] === b1;
                        const isActive = isParentSelected && (currentPath.length === 1 || currentPath[1] === b2);

                        if(currentPath.length === 0 || isParentSelected) {
                            segments.push(
                                <g key={`mid-${b1}-${b2}`} onClick={(e) => { e.stopPropagation(); interactive && onClickBase(b2, 1); }} className={isActive ? "opacity-100" : "opacity-30"}>
                                    <path d={createSectorPath(80, 130, startAngle, endAngle)} fill={colors[b2]} stroke="white" strokeWidth="1" className={interactive ? "codon-sun-segment" : ""} />
                                    <text x={200 + 105 * Math.cos(Math.PI * (startAngle+11.25)/180)} y={200 + 105 * Math.sin(Math.PI * (startAngle+11.25)/180)} textAnchor="middle" dominantBaseline="middle" className="font-bold text-white text-sm pointer-events-none">{b2}</text>
                                </g>
                            );
                        }
                    });
                });
                return segments;
            };

            const renderOuterRing = () => {
                 let segments = [];
                 if (currentPath.length < 2) return null; 

                 const b1 = currentPath[0];
                 const b2 = currentPath[1];
                 const i1 = BASES.indexOf(b1);
                 const i2 = BASES.indexOf(b2);

                 BASES.forEach((b3, i3) => {
                     const baseAngle = (i1 * 90) + (i2 * 22.5);
                     const startAngle = baseAngle + (i3 * 5.625);
                     const endAngle = startAngle + 5.625;
                     
                     const triplet = b1 + b2 + b3;
                     const aa = CODON_TABLE[triplet];
                     
                     const midAngle = startAngle + 2.8125;
                     const rad = Math.PI * midAngle / 180;
                     const rotateAngle = (midAngle > 90 && midAngle < 270) ? midAngle + 180 : midAngle;

                     segments.push(
                         <g key={`out-${b1}-${b2}-${b3}`} onClick={(e) => { e.stopPropagation(); interactive && onClickBase(b3, 2); }}>
                            <path d={createSectorPath(130, 170, startAngle, endAngle)} fill={colors[b3]} stroke="white" strokeWidth="0.5" className={interactive ? "codon-sun-segment" : ""} />
                            <text x={200 + 150 * Math.cos(rad)} y={200 + 150 * Math.sin(rad)} textAnchor="middle" dominantBaseline="middle" className="font-bold text-white text-[8px] pointer-events-none">{b3}</text>
                            
                            {currentPath.length === 2 && (
                                <g transform={`translate(${200 + 185 * Math.cos(rad)}, ${200 + 185 * Math.sin(rad)}) rotate(${rotateAngle})`}>
                                    <text textAnchor="middle" dominantBaseline="middle" className="text-[7px] fill-slate-500 font-bold tracking-tighter uppercase">{aa}</text>
                                </g>
                            )}
                         </g>
                     )
                 });
                 return segments;
            }

            return (
                <div className="relative w-[450px] h-[450px] mx-auto select-none flex items-center justify-center" role="img" aria-label="Interaktive Code-Sonne zur Bestimmung von Aminosäuren">
                    <svg width="450" height="450" viewBox="0 0 400 400">
                        <circle cx="200" cy="200" r="195" fill="#f8fafc" />
                        {renderInnerRing()}
                        {renderMiddleRing()}
                        {renderOuterRing()}
                        <circle cx="200" cy="200" r="25" fill="white" stroke="#e2e8f0" />
                        <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" className="font-bold text-slate-400 text-xs">5'</text>
                    </svg>
                </div>
            );
        };

        const ExerciseView = () => {
            const [selectedScenario, setSelectedScenario] = useState(null);
            const [currentTask, setCurrentTask] = useState('wildtype');
            const [userPath, setUserPath] = useState([]);
            const [results, setResults] = useState({ wildtype: null, mutant: null });
            const [feedback, setFeedback] = useState(null);
            const [difficulty, setDifficulty] = useState(loadProgress('difficulty', 'medium'));
            const [score, setScore] = useState(loadProgress('score', 0));
            const [completedScenarios, setCompletedScenarios] = useState(loadProgress('completedScenarios', []));
            const [showExplanation, setShowExplanation] = useState(false);
            
            const selectScenario = (sc) => {
                setSelectedScenario(sc);
                setCurrentTask('wildtype');
                setUserPath([]);
                setResults({ wildtype: null, mutant: null });
                setFeedback(null);
                setShowExplanation(false);
            };

            const handleBaseClick = (base, depth) => {
                if (depth !== userPath.length) return;
                const newPath = [...userPath, base];
                setUserPath(newPath);

                if (newPath.length === 3) {
                    const triplet = newPath.join('');
                    const aa = CODON_TABLE[triplet];
                    const expectedMrna = currentTask === 'wildtype' ? selectedScenario.wildtype.mrna : selectedScenario.mutant.mrna;
                    const expectedAa = CODON_TABLE[expectedMrna];
                    
                    setTimeout(() => {
                        if (aa === expectedAa) {
                            // Correct answer
                            setFeedback({
                                type: 'success',
                                message: `Richtig! ${aa} ist korrekt.`,
                                explanation: `Das Codon ${triplet} codiert für ${AMINO_ACID_INFO[aa]?.name || aa}.`
                            });
                            const newScore = score + (difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5);
                            setScore(newScore);
                            saveProgress('score', newScore);
                        } else {
                            // Wrong answer
                            setFeedback({
                                type: 'error',
                                message: `Nicht ganz. Du hast ${aa} gewählt, aber ${expectedAa} ist korrekt.`,
                                explanation: `Das Codon ${expectedMrna} codiert für ${AMINO_ACID_INFO[expectedAa]?.name || expectedAa}. Das Codon ${triplet} codiert für ${AMINO_ACID_INFO[aa]?.name || aa}.`
                            });
                            setShowExplanation(true);
                        }
                        
                        setResults(prev => ({ ...prev, [currentTask]: aa }));
                        setUserPath([]);
                        
                        if (currentTask === 'wildtype') {
                            setCurrentTask('mutant');
                            setFeedback(null);
                        } else {
                            // Scenario completed
                            if (!completedScenarios.includes(selectedScenario.id)) {
                                const newCompleted = [...completedScenarios, selectedScenario.id];
                                setCompletedScenarios(newCompleted);
                                saveProgress('completedScenarios', newCompleted);
                            }
                        }
                    }, 500);
                }
            };

            const handleDifficultyChange = (newDifficulty) => {
                setDifficulty(newDifficulty);
                saveProgress('difficulty', newDifficulty);
            };

            const resetProgress = () => {
                setScore(0);
                setCompletedScenarios([]);
                saveProgress('score', 0);
                saveProgress('completedScenarios', []);
            };

            if (!selectedScenario) {
                return (
                    <div className="fade-in space-y-6" role="region" aria-labelledby="exercises-heading">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <h2 id="exercises-heading" className="text-xl font-bold text-green-800">Wähle ein Fallbeispiel zur Analyse</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <IconTrophy />
                                    <span className="font-bold text-green-700">{score} Punkte</span>
                                </div>
                                <button 
                                    onClick={resetProgress}
                                    className="text-sm text-slate-500 hover:text-red-600 underline"
                                    aria-label="Fortschritt zurücksetzen"
                                >
                                    Zurücksetzen
                                </button>
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-700 mb-3">Schwierigkeitsgrad</h3>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Schwierigkeitsgrad wählen">
                                {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleDifficultyChange(key)}
                                        role="radio"
                                        aria-checked={difficulty === key}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            difficulty === key
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">{DIFFICULTY_LEVELS[difficulty].description}</p>
                        </div>

                        {/* Progress */}
                        <ProgressBar 
                            current={completedScenarios.length} 
                            total={SCENARIOS.length} 
                            label="Abgeschlossene Szenarien" 
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SCENARIOS.map(sc => {
                                const isCompleted = completedScenarios.includes(sc.id);
                                return (
                                    <button 
                                        key={sc.id} 
                                        onClick={() => selectScenario(sc)} 
                                        className={`bg-white p-6 rounded-xl border shadow hover:shadow-md transition-all text-left group ${
                                            isCompleted ? 'border-green-300 bg-green-50' : 'border-slate-200'
                                        }`}
                                        aria-label={`${sc.title}${isCompleted ? ' - Abgeschlossen' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-green-600 group-hover:scale-110 transition-transform"><IconMicroscope /></div>
                                            {isCompleted && <IconCheck />}
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{sc.title}</h3>
                                        <p className="text-sm text-slate-500 mb-2">Analysiere die Mutation im {sc.gene}-Gen.</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMutationTypeColor(sc.mutationType)}`}>
                                            {getMutationTypeLabel(sc.mutationType)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            const isDone = results.wildtype && results.mutant;

            return (
                <div className="grid lg:grid-cols-2 gap-8 items-start fade-in" role="region" aria-label="Übung: ${selectedScenario.title}">
                    <div className="space-y-8">
                        <button onClick={() => setSelectedScenario(null)} className="text-sm text-slate-400 hover:text-green-600 flex items-center gap-1 mb-2">
                            ← Zurück zur Auswahl
                        </button>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h2 className="text-xl font-bold text-slate-800">{selectedScenario.title}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMutationTypeColor(selectedScenario.mutationType)}`}>
                                    {getMutationTypeLabel(selectedScenario.mutationType)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">Bestimme die Aminosäuren für die gesunde und die mutierte Sequenz mithilfe der Code-Sonne.</p>

                            {/* Feedback */}
                            {feedback && (
                                <div className="mb-4">
                                    <FeedbackMessage {...feedback} />
                                </div>
                            )}

                            {/* Wildtype Row */}
                            <div className={`p-4 rounded-lg border transition-all mb-4 ${currentTask === 'wildtype' && !results.wildtype ? 'bg-green-50 border-green-300 ring-2 ring-green-100' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Wildtyp (Gesund)</span>
                                    {results.wildtype && <span className="text-green-600 flex items-center gap-1 text-sm font-bold"><IconCheck /> Gelöst</span>}
                                </div>
                                <div className="font-mono text-lg tracking-widest text-slate-700 mb-2">
                                    ...{selectedScenario.wildtype.mrna}...
                                </div>
                                <div className="flex items-center">
                                    {results.wildtype ? (
                                        <div className={`px-3 py-1 rounded text-sm font-bold ${results.wildtype === CODON_TABLE[selectedScenario.wildtype.mrna] ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {results.wildtype} ({selectedScenario.wildtype.desc.split(' ')[0]})
                                        </div>
                                    ) : (
                                        <div className="w-32 h-8 border-2 border-dashed border-blue-300 rounded flex items-center justify-center text-blue-300 text-xs font-mono bg-blue-50">
                                            ???
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mutant Row */}
                            <div className={`p-4 rounded-lg border transition-all ${currentTask === 'mutant' && !results.mutant ? 'bg-red-50 border-red-300 ring-2 ring-red-100' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mutante (Krankheit)</span>
                                    {results.mutant && <span className="text-red-600 flex items-center gap-1 text-sm font-bold"><IconCheck /> Gelöst</span>}
                                </div>
                                <div className="font-mono text-lg tracking-widest text-slate-700 mb-2">
                                    ...{selectedScenario.mutant.mrna}...
                                </div>
                                <div className="flex items-center">
                                    {results.mutant ? (
                                        <div className={`px-3 py-1 rounded text-sm font-bold ${results.mutant === CODON_TABLE[selectedScenario.mutant.mrna] ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {results.mutant} ({selectedScenario.mutant.desc.split(' ')[0]})
                                        </div>
                                    ) : (
                                        <div className="w-32 h-8 border-2 border-dashed border-blue-300 rounded flex items-center justify-center text-blue-300 text-xs font-mono bg-blue-50">
                                            ???
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Explanation Panel */}
                        {showExplanation && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg fade-in">
                                <h4 className="font-bold text-blue-900 mb-2">Erklärung</h4>
                                <p className="text-sm text-blue-800 mb-2">{selectedScenario.explanation}</p>
                                <p className="text-xs text-blue-600 italic">
                                    "{selectedScenario.effect}"
                                </p>
                            </div>
                        )}

                        {isDone && (
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg fade-in">
                                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                    <IconTrophy /> Analyse abgeschlossen!
                                </h4>
                                <p className="text-sm text-green-800 mb-2">
                                    Du hast erfolgreich ermittelt: 
                                    <strong> {results.wildtype}</strong> wurde durch <strong>{results.mutant}</strong> ersetzt.
                                </p>
                                <p className="text-xs text-green-600 italic">
                                    "{selectedScenario.effect}"
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-inner border border-slate-100 min-h-[500px]">
                        {!isDone ? (
                            <>
                                <div className="mb-4 text-center">
                                    <span className="text-sm font-medium text-slate-500">Aktuelles Triplett:</span>
                                    <div className="text-2xl font-mono font-bold text-slate-800 mt-1">
                                        {currentTask === 'wildtype' ? selectedScenario.wildtype.mrna : selectedScenario.mutant.mrna}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">Klicke von Innen nach Außen</div>
                                </div>
                                <CodonSun onClickBase={handleBaseClick} currentPath={userPath} />
                                <div className="h-8 mt-4 font-bold text-slate-700 flex items-center justify-center gap-1" aria-live="polite">
                                    {userPath.map((b,i) => <span key={i} className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{b}</span>)}
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Gut gemacht!</h3>
                                <p className="text-slate-600 mb-4">Du hast +{difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5} Punkte erhalten!</p>
                                <button onClick={() => setSelectedScenario(null)} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors shadow">
                                    Nächstes Beispiel wählen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // --- MAIN APP ---

        const App = () => {
            const [activeTab, setActiveTab] = useState('methodik');
            const [darkMode, setDarkMode] = useState(loadProgress('darkMode', false));

            useEffect(() => {
                if (darkMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                saveProgress('darkMode', darkMode);
            }, [darkMode]);

            const toggleDarkMode = () => setDarkMode(!darkMode);

            const handlePrint = () => {
                window.print();
            };

            const renderContent = () => {
                switch(activeTab) {
                    case 'methodik': return <MethodikView />;
                    case 'simulation': return <SimulationView />;
                    case 'cases': return <CaseStudyView />;
                    case 'exercises': return <ExerciseView />;
                    default: return <MethodikView />;
                }
            };

            return (
                <div className="max-w-6xl mx-auto p-4 md:p-6">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 bg-white rounded-t-xl p-6 shadow-sm">
                        <div>
                            <h1 className="text-3xl font-extrabold text-green-700 tracking-tight flex items-center gap-3">
                                <IconDna /> Genetik Labor
                            </h1>
                            <p className="text-slate-500 mt-1">Interaktive Sequenzanalyse & Proteinbiosynthese</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-3">
                            <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">Oberstufe Biologie</span>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                                aria-label={darkMode ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
                                title={darkMode ? 'Heller Modus' : 'Dunkler Modus'}
                            >
                                {darkMode ? <IconSun /> : <IconMoon />}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                                aria-label="Drucken"
                                title="Drucken"
                            >
                                <IconPrint />
                            </button>
                        </div>
                    </header>

                    <nav className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-lg w-fit mx-auto md:mx-0" role="tablist" aria-label="Hauptnavigation">
                        {[
                            { id: 'methodik', label: 'Methodik', icon: IconBook },
                            { id: 'simulation', label: 'Simulation', icon: IconActivity },
                            { id: 'cases', label: 'Fallbeispiele', icon: IconMicroscope },
                            { id: 'exercises', label: 'Übungen', icon: IconDna }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`panel-${tab.id}`}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-white text-green-700 shadow-md transform scale-105' 
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                <tab.icon />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <main id="main-content" className="min-h-[600px]" role="main">
                        {renderContent()}
                    </main>

                    <footer className="mt-12 text-center text-slate-400 text-sm border-t pt-6">
                        <p>&copy; 2024 EduBio - Interaktives Lehrmaterial Genetik</p>
                    </footer>
                </div>
            );
        };

        
    
export default App;
