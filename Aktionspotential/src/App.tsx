import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TabType,
  PhaseInfo,
  AP_PHASES,
  ION_CONCENTRATIONS,
  GLOSSARY_ENTRIES,
  CODING_PRESETS,
  GlossaryEntry,
  CodingPreset
} from './data';

// ─── SVG ICONS ─────────────────────────────────────────────────────────────────
const IconHome = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconZap = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconClock = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconActivity = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);
const IconBook = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
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
const IconStep = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
);
const IconSearch = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconInfo = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);
const IconAlert = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const IconArrowRight = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconEye = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSIOLOGISCHE MATHEMATIK FÜR EINZELNES AKTIONS POTENTIAL
// ═══════════════════════════════════════════════════════════════════════════════
function calculateVoltage(t: number, stimulusCurrent: number): {
  vm: number;
  phaseIndex: number;
  naGate1Open: number; // 0..1
  naGate2Open: number; // 0..1 (1=open, 0=inactivated)
  kGateOpen: number;   // 0..1
  stimulusActive: boolean;
} {
  const rest = -70;
  const threshold = -50;
  const thresholdCurrent = 9.5; // nA
  const stimStart = 0.5;
  const stimEnd = 0.7;
  const stimulusActive = t >= stimStart && t <= stimEnd;

  if (t < stimStart) {
    return { vm: rest, phaseIndex: 0, naGate1Open: 0, naGate2Open: 1, kGateOpen: 0, stimulusActive: false };
  }

  // Fall 1: Unterschwellige Reizung
  if (stimulusCurrent < thresholdCurrent) {
    const maxDepol = (stimulusCurrent / thresholdCurrent) * 12; // z.B. bis -58 mV
    if (t <= stimEnd) {
      const progress = (t - stimStart) / (stimEnd - stimStart);
      const vm = rest + maxDepol * progress;
      return { vm, phaseIndex: 1, naGate1Open: 0.1 * progress, naGate2Open: 1, kGateOpen: 0, stimulusActive: true };
    } else {
      const decay = Math.exp(-(t - stimEnd) / 0.4);
      const vm = rest + maxDepol * decay;
      return { vm, phaseIndex: 0, naGate1Open: 0, naGate2Open: 1, kGateOpen: 0, stimulusActive: false };
    }
  }

  // Fall 2: Überschwellige Reizung -> Volles AP
  const tau = t - stimStart;
  let vm = rest;
  let phaseIndex = 1;
  let na1 = 0;
  let na2 = 1;
  let k = 0;

  if (tau < 0.2) {
    // Reizungsanstieg zur Schwelle (-70 bis -50)
    const p = tau / 0.2;
    vm = rest + 20 * p;
    phaseIndex = 1;
    na1 = 0.2 * p;
    na2 = 1;
    k = 0;
  } else if (tau < 0.6) {
    // Depolarisation & Aufstrich (-50 bis +30)
    const p = (tau - 0.2) / 0.4;
    // Sigmoidale Kurve
    const s = Math.sin((p * Math.PI) / 2);
    vm = -50 + 80 * s;
    phaseIndex = 2;
    na1 = Math.min(1, 0.2 + 0.8 * s);
    na2 = Math.max(0.2, 1 - 0.7 * Math.pow(p, 2)); // beginnt zu schließen
    k = 0.1 * p;
  } else if (tau < 1.3) {
    // Repolarisation (+30 bis -70)
    const p = (tau - 0.6) / 0.7;
    const s = (1 + Math.cos(p * Math.PI)) / 2;
    vm = -70 + 100 * s;
    phaseIndex = 3;
    na1 = 0.8 * s;
    na2 = 0; // Tor 2 ist voll inaktiviert!
    k = Math.min(1, 0.4 + 0.6 * Math.sin(p * Math.PI * 0.8));
  } else if (tau < 2.4) {
    // Hyperpolarisation (-70 bis -80 bis -70)
    const p = (tau - 1.3) / 1.1;
    const hyperPeak = -80;
    // Schwingt auf -80 und erholt sich
    const shape = Math.sin(p * Math.PI);
    vm = -70 - 10 * shape;
    phaseIndex = 4;
    na1 = 0;
    // Tor 2 öffnet sich wieder (Erholung aus Inaktivierung)
    na2 = Math.min(1, p);
    k = Math.max(0, 0.7 * (1 - p));
  } else {
    // Regeneriertes Ruhepotential (-70)
    vm = rest;
    phaseIndex = 5;
    na1 = 0;
    na2 = 1;
    k = 0;
  }

  return {
    vm: Math.round(vm * 10) / 10,
    phaseIndex,
    naGate1Open: Math.max(0, Math.min(1, na1)),
    naGate2Open: Math.max(0, Math.min(1, na2)),
    kGateOpen: Math.max(0, Math.min(1, k)),
    stimulusActive
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HAUPTKOMPONENTE
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
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

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setDarkMode(e.detail?.isDark ?? document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('bioApps_theme_change', handleThemeChange);
    return () => window.removeEventListener('bioApps_theme_change', handleThemeChange);
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>('simulation');

  return (
    <div className="min-h-screen bg-forest-50 text-gray-900 flex flex-col font-sans">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className="bg-forest-900 text-white shadow-md border-b border-forest-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Linke Seite: Zurück-Button + Titel */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a
                href="../index.html"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-forest-800 text-forest-200 hover:text-white hover:bg-forest-700 border border-forest-700 transition-colors shadow-2xs"
                title="Zurück zur BioApps-Übersicht"
              >
                <IconHome c="w-5 h-5" />
              </a>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-forest-800 text-forest-200 border border-forest-700">
                    Biologie 13 · Oberstufe
                  </span>
                  <span className="hidden sm:inline text-xs text-forest-400">|</span>
                  <span className="hidden sm:inline text-xs font-medium text-forest-300">
                    Neurobiologie
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Aktionspotential & Erregungsleitung
                </h1>
              </div>
            </div>

            {/* Rechte Seite: Dark Mode Toggle Button */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                data-dark-toggle
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof (window as any).toggleDarkMode === 'function') {
                    (window as any).toggleDarkMode();
                  } else {
                    setDarkMode(prev => !prev);
                  }
                }}
                aria-pressed={darkMode}
                aria-label={darkMode ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
                title={darkMode ? 'Helles Design' : 'Dunkles Design'}
                className="p-2 rounded-xl text-forest-200 hover:text-white hover:bg-forest-800 transition-colors flex items-center justify-center text-lg active:scale-95 cursor-pointer"
              >
                <span className="dark-mode-icon">{darkMode ? '☀️' : '🌙'}</span>
              </button>
            </div>
          </div>

          {/* ── TAB NAVIGATION ─────────────────────────────────────────────────── */}
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 border-t border-forest-800/80 no-scrollbar">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-forest-200 hover:text-white hover:bg-forest-800'
              }`}
            >
              <IconZap c="w-4 h-4" />
              <span>1. Aktionspotential & Ionenkanäle</span>
            </button>

            <button
              onClick={() => setActiveTab('refraktaer')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeTab === 'refraktaer'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-forest-200 hover:text-white hover:bg-forest-800'
              }`}
            >
              <IconClock c="w-4 h-4" />
              <span>2. Refraktärphasen-Labor</span>
            </button>

            <button
              onClick={() => setActiveTab('codierung')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeTab === 'codierung'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-forest-200 hover:text-white hover:bg-forest-800'
              }`}
            >
              <IconActivity c="w-4 h-4" />
              <span>3. Signalcodierung & Frequenz</span>
            </button>

            <button
              onClick={() => setActiveTab('glossar')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeTab === 'glossar'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-forest-200 hover:text-white hover:bg-forest-800'
              }`}
            >
              <IconBook c="w-4 h-4" />
              <span>4. Glossar & Fachbegriffe</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ── CONTENT BEREICH ──────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulation' && <SimulationTab />}
        {activeTab === 'refraktaer' && <RefractoryTab />}
        {activeTab === 'codierung' && <CodingTab />}
        {activeTab === 'glossar' && <GlossaryTab />}
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-6 border-t border-forest-200 bg-white/50 text-center text-xs text-forest-700">
        <p>Biologie 13 · Johannes-Scharrer-Gymnasium · Themen 1.4 Ruhepotential, 1.5 Aktionspotential & 1.6 Refraktärphase</p>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: INTERAKTIVE SIMULATION (AKTIONSPOTENTIAL & IONENKANÄLE)
