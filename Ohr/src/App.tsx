import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  EAR_STRUCTURES,
  DECIBEL_SCENARIOS,
  AUDIO_PRESETS,
  QUIZ_QUESTIONS,
  GLOSSARY,
  EarStructure,
  DecibelScenario,
  AudioPreset
} from './data';

// ─── SVG ICONS ───
const IconEar = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a2 2 0 1 1-4 0c0-3 3-5 3-7.5" />
    <path d="M10 8.5a2.5 2.5 0 0 1 5 0c0 2-2 3-2 5" />
  </svg>
);

const IconWave = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h2a2 2 0 0 0 2-2 4 4 0 0 1 4-4 4 4 0 0 1 4 4 2 2 0 0 0 2 2h2" />
    <path d="M2 12c2 3 4 4 6 4s4-1 6-4" />
  </svg>
);

const IconVolume = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const IconShield = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconAlert = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconCheck = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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

  // Navigation
  const [activeTab, setActiveTab] = useState<'schall' | 'tonotopie' | 'audio' | 'laerm' | 'quiz'>('schall');

  // ─── STATION 1: ANATOMIE & SCHALLLEITUNG ───
  const [selectedStructureId, setSelectedStructureId] = useState<string>('trommelfell');
  const [trainerMode, setTrainerMode] = useState<boolean>(false);
  const [trainerAnswers, setTrainerAnswers] = useState<Record<string, string>>({});
  const [trainerSubmitted, setTrainerSubmitted] = useState<boolean>(false);
  const [isWavePlayingStation1, setIsWavePlayingStation1] = useState<boolean>(true);

  // ─── STATION 2: DIE ENTROLLTE COCHLEA (TONOTOPIE) ───
  const [cochleaUnrolled, setCochleaUnrolled] = useState<boolean>(true);
  const [tonotopyFreq, setTonotopyFreq] = useState<number>(2000); // 20 to 20000 Hz

  // ─── STATION 3: INTERAKTIVER AUDIO-GENERATOR (WEB AUDIO API) ───
  const [audioFreq, setAudioFreq] = useState<number>(440); // 20 to 20000 Hz
  const [audioGain, setAudioGain] = useState<number>(0.3); // 0 to 1 (corresponds to dB scale)
  const [isPlayingSynth, setIsPlayingSynth] = useState<boolean>(false);

  // ─── STATION 4: LÄRMSCHADEN-LABOR ───
  const [selectedDb, setSelectedDb] = useState<number>(85);
  const [hearingDamageFilter, setHearingDamageFilter] = useState<boolean>(false);
  const [isPlayingDamageAudio, setIsPlayingDamageAudio] = useState<boolean>(false);

  // ─── STATION 5: QUIZ ───
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [activeGlossaryFilter, setActiveGlossaryFilter] = useState<string>('');

  // Web Audio Context References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Hearing damage audio ref
  const damageOscRef = useRef<OscillatorNode | null>(null);
  const damageNoiseRef = useRef<AudioNode | null>(null);
  const damageGainRef = useRef<GainNode | null>(null);
  const damageFilterRef = useRef<BiquadFilterNode | null>(null);

  const selectedStructure = useMemo(() => {
    return EAR_STRUCTURES.find(s => s.id === selectedStructureId) || EAR_STRUCTURES[2];
  }, [selectedStructureId]);

  const activeScenario = useMemo(() => {
    return DECIBEL_SCENARIOS.reduce((prev, curr) => {
      return Math.abs(curr.level - selectedDb) < Math.abs(prev.level - selectedDb) ? curr : prev;
    }, DECIBEL_SCENARIOS[3]);
  }, [selectedDb]);

  // Tonotopy maximum position along basilar membrane:
  // Base (near oval window, high freq ~20kHz) at x = 0.
  // Apex (helicotrema, low freq ~20Hz) at x = 1.
  // Logarithmic map:
  const tonotopyPeakNorm = useMemo(() => {
    const minF = 20;
    const maxF = 20000;
    const clamped = Math.max(minF, Math.min(maxF, tonotopyFreq));
    // High freq -> low norm (near base). Low freq -> high norm (near apex).
    return 1 - (Math.log10(clamped) - Math.log10(minF)) / (Math.log10(maxF) - Math.log10(minF));
  }, [tonotopyFreq]);

  // ─── WEB AUDIO API HANDLERS ───
  const getOrCreateAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const startTone = () => {
    try {
      const ctx = getOrCreateAudioContext();
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(audioFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(audioGain, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingSynth(true);
    } catch (e) {
      console.error('Audio start error:', e);
    }
  };

  const stopTone = () => {
    try {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.05);
        setTimeout(() => {
          if (oscRef.current) {
            oscRef.current.stop();
            oscRef.current.disconnect();
            oscRef.current = null;
          }
          setIsPlayingSynth(false);
        }, 60);
      } else if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current = null;
        setIsPlayingSynth(false);
      }
    } catch {
      setIsPlayingSynth(false);
    }
  };

  // Keep oscillator frequency updated in real-time
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setTargetAtTime(audioFreq, audioCtxRef.current.currentTime, 0.02);
    }
  }, [audioFreq]);

  // Keep oscillator gain updated in real-time
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current && isPlayingSynth) {
      gainRef.current.gain.setTargetAtTime(audioGain, audioCtxRef.current.currentTime, 0.02);
    }
  }, [audioGain, isPlayingSynth]);

  // Cleanup Web Audio on unmount
  useEffect(() => {
    return () => {
      stopTone();
      stopDamageSimAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // ─── HEARING LOSS SIMULATOR AUDIO (Speech & Tone Spectrum) ───
  const startDamageSimAudio = () => {
    try {
      const ctx = getOrCreateAudioContext();
      stopDamageSimAudio();

      // Create a harmonic signal rich in fundamental vowels (200-800Hz) and sibilant consonants (2500-6000Hz)
      const oscLow = ctx.createOscillator();
      const oscHigh = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const masterGain = ctx.createGain();

      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(320, ctx.currentTime); // Fundamental vowel sound

      oscHigh.type = 'sawtooth';
      oscHigh.frequency.setValueAtTime(3800, ctx.currentTime); // High consonant sibilance

      // Biquad filter:
      // If hearing damage active -> steep lowpass at 1200 Hz (cuts off all high frequencies)
      // If healthy -> allpass / transparent
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(hearingDamageFilter ? 1200 : 20000, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      const gainLow = ctx.createGain();
      gainLow.gain.setValueAtTime(0.25, ctx.currentTime);

      const gainHigh = ctx.createGain();
      gainHigh.gain.setValueAtTime(0.12, ctx.currentTime);

      oscLow.connect(gainLow);
      oscHigh.connect(gainHigh);

      gainLow.connect(filter);
      gainHigh.connect(filter);

      masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscLow.start();
      oscHigh.start();

      damageOscRef.current = oscLow;
      damageNoiseRef.current = oscHigh;
      damageFilterRef.current = filter;
      damageGainRef.current = masterGain;

      setIsPlayingDamageAudio(true);
    } catch (e) {
      console.error('Damage audio error:', e);
    }
  };

  const stopDamageSimAudio = () => {
    try {
      if (damageOscRef.current) {
        damageOscRef.current.stop();
        damageOscRef.current.disconnect();
        damageOscRef.current = null;
      }
      if (damageNoiseRef.current && (damageNoiseRef.current as OscillatorNode).stop) {
        (damageNoiseRef.current as OscillatorNode).stop();
        damageNoiseRef.current.disconnect();
        damageNoiseRef.current = null;
      }
      setIsPlayingDamageAudio(false);
    } catch {
      setIsPlayingDamageAudio(false);
    }
  };

  // Update filter cutoff in real-time
  useEffect(() => {
    if (damageFilterRef.current && audioCtxRef.current) {
      const targetCutoff = hearingDamageFilter ? 1100 : 20000;
      damageFilterRef.current.frequency.setTargetAtTime(targetCutoff, audioCtxRef.current.currentTime, 0.05);
    }
  }, [hearingDamageFilter]);

  return (
    <div className="min-h-screen bg-forest-50 text-gray-900 flex flex-col font-sans">
      {/* ─── HEADER ─── */}
      <header className="bg-forest-900 text-white shadow-md border-b border-forest-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="p-2 -ml-2 rounded-lg text-forest-200 hover:text-white hover:bg-forest-800 transition-colors flex items-center gap-1.5 text-sm font-medium"
              title="Zurück zur BioApps-Übersicht"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="hidden sm:inline">BioApps</span>
            </a>
            <div className="h-6 w-px bg-forest-700 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-700/80 border border-forest-600 flex items-center justify-center text-forest-200 shadow-inner">
                <IconEar className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white flex items-center gap-2">
                  Das Ohr – Schallleitung & Tonotopie
                  <span className="text-[10px] uppercase tracking-wider bg-forest-700 text-forest-100 px-2 py-0.5 rounded-full font-semibold border border-forest-600">
                    Bio 8
                  </span>
                </h1>
                <p className="text-xs text-forest-300 hidden md:block">
                  LehrplanPLUS Bayern (B8 2) • Mechanische Druckverstärkung, Frequenzortsprinzip, Audio-Synth & Lärmschutz
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              data-dark-toggle
              onClick={() => setDarkMode(prev => !prev)}
              aria-label={darkMode ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
              title={darkMode ? 'Helles Design' : 'Dunkles Design'}
              className="p-2 rounded-xl text-forest-200 hover:text-white hover:bg-forest-800 transition-colors flex items-center justify-center text-lg active:scale-95 cursor-pointer"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* ─── TAB NAVIGATION ─── */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-forest-800/80 text-sm font-medium">
          <button
            onClick={() => setActiveTab('schall')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'schall'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconEar className="w-4 h-4 text-emerald-400" />
            <span>1. Schallleitung & Hebelwerk</span>
          </button>

          <button
            onClick={() => setActiveTab('tonotopie')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'tonotopie'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconWave className="w-4 h-4 text-teal-400" />
            <span>2. Entrollte Cochlea & Tonotopie</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'audio'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconVolume className="w-4 h-4 text-sky-400" />
            <span>3. Audio-Generator (Synth)</span>
          </button>

          <button
            onClick={() => setActiveTab('laerm')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'laerm'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconShield className="w-4 h-4 text-amber-400" />
            <span>4. Lärmschutz & Hörverlust</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconAlert className="w-4 h-4 text-emerald-300" />
            <span>5. Trainer & Fehlkonzept-Quiz</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 1: DER MECHANISCHE SCHALLLEITUNGSWEG & HEBELWERK             */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'schall' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Station 1
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Der mechanische Schallleitungsweg & das Mittelohr-Hebelwerk
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Folge dem Weg des Schalls: Von der <strong>Ohrmuschel</strong> über das schwingende <strong>Trommelfell</strong>, die Hebelkette der <strong>Gehörknöchelchen</strong> (Druckverstärkung $\approx 22$-fach!) bis zum <strong>ovalen Fenster</strong> der Hörschnecke.
                </p>
              </div>

              {/* Mode Toggle: Erkunden vs. Beschriftungstest */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 self-stretch md:self-auto">
                <button
                  onClick={() => setTrainerMode(false)}
                  className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !trainerMode ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  👁️ Modell & Hebelwerk
                </button>
                <button
                  onClick={() => { setTrainerMode(true); setTrainerSubmitted(false); }}
                  className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    trainerMode ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✍️ Beschriftungstest
                </button>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Ear Anatomy Cross-Section (SVG) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <span>Frontalschnitt: Außenohr, Mittelohr & Innenohr</span>
                    <span className="text-xs font-normal text-gray-500">(Klicke auf Strukturen zum Erkunden)</span>
                  </h3>
                  <button
                    onClick={() => setIsWavePlayingStation1(!isWavePlayingStation1)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all ${
                      isWavePlayingStation1 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {isWavePlayingStation1 ? '▶ Schwingung Aktiv' : '⏸ Pause'}
                  </button>
                </div>

                {/* EAR SVG MODEL */}
                <div className="relative w-full aspect-[580/340] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden select-none p-2 flex items-center justify-center">
                  <svg viewBox="0 0 580 340" className="w-full h-full">
                    {/* Background zones (Outer, Middle, Inner Ear) */}
                    <rect x="10" y="20" width="180" height="300" fill="#0f172a" opacity="0.4" rx="8" />
                    <text x="25" y="45" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1">AUSSENOHR</text>

                    <rect x="195" y="20" width="115" height="300" fill="#1e1b4b" opacity="0.3" rx="8" />
                    <text x="205" y="45" fill="#818cf8" fontSize="10" fontWeight="bold" letterSpacing="1">MITTELOHR</text>

                    <rect x="315" y="20" width="250" height="300" fill="#064e3b" opacity="0.25" rx="8" />
                    <text x="330" y="45" fill="#34d399" fontSize="10" fontWeight="bold" letterSpacing="1">INNENOHR (COCHLEA)</text>

                    {/* 1. OHRMUSCHEL (Auricula) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('ohrmuschel')}
                    >
                      <path
                        d="M 65 60 C 20 80, 15 160, 45 230 C 60 260, 80 270, 75 290 C 70 300, 50 290, 40 270 C 10 210, 5 110, 50 45 C 75 10, 95 35, 80 65 Z"
                        fill="#fb923c"
                        fillOpacity="0.25"
                        stroke={selectedStructureId === 'ohrmuschel' ? '#ea580c' : '#fb923c'}
                        strokeWidth={selectedStructureId === 'ohrmuschel' ? 4 : 2}
                      />
                    </g>

                    {/* INCOMING SOUND WAVES */}
                    {isWavePlayingStation1 && (
                      <g stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8">
                        <path d="M 5 110 Q 15 150, 5 190" className="animate-wave-move" />
                        <path d="M 25 120 Q 35 150, 25 180" className="animate-wave-move" />
                        <path d="M 45 130 Q 55 150, 45 170" className="animate-wave-move" />
                      </g>
                    )}

                    {/* 2. GEHÖRGANG (Meatus acusticus) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('gehoergang')}
                    >
                      {/* Upper & lower ear canal bone walls */}
                      <path
                        d="M 68 135 Q 120 125, 190 140"
                        fill="none"
                        stroke={selectedStructureId === 'gehoergang' ? '#ea580c' : '#94a3b8'}
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 75 175 Q 130 180, 195 190"
                        fill="none"
                        stroke={selectedStructureId === 'gehoergang' ? '#ea580c' : '#94a3b8'}
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      {/* Canal cavity */}
                      <path
                        d="M 68 135 Q 120 125, 190 140 L 195 190 Q 130 180, 75 175 Z"
                        fill="#f97316"
                        fillOpacity="0.12"
                      />
                      {/* Tiny ear hairs */}
                      <line x1="90" y1="137" x2="93" y2="143" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="110" y1="135" x2="112" y2="142" stroke="#cbd5e1" strokeWidth="1" />
                    </g>

                    {/* 3. TROMMELFELL (Membrana tympani) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('trommelfell')}
                    >
                      <path
                        d="M 190 140 Q 196 165, 195 190"
                        fill="none"
                        stroke={selectedStructureId === 'trommelfell' ? '#0284c7' : '#38bdf8'}
                        strokeWidth={selectedStructureId === 'trommelfell' ? 5 : 3.5}
                        className={isWavePlayingStation1 ? 'animate-eardrum' : ''}
                      />
                    </g>

                    {/* 4. HAMMER (Malleus) */}
                    <g
                      className={`cursor-pointer ${isWavePlayingStation1 ? 'animate-ossicle' : ''}`}
                      onClick={() => !trainerMode && setSelectedStructureId('hammer')}
                    >
                      {/* Hammer handle attached to eardrum */}
                      <line
                        x1="193"
                        y1="162"
                        x2="215"
                        y2="128"
                        stroke={selectedStructureId === 'hammer' ? '#9333ea' : '#c084fc'}
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* Hammer head */}
                      <circle
                        cx="218"
                        cy="124"
                        r="6"
                        fill="#a855f7"
                        stroke={selectedStructureId === 'hammer' ? '#ffffff' : '#7e22ce'}
                        strokeWidth="1.5"
                      />
                    </g>

                    {/* 5. AMBOSS (Incus) */}
                    <g
                      className={`cursor-pointer ${isWavePlayingStation1 ? 'animate-ossicle' : ''}`}
                      onClick={() => !trainerMode && setSelectedStructureId('amboss')}
                    >
                      {/* Amboss body */}
                      <path
                        d="M 224 123 L 246 120 L 248 138 L 235 135 Z"
                        fill="#c084fc"
                        stroke={selectedStructureId === 'amboss' ? '#ffffff' : '#9333ea'}
                        strokeWidth="1.5"
                      />
                      {/* Long crus down to stapes */}
                      <line
                        x1="247"
                        y1="138"
                        x2="252"
                        y2="152"
                        stroke="#c084fc"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* 6. STEIGBÜGEL (Stapes) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('steigbuegel')}
                    >
                      {/* Head & Arches */}
                      <path
                        d="M 253 152 L 272 144 L 272 160 Z"
                        fill="none"
                        stroke={selectedStructureId === 'steigbuegel' ? '#db2777' : '#e879f9'}
                        strokeWidth="2.5"
                      />
                      {/* Footplate in oval window */}
                      <line
                        x1="272"
                        y1="142"
                        x2="272"
                        y2="162"
                        stroke={selectedStructureId === 'steigbuegel' ? '#ffffff' : '#f43f5e'}
                        strokeWidth="4"
                      />
                    </g>

                    {/* 7. OVALES FENSTER (Fenestra vestibuli) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('ovales_fenster')}
                    >
                      <ellipse
                        cx="274"
                        cy="152"
                        rx="2"
                        ry="10"
                        fill="#f43f5e"
                        stroke="#ec4899"
                        strokeWidth={selectedStructureId === 'ovales_fenster' ? 3 : 1}
                      />
                    </g>

                    {/* 8. RUNDES FENSTER (Fenestra cochleae) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('rundes_fenster')}
                    >
                      <ellipse
                        cx="274"
                        cy="200"
                        rx="3"
                        ry="8"
                        fill="#f43f5e"
                        fillOpacity="0.6"
                        stroke={selectedStructureId === 'rundes_fenster' ? '#ffffff' : '#f43f5e'}
                        strokeWidth={selectedStructureId === 'rundes_fenster' ? 3 : 1.5}
                        className={isWavePlayingStation1 ? 'animate-eardrum' : ''}
                      />
                    </g>

                    {/* 9. OHRTROMPETE (Eustachi-Röhre) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('ohrtrompete')}
                    >
                      <path
                        d="M 230 210 Q 250 250, 265 310"
                        fill="none"
                        stroke={selectedStructureId === 'ohrtrompete' ? '#38bdf8' : '#0284c7'}
                        strokeWidth={selectedStructureId === 'ohrtrompete' ? 6 : 4}
                        strokeLinecap="round"
                        strokeDasharray="4 2"
                      />
                      <text x="270" y="295" fill="#38bdf8" fontSize="9">zum Rachen</text>
                    </g>

                    {/* 10. HÖRSCHNECKE (Cochlea) & BOGENGÄNGE */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('cochlea')}
                    >
                      {/* Vestibular Semicircular Canals (Bogengänge) */}
                      <path
                        d="M 285 130 C 285 70, 340 70, 340 120 C 340 80, 380 90, 360 135"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.7"
                      />

                      {/* Cochlear spirals */}
                      <path
                        d="M 276 152 C 340 145, 410 160, 440 190 C 470 220, 440 260, 390 260 C 340 260, 330 210, 370 190 C 400 175, 415 200, 400 220 C 390 230, 375 220, 380 210"
                        fill="none"
                        stroke={selectedStructureId === 'cochlea' ? '#34d399' : '#10b981'}
                        strokeWidth={selectedStructureId === 'cochlea' ? 9 : 7}
                        strokeLinecap="round"
                      />

                      {/* Inner fluid wave pulse */}
                      {isWavePlayingStation1 && (
                        <path
                          d="M 276 152 C 340 145, 410 160, 440 190 C 470 220, 440 260, 390 260"
                          fill="none"
                          stroke="#a7f3d0"
                          strokeWidth="2.5"
                          strokeDasharray="6 4"
                          className="animate-ray"
                        />
                      )}
                    </g>

                    {/* 11. HÖRNERV (Nervus cochlearis) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('hoernerv')}
                    >
                      <path
                        d="M 440 200 L 530 200"
                        fill="none"
                        stroke={selectedStructureId === 'hoernerv' ? '#eab308' : '#ca8a04'}
                        strokeWidth={selectedStructureId === 'hoernerv' ? 8 : 6}
                        strokeLinecap="round"
                      />
                      <line x1="450" y1="195" x2="520" y2="195" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
                      <line x1="450" y1="205" x2="520" y2="205" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
                      <text x="500" y="190" fill="#facc15" fontSize="10" fontWeight="bold">zum Gehirn</text>
                    </g>

                    {/* INTERACTIVE PINS */}
                    {!trainerMode && (
                      <>
                        {EAR_STRUCTURES.map((s) => {
                          const isSelected = selectedStructureId === s.id;
                          const coords = s.highlightCoordinates || { x: 200, y: 160 };
                          return (
                            <g
                              key={s.id}
                              className="cursor-pointer group"
                              onClick={() => setSelectedStructureId(s.id)}
                            >
                              <circle
                                cx={coords.x}
                                cy={coords.y}
                                r={isSelected ? 7 : 4}
                                fill={isSelected ? '#10b981' : '#ffffff'}
                                stroke={isSelected ? '#ffffff' : '#059669'}
                                strokeWidth="2"
                                className="transition-all duration-200"
                              />
                            </g>
                          );
                        })}
                      </>
                    )}

                    {/* TRAINER MODE PINS (1 to 10) */}
                    {trainerMode && (
                      <>
                        {EAR_STRUCTURES.slice(0, 10).map((s, idx) => {
                          const coords = s.highlightCoordinates || { x: 200, y: 160 };
                          const userChoice = trainerAnswers[s.id];
                          const isCorrect = userChoice === s.id;
                          return (
                            <g key={s.id} transform={`translate(${coords.x}, ${coords.y})`}>
                              <circle
                                r="10"
                                fill={trainerSubmitted ? (isCorrect ? '#22c55e' : '#ef4444') : '#1e293b'}
                                stroke="#ffffff"
                                strokeWidth="2"
                              />
                              <text
                                y="3.5"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {idx + 1}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    )}
                  </svg>
                </div>

                {/* Quick Selection Chips */}
                {!trainerMode && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {EAR_STRUCTURES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStructureId(s.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          selectedStructureId === s.id
                            ? 'bg-forest-800 text-white border-forest-900 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-forest-50 hover:border-forest-300'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Structure Detail Card OR Trainer Panel */}
              <div className="lg:col-span-4 space-y-4">
                {!trainerMode ? (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                          {selectedStructure.latinName}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">
                          {selectedStructure.name}
                        </h3>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase" style={{
                        backgroundColor: selectedStructure.section === 'aussen' ? '#ffedd5' : selectedStructure.section === 'mittel' ? '#f3e8ff' : '#d1fae5',
                        color: selectedStructure.section === 'aussen' ? '#c2410c' : selectedStructure.section === 'mittel' ? '#7e22ce' : '#047857'
                      }}>
                        {selectedStructure.section === 'aussen' ? 'Außenohr' : selectedStructure.section === 'mittel' ? 'Mittelohr' : 'Innenohr'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 leading-relaxed bg-forest-50/50 p-3 rounded-xl border border-forest-100">
                      <strong>Aufbau & Lage:</strong> {selectedStructure.description}
                    </div>

                    <div className="text-sm text-gray-800 leading-relaxed">
                      <strong className="text-forest-900">Biologische Funktion:</strong> {selectedStructure.function}
                    </div>

                    {selectedStructure.didacticNote && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                        <IconAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Wichtiger Merksatz:</strong> {selectedStructure.didacticNote}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h3 className="font-bold text-gray-900 text-sm">
                        ✍️ Beschriftungstest: Ordne die Nummern zu
                      </h3>
                      <span className="text-xs text-gray-500">10 Strukturen</span>
                    </div>

                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                      {EAR_STRUCTURES.slice(0, 10).map((s, idx) => (
                        <div key={s.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg text-xs">
                          <span className="font-bold text-gray-700 w-6">#{idx + 1}</span>
                          <select
                            value={trainerAnswers[s.id] || ''}
                            onChange={(e) => setTrainerAnswers({ ...trainerAnswers, [s.id]: e.target.value })}
                            disabled={trainerSubmitted}
                            className="flex-1 p-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-forest-500"
                          >
                            <option value="">-- Wähle Struktur --</option>
                            {EAR_STRUCTURES.slice(0, 10).map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.name}</option>
                            ))}
                          </select>
                          {trainerSubmitted && (
                            <span className="text-sm">
                              {trainerAnswers[s.id] === s.id ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {!trainerSubmitted ? (
                      <button
                        onClick={() => setTrainerSubmitted(true)}
                        className="w-full py-2 bg-forest-800 text-white font-semibold text-xs rounded-xl hover:bg-forest-900 transition-colors"
                      >
                        Ergebnis prüfen
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 bg-forest-50 rounded-xl text-center text-xs font-bold text-forest-900 border border-forest-200">
                          Ergebnis: {Object.keys(trainerAnswers).filter(k => trainerAnswers[k] === k).length} von 10 richtig!
                        </div>
                        <button
                          onClick={() => { setTrainerAnswers({}); setTrainerSubmitted(false); }}
                          className="w-full py-2 bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl hover:bg-gray-300 transition-colors"
                        >
                          Nochmal versuchen
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* DRUCKVERSTÄRKUNGS-RECHNER BOX */}
                <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-indigo-800/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <IconShield className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      Das physikalische Druckverstärkungs-Prinzip
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-700/50">
                      <span className="text-[11px] text-indigo-300 block">1. Flächenverhältnis</span>
                      <strong className="text-white text-sm">~17 : 1 bis 20 : 1</strong>
                      <p className="text-[10px] text-indigo-200 mt-0.5">Trommelfell (55 mm²) vs. Steigbügelplatte (3 mm²)</p>
                    </div>
                    <div className="bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-700/50">
                      <span className="text-[11px] text-indigo-300 block">2. Hebelübersetzung</span>
                      <strong className="text-white text-sm">1,3 : 1</strong>
                      <p className="text-[10px] text-indigo-200 mt-0.5">Hammer & Amboss wirken als Krafthebel</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider">Gesamtdruck-Verstärkung</span>
                      <strong className="text-white text-base">ca. 22-facher Druck</strong>
                    </div>
                    <span className="text-xl">🚀</span>
                  </div>

                  <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                    💡 <strong>Warum nötig?</strong> Ohne diese 22-fache Drucksteigerung würde die zähe Flüssigkeit der Hörschnecke 99,9 % der Schallenergie wie eine Mauer reflektieren!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 2: DIE ENTROLLTE COCHLEA & DAS FREQUENZORTSPRINZIP           */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tonotopie' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                    Station 2
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Die entrollte Hörschnecke & das Frequenzortsprinzip (Tonotopie)
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Rolle die schneckenförmige Cochlea virtuell aus! Beobachte die <strong>Wanderwelle</strong> nach Békésy: Hohe Töne regen die straffe Basis an, tiefe Töne wandern bis zur elastischen Spitze (Apex).
                </p>
              </div>

              {/* Unroll Toggle */}
              <button
                onClick={() => setCochleaUnrolled(!cochleaUnrolled)}
                className="px-4 py-2 bg-teal-800 text-white font-semibold text-xs rounded-xl hover:bg-teal-900 transition-colors shadow-sm flex items-center gap-2"
              >
                <span>🌀 Schnecke:</span>
                <span className="font-bold">{cochleaUnrolled ? 'Entrollt (35 mm Längsschnitt)' : 'Eingerollt (Spiralform)'}</span>
              </button>
            </div>

            {/* Tonotopy Interactive Stage */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
              {/* Frequency Slider & Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-2/3 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-800">
                    <span>Tonhöhe (Prüffrequenz):</span>
                    <span className="text-teal-700 font-mono text-sm font-bold">
                      {tonotopyFreq >= 1000 ? `${(tonotopyFreq / 1000).toFixed(1)} kHz` : `${tonotopyFreq} Hz`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="20000"
                    step="20"
                    value={tonotopyFreq}
                    onChange={(e) => setTonotopyFreq(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>20 Hz (Apex/Spitze)</span>
                    <span>500 Hz (Tief)</span>
                    <span>2 kHz (Sprache)</span>
                    <span>8 kHz (Hoch)</span>
                    <span>20 kHz (Basis)</span>
                  </div>
                </div>

                <div className="bg-teal-900 text-white p-3 rounded-xl text-center w-full md:w-1/3 border border-teal-700 text-xs">
                  <span className="text-teal-300 block text-[11px] font-semibold">Resonanzort der Basilarmembran:</span>
                  <strong className="text-sm text-teal-100">
                    {tonotopyFreq > 8000 ? 'Schneckenbasis (schmal & straff)' : tonotopyFreq > 1500 ? 'Mittlerer Schneckengang' : 'Schneckenspitze / Apex (breit & weich)'}
                  </strong>
                </div>
              </div>

              {/* VISUALIZATION: UNROLLED OR SPIRAL COCHLEA */}
              {cochleaUnrolled ? (
                /* UNROLLED 35 mm LONGITUDINAL MODEL (SVG) */
                <div className="relative w-full aspect-[720/240] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none p-2 flex items-center justify-center">
                  <svg viewBox="0 0 720 240" className="w-full h-full">
                    {/* Background Labels */}
                    <text x="25" y="25" fill="#64748b" fontSize="10" fontWeight="bold">SCHNECKENBASIS (Ovales & Rundes Fenster)</text>
                    <text x="560" y="25" fill="#64748b" fontSize="10" fontWeight="bold">SPITZE (Apex / Helicotrema)</text>

                    {/* UPPER CANAL (Scala vestibuli) */}
                    <rect x="50" y="40" width="620" height="50" fill="#0284c7" fillOpacity="0.15" />
                    <text x="60" y="65" fill="#38bdf8" fontSize="11" fontWeight="bold">Vorhoftreppe (Scala vestibuli) – Perilymphe</text>

                    {/* STAPES AT OVAL WINDOW (Left Upper) */}
                    <rect x="35" y="45" width="15" height="40" fill="#ec4899" stroke="#db2777" strokeWidth="2" rx="2" />
                    <text x="15" y="70" fill="#ec4899" fontSize="9" fontWeight="bold">Steigbügel</text>

                    {/* LOWER CANAL (Scala tympani) */}
                    <rect x="50" y="140" width="620" height="50" fill="#0284c7" fillOpacity="0.15" />
                    <text x="60" y="170" fill="#38bdf8" fontSize="11" fontWeight="bold">Paukentreppe (Scala tympani) – Perilymphe</text>

                    {/* ROUND WINDOW (Left Lower) */}
                    <rect x="35" y="145" width="15" height="40" fill="#f43f5e" stroke="#e11d48" strokeWidth="2" rx="2" />
                    <text x="10" y="170" fill="#f43f5e" fontSize="9" fontWeight="bold">Rundes Fenster</text>

                    {/* HELICOTREMA (Connection at Apex right) */}
                    <path d="M 670 40 C 700 40, 700 190, 670 190" fill="none" stroke="#38bdf8" strokeWidth="4" />
                    <text x="635" y="120" fill="#7dd3fc" fontSize="9" fontWeight="bold">Helicotrema</text>

                    {/* MIDDLE CANAL / BASILAR MEMBRANE (Scala media) */}
                    {/* The membrane widens from left (narrow 8px) to right (wide 30px) */}
                    <path
                      d="M 50 90 L 670 90 L 670 140 L 50 140 Z"
                      fill="#064e3b"
                      fillOpacity="0.3"
                    />

                    {/* THE BASILAR MEMBRANE GRADIENT SHAPE */}
                    {/* Tapering trapezoid: narrow at basis (y: 110 to 120), wide at apex (y: 95 to 135) */}
                    <path
                      d="M 50 112 L 670 95 L 670 135 L 50 122 Z"
                      fill="#10b981"
                      fillOpacity="0.25"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    <text x="60" y="118" fill="#a7f3d0" fontSize="9">Basilarmembran: schmal (0,1 mm) &amp; straff</text>
                    <text x="470" y="118" fill="#a7f3d0" fontSize="9">breit (0,5 mm) &amp; weich</text>

                    {/* TRAVELING WAVE (Wanderwelle) SVG PATH */}
                    {(() => {
                      // Peak position along x: from 80px (basis) to 640px (apex)
                      const peakX = 80 + tonotopyPeakNorm * 560;
                      // Generate smooth wave path
                      let pathD = 'M 50 115 ';
                      for (let x = 50; x <= 670; x += 10) {
                        const distFromPeak = Math.abs(x - peakX);
                        // Envelope amplitude
                        let amp = 0;
                        if (x <= peakX) {
                          amp = Math.max(0, 24 * Math.exp(-Math.pow(distFromPeak / 60, 2)));
                        } else {
                          // Steep decline after peak
                          amp = Math.max(0, 24 * Math.exp(-Math.pow(distFromPeak / 25, 2)));
                        }
                        const waveY = 115 + Math.sin((x / 14)) * amp;
                        pathD += `L ${x} ${waveY} `;
                      }

                      return (
                        <g>
                          {/* Animated traveling wave line */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="3.5"
                            className="animate-wave-move"
                          />

                          {/* Schwingungsmaximum Target Marker */}
                          <circle cx={peakX} cy="115" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                          <line x1={peakX} y1="40" x2={peakX} y2="190" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                          <rect x={peakX - 55} y="195" width="110" height="22" rx="4" fill="#ef4444" />
                          <text x={peakX} y="210" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                            Resonanz: {tonotopyFreq >= 1000 ? `${(tonotopyFreq / 1000).toFixed(1)} kHz` : `${tonotopyFreq} Hz`}
                          </text>
                        </g>
                      );
                    })()}

                    {/* FREQUENCY SCALE AT BOTTOM */}
                    <g transform="translate(0, 225)">
                      <line x1="80" y1="0" x2="640" y2="0" stroke="#64748b" strokeWidth="1.5" />
                      {[
                        { x: 80, label: '20 kHz' },
                        { x: 180, label: '10 kHz' },
                        { x: 280, label: '4 kHz' },
                        { x: 390, label: '1 kHz' },
                        { x: 500, label: '250 Hz' },
                        { x: 630, label: '20 Hz' }
                      ].map((tick, i) => (
                        <g key={i} transform={`translate(${tick.x}, 0)`}>
                          <line y1="-3" y2="3" stroke="#94a3b8" strokeWidth="1.5" />
                          <text y="12" fill="#cbd5e1" fontSize="9" textAnchor="middle">{tick.label}</text>
                        </g>
                      ))}
                    </g>
                  </svg>
                </div>
              ) : (
                /* SPIRAL 2.5 TURNS NATURAL VIEW */
                <div className="relative w-full aspect-[720/240] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none p-2 flex items-center justify-center">
                  <svg viewBox="0 0 360 220" className="w-full h-full">
                    {/* Cochlea Spiral outline */}
                    <path
                      d="M 60 110 C 60 40, 160 30, 220 50 C 290 80, 310 160, 250 200 C 190 230, 120 210, 110 150 C 100 100, 160 80, 200 95 C 240 110, 240 160, 200 170 C 170 175, 160 145, 175 135"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 60 110 C 60 40, 160 30, 220 50 C 290 80, 310 160, 250 200 C 190 230, 120 210, 110 150 C 100 100, 160 80, 200 95 C 240 110, 240 160, 200 170 C 170 175, 160 145, 175 135"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Frequency callouts on spiral */}
                    <circle cx="70" cy="90" r="5" fill="#ef4444" />
                    <text x="40" y="75" fill="#fca5a5" fontSize="9" fontWeight="bold">Basis (~20 kHz)</text>

                    <circle cx="270" cy="120" r="5" fill="#eab308" />
                    <text x="278" y="125" fill="#fef08a" fontSize="9" fontWeight="bold">Mitte (~2 kHz)</text>

                    <circle cx="175" cy="135" r="5" fill="#38bdf8" />
                    <text x="145" y="125" fill="#7dd3fc" fontSize="9" fontWeight="bold">Apex (~20 Hz)</text>
                  </svg>
                </div>
              )}

              {/* Didactic Békésy Nobel Prize Alert Box */}
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-sm text-teal-900">Das Frequenzortsprinzip nach Georg von Békésy (Nobelpreis 1961):</strong>
                  <p className="leading-relaxed">
                    Die mechanischen Eigenschaften der Basilarmembran ändern sich kontinuierlich: An der Schneckenbasis ist sie <strong>schmal und steif</strong> (wie eine kurze Geigensaite $\rightarrow$ Resonanz bei <strong>hohen Frequenzen</strong>). Zur Spitze (Apex) hin wird sie um das 5-fache <strong>breiter und weicher</strong> ($\rightarrow$ Resonanz bei <strong>tiefen Basstönen</strong>). Jede Frequenz erregt somit eine ganz spezifische Gruppe von Haarzellen!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 3: INTERAKTIVER AUDIO-GENERATOR (WEB AUDIO API)               */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                    Station 3
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Echter Audio-Generator: Frequenz (Tonhöhe) & Amplitude (Lautstärke)
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Erzeuge über die Web Audio API echte Sinusschwingungen. Untersuche experimentell den fundamentalen Unterschied zwischen <strong>Tonhöhe (Frequenz in Hz)</strong> und <strong>Lautstärke (Amplitude in dB)</strong>!
                </p>
              </div>

              {/* Master Play/Stop Button */}
              <button
                onClick={() => {
                  if (isPlayingSynth) stopTone();
                  else startTone();
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                  isPlayingSynth
                    ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                    : 'bg-forest-800 text-white hover:bg-forest-900'
                }`}
              >
                <span>{isPlayingSynth ? '⏹ Ton stoppen' : '▶ Ton abspielen'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Frequency & Amplitude Controls */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-5">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span>Synthesizer-Parameter</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isPlayingSynth ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {isPlayingSynth ? 'Audio aktiv' : 'Stumm'}
                  </span>
                </h3>

                {/* 1. Frequency Control */}
                <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800">1. Frequenz (Tonhöhe):</span>
                    <span className="font-mono font-bold text-base text-forest-800 bg-white px-2.5 py-0.5 rounded border border-gray-300">
                      {audioFreq >= 1000 ? `${(audioFreq / 1000).toFixed(2)} kHz` : `${audioFreq} Hz`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="18000"
                    step="10"
                    value={audioFreq}
                    onChange={(e) => setAudioFreq(parseInt(e.target.value))}
                    className="w-full accent-forest-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>20 Hz (Tiefster Ton)</span>
                    <span>440 Hz (Kammerton A)</span>
                    <span>18.000 Hz (Höchstes Fiepen)</span>
                  </div>
                </div>

                {/* 2. Amplitude / Volume Control */}
                <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800">2. Amplitude (Lautstärke):</span>
                    <span className="font-mono font-bold text-base text-sky-800 bg-white px-2.5 py-0.5 rounded border border-gray-300">
                      {Math.round(audioGain * 100)} % ({Math.round(20 + audioGain * 75)} dB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.8"
                    step="0.01"
                    value={audioGain}
                    onChange={(e) => setAudioGain(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Flüstern (Leise)</span>
                    <span>Zimmerlautstärke</span>
                    <span>Laut (Achtung auf Ohren!)</span>
                  </div>
                </div>

                {/* Presets List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-700 block">Hörbeispiel-Presets:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AUDIO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAudioFreq(preset.frequency);
                          if (!isPlayingSynth) startTone();
                        }}
                        className={`p-2 rounded-xl text-left border text-xs transition-all ${
                          audioFreq === preset.frequency
                            ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold ring-2 ring-sky-300/40'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Real-time Oscilloscope Visualization */}
              <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <IconWave className="w-4 h-4 text-emerald-400" />
                    Echtzeit-Oszilloskop (Schallwellenform)
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    λ = {(343 / audioFreq).toFixed(2)} m (Luft)
                  </span>
                </div>

                {/* SVG OSCILLOSCOPE */}
                <div className="relative w-full aspect-[400/220] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Grid */}
                    <pattern id="scopeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="#1e293b" strokeWidth="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                    <rect width="400" height="200" fill="url(#scopeGrid)" />

                    {/* Zero axis line */}
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 2" />

                    {/* DYNAMIC SINE WAVE */}
                    {(() => {
                      // Wave cycles in visible box: mapped from frequency
                      const cycles = Math.max(1, Math.min(18, audioFreq / 150));
                      // Wave amplitude: mapped from audioGain
                      const amp = Math.max(4, audioGain * 85);

                      let d = 'M 0 100 ';
                      for (let x = 0; x <= 400; x += 4) {
                        const y = 100 - Math.sin((x / 400) * cycles * 2 * Math.PI) * amp;
                        d += `L ${x} ${y} `;
                      }

                      return (
                        <g>
                          <path
                            d={d}
                            fill="none"
                            stroke={isPlayingSynth ? '#38bdf8' : '#64748b'}
                            strokeWidth={isPlayingSynth ? 3 : 2}
                            style={{
                              filter: isPlayingSynth ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.7))' : 'none'
                            }}
                          />
                        </g>
                      );
                    })()}
                  </svg>

                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-slate-400 bg-black/60 px-3 py-1 rounded-lg border border-white/10">
                    <span>Amplitude: <strong className="text-white">{(audioGain * 100).toFixed(0)} %</strong> (Lautstärke)</span>
                    <span>Frequenz: <strong className="text-white">{audioFreq} Hz</strong> (Tonhöhe)</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <strong className="text-white block">Physikalischer Merksatz:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><strong>Amplitude (Wellenhöhe):</strong> Bestimmt den Schalldruck und die <em>Lautstärke</em>. Größere Schwingung = kräftigere Haarzell-Auslenkung.</li>
                    <li><strong>Frequenz (Schwingungen pro Sekunde):</strong> Bestimmt die <em>Tonhöhe</em>. Höhere Frequenz = dichtere Wellenberge = Reizung an der Schneckenbasis.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 4: LÄRMSCHADEN- & PRÄVENTIONS-LABOR (GESUNDHEIT)              */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'laerm' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Station 4
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Lärmschaden-Labor & Sprachverständlichkeits-Simulation
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Erfahre die Wirkung von Dezibel-Pegeln auf die <strong>Haarsinneszellen des Corti-Organs</strong>. Erlebe im interaktiven Hörfilter, warum Lärmschäden zum gefürchteten <strong>Verlust der Sprachverständlichkeit</strong> führen!
                </p>
              </div>

              {/* Hearing damage filter toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setHearingDamageFilter(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !hearingDamageFilter ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600'
                  }`}
                >
                  🟢 Gesundes Gehör
                </button>
                <button
                  onClick={() => setHearingDamageFilter(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    hearingDamageFilter ? 'bg-white shadow-sm text-rose-800 font-bold' : 'text-gray-600'
                  }`}
                >
                  🔴 Hochton-Hörverlust (Lärmschaden)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Decibel Scale & Scenarios */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span>Schallpegel-Skala & Gefahrenstufen</span>
                  <span className="font-mono font-bold text-sm" style={{ color: activeScenario.color }}>
                    {selectedDb} dB
                  </span>
                </h3>

                {/* Slider */}
                <div className="space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between text-xs font-semibold text-gray-800">
                    <span>Lärmquelle: <strong>{activeScenario.title}</strong></span>
                    <span className="font-mono">{selectedDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="140"
                    step="5"
                    value={selectedDb}
                    onChange={(e) => setSelectedDb(parseInt(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>20 dB (Flüstern)</span>
                    <span className="text-amber-600 font-bold">85 dB (Grenze)</span>
                    <span className="text-red-600 font-bold">140 dB (Schmerz)</span>
                  </div>
                </div>

                {/* Scenario Details Card */}
                <div className="p-4 rounded-xl border space-y-2 transition-all" style={{
                  backgroundColor: `${activeScenario.color}15`,
                  borderColor: `${activeScenario.color}40`
                }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider" style={{ color: activeScenario.color }}>
                      {activeScenario.dangerClass === 'safe' ? 'Sicherer Bereich' : activeScenario.dangerClass === 'caution' ? 'Belastend / Stress' : activeScenario.dangerClass === 'danger' ? 'Gehörgefährdung!' : 'Akute Schmerzgrenze!'}
                    </span>
                    <span className="text-xs font-mono font-semibold text-gray-700">
                      Quelle: {activeScenario.source}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">{activeScenario.title}</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{activeScenario.description}</p>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold">
                    <span>Max. sichere Expositionszeit:</span>
                    <span className="font-mono text-sm" style={{ color: activeScenario.color }}>
                      {activeScenario.maxExposure}
                    </span>
                  </div>
                </div>

                {/* Didactic Hair Cell Comparison Alert */}
                <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-950 rounded-xl space-y-1">
                  <strong className="block font-bold text-rose-900">🚨 Warum Lärmschäden irreversibel sind:</strong>
                  <p>
                    Haarsinneszellen im Innenohr sind hochdifferenzierte Sinneszellen, die sich nach der Geburt nicht mehr teilen. Einmal durch Lärm abgeknickte oder zerstörte Stereozilien wachsen niemals nach!
                  </p>
                </div>
              </div>

              {/* Right Column: Microscopic Corti-Organ & Speech Test */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span>Mikroskopie: Haarzellen im Corti-Organ</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    selectedDb >= 85 || hearingDamageFilter ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedDb >= 85 || hearingDamageFilter ? 'Zellschädigung aktiv' : 'Zellen intakt'}
                  </span>
                </h3>

                {/* MICROSCOPIC HAIR CELL SVG */}
                <div className="relative w-full aspect-[400/180] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden select-none">
                  <svg viewBox="0 0 400 180" className="w-full h-full">
                    {/* Tectorial Membrane (top roof) */}
                    <path d="M 30 40 Q 200 30, 370 40" fill="none" stroke="#60a5fa" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
                    <text x="40" y="32" fill="#93c5fd" fontSize="9" fontWeight="bold">Tektorialmembran (Deckschicht)</text>

                    {/* Basilar Membrane (bottom floor) */}
                    <line x1="30" y1="160" x2="370" y2="160" stroke="#059669" strokeWidth="8" strokeLinecap="round" />
                    <text x="40" y="174" fill="#6ee7b7" fontSize="9">Basilarmembran</text>

                    {/* 3 Hair Cells */}
                    {[80, 200, 320].map((baseX, i) => {
                      const isDamaged = selectedDb >= 85 || hearingDamageFilter;

                      return (
                        <g key={i} transform={`translate(${baseX}, 0)`}>
                          {/* Hair Cell Body */}
                          <rect
                            x="-22"
                            y="75"
                            width="44"
                            height="75"
                            rx="10"
                            fill={isDamaged ? '#fca5a5' : '#fed7aa'}
                            stroke={isDamaged ? '#ef4444' : '#f97316'}
                            strokeWidth="2"
                          />
                          {/* Cell Nucleus */}
                          <circle cx="0" cy="115" r="8" fill={isDamaged ? '#dc2626' : '#ea580c'} />

                          {/* Stereocilia (Sinneshärchen) at the top */}
                          {isDamaged ? (
                            /* Bent, broken, fused stereocilia */
                            <g stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="-12" y1="75" x2="-2" y2="55" />
                              <line x1="-4" y1="75" x2="10" y2="58" />
                              <line x1="4" y1="75" x2="16" y2="65" />
                              <line x1="12" y1="75" x2="20" y2="68" />
                            </g>
                          ) : (
                            /* Healthy, pristine upright stereocilia */
                            <g stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="-12" y1="75" x2="-12" y2="45" />
                              <line x1="-4" y1="75" x2="-4" y2="43" />
                              <line x1="4" y1="75" x2="4" y2="43" />
                              <line x1="12" y1="75" x2="12" y2="45" />
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-semibold bg-black/70 px-3 py-1 rounded-lg border border-white/10 text-slate-300">
                    <span>Stereozilien: <strong className={selectedDb >= 85 || hearingDamageFilter ? 'text-rose-400' : 'text-emerald-400'}>{selectedDb >= 85 || hearingDamageFilter ? 'ABGEKNICKT / DEFEKT' : 'AUFRECHT & INTAKT'}</strong></span>
                    <span>Regeneration: <strong className="text-amber-400">0 % (Dauerhafter Schaden)</strong></span>
                  </div>
                </div>

                {/* ─── LIVE SPRACHVERSTÄNDLICHKEITS-SIMULATION ─── */}
                <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">
                      Sprachverständlichkeits-Simulator (C5-Senke ab 3.500 Hz):
                    </span>
                    <button
                      onClick={() => {
                        if (isPlayingDamageAudio) stopDamageSimAudio();
                        else startDamageSimAudio();
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isPlayingDamageAudio
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isPlayingDamageAudio ? '⏹ Hörtest Stoppen' : '▶ Hörtest Starten'}
                    </button>
                  </div>

                  {/* Speech comparison box */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gesprochener Satz (Gesund):</span>
                      <p className="text-sm font-medium text-slate-200 font-mono">
                        „<strong className="text-emerald-300">F</strong>ün<strong className="text-emerald-300">f</strong> <strong className="text-emerald-300">sch</strong>ar<strong className="text-emerald-300">f</strong>e <strong className="text-emerald-300">F</strong>ich<strong className="text-emerald-300">t</strong>en <strong className="text-emerald-300">st</strong>ehen <strong className="text-emerald-300">s</strong>icher im <strong className="text-emerald-300">t</strong>ie<strong className="text-emerald-300">f</strong>en <strong className="text-emerald-300">F</strong>or<strong className="text-emerald-300">st</strong>.“
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-rose-400 font-bold uppercase block">
                        Wahrnehmung bei Hochton-Lärmschaden:
                      </span>
                      <p className="text-sm font-medium text-rose-200 font-mono">
                        „{hearingDamageFilter ? '..ün.. ..ar.e .i..ten .tehen .i..er im tie.en .or.t.' : '„Fünf scharfe Fichten stehen sicher im tiefen Forst.“'}“
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    💡 <strong>Aha-Effekt:</strong> Vokale („u“, „e“, „o“) sind tieffrequent und bleiben laut. Aber Konsonanten und Zischlaute („s“, „f“, „sch“, „t“) liegen im Hochtonbereich. Werden sie durch Lärm zerstört, hört der Patient zwar Laute, kann Wörter aber nicht mehr voneinander unterscheiden!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 5: FEHLKONZEPT-QUIZ & GLOSSAR                                */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Station 5
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Fehlkonzept-Trainer & Fachbegriff-Glossar
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  6 didaktisch geschärfte Aufgaben nach LehrplanPLUS Bayern (B8 2) mit durchmischten Antworten zu den typischen Verständnishürden (Druckverstärkung, Tonotopie, rundes Fenster & Lärmschutz).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-gray-700">
                  Punkte:{' '}
                  <span className="font-mono text-emerald-700 text-sm font-bold">
                    {Object.keys(quizAnswers).filter(qId => {
                      const q = QUIZ_QUESTIONS.find(item => item.id === parseInt(qId));
                      return q && q.options[quizAnswers[parseInt(qId)]]?.isCorrect;
                    }).length}{' '}
                    / {QUIZ_QUESTIONS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quiz Questions List */}
            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q) => {
                const selectedOptIndex = quizAnswers[q.id];
                const isAnswered = selectedOptIndex !== undefined;
                const isCorrect = isAnswered && q.options[selectedOptIndex]?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                      !isAnswered
                        ? 'border-forest-100'
                        : isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-amber-300 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                            {q.curriculumBadge}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">Frage {q.id} von {QUIZ_QUESTIONS.length}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                      {q.options.map((opt, oIdx) => {
                        const isThisSelected = selectedOptIndex === oIdx;
                        let btnStyle = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100';

                        if (isAnswered) {
                          if (opt.isCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold';
                          } else if (isThisSelected) {
                            btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                          } else {
                            btnStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isAnswered}
                            onClick={() => {
                              setQuizAnswers({ ...quizAnswers, [q.id]: oIdx });
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all leading-relaxed ${btnStyle}`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)})</span>
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Misconception Alert */}
                    {isAnswered && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                        <div className={`p-3 rounded-xl ${isCorrect ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                          <strong>{isCorrect ? '✅ Richtig!' : '❌ Nicht ganz:'}</strong> {q.options[selectedOptIndex].feedback}
                        </div>

                        {q.misconceptionAlert && (
                          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2">
                            <IconAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Didaktischer Merksatz:</strong> {q.misconceptionAlert}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* GLOSSARY SECTION */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    📚 Fachbegriff-Glossar: Akustik & Gehör (LehrplanPLUS B8 2)
                  </h3>
                  <p className="text-xs text-gray-500">Zentrale Fachbegriffe für Schulaufgabe & Referat</p>
                </div>
                <input
                  type="text"
                  placeholder="Begriff filtern..."
                  value={activeGlossaryFilter}
                  onChange={(e) => setActiveGlossaryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-forest-500 max-w-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GLOSSARY.filter(g => g.term.toLowerCase().includes(activeGlossaryFilter.toLowerCase()) || g.definition.toLowerCase().includes(activeGlossaryFilter.toLowerCase())).map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-forest-50/50 rounded-xl border border-forest-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-forest-900 text-sm">{item.term}</strong>
                      <span className="text-[10px] text-forest-600 bg-forest-100 px-2 py-0.5 rounded font-medium">
                        {item.curriculumReference}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="w-full py-4 border-t border-forest-200/60 bg-white/70 backdrop-blur-sm mt-auto text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Johannes-Scharrer-Gymnasium • Biologie Klasse 8 (B8 2)</span>
          <span>Entwickelt für gymnasialen Unterricht nach LehrplanPLUS Bayern</span>
        </div>
      </footer>
    </div>
  );
}
