import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { COLORS } from '../constants';

const StrandComparison: React.FC = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Leitstrang vs. Folgestrang</h2>
        <p className="mb-6 text-gray-600">
            Warum ist die Replikation so kompliziert? Das liegt an zwei Faktoren: 
            1. DNA-Stränge sind <strong>antiparallel</strong>. 
            2. Die DNA-Polymerase funktioniert nur in <strong>5'→3'</strong> Richtung.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* Leitstrang Card */}
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-green-50 p-4 border-b border-green-100">
                    <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
                        <ArrowRight /> Leitstrang
                    </h3>
                    <p className="text-sm text-green-700">Kontinuierliche Synthese</p>
                </div>
                <div className="p-4 relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {/* Visual */}
                    <svg viewBox="0 0 300 100" className="w-full h-full">
                        {/* Template 3'-5' (relative to polymerase movement) */}
                        <path d="M 0,80 L 300,80" stroke={COLORS.strand2} strokeWidth="4" />
                        <text x="5" y="95" fontSize="10" fill={COLORS.strand2}>5'</text>
                        <text x="280" y="95" fontSize="10" fill={COLORS.strand2}>3'</text>

                        {/* New Strand */}
                        <path d={`M 0,60 L ${active ? 250 : 100},60`} stroke={COLORS.newStrand2} strokeWidth="4" className="transition-all duration-[2000ms] ease-linear" />
                        {/* Primer */}
                        <line x1="0" y1="60" x2="20" y2="60" stroke={COLORS.primer} strokeWidth="4" />
                        
                        {/* Arrow */}
                        <defs>
                             <marker id="arrowHeadGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.polymerase} />
                            </marker>
                        </defs>
                        <line x1="20" y1="40" x2={active ? 250 : 100} y2="40" stroke={COLORS.polymerase} strokeWidth="2" markerEnd="url(#arrowHeadGreen)" />
                        <text x="50" y="30" fontSize="10" fill={COLORS.polymerase}>5' → 3' Synthese</text>
                    </svg>
                </div>
                <ul className="p-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">✅ Benötigt nur <strong>1 Primer</strong></li>
                    <li className="flex items-center gap-2">✅ Wächst <strong>in Richtung</strong> der Gabel</li>
                    <li className="flex items-center gap-2">✅ <strong>Keine</strong> Lücken</li>
                </ul>
            </div>

            {/* Folgestrang Card */}
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-red-50 p-4 border-b border-red-100">
                    <h3 className="text-xl font-bold text-red-800 flex items-center gap-2">
                        <ArrowLeft /> Folgestrang
                    </h3>
                    <p className="text-sm text-red-700">Diskontinuierliche Synthese</p>
                </div>
                <div className="p-4 relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                     {/* Visual */}
                     <svg viewBox="0 0 300 100" className="w-full h-full">
                        {/* Template */}
                        <path d="M 0,20 L 300,20" stroke={COLORS.strand1} strokeWidth="4" />
                        <text x="5" y="15" fontSize="10" fill={COLORS.strand1}>3'</text>
                        <text x="280" y="15" fontSize="10" fill={COLORS.strand1}>5'</text>

                        {/* Fragments */}
                        {/* Fragment 1 */}
                        <line x1="50" y1="40" x2="100" y2="40" stroke={COLORS.newStrand1} strokeWidth="4" />
                        <line x1="100" y1="40" x2="110" y2="40" stroke={COLORS.primer} strokeWidth="4" />
                        
                        {/* Fragment 2 (appears later) */}
                        <g opacity={active ? 1 : 0.3} className="transition-opacity duration-1000">
                            <line x1="150" y1="40" x2="200" y2="40" stroke={COLORS.newStrand1} strokeWidth="4" />
                            <line x1="200" y1="40" x2="210" y2="40" stroke={COLORS.primer} strokeWidth="4" />
                        </g>

                        {/* Arrows showing backward synthesis */}
                        <line x1="100" y1="55" x2="60" y2="55" stroke={COLORS.polymerase} strokeWidth="2" markerEnd="url(#arrowHeadGreen)" />
                        <line x1="200" y1="55" x2="160" y2="55" stroke={COLORS.polymerase} strokeWidth="2" opacity={active ? 1 : 0.3} markerEnd="url(#arrowHeadGreen)" />
                        
                        <text x="120" y="80" fontSize="10" fill={COLORS.polymerase}>Rückwärts zur Gabel!</text>
                    </svg>
                </div>
                <ul className="p-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">⚠️ Benötigt <strong>viele Primer</strong></li>
                    <li className="flex items-center gap-2">⚠️ Wächst <strong>weg von</strong> der Gabel</li>
                    <li className="flex items-center gap-2">⚠️ Bildet <strong>Okazaki-Fragmente</strong></li>
                </ul>
            </div>

        </div>

        <div className="mt-8 flex justify-center">
            <button 
                onClick={() => setActive(!active)}
                className="flex items-center gap-2 bg-[#2C3E50] text-white px-6 py-3 rounded-full hover:bg-[#34495E] transition-transform active:scale-95"
            >
                <RefreshCw /> {active ? "Reset" : "Animation starten"}
            </button>
        </div>
      </div>
      
      {/* Quiz Interaction */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2">Selbsttest</h4>
          <p className="mb-4">Welcher Strang benötigt mehr Energie in Form von ATP/GTP für die Ligase?</p>
          <details className="cursor-pointer group">
              <summary className="font-medium text-indigo-600 hover:text-indigo-800">Antwort anzeigen</summary>
              <div className="mt-2 text-gray-700 bg-white p-3 rounded">
                  Der <strong>Folgestrang</strong>. Da hier viele Okazaki-Fragmente verknüpft werden müssen, muss die Ligase viel häufiger arbeiten. Jede Verknüpfung verbraucht ATP.
              </div>
          </details>
      </div>
    </div>
  );
};

export default StrandComparison;