import React, { useState, useEffect } from 'react';
import { IconDna, IconRefresh } from './Icons';

// --- Types & Constants ---

type Nucleotide = 'A' | 'T' | 'G' | 'C' | 'U';
type AminoAcid = { short: string; long: string; color: string };

interface BiologyState {
  dnaSequence: Nucleotide[];
  rnaSequence: (Nucleotide | null)[];
  aminoAcids: (AminoAcid | null)[];
  score: number;
  message: string;
  stage: 'transcription' | 'translation';
}

const CODON_TABLE: Record<string, AminoAcid> = {
  'UUU': { short: 'Phe', long: 'Phenylalanin', color: 'bg-red-200' }, 'UUC': { short: 'Phe', long: 'Phenylalanin', color: 'bg-red-200' },
  'UUA': { short: 'Leu', long: 'Leucin', color: 'bg-orange-200' }, 'UUG': { short: 'Leu', long: 'Leucin', color: 'bg-orange-200' },
  'UCU': { short: 'Ser', long: 'Serin', color: 'bg-yellow-200' }, 'UCC': { short: 'Ser', long: 'Serin', color: 'bg-yellow-200' },
  'UCA': { short: 'Ser', long: 'Serin', color: 'bg-yellow-200' }, 'UCG': { short: 'Ser', long: 'Serin', color: 'bg-yellow-200' },
  'UAU': { short: 'Tyr', long: 'Tyrosin', color: 'bg-green-200' }, 'UAC': { short: 'Tyr', long: 'Tyrosin', color: 'bg-green-200' },
  'UGU': { short: 'Cys', long: 'Cystein', color: 'bg-teal-200' }, 'UGC': { short: 'Cys', long: 'Cystein', color: 'bg-teal-200' },
  'UGG': { short: 'Trp', long: 'Tryptophan', color: 'bg-blue-200' },
  'CUU': { short: 'Leu', long: 'Leucin', color: 'bg-orange-200' }, 'CUC': { short: 'Leu', long: 'Leucin', color: 'bg-orange-200' },
  'CUA': { short: 'Leu', long: 'Leucin', color: 'bg-orange-200' }, 'CUG': { short: 'Leu', long: 'Leucin', color: 'bg-orange-200' },
  'CCU': { short: 'Pro', long: 'Prolin', color: 'bg-indigo-200' }, 'CCC': { short: 'Pro', long: 'Prolin', color: 'bg-indigo-200' },
  'CCA': { short: 'Pro', long: 'Prolin', color: 'bg-indigo-200' }, 'CCG': { short: 'Pro', long: 'Prolin', color: 'bg-indigo-200' },
  'CAU': { short: 'His', long: 'Histidin', color: 'bg-purple-200' }, 'CAC': { short: 'His', long: 'Histidin', color: 'bg-purple-200' },
  'CAA': { short: 'Gln', long: 'Glutamin', color: 'bg-pink-200' }, 'CAG': { short: 'Gln', long: 'Glutamin', color: 'bg-pink-200' },
  'CGU': { short: 'Arg', long: 'Arginin', color: 'bg-rose-200' }, 'CGC': { short: 'Arg', long: 'Arginin', color: 'bg-rose-200' },
  'CGA': { short: 'Arg', long: 'Arginin', color: 'bg-rose-200' }, 'CGG': { short: 'Arg', long: 'Arginin', color: 'bg-rose-200' },
  'AUU': { short: 'Ile', long: 'Isoleucin', color: 'bg-lime-200' }, 'AUC': { short: 'Ile', long: 'Isoleucin', color: 'bg-lime-200' },
  'AUA': { short: 'Ile', long: 'Isoleucin', color: 'bg-lime-200' },
  'AUG': { short: 'Met', long: 'Methionin (Start)', color: 'bg-emerald-300' },
  'ACU': { short: 'Thr', long: 'Threonin', color: 'bg-cyan-200' }, 'ACC': { short: 'Thr', long: 'Threonin', color: 'bg-cyan-200' },
  'ACA': { short: 'Thr', long: 'Threonin', color: 'bg-cyan-200' }, 'ACG': { short: 'Thr', long: 'Threonin', color: 'bg-cyan-200' },
  'AAU': { short: 'Asn', long: 'Asparagin', color: 'bg-sky-200' }, 'AAC': { short: 'Asn', long: 'Asparagin', color: 'bg-sky-200' },
  'AAA': { short: 'Lys', long: 'Lysin', color: 'bg-violet-200' }, 'AAG': { short: 'Lys', long: 'Lysin', color: 'bg-violet-200' },
  'AGU': { short: 'Ser', long: 'Serin', color: 'bg-yellow-200' }, 'AGC': { short: 'Ser', long: 'Serin', color: 'bg-yellow-200' },
  'AGA': { short: 'Arg', long: 'Arginin', color: 'bg-rose-200' }, 'AGG': { short: 'Arg', long: 'Arginin', color: 'bg-rose-200' },
  'GUU': { short: 'Val', long: 'Valin', color: 'bg-amber-200' }, 'GUC': { short: 'Val', long: 'Valin', color: 'bg-amber-200' },
  'GUA': { short: 'Val', long: 'Valin', color: 'bg-amber-200' }, 'GUG': { short: 'Val', long: 'Valin', color: 'bg-amber-200' },
  'GCU': { short: 'Ala', long: 'Alanin', color: 'bg-fuchsia-200' }, 'GCC': { short: 'Ala', long: 'Alanin', color: 'bg-fuchsia-200' },
  'GCA': { short: 'Ala', long: 'Alanin', color: 'bg-fuchsia-200' }, 'GCG': { short: 'Ala', long: 'Alanin', color: 'bg-fuchsia-200' },
  'GAU': { short: 'Asp', long: 'Asparaginsäure', color: 'bg-stone-200' }, 'GAC': { short: 'Asp', long: 'Asparaginsäure', color: 'bg-stone-200' },
  'GAA': { short: 'Glu', long: 'Glutaminsäure', color: 'bg-gray-200' }, 'GAG': { short: 'Glu', long: 'Glutaminsäure', color: 'bg-gray-200' },
  'GGU': { short: 'Gly', long: 'Glycin', color: 'bg-slate-200' }, 'GGC': { short: 'Gly', long: 'Glycin', color: 'bg-slate-200' },
  'GGA': { short: 'Gly', long: 'Glycin', color: 'bg-slate-200' }, 'GGG': { short: 'Gly', long: 'Glycin', color: 'bg-slate-200' },
  'UAA': { short: 'STOP', long: 'Stop-Codon', color: 'bg-red-400' },
  'UAG': { short: 'STOP', long: 'Stop-Codon', color: 'bg-red-400' },
  'UGA': { short: 'STOP', long: 'Stop-Codon', color: 'bg-red-400' },
};

