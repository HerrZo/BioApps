import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { COLORS } from '../constants';

// Step Definitions
const SIM_STEPS = [
  { id: 0, text: "Ausgangssituation: Die DNA liegt als geschlossene Doppelhelix vor. Die Replikation beginnt am Origin." },
  { id: 1, text: "Die Helikase (gelb) bindet und öffnet die Wasserstoffbrücken. Die Replikationsgabel entsteht." },
  { id: 2, text: "Einzelstränge liegen frei als Matrizen vor. Beachte die 5' und 3' Enden." },
  { id: 3, text: "Leitstrang (unten): Die Primase (rot) synthetisiert einen RNA-Primer (5'→3')." },
  { id: 4, text: "Leitstrang: DNA-Polymerase (grün) verlängert den Primer kontinuierlich in Gabelrichtung." },
  { id: 5, text: "Folgestrang (oben): Primase synthetisiert einen Primer. Achtung: Synthese muss rückwärts laufen!" },
  { id: 6, text: "Folgestrang: DNA-Polymerase synthetisiert das erste Okazaki-Fragment." },
  { id: 7, text: "Folgestrang: Weitere Primer und Okazaki-Fragmente werden gebildet (diskontinuierlich)." },
  { id: 8, text: "Aufräumen: Enzyme entfernen die RNA-Primer und füllen Lücken mit DNA auf." },
  { id: 9, text: "Die DNA-Ligase (blau) verknüpft die Fragmente zu einem durchgehenden Strang." },
  { id: 10, text: "Abschluss: Zwei identische DNA-Doppelstränge sind entstanden (semikonservativ)." },
];

