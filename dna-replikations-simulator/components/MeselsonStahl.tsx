import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants';

const steps = [
  {
    title: "Schritt 1: Ausgangssituation",
    desc: "E. coli-Bakterien werden in einem Medium mit schwerem Stickstoff (¹⁵N) kultiviert. Die gesamte DNA ist schwer.",
    label: "Gen 0: 100% ¹⁵N (schwer)",
    composition: { heavy: 100, hybrid: 0, light: 0 }
  },
  {
    title: "Schritt 2: Transfer",
    desc: "Die Bakterien werden in ein Medium mit normalem Stickstoff (¹⁴N) überführt. Ab jetzt wird nur noch leichter Stickstoff eingebaut.",
    label: "Transfer in ¹⁴N-Medium",
    composition: { heavy: 100, hybrid: 0, light: 0 } // Visual changes, data stays effectively same for initial frame
  },
  {
    title: "Schritt 3: Generation 1",
    desc: "Nach einer Replikation besteht jedes DNA-Molekül aus einem alten (¹⁵N) und einem neuen (¹⁴N) Strang.",
    label: "Gen 1: 100% Hybrid-DNA",
    composition: { heavy: 0, hybrid: 100, light: 0 }
  },
  {
    title: "Schritt 4: Generation 2",
    desc: "Die Hybrid-DNA repliziert sich erneut. Es entstehen zur Hälfte Hybrid-Moleküle und zur Hälfte reine leichte Moleküle.",
    label: "Gen 2: 50% Hybrid, 50% Leicht",
    composition: { heavy: 0, hybrid: 50, light: 50 }
  },
  {
    title: "Schritt 5: Interpretation",
    desc: "Das Ergebnis widerlegt das konservative Modell (keine reine schwere DNA in Gen 1) und das dispersive Modell (Trennung in Gen 2).",
    label: "Beweis: Semikonservativ",
    composition: { heavy: 0, hybrid: 50, light: 50 }
  }
];

