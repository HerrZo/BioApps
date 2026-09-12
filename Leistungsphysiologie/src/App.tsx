import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ATHLETE_PROFILES,
  AthleteProfile,
  ENERGY_SYSTEMS,
  EnergySystem,
  QUIZ_QUESTIONS,
  GLOSSARY_ITEMS
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ergometer' | 'lactate' | 'energy' | 'epoc' | 'quiz'>('ergometer');

  // --- ERGOMETER SIMULATOR STATE ---
  const [selectedProfileId, setSelectedProfileId] = useState<'untrained' | 'athlete'>('untrained');
  const [wattage, setWattage] = useState<number>(0); // 0 to 400 W
  const [durationSeconds, setDurationSeconds] = useState<number>(180); // duration of current bout

  const currentProfile = useMemo(() => {
    return ATHLETE_PROFILES.find(p => p.id === selectedProfileId) || ATHLETE_PROFILES[0];
  }, [selectedProfileId]);

  // --- HEMODYNAMIC & RESPIRATORY CALCULATIONS ---
  const physiology = useMemo(() => {
    const isUntrained = currentProfile.id === 'untrained';
    const relWatt = wattage / currentProfile.maxWatt;

    // 1. Heart Rate (HF)
    const hr = Math.round(
      currentProfile.restingHR + relWatt * (currentProfile.maxHR - currentProfile.restingHR)
    );

    // 2. Stroke Volume (SV in ml)
    // SV increases early and plateaus around 40-50% max load
    const svIncrease = Math.min(1.0, relWatt * 2.2);
    const sv = Math.round(
      currentProfile.restingSV + svIncrease * (currentProfile.maxSV - currentProfile.restingSV)
    );

    // 3. Cardiac Output (HMV in l/min) = (HF * SV) / 1000
    const hmv = ((hr * sv) / 1000).toFixed(1);

    // 4. Respiratory Parameters
    // Resting: AF ≈ 12, AZV ≈ 0.5 l -> AMV ≈ 6 l/min
    // Max: Untrained AMV ≈ 110 l/min; Athlete AMV ≈ 180 l/min!
    const maxAMV = isUntrained ? 115 : 185;
    const amv = (6.0 + Math.pow(relWatt, 1.4) * (maxAMV - 6.0)).toFixed(1);
    const af = Math.round(12 + relWatt * (isUntrained ? 38 : 46));
    const azv = (parseFloat(amv) / af).toFixed(2);

    // 5. Blood Lactate (mmol/l)
    // Basal resting lactate: 1.0 mmol/l
    let lactate = 1.0;
    const aeroWatt = currentProfile.aerobicThresholdWatt;
    const anaeroWatt = currentProfile.anaerobicThresholdWatt;

    if (wattage <= aeroWatt) {
      lactate = 1.0 + (wattage / aeroWatt) * 0.9;
    } else if (wattage <= anaeroWatt) {
      const t = (wattage - aeroWatt) / (anaeroWatt - aeroWatt);
      lactate = 1.9 + t * 2.1; // reaches 4.0 at anaerobic threshold
    } else {
      const tOver = (wattage - anaeroWatt) / (currentProfile.maxWatt - anaeroWatt);
      // Exponential rise above anaerobic threshold
      lactate = 4.0 + Math.pow(tOver, 1.8) * 9.5;
    }

    // Oxygen consumption VO2 (ml/min)
    // ~ 10-11 ml O2 per Watt + 300 ml basal
    const vo2 = Math.round(300 + wattage * 11.5);

    return {
      heartRate: hr,
      strokeVolume: sv,
      cardiacOutput: parseFloat(hmv),
      ventilation: parseFloat(amv),
      breathingRate: af,
      tidalVolume: parseFloat(azv),
      lactate: parseFloat(lactate.toFixed(1)),
      vo2
    };
  }, [wattage, currentProfile]);

  // --- ENERGY CONTRIBUTIONS BREAKDOWN (%) ---
  const energySplit = useMemo(() => {
    // If resting
    if (wattage === 0) {
      return { kp: 0, anaerobicGlycolysis: 0, aerobicGlucose: 15, lipolysis: 85 };
    }

    const relWatt = wattage / currentProfile.maxWatt;

    // Fast burst (< 10 s): KP high
    if (durationSeconds <= 10 && wattage > 250) {
      return { kp: 75, anaerobicGlycolysis: 20, aerobicGlucose: 5, lipolysis: 0 };
    }
    // High sprint (10-45 s): Anaerobic glycolysis dominates
    if (durationSeconds <= 45 && wattage > 200) {
      return { kp: 15, anaerobicGlycolysis: 65, aerobicGlucose: 20, lipolysis: 0 };
    }

    // Steady-state based on intensity:
    if (relWatt < 0.4) {
      // Low aerobic: Fat dominates
      return { kp: 0, anaerobicGlycolysis: 5, aerobicGlucose: 25, lipolysis: 70 };
    } else if (relWatt < 0.7) {
      // Moderate aerobic: Glucose and fat balanced
      return { kp: 0, anaerobicGlycolysis: 10, aerobicGlucose: 60, lipolysis: 30 };
    } else if (relWatt < 0.9) {
      // Above anaerobic threshold: Anaerobic glycolysis + aerobic glucose
      return { kp: 5, anaerobicGlycolysis: 35, aerobicGlucose: 55, lipolysis: 5 };
    } else {
      // Extreme maximum: Anaerobic glycolysis surges
      return { kp: 15, anaerobicGlycolysis: 60, aerobicGlucose: 25, lipolysis: 0 };
    }
  }, [wattage, durationSeconds, currentProfile]);

  // --- LACTATE CURVE CANVAS ---
  const lactateCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = lactateCanvasRef.current;
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

    // 1. Shaded Lactate Zones
    // Green: 0 to 2 mmol/l (2/14)
    const y2mmol = 20 + (1 - 2.0 / 14) * plotH;
    const y4mmol = 20 + (1 - 4.0 / 14) * plotH;

    // Green zone (0-2)
    ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
    ctx.fillRect(padLeft, y2mmol, plotW, 20 + plotH - y2mmol);

    // Yellow zone (2-4)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.14)';
    ctx.fillRect(padLeft, y4mmol, plotW, y2mmol - y4mmol);

    // Red zone (>4)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.fillRect(padLeft, 20, plotW, y4mmol - 20);

    // 2. Threshold Reference Lines
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padLeft, y2mmol);
    ctx.lineTo(padLeft + plotW, y2mmol);
    ctx.stroke();

    ctx.strokeStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(padLeft, y4mmol);
    ctx.lineTo(padLeft + plotW, y4mmol);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('Aerobe Schwelle (2 mmol/l)', padLeft + 10, y2mmol - 4);

    ctx.fillStyle = '#dc2626';
    ctx.fillText('Anaerobe Schwelle / MLSS (4 mmol/l)', padLeft + 10, y4mmol - 4);

    // 3. Grid & Y-Labels
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let l = 0; l <= 14; l += 2) {
      const y = 20 + (1 - l / 14) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${l}`, 25, y + 4);
    }
    ctx.fillText('mmol/l', 15, 15);

    // X-Axis Wattage
    for (let watt = 0; watt <= 400; watt += 50) {
      const x = padLeft + (watt / 400) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 20 + plotH);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${watt} W`, x - 12, h - 15);
    }

    // 4. Draw Untrained Lactate Curve (Orange)
    const untrainedProf = ATHLETE_PROFILES[0];
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let watt = 0; watt <= untrainedProf.maxWatt; watt += 5) {
      let lac = 1.0;
      if (watt <= untrainedProf.aerobicThresholdWatt) {
        lac = 1.0 + (watt / untrainedProf.aerobicThresholdWatt) * 0.9;
      } else if (watt <= untrainedProf.anaerobicThresholdWatt) {
        const t = (watt - untrainedProf.aerobicThresholdWatt) / (untrainedProf.anaerobicThresholdWatt - untrainedProf.aerobicThresholdWatt);
        lac = 1.9 + t * 2.1;
      } else {
        const tOver = (watt - untrainedProf.anaerobicThresholdWatt) / (untrainedProf.maxWatt - untrainedProf.anaerobicThresholdWatt);
        lac = 4.0 + Math.pow(tOver, 1.8) * 9.5;
      }
      const x = padLeft + (watt / 400) * plotW;
      const y = 20 + (1 - lac / 14) * plotH;
      if (watt === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 5. Draw Athlete Lactate Curve (Green)
    const athleteProf = ATHLETE_PROFILES[1];
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let watt = 0; watt <= athleteProf.maxWatt; watt += 5) {
      let lac = 1.0;
      if (watt <= athleteProf.aerobicThresholdWatt) {
        lac = 1.0 + (watt / athleteProf.aerobicThresholdWatt) * 0.9;
      } else if (watt <= athleteProf.anaerobicThresholdWatt) {
        const t = (watt - athleteProf.aerobicThresholdWatt) / (athleteProf.anaerobicThresholdWatt - athleteProf.aerobicThresholdWatt);
        lac = 1.9 + t * 2.1;
      } else {
        const tOver = (watt - athleteProf.anaerobicThresholdWatt) / (athleteProf.maxWatt - athleteProf.anaerobicThresholdWatt);
        lac = 4.0 + Math.pow(tOver, 1.8) * 9.5;
      }
      const x = padLeft + (watt / 400) * plotW;
      const y = 20 + (1 - lac / 14) * plotH;
      if (watt === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 6. Current Watt Marker
    const curX = padLeft + (wattage / 400) * plotW;
    const curY = 20 + (1 - physiology.lactate / 14) * plotH;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 20);
    ctx.lineTo(curX, 20 + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = selectedProfileId === 'untrained' ? '#f97316' : '#15803d';
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [wattage, selectedProfileId, physiology]);

  // --- EPOC (SAUERSTOFFSCHULD) EXPERIMENT STATE ---
  const [epocTime, setEpocTime] = useState<number>(0); // 0 to 600 s (10 min)
  const [isEpocRunning, setIsEpocRunning] = useState<boolean>(false);
  const epocCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // EPOC simulation timer
  useEffect(() => {
    let timer: any = null;
    if (isEpocRunning) {
      timer = setInterval(() => {
        setEpocTime(prev => {
          if (prev >= 600) {
            setIsEpocRunning(false);
            return 600;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isEpocRunning]);

  // Calculate VO2 over time for EPOC (30s Sprint at 350 W, then rest)
  const getEpocVO2 = (sec: number) => {
    const restingVO2 = 300; // ml/min
    const sprintReqVO2 = 3800; // demand during sprint

    if (sec <= 30) {
      // Sprint phase: O2 demand is 3800 ml/min, but actual uptake lags behind!
      // Actual VO2 rises slowly: exponential approach
      const actual = restingVO2 + (sprintReqVO2 - restingVO2) * (1 - Math.exp(-sec / 15));
      return { actual, demand: sprintReqVO2 };
    } else {
      // Recovery phase (sec > 30): Demand drops to resting (300 ml), but actual VO2 stays elevated!
      const recSec = sec - 30;
      // Fast alactic phase (tau ≈ 30s) + Slow lactic phase (tau ≈ 180s)
      const fastComp = 1800 * Math.exp(-recSec / 35);
      const slowComp = 800 * Math.exp(-recSec / 190);
      const actual = restingVO2 + fastComp + slowComp;
      return { actual, demand: restingVO2 };
    }
  };

  // Render EPOC Canvas
  useEffect(() => {
    const canvas = epocCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 60;
    const padBottom = 35;
    const plotW = w - padLeft - 20;
    const plotH = h - padBottom - 25;

    // 1. Shaded Deficit & Debt Areas
    const x30s = padLeft + (30 / 600) * plotW;

    // Deficit Zone (0 to 30s): Gap between Demand (3800) and Actual
    ctx.fillStyle = 'rgba(59, 130, 246, 0.25)'; // Blue
    ctx.beginPath();
    ctx.moveTo(padLeft, 20 + (1 - 3800 / 4000) * plotH);
    ctx.lineTo(x30s, 20 + (1 - 3800 / 4000) * plotH);
    for (let s = 30; s >= 0; s -= 2) {
      const v = getEpocVO2(s);
      const x = padLeft + (s / 600) * plotW;
      const y = 20 + (1 - v.actual / 4000) * plotH;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Debt (EPOC) Zone (30 to 600s): Area between Actual and Resting Demand (300)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.25)'; // Amber/Gold
    ctx.beginPath();
    ctx.moveTo(x30s, 20 + (1 - 300 / 4000) * plotH);
    for (let s = 30; s <= 600; s += 5) {
      const v = getEpocVO2(s);
      const x = padLeft + (s / 600) * plotW;
      const y = 20 + (1 - v.actual / 4000) * plotH;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(padLeft + plotW, 20 + (1 - 300 / 4000) * plotH);
    ctx.closePath();
    ctx.fill();

    // 2. Grid Lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let vo2 = 0; vo2 <= 4000; vo2 += 1000) {
      const y = 20 + (1 - vo2 / 4000) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${vo2}`, 20, y + 4);
    }
    ctx.fillText('ml O₂/min', 10, 15);

    // Time Axis (0 to 600s / 10 min)
    for (let s = 0; s <= 600; s += 60) {
      const x = padLeft + (s / 600) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 20 + plotH);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${s / 60} min`, x - 12, h - 15);
    }

    // 3. Draw Demand Line (Dotted Red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padLeft, 20 + (1 - 3800 / 4000) * plotH);
    ctx.lineTo(x30s, 20 + (1 - 3800 / 4000) * plotH);
    ctx.lineTo(x30s, 20 + (1 - 300 / 4000) * plotH);
    ctx.lineTo(padLeft + plotW, 20 + (1 - 300 / 4000) * plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw Actual VO2 Curve (Solid Blue/Forest)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let s = 0; s <= 600; s += 2) {
      const v = getEpocVO2(s);
      const x = padLeft + (s / 600) * plotW;
      const y = 20 + (1 - v.actual / 4000) * plotH;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 5. Current Time Needle
    const curX = padLeft + (epocTime / 600) * plotW;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(curX, 20);
    ctx.lineTo(curX, 20 + plotH);
    ctx.stroke();
  }, [epocTime]);

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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Leistungsphysiologie – Ergometer & Energie
                </h1>
                <p className="text-xs text-forest-700 font-medium">
                  LehrplanPLUS Bayern • Biologie 10. Klasse (B10 2)
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
            { id: 'ergometer', label: '🚴 1. Ergometer-Labor', desc: 'Avatar & Kardiocockpit' },
            { id: 'lactate', label: '📈 2. Laktatschwellen', desc: 'Aerob vs. Anaerob' },
            { id: 'energy', label: '🔬 3. Muskel-Energie', desc: 'KP, Glykolyse & Fette' },
            { id: 'epoc', label: '🫁 4. Sauerstoffschuld', desc: 'EPOC-Experiment' },
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
        {/* STATION 1: DAS VIRTUELLE ERGOMETER-LABOR                                 */}
        {/* ========================================================================= */}
        {activeTab === 'ergometer' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-forest-700 to-forest-800 rounded-2xl p-5 text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-600 text-forest-100 uppercase tracking-wider mb-2">
                    Sportbiologie & Hämodynamik
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Das Fahrradergometer: Kardiopulmonale Belastungsdynamik
                  </h2>
                  <p className="text-forest-100 text-sm mt-1 max-w-3xl">
                    Steigere die Leistung in Watt und beobachte synchron <strong>Herzfrequenz, Schlagvolumen, Herzminutenvolumen (HMV) und Laktatspiegel</strong>.
                    Vergleiche den untrainierten Jugendlichen mit dem Ausdauersportler (Sportherz)!
                  </p>
                </div>
                <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                  <button
                    onClick={() => setSelectedProfileId('untrained')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedProfileId === 'untrained' ? 'bg-white text-forest-900 shadow-md' : 'text-forest-100 hover:text-white'
                    }`}
                  >
                    🚶 Untrainierter
                  </button>
                  <button
                    onClick={() => setSelectedProfileId('athlete')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedProfileId === 'athlete' ? 'bg-white text-forest-900 shadow-md' : 'text-forest-100 hover:text-white'
                    }`}
                  >
                    🏅 Ausdauersportler
                  </button>
                </div>
              </div>
            </div>

            {/* Layout: Avatar & Ergometer (Left) + Cockpit Telemetry (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Ergometer Visual & Controls */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                      Ergometer-Animation ({currentProfile.name})
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-bold">
                      {currentProfile.badge}
                    </span>
                  </div>

                  {/* SVG Cyclist Avatar on Ergometer */}
                  <div className="relative rounded-2xl bg-slate-900 p-4 border border-gray-700 shadow-inner flex items-center justify-center min-h-[280px] overflow-hidden">
                    <svg viewBox="0 0 400 280" className="w-full max-w-[340px] h-auto">
                      {/* Ergometer Flywheel Base */}
                      <ellipse cx="200" cy="245" rx="140" ry="10" fill="#1e293b" />
                      {/* Bike Frame */}
                      <path d="M 120 220 L 190 220 L 250 140 L 160 140 Z" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                      <line x1="160" y1="140" x2="150" y2="90" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                      <line x1="250" y1="140" x2="270" y2="85" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

                      {/* Handlebar & Saddle */}
                      <rect x="130" y="80" width="35" height="12" rx="4" fill="#334155" />
                      <path d="M 265 85 L 290 85 L 285 105" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

                      {/* Rotating Flywheel / Crank */}
                      <circle cx="190" cy="220" r="28" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
                      <g className={wattage > 0 ? 'animate-pedal' : ''} style={{ transformOrigin: '190px 220px' }}>
                        <line x1="190" y1="220" x2="190" y2="195" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
                        <rect x="180" y="190" width="20" height="6" rx="2" fill="#e2e8f0" />
                      </g>

                      {/* Cyclist Avatar Body */}
                      <g transform="translate(0, 0)">
                        {/* Leg (Hip to Knee to Pedal) */}
                        <path
                          d={wattage > 0 ? "M 150 100 L 175 160 L 190 200" : "M 150 100 L 170 170 L 190 220"}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Torso & Head */}
                        <path d="M 150 100 L 220 75" fill="none" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
                        {/* Arm to Handlebar */}
                        <path d="M 215 80 L 255 90 L 280 90" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
                        {/* Head */}
                        <circle cx="240" cy="50" r="16" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
                        {/* Helmet */}
                        <path d="M 224 48 Q 240 28 258 45 Z" fill="#ef4444" />

                        {/* Sweating effect at high watt */}
                        {wattage >= 250 && (
                          <circle cx="258" cy="54" r="3" fill="#38bdf8" className="animate-ping" />
                        )}

                        {/* Pulsing Heart Monitor on Chest */}
                        <g transform="translate(195, 75)">
                          <path
                            d="M 0 0 C -4 -5 -10 -2 -10 3 C -10 8 0 14 0 14 C 0 14 10 8 10 3 C 10 -2 4 -5 0 0 Z"
                            fill="#ef4444"
                            className="animate-heartbeat"
                            style={{ transformOrigin: '0 0' }}
                          />
                        </g>
                      </g>
                    </svg>

                    {/* Live Watt Display Overlay */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono text-center">
                      <div className="text-[10px] text-gray-300 uppercase">Leistung</div>
                      <div className="text-xl font-black text-amber-400">{wattage} Watt</div>
                    </div>
                  </div>

                  {/* Wattage Slider Controls */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Widerstand / Tretleistung:</span>
                      <strong className="text-forest-800 text-sm">{wattage} W</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="10"
                      value={wattage}
                      onChange={e => setWattage(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />

                    {/* Watt Presets */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[
                        { w: 0, label: 'Ruhe (0 W)' },
                        { w: 60, label: 'Aufwärmen (60 W)' },
                        { w: 120, label: 'Grundlage (120 W)' },
                        { w: 220, label: 'Schwelle (220 W)' },
                        { w: 350, label: 'Vollast-Sprint (350 W)' }
                      ].map(preset => (
                        <button
                          key={preset.w}
                          onClick={() => setWattage(preset.w)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            wattage === preset.w
                              ? 'bg-forest-700 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
                  <strong>Probanden-Vergleich:</strong> {currentProfile.description}
                </div>
              </div>

              {/* Cardiopulmonary Telemetry Cockpit (Right) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Hemodynamics Grid */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                    <span>❤️ Hämodynamik: Herzminutenvolumen (HMV)</span>
                    <span className="text-xs text-forest-700 font-mono">HMV = HF · SV</span>
                  </h3>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    {/* Heart Rate */}
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                      <span className="text-[10px] font-bold text-red-700 uppercase block">Puls (HF)</span>
                      <strong className="text-2xl font-black text-red-900">{physiology.heartRate}</strong>
                      <span className="text-[10px] text-red-700 block">Spm (min⁻¹)</span>
                    </div>

                    {/* Stroke Volume */}
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-[10px] font-bold text-blue-700 uppercase block">Schlagvolumen (SV)</span>
                      <strong className="text-2xl font-black text-blue-900">{physiology.strokeVolume}</strong>
                      <span className="text-[10px] text-blue-700 block">ml / Schlag</span>
                    </div>

                    {/* Cardiac Output */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block">Pumpvolumen (HMV)</span>
                      <strong className="text-2xl font-black text-emerald-900">{physiology.cardiacOutput}</strong>
                      <span className="text-[10px] text-emerald-700 block">Liter / min</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic pt-1">
                    In Ruhe pumpen beide Probanden ca. 5 l/min. Unter Volllast erreicht der Ausdauersportler durch sein großes Schlagvolumen über 30 l/min!
                  </p>
                </div>

                {/* Respiration & Lactate Telemetry */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    🫁 Atmung & Blut-Laktatspiegel
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Ventilation */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-200">
                      <span className="text-xs text-gray-500 block">Atemminutenvolumen (AMV):</span>
                      <strong className="text-lg font-bold text-gray-900">{physiology.ventilation} l/min</strong>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        ({physiology.breathingRate} Züge à {physiology.tidalVolume} l)
                      </span>
                    </div>

                    {/* Lactate Status Box */}
                    <div className={`p-3 rounded-xl border ${
                      physiology.lactate < 2.0
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : physiology.lactate <= 4.0
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-red-50 border-red-300 text-red-950'
                    }`}>
                      <span className="text-xs font-bold block">Blutlaktat:</span>
                      <strong className="text-lg font-black">{physiology.lactate} mmol/l</strong>
                      <span className="text-[10px] font-bold uppercase block mt-0.5">
                        {physiology.lactate < 2.0
                          ? '🟢 Aerob (< 2 mmol/l)'
                          : physiology.lactate <= 4.0
                          ? '🟡 Übergang (2–4 mmol/l)'
                          : '🔴 Azidose / Übersäuerung!'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex justify-between items-center">
                    <span>Sauerstoffaufnahme (V̇O₂):</span>
                    <strong className="font-mono">{physiology.vo2} ml O₂ / min</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 2: LAKTATGSTUFENTEST & SCHWELLEN-GRAPH                           */}
        {/* ========================================================================= */}
        {activeTab === 'lactate' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Der Laktatstufentest: Aerobe & Anaerobe Schwelle (MLSS)
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Im Stufentest steigt die Wattleistung alle 3 Minuten um 50 Watt.
                Vergleiche die Kurven: Der <strong>Untrainierte</strong> (orange) überschreitet die anaerobe Schwelle (4 mmol/l) bereits bei 145 Watt.
                Beim <strong>Ausdauersportler</strong> (grün) ist die Kurve nach rechts verschoben – er kann bis fast 300 Watt im Gleichgewicht fahren!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Lactate Canvas Graph */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    Laktat-Leistungskurve (0 bis 400 Watt)
                  </span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-orange-600">
                      <span className="w-3 h-1 bg-orange-500 rounded-full" /> Untrainierter
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-forest-700">
                      <span className="w-3 h-1 bg-forest-700 rounded-full" /> Ausdauersportler
                    </span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-slate-50 p-2">
                  <canvas
                    ref={lactateCanvasRef}
                    width={620}
                    height={300}
                    className="w-full h-auto block"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Aktuelle Wattleistung anpassen: <strong>{wattage} W</strong>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="400"
                    step="10"
                    value={wattage}
                    onChange={e => setWattage(parseInt(e.target.value))}
                    className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Threshold Explanations (Right) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                  <strong className="block text-emerald-900 font-bold text-sm">
                    1. Aerobe Schwelle (2 mmol/l Laktat)
                  </strong>
                  <p>
                    Bis 2 mmol/l verbrennt der Muskel rein aerob Fette und Kohlenhydrate. Oberhalb von 2 mmol/l steigt das Laktat erstmals messbar an.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                  <strong className="block text-amber-900 font-bold text-sm">
                    2. Anaerobe Schwelle (4 mmol/l / MLSS)
                  </strong>
                  <p>
                    <strong>Maximales Laktat-Steady-State:</strong> Höchste Intensität, bei der Laktatbildung und Laktatabbau (Herzmuskel, Cori-Zyklus in der Leber) im Gleichgewicht stehen.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 text-xs space-y-1">
                  <strong className="block text-red-900 font-bold text-sm">
                    3. Azidosebereich (&gt; 4 mmol/l)
                  </strong>
                  <p>
                    Laktatbildung &gt; Abbau. Die Konzentration von H⁺-Ionen steigt drastisch (Übersäuerung). Hemmt das Schrittmacherenzym PFK → Leistungsabbruch!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 3: MUSKELZELL-ZOOM (ENERGIEBEREITSTELLUNG)                      */}
        {/* ========================================================================= */}
        {activeTab === 'energy' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Muskelzell-Zoom: Die 4 Säulen der ATP-Resynthese
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                ATP ist der universelle Treibstoff der Muskelkontraktion, der Vorrat in der Zelle reicht aber nur für 1–2 Sekunden.
                Je nach Belastungsintensität ({wattage} W) und Dauer schalten die Muskelzellen zwischen den 4 Bereitstellungswegen um!
              </p>
            </div>

            {/* Live Energy Composition Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900">
                  Aktuelle Zusammensetzung der ATP-Gewinnung bei {wattage} Watt:
                </h3>
                <div className="flex items-center space-x-2 text-xs">
                  <span>Belastungsdauer:</span>
                  <select
                    value={durationSeconds}
                    onChange={e => setDurationSeconds(parseInt(e.target.value))}
                    className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold border border-gray-300"
                  >
                    <option value={5}>0–10 s (Start / Sprint)</option>
                    <option value={30}>10–60 s (Mittelzeitsprint)</option>
                    <option value={180}>3–10 min (Dauerleistung)</option>
                    <option value={3600}>&gt; 60 min (Marathon / Fettverbrennung)</option>
                  </select>
                </div>
              </div>

              {/* Multi-Segment Stacked Bar */}
              <div className="h-9 w-full bg-gray-200 rounded-xl overflow-hidden flex shadow-inner border border-gray-300 text-xs font-bold text-white text-center leading-9">
                {energySplit.kp > 0 && (
                  <div style={{ width: `${energySplit.kp}%`, backgroundColor: '#8b5cf6' }}>
                    {energySplit.kp >= 15 ? `KP: ${energySplit.kp}%` : ''}
                  </div>
                )}
                {energySplit.anaerobicGlycolysis > 0 && (
                  <div style={{ width: `${energySplit.anaerobicGlycolysis}%`, backgroundColor: '#ef4444' }}>
                    {energySplit.anaerobicGlycolysis >= 15 ? `Anaerob: ${energySplit.anaerobicGlycolysis}%` : ''}
                  </div>
                )}
                {energySplit.aerobicGlucose > 0 && (
                  <div style={{ width: `${energySplit.aerobicGlucose}%`, backgroundColor: '#eab308' }}>
                    {energySplit.aerobicGlucose >= 15 ? `Aerob-Glukose: ${energySplit.aerobicGlucose}%` : ''}
                  </div>
                )}
                {energySplit.lipolysis > 0 && (
                  <div style={{ width: `${energySplit.lipolysis}%`, backgroundColor: '#16a34a' }}>
                    {energySplit.lipolysis >= 15 ? `Fette: ${energySplit.lipolysis}%` : ''}
                  </div>
                )}
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 text-purple-700">
                  <span className="w-3 h-3 rounded-full bg-purple-600" /> Kreatinphosphat: {energySplit.kp} %
                </span>
                <span className="inline-flex items-center gap-1.5 text-red-600">
                  <span className="w-3 h-3 rounded-full bg-red-500" /> Anaerobe Glykolyse (Laktat): {energySplit.anaerobicGlycolysis} %
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500" /> Aerobe Glykolyse (Kohlenhydrate): {energySplit.aerobicGlucose} %
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" /> Lipolyse (Fettverbrennung): {energySplit.lipolysis} %
                </span>
              </div>
            </div>

            {/* The 4 Systems Detailed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ENERGY_SYSTEMS.map(sys => (
                <div
                  key={sys.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2 hover:border-forest-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900" style={{ color: sys.color }}>
                      {sys.name}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600">
                      {sys.duration}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono text-gray-800">
                    {sys.reaction}
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Flussrate:</strong> {sys.rate}</p>
                    <p><strong>Limitierender Faktor:</strong> {sys.limitation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 4: EXPERIMENT: SAUERSTOFFSCHULD & EPOC                          */}
        {/* ========================================================================= */}
        {activeTab === 'epoc' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Experiment: Sauerstoffdefizit & Sauerstoffschuld (EPOC)
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Simuliere einen <strong>30-Sekunden-Sprint bei 350 Watt</strong>.
                Weil die Sauerstoffzufuhr träge anläuft, entsteht anfangs ein <strong>Sauerstoffdefizit</strong> (blaue Fläche).
                Nach dem Zielsprint (0 W) bleibt die Sauerstoffaufnahme noch minutenlang massiv erhöht (<strong>Sauerstoffschuld / EPOC</strong>, gelbe Fläche)!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* EPOC Plotter (Left) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    O₂-Bedarf (rot) vs. tatsächliche O₂-Aufnahme (blau)
                  </span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-blue-700">
                      <span className="w-3 h-3 bg-blue-400/40 border border-blue-600 rounded" /> O₂-Defizit
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-amber-700">
                      <span className="w-3 h-3 bg-amber-400/40 border border-amber-600 rounded" /> EPOC / Schuld
                    </span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-slate-50 p-2">
                  <canvas
                    ref={epocCanvasRef}
                    width={620}
                    height={290}
                    className="w-full h-auto block"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEpocRunning(!isEpocRunning)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all ${
                        isEpocRunning ? 'bg-amber-600' : 'bg-forest-700 hover:bg-forest-800'
                      }`}
                    >
                      {isEpocRunning ? '⏸️ Pause' : '▶️ 30s-Sprint + Nachatmung starten'}
                    </button>
                    <button
                      onClick={() => {
                        setEpocTime(0);
                        setIsEpocRunning(false);
                      }}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                      🔄 Reset
                    </button>
                  </div>

                  <span className="text-xs font-mono font-bold text-gray-700">
                    Zeit: {(epocTime / 60).toFixed(1)} / 10.0 min
                  </span>
                </div>
              </div>

              {/* EPOC Components Breakdown (Right) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs space-y-1">
                  <strong className="block text-blue-900 font-bold text-sm">
                    1. Das Sauerstoffdefizit (Sprintstart)
                  </strong>
                  <p>
                    Die Muskelzellen fordern schlagartig 3.800 ml O₂/min. Lunge und Herz können diesen Sauerstoff aber erst mit 1–2 Minuten Verzögerung heranpumpen.
                    Die Energielücke wird rein anaerob (KP + Laktat) überbrückt!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                  <strong className="block text-amber-900 font-bold text-sm">
                    2. Alaktazide Phase der EPOC (schnell)
                  </strong>
                  <p>
                    In den ersten 2–3 Minuten nach Belastungsende: Hoher O₂-Verbrauch zur Resynthese der entleerten ATP- und Kreatinphosphatspeicher sowie Wiederbeladung des Myoglobins.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-xs space-y-1">
                  <strong className="block text-purple-900 font-bold text-sm">
                    3. Laktazide Phase der EPOC (langsam)
                  </strong>
                  <p>
                    Dauert bis zu 60 Minuten: Energieaufwendiger Laktatabbau in der Leber (Glukoneogenese / Cori-Zyklus), Veratmung im Herzmuskel und Abkühlung der Körperkerntemperatur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 5: LEHRPLAN-QUIZ & SPORTPHYSIOLOGIE-GLOSSAR                      */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quiz Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 uppercase tracking-wider">
                    Lernzielkontrolle B10 2
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    Bayerisches Lehrplan-Quiz: Leistungs- & Sportphysiologie
                  </h2>
                  <p className="text-xs text-gray-600">
                    6 anspruchsvolle Aufgaben zu Sportherz, Laktatschwellen, Energiebereitstellung und Sauerstoffschuld.
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
                    📖 Fachbegriff-Glossar: Leistungs- & Sportphysiologie
                  </h3>
                  <p className="text-xs text-gray-600">
                    Definitionen und Formeln für die 10. Jahrgangsstufe am bayerischen Gymnasium.
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
          BioApps • Johannes-Scharrer-Gymnasium • Entwickelt für den Biologieunterricht der 10. Jahrgangsstufe (LehrplanPLUS Bayern B10 2).
        </p>
      </footer>
    </div>
  );
}