const ReplicationSimulator: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [config, setConfig] = useState({
    helicase: true,
    primase: true,
    polymerase: true,
    ligase: true,
    labels: true,
  });

  // Playback Logic
  useEffect(() => {
    let interval: number;
    if (isPlaying && step < 10) {
      interval = window.setInterval(() => {
        setStep(s => {
          if (s >= 10) {
            setIsPlaying(false);
            return 10;
          }
          return s + 1;
        });
      }, 3000 / speed);
    } else if (step >= 10) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, step, speed]);

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- SVG RENDERING LOGIC ---
  // We use a simplified view where the fork opens from left to right.
  // ViewBox: 0 0 800 500

  return (
    <div className="flex flex-col gap-4">
      {/* Control Panel Top */}
      <div className="bg-white p-4 rounded-lg shadow border-b-2 border-gray-100 flex flex-wrap justify-between items-center gap-4">
         <h2 className="text-xl font-bold text-[#2C3E50] hidden md:block">Simulator</h2>
         
         <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
             <button onClick={() => setStep(0)} className="p-2 hover:bg-white rounded shadow-sm"><RotateCcw size={16}/></button>
             <button onClick={() => setStep(Math.max(0, step - 1))} className="p-2 hover:bg-white rounded shadow-sm"><ChevronLeft size={16}/></button>
             <div className="px-3 font-mono font-bold w-12 text-center">{step}</div>
             <button onClick={() => setStep(Math.min(10, step + 1))} className="p-2 hover:bg-white rounded shadow-sm"><ChevronRight size={16}/></button>
         </div>

         <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-white transition-colors ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#16A085] hover:bg-[#1ABC9C]'}`}
            >
                {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Auto</>}
            </button>
            <div className="flex flex-col items-center w-24">
                <label className="text-xs text-gray-500">Tempo: {speed}x</label>
                <input 
                    type="range" min="0.5" max="2" step="0.5" 
                    value={speed} 
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
         </div>
      </div>

      {/* Main Visualization */}
      <div className="relative bg-white rounded-lg shadow-inner overflow-hidden border border-gray-200" style={{ height: '400px' }}>
         <svg viewBox="0 0 800 400" className="w-full h-full">
            <defs>
                <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
                </marker>
            </defs>

            {/* Background Grid (Optional) */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
            <rect width="800" height="400" fill="url(#grid)" />

            {/* --- DNA STRANDS --- */}
            {/* 
                Step 0: Closed Helix (Two sine waves close together)
                Step 1+: Fork opens. Top goes up, Bottom goes down.
                Junction Point: Moves from left (100) to right (600) based on step.
            */}
            {(() => {
                const forkX = step === 0 ? 50 : 100 + (step * 50); // Fork moves right
                const clampedForkX = Math.min(forkX, 600); // Stop at some point
                
                // Helper to draw paths
                // Top Strand (Lagging Template) 5' -> 3' (Left to Right in visual, but chemically 3'-5' relative to synthesis)
                // Let's stick to standard: Top is 5'-3' template? No, Top is usually 5'-3' Coding, so 3'-5' Template.
                // Prompt says: Top Strand (Purple) "Matrizenstrang für Folgestrang" (3'->5')
                // Bottom Strand (Orange) "Matrizenstrang für Leitstrang" (5'->3')
                
                // Coordinates
                const startY = 200;
                const openTopY = 100;
                const openBotY = 300;

                // Path for closed part (Right of fork)
                const closedPath = `M ${clampedForkX},${startY} L 800,${startY}`; // Simplified line for closed DNA for clarity

                // Path for open parts (Left of fork)
                const topStrandPath = `M 0,${openTopY} L ${clampedForkX - 50},${openTopY} C ${clampedForkX},${openTopY} ${clampedForkX},${startY} ${clampedForkX},${startY}`;
                const botStrandPath = `M 0,${openBotY} L ${clampedForkX - 50},${openBotY} C ${clampedForkX},${openBotY} ${clampedForkX},${startY} ${clampedForkX},${startY}`;

                return (
                    <g>
                        {/* Template Strands */}
                        <path d={topStrandPath} fill="none" stroke={COLORS.strand1} strokeWidth="8" strokeLinecap="round" />
                        <path d={botStrandPath} fill="none" stroke={COLORS.strand2} strokeWidth="8" strokeLinecap="round" />
                        
                        {/* Closed part (Double Helix simplified) */}
                        {step < 10 && (
                             <path d={`M ${clampedForkX},${startY} L 800,${startY}`} fill="none" stroke="#7f8c8d" strokeWidth="16" strokeOpacity="0.3" />
                        )}

                        {/* Labels */}
                        {config.labels && (
                            <>
                                <text x="10" y={openTopY - 15} fill={COLORS.strand1} fontSize="14" fontWeight="bold">3'</text>
                                <text x="10" y={openBotY + 25} fill={COLORS.strand2} fontSize="14" fontWeight="bold">5'</text>
                                {step > 1 && <text x="20" y={openTopY - 35} fill="#555" fontSize="12">Folgestrang-Matrize</text>}
                                {step > 1 && <text x="20" y={openBotY + 45} fill="#555" fontSize="12">Leitstrang-Matrize</text>}
                            </>
                        )}

                        {/* --- ENZYMES & NEW STRANDS --- */}

                        {/* Helicase (Yellow Hexagon) at Fork */}
                        {step >= 1 && step < 10 && config.helicase && (
                            <g transform={`translate(${clampedForkX}, ${startY})`}>
                                <polygon points="-20,-30 20,-30 40,0 20,30 -20,30 -40,0" fill={COLORS.helicase} opacity="0.9">
                                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite" />
                                </polygon>
                                <text x="-15" y="5" fill="white" fontSize="10" fontWeight="bold">Hel</text>
                            </g>
                        )}

                        {/* Leading Strand Synthesis (Bottom) */}
                        {/* Primer appears step 3 */}
                        {step >= 3 && (
                            <line x1="50" y1={openBotY - 15} x2="100" y2={openBotY - 15} stroke={COLORS.primer} strokeWidth="6" />
                        )}
                        {/* Polymerase Step 4+ */}
                        {step >= 4 && (
                            <>
                                {/* New Strand growing */}
                                <line x1="100" y1={openBotY - 15} x2={clampedForkX - 80} y2={openBotY - 15} stroke={COLORS.newStrand2} strokeWidth="6" />
                                {/* Polymerase Icon */}
                                {config.polymerase && (
                                    <circle cx={clampedForkX - 80} cy={openBotY - 15} r="15" fill={COLORS.polymerase} />
                                )}
                            </>
                        )}

                        {/* Lagging Strand Synthesis (Top) */}
                        {/* Step 5: Primer 1 */}
                        {step >= 5 && (
                             <line x1={clampedForkX - 150} y1={openTopY + 15} x2={clampedForkX - 200} y2={openTopY + 15} stroke={step === 8 ? COLORS.newStrand1 : COLORS.primer} strokeWidth="6" />
                        )}
                        {/* Step 6: Okazaki 1 */}
                        {step >= 6 && (
                            <line x1={clampedForkX - 200} y1={openTopY + 15} x2={clampedForkX - 300} y2={openTopY + 15} stroke={COLORS.newStrand1} strokeWidth="6" />
                        )}
                         {/* Step 7: Primer 2 + Okazaki 2 */}
                        {step >= 7 && (
                            <>
                             <line x1={clampedForkX - 50} y1={openTopY + 15} x2={clampedForkX - 100} y2={openTopY + 15} stroke={step === 8 ? COLORS.newStrand1 : COLORS.primer} strokeWidth="6" />
                             <line x1={clampedForkX - 100} y1={openTopY + 15} x2={clampedForkX - 150} y2={openTopY + 15} stroke={COLORS.newStrand1} strokeWidth="6" />
                            </>
                        )}

                        {/* Ligase Step 9 */}
                        {step >= 9 && config.ligase && (
                            <rect x={clampedForkX - 150} y={openTopY} width="20" height="20" fill={COLORS.ligase} transform="rotate(45, 0, 0)" />
                        )}

                        {/* Primase Step 3 & 5 */}
                        {(step === 3 || step === 5 || step === 7) && config.primase && (
                            <ellipse cx={step === 3 ? 75 : step === 5 ? clampedForkX - 175 : clampedForkX - 75} cy={step === 3 ? openBotY - 15 : openTopY + 15} rx="15" ry="10" fill={COLORS.primase} />
                        )}

                    </g>
                );
            })()}
         </svg>

         {/* Legend Overlay */}
         <div className="absolute top-2 right-2 bg-white/90 p-2 rounded text-xs border border-gray-200">
            <div className="font-bold mb-1">Legende</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#F39C12]"></div> Helikase</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#E74C3C]"></div> Primase</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#27AE60]"></div> Polymerase</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#3498DB]"></div> Ligase</div>
         </div>
      </div>

      {/* Explanation Text */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h3 className="font-bold text-[#2C3E50] mb-1">Schritt {step}:</h3>
          <p className="text-[#34495E]">{SIM_STEPS[step]?.text}</p>
      </div>

      {/* Config Toggles */}
      <div className="flex flex-wrap gap-4 text-sm p-4 bg-gray-50 rounded-lg">
          <span className="font-bold text-gray-500">Anzeigen:</span>
          {Object.entries(config).map(([key, val]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={val} onChange={() => toggleConfig(key as keyof typeof config)} className="accent-[#16A085]" />
                  <span className="capitalize">{key}</span>
              </label>
          ))}
      </div>
    </div>
  );
};

export default ReplicationSimulator;