// ═══════════════════════════════════════════════════════════════════════════════
function SimulationTab() {
  const [time, setTime] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0.25); // 0.1, 0.25, 1.0
  const [stimulusCurrent, setStimulusCurrent] = useState<number>(15); // nA (Schwelle bei 9.5)
  const [showVectors, setShowVectors] = useState<boolean>(true);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (now: number) => {
      if (lastTimeRef.current !== null) {
        const deltaMs = (now - lastTimeRef.current) / 1000;
        // speed: 1.0 = 4 ms in 4 seconds = 1 ms per sec
        const simDelta = deltaMs * (speed * 1.2);
        setTime((prev) => {
          const next = prev + simDelta;
          if (next >= 4.0) {
            setIsPlaying(false);
            return 4.0;
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  const currentValues = useMemo(() => calculateVoltage(time, stimulusCurrent), [time, stimulusCurrent]);
  const activePhase = AP_PHASES[currentValues.phaseIndex];

  const handleTrigger = () => {
    setTime(0.0);
    setIsPlaying(true);
  };

  const handleStep = (forward: boolean) => {
    setIsPlaying(false);
    setTime((prev) => Math.max(0, Math.min(4.0, prev + (forward ? 0.08 : -0.08))));
  };

  const jumpToPhaseTime = (t: number) => {
    setIsPlaying(false);
    setTime(t);
  };

  return (
    <div className="space-y-6">
      {/* ── KONTROLLLEISTE & REIZ-GENERATOR ────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-forest-100 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Reizstrom-Steuerung */}
          <div className="lg:col-span-5 bg-forest-50/70 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                Reizelektrode: Stromstärke
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                stimulusCurrent >= 9.5
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {stimulusCurrent} nA ({stimulusCurrent >= 9.5 ? 'Überschwellig' : 'Unterschwellig'})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={stimulusCurrent}
              onChange={(e) => setStimulusCurrent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forest-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>0 nA (kein Reiz)</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">⚡ Schwelle: ~10 nA (-50 mV)</span>
              <span>25 nA (stark)</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="lg:col-span-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleTrigger}
              className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <IconZap c="w-4 h-4" />
              Reiz zünden
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title={isPlaying ? "Pause" : "Abspielen"}
            >
              {isPlaying ? <IconPause c="w-5 h-5" /> : <IconPlay c="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleStep(true)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="Einzelschritt vorwärts (+0.08 ms)"
            >
              <IconStep c="w-5 h-5" />
            </button>

            <button
              onClick={() => { setIsPlaying(false); setTime(0.0); }}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="Zurücksetzen"
            >
              <IconRefresh c="w-5 h-5" />
            </button>
          </div>

          {/* Geschwindigkeit & Vektoren-Toggle */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col justify-end gap-2 text-xs">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-slate-500 font-medium">Tempo:</span>
              {[0.1, 0.25, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded font-semibold text-[11px] cursor-pointer ${
                    speed === s
                      ? 'bg-forest-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowVectors(!showVectors)}
              className={`px-2.5 py-1 rounded font-medium flex items-center justify-center gap-1.5 border cursor-pointer ${
                showVectors
                  ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-300 dark:border-forest-700 text-forest-700 dark:text-forest-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-500'
              }`}
            >
              <IconEye c="w-3.5 h-3.5" />
              <span>Kräfte-Vektoren {showVectors ? 'an' : 'aus'}</span>
            </button>
          </div>
        </div>

        {/* Zeit-Slider (Scrubber) */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-mono font-bold text-forest-700 dark:text-forest-400">
              Zeit: {time.toFixed(2)} ms / 4.00 ms
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              Spannung: <span className={currentValues.vm > 0 ? 'text-red-500 font-extrabold' : ''}>{currentValues.vm} mV</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="4"
            step="0.02"
            value={time}
            onChange={(e) => {
              setIsPlaying(false);
              setTime(Number(e.target.value));
            }}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forest-600"
          />

          {/* Phasen-Sprungmarken */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2">
            {[
              { label: '1. Ruhe (-70 mV)', t: 0.2 },
              { label: '2. Schwelle (-50 mV)', t: 0.68 },
              { label: '3. Peak (+30 mV)', t: 1.1 },
              { label: '4. Repolarisation', t: 1.6 },
              { label: '5. Hyperpolarisation', t: 2.4 },
              { label: '6. Erholt (-70 mV)', t: 3.5 }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => jumpToPhaseTime(p.t)}
                className={`text-[10px] sm:text-xs py-1 px-1.5 rounded truncate font-medium border text-center transition-all cursor-pointer ${
                  currentValues.phaseIndex === idx
                    ? 'bg-forest-100 dark:bg-forest-900 border-forest-500 text-forest-800 dark:text-forest-200 font-bold shadow-2xs'
                    : 'bg-forest-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DUAL VIEW: OSZILLOSKOP & MEMBRANSCHNITT ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Linke Spalte: Live-Oszilloskop */}
        <div className="lg:col-span-6 bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-500"></span>
                Digitales Live-Oszilloskop
              </h2>
              <p className="text-xs text-slate-500">
                Membranpotential U<sub>m</sub> in mV über die Zeit t in ms
              </p>
            </div>
            <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300">
              U<sub>m</sub> = {currentValues.vm} mV
            </span>
          </div>

          <div className="flex-1 w-full bg-slate-950 rounded-lg p-2.5 relative overflow-hidden border border-slate-800">
            <OscilloscopeSVG currentTime={time} stimulusCurrent={stimulusCurrent} currentVm={currentValues.vm} />
          </div>

          {/* Oszilloskop-Legende */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400"></span>
              <span>Ruhe (-70 mV)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border-b border-dashed"></span>
              <span>Schwelle (-50 mV)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-400"></span>
              <span>Peak (+30 mV)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-400"></span>
              <span>Hyperpol. (-80 mV)</span>
            </div>
          </div>
        </div>

        {/* Rechte Spalte: Animierter Membranschnitt */}
        <div className="lg:col-span-6 bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Biomembran & Ionenkanäle
              </h2>
              <p className="text-xs text-slate-500">
                Molekulare Tor-Zustände (Tor 1 & Tor 2) und Ionenströme
              </p>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${activePhase.badgeClass}`}>
              {activePhase.shortName}
            </span>
          </div>

          {/* Membran-SVG-Canvas */}
          <div className="flex-1 w-full bg-gradient-to-b from-sky-50 via-slate-100 to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-lg p-2 relative overflow-hidden border border-slate-200 min-h-[300px]">
            <MembraneSVG
              values={currentValues}
              phase={activePhase}
              showVectors={showVectors}
            />
          </div>

          {/* Statusübersicht der Kanäle */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs text-center">
            <div className="bg-forest-50/70 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">K⁺-Leckkanal</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Immer offen</span>
            </div>
            <div className="bg-forest-50/70 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Na⁺-Kanal (Tor 1 / Tor 2)</span>
              <span className={`font-bold ${
                activePhase.naOverall === 'geöffnet'
                  ? 'text-red-600 dark:text-red-400 animate-pulse'
                  : activePhase.naOverall === 'inaktiviert'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600'
              }`}>
                {activePhase.naOverall}
              </span>
            </div>
            <div className="bg-forest-50/70 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block">K⁺-Kanal (Spannung)</span>
              <span className={`font-bold ${
                currentValues.kGateOpen > 0.3
                  ? 'text-blue-600 dark:text-blue-400 animate-pulse'
                  : 'text-slate-600'
              }`}>
                {currentValues.kGateOpen > 0.5 ? 'Offen' : currentValues.kGateOpen > 0 ? 'Schließt träge' : 'Geschlossen'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ERKLÄRUNGSBOX ZUR AKTUELLEN PHASE ──────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5 border border-forest-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-bold border ${activePhase.badgeClass}`}>
              {activePhase.name}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Intervall: {activePhase.timeRange} | U<sub>m</sub>: {activePhase.voltage}
            </span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">
            {activePhase.schulbuchRef}
          </span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          {activePhase.description}
        </p>

        <div className="bg-forest-50/70 p-3 rounded-lg border border-slate-200 text-xs flex items-start gap-2">
          <IconInfo c="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200">Ionenfluss auf Teilchenebene: </strong>
            <span className="text-slate-600">{activePhase.ionFlow}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OSZILLOSKOP SVG KOMPONENTE
// ─────────────────────────────────────────────────────────────────────────────
function OscilloscopeSVG({
  currentTime,
  stimulusCurrent,
  currentVm
}: {
  currentTime: number;
  stimulusCurrent: number;
  currentVm: number;
}) {
  const width = 500;
  const height = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Skalierung: X = 0 bis 4 ms, Y = -90 mV bis +40 mV (Spanne = 130 mV)
  const getX = (t: number) => paddingLeft + (t / 4.0) * plotWidth;
  const getY = (v: number) => paddingTop + ((40 - v) / 130) * plotHeight;

  // Berechne Punkte für den gesamten Pfad bis t=4.0
  const points: { x: number; y: number }[] = [];
  for (let t = 0; t <= 4.001; t += 0.04) {
    const val = calculateVoltage(t, stimulusCurrent);
    points.push({ x: getX(t), y: getY(val.vm) });
  }

  const fullPathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  // Berechne aktiven Pfad bis currentTime
  const activePoints = points.filter((p) => p.x <= getX(currentTime) + 1);
  const activePathD = activePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  const curX = getX(currentTime);
  const curY = getY(currentVm);

  // Y-Achsen-Werte
  const yTicks = [40, 20, 0, -20, -40, -50, -70, -80];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-mono select-none">
      {/* Gitterlinien */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={paddingLeft}
            y1={getY(v)}
            x2={width - paddingRight}
            y2={getY(v)}
            stroke={v === -70 ? '#10b981' : v === -50 ? '#f59e0b' : v === 0 ? '#475569' : '#1e293b'}
            strokeWidth={v === -70 || v === -50 ? 1.5 : 1}
            strokeDasharray={v === -50 ? '4 3' : 'none'}
            opacity={v === -70 || v === -50 ? 0.7 : 0.35}
          />
          <text
            x={paddingLeft - 6}
            y={getY(v) + 3}
            fill={v === -70 ? '#34d399' : v === -50 ? '#fbbf24' : '#64748b'}
            fontSize="9"
            textAnchor="end"
            fontWeight={v === -70 || v === -50 ? 'bold' : 'normal'}
          >
            {v > 0 ? `+${v}` : v}
          </text>
        </g>
      ))}

      {/* X-Achsen-Ticks (Zeit 0, 1, 2, 3, 4 ms) */}
      {[0, 1, 2, 3, 4].map((t) => (
        <g key={t}>
          <line
            x1={getX(t)}
            y1={paddingTop}
            x2={getX(t)}
            y2={height - paddingBottom}
            stroke="#1e293b"
            strokeWidth="1"
            opacity="0.4"
          />
          <text
            x={getX(t)}
            y={height - paddingBottom + 14}
            fill="#64748b"
            fontSize="9"
            textAnchor="middle"
          >
            {t} ms
          </text>
        </g>
      ))}

      {/* Achsenbeschriftung */}
      <text x={paddingLeft + 5} y={paddingTop + 10} fill="#94a3b8" fontSize="9" fontWeight="bold">
        mV
      </text>
      <text x={width - paddingRight} y={height - paddingBottom + 14} fill="#94a3b8" fontSize="9" textAnchor="end">
        Zeit (ms)
      </text>

      {/* Reizstrom-Spur im Hintergrund (unten) */}
      <rect
        x={getX(0.5)}
        y={height - paddingBottom - 18}
        width={getX(0.7) - getX(0.5)}
        height={14}
        fill="#f59e0b"
        opacity="0.35"
        rx="2"
      />
      <text
        x={(getX(0.5) + getX(0.7)) / 2}
        y={height - paddingBottom - 8}
        fill="#fbbf24"
        fontSize="7.5"
        textAnchor="middle"
        fontWeight="bold"
      >
        Reiz
      </text>

      {/* Gesamtkurve als dünne Geisterlinie */}
      <path d={fullPathD} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

      {/* Aktive Kurve bis currentTime */}
      <path
        d={activePathD}
        fill="none"
        stroke={currentVm > 0 ? '#ef4444' : '#22c55e'}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Zeit-Cursor (vertikale Linie) */}
      <line
        x1={curX}
        y1={paddingTop}
        x2={curX}
        y2={height - paddingBottom}
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        opacity="0.8"
      />

      {/* Aktueller Punkt */}
      <circle cx={curX} cy={curY} r="6" fill="#38bdf8" className="animate-ping" opacity="0.4" />
      <circle cx={curX} cy={curY} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

      {/* Wert-Badge am Cursor */}
      <g transform={`translate(${Math.min(width - 70, Math.max(paddingLeft + 35, curX))}, ${Math.max(paddingTop + 15, curY - 12)})`}>
        <rect x="-30" y="-12" width="60" height="15" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <text x="0" y="-1" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">
          {currentVm} mV
        </text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBRANSCHNITT SVG KOMPONENTE
// ─────────────────────────────────────────────────────────────────────────────
function MembraneSVG({
  values,
  phase,
  showVectors
}: {
  values: { vm: number; naGate1Open: number; naGate2Open: number; kGateOpen: number };
  phase: PhaseInfo;
  showVectors: boolean;
}) {
  const isInverted = values.vm > 0;
  const isDepol = values.vm > -50 && values.vm <= 0;

  return (
    <svg viewBox="0 0 600 320" className="w-full h-full select-none font-sans">
      {/* ── HINTERGRUND-ZONEN ────────────────────────────────────────────── */}
      {/* Extrazellulärraum (oben) */}
      <rect x="0" y="0" width="600" height="110" fill="url(#gradExtra)" />
      {/* Biomembran (Mitte) */}
      <rect x="0" y="110" width="600" height="70" fill="#334155" opacity="0.15" />
      {/* Intrazellulärraum (unten) */}
      <rect x="0" y="180" width="600" height="140" fill="url(#gradIntra)" />

      <defs>
        <linearGradient id="gradExtra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="gradIntra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.09" />
        </linearGradient>
        <marker id="arrowChem" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <marker id="arrowElec" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Zonenbeschriftungen */}
      <text x="15" y="24" fill="#0284c7" fontSize="11" fontWeight="bold" letterSpacing="0.05em">
        EXTRAZELLULÄRRAUM [Na⁺ hoch, Cl⁻ hoch, K⁺ niedrig]
      </text>
      <text x="15" y="304" fill="#d97706" fontSize="11" fontWeight="bold" letterSpacing="0.05em">
        ZELLINNENRAUM (AXOPLASMA) [K⁺ hoch, A⁻ hoch, Na⁺ niedrig]
      </text>

      {/* ── MEMBRAN-LIPID DOPPELSCHICHT ─────────────────────────────────── */}
      {/* Obere Schicht Phospholipidköpfchen */}
      {Array.from({ length: 30 }).map((_, i) => (
        <g key={`top-${i}`} transform={`translate(${i * 20 + 10}, 110)`}>
          <circle cx="0" cy="0" r="5.5" fill="#64748b" opacity="0.85" />
          <line x1="-1.5" y1="5" x2="-1.5" y2="18" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="1.5" y1="5" x2="1.5" y2="18" stroke="#94a3b8" strokeWidth="1.5" />
        </g>
      ))}
      {/* Untere Schicht Phospholipidköpfchen */}
      {Array.from({ length: 30 }).map((_, i) => (
        <g key={`bot-${i}`} transform={`translate(${i * 20 + 10}, 180)`}>
          <circle cx="0" cy="0" r="5.5" fill="#64748b" opacity="0.85" />
          <line x1="-1.5" y1="-5" x2="-1.5" y2="-18" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="1.5" y1="-5" x2="1.5" y2="-18" stroke="#94a3b8" strokeWidth="1.5" />
        </g>
      ))}

      {/* ── MEMBRANLADUNGEN (POLARITÄT) ─────────────────────────────────── */}
      {/* Außen-Ladungen */}
      {Array.from({ length: 15 }).map((_, i) => (
        <text
          key={`charge-ext-${i}`}
          x={i * 40 + 15}
          y="98"
          fill={isInverted ? '#ef4444' : '#10b981'}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          {isInverted ? '−' : '+'}
        </text>
      ))}
      {/* Innen-Ladungen */}
      {Array.from({ length: 15 }).map((_, i) => (
        <text
          key={`charge-int-${i}`}
          x={i * 40 + 15}
          y="198"
          fill={isInverted ? '#10b981' : '#ef4444'}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          {isInverted ? '+' : '−'}
        </text>
      ))}

      {/* ── KANAL 1: K⁺-LECKKANAL (IMMER OFFEN) ────────────────────────── */}
      <g transform="translate(70, 95)">
        {/* Kanalwände */}
        <path d="M 0 0 L 12 15 L 12 75 L 0 90 Z" fill="#8b5cf6" />
        <path d="M 40 0 L 28 15 L 28 75 L 40 90 Z" fill="#8b5cf6" />
        <rect x="12" y="15" width="16" height="60" fill="#a78bfa" opacity="0.3" />
        {/* Beschriftung */}
        <text x="20" y="-8" fill="#8b5cf6" fontSize="9" fontWeight="bold" textAnchor="middle">
          K⁺-Leckkanal
        </text>
        <text x="20" y="103" fill="#8b5cf6" fontSize="8" textAnchor="middle">
          immer offen
        </text>
        {/* K⁺-Strom (diffundiert langsam raus) */}
        <circle cx="20" cy="55" r="4" fill="#8b5cf6" />
        <text x="20" y="58" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">K⁺</text>
        <path d="M 20 70 L 20 20" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowChem)" />
      </g>

      {/* ── KANAL 2: SPANNUNGSGESTEUERTER Na⁺-KANAL (MIT 2 TOREN!) ───────── */}
      <g transform="translate(220, 95)">
        {/* Kanalwände */}
        <path d="M 0 0 L 16 15 L 16 75 L 0 90 Z" fill="#ef4444" />
        <path d="M 60 0 L 44 15 L 44 75 L 60 90 Z" fill="#ef4444" />
        <rect x="16" y="15" width="28" height="60" fill="#fca5a5" opacity="0.25" />

        <text x="30" y="-18" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
          Spannungsgesteuerter Na⁺-Kanal
        </text>
        <text x="30" y="-7" fill="#dc2626" fontSize="8" fontWeight="bold" textAnchor="middle">
          Tor 1 (Spannung) + Tor 2 (Zeit/Kugel)
        </text>

        {/* TOR 1: Spannungsaktivierungstor (oben/Mitte) */}
        {values.naGate1Open > 0.4 ? (
          // Tor 1 offen
          <g>
            <line x1="16" y1="28" x2="20" y2="18" stroke="#b91c1c" strokeWidth="3" />
            <line x1="44" y1="28" x2="40" y2="18" stroke="#b91c1c" strokeWidth="3" />
            <text x="30" y="24" fill="#15803d" fontSize="7" fontWeight="bold" textAnchor="middle">Tor 1 OFFEN</text>
          </g>
        ) : (
          // Tor 1 geschlossen
          <g>
            <line x1="16" y1="26" x2="44" y2="26" stroke="#b91c1c" strokeWidth="3.5" />
            <text x="30" y="22" fill="#b91c1c" fontSize="7" fontWeight="bold" textAnchor="middle">Tor 1 ZU</text>
          </g>
        )}

        {/* TOR 2: Zeitgesteuertes Inaktivierungstor ("Ball-and-Chain") */}
        {values.naGate2Open < 0.3 ? (
          // Tor 2 inaktiviert: Kugel steckt in der Pore!
          <g className="animate-pulse">
            {/* Peptidkette */}
            <path d="M 12 78 Q 20 85 30 75" fill="none" stroke="#b91c1c" strokeWidth="2" />
            {/* Inaktivierungskugel blockiert die Pore */}
            <circle cx="30" cy="73" r="8.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
            <text x="30" y="76" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">INAKT</text>
            <text x="30" y="103" fill="#dc2626" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              Tor 2: Inaktiviert!
            </text>
          </g>
        ) : (
          // Tor 2 offen: Kugel hängt frei im Zytoplasma
          <g>
            <path d="M 12 78 Q 8 95 18 102" fill="none" stroke="#b91c1c" strokeWidth="2" />
            <circle cx="18" cy="102" r="7.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
            <text x="42" y="103" fill="#15803d" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              Tor 2: Offen
            </text>
          </g>
        )}

        {/* Na⁺-Einstrom, wenn beide Tore offen sind */}
        {values.naGate1Open > 0.4 && values.naGate2Open >= 0.3 && (
          <g>
            <circle cx="30" cy="40" r="4.5" fill="#ef4444" className="animate-bounce" />
            <text x="30" y="43" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">Na⁺</text>
            <path d="M 30 10 L 30 70" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#arrowChem)" />
          </g>
        )}
      </g>

      {/* ── KANAL 3: SPANNUNGSGESTEUERTER K⁺-KANAL ───────────────────────── */}
      <g transform="translate(390, 95)">
        <path d="M 0 0 L 14 15 L 14 75 L 0 90 Z" fill="#3b82f6" />
        <path d="M 50 0 L 36 15 L 36 75 L 50 90 Z" fill="#3b82f6" />
        <rect x="14" y="15" width="22" height="60" fill="#93c5fd" opacity="0.25" />

        <text x="25" y="-18" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">
          Spannungsgesteuerter K⁺-Kanal
        </text>
        <text x="25" y="-7" fill="#2563eb" fontSize="8" textAnchor="middle">
          verzögert öffnend / träge schließend
        </text>

        {values.kGateOpen > 0.4 ? (
          <g>
            <line x1="14" y1="45" x2="18" y2="35" stroke="#1d4ed8" strokeWidth="3" />
            <line x1="36" y1="45" x2="32" y2="35" stroke="#1d4ed8" strokeWidth="3" />
            <circle cx="25" cy="50" r="4.5" fill="#8b5cf6" />
            <text x="25" y="53" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">K⁺</text>
            {/* Ausstrom nach oben */}
            <path d="M 25 70 L 25 15" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#arrowChem)" />
            <text x="25" y="103" fill="#15803d" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              OFFEN (K⁺-Ausstrom)
            </text>
          </g>
        ) : (
          <g>
            <line x1="14" y1="45" x2="36" y2="45" stroke="#1d4ed8" strokeWidth="3.5" />
            <text x="25" y="103" fill="#1d4ed8" fontSize="7.5" textAnchor="middle">
              Geschlossen
            </text>
          </g>
        )}
      </g>

      {/* ── KANAL 4: Na⁺/K⁺-PUMPE (ATPASE) ──────────────────────────────── */}
      <g transform="translate(515, 100)">
        <path d="M 0 10 C 10 -5, 30 -5, 40 10 L 40 70 C 30 85, 10 85, 0 70 Z" fill="#10b981" opacity="0.9" />
        <text x="20" y="-8" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
          Na⁺/K⁺-Pumpe
        </text>
        <text x="20" y="32" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
          3 Na⁺ ⬆
        </text>
        <text x="20" y="46" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
          2 K⁺ ⬇
        </text>
        <text x="20" y="60" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          ATP ➔ ADP
        </text>
      </g>

      {/* ── KRÄFTE-VEKTOREN (CHEMISCH & ELEKTROSTATISCH) ────────────────── */}
      {showVectors && (
        <g transform="translate(20, 215)">
          <rect x="0" y="0" width="160" height="70" rx="6" fill="#0f172a" opacity="0.85" />
          <text x="10" y="16" fill="#f8fafc" fontSize="9" fontWeight="bold">
            Treibende Kräfte auf Na⁺:
          </text>
          {/* Chemische Kraft (immer nach innen) */}
          <line x1="15" y1="32" x2="65" y2="32" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrowChem)" />
          <text x="75" y="35" fill="#93c5fd" fontSize="8.5">
            Chemisch (Gradient ➔ innen)
          </text>
          {/* Elektrostatische Kraft (abhängig von Vm) */}
          <line
            x1="15"
            y1="52"
            x2={isInverted ? 40 : 65}
            y2="52"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray={isInverted ? '2 2' : 'none'}
            markerEnd="url(#arrowElec)"
          />
          <text x="75" y="55" fill="#fca5a5" fontSize="8.5">
            {isInverted ? 'Elektrisch (stößt ab)' : 'Elektrisch (zieht an)'}
          </text>
        </g>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: REFRAKTÄRPHASEN-LABOR (DOPPELREIZ-EXPERIMENT & EINBAHNSTRASSE)
// ═══════════════════════════════════════════════════════════════════════════════
function RefractoryTab() {
  const [deltaT, setDeltaT] = useState<number>(1.5); // Zeitabstand in ms (0.5 bis 6.0)
  const [stimulus2, setStimulus2] = useState<number>(18); // nA für 2. Reiz (5 bis 35)

  // Simulation der zwei Pulse:
  // Reiz 1 bei t = 0.5 ms (immer 18 nA -> volles AP)
  // Reiz 2 bei t = 0.5 + deltaT ms
  // Schwellenwert für Reiz 2:
  // t < 1.8 ms: ABSOLUT REFRAKTÄR (Schwelle = unendlich, AP = 0)
  // 1.8 <= t < 4.0 ms: RELATIV REFRAKTÄR (Schwelle sinkt von 32 nA auf 9.5 nA, Amplitude wächst von 40 mV auf 100 mV)
  // t >= 4.0 ms: NORMALE ERREGBARKEIT (Schwelle = 9.5 nA, volle Amplitude)

  const isAbsolute = deltaT < 1.8;
  const isRelative = deltaT >= 1.8 && deltaT < 3.8;
  const isNormal = deltaT >= 3.8;

  // Benötigter Schwellenstrom für 2. Reiz
  const thresholdNeeded = useMemo(() => {
    if (isAbsolute) return Infinity;
    if (isNormal) return 9.5;
    // Relative Refraktärzeit: sinkt exponentiell
    const p = (deltaT - 1.8) / 2.0;
    return 30 - 20.5 * Math.pow(p, 0.8);
  }, [deltaT, isAbsolute, isNormal]);

  const secondApTriggers = stimulus2 >= thresholdNeeded;

  // Amplitude des 2. APs (falls getriggert)
  const secondAmplitudeFactor = useMemo(() => {
    if (!secondApTriggers) return 0;
    if (isNormal) return 1.0;
    const p = (deltaT - 1.8) / 2.0;
    return 0.4 + 0.6 * p; // von 40% bis 100%
  }, [secondApTriggers, isNormal, deltaT]);

  return (
    <div className="space-y-6">
      {/* ── KONTROLLEN & PARAMETER ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5 border border-forest-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <IconClock c="w-5 h-5 text-forest-600" />
              Doppelreiz-Experiment (Schulbuch S. 34 M1 / B1)
            </h2>
            <p className="text-xs text-slate-500">
              Untersuche den Einfluss des zeitlichen Abstands (Δt) und der Reizstärke auf das zweite Aktionspotential
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${
              isAbsolute
                ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/80 dark:text-red-300'
                : isRelative
                ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300'
            }`}>
              {isAbsolute ? 'Absolute Refraktärphase' : isRelative ? 'Relative Refraktärphase' : 'Voll erregbar'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regler 1: Zeitabstand Delta t */}
          <div className="bg-forest-50/70 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Zeitabstand zweiter Reiz (Δt):
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-200">
                Δt = {deltaT.toFixed(2)} ms
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.5"
              step="0.1"
              value={deltaT}
              onChange={(e) => setDeltaT(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forest-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span className="text-red-600 font-semibold">0.5 ms (absolut refraktär)</span>
              <span className="text-amber-600 font-semibold">~2.5 ms (relativ)</span>
              <span className="text-emerald-600 font-semibold">&gt; 4.0 ms (normal)</span>
            </div>
          </div>

          {/* Regler 2: Stärke des 2. Reizes */}
          <div className="bg-forest-50/70 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Stromstärke 2. Reiz:
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                I₂ = {stimulus2} nA
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={stimulus2}
              onChange={(e) => setStimulus2(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>5 nA (unterschwellig)</span>
              <span className="font-medium text-slate-600">
                Nötig: {thresholdNeeded === Infinity ? '∞ (blockiert)' : `${thresholdNeeded.toFixed(1)} nA`}
              </span>
              <span>35 nA (sehr stark)</span>
            </div>
          </div>
        </div>

        {/* Schnellauswahl-Presets */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
          <span className="text-slate-500 self-center font-medium">Presets:</span>
          <button
            onClick={() => { setDeltaT(1.0); setStimulus2(35); }}
            className="px-2.5 py-1 rounded bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 cursor-pointer"
          >
            Fall 1: Absolut refraktär (Δt = 1.0 ms, I₂ = max)
          </button>
          <button
            onClick={() => { setDeltaT(2.5); setStimulus2(12); }}
            className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
          >
            Fall 2: Zu schwach in relativer Phase (I₂ = 12 nA)
          </button>
          <button
            onClick={() => { setDeltaT(2.5); setStimulus2(25); }}
            className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
          >
            Fall 3: Erfolgreich in relativer Phase (I₂ = 25 nA)
          </button>
          <button
            onClick={() => { setDeltaT(4.5); setStimulus2(15); }}
            className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
          >
            Fall 4: Voll erholt (Δt = 4.5 ms)
          </button>
        </div>
      </div>

      {/* ── GRAFIK: DOPPELREIZ OSZILLOSKOP-DIAGRAMM ──────────────────────────── */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-500"></span>
          Reaktionskurve der Axonmembran bei Doppelreiz
        </h3>

        <div className="w-full bg-slate-950 rounded-lg p-2.5 border border-slate-800 min-h-[300px]">
          <RefractoryGraphSVG
            deltaT={deltaT}
            stimulus2={stimulus2}
            isAbsolute={isAbsolute}
            isRelative={isRelative}
            secondApTriggers={secondApTriggers}
            secondAmplitudeFactor={secondAmplitudeFactor}
          />
        </div>
      </div>

      {/* ── DIDAKTISCHE VERTIEFUNG: WARUM EINBAHNSTRASSE? ─────────────────────── */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <IconArrowRight c="w-5 h-5 text-forest-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Didaktische Bedeutung: Die "Einbahnstraße" der Erregungsleitung (Unidirektionalität)
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          Warum laufen Aktionspotentiale im Körper immer nur in eine Richtung – vom Axonhügel in Richtung der Synapsen – und niemals zurück?
          Die Ursache liegt unmittelbar im molekularen Mechanismus der <strong>absoluten Refraktärphase</strong>:
        </p>

        {/* Interaktive Axon-Strecke */}
        <div className="bg-forest-50/70 p-4 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-red-100/80 dark:bg-red-950/60 border border-red-300 dark:border-red-800">
              <span className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase block mb-1">
                Bereich A (zurückliegend)
              </span>
              <span className="text-xs font-bold text-red-900 dark:text-red-200 block mb-1">
                Absolut Refraktär ⛔
              </span>
              <p className="text-[11px] text-red-700 dark:text-red-300 leading-normal">
                Na⁺-Kanäle sind durch Tor 2 inaktiviert. Lokale Ausgleichsströme können hier <strong>kein</strong> neues AP auslösen! Das Signal kann nicht zurück.
              </p>
            </div>

            <div className="p-3 rounded-md bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 animate-pulse">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase block mb-1">
                Bereich B (aktuell)
              </span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">
                Aktionspotential ⚡ (+30 mV)
              </span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-normal">
                Na⁺-Einstrom depolarisiert die Nachbarbezirke durch Ionenverschiebung (lokale Kreisströme) in beide Richtungen.
              </p>
            </div>

            <div className="p-3 rounded-md bg-blue-100/80 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800">
              <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase block mb-1">
                Bereich C (vorausliegend)
              </span>
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block mb-1">
                Ruhezustand / Erregbar ➔
              </span>
              <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-normal">
                Na⁺-Kanäle sind geschlossen und aktivierbar. Erreicht der Kreisstrom die Schwelle (-50 mV), zündet hier das nächste AP!
              </p>
            </div>
          </div>
          <div className="mt-3 text-center text-xs font-semibold text-forest-700 dark:text-forest-400">
            ➔ Resultierende Ausbreitungsrichtung: Ausschließlich vorwärts zur Synapse!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REFRAKTÄR-GRAPH SVG
// ─────────────────────────────────────────────────────────────────────────────
function RefractoryGraphSVG({
  deltaT,
  stimulus2,
  isAbsolute,
  isRelative,
  secondApTriggers,
  secondAmplitudeFactor
}: {
  deltaT: number;
  stimulus2: number;
  isAbsolute: boolean;
  isRelative: boolean;
  secondApTriggers: boolean;
  secondAmplitudeFactor: number;
}) {
  const width = 650;
  const height = 300;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // X: 0 bis 7 ms, Y: -90 mV bis +40 mV (Spanne 130)
  const getX = (t: number) => paddingLeft + (t / 7.0) * plotWidth;
  const getY = (v: number) => paddingTop + ((40 - v) / 130) * plotHeight;

  const t1 = 0.5;
  const t2 = 0.5 + deltaT;

  // Erzeuge Kurvenpunkte
  const points: { x: number; y: number }[] = [];
  for (let t = 0; t <= 7.001; t += 0.04) {
    let vm = -70;

    // AP 1 (bei t1 = 0.5)
    if (t >= t1 && t < t1 + 3.5) {
      const v1 = calculateVoltage(t, 18).vm;
      vm = v1;
    }

    // AP 2 (bei t2 = 0.5 + deltaT)
    if (t >= t2 && t < t2 + 3.5) {
      if (secondApTriggers) {
        const ap2Val = calculateVoltage(t - t2 + 0.5, 18);
        const depol = ap2Val.vm - (-70);
        const currentBase = vm;
        // Kombiniere
        vm = Math.max(currentBase, -70 + depol * secondAmplitudeFactor);
      } else {
        // Nur passive Auslenkung
        const tau = t - t2;
        if (tau >= 0 && tau <= 0.2) {
          const p = tau / 0.2;
          vm = Math.max(vm, -70 + (stimulus2 / 30) * 12 * p);
        } else if (tau > 0.2 && tau < 1.0) {
          const decay = Math.exp(-(tau - 0.2) / 0.3);
          vm = Math.max(vm, -70 + (stimulus2 / 30) * 12 * decay);
        }
      }
    }

    points.push({ x: getX(t), y: getY(vm) });
  }

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-mono select-none">
      {/* ── FARBIG HINTERLEGTE ZONEN NACH REIZ 1 ──────────────────────────── */}
      {/* Absolute Refraktärphase: t1 bis t1 + 1.8 */}
      <rect
        x={getX(t1)}
        y={paddingTop}
        width={getX(t1 + 1.8) - getX(t1)}
        height={plotHeight}
        fill="#ef4444"
        opacity="0.12"
      />
      <text x={(getX(t1) + getX(t1 + 1.8)) / 2} y={paddingTop + 14} fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
        Absolut refraktär
      </text>

      {/* Relative Refraktärphase: t1 + 1.8 bis t1 + 3.8 */}
      <rect
        x={getX(t1 + 1.8)}
        y={paddingTop}
        width={getX(t1 + 3.8) - getX(t1 + 1.8)}
        height={plotHeight}
        fill="#f59e0b"
        opacity="0.10"
      />
      <text x={(getX(t1 + 1.8) + getX(t1 + 3.8)) / 2} y={paddingTop + 14} fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
        Relativ refraktär
      </text>

      {/* Normale Erregbarkeit */}
      <rect
        x={getX(t1 + 3.8)}
        y={paddingTop}
        width={getX(7.0) - getX(t1 + 3.8)}
        height={plotHeight}
        fill="#10b981"
        opacity="0.06"
      />
      <text x={(getX(t1 + 3.8) + getX(7.0)) / 2} y={paddingTop + 14} fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
        Voll erregbar
      </text>

      {/* Gitterlinien */}
      {[30, 0, -50, -70, -80].map((v) => (
        <g key={v}>
          <line
            x1={paddingLeft}
            y1={getY(v)}
            x2={width - paddingRight}
            y2={getY(v)}
            stroke={v === -70 ? '#10b981' : v === -50 ? '#f59e0b' : '#334155'}
            strokeWidth="1"
            strokeDasharray={v === -50 ? '3 3' : 'none'}
            opacity="0.4"
          />
          <text x={paddingLeft - 6} y={getY(v) + 3} fill="#64748b" fontSize="9" textAnchor="end">
            {v > 0 ? `+${v}` : v}
          </text>
        </g>
      ))}

      {/* X-Achse */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((t) => (
        <text key={t} x={getX(t)} y={height - paddingBottom + 14} fill="#64748b" fontSize="9" textAnchor="middle">
          {t} ms
        </text>
      ))}

      {/* Reizstrom-Impuls 1 */}
      <g transform={`translate(${getX(t1)}, ${height - paddingBottom - 18})`}>
        <rect x="0" y="0" width={getX(t1 + 0.2) - getX(t1)} height="12" fill="#f59e0b" rx="2" />
        <text x="6" y="-3" fill="#fbbf24" fontSize="8" fontWeight="bold">Reiz 1</text>
      </g>

      {/* Reizstrom-Impuls 2 */}
      <g transform={`translate(${getX(t2)}, ${height - paddingBottom - 18})`}>
        <rect
          x="0"
          y="0"
          width={getX(t2 + 0.2) - getX(t2)}
          height={Math.min(18, Math.max(8, (stimulus2 / 35) * 18))}
          fill="#38bdf8"
          rx="2"
        />
        <text x="6" y="-3" fill="#38bdf8" fontSize="8" fontWeight="bold">
          Reiz 2 ({stimulus2} nA)
        </text>
      </g>

      {/* Verbindungslinie / Pfeil für Delta t */}
      <g transform={`translate(${getX(t1)}, ${height - paddingBottom + 26})`}>
        <line x1="0" y1="0" x2={getX(t2) - getX(t1)} y2="0" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
        <circle cx={getX(t2) - getX(t1)} cy="0" r="2.5" fill="#38bdf8" />
        <text x={(getX(t2) - getX(t1)) / 2} y="-3" fill="#38bdf8" fontSize="8.5" textAnchor="middle" fontWeight="bold">
          Δt = {deltaT.toFixed(1)} ms
        </text>
      </g>

      {/* Haupt-Potentialkurve */}
      <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Zweites AP Beschriftung oder Fehler-Kreuz */}
      {secondApTriggers ? (
        <g transform={`translate(${getX(t2 + 0.6)}, ${getY(-70 + 100 * secondAmplitudeFactor) - 8})`}>
          <text x="0" y="0" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
            2. AP ({Math.round(secondAmplitudeFactor * 100)} % Amplitude)
          </text>
        </g>
      ) : (
        <g transform={`translate(${getX(t2 + 0.3)}, ${getY(-65)})`}>
          <text x="0" y="0" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
            ❌ Kein 2. AP! ({isAbsolute ? 'Absolut refraktär' : 'Unterschwellig'})
          </text>
        </g>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: SIGNALCODIERUNG & FREQUENZMODULATION
// ═══════════════════════════════════════════════════════════════════════════════
function CodingTab() {
  const [stimulusPercent, setStimulusPercent] = useState<number>(65); // 0 bis 100 %
  const [durationMs, setDurationMs] = useState<number>(50); // 10 bis 70 ms

  const currentPreset = useMemo(() => {
    if (stimulusPercent < 25) return CODING_PRESETS[0];
    if (stimulusPercent < 50) return CODING_PRESETS[1];
    if (stimulusPercent < 80) return CODING_PRESETS[2];
    return CODING_PRESETS[3];
  }, [stimulusPercent]);

  // Frequenzberechnung:
  // Unter 25% = 0 Hz (unterschwellig)
  // 25% bis 100% = 20 Hz bis 320 Hz
  const currentFreqHz = useMemo(() => {
    if (stimulusPercent < 25) return 0;
    const p = (stimulusPercent - 25) / 75;
    return Math.round(20 + 300 * Math.pow(p, 0.75));
  }, [stimulusPercent]);

  // Periodendauer in ms zwischen zwei APs
  const intervalMs = currentFreqHz > 0 ? (1000 / currentFreqHz).toFixed(1) : '∞';

  return (
    <div className="space-y-6">
      {/* ── KONTROLLLEISTE REIZSTÄRKE & DAUER ─────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5 border border-forest-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <IconActivity c="w-5 h-5 text-forest-600" />
              Signalcodierung & Frequenzmodulation (Schulbuch S. 34 M3 / B3)
            </h2>
            <p className="text-xs text-slate-500">
              Wie kontinuierliche Reizstärken in diskrete Folgen uniformer Aktionspotentiale übersetzt werden
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-200">
            Frequenz: {currentFreqHz} Hz (Impulse/Sek.)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regler: Reizstärke */}
          <div className="bg-forest-50/70 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Reizstärke (Intensität):
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                {stimulusPercent} % {stimulusPercent < 25 ? '(unterschwellig)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={stimulusPercent}
              onChange={(e) => setStimulusPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Sanfte Berührung (5%)</span>
              <span className="font-semibold text-amber-600">Schwelle: 25%</span>
              <span>Starker Schmerz (100%)</span>
            </div>
          </div>

          {/* Regler: Reizdauer */}
          <div className="bg-forest-50/70 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Reizdauer:
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {durationMs} ms
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="5"
              value={durationMs}
              onChange={(e) => setDurationMs(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forest-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>15 ms (kurzer Reiz)</span>
              <span>45 ms</span>
              <span>70 ms (langanhaltend)</span>
            </div>
          </div>
        </div>

        {/* Biologische Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
          {CODING_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setStimulusPercent(p.stimulusPercent);
              }}
              className={`p-2 rounded text-left border transition-all cursor-pointer ${
                currentPreset.id === p.id
                  ? 'bg-forest-50 dark:bg-forest-950 border-forest-500 font-bold text-forest-800 dark:text-forest-200 shadow-2xs'
                  : 'bg-forest-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="block truncate font-semibold">{p.title}</span>
              <span className="text-[10px] text-slate-400 block truncate">{p.sensoryExample}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── GRAFIK: REIZ- UND AP-SALVE ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-500"></span>
            Oszilloskop-Spur der AP-Salve über 80 ms
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-500">Intervall: <strong className="text-forest-600">{intervalMs} ms</strong></span>
            <span className="text-slate-500">Amplitude: <strong className="text-red-500">~100 mV (konstant!)</strong></span>
          </div>
        </div>

        <div className="w-full bg-slate-950 rounded-lg p-2.5 border border-slate-800 min-h-[300px]">
          <CodingGraphSVG
            stimulusPercent={stimulusPercent}
            durationMs={durationMs}
            freqHz={currentFreqHz}
          />
        </div>
      </div>

      {/* ── DIDAKTISCHE ZUSAMMENFASSUNG ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs sm:text-sm">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-forest-700 dark:text-forest-400">
            <IconZap c="w-4 h-4" />
            1. Codierung der Reizstärke (Frequenz)
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Weil alle Aktionspotentiale nach dem Alles-oder-Nichts-Prinzip immer die gleiche Höhe (~100 mV) besitzen, kann das Gehirn die Reizstärke nicht an der Amplitude ablesen.
            Stattdessen gilt: <strong>Je stärker der Reiz, desto höher die Frequenz der Aktionspotentiale pro Zeiteinheit (Frequenzmodulation).</strong>
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs sm:text-sm">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <IconClock c="w-4 h-4" />
            2. Codierung der Reizdauer & Obergrenze
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Die <strong>Reizdauer</strong> wird schlicht über die zeitliche Länge der AP-Salve codiert: Solange der Reiz überschwellig anliegt, feuert das Neuron.
            Die <strong>maximale Impulsfrequenz</strong> (ca. 400–500 Hz) wird strikt durch die Dauer der <em>absoluten Refraktärphase</em> begrenzt!
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODIERUNGS-GRAPH SVG
// ─────────────────────────────────────────────────────────────────────────────
function CodingGraphSVG({
  stimulusPercent,
  durationMs,
  freqHz
}: {
  stimulusPercent: number;
  durationMs: number;
  freqHz: number;
}) {
  const width = 700;
  const height = 300;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const totalTime = 80; // ms
  const getX = (t: number) => paddingLeft + (t / totalTime) * plotWidth;
  const getY = (v: number) => paddingTop + ((40 - v) / 130) * plotHeight;

  const stimStart = 5.0; // ms
  const stimEnd = stimStart + durationMs;

  // Berechne die Zeiten der Aktionspotentiale während des Reizes
  const apTimes: number[] = [];
  if (freqHz > 0 && stimulusPercent >= 25) {
    const periodMs = 1000 / freqHz;
    let t = stimStart + 0.5;
    while (t < stimEnd) {
      apTimes.push(t);
      t += periodMs;
    }
  }

  // Erzeuge Kurvenpunkte
  const points: { x: number; y: number }[] = [];
  for (let t = 0; t <= totalTime; t += 0.25) {
    let vm = -70;

    // Prüfe, ob zu diesem Zeitpunkt ein AP feuert
    for (const apT of apTimes) {
      if (t >= apT && t < apT + 2.5) {
        const val = calculateVoltage(t - apT + 0.5, 20);
        vm = Math.max(vm, val.vm);
      }
    }

    // Unterschwelliger Reiz
    if (apTimes.length === 0 && t >= stimStart && t <= stimEnd) {
      vm = -70 + (stimulusPercent / 25) * 10;
    }

    points.push({ x: getX(t), y: getY(vm) });
  }

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-mono select-none">
      {/* Reizstrom-Spur oben */}
      <rect
        x={getX(stimStart)}
        y={paddingTop}
        width={getX(stimEnd) - getX(stimStart)}
        height={18}
        fill="#f59e0b"
        opacity="0.3"
        rx="2"
      />
      <text
        x={(getX(stimStart) + getX(stimEnd)) / 2}
        y={paddingTop + 12}
        fill="#fbbf24"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
      >
        Reizstrom: {stimulusPercent}% ({durationMs} ms Reizdauer)
      </text>

      {/* Gitterlinien */}
      {[30, 0, -50, -70].map((v) => (
        <g key={v}>
          <line
            x1={paddingLeft}
            y1={getY(v)}
            x2={width - paddingRight}
            y2={getY(v)}
            stroke={v === -70 ? '#10b981' : v === -50 ? '#f59e0b' : '#334155'}
            strokeWidth="1"
            strokeDasharray={v === -50 ? '3 3' : 'none'}
            opacity="0.4"
          />
          <text x={paddingLeft - 6} y={getY(v) + 3} fill="#64748b" fontSize="9" textAnchor="end">
            {v > 0 ? `+${v}` : v}
          </text>
        </g>
      ))}

      {/* X-Achsen-Ticks */}
      {[0, 10, 20, 30, 40, 50, 60, 70, 80].map((t) => (
        <text key={t} x={getX(t)} y={height - paddingBottom + 16} fill="#64748b" fontSize="9" textAnchor="middle">
          {t} ms
        </text>
      ))}

      {/* AP-Spur */}
      <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Zähler der Impulse */}
      <text x={width - paddingRight} y={paddingTop + 12} fill="#94a3b8" fontSize="9" textAnchor="end">
        Impulse im Intervall: <strong className="text-forest-400">{apTimes.length}</strong>
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4: GLOSSAR & FACHBEGRIFFE (KOMPENDIUM FÜR OBERSTUFE & ABITUR)
// ═══════════════════════════════════════════════════════════════════════════════
function GlossaryTab() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('Alle');

  const categories = ['Alle', 'Grundlagen', 'Ionenkanäle', 'Phasen', 'Erregungsleitung'];

  const filteredEntries = useMemo(() => {
    return GLOSSARY_ENTRIES.filter((e) => {
      const matchCat = selectedCat === 'Alle' || e.category === selectedCat;
      const matchSearch =
        e.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.details.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCat]);

  return (
    <div className="space-y-6">
      {/* ── TABELLE: IONENKONZENTRATIONEN & GLEICHGEWICHTSPOTENTIALE ─────────── */}
      <div className="bg-white rounded-xl p-5 border border-forest-100 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-500"></span>
          Ionenverteilung an der Axonmembran (Schulbuch S. 30 M2)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Die Grundlage für Ruhepotential und Aktionspotential sind die ungleichen Ionenkonzentrationen innen vs. außen.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-forest-50/70 text-slate-700 dark:text-slate-300">
                <th className="py-2.5 px-3 font-bold">Ion</th>
                <th className="py-2.5 px-3 font-bold">Zellinneres (Axoplasma)</th>
                <th className="py-2.5 px-3 font-bold">Extrazellularraum</th>
                <th className="py-2.5 px-3 font-bold">Gleichgewichtspotential (Nernst)</th>
                <th className="py-2.5 px-3 font-bold">Permeabilität in Ruhe</th>
                <th className="py-2.5 px-3 font-bold">Hauptfunktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {ION_CONCENTRATIONS.map((ion) => (
                <tr key={ion.formula} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ion.color }}></span>
                    <span>{ion.name} ({ion.formula})</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold">{ion.intra} mmol/L</td>
                  <td className="py-2.5 px-3 font-mono font-semibold">{ion.extra} mmol/L</td>
                  <td className="py-2.5 px-3 font-mono font-bold" style={{ color: ion.equilibriumPotential < 0 ? '#34d399' : '#f87171' }}>
                    {ion.equilibriumPotential !== 0 ? `${ion.equilibriumPotential > 0 ? '+' : ''}${ion.equilibriumPotential} mV` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{ion.permeabilityRest}</td>
                  <td className="py-2.5 px-3 text-slate-500">{ion.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GLOSSAR-FILTER & SUCHE ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5">
          {/* Suchleiste */}
          <div className="relative w-full sm:w-72">
            <IconSearch c="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Fachbegriff oder Stichwort suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-forest-50/70 focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          {/* Kategorien */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCat === c
                    ? 'bg-forest-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Glossar-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-forest-50/60 hover:border-forest-400 dark:hover:border-forest-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.term}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-forest-300">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium mb-2">
                  {item.definition}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {item.details}
                </p>
              </div>

              {item.misconception && (
                <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5 mt-2">
                  <IconAlert c="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block font-semibold">Klausurfalle / Fehlvorstellung:</strong>
                    <span>{item.misconception}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
