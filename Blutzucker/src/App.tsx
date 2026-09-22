import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TabType,
  HealthMode,
  TermMode,
  HistoryPoint,
  MealType,
  TERM_MAP,
  GLOSSARY_ITEMS,
  QUIZ_ITEMS,
  GlossaryItem,
  QuizItem
} from './data';

// ─── SVG ICONS ─────────────────────────────────────────────────────────────────
const IconHome = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconPlay = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);
const IconPause = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
);
const IconRefresh = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></svg>
);
const IconActivity = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);
const IconHeartPulse = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.78"/></svg>
);
const IconZap = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconCheck = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconInfo = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);
const IconChevronRight = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconArrowLeft = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
);
const IconAward = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);
const IconShield = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconSyringe = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>
);
const IconDroplet = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
);
const IconHelpCircle = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

// ─── STORAGE HELPER ────────────────────────────────────────────────────────────
const LS = {
  get: <T,>(k: string, def: T): T => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set: <T,>(k: string, v: T) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT 1: SIMULATION VIEW (Synchronous Multi-Ebene + Live-Graph)
// ═══════════════════════════════════════════════════════════════════════════════
interface SimProps {
  termMode: TermMode;
}

const SimulationView: React.FC<SimProps> = ({ termMode }) => {
  // Simulation State
  const [glucose, setGlucose] = useState<number>(100);
  const [insulin, setInsulin] = useState<number>(15);
  const [glucagon, setGlucagon] = useState<number>(15);
  const [glycogen, setGlycogen] = useState<number>(75);
  const [healthMode, setHealthMode] = useState<HealthMode>('healthy');
  const [isSportActive, setIsSportActive] = useState<boolean>(false);
  const [isFastingActive, setIsFastingActive] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);

  // Meal queue & injected insulin pool
  const [mealAbsorption, setMealAbsorption] = useState<{ remaining: number; rate: number; label: string } | null>(null);
  const [injectedInsulin, setInjectedInsulin] = useState<number>(0);

  // Rolling history for live graph
  const [history, setHistory] = useState<HistoryPoint[]>(() => {
    const init: HistoryPoint[] = [];
    for (let i = 0; i < 40; i++) {
      init.push({ time: i, glucose: 100, insulin: 15, glucagon: 15 });
    }
    return init;
  });

  const tickRef = useRef<number>(40);

  // Actions
  const handleEat = (type: MealType) => {
    let add = 0;
    let rate = 0;
    let label = '';
    if (type === 'traubenzucker') {
      add = 65;
      rate = 7.5;
      label = '🍬 Traubenzucker';
    } else if (type === 'vollkorn') {
      add = 50;
      rate = 2.2;
      label = '🍞 Vollkornbrot';
    } else {
      add = 80;
      rate = 9.0;
      label = '🥤 Cola';
    }
    setMealAbsorption({ remaining: add, rate, label });
    setHistory(prev => {
      const next = [...prev];
      if (next.length > 0) {
        next[next.length - 1] = { ...next[next.length - 1], label };
      }
      return next;
    });
  };

  const handleInjectInsulin = () => {
    setInjectedInsulin(prev => prev + 35);
    setHistory(prev => {
      const next = [...prev];
      if (next.length > 0) {
        next[next.length - 1] = { ...next[next.length - 1], label: '💉 +2 IE Insulin' };
      }
      return next;
    });
  };

  const handleReset = () => {
    setGlucose(100);
    setInsulin(15);
    setGlucagon(15);
    setGlycogen(75);
    setIsSportActive(false);
    setIsFastingActive(false);
    setMealAbsorption(null);
    setInjectedInsulin(0);
    tickRef.current = 40;
    const init: HistoryPoint[] = [];
    for (let i = 0; i < 40; i++) {
      init.push({ time: i, glucose: 100, insulin: 15, glucagon: 15 });
    }
    setHistory(init);
  };

  // Main Simulation Ticker
  useEffect(() => {
    if (!isRunning) return;
    const intervalMs = 1000 / speed;

    const timer = setInterval(() => {
      setGlucose(prevGlucose => {
        let currentGlucose = prevGlucose;
        let targetInsulin = 10;
        let targetGlucagon = 10;

        // 1. Food absorption
        if (mealAbsorption && mealAbsorption.remaining > 0) {
          const absorbed = Math.min(mealAbsorption.remaining, mealAbsorption.rate);
          currentGlucose += absorbed;
          setMealAbsorption(prev => prev ? { ...prev, remaining: prev.remaining - absorbed } : null);
        }

        // 2. Physical sport
        if (isSportActive) {
          currentGlucose -= 4.2; // burns glucose in muscles
        }

        // 3. Fasting
        if (isFastingActive) {
          currentGlucose -= 1.2; // basal metabolic drain
        }

        // 4. Hormone Secretion based on Health Mode
        if (healthMode === 'healthy') {
          if (currentGlucose > 100) {
            const delta = currentGlucose - 100;
            targetInsulin = Math.min(100, 15 + delta * 1.4);
            targetGlucagon = Math.max(5, 15 - delta * 0.4);
          } else if (currentGlucose < 95) {
            const delta = 95 - currentGlucose;
            targetGlucagon = Math.min(100, 15 + delta * 2.2);
            targetInsulin = Math.max(5, 15 - delta * 0.3);
          }
        } else if (healthMode === 'type1') {
          targetInsulin = 0; // beta cells destroyed!
          if (currentGlucose < 90) {
            targetGlucagon = Math.min(100, 20 + (90 - currentGlucose) * 2.0);
          }
        } else if (healthMode === 'type2') {
          // Compensatory high insulin
          if (currentGlucose > 100) {
            targetInsulin = Math.min(100, 30 + (currentGlucose - 100) * 1.6);
          }
        }

        const totalEffectiveInsulin = Math.min(100, targetInsulin + injectedInsulin);
        setInjectedInsulin(prev => Math.max(0, prev * 0.94 - 0.5));

        setInsulin(Math.round(totalEffectiveInsulin));
        setGlucagon(Math.round(targetGlucagon));

        // 5. Physiological Actions
        let insulinEfficacy = 1.0;
        if (healthMode === 'type2') {
          insulinEfficacy = 0.22; // Receptor resistance!
        }

        if (totalEffectiveInsulin > 20) {
          const clearAmount = (totalEffectiveInsulin - 20) * 0.05 * insulinEfficacy;
          currentGlucose -= clearAmount;
          setGlycogen(prev => Math.min(100, prev + clearAmount * 0.4));
        }

        // Crucial Aha-Moment: Exercise bypasses insulin resistance in Type 2!
        if (isSportActive && healthMode === 'type2') {
          currentGlucose -= 3.0;
        }

        // Glucagon action on liver glycogen
        if (targetGlucagon > 25) {
          setGlycogen(prevGly => {
            if (prevGly > 5) {
              const releaseAmount = (targetGlucagon - 25) * 0.06;
              currentGlucose += releaseAmount;
              return Math.max(0, prevGly - releaseAmount * 0.5);
            }
            return prevGly;
          });
        }

        // Resting stabilization
        if (!mealAbsorption && !isSportActive && !isFastingActive && injectedInsulin <= 1) {
          if (healthMode === 'healthy') {
            currentGlucose += (100 - currentGlucose) * 0.08;
          }
        }

        const finalGlucose = Math.round(Math.max(25, Math.min(360, currentGlucose)));

        tickRef.current += 1;
        setHistory(prev => {
          const next = prev.slice(prev.length >= 50 ? 1 : 0);
          next.push({
            time: tickRef.current,
            glucose: finalGlucose,
            insulin: Math.round(totalEffectiveInsulin),
            glucagon: Math.round(targetGlucagon)
          });
          return next;
        });

        return finalGlucose;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, speed, healthMode, isSportActive, isFastingActive, mealAbsorption, injectedInsulin]);

  // Derived status & trend
  const glucoseStatus = useMemo(() => {
    if (glucose < 60) return { label: 'Gefährliche Unterzuckerung (Hypo!)', color: 'text-red-700 bg-red-100 border-red-300' };
    if (glucose < 80) return { label: 'Leichter Unterzucker (Glukagon aktiv)', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    if (glucose <= 120) return { label: 'Optimaler Normbereich (Sollwert)', color: 'text-green-700 bg-green-100 border-green-300' };
    if (glucose <= 160) return { label: 'Erhöhter Blutzucker (Insulin aktiv)', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    return { label: 'Starke Überzuckerung (Nierenschwelle überschritten)', color: 'text-red-700 bg-red-100 border-red-300' };
  }, [glucose]);

  const trend = useMemo(() => {
    if (history.length < 3) return '→ Stabil';
    const last = history[history.length - 1].glucose;
    const prev = history[history.length - 3].glucose;
    const diff = last - prev;
    if (diff > 5) return '↑ Rasch steigend';
    if (diff > 1) return '↗ Leicht steigend';
    if (diff < -5) return '↓ Rasch fallend';
    if (diff < -1) return '↘ Leicht fallend';
    return '→ Stabil';
  }, [history]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── TOP DIGITAL METER & GAUGES ── */}
      <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Big Glucose Readout */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-2xl font-black leading-none">{glucose}</span>
            <span className="text-[10px] font-medium opacity-80 uppercase tracking-tighter">mg / dl</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${glucoseStatus.color}`}>
                {glucoseStatus.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {trend}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {termMode === 'bio8' ? 'Sollwert: 80 – 120 mg/dl (Nüchtern ~100 mg/dl)' : 'Führungsgröße w: 4,4 – 6,7 mmol/l (Homöostase)'}
            </p>
          </div>
        </div>

        {/* 3 Hormone & Organ Gauges */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Insulin Meter */}
          <div className="flex-1 md:w-32 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1">
              <span>Insulin</span>
              <span>{insulin}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, insulin)}%` }}
              />
            </div>
          </div>

          {/* Glucagon Meter */}
          <div className="flex-1 md:w-32 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-[11px] font-bold text-orange-600 dark:text-orange-400 mb-1">
              <span>Glukagon</span>
              <span>{glucagon}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, glucagon)}%` }}
              />
            </div>
          </div>

          {/* Liver Glycogen */}
          <div className="flex-1 md:w-32 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <span>Glykogen (Leber)</span>
              <span>{Math.round(glycogen)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, glycogen)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS TOOLBAR ── */}
      <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Health Mode */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setHealthMode('healthy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                healthMode === 'healthy' ? 'bg-forest-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-forest-700'
              }`}
            >
              Gesund
            </button>
            <button
              onClick={() => setHealthMode('type1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                healthMode === 'type1' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-red-700'
              }`}
            >
              Diabetes Typ 1
            </button>
            <button
              onClick={() => setHealthMode('type2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                healthMode === 'type2' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-amber-700'
              }`}
            >
              Diabetes Typ 2
            </button>
          </div>

          {/* Time & Speed Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest-100 hover:bg-forest-200 dark:bg-forest-900 dark:hover:bg-forest-800 text-forest-800 dark:text-forest-200 font-bold text-xs transition-colors"
              title={isRunning ? 'Pause' : 'Fortsetzen'}
            >
              {isRunning ? <IconPause c="w-4 h-4" /> : <IconPlay c="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 5 : 1)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              title="Geschwindigkeit umschalten"
            >
              {speed}x
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Zurücksetzen"
            >
              <IconRefresh c="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                showOverlay
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
              }`}
            >
              <span>⚙️ Regelkreis-Overlay</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Food, Sport, Fasting, Insulin */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleEat('traubenzucker')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>🍬</span>
            <span>Traubenzucker</span>
          </button>

          <button
            onClick={() => handleEat('vollkorn')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>🍞</span>
            <span>Vollkornbrot</span>
          </button>

          <button
            onClick={() => handleEat('cola')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>🥤</span>
            <span>Cola / Limo</span>
          </button>

          <button
            onClick={() => {
              setIsSportActive(!isSportActive);
              if (!isSportActive) setIsFastingActive(false);
            }}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
              isSportActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200'
            }`}
          >
            <span>🏃</span>
            <span>Sport {isSportActive ? 'läuft' : 'starten'}</span>
          </button>

          <button
            onClick={() => {
              setIsFastingActive(!isFastingActive);
              if (!isFastingActive) setIsSportActive(false);
            }}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
              isFastingActive
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-200'
            }`}
          >
            <span>⏳</span>
            <span>Fasten {isFastingActive ? 'aktiv' : 'starten'}</span>
          </button>

          <button
            onClick={handleInjectInsulin}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
            title="Insulin ins Blut spritzen"
          >
            <IconSyringe c="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>+2 IE Insulin</span>
          </button>
        </div>
      </div>

      {/* ── SYNCHRONIZED MULTI-LEVEL PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PANEL A: MAKRO-EBENE (Organe & Blutbahn) */}
        <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-forest-900 dark:text-forest-200 flex items-center gap-1.5">
              <span>🫀</span>
              <span>Makro-Ebene: Organe & Blutkreislauf</span>
            </h3>
            <span className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Klick auf Organe für Infos
            </span>
          </div>

          <div className="relative w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 overflow-hidden">
            <svg viewBox="0 0 540 240" className="w-full h-auto">
              <defs>
                <linearGradient id="bloodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Central Bloodstream */}
              <rect x="20" y="90" width="500" height="60" rx="12" fill="url(#bloodGrad)" stroke="#ef4444" strokeWidth="2" />
              <text x="270" y="125" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="bold" opacity="0.7">
                Hauptblutbahn (Glukosetransport)
              </text>

              {/* Circulating Glucose Particles */}
              {[...Array(Math.min(18, Math.max(4, Math.floor(glucose / 16))))].map((_, i) => (
                <circle
                  key={`g-${i}`}
                  cx={40 + ((i * 27 + (glucose % 30)) % 460)}
                  cy={105 + (i % 3) * 12}
                  r="5"
                  fill="#eab308"
                  stroke="#a16207"
                  strokeWidth="1.5"
                />
              ))}

              {/* Circulating Insulin (Blue Squares) */}
              {insulin > 15 && [...Array(Math.min(10, Math.floor(insulin / 10)))].map((_, i) => (
                <rect
                  key={`ins-${i}`}
                  x={50 + ((i * 45 + (insulin % 20)) % 440)}
                  y={98 + (i % 2) * 22}
                  width="8"
                  height="8"
                  rx="1"
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth="1.5"
                />
              ))}

              {/* Circulating Glucagon (Orange Triangles) */}
              {glucagon > 20 && [...Array(Math.min(8, Math.floor(glucagon / 12)))].map((_, i) => (
                <polygon
                  key={`glu-${i}`}
                  points={`${70 + ((i * 55) % 430)},${110} ${80 + ((i * 55) % 430)},${126} ${60 + ((i * 55) % 430)},${126}`}
                  fill="#f97316"
                  stroke="#c2410c"
                  strokeWidth="1.5"
                />
              ))}

              {/* 1. PANCREAS (Top Center) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('pankreas')}
                transform="translate(190, 10)"
              >
                <rect
                  x="0"
                  y="0"
                  width="160"
                  height="65"
                  rx="10"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className={insulin > 40 ? 'glow-blue' : glucagon > 40 ? 'glow-orange' : ''}
                />
                <text x="80" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">
                  Bauchspeicheldrüse
                </text>
                <text x="80" y="34" textAnchor="middle" fontSize="9" fill="#b45309">
                  (Langerhans-Inseln)
                </text>

                {/* Beta-Cell */}
                <circle cx="45" cy="48" r="9" fill={healthMode === 'type1' ? '#9ca3af' : '#3b82f6'} opacity="0.9" />
                <text x="45" y="51" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">β</text>
                <text x="45" y="62" textAnchor="middle" fontSize="7" fill="#1e3a8a">
                  {healthMode === 'type1' ? 'Zerstört' : 'Insulin'}
                </text>

                {/* Alpha-Cell */}
                <circle cx="115" cy="48" r="9" fill="#f97316" opacity="0.9" />
                <text x="115" y="51" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">α</text>
                <text x="115" y="62" textAnchor="middle" fontSize="7" fill="#7c2d12">Glukagon</text>

                {insulin > 30 && (
                  <path d="M 50 65 L 50 85" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 3" />
                )}
                {glucagon > 30 && (
                  <path d="M 110 65 L 110 85" stroke="#f97316" strokeWidth="2.5" strokeDasharray="3 3" />
                )}
              </g>

              {/* 2. LEBER (Bottom Left) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('leber')}
                transform="translate(40, 165)"
              >
                <rect x="0" y="0" width="140" height="65" rx="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                <text x="70" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#991b1b">
                  Leberzelle
                </text>
                <text x="70" y="34" textAnchor="middle" fontSize="9" fill="#7f1d1d">
                  Glykogen-Speicher
                </text>

                <rect x="25" y="42" width="90" height="12" rx="4" fill="#fca5a5" />
                <rect x="25" y="42" width={90 * (glycogen / 100)} height="12" rx="4" fill="#dc2626" />
                <text x="70" y="51" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
                  {Math.round(glycogen)}% voll
                </text>

                {insulin > 30 && (
                  <text x="15" y="-5" fontSize="8" fill="#16a34a" fontWeight="bold">⬇ Glukose rein (Aufbau)</text>
                )}
                {glucagon > 30 && (
                  <text x="15" y="-5" fontSize="8" fill="#ea580c" fontWeight="bold">⬆ Glukose raus (Abbau)</text>
                )}
              </g>

              {/* 3. MUSKEL (Bottom Right) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('muskel')}
                transform="translate(360, 165)"
              >
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="65"
                  rx="10"
                  fill="#dbeafe"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className={isSportActive ? 'glow-green' : ''}
                />
                <text x="70" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">
                  Skelettmuskel
                </text>
                <text x="70" y="34" textAnchor="middle" fontSize="9" fill="#1e3a8a">
                  GLUT4-Aufnahme
                </text>

                <path d="M 20 45 Q 70 38 120 45 M 20 52 Q 70 45 120 52" stroke="#2563eb" strokeWidth="2" fill="none" />
                {isSportActive && (
                  <text x="70" y="62" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="bold">
                    ⚡ Kontraktion aktiv!
                  </text>
                )}
              </g>
            </svg>
          </div>

          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            {selectedOrgan === 'pankreas' && (
              <p><strong>Bauchspeicheldrüse (Pankreas):</strong> Regler und Messfühler. Die Beta-Zellen schütten Insulin aus (senkt Blutzucker), die Alpha-Zellen Glukagon (hebt Blutzucker).</p>
            )}
            {selectedOrgan === 'leber' && (
              <p><strong>Leber:</strong> Glukosespeicher des Körpers. Speichert überschüssigen Zucker als Glykogen (Insulin) und gibt Glukose frei bei Mangel (Glukagon).</p>
            )}
            {selectedOrgan === 'muskel' && (
              <p><strong>Muskulatur:</strong> Größter Glukoseverbraucher. Benötigt im Ruhezustand Insulin für GLUT4 – bei Sport öffnen sich die GLUT4-Türen auch ohne Insulin!</p>
            )}
            {!selectedOrgan && (
              <p className="text-slate-500 italic">Tippe auf ein Organ oben (Bauchspeicheldrüse, Leber, Muskel), um dessen didaktische Funktion zu sehen.</p>
            )}
          </div>
        </div>

        {/* PANEL B: MIKRO-EBENE (Zellmembran & Schlüssel-Schloss) */}
        <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-forest-900 dark:text-forest-200 flex items-center gap-1.5">
              <span>🔬</span>
              <span>Mikro-Ebene: Zellmembran & GLUT4-Transporter</span>
            </h3>
            <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
              insulin > 25 || isSportActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {insulin > 25 || isSportActive ? 'Kanäle geöffnet' : 'Kanäle geschlossen'}
            </span>
          </div>

          <div className="relative w-full rounded-xl bg-gradient-to-b from-blue-50/40 via-slate-50 to-green-50/40 dark:from-slate-900 dark:to-green-950 border border-slate-200 dark:border-slate-800 p-2 overflow-hidden">
            <svg viewBox="0 0 540 240" className="w-full h-auto">
              <text x="15" y="25" fontSize="10" fill="#64748b" fontWeight="bold">
                Außerhalb der Zelle (Blutplasma)
              </text>
              <text x="15" y="225" fontSize="10" fill="#166534" fontWeight="bold">
                Zellinneres (Zytoplasma)
              </text>

              {/* Lipid Bilayer */}
              <rect x="0" y="85" width="540" height="35" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" opacity="0.8" />
              {[...Array(27)].map((_, i) => (
                <g key={`head-${i}`}>
                  <circle cx={10 + i * 20} cy="85" r="4" fill="#f97316" />
                  <circle cx={10 + i * 20} cy="120" r="4" fill="#f97316" />
                </g>
              ))}

              {/* Insulin Receptor */}
              <g transform="translate(90, 65)">
                <path d="M 20 20 L 20 60 M 35 20 L 35 60" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                <path d="M 10 0 L 10 25 Q 28 35 45 25 L 45 0" fill="#818cf8" stroke="#4f46e5" strokeWidth="2" />
                <text x="28" y="-5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3730a3">
                  Insulin-Rezeptor
                </text>

                {insulin > 20 && (
                  <g className="animate-dock">
                    <rect x="18" y="5" width="20" height="18" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                    <text x="28" y="17" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Ins</text>
                  </g>
                )}

                {(insulin > 20 || isSportActive) && (
                  <path d="M 28 65 L 28 95" stroke="#22c55e" strokeWidth="3" strokeDasharray="3 3" />
                )}
              </g>

              {/* GLUT4 Channel */}
              <g transform="translate(270, 70)">
                <text x="40" y="-8" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f766e">
                  GLUT4-Glukosekanal
                </text>

                <rect
                  x={insulin > 25 || isSportActive ? 10 : 25}
                  y="15"
                  width="18"
                  height="40"
                  rx="6"
                  fill="#14b8a6"
                  stroke="#0d9488"
                  strokeWidth="2"
                  className="transition-all duration-700"
                />
                <rect
                  x={insulin > 25 || isSportActive ? 52 : 37}
                  y="15"
                  width="18"
                  height="40"
                  rx="6"
                  fill="#14b8a6"
                  stroke="#0d9488"
                  strokeWidth="2"
                  className="transition-all duration-700"
                />

                <text x="40" y="70" textAnchor="middle" fontSize="8" fill={insulin > 25 || isSportActive ? '#059669' : '#dc2626'} fontWeight="bold">
                  {insulin > 25 || isSportActive ? 'Offen: Glukose strömt ein' : 'Geschlossen: Keine Aufnahme'}
                </text>

                {(insulin > 25 || isSportActive) && (
                  <g className="animate-fade-in">
                    <circle cx="40" cy="15" r="4" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                    <circle cx="40" cy="35" r="4" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                    <circle cx="40" cy="55" r="4" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                    <path d="M 40 5 L 40 60" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="2 2" />
                  </g>
                )}
              </g>

              {/* GLUT4 Vesicle Pool */}
              <g transform="translate(270, 150)">
                <circle cx="40" cy="30" r="22" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="25" y="24" width="8" height="12" rx="2" fill="#14b8a6" />
                <rect x="45" y="24" width="8" height="12" rx="2" fill="#14b8a6" />
                <text x="40" y="44" textAnchor="middle" fontSize="7" fill="#115e59">GLUT4-Vesikel</text>
              </g>

              {/* Floating Glucose Outside */}
              <circle cx="210" cy="40" r="5" fill="#eab308" stroke="#a16207" />
              <circle cx="250" cy="30" r="5" fill="#eab308" stroke="#a16207" />
              <circle cx="340" cy="45" r="5" fill="#eab308" stroke="#a16207" />
              <circle cx="420" cy="35" r="5" fill="#eab308" stroke="#a16207" />
            </svg>
          </div>

          <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <p className="font-bold">Didaktischer Merksatz:</p>
              <p className="mt-0.5">
                Insulin „frisst“ den Zucker nicht auf! Es ist lediglich der <strong>Schlüssel</strong> am Rezeptor, der den Einbau der <strong>GLUT4-Kanaltüren</strong> in die Membran veranlasst, durch die Glukose einströmen kann.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE GRAPH PANEL ── */}
      <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <IconActivity c="w-5 h-5 text-forest-700 dark:text-forest-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Live-Graph: Blutzuckerkonzentration über die Zeit
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" />
              <span className="text-slate-600 dark:text-slate-400">Normbereich (80–120 mg/dl)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-blue-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-400">Blutzuckerkurve</span>
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 overflow-x-auto">
          <svg viewBox="0 0 600 200" className="w-full h-44">
            {/* Hypo Zone */}
            <rect x="50" y="160" width="530" height="30" fill="#fee2e2" opacity="0.5" />
            {/* Norm Zone */}
            <rect x="50" y="120" width="530" height="27" fill="#dcfce7" opacity="0.8" />
            {/* Hyper Zone */}
            <rect x="50" y="10" width="530" height="70" fill="#fee2e2" opacity="0.3" />

            {/* Grid lines */}
            {[60, 80, 100, 120, 180, 240].map((val) => {
              const y = 190 - (val / 300) * 170;
              return (
                <g key={`grid-${val}`}>
                  <line x1="50" y1={y} x2="580" y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray={val === 100 ? 'none' : '3 3'} />
                  <text x="45" y={y + 3} textAnchor="end" fontSize="9" fill="#64748b">
                    {val}
                  </text>
                </g>
              );
            })}

            <text x="575" y="134" textAnchor="end" fontSize="8" fill="#15803d" fontWeight="bold">
              Sollwert (~100 mg/dl)
            </text>

            {/* Polyline */}
            {history.length > 1 && (
              <polyline
                fill="none"
                stroke={glucose > 160 ? '#dc2626' : glucose < 70 ? '#b91c1c' : '#16a34a'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={history
                  .map((pt, idx) => {
                    const x = 50 + (idx / (history.length - 1)) * 520;
                    const y = 190 - (pt.glucose / 300) * 170;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Event Markers */}
            {history.map((pt, idx) => {
              if (!pt.label) return null;
              const x = 50 + (idx / (history.length - 1)) * 520;
              const y = 190 - (pt.glucose / 300) * 170;
              return (
                <g key={`ev-${idx}`}>
                  <line x1={x} y1={y} x2={x} y2={y - 22} stroke="#3b82f6" strokeWidth="1.5" />
                  <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                  <text x={x} y={y - 25} textAnchor="middle" fontSize="9" fill="#1d4ed8" fontWeight="bold">
                    {pt.label}
                  </text>
                </g>
              );
            })}

            {/* Current point */}
            {history.length > 0 && (() => {
              const lastX = 570;
              const lastY = 190 - (glucose / 300) * 170;
              return (
                <g>
                  <circle cx={lastX} cy={lastY} r="6" fill="#16a34a" className="animate-ping" opacity="0.7" />
                  <circle cx={lastX} cy={lastY} r="5" fill="#15803d" stroke="white" strokeWidth="2" />
                  <rect x={lastX - 25} y={lastY - 22} width="50" height="16" rx="4" fill="#0f172a" opacity="0.85" />
                  <text x={lastX} y={lastY - 11} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                    {glucose}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* ── CYBERNETIC OVERLAY (REGELKREIS) ── */}
      {showOverlay && (
        <div className="bg-purple-50 dark:bg-purple-950/60 p-5 rounded-2xl border-2 border-purple-300 dark:border-purple-800 shadow-md animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-purple-900 dark:text-purple-200 flex items-center gap-2">
              <span>⚙️</span>
              <span>
                {termMode === 'bio8'
                  ? 'Technischer Regelkreis: Negative Rückkopplung im Live-Betrieb'
                  : 'Kybernetisches Regelkreis-Blockschaltbild (Homöostase)'}
              </span>
            </h4>
            <span className="text-xs bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded font-medium">
              Synchron zum aktuellen Zustand
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Branch 1: Too High */}
            <div className={`p-3 rounded-xl border-2 transition-all ${
              glucose > 120 ? 'bg-blue-100 border-blue-500 shadow-md scale-[1.02]' : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="font-bold text-xs text-blue-800 mb-1 flex items-center gap-1">
                <span>⬆</span> Blutzucker &gt; 120 mg/dl (zu hoch)
              </div>
              <ul className="text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                <li><strong>Messfühler:</strong> Beta-Zellen im Pankreas</li>
                <li><strong>Stellgröße:</strong> Insulin steigt ↑</li>
                <li><strong>Stellglieder:</strong> Leber & Muskeln</li>
                <li><strong>Wirkung:</strong> Glukoseaufnahme & Glykogenspeicherung</li>
                <li className="text-blue-700 font-bold">➔ Blutzucker sinkt wieder (-)</li>
              </ul>
            </div>

            {/* Branch 2: Normal */}
            <div className={`p-3 rounded-xl border-2 transition-all ${
              glucose >= 80 && glucose <= 120 ? 'bg-green-100 border-green-500 shadow-md scale-[1.02]' : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="font-bold text-xs text-green-800 mb-1 flex items-center gap-1">
                <span>✔</span> Sollwert erreicht (80–120 mg/dl)
              </div>
              <ul className="text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                <li><strong>Zustand:</strong> Fließgleichgewicht (Homöostase)</li>
                <li><strong>Insulin:</strong> Basale Grundabgabe (~15%)</li>
                <li><strong>Glukagon:</strong> Basale Grundabgabe (~15%)</li>
                <li><strong>Organe:</strong> Stabile Energieversorgung</li>
              </ul>
            </div>

            {/* Branch 3: Too Low */}
            <div className={`p-3 rounded-xl border-2 transition-all ${
              glucose < 80 ? 'bg-orange-100 border-orange-500 shadow-md scale-[1.02]' : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="font-bold text-xs text-orange-800 mb-1 flex items-center gap-1">
                <span>⬇</span> Blutzucker &lt; 80 mg/dl (zu niedrig)
              </div>
              <ul className="text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                <li><strong>Messfühler:</strong> Alpha-Zellen im Pankreas</li>
                <li><strong>Stellgröße:</strong> Glukagon steigt ↑</li>
                <li><strong>Stellglied:</strong> Leber (Glykogenabbau)</li>
                <li><strong>Wirkung:</strong> Glukosefreisetzung ins Blut</li>
                <li className="text-orange-700 font-bold">➔ Blutzucker steigt wieder (+)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT 2: REGELKREIS-LABOR (Kybernetik & Fachsprache)
// ═══════════════════════════════════════════════════════════════════════════════
interface RegelkreisProps {
  termMode: TermMode;
  setTermMode: (m: TermMode) => void;
}

const RegelkreisView: React.FC<RegelkreisProps> = ({ termMode, setTermMode }) => {
  const [activeElement, setActiveElement] = useState<string>('sollwert');

  const elementDetails: Record<string, { title: string; bio8: string; kybernetik: string; desc: string; icon: string }> = {
    sollwert: {
      title: 'Sollwert / Führungsgröße',
      bio8: 'Sollwert (~100 mg/dl)',
      kybernetik: 'Führungsgröße w',
      desc: 'Der vom gesunden Körper angestrebte Normalbereich liegt nüchtern bei 80 bis 120 mg/dl. Dieser Wert garantiert, dass das Gehirn ohne Unterbrechung mit Glukose versorgt wird.',
      icon: '🎯'
    },
    istwert: {
      title: 'Istwert / Regelgröße',
      bio8: 'Aktueller Blutzuckerspiegel',
      kybernetik: 'Regelgröße x',
      desc: 'Die tatsächlich im Blut messbare Glukosekonzentration in mg/dl. Sie schwankt nach Mahlzeiten oder Sport und muss ständig kontrolliert werden.',
      icon: '🩸'
    },
    sensor: {
      title: 'Messfühler & Regler',
      bio8: 'Bauchspeicheldrüse (Langerhans-Inseln)',
      kybernetik: 'Sensor & Regler / Komparator',
      desc: 'Die Beta- und Alpha-Zellen registrieren kleinste Abweichungen des Istwerts vom Sollwert und fungieren gleichzeitig als Steuerzentrale.',
      icon: '🎛️'
    },
    hormone: {
      title: 'Stellgrößen (Hormone)',
      bio8: 'Insulin (Senker) & Glukagon (Heber)',
      kybernetik: 'Stellgröße y',
      desc: 'Die chemischen Informationsüberträger im Blut. Insulin befiehlt Speicherung/Verbrauch, Glukagon befiehlt Glukosefreisetzung.',
      icon: '✉️'
    },
    effektoren: {
      title: 'Stellglieder / Zielorgane',
      bio8: 'Leber- und Muskelzellen',
      kybernetik: 'Stellglieder / Effektoren',
      desc: 'Organe, die auf die Hormone reagieren. Die Leber baut Glykogen auf oder ab; die Muskeln schleusen Glukose über GLUT4-Kanäle ein.',
      icon: '🏭'
    },
    stoergroesse: {
      title: 'Störgrößen von außen',
      bio8: 'Essen, Trinken, Sport, Fasten, Stress',
      kybernetik: 'Störgröße z',
      desc: 'Äußere und innere Einflüsse, die den Blutzuckerspiegel aus dem Gleichgewicht bringen. Eine Mahlzeit erhöht ihn (+), Muskelarbeit oder Fasten senkt ihn (-).',
      icon: '⚡'
    },
    rueckkopplung: {
      title: 'Negative Rückkopplung (Gegenkopplung)',
      bio8: 'Minus-Rückmeldung / Bremswirkung',
      kybernetik: 'Gegenkopplung / Negative Feedback Loop',
      desc: 'Das Herzstück der Selbstregulation: Die eingeleitete Reaktion bremst ihre eigene Ursache ab. Steigt der Zucker, bewirkt Insulin dessen Senkung, bis der Sollwert wieder erreicht ist.',
      icon: '🔄'
    }
  };

  const current = elementDetails[activeElement];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Terminology Switcher */}
      <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>⚙️</span>
            <span>Regelkreis-Labor: Das Prinzip der negativen Rückkopplung</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interaktives Kybernetik-Modell nach LehrplanPLUS Gymnasium Bayern (B8 2)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setTermMode('bio8')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              termMode === 'bio8' ? 'bg-forest-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            8. Klasse Biologie
          </button>
          <button
            onClick={() => setTermMode('kybernetik')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              termMode === 'kybernetik' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Kybernetik / Oberstufe
          </button>
        </div>
      </div>

      {/* Interactive Block Diagram SVG */}
      <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between">
          <span>Klicke auf einen Baustein im Regelkreis:</span>
          <span className="text-xs text-forest-600 dark:text-forest-400 font-semibold">
            Ausgewählt: {current.title}
          </span>
        </h3>

        <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 620 300" className="w-full h-auto min-w-[560px]">
            {/* Loop Circle / Connecting Paths */}
            <path
              d="M 120 70 L 260 70 L 420 70 L 480 140 L 420 220 L 160 220 L 100 150 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Negative Feedback Sign at return */}
            <g
              className="cursor-pointer"
              onClick={() => setActiveElement('rueckkopplung')}
            >
              <circle
                cx="100"
                cy="150"
                r="18"
                fill={activeElement === 'rueckkopplung' ? '#ef4444' : '#fee2e2'}
                stroke="#dc2626"
                strokeWidth="2"
              />
              <text x="100" y="156" textAnchor="middle" fontSize="18" fontWeight="black" fill={activeElement === 'rueckkopplung' ? 'white' : '#dc2626'}>
                −
              </text>
              <text x="50" y="154" textAnchor="end" fontSize="9" fontWeight="bold" fill="#dc2626">
                Rückkopplung (−)
              </text>
            </g>

            {/* 1. SOLLWERT (Top Left) */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveElement('sollwert')}
              transform="translate(40, 40)"
            >
              <rect
                x="0"
                y="0"
                width="120"
                height="60"
                rx="10"
                fill={activeElement === 'sollwert' ? '#22c55e' : '#dcfce7'}
                stroke="#16a34a"
                strokeWidth="2"
              />
              <text x="60" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeElement === 'sollwert' ? 'white' : '#14532d'}>
                {termMode === 'bio8' ? 'Sollwert' : 'Führungsgröße w'}
              </text>
              <text x="60" y="42" textAnchor="middle" fontSize="9" fill={activeElement === 'sollwert' ? 'white' : '#166534'}>
                80 – 120 mg/dl
              </text>
            </g>

            {/* 2. REGLER & SENSOR (Top Center) */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveElement('sensor')}
              transform="translate(200, 40)"
            >
              <rect
                x="0"
                y="0"
                width="140"
                height="60"
                rx="10"
                fill={activeElement === 'sensor' ? '#3b82f6' : '#dbeafe'}
                stroke="#2563eb"
                strokeWidth="2"
              />
              <text x="70" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeElement === 'sensor' ? 'white' : '#1e3a8a'}>
                {termMode === 'bio8' ? 'Bauchspeicheldrüse' : 'Regler & Fühler'}
              </text>
              <text x="70" y="42" textAnchor="middle" fontSize="8" fill={activeElement === 'sensor' ? 'white' : '#1d4ed8'}>
                Langerhans-Inseln (α & β)
              </text>
            </g>

            {/* 3. STELLGRÖSSE (Top Right) */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveElement('hormone')}
              transform="translate(380, 40)"
            >
              <rect
                x="0"
                y="0"
                width="130"
                height="60"
                rx="10"
                fill={activeElement === 'hormone' ? '#8b5cf6' : '#ede9fe'}
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <text x="65" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeElement === 'hormone' ? 'white' : '#4c1d95'}>
                {termMode === 'bio8' ? 'Hormone' : 'Stellgröße y'}
              </text>
              <text x="65" y="42" textAnchor="middle" fontSize="8" fill={activeElement === 'hormone' ? 'white' : '#5b21b6'}>
                Insulin & Glukagon
              </text>
            </g>

            {/* 4. STELLGLIEDER (Bottom Right) */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveElement('effektoren')}
              transform="translate(360, 190)"
            >
              <rect
                x="0"
                y="0"
                width="150"
                height="60"
                rx="10"
                fill={activeElement === 'effektoren' ? '#f59e0b' : '#fef3c7'}
                stroke="#d97706"
                strokeWidth="2"
              />
              <text x="75" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeElement === 'effektoren' ? 'white' : '#78350f'}>
                {termMode === 'bio8' ? 'Leber & Muskeln' : 'Stellglieder (Effektoren)'}
              </text>
              <text x="75" y="42" textAnchor="middle" fontSize="8" fill={activeElement === 'effektoren' ? 'white' : '#92400e'}>
                Speicherung & Verbrauch
              </text>
            </g>

            {/* 5. REGELGRÖSSE / ISTWERT (Bottom Center-Left) */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveElement('istwert')}
              transform="translate(170, 190)"
            >
              <rect
                x="0"
                y="0"
                width="140"
                height="60"
                rx="10"
                fill={activeElement === 'istwert' ? '#ef4444' : '#fee2e2'}
                stroke="#dc2626"
                strokeWidth="2"
              />
              <text x="70" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeElement === 'istwert' ? 'white' : '#7f1d1d'}>
                {termMode === 'bio8' ? 'Blutzuckerspiegel' : 'Regelgröße x'}
              </text>
              <text x="70" y="42" textAnchor="middle" fontSize="8" fill={activeElement === 'istwert' ? 'white' : '#991b1b'}>
                Glukosegehalt im Blut
              </text>
            </g>

            {/* 6. STÖRGRÖSSE (Center / Outside Injection) */}
            <g
              className="cursor-pointer group"
              onClick={() => setActiveElement('stoergroesse')}
              transform="translate(240, 120)"
            >
              <rect
                x="0"
                y="0"
                width="140"
                height="46"
                rx="8"
                fill={activeElement === 'stoergroesse' ? '#f97316' : '#ffedd5'}
                stroke="#ea580c"
                strokeWidth="2"
              />
              <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeElement === 'stoergroesse' ? 'white' : '#7c2d12'}>
                {termMode === 'bio8' ? 'Störung: Mahlzeit / Sport' : 'Störgröße z'}
              </text>
              <text x="70" y="34" textAnchor="middle" fontSize="8" fill={activeElement === 'stoergroesse' ? 'white' : '#9a3412'}>
                Bringt Wert aus dem Takt
              </text>
              <path d="M 70 46 L 70 65" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" />
            </g>
          </svg>
        </div>

        {/* Selected Component Detailed Explainer */}
        <div className="mt-4 p-4 rounded-xl bg-forest-50 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800 animate-fade-in flex items-start gap-3">
          <div className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-forest-100 dark:border-forest-900">
            {current.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-forest-900 dark:text-forest-100">{current.title}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-forest-200 text-forest-800 dark:bg-forest-800 dark:text-forest-200 font-semibold">
                {termMode === 'bio8' ? current.bio8 : current.kybernetik}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {current.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Terminology Comparison Table */}
      <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
          Vergleichstabelle: Fachbegriffe Gymnasium 8. Klasse vs. Kybernetik
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2 px-3">Biologie 8. Klasse (Alltag)</th>
                <th className="py-2 px-3">Kybernetik / Oberstufe</th>
                <th className="py-2 px-3">Biologisches Beispiel</th>
                <th className="py-2 px-3">Erklärung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {TERM_MAP.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-2 px-3 font-semibold text-forest-800 dark:text-forest-300">{item.bio8}</td>
                  <td className="py-2 px-3 font-mono text-purple-700 dark:text-purple-400 font-bold">{item.kybernetik}</td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{item.beispiel}</td>
                  <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{item.erklaerung}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT 3: ZELL-EBENE IM DETAIL (Mikroskop-Tour & Fehlkonzept-Entlarver)
// ═══════════════════════════════════════════════════════════════════════════════
const ZellulaerView: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [showGlucagon, setShowGlucagon] = useState<boolean>(false);

  const steps = [
    {
      title: 'Schritt 1: Der Glukoseanstieg im Blut',
      desc: 'Nach dem Essen (z. B. Brot oder Obst) spalten Enzyme im Dünndarm die Nahrung in Glukosemoleküle. Diese werden ins Blut aufgenommen. Doch die Muskel- und Leberzellen sind von einer fetthaltigen Zellmembran (Lipid-Doppelschicht) umgeben – polare Glukose kann nicht einfach so durch die Wand hindurch!',
      tag: 'Ausgangslage'
    },
    {
      title: 'Schritt 2: Das Signal – Insulin als Schlüssel',
      desc: 'Die Beta-Zellen der Bauchspeicheldrüse registrieren den Zuckeranstieg und schütten Insulin ins Blut aus. Insulin erreicht über den Blutstrom die Muskel- und Leberzellen und bindet dort hochpräzise an spezifische Insulin-Rezeptoren nach dem Schlüssel-Schloss-Prinzip.',
      tag: 'Schlüssel-Schloss'
    },
    {
      title: 'Schritt 3: Die Signalkaskade im Zellinneren',
      desc: 'Sobald Insulin an den Rezeptor andockt, ändert dieser seine Form. Im Zellinneren wird ein biochemisches Signal (eine Kaskade von Botenstoffen) ausgelöst. Dieses Signal alarmiert die tief im Zytoplasma ruhenden Vesikel.',
      tag: 'Signalkette'
    },
    {
      title: 'Schritt 4: Translokation der GLUT4-Vesikel',
      desc: 'Kleine Bläschen (Vesikel), in deren Membran Glukosetransporter-Proteine (GLUT4) eingebettet sind, wandern gezielt zur Zelloberfläche. Dort verschmelzen sie mit der äußeren Zellmembran (Exozytose).',
      tag: 'Membranfusion'
    },
    {
      title: 'Schritt 5: Erleichterte Diffusion – Die Schleusen öffnen sich',
      desc: 'Die GLUT4-Proteine bilden nun offene Kanäle in der Zellmembran. Glukose diffundiert passiv entlang des Konzentrationsgefälles (von außen, wo viel ist, nach innen, wo wenig ist) in die Zelle hinein. Der Blutzuckerspiegel im Blut sinkt!',
      tag: 'Glukose-Einstrom'
    },
    {
      title: 'Schritt 6: Speicherung als Glykogen',
      desc: 'In der Leber- und Muskelzelle wird die aufgenommene Glukose durch Enzyme zu langen, verzweigten Ketten verknüpft: Glykogen (tierische Stärke). Hier lagert die Energie sicher für die nächste Fasten- oder Sportphase.',
      tag: 'Glykogensynthese'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🔬</span>
            <span>Zell-Ebene im Detail: Wie Glukose in die Zelle gelangt</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Schritt-für-Schritt-Animation der molekularen Schlüssel-Schloss-Wirkung & GLUT4-Translokation
          </p>
        </div>

        <button
          onClick={() => setShowGlucagon(!showGlucagon)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            showGlucagon
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800'
          }`}
        >
          {showGlucagon ? '⬅ Zurück zu Insulin' : 'Gegenspieler Glukagon ansehen ➔'}
        </button>
      </div>

      {!showGlucagon ? (
        /* INSULIN & GLUT4 WALKTHROUGH */
        <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
              {steps[step].tag} · {step + 1} von {steps.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={step === 0}
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
              >
                <IconArrowLeft c="w-4 h-4" />
              </button>
              <button
                disabled={step === steps.length - 1}
                onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                className="p-1.5 rounded-lg bg-forest-600 text-white disabled:opacity-30"
              >
                <IconChevronRight c="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {steps[step].title}
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {steps[step].desc}
          </p>

          {/* Interactive Visual Graphic for Current Step */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <svg viewBox="0 0 540 180" className="w-full h-auto">
              {/* Membrane */}
              <rect x="0" y="65" width="540" height="26" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" />
              <text x="15" y="20" fontSize="9" fill="#64748b" fontWeight="bold">Außen (Blut: Glukosereich)</text>
              <text x="15" y="170" fontSize="9" fill="#166534" fontWeight="bold">Innen (Zytoplasma: Zielzelle)</text>

              {/* Step 1: Glucose outside, cannot cross */}
              {step >= 0 && (
                <g>
                  <circle cx="80" cy="35" r="5" fill="#eab308" stroke="#a16207" />
                  <circle cx="120" cy="40" r="5" fill="#eab308" stroke="#a16207" />
                  <circle cx="170" cy="30" r="5" fill="#eab308" stroke="#a16207" />
                  <circle cx="230" cy="45" r="5" fill="#eab308" stroke="#a16207" />
                </g>
              )}

              {/* Step 2 & 3: Insulin & Receptor */}
              <g transform="translate(100, 48)">
                <path d="M 20 18 L 20 45 M 32 18 L 32 45" stroke="#6366f1" strokeWidth="3" />
                <path d="M 12 0 L 12 20 Q 26 28 40 20 L 40 0" fill="#818cf8" stroke="#4f46e5" strokeWidth="1.5" />
                <text x="26" y="-4" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3730a3">Rezeptor</text>

                {step >= 1 && (
                  <rect x="18" y="2" width="16" height="15" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
                )}
                {step >= 2 && (
                  <path d="M 26 48 L 26 80" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="3 3" />
                )}
              </g>

              {/* Step 4 & 5: GLUT4 channel & Vesicles */}
              <g transform="translate(280, 50)">
                <text x="35" y="-6" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f766e">
                  GLUT4
                </text>

                {step < 3 && (
                  /* Vesicle deep inside */
                  <g transform="translate(10, 65)">
                    <circle cx="25" cy="25" r="16" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1" strokeDasharray="2 2" />
                    <rect x="15" y="20" width="6" height="10" rx="1" fill="#14b8a6" />
                    <rect x="29" y="20" width="6" height="10" rx="1" fill="#14b8a6" />
                    <text x="25" y="48" textAnchor="middle" fontSize="7" fill="#115e59">Ruhendes Vesikel</text>
                  </g>
                )}

                {step === 3 && (
                  /* Vesicle merging with membrane */
                  <g transform="translate(10, 20)">
                    <circle cx="25" cy="15" r="16" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" />
                    <text x="25" y="42" textAnchor="middle" fontSize="7" fill="#059669" fontWeight="bold">Fusion!</text>
                  </g>
                )}

                {step >= 4 && (
                  /* Open GLUT4 pores with inflowing glucose */
                  <g>
                    <rect x="10" y="15" width="14" height="32" rx="4" fill="#14b8a6" />
                    <rect x="46" y="15" width="14" height="32" rx="4" fill="#14b8a6" />
                    <path d="M 35 10 L 35 60" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="35" cy="25" r="4" fill="#eab308" />
                    <circle cx="35" cy="55" r="4" fill="#eab308" />
                  </g>
                )}
              </g>

              {/* Step 6: Glycogen chain */}
              {step === 5 && (
                <g transform="translate(390, 110)">
                  <rect x="0" y="0" width="120" height="40" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                  <text x="60" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#14532d">Glykogen-Synthese</text>
                  <circle cx="30" cy="28" r="4" fill="#22c55e" />
                  <line x1="34" y1="28" x2="46" y2="28" stroke="#16a34a" strokeWidth="2" />
                  <circle cx="50" cy="28" r="4" fill="#22c55e" />
                  <line x1="54" y1="28" x2="66" y2="28" stroke="#16a34a" strokeWidth="2" />
                  <circle cx="70" cy="28" r="4" fill="#22c55e" />
                  <line x1="74" y1="28" x2="86" y2="28" stroke="#16a34a" strokeWidth="2" />
                  <circle cx="90" cy="28" r="4" fill="#22c55e" />
                </g>
              )}
            </svg>
          </div>

          {/* Stepper Dots */}
          <div className="flex justify-center gap-2 pt-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  step === i ? 'bg-forest-600 w-8' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* GLUCAGON IN LIVER CELL */
        <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300 font-bold text-base">
            <span>🛡️</span>
            <span>Der Gegenspieler: Glukagon aktiviert den Glykogenabbau in der Leber</span>
          </div>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Wenn der Blutzuckerspiegel bei Fasten, Schlafen oder Sport unter ca. 80 mg/dl fällt, schütten die Alpha-Zellen <strong>Glukagon</strong> aus. Glukagon bindet an Glukagon-Rezeptoren der Leberzelle und aktiviert das Enzym <em>Glykogenphosphorylase</em>. Dieses Enzym spaltet die gespeicherten Glykogenketten Baustein für Baustein wieder in freie Glukose auf, die sofort über Transportkanäle ins Blut abgegeben wird!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-xl border border-orange-200 dark:border-orange-800">
              <h4 className="font-bold text-xs text-orange-900 dark:text-orange-200 mb-2">Warum ist Glukagon lebenswichtig?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ohne Glukagon würde der Blutzucker nach wenigen Stunden Fasten abstürzen. Da rote Blutkörperchen und das Gehirn auf Glukose angewiesen sind, schützt Glukagon zuverlässig vor Bewusstlosigkeit und Unterzuckerung.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200 mb-2">Gegenspieler-Paar (Antagonismus)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Insulin</strong> = Speichern, Senken, Aufbau (Anabolismus)<br />
                <strong>Glukagon</strong> = Freisetzen, Steigern, Abbau (Katabolismus)<br />
                Zusammen sorgen sie für ein perfektes Gleichgewicht (~100 mg/dl).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Misconception Myth vs. Fact Cards */}
      <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🧠</span>
          <span>Fehlkonzept-Entlarver: Falsche Vorstellungen vs. Biologische Realität</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300 mb-1">
              <IconX c="w-4 h-4 text-red-600" />
              <span>Mythos 1</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              „Insulin frisst oder zerstört den Zucker direkt im Blut.“
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-red-200 dark:border-red-900/60 pt-2">
              <strong>Fakt:</strong> Insulin ist lediglich ein Botenstoff (Schlüssel). Es zerstört nichts, sondern veranlasst die Zelle, Türen (GLUT4) einzubauen!
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
              <IconX c="w-4 h-4 text-amber-600" />
              <span>Mythos 2</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              „Nur Insulin ist wichtig – Glukagon braucht man fast nie.“
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-amber-200 dark:border-amber-900/60 pt-2">
              <strong>Fakt:</strong> Ohne Glukagon würde man bei jeder Sportstunde oder über Nacht in ein lebensgefährliches hypoglykämisches Koma fallen.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">
              <IconX c="w-4 h-4 text-blue-600" />
              <span>Mythos 3</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              „Zuckeressen führt automatisch zu Diabetes Typ 1.“
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-blue-200 dark:border-blue-900/60 pt-2">
              <strong>Fakt:</strong> Typ 1 ist eine Autoimmunerkrankung, bei der das Immunsystem fälschlicherweise die eigenen Beta-Zellen zerstört – unabhängig von Ernährung.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT 4: DIABETES-STATION (Klinische Patientenfälle)
// ═══════════════════════════════════════════════════════════════════════════════
const DiabetesView: React.FC = () => {
  const [patient, setPatient] = useState<'anna' | 'bernd'>('anna');

  // Anna (Typ 1) simulation state
  const [annaGlucose, setAnnaGlucose] = useState<number>(240);
  const [annaHistory, setAnnaHistory] = useState<number[]>([120, 160, 210, 240]);
  const [annaFeedback, setAnnaFeedback] = useState<string | null>(null);

  // Bernd (Typ 2) simulation state
  const [berndGlucose, setBerndGlucose] = useState<number>(220);
  const [berndAction, setBerndAction] = useState<'idle' | 'insulin' | 'sport'>('idle');

  const handleAnnaDose = (units: number) => {
    let newGlucose = annaGlucose;
    if (units === 1) {
      newGlucose = Math.max(40, annaGlucose - 40);
    } else if (units === 2) {
      newGlucose = Math.max(40, annaGlucose - 130);
    } else {
      newGlucose = Math.max(25, annaGlucose - 210);
    }

    setAnnaGlucose(newGlucose);
    setAnnaHistory(prev => [...prev.slice(prev.length >= 8 ? 1 : 0), newGlucose]);

    if (newGlucose < 60) {
      setAnnaFeedback('🚨 VORSICHT HYPOGLYKÄMIE! Zu viel Insulin gespritzt. Anna zittert und schwitzt. Gib ihr sofort Traubenzucker!');
    } else if (newGlucose <= 120) {
      setAnnaFeedback('🎉 Perfekt dosiert! Annas Blutzucker liegt nun im gesunden Normbereich (ca. 100 mg/dl).');
    } else {
      setAnnaFeedback('ℹ️ Die Dosis hat den Blutzucker etwas gesenkt, er ist aber immer noch über dem Sollwert (>140 mg/dl).');
    }
  };

  const handleAnnaDextrose = () => {
    setAnnaGlucose(prev => Math.min(180, prev + 70));
    setAnnaFeedback('✅ Notfall-Traubenzucker verabreicht! Annas Blutzucker steigt rasch wieder an und die Unterzuckerung ist abgewendet.');
  };

  const handleBerndAction = (act: 'insulin' | 'sport') => {
    setBerndAction(act);
    if (act === 'insulin') {
      // Little effect due to receptor resistance
      setBerndGlucose(prev => Math.max(160, prev - 20));
    } else {
      // Big effect due to AMPK GLUT4 translocation!
      setBerndGlucose(prev => Math.max(95, prev - 110));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Patient Tab Switcher */}
      <div className="bg-white dark:bg-green-950 p-4 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🩺</span>
            <span>Diagnose-Labor: Diabetes mellitus verstehen & behandeln</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Binnendifferenzierung & klinische Entscheidungsfindung auf 8.-Klasse-Niveau
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setPatient('anna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              patient === 'anna' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Fall 1: Anna (Typ 1)
          </button>
          <button
            onClick={() => setPatient('bernd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              patient === 'bernd' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Fall 2: Bernd (Typ 2)
          </button>
        </div>
      </div>

      {patient === 'anna' ? (
        /* PATIENT ANNA (TYP 1) */
        <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-red-200 dark:border-red-900 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded">
                Diabetes mellitus Typ 1 · Absoluter Insulinmangel
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Patientenakte: Anna (14 Jahre, Schülerin)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Aktueller Blutzucker:</span>
              <span className={`text-xl font-black px-3 py-1 rounded-xl ${
                annaGlucose < 60 ? 'bg-red-600 text-white animate-bounce' : annaGlucose <= 120 ? 'bg-green-600 text-white' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
              }`}>
                {annaGlucose} mg/dl
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Krankheitsursache & Situation:</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Annas Immunsystem hat durch eine Autoimmunreaktion ihre körpereigenen <strong>Beta-Zellen zerstört</strong>. Ihre Bauchspeicheldrüse produziert <strong>0% Insulin</strong>.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anna hat in der großen Pause ein Pausenbrot gegessen. Da kein Insulin vorhanden ist, kann die Glukose nicht in die Zellen gelangen und staut sich im Blut an ({annaGlucose} mg/dl).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Deine therapeutische Entscheidung:</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Wähle die passende Insulindosis, um Annas Blutzucker sanft auf ca. 100 mg/dl zu senken:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAnnaDose(1)}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs"
                >
                  💉 1 IE Insulin (Vorsichtig)
                </button>
                <button
                  onClick={() => handleAnnaDose(2)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  💉 2 IE Insulin (Standard)
                </button>
                <button
                  onClick={() => handleAnnaDose(4)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                >
                  💉 4 IE Insulin (Viel!)
                </button>
              </div>

              {annaGlucose < 60 && (
                <button
                  onClick={handleAnnaDextrose}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs animate-pulse flex items-center justify-center gap-1.5"
                >
                  <span>🍬</span>
                  <span>NOTFALL: Sofort Traubenzucker verabreichen!</span>
                </button>
              )}
            </div>
          </div>

          {annaFeedback && (
            <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
              annaGlucose < 60 ? 'bg-red-100 border-red-300 text-red-900' : annaGlucose <= 120 ? 'bg-green-100 border-green-300 text-green-900' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              {annaFeedback}
            </div>
          )}
        </div>
      ) : (
        /* PATIENT BERND (TYP 2) */
        <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-amber-200 dark:border-amber-900 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded">
                Diabetes mellitus Typ 2 · Relative Insulinresistenz
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Patientenakte: Herr Bernd Meyer (52 Jahre, Büroangestellter)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Aktueller Blutzucker:</span>
              <span className={`text-xl font-black px-3 py-1 rounded-xl ${
                berndGlucose <= 120 ? 'bg-green-600 text-white' : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
              }`}>
                {berndGlucose} mg/dl
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Krankheitsursache & Befund:</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Bernd hat reichlich körpereigenes Insulin im Blut – doch seine Muskel- und Leberzellen sind <strong>insulinresistent</strong>. Die Insulin-Rezeptoren reagieren kaum noch auf das Hormon („das Schloss klemmt“).
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nach dem Mittagessen staut sich die Glukose auf {berndGlucose} mg/dl. Teste nun zwei verschiedene Therapiemethoden!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Experiment: Therapie vergleichen</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleBerndAction('insulin')}
                  className="p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs text-left"
                >
                  Option A: Zusätzliches Insulin spritzen
                  <span className="block text-[11px] font-normal text-blue-700">Versuch, die Resistenz mit noch mehr Hormon zu überwinden.</span>
                </button>

                <button
                  onClick={() => handleBerndAction('sport')}
                  className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs text-left"
                >
                  Option B: 20 Minuten strammer Spaziergang (Sport)
                  <span className="block text-[11px] font-normal text-emerald-700">Aktivierung der Muskelkontraktion.</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feedback & Didactic Resolution */}
          {berndAction !== 'idle' && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              berndAction === 'sport' ? 'bg-green-100 border-green-300 text-green-900' : 'bg-amber-100 border-amber-300 text-amber-900'
            }`}>
              {berndAction === 'insulin' ? (
                <div>
                  <h4 className="font-bold mb-1">Ergebnis Option A: Kaum Besserung ({berndGlucose} mg/dl)</h4>
                  <p>
                    Obwohl mehr Insulin im Blut zirkuliert, sinkt der Blutzucker nur minimal. Die Rezeptoren sind abgestumpft („Insulinresistenz“). Noch mehr Insulin verstärkt auf Dauer das Problem.
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="font-bold mb-1">🎉 Sensationelles Ergebnis Option B: Blutzucker sinkt auf {berndGlucose} mg/dl!</h4>
                  <p>
                    <strong>Der didaktische Aha-Effekt:</strong> Bei Muskelkontraktion wandern GLUT4-Glukosekanäle über einen <em>völlig insulinunabhängigen</em> Signalweg (AMPK-Kaskade) in die Membran! Die Muskelzellen saugen den Zucker förmlich aus dem Blut – ganz ohne funktionierenden Insulinrezeptor. Daher ist Sport das wirksamste Medikament bei Typ 2!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT 5: FEHLKONZEPT-QUIZ
// ═══════════════════════════════════════════════════════════════════════════════
const QuizView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const q = QUIZ_ITEMS[currentIdx];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedOpt(idx);
    setAnswered(true);
    if (idx === q.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_ITEMS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setAnswered(false);
    } else {
      setQuizFinished(true);
      LS.set('blutzucker_quiz_score', score + (selectedOpt === q.correct ? 0 : 0));
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
        {!quizFinished ? (
          <div className="space-y-4">
            {/* Progress Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-800 dark:text-forest-200 bg-forest-100 dark:bg-forest-900 px-3 py-1 rounded-full">
                Frage {currentIdx + 1} von {QUIZ_ITEMS.length}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Punkte: {score}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
              {q.question}
            </h3>

            {/* Options */}
            <div className="space-y-2 pt-2">
              {q.options.map((opt, idx) => {
                let btnStyle = 'border-slate-200 hover:border-forest-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900';
                if (answered) {
                  if (idx === q.correct) {
                    btnStyle = 'border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200 font-bold';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200';
                  } else {
                    btnStyle = 'border-slate-200 opacity-50 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-3 rounded-xl border-2 text-left text-xs md:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanation */}
            {answered && (
              <div className="p-4 rounded-xl bg-forest-50 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800 space-y-2 animate-fade-in text-xs">
                <div className="flex items-center gap-1.5 font-bold text-forest-800 dark:text-forest-200">
                  {selectedOpt === q.correct ? <IconCheck c="w-4 h-4 text-green-600" /> : <IconX c="w-4 h-4 text-red-600" />}
                  <span>{selectedOpt === q.correct ? 'Richtig beantwortet!' : 'Nicht ganz richtig!'}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {q.explanation}
                </p>
                <p className="text-amber-800 dark:text-amber-300 italic">
                  💡 {q.misconceptionAlert}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <span>{currentIdx < QUIZ_ITEMS.length - 1 ? 'Nächste Frage' : 'Zur Auswertung'}</span>
                    <IconChevronRight c="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* QUIZ COMPLETE */
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-700 mx-auto flex items-center justify-center text-3xl">
              <IconAward c="w-10 h-10 text-forest-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Quiz abgeschlossen!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Du hast <strong>{score} von {QUIZ_ITEMS.length}</strong> Fragen richtig beantwortet.
            </p>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-forest-50 dark:bg-forest-950 border border-forest-200 dark:border-forest-800 text-xs text-slate-700 dark:text-slate-300">
              {score === QUIZ_ITEMS.length ? (
                <p>🥇 <strong>Hervorragend!</strong> Du hast die biochemischen und kybernetischen Grundlagen der Blutzuckerregulation perfekt gemeistert.</p>
              ) : score >= 4 ? (
                <p>🥈 <strong>Sehr gut!</strong> Du hast die wichtigsten Prinzipien (Glukagon als Gegenspieler, GLUT4-Transporter) verstanden.</p>
              ) : (
                <p>🥉 <strong>Guter Versuch!</strong> Schau dir nochmals die Zell-Ebene und das Regelkreis-Labor an, um die Stolperfallen zu meistern.</p>
              )}
            </div>

            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs inline-flex items-center gap-2"
            >
              <IconRefresh c="w-4 h-4" />
              <span>Quiz wiederholen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT 6: WISSEN & LEHRPLAN (Glossar & Matrix)
// ═══════════════════════════════════════════════════════════════════════════════
const WissenView: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  const filteredGlossary = useMemo(() => {
    if (!search.trim()) return GLOSSARY_ITEMS;
    const s = search.toLowerCase();
    return GLOSSARY_ITEMS.filter(
      item => item.term.toLowerCase().includes(s) || item.definition.toLowerCase().includes(s) || item.details.toLowerCase().includes(s)
    );
  }, [search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Curriculum Context Banner */}
      <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-forest-800 dark:text-forest-200 font-bold text-base">
          <span>📜</span>
          <span>LehrplanPLUS Bayern: Gymnasium Biologie 8. Jahrgangsstufe (B8 2)</span>
        </div>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Im Lehrplanbereich <strong>B8 2 „Informationsaufnahme, Informationsverarbeitung und Reaktion beim Menschen“</strong> lernen Schülerinnen und Schüler das Hormonsystem als chemisches Steuer- und Informationssystem kennen. Die Blutzuckerregulation dient dabei als zentrales biologisches Paradebeispiel für das <strong>kybernetische Prinzip der negativen Rückkopplung</strong> (Regelkreis mit Sollwert, Messfühler, Regler und Stellgliedern) sowie für die antagonistische Hormonwirkung von Insulin und Glukagon.
        </p>
      </div>

      {/* Glossary Search & List */}
      <div className="bg-white dark:bg-green-950 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📖</span>
            <span>Fachbegriffe-Lexikon & Glossar</span>
          </h3>
          <input
            type="text"
            placeholder="Begriff suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full sm:w-56"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredGlossary.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-forest-900 dark:text-forest-200">{item.term}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.definition}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.details}</p>
              {item.misconception && (
                <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900 mt-1">
                  💡 {item.misconception}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bioApps_darkMode');
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('bioApps_darkMode', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [termMode, setTermMode] = useState<TermMode>('bio8');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'simulation', label: 'Simulation', icon: '🔄' },
    { id: 'regelkreis', label: 'Regelkreis-Labor', icon: '⚙️' },
    { id: 'zellulaer', label: 'Zell-Ebene', icon: '🔬' },
    { id: 'diabetes', label: 'Diabetes-Station', icon: '🩺' },
    { id: 'quiz', label: 'Fehlkonzept-Quiz', icon: '🎯' },
    { id: 'wissen', label: 'Wissen & Lehrplan', icon: '📖' },
  ];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex flex-col font-sans">
      {/* ── STICKY TOP HEADER ── */}
      <header className="bg-gradient-to-r from-forest-800 to-forest-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Zurück zur Startseite"
            >
              <IconHome c="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Startseite</span>
            </a>
            <div className="border-l border-white/20 pl-3">
              <h1 className="text-sm md:text-base font-bold leading-tight">
                Regulation des Blutzuckerspiegels
              </h1>
              <p className="text-[11px] text-green-200">
                Gymnasium Bayern · 8. Klasse (LehrplanPLUS B8 2)
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle Button */}
          <button
            data-dark-toggle
            onClick={() => setDarkMode(prev => !prev)}
            aria-label={darkMode ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
            title={darkMode ? 'Helles Design' : 'Dunkles Design'}
            className="p-2 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center text-lg active:scale-95 cursor-pointer"
          >
            <span className="dark-mode-icon">{darkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-2 pb-2">
          <nav className="flex bg-black/20 rounded-xl p-1 overflow-x-auto no-scrollbar gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === t.id
                    ? 'bg-white text-forest-800 shadow-sm'
                    : 'text-green-100 hover:bg-white/10'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-3 md:px-4 py-4">
        {activeTab === 'simulation' && <SimulationView termMode={termMode} />}
        {activeTab === 'regelkreis' && <RegelkreisView termMode={termMode} setTermMode={setTermMode} />}
        {activeTab === 'zellulaer' && <ZellulaerView />}
        {activeTab === 'diabetes' && <DiabetesView />}
        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'wissen' && <WissenView />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="text-center py-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
        <p>Blutzucker-Regulation · Biologie 8. Klasse · Johannes-Scharrer-Gymnasium</p>
      </footer>
    </div>
  );
};

export default App;