// --- SVG Codon Sun Component ---

const CodonSun = () => {
  // Helpers for SVG math
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const createSector = (index: number, total: number, innerR: number, outerR: number, label: string, fill: string) => {
    const startAngle = (index * 360) / total;
    const endAngle = ((index + 1) * 360) / total;
    
    const start = polarToCartesian(200, 200, outerR, endAngle);
    const end = polarToCartesian(200, 200, outerR, startAngle);
    const innerStart = polarToCartesian(200, 200, innerR, endAngle);
    const innerEnd = polarToCartesian(200, 200, innerR, startAngle);

    const path = [
      "M", start.x, start.y,
      "A", outerR, outerR, 0, 0, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerR, innerR, 0, 0, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");

    // Text Position (middle of sector)
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const textRadius = innerR + (outerR - innerR) / 2;
    const textPos = polarToCartesian(200, 200, textRadius, midAngle);

    // Rotate text for readability if needed
    const rotateText = (innerR > 130) ? `rotate(${midAngle > 180 ? midAngle + 90 : midAngle - 90}, ${textPos.x}, ${textPos.y})` : '';

    return (
      <g key={`${innerR}-${index}`}>
        <path d={path} fill={fill} stroke="white" strokeWidth="1" />
        <text 
            x={textPos.x} 
            y={textPos.y} 
            fill={innerR > 100 ? "#333" : "white"}
            fontSize={innerR > 140 ? "8" : "12"}
            fontWeight="bold"
            textAnchor="middle" 
            alignmentBaseline="middle"
            transform={rotateText}
        >
          {label}
        </text>
      </g>
    );
  };

  const bases = ['G', 'A', 'C', 'U']; 
  const colors = {'G': '#f59e0b', 'A': '#ef4444', 'C': '#3b82f6', 'U': '#10b981'};
  
  const rings = [];

  // Ring 1 (Inner)
  bases.forEach((base, i) => {
    rings.push(createSector(i, 4, 30, 80, base, colors[base as keyof typeof colors]));
  });

  // Ring 2
  const ring2Bases = [];
  for(let i=0; i<4; i++) {
      bases.forEach(b => ring2Bases.push(b));
  }
  ring2Bases.forEach((base, i) => {
    rings.push(createSector(i, 16, 80, 130, base, colors[base as keyof typeof colors]));
  });

  // Ring 3 (Outer Bases)
  const ring3Bases = [];
  for(let i=0; i<16; i++) {
      bases.forEach(b => ring3Bases.push(b));
  }
  ring3Bases.forEach((base, i) => {
      rings.push(createSector(i, 64, 130, 160, base, "#f3f4f6"));
  });

  // Ring 4: Amino Acids
  ring3Bases.forEach((_, i) => {
      const b1 = bases[Math.floor(i / 16)];
      const b2 = bases[Math.floor((i % 16) / 4)];
      const b3 = bases[i % 4];
      const codon = b1 + b2 + b3;
      const amino = CODON_TABLE[codon]?.short || '';
      
      rings.push(createSector(i, 64, 160, 195, amino, "white"));
  });

  return (
    <div className="flex flex-col items-center">
        <h4 className="text-sm font-bold text-gray-500 mb-2">Codesonne (Innen nach Außen: 1. → 2. → 3. Base)</h4>
        <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto drop-shadow-md">
            <circle cx="200" cy="200" r="198" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
            {rings}
            <circle cx="200" cy="200" r="30" fill="white" />
            <text x="200" y="200" textAnchor="middle" alignmentBaseline="middle" fontSize="10" fontWeight="bold" fill="#9ca3af">Start</text>
        </svg>
    </div>
  );
};


// --- Component ---

export const ProteinSynthesis = () => {
  const [dna, setDna] = useState<Nucleotide[]>([]);
  const [mrna, setMrna] = useState<(Nucleotide | null)[]>([]);
  const [aminoChain, setAminoChain] = useState<(AminoAcid | null)[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0); 
  const [stage, setStage] = useState<'transcription' | 'translation'>('transcription');
  const [feedback, setFeedback] = useState<string>('Beginne mit der Transkription! Wähle die passende Base.');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSun, setShowSun] = useState(false);

  // Start new game
  const initGame = () => {
    const bases: Nucleotide[] = ['A', 'T', 'G', 'C'];
    const start: Nucleotide[] = ['T', 'A', 'C'];
    const chunks = 3; 
    let sequence: Nucleotide[] = [...start];
    
    for (let i = 0; i < chunks * 3; i++) {
      sequence.push(bases[Math.floor(Math.random() * bases.length)] as Nucleotide);
    }
    sequence.push('A', 'C', 'T'); // Stop codon TGA -> RNA UGA

    setDna(sequence);
    setMrna(new Array(sequence.length).fill(null));
    setAminoChain(new Array(sequence.length / 3).fill(null));
    setStage('transcription');
    setCurrentIdx(0);
    setFeedback('Transkribiere die DNA in mRNA. Welche Base passt zu ' + sequence[0] + '?');
    setIsCorrect(null);
    setShowSun(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Handle Base Input
  const handleBaseClick = (base: Nucleotide) => {
    if (stage !== 'transcription') return;

    const templateBase = dna[currentIdx];
    let correctMatch = '';
    
    switch(templateBase) {
      case 'A': correctMatch = 'U'; break;
      case 'T': correctMatch = 'A'; break;
      case 'G': correctMatch = 'C'; break;
      case 'C': correctMatch = 'G'; break;
    }

    if (base === correctMatch) {
      const newMrna = [...mrna];
      newMrna[currentIdx] = base;
      setMrna(newMrna);
      setIsCorrect(true);
      
      if (currentIdx + 1 < dna.length) {
        setCurrentIdx(prev => prev + 1);
        setFeedback('Richtig! Nächste Base.');
      } else {
        setTimeout(() => {
          setStage('translation');
          setCurrentIdx(0);
          setFeedback('Super! Die mRNA ist fertig. Jetzt zur Translation. Nutze die Codesonne!');
          setIsCorrect(null);
          setShowSun(true);
        }, 800);
      }
    } else {
      setIsCorrect(false);
      setFeedback(`Falsch. ${templateBase} paart sich in der RNA mit ${correctMatch}.`);
    }
  };

  // Handle Amino Acid Input
  const handleAminoSelection = (code3: string) => {
    if (stage !== 'translation') return;

    const codonStart = currentIdx * 3;
    const codon = mrna.slice(codonStart, codonStart + 3).join('');
    
    const correctAmino = CODON_TABLE[codon];
    
    if (correctAmino && correctAmino.short === code3) {
      const newChain = [...aminoChain];
      newChain[currentIdx] = correctAmino;
      setAminoChain(newChain);
      setIsCorrect(true);
      setFeedback(`Korrekt! ${codon} codiert für ${correctAmino.long}.`);

      if (currentIdx + 1 < aminoChain.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setFeedback('Glückwunsch! Protein synthetisiert! 🎉');
        setIsCorrect(true);
      }
    } else {
      setIsCorrect(false);
      setFeedback(`Das ist nicht korrekt. Suche ${codon} in der Codesonne.`);
    }
  };

  const filteredAminos = Object.entries(CODON_TABLE)
    .reduce((acc, [codon, amino]) => {
      if (!acc.find(a => a.short === amino.short)) {
        acc.push(amino);
      }
      return acc;
    }, [] as AminoAcid[])
    .sort((a, b) => a.short.localeCompare(b.short));

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-teal-600 text-white flex items-center gap-3 shadow-sm justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
            <IconDna className="text-white" />
            </div>
            <div>
            <h2 className="text-xl font-bold">Transkriptions & Translations Trainer</h2>
            <p className="text-teal-100 text-sm">Proteinbiosynthese Schritt für Schritt</p>
            </div>
        </div>
        <button onClick={initGame} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <IconRefresh />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8 flex flex-col gap-6">
        
        {/* Status Bar */}
        <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex gap-2 text-sm font-semibold">
             <span className={`px-3 py-1 rounded-full ${stage === 'transcription' ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500' : 'bg-gray-100 text-gray-400'}`}>1. Transkription</span>
             <span className={`px-3 py-1 rounded-full ${stage === 'translation' ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500' : 'bg-gray-100 text-gray-400'}`}>2. Translation</span>
           </div>
           <div className={`text-sm font-medium px-4 py-2 rounded-lg ${isCorrect === true ? 'bg-green-100 text-green-700' : isCorrect === false ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
             {feedback}
           </div>
        </div>

        {/* Work Area & Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Action Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center gap-8">
                
                {/* DNA Strand Display Container */}
                <div className="w-full overflow-x-auto pb-20">
                    <div className="flex gap-2 justify-center min-w-max items-start">
                        
                        {/* Row Labels (Fixed width column) */}
                        <div className="mr-4 flex flex-col items-end gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pt-[2px]">
                            {/* Matches DNA row height */}
                            <div className="h-10 flex items-center">DNA</div>
                            
                            {/* Matches Linker 1 height */}
                            <div className="h-4"></div>
                            
                            {/* Matches mRNA row height */}
                            <div className="h-10 flex items-center">mRNA</div>

                            {/* Matches Linker 2 height */}
                            <div className="h-8"></div>

                            {/* Matches Protein row height */}
                            <div className="h-10 flex items-center">Protein</div>
                        </div>

                        {/* Sequences */}
                        {dna.map((base, idx) => {
                            const isCurrent = stage === 'transcription' && idx === currentIdx;
                            const codonIndex = Math.floor(idx / 3);
                            const isCodonCurrent = stage === 'translation' && codonIndex === currentIdx;
                            const isStartOfCodon = idx % 3 === 0;
                            const gapClass = isStartOfCodon && idx !== 0 ? 'ml-4' : '';

                            return (
                                <div key={idx} className={`relative flex flex-col gap-2 items-center ${gapClass}`}>
                                    {/* DNA Base */}
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-lg transition-all
                                        ${isCurrent ? 'border-teal-500 bg-teal-50 scale-110 shadow-md ring-2 ring-teal-200 z-10' : 'border-gray-200 bg-gray-50 text-gray-400'}
                                    `}>
                                        {base}
                                    </div>

                                    {/* Linker DNA-mRNA */}
                                    <div className="h-4 w-0.5 bg-gray-200"></div>

                                    {/* mRNA Base Slot */}
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-lg transition-all
                                        ${mrna[idx] ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-100 border-dashed border-gray-300'}
                                        ${isCurrent ? 'ring-2 ring-teal-400 ring-offset-2 z-10' : ''}
                                        ${stage === 'translation' && isCodonCurrent ? 'bg-indigo-100 border-indigo-400 z-10' : ''}
                                    `}>
                                        {mrna[idx] || '?'}
                                    </div>

                                    {/* Amino Acid Section (Only on middle nucleotide of codon) */}
                                    {idx % 3 === 1 ? (
                                        <>
                                            {/* Linker mRNA-Protein (Visible Spacer) */}
                                            <div className="h-8 w-0.5 bg-gray-200 transition-all"></div>
                                            
                                            {/* Amino Acid Bubble - Absolute to column, but column has spacer height now */}
                                            <div className={`absolute top-[9.5rem] w-32 h-10 flex items-center justify-center rounded-full text-xs font-bold shadow-sm transition-all z-20 left-1/2 -translate-x-1/2
                                                ${aminoChain[Math.floor(idx/3)] ? aminoChain[Math.floor(idx/3)]?.color : 'bg-gray-100 text-gray-300 border border-gray-200'}
                                                ${stage === 'translation' && isCodonCurrent ? 'ring-2 ring-teal-400 scale-105 shadow-md' : ''}
                                            `}>
                                                {aminoChain[Math.floor(idx/3)]?.long || '...'}
                                            </div>
                                        </>
                                    ) : (
                                        /* Spacer for alignment in other columns */
                                        <div className="h-8 w-0.5 bg-transparent"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Interactive Controls */}
                <div className="w-full border-t border-gray-100 pt-6">
                    {stage === 'transcription' ? (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-gray-500">Wähle die passende RNA-Base:</p>
                            <div className="flex gap-4">
                                {['A', 'U', 'G', 'C'].map((nuc) => (
                                    <button
                                        key={nuc}
                                        onClick={() => handleBaseClick(nuc as Nucleotide)}
                                        className="w-16 h-16 rounded-2xl bg-white border-2 border-b-4 border-gray-200 active:border-b-2 hover:bg-gray-50 active:translate-y-0.5 text-xl font-bold text-gray-700 shadow-sm transition-all"
                                    >
                                        {nuc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 animate-fade-in">
                            <p className="text-sm text-gray-500">Wähle die Aminosäure für das aktuelle Codon:</p>
                            <div className="w-full flex gap-2 overflow-x-auto pb-2 px-2 max-w-full justify-center flex-wrap">
                                 {filteredAminos.map((amino) => (
                                     <button
                                        key={amino.short}
                                        onClick={() => handleAminoSelection(amino.short)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border border-b-2 transition-all hover:scale-105 ${amino.color} border-gray-300/50 hover:brightness-95`}
                                     >
                                        {amino.short}
                                     </button>
                                 ))}
                            </div>
                            <div className="mt-4 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-center">
                                Aktuelles Codon: <span className="font-mono font-bold text-lg text-indigo-600">{mrna.slice(currentIdx*3, currentIdx*3+3).join('')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Codon Sun Visualization */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center transition-all duration-500 ${showSun ? 'opacity-100' : 'opacity-50 blur-[1px]'}`}>
                {!showSun && stage === 'transcription' && (
                    <div className="absolute z-10 bg-white/80 p-4 rounded-xl text-center backdrop-blur-sm">
                        <p className="text-gray-500 font-medium">Die Codesonne wird in der Translations-Phase benötigt.</p>
                    </div>
                )}
                <CodonSun />
            </div>

        </div>

      </div>
    </div>
  );
};