const MeselsonStahl: React.FC = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(Math.min(steps.length - 1, step + 1));
  const prevStep = () => setStep(Math.max(0, step - 1));
  const reset = () => setStep(0);

  // SVG Drawing Helpers
  const Tube = ({ heavy, hybrid, light }: { heavy: number; hybrid: number; light: number }) => (
    <svg viewBox="0 0 60 150" className="w-24 h-48 drop-shadow-lg">
      <defs>
        <linearGradient id="liquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b2ebf2" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Glass Tube */}
      <path d="M10,10 L10,130 Q10,145 30,145 Q50,145 50,130 L50,10" fill="url(#liquid)" stroke="#aaa" strokeWidth="2" />
      
      {/* Bands */}
      {light > 0 && (
        <rect x="12" y="30" width="36" height="8" fill={COLORS.strand2} opacity="0.9" rx="2" />
      )}
      {hybrid > 0 && (
        <rect x="12" y="70" width="36" height="8" fill={`url(#hybridGradient)`} opacity="0.9" rx="2" />
      )}
      {heavy > 0 && (
        <rect x="12" y="110" width="36" height="8" fill={COLORS.strand1} opacity="0.9" rx="2" />
      )}
       <defs>
        <linearGradient id="hybridGradient">
            <stop offset="0%" stopColor={COLORS.strand1} />
            <stop offset="100%" stopColor={COLORS.strand2} />
        </linearGradient>
      </defs>
    </svg>
  );

  const DnaStrand = ({ type }: { type: 'heavy' | 'light' | 'hybrid' }) => {
    // Simple double helix representation
    const stroke1 = type === 'light' ? COLORS.strand2 : COLORS.strand1;
    const stroke2 = type === 'heavy' ? COLORS.strand1 : COLORS.strand2;
    
    return (
      <svg viewBox="0 0 100 40" className="w-32 h-12">
        <path d="M0,10 Q25,30 50,10 T100,10" fill="none" stroke={stroke1} strokeWidth="4" />
        <path d="M0,30 Q25,10 50,30 T100,30" fill="none" stroke={stroke2} strokeWidth="4" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderColor: COLORS.secondary }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2C3E50]">Meselson-Stahl-Experiment</h2>
          <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">Schritt {step + 1} / 5</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center min-h-[300px] bg-[#ECF0F1] rounded-lg p-8">
            
          {/* Visual Simulation Area */}
          <div className="flex flex-col items-center gap-4">
            <div className="font-bold text-[#2C3E50] mb-2">DNA-Moleküle</div>
            <div className="flex flex-wrap justify-center gap-2 w-64 h-32 content-center">
               {step === 0 && <><DnaStrand type="heavy" /><DnaStrand type="heavy" /></>}
               {step === 1 && <><DnaStrand type="heavy" /><DnaStrand type="heavy" /></>}
               {step === 2 && <><DnaStrand type="hybrid" /><DnaStrand type="hybrid" /></>}
               {step >= 3 && <><DnaStrand type="hybrid" /><DnaStrand type="hybrid" /><DnaStrand type="light" /><DnaStrand type="light" /></>}
            </div>
            {step === 1 && (
                <div className="text-sm bg-yellow-100 p-2 rounded text-yellow-800 border border-yellow-300 animate-pulse">
                    Transfer in ¹⁴N Medium...
                </div>
            )}
          </div>

          <div className="h-48 w-[1px] bg-gray-300 hidden md:block"></div>

          <div className="flex flex-col items-center gap-4">
            <div className="font-bold text-[#2C3E50] mb-2">Zentrifugations-Ergebnis</div>
            <Tube 
                heavy={steps[step].composition.heavy} 
                hybrid={steps[step].composition.hybrid} 
                light={steps[step].composition.light} 
            />
            <div className="text-sm font-medium text-center text-gray-600">
                {step === 0 || step === 1 ? "Unten (Schwer)" : 
                 step === 2 ? "Mitte (Hybrid)" : "Mitte & Oben"}
            </div>
          </div>

        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">{steps[step].title}</h3>
          <p className="text-[#34495E] leading-relaxed">{steps[step].desc}</p>
          <div className="mt-2 font-semibold text-[#16A085]">{steps[step].label}</div>
        </div>

        {step === 4 && (
             <div className="mt-4 overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-700">
                 <thead className="text-xs uppercase bg-gray-100">
                     <tr>
                         <th className="px-4 py-2">Modell</th>
                         <th className="px-4 py-2">Generation 1</th>
                         <th className="px-4 py-2">Generation 2</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr className="border-b bg-red-50 opacity-50">
                         <td className="px-4 py-2 font-medium">Konservativ</td>
                         <td className="px-4 py-2">50% schwer, 50% leicht</td>
                         <td className="px-4 py-2">25% schwer, 75% leicht</td>
                     </tr>
                     <tr className="border-b bg-green-50 font-bold border-l-4 border-l-[#2ECC71]">
                         <td className="px-4 py-2">Semikonservativ</td>
                         <td className="px-4 py-2">100% hybrid</td>
                         <td className="px-4 py-2">50% hybrid, 50% leicht</td>
                     </tr>
                     <tr className="bg-red-50 opacity-50">
                         <td className="px-4 py-2 font-medium">Dispersiv</td>
                         <td className="px-4 py-2">100% hybrid</td>
                         <td className="px-4 py-2">100% hybrid (leichter)</td>
                     </tr>
                 </tbody>
             </table>
         </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t">
          <button 
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#2C3E50] transition-colors"
          >
            <RotateCcw size={18} /> Reset
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={prevStep}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-2 rounded-md transition-colors ${step === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-[#2C3E50] hover:bg-gray-300'}`}
            >
              <ChevronLeft size={20} /> Zurück
            </button>
            <button 
              onClick={nextStep}
              disabled={step === steps.length - 1}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-white transition-colors ${step === steps.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2C3E50] hover:bg-[#34495E]'}`}
            >
              Weiter <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="text-blue-500 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-blue-800 text-sm">Häufiges Missverständnis</h4>
          <p className="text-blue-700 text-sm">Viele denken, die DNA wird komplett neu synthetisiert (konservatives Modell). Tatsächlich dient aber jeder alte Strang als Matrize für einen neuen Strang – daher semikonservativ.</p>
        </div>
      </div>
    </div>
  );
};

export default MeselsonStahl;