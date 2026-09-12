import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  HUMORAL_STEPS,
  CELLULAR_STEPS,
  PathwayStep,
  VACCINE_PRESETS,
  VaccinePreset,
  QUIZ_QUESTIONS,
  GLOSSARY_ITEMS
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arena' | 'titer' | 'vaccine' | 'antibodies' | 'quiz'>('arena');

  // --- ARENA STATE ---
  const [pathwayMode, setPathwayMode] = useState<'humoral' | 'cellular'>('humoral');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const activePathway = pathwayMode === 'humoral' ? HUMORAL_STEPS : CELLULAR_STEPS;
  const currentStep = activePathway[currentStepIndex] || activePathway[0];

  // Auto-play steps
  useEffect(() => {
    let timer: any = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= activePathway.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, activePathway.length]);

  // --- TITER GRAPH STATE ---
  const [titerDay, setTiterDay] = useState<number>(0); // 0 to 45 days
  const [isTiterPlaying, setIsTiterPlaying] = useState<boolean>(false);
  const titerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Titer play loop
  useEffect(() => {
    let timer: any = null;
    if (isTiterPlaying) {
      timer = setInterval(() => {
        setTiterDay(prev => {
          if (prev >= 45) {
            setIsTiterPlaying(false);
            return 45;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isTiterPlaying]);

  // Compute antibody titer and pathogen load at given day
  const getTiterValuesAtDay = (d: number) => {
    let antibodyTiter = 0; // 0 to 100 rel. units
    let pathogenLoad = 0; // 0 to 100 %
    let hasSymptoms = false;

    if (d <= 0) {
      return { antibodyTiter: 0, pathogenLoad: 0, hasSymptoms: false };
    }

    if (d < 28) {
      // --- FIRST INFECTION (Days 0 to 28) ---
      // Day 0: Infection
      // Days 0-6: Lag phase (antigen processing, no antibodies yet)
      // Pathogen rises rapidly
      if (d <= 6) {
        pathogenLoad = (d / 6) * 85;
        antibodyTiter = 0;
        hasSymptoms = d >= 3;
      } else if (d <= 14) {
        // Primary antibody response (IgM/IgG) starts rising
        const progress = (d - 6) / 8;
        antibodyTiter = progress * 35; // moderate peak around 35
        // Pathogen is suppressed by antibodies
        pathogenLoad = Math.max(0, 85 - progress * 85);
        hasSymptoms = d <= 9;
      } else {
        // Days 14-28: Pathogen eliminated, antibodies decline slowly to resting memory level
        const decay = Math.exp(-(d - 14) * 0.12);
        antibodyTiter = Math.max(8, 35 * decay);
        pathogenLoad = 0;
        hasSymptoms = false;
      }
    } else {
      // --- SECOND INFECTION WITH SAME PATHOGEN (Days 28+) ---
      const tSec = d - 28;
      // Memory cells respond IMMEDIATELY without lag!
      if (tSec <= 3) {
        // Explosive rise within 2-3 days
        const progress = tSec / 3;
        antibodyTiter = 8 + progress * 92; // rockets to 100!
        // Pathogen attempts to enter, but is instantly wiped out
        pathogenLoad = Math.max(0, 15 * (1 - progress));
        hasSymptoms = false; // NO SYMPTOMS!
      } else {
        // High persistent plateau
        const decay = Math.exp(-(tSec - 3) * 0.04);
        antibodyTiter = Math.max(45, 100 * decay);
        pathogenLoad = 0;
        hasSymptoms = false;
      }
    }

    return {
      antibodyTiter: Math.round(antibodyTiter),
      pathogenLoad: Math.round(pathogenLoad),
      hasSymptoms
    };
  };

  const currentTiter = useMemo(() => getTiterValuesAtDay(titerDay), [titerDay]);

  // Render Titer Canvas
  useEffect(() => {
    const canvas = titerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 60;
    const padBottom = 35;
    const plotW = w - padLeft - 20;
    const plotH = h - padBottom - 30;

    // 1. Zone Backgrounds
    // Zone 1: First Infection (0 to 28 days = 28/45)
    const xMid = padLeft + (28 / 45) * plotW;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.18)'; // soft yellow
    ctx.fillRect(padLeft, 25, xMid - padLeft, plotH);
    ctx.fillStyle = '#854d0e';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('1. Erstinfektion (Primärantwort mit Symptomen)', padLeft + 10, 20);

    // Zone 2: Second Infection (28 to 45 days)
    ctx.fillStyle = 'rgba(187, 247, 208, 0.22)'; // soft green
    ctx.fillRect(xMid, 25, padLeft + plotW - xMid, plotH);
    ctx.fillStyle = '#166534';
    ctx.fillText('2. Zweitkontakt (Sekundärantwort / Immun!)', xMid + 10, 20);

    // 2. Grid & Axis Labels
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 25 + (1 - i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${i * 25} %`, 15, y + 3);
    }

    // Days on X-Axis
    for (let day = 0; day <= 45; day += 5) {
      const x = padLeft + (day / 45) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 25);
      ctx.lineTo(x, 25 + plotH);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`T${day}`, x - 8, h - 15);
    }

    // 3. Draw Pathogen Curve (Dashed Red Line)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let d = 0; d <= 45; d += 0.5) {
      const vals = getTiterValuesAtDay(d);
      const x = padLeft + (d / 45) * plotW;
      const y = 25 + (1 - vals.pathogenLoad / 100) * plotH;
      if (d === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw Antibody Titer Curve (Solid Green / Forest Line)
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let d = 0; d <= 45; d += 0.5) {
      const vals = getTiterValuesAtDay(d);
      const x = padLeft + (d / 45) * plotW;
      const y = 25 + (1 - vals.antibodyTiter / 100) * plotH;
      if (d === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 5. Current Time Needle & Points
    const curX = padLeft + (titerDay / 45) * plotW;
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 25);
    ctx.lineTo(curX, 25 + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Circle on Antibody Curve
    const curYAb = 25 + (1 - currentTiter.antibodyTiter / 100) * plotH;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(curX, curYAb, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Circle on Pathogen Curve
    const curYPath = 25 + (1 - currentTiter.pathogenLoad / 100) * plotH;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(curX, curYPath, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [titerDay, currentTiter]);

  // --- VACCINATION SIMULATOR STATE ---
  const [selectedVaccineId, setSelectedVaccineId] = useState<string>('tetanus_active');
  const [vaccineDay, setVaccineDay] = useState<number>(0); // 0 to 60 days
  const vaccineCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedVaccine = useMemo(() => {
    return VACCINE_PRESETS.find(v => v.id === selectedVaccineId) || VACCINE_PRESETS[0];
  }, [selectedVaccineId]);

  // Calculate antibody concentration for vaccine simulator
  const getVaccineLevels = (d: number, mode: string) => {
    let activeLevel = 0;
    let passiveLevel = 0;

    if (mode === 'tetanus_active' || mode === 'measles') {
      // Active: Lag phase of 7 days, then steady rise to high plateau with memory
      if (d < 7) {
        activeLevel = 0;
      } else if (d < 21) {
        activeLevel = ((d - 7) / 14) * 85;
      } else {
        const decay = Math.exp(-(d - 21) * 0.015);
        activeLevel = Math.max(65, 85 * decay);
      }
    } else if (mode === 'tetanus_passive') {
      // Passive: Instant 100% level at day 0, but exponentially decays away in ~25 days
      passiveLevel = 100 * Math.exp(-d * 0.12);
    } else if (mode === 'rabies_combined') {
      // Combined: Passive gives immediate spike, active takes over at day 10
      passiveLevel = 100 * Math.exp(-d * 0.12);
      if (d >= 7) {
        activeLevel = Math.min(80, ((d - 7) / 14) * 80);
      }
    }

    return { activeLevel: Math.round(activeLevel), passiveLevel: Math.round(passiveLevel) };
  };

  // Render Vaccine Canvas
  useEffect(() => {
    const canvas = vaccineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 55;
    const padBottom = 35;
    const plotW = w - padLeft - 20;
    const plotH = h - padBottom - 25;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 20 + (1 - i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${i * 25} %`, 15, y + 3);
    }

    // Days (0 to 60)
    for (let day = 0; day <= 60; day += 10) {
      const x = padLeft + (day / 60) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 20 + plotH);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`Tag ${day}`, x - 12, h - 15);
    }

    // Protection Threshold Line (20%)
    const yThresh = 20 + (1 - 20 / 100) * plotH;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padLeft, yThresh);
    ctx.lineTo(padLeft + plotW, yThresh);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillText('Schutzschwelle (20 %)', padLeft + 5, yThresh - 4);

    // Active Curve (Green)
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let d = 0; d <= 60; d += 1) {
      const vals = getVaccineLevels(d, selectedVaccineId);
      const x = padLeft + (d / 60) * plotW;
      const y = 20 + (1 - vals.activeLevel / 100) * plotH;
      if (d === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Passive Curve (Purple)
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let d = 0; d <= 60; d += 1) {
      const vals = getVaccineLevels(d, selectedVaccineId);
      const x = padLeft + (d / 60) * plotW;
      const y = 20 + (1 - vals.passiveLevel / 100) * plotH;
      if (d === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [selectedVaccineId]);

  // --- ANTIBODY LAB MECHANISM SELECTOR ---
  const [selectedMechanism, setSelectedMechanism] = useState<'neutralization' | 'agglutination' | 'opsonization'>('agglutination');

  // --- QUIZ STATE ---
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  const handleSelectQuizOption = (qId: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const quizScore = useMemo(() => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      const chosen = quizAnswers[q.id];
      if (chosen !== undefined && q.options[chosen]?.isCorrect) {
        score++;
      }
    });
    return score;
  }, [quizAnswers]);

  // --- GLOSSARY SEARCH ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const filteredGlossary = useMemo(() => {
    if (!searchTerm.trim()) return GLOSSARY_ITEMS;
    return GLOSSARY_ITEMS.filter(item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-forest-50 flex flex-col font-sans text-gray-900 antialiased">
      {/* --- TOP STICKY NAVIGATION BAR --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-forest-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a
              href="../index.html"
              className="flex items-center space-x-2 text-forest-700 hover:text-forest-900 transition-colors p-2 rounded-lg hover:bg-forest-100"
              title="Zurück zur BioApps Übersicht"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold hidden sm:inline">Alle BioApps</span>
            </a>
            <div className="h-6 w-px bg-forest-200 hidden sm:block" />
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-forest-100 text-forest-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Das Immunsystem – Abwehr & Impfung
                </h1>
                <p className="text-xs text-forest-700 font-medium">
                  LehrplanPLUS Bayern • Biologie 10. Klasse (B10 1 / B10 2)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              data-dark-toggle
              aria-label="Dark Mode umschalten"
              className="p-2 rounded-xl text-forest-700 hover:bg-forest-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- STATION TABS --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-forest-100 text-xs sm:text-sm font-medium">
          {[
            { id: 'arena', label: '🛡️ 1. Immun-Arena', desc: 'Humoral & Zellulär' },
            { id: 'titer', label: '📈 2. Titer-Kurve', desc: 'Erst- vs. Zweitkontakt' },
            { id: 'vaccine', label: '💉 3. Impf-Simulator', desc: 'Aktiv vs. Passiv' },
            { id: 'antibodies', label: '🔬 4. Antikörper-Labor', desc: 'Neutralisation & Agglutination' },
            { id: 'quiz', label: '🎓 5. Quiz & Glossar', desc: 'Lehrplan-Trainer' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-forest-700 text-white shadow-md font-semibold'
                  : 'text-gray-600 hover:text-forest-800 hover:bg-forest-100'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ========================================================================= */}
        {/* STATION 1: DIE IMMUN-ARENA (MULTIZELLULÄRE KASKADEN)                     */}
        {/* ========================================================================= */}
        {activeTab === 'arena' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-forest-700 to-forest-800 rounded-2xl p-5 text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-600 text-forest-100 uppercase tracking-wider mb-2">
                    Spezifische Immunabwehr in Aktion
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Die Immun-Arena: Humoraler vs. Zellulärer Reaktionspfad
                  </h2>
                  <p className="text-forest-100 text-sm mt-1 max-w-3xl">
                    Verfolge schrittweise das molekulare Zusammenspiel von <strong>MHC-Molekülen, T-Helferzellen, Plasmazellen und zytotoxischen T-Zellen</strong>.
                    Schalte zwischen humoraler Abwehr (freie Viren) und zellulärer Abwehr (infizierte Wirtszellen) um!
                  </p>
                </div>
                <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                  <button
                    onClick={() => {
                      setPathwayMode('humoral');
                      setCurrentStepIndex(0);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      pathwayMode === 'humoral' ? 'bg-white text-forest-900 shadow-md' : 'text-forest-100 hover:text-white'
                    }`}
                  >
                    🛡️ Humoral (B-Zellen)
                  </button>
                  <button
                    onClick={() => {
                      setPathwayMode('cellular');
                      setCurrentStepIndex(0);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      pathwayMode === 'cellular' ? 'bg-white text-forest-900 shadow-md' : 'text-forest-100 hover:text-white'
                    }`}
                  >
                    ⚡ Zellulär (T-Killer)
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Stage & Stepper */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Arena Display (Left) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                    {pathwayMode === 'humoral' ? 'Humoraler Pfad (Körperflüssigkeiten)' : 'Zellulärer Pfad (Intrazellulär)'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-100 text-forest-800">
                    Schritt {currentStepIndex + 1} von {activePathway.length}
                  </span>
                </div>

                {/* SVG Visual Stage */}
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 p-4 border border-gray-700 shadow-inner overflow-hidden min-h-[360px] flex items-center justify-center">
                  {pathwayMode === 'humoral' ? (
                    /* HUMORAL PATHWAY SVG VISUALIZATION */
                    <svg viewBox="0 0 600 340" className="w-full h-auto max-h-[340px]">
                      {/* Step 1: Macrophage & MHC-II */}
                      {currentStepIndex === 0 && (
                        <g className="animate-fadeIn">
                          {/* Macrophage Body with Pseudopodia */}
                          <path
                            d="M 120 170 Q 110 90 200 100 Q 280 110 270 180 Q 260 250 190 240 Q 110 230 120 170 Z"
                            fill="#f59e0b"
                            opacity="0.85"
                          />
                          <text x="150" y="175" fill="#78350f" fontSize="13" fontWeight="bold">Makrophage</text>
                          {/* Engulfed Viruses in Lysosome */}
                          <circle cx="160" cy="200" r="14" fill="#d97706" stroke="#92400e" strokeWidth="2" />
                          <circle cx="160" cy="200" r="6" fill="#ef4444" />
                          {/* MHC-II Receptor on Surface */}
                          <rect x="260" y="145" width="16" height="24" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                          <rect x="276" y="145" width="14" height="24" rx="4" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
                          {/* Antigen Fragment sitting in MHC-II groove */}
                          <circle cx="276" cy="142" r="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                          <text x="250" y="130" fill="#93c5fd" fontSize="10" fontWeight="bold">MHC-II + Antigen</text>
                        </g>
                      )}

                      {/* Step 2: T-Helper Cell docks & Cytokines */}
                      {currentStepIndex === 1 && (
                        <g className="animate-fadeIn">
                          {/* Macrophage APC */}
                          <path
                            d="M 80 170 Q 70 100 150 110 Q 220 120 210 180 Q 200 240 140 230 Q 80 220 80 170 Z"
                            fill="#f59e0b"
                            opacity="0.8"
                          />
                          <rect x="200" y="145" width="14" height="20" rx="3" fill="#3b82f6" />
                          <circle cx="207" cy="142" r="4.5" fill="#ef4444" />

                          {/* CD4+ T-Helper Cell */}
                          <circle cx="340" cy="160" r="55" fill="#3b82f6" opacity="0.9" />
                          <text x="300" y="165" fill="#ffffff" fontSize="12" fontWeight="bold">CD4+ T-Helfer</text>
                          {/* TCR Receptor */}
                          <rect x="280" y="145" width="15" height="15" rx="3" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" />
                          {/* CD4 Coreceptor */}
                          <rect x="285" y="165" width="10" height="8" rx="2" fill="#a855f7" />
                          <text x="270" y="190" fill="#c084fc" fontSize="9">CD4</text>

                          {/* Cytokine Signal Particles floating */}
                          <circle cx="360" cy="110" r="4" fill="#facc15" className="animate-cytokine-1" />
                          <circle cx="390" cy="120" r="4" fill="#facc15" className="animate-cytokine-2" />
                          <circle cx="340" cy="90" r="4" fill="#facc15" className="animate-cytokine-3" />
                          <text x="350" y="85" fill="#fde047" fontSize="10" fontWeight="bold">Zytokine (Interleukine)</text>
                        </g>
                      )}

                      {/* Step 3: B-Cell Clonal Expansion */}
                      {currentStepIndex === 2 && (
                        <g className="animate-fadeIn">
                          {/* Activated B-Cell dividing */}
                          <circle cx="160" cy="160" r="50" fill="#10b981" opacity="0.9" />
                          <text x="135" y="165" fill="#ffffff" fontSize="12" fontWeight="bold">B-Lymphozyt</text>
                          {/* Clonal clones emerging */}
                          <path d="M 230 160 L 300 120" stroke="#34d399" strokeWidth="3" markerEnd="url(#arrow)" />
                          <path d="M 230 160 L 300 200" stroke="#34d399" strokeWidth="3" markerEnd="url(#arrow)" />

                          <circle cx="360" cy="110" r="38" fill="#10b981" opacity="0.8" />
                          <text x="340" y="115" fill="#ffffff" fontSize="10">Klon 1</text>
                          <circle cx="360" cy="210" r="38" fill="#10b981" opacity="0.8" />
                          <text x="340" y="215" fill="#ffffff" fontSize="10">Klon 2</text>
                          <text x="240" y="95" fill="#6ee7b7" fontSize="11" fontWeight="bold">Klonale Selektion</text>
                        </g>
                      )}

                      {/* Step 4: Differentiation into Plasma & Memory Cells */}
                      {currentStepIndex === 3 && (
                        <g className="animate-fadeIn">
                          {/* Plasma Cell with prominent rough ER */}
                          <g transform="translate(140, 150)">
                            <ellipse cx="0" cy="0" rx="65" ry="50" fill="#047857" />
                            {/* Ribosomal rough ER folds */}
                            <path d="M -35 -20 Q -10 -35 25 -20" stroke="#a7f3d0" strokeWidth="3" fill="none" />
                            <path d="M -40 0 Q -5 -15 35 0" stroke="#a7f3d0" strokeWidth="3" fill="none" />
                            <path d="M -35 20 Q -10 5 25 20" stroke="#a7f3d0" strokeWidth="3" fill="none" />
                            <text x="-45" y="-5" fill="#ffffff" fontSize="11" fontWeight="bold">Plasmazelle</text>
                            <text x="-35" y="38" fill="#6ee7b7" fontSize="9">(Fabrik mit rER)</text>
                          </g>

                          {/* B-Memory Cell */}
                          <g transform="translate(420, 150)">
                            <circle cx="0" cy="0" r="45" fill="#0284c7" />
                            <text x="-40" y="-5" fill="#ffffff" fontSize="11" fontWeight="bold">B-Gedächtnis-</text>
                            <text x="-15" y="12" fill="#ffffff" fontSize="11" fontWeight="bold">zelle</text>
                            <text x="-30" y="30" fill="#bae6fd" fontSize="9">(Jahre haltbar)</text>
                          </g>
                        </g>
                      )}

                      {/* Step 5: Antibodies & Agglutination */}
                      {currentStepIndex === 4 && (
                        <g className="animate-fadeIn">
                          {/* Plasma cell firing antibodies */}
                          <circle cx="80" cy="160" r="45" fill="#047857" opacity="0.85" />
                          <text x="45" y="165" fill="#ffffff" fontSize="10" fontWeight="bold">Plasmazelle</text>

                          {/* Y-shaped Antibodies */}
                          {[
                            { x: 180, y: 120, rot: 25 },
                            { x: 230, y: 170, rot: -15 },
                            { x: 190, y: 220, rot: 40 }
                          ].map((ab, i) => (
                            <g key={i} transform={`translate(${ab.x}, ${ab.y}) rotate(${ab.rot})`}>
                              {/* Y-Stem and Arms */}
                              <line x1="0" y1="12" x2="0" y2="0" stroke="#22c55e" strokeWidth="3.5" />
                              <line x1="0" y1="0" x2="-8" y2="-10" stroke="#22c55e" strokeWidth="3" />
                              <line x1="0" y1="0" x2="8" y2="-10" stroke="#22c55e" strokeWidth="3" />
                            </g>
                          ))}

                          {/* Agglutination Complex: Viruses glued together by antibodies */}
                          <g transform="translate(400, 160)">
                            <circle cx="-30" cy="-20" r="16" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                            <circle cx="20" cy="-25" r="16" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                            <circle cx="0" cy="25" r="16" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                            {/* Connecting Y antibodies */}
                            <line x1="-15" y1="-22" x2="5" y2="-23" stroke="#22c55e" strokeWidth="3.5" />
                            <line x1="-20" y1="-5" x2="-5" y2="15" stroke="#22c55e" strokeWidth="3.5" />
                            <line x1="15" y1="-10" x2="5" y2="15" stroke="#22c55e" strokeWidth="3.5" />
                            <text x="-65" y="-50" fill="#fca5a5" fontSize="12" fontWeight="bold">
                              Agglutination (Verklumpung!)
                            </text>
                            <text x="-70" y="60" fill="#86efac" fontSize="10">
                              Opsonierung: Fresszellen räumen auf
                            </text>
                          </g>
                        </g>
                      )}
                    </svg>
                  ) : (
                    /* CELLULAR PATHWAY SVG VISUALIZATION */
                    <svg viewBox="0 0 600 340" className="w-full h-auto max-h-[340px]">
                      {/* Step 1: Infected Host Cell */}
                      {currentStepIndex === 0 && (
                        <g className="animate-fadeIn">
                          <rect x="200" y="90" width="180" height="150" rx="16" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
                          <text x="230" y="140" fill="#ffffff" fontSize="13" fontWeight="bold">Körperzelle</text>
                          <circle cx="290" cy="180" r="28" fill="#334155" stroke="#64748b" />
                          <text x="270" y="185" fill="#94a3b8" fontSize="10">Zellkern</text>
                          {/* Intracellular viruses replicating */}
                          <circle cx="235" cy="115" r="6" fill="#ef4444" />
                          <circle cx="340" cy="125" r="6" fill="#ef4444" />
                          <circle cx="320" cy="210" r="6" fill="#ef4444" />
                          <text x="210" y="270" fill="#fca5a5" fontSize="11" fontWeight="bold">
                            ⚠️ Virus kapert Wirts-Zellmaschinerie
                          </text>
                        </g>
                      )}

                      {/* Step 2: MHC-I Presentation */}
                      {currentStepIndex === 1 && (
                        <g className="animate-fadeIn">
                          <rect x="180" y="100" width="180" height="140" rx="16" fill="#475569" />
                          <text x="220" y="170" fill="#ffffff" fontSize="12" fontWeight="bold">Infizierte Zelle</text>
                          {/* MHC-I Molecular complex on surface */}
                          <rect x="360" y="150" width="22" height="14" rx="3" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
                          {/* Viral peptide antigen in MHC-I groove */}
                          <circle cx="371" cy="144" r="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                          <text x="350" y="130" fill="#f472b6" fontSize="10" fontWeight="bold">MHC-I + Viruspeptid</text>
                          <text x="160" y="265" fill="#cbd5e1" fontSize="10">
                            (Signalisiert: „Ich bin innen befallen!“)
                          </text>
                        </g>
                      )}

                      {/* Step 3: Cytotoxic CD8+ T-Cell Recognition */}
                      {currentStepIndex === 2 && (
                        <g className="animate-fadeIn">
                          {/* Infected Host Cell */}
                          <rect x="110" y="100" width="160" height="140" rx="14" fill="#475569" />
                          <rect x="270" y="155" width="16" height="12" rx="2" fill="#ec4899" />
                          <circle cx="278" cy="150" r="4.5" fill="#ef4444" />

                          {/* CD8+ Cytotoxic T-Cell */}
                          <circle cx="420" cy="160" r="55" fill="#dc2626" opacity="0.9" />
                          <text x="380" y="155" fill="#ffffff" fontSize="11" fontWeight="bold">Zytotoxische</text>
                          <text x="390" y="170" fill="#ffffff" fontSize="11" fontWeight="bold">T-Zelle (TC)</text>
                          {/* TCR Receptor */}
                          <rect x="360" y="152" width="14" height="14" rx="2" fill="#f87171" stroke="#ffffff" />
                          {/* CD8 Coreceptor */}
                          <rect x="365" y="170" width="8" height="6" rx="2" fill="#3b82f6" />
                          <text x="355" y="195" fill="#93c5fd" fontSize="9">CD8</text>
                        </g>
                      )}

                      {/* Step 4: Perforins & Granzymes Injection */}
                      {currentStepIndex === 3 && (
                        <g className="animate-fadeIn">
                          {/* Host Cell with membrane pore holes */}
                          <rect x="120" y="100" width="160" height="140" rx="14" fill="#475569" />
                          {/* Perforin Pores */}
                          <ellipse cx="280" cy="140" rx="4" ry="8" fill="#facc15" />
                          <ellipse cx="280" cy="180" rx="4" ry="8" fill="#facc15" />

                          {/* Granules entering host cell */}
                          <circle cx="250" cy="145" r="4" fill="#f97316" className="animate-ping" />
                          <circle cx="230" cy="175" r="4" fill="#f97316" />

                          {/* T-Killer Cell */}
                          <circle cx="420" cy="160" r="55" fill="#dc2626" />
                          <text x="385" y="165" fill="#ffffff" fontSize="11" fontWeight="bold">T-Killerzelle</text>
                          <text x="240" y="85" fill="#fde047" fontSize="11" fontWeight="bold">
                            Perforine (Poren) & Granzyme
                          </text>
                        </g>
                      )}

                      {/* Step 5: Apoptosis (Programmed Cell Death) */}
                      {currentStepIndex === 4 && (
                        <g className="animate-fadeIn">
                          {/* Host cell shrinking and blebbing */}
                          <g className="animate-bleb" transform="translate(240, 160)">
                            <ellipse cx="0" cy="0" rx="50" ry="40" fill="#334155" stroke="#ef4444" strokeWidth="2" />
                            <text x="-35" y="5" fill="#fca5a5" fontSize="12" fontWeight="bold">Apoptose!</text>
                          </g>
                          {/* Fragmenting vesicles */}
                          <circle cx="160" cy="120" r="8" fill="#475569" />
                          <circle cx="170" cy="200" r="10" fill="#475569" />
                          <circle cx="320" cy="120" r="7" fill="#475569" />
                          <circle cx="310" cy="210" r="9" fill="#475569" />

                          <text x="140" y="275" fill="#a7f3d0" fontSize="12" fontWeight="bold">
                            ✔️ Wirtszelle vernichtet: Virusvermehrung erfolgreich gestoppt!
                          </text>
                        </g>
                      )}
                    </svg>
                  )}
                </div>

                {/* Interactive Player Controls */}
                <div className="mt-4 pt-3 border-t border-forest-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                      disabled={currentStepIndex === 0}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-xs font-bold transition-all"
                    >
                      ⏮️ Zurück
                    </button>
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all ${
                        isAutoPlaying ? 'bg-amber-600' : 'bg-forest-700 hover:bg-forest-800'
                      }`}
                    >
                      {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto-Play'}
                    </button>
                    <button
                      onClick={() => setCurrentStepIndex(Math.min(activePathway.length - 1, currentStepIndex + 1))}
                      disabled={currentStepIndex === activePathway.length - 1}
                      className="px-3 py-1.5 rounded-xl bg-forest-100 hover:bg-forest-200 disabled:opacity-40 text-forest-800 text-xs font-bold transition-all"
                    >
                      Weiter ⏭️
                    </button>
                  </div>

                  {/* Step Buttons Direct Access */}
                  <div className="flex items-center space-x-1">
                    {activePathway.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentStepIndex(i);
                          setIsAutoPlaying(false);
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentStepIndex === i ? 'bg-forest-700 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step Biological Explanation Box (Right) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
                      {currentStep.badge}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Bayerisches Gymnasium 10</span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900">
                    {currentStep.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs">
                    <strong className="text-forest-800 block mb-0.5">Zellulärer Akteur:</strong>
                    <span>{currentStep.actor}</span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {currentStep.mechanism}
                  </p>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                    <strong>Molekulares Detail:</strong> {currentStep.molecularDetail}
                  </div>
                </div>

                {/* Didactic Misconception Box */}
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-purple-950 text-xs leading-relaxed">
                  <strong className="block font-bold mb-1">💡 Merksatz zur Fehlkonzept-Prävention:</strong>
                  {pathwayMode === 'humoral'
                    ? 'Antikörper fressen Viren nicht selbst! Sie blockieren Spikes (Neutralisation), verkleben sie (Agglutination) und markieren sie für Fresszellen (Opsonierung).'
                    : 'T-Killerzellen verschlingen infizierte Zellen nicht! Sie schleusen Perforine und Granzyme ein und zwingen die Wirtszelle zur kontrollierten Selbstzerstörung (Apoptose).'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 2: ANTIKÖRPER-TITER-GRAPH (ERST- VS. ZWEITINFEKTION)             */}
        {/* ========================================================================= */}
        {activeTab === 'titer' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Antikörpertiter im Blut: Erstinfektion vs. Zweitinfektion
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Beobachte den Unterschied in Kinetik und Symptomen:
                Bei der <strong>Erstinfektion</strong> vergehen 5–7 Tage (Latenzzeit), bis Antikörper gebildet werden (Krankheitssymptome treten auf).
                Beim <strong>Zweitkontakt</strong> an Tag 28 feuern die B-Gedächtniszellen sofort – die Infektion wird symptomlos im Keim erstickt!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Titer Plotter (Left) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    Konzentration über 45 Tage
                  </span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-forest-700">
                      <span className="w-3 h-1 bg-forest-700 rounded-full" /> Antikörpertiter
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-red-600">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-red-500" /> Erregerlast
                    </span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-slate-50 p-2">
                  <canvas
                    ref={titerCanvasRef}
                    width={640}
                    height={300}
                    className="w-full h-auto block"
                  />
                </div>

                {/* Timeline Controls */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsTiterPlaying(!isTiterPlaying)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all ${
                        isTiterPlaying ? 'bg-amber-600' : 'bg-forest-700 hover:bg-forest-800'
                      }`}
                    >
                      {isTiterPlaying ? '⏸️ Pause' : '▶️ Zeitraffer starten'}
                    </button>
                    <button
                      onClick={() => {
                        setTiterDay(0);
                        setIsTiterPlaying(false);
                      }}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                      🔄 Reset
                    </button>
                  </div>

                  <div className="flex-1 max-w-xs">
                    <input
                      type="range"
                      min="0"
                      max="45"
                      step="0.5"
                      value={titerDay}
                      onChange={e => setTiterDay(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700">
                    Tag {titerDay.toFixed(1)} / 45
                  </span>
                </div>
              </div>

              {/* Status & Clinical Picture (Right) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Klinischer Zustand an Tag {titerDay.toFixed(1)}:
                  </h3>

                  {/* Symptom Badge */}
                  <div className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
                    currentTiter.hasSymptoms
                      ? 'bg-red-50 border-red-300 text-red-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}>
                    <span className="text-xl">{currentTiter.hasSymptoms ? '🤒' : '💪'}</span>
                    <div>
                      <span>{currentTiter.hasSymptoms ? 'Krankheitssymptome akut!' : 'Gesund & Symptomfrei'}</span>
                      <p className="text-[11px] font-normal text-gray-600 mt-0.5">
                        {currentTiter.hasSymptoms
                          ? 'Erregerlast übersteigt Abwehrkapazität (Fieber, Husten).'
                          : 'Erregerlast unter der Nachweisgrenze oder neutralisiert.'}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex justify-between">
                      <span className="text-forest-800 font-bold">Antikörper-Titer:</span>
                      <strong className="font-mono">{currentTiter.antibodyTiter} %</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700 font-bold">Erregerlast (Viren):</span>
                      <strong className="font-mono">{currentTiter.pathogenLoad} %</strong>
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 text-xs space-y-2">
                  <h4 className="font-bold text-gray-900 mb-1">Primär- vs. Sekundärantwort</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <strong className="text-amber-900 block mb-0.5">Primär (Erstkontakt)</strong>
                      Latenzzeit: 5–7 Tage<br />
                      Antikörperanstieg: Mäßig<br />
                      Symptome: Vorhanden
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <strong className="text-emerald-900 block mb-0.5">Sekundär (Zweitkontakt)</strong>
                      Latenzzeit: Keine (Sofort!)<br />
                      Antikörperanstieg: Massiv (100×)<br />
                      Symptome: Keine (Immunität)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 3: IMPF-SIMULATOR (AKTIV VS. PASSIV)                            */}
        {/* ========================================================================= */}
        {activeTab === 'vaccine' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Impf-Simulator: Aktive Schutzimpfung vs. Passive Heilimpfung
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Vergleiche die beiden fundamentalen Impfprinzipien:
                <strong> Aktive Schutzimpfung</strong> (Vorsorge, baut eigene Gedächtniszellen für Jahre auf) vs.
                <strong> Passive Heilimpfung</strong> (Notfall-Heilserum mit fertigen Antikörpern, wirkt sofort, baut sich aber in Wochen wieder ab).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Presets & Controls (Left) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Impf-Szenario auswählen:
                  </h3>
                  <div className="space-y-2">
                    {VACCINE_PRESETS.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVaccineId(v.id)}
                        className={`w-full p-3 rounded-xl text-left border transition-all ${
                          selectedVaccineId === v.id
                            ? 'border-forest-600 bg-forest-50 shadow-sm'
                            : 'border-gray-200 hover:border-forest-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs font-bold text-gray-900">{v.title}</strong>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700">
                            {v.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug">
                          {v.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scenario Details Box */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 text-xs space-y-2">
                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-gray-500">Geimpfte Substanz:</span>
                    <strong className="text-gray-900 text-right">{selectedVaccine.substance}</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-gray-500">Wirkungseintritt:</span>
                    <strong className="text-forest-800">{selectedVaccine.onset}</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-gray-500">Schutzdauer:</span>
                    <strong className="text-gray-900">{selectedVaccine.duration}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gedächtniszellen gebildet:</span>
                    <strong className={selectedVaccine.memoryCells ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                      {selectedVaccine.memoryCells ? '✔️ JA (Eigene Bildung)' : '❌ NEIN (Schneller Abbau)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Vaccine Plotter Display (Right) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Antikörpertiter nach Impfung (0 bis 60 Tage)
                    </h3>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                        <span className="w-3 h-1 bg-emerald-600 rounded-full" /> Eigene Antikörper (Aktiv)
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-bold text-purple-700">
                        <span className="w-3 h-1 bg-purple-600 rounded-full" /> Fremde Antikörper (Passiv)
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-slate-50 p-2">
                    <canvas
                      ref={vaccineCanvasRef}
                      width={560}
                      height={280}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950">
                  <strong>Didaktische Merkregel für Klausuren:</strong><br />
                  • <em>Aktive Immunisierung</em> = Körper bildet selbst Waffen & Gedächtnis (Langzeitschutz).<br />
                  • <em>Passive Immunisierung</em> = Körper leiht sich fertige Waffen (sofort wirksam, aber schnell verbraucht).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 4: ANTIKÖRPER-LABOR (MOLEKULARE WIRKUNG)                         */}
        {/* ========================================================================= */}
        {activeTab === 'antibodies' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Molekulares Antikörper-Labor: Y-Struktur, Neutralisation & Agglutination
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Erforsche den genauen Bauplan eines <strong>Immunglobulins (IgG)</strong> und wie Antikörper
                Krankheitserreger durch <strong>Neutralisation, Agglutination und Opsonierung</strong> unschädlich machen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Antibody Anatomy Model (Left) */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Anatomie des Y-förmigen Antikörpers (IgG)
                </h3>

                <div className="rounded-xl bg-slate-900 p-4 border border-gray-700 flex justify-center">
                  <svg viewBox="0 0 320 280" className="w-full max-w-[280px] h-auto">
                    {/* Constant Region (Fc Stem) */}
                    <rect x="145" y="150" width="14" height="90" rx="4" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
                    <rect x="161" y="150" width="14" height="90" rx="4" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
                    <text x="185" y="200" fill="#93c5fd" fontSize="11" fontWeight="bold">Fc-Stamm</text>
                    <text x="185" y="215" fill="#cbd5e1" fontSize="9">(Bindet an Phagozyt)</text>

                    {/* Left Heavy Arm */}
                    <line x1="145" y1="150" x2="90" y2="80" stroke="#2563eb" strokeWidth="12" strokeLinecap="round" />
                    {/* Right Heavy Arm */}
                    <line x1="175" y1="150" x2="230" y2="80" stroke="#2563eb" strokeWidth="12" strokeLinecap="round" />

                    {/* Light Chains (Außen) */}
                    <line x1="110" y1="130" x2="65" y2="70" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" />
                    <line x1="210" y1="130" x2="255" y2="70" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" />

                    {/* Variable Region (Fab Binding pockets) */}
                    <circle cx="75" cy="65" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                    <circle cx="245" cy="65" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                    <text x="15" y="55" fill="#86efac" fontSize="10" fontWeight="bold">Antigen-Bindung</text>
                    <text x="210" y="55" fill="#86efac" fontSize="10" fontWeight="bold">Antigen-Bindung</text>

                    {/* Antigen Fitting in Groove */}
                    <polygon points="75,55 70,45 80,45" fill="#ef4444" />
                    <polygon points="245,55 240,45 250,45" fill="#ef4444" />
                    <text x="60" y="38" fill="#fca5a5" fontSize="9">Antigen</text>
                    <text x="230" y="38" fill="#fca5a5" fontSize="9">Antigen</text>
                  </svg>
                </div>

                <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs space-y-1">
                  <p><strong>Zweiwertigkeit:</strong> Jeder Antikörper hat <strong>zwei identische Bindungsstellen (Fab)</strong>. Dadurch kann er zwei Erreger gleichzeitig binden und zu großen Haufen vernetzen!</p>
                </div>
              </div>

              {/* The 3 Mechanisms (Right) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Die 3 Abwehrmechanismen im Vergleich:
                  </h3>

                  <div className="flex space-x-2">
                    {[
                      { id: 'neutralization', label: '🚫 Neutralisation' },
                      { id: 'agglutination', label: '🕸️ Agglutination' },
                      { id: 'opsonization', label: '🎯 Opsonierung' }
                    ].map(mech => (
                      <button
                        key={mech.id}
                        onClick={() => setSelectedMechanism(mech.id as any)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                          selectedMechanism === mech.id
                            ? 'bg-forest-700 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {mech.label}
                      </button>
                    ))}
                  </div>

                  {/* Mechanism Details */}
                  {selectedMechanism === 'neutralization' && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2 animate-fadeIn">
                      <h4 className="font-bold text-sm">1. Neutralisation (Schutz vor Wirtszell-Befall)</h4>
                      <p>
                        Antikörper binden direkt an die Spikeproteine von Viren oder an die aktiven Zentren bakterieller Gifte (Toxine).
                      </p>
                      <p className="font-semibold text-emerald-800">
                        Folge: Der Erreger ist molekular blockiert. Das Virus kann nicht mehr an Rezeptoren menschlicher Wirtszellen andocken.
                      </p>
                    </div>
                  )}

                  {selectedMechanism === 'agglutination' && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-2 animate-fadeIn">
                      <h4 className="font-bold text-sm">2. Agglutination (Netzartige Verklumpung)</h4>
                      <p>
                        Da jeder Antikörper zwei Bindungsarme besitzt, verbindet er zwei getrennte Erreger. Hunderte Antikörper vernetzen Tausende Erreger zu einem gigantischen Klumpen.
                      </p>
                      <p className="font-semibold text-blue-800">
                        Folge: Die Erreger können sich nicht mehr im Gewebe ausbreiten und fallen unbeweglich aus der Blutbahn aus.
                      </p>
                    </div>
                  )}

                  {selectedMechanism === 'opsonization' && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-2 animate-fadeIn">
                      <h4 className="font-bold text-sm">3. Opsonierung (Markierung für Phagozyten)</h4>
                      <p>
                        Die Fc-Stämme der gebundenen Antikörper ragen nach außen wie Haltegriffe. Fresszellen (Makrophagen) besitzen spezifische Fc-Rezeptoren.
                      </p>
                      <p className="font-semibold text-purple-800">
                        Folge: „Schmackhaftmachen“ für Makrophagen – die Phagozytoserate steigt schlagartig um das bis zu 100-fache!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 5: LEHRPLAN-QUIZ & FACHGLOSSAR                                   */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quiz Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 uppercase tracking-wider">
                    Lernzielkontrolle B10 1 / B10 2
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    Bayerisches Lehrplan-Quiz: Immunbiologie
                  </h2>
                  <p className="text-xs text-gray-600">
                    6 anspruchsvolle Aufgaben zu Antigenen, MHC-Klassen, Klonselektion und Impfbiologie.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-forest-800 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200">
                    Punkte: {quizScore} / {QUIZ_QUESTIONS.length}
                  </span>
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setShowQuizResults(false);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                  >
                    Zurücksetzen
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="mt-6 space-y-6">
                {QUIZ_QUESTIONS.map((q, qIndex) => {
                  const selectedOpt = quizAnswers[q.id];
                  const hasAnswered = selectedOpt !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-gray-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider block mb-0.5">
                            Frage {qIndex + 1}: {q.curriculumBadge}
                          </span>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">
                            {q.question}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-400 font-mono shrink-0">
                          {q.context}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 mt-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = selectedOpt === optIndex;
                          let btnStyle = 'bg-white border-gray-200 hover:border-forest-300 text-gray-800';

                          if (hasAnswered) {
                            if (opt.isCorrect) {
                              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-medium';
                            } else if (isSelected) {
                              btnStyle = 'bg-red-100 border-red-500 text-red-950';
                            } else {
                              btnStyle = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleSelectQuizOption(q.id, optIndex)}
                              disabled={hasAnswered}
                              className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-start space-x-2.5 ${btnStyle}`}
                            >
                              <span className="font-bold shrink-0 mt-0.5">
                                {String.fromCharCode(65 + optIndex)})
                              </span>
                              <div className="flex-1">
                                <span>{opt.text}</span>
                                {hasAnswered && isSelected && (
                                  <p className={`mt-1 text-[11px] font-semibold ${
                                    opt.isCorrect ? 'text-emerald-800' : 'text-red-800'
                                  }`}>
                                    {opt.feedback}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && q.misconceptionAlert && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                          💡 <strong>Didaktischer Merksatz:</strong> {q.misconceptionAlert}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Glossary Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    📖 Fachbegriff-Glossar: Immunbiologie (LehrplanPLUS Bayern)
                  </h3>
                  <p className="text-xs text-gray-600">
                    Exakte Definitionen und Lehrbuch-Beispiele für die 10. Jahrgangsstufe.
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Fachbegriff suchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/50 space-y-1 hover:border-forest-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-forest-800">{item.term}</h4>
                      {item.pronunciation && (
                        <span className="text-[10px] text-gray-400 font-mono">{item.pronunciation}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{item.definition}</p>
                    <div className="pt-1 text-[11px] text-gray-500 italic">
                      Beispiel: {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="mt-auto bg-white border-t border-forest-200 py-4 px-4 text-center text-xs text-gray-500">
        <p>
          BioApps • Johannes-Scharrer-Gymnasium • Entwickelt für den Biologieunterricht der 10. Jahrgangsstufe (LehrplanPLUS Bayern B10 1 / B10 2).
        </p>
      </footer>
    </div>
  );
}
