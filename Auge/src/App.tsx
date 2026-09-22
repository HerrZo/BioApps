import React, { useState, useEffect, useMemo } from 'react';
import { EYE_STRUCTURES, QUIZ_QUESTIONS, GLOSSARY, EyeStructure } from './data';

// --- ICONS ---
const IconEye = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconGlasses = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="14" r="4" />
    <circle cx="18" cy="14" r="4" />
    <path d="M10 14h4" />
    <path d="M2 12l2-6h2" />
    <path d="M22 12l-2-6h-2" />
  </svg>
);

const IconSun = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const IconCheck = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconAlert = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconZoom = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const IconFlame = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
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

  useEffect(() => {
    const onThemeChange = (e: any) => {
      if (e?.detail?.isDark !== undefined) {
        setDarkMode(e.detail.isDark);
      }
    };
    window.addEventListener('bioApps_theme_change', onThemeChange);
    return () => window.removeEventListener('bioApps_theme_change', onThemeChange);
  }, []);

  // Navigation
  const [activeTab, setActiveTab] = useState<'anatomie' | 'optik' | 'fehlsichtig' | 'adaption' | 'quiz'>('anatomie');

  // --- STATION 1: ANATOMIE & AKKOMMODATION ---
  const [selectedStructureId, setSelectedStructureId] = useState<string>('linse');
  const [distanceMeters, setDistanceMeters] = useState<number>(0.25); // 0.15m (15cm) to 10m
  const [trainerMode, setTrainerMode] = useState<boolean>(false);
  const [trainerAnswers, setTrainerAnswers] = useState<Record<string, string>>({});
  const [trainerSubmitted, setTrainerSubmitted] = useState<boolean>(false);

  // --- STATION 2: STRAHLENOPTIK & BILDENTSTEHUNG ---
  const [opticsMode, setOpticsMode] = useState<'candle' | 'parallel'>('candle');
  const [candleDist, setCandleDist] = useState<number>(180); // Distance of candle from cornea (80 to 280)
  const [accommodateState, setAccommodateState] = useState<number>(0.5); // 0 = far accommodated, 1 = near accommodated
  const [autoFocus, setAutoFocus] = useState<boolean>(true);
  const [brainInversion, setBrainInversion] = useState<boolean>(false);

  // --- STATION 3: FEHLSICHTIGKEITEN & OPTIKER-WERKSTATT ---
  const [eyeCondition, setEyeCondition] = useState<'normal' | 'myopie' | 'hyperopie'>('myopie');
  const [withGlasses, setWithGlasses] = useState<boolean>(false);
  const [lensType, setLensType] = useState<'concave' | 'convex'>('concave');
  const [diopters, setDiopters] = useState<number>(-2.5);

  // --- STATION 4: ADAPTION & FOTOREZEPTOREN ---
  const [luxLevel, setLuxLevel] = useState<number>(500); // 0.1 (dark) to 100000 (bright sun)
  const [zoomRetinaType, setZoomRetinaType] = useState<'zapfen' | 'staebchen'>('zapfen');

  // --- STATION 5: QUIZ ---
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [activeGlossaryFilter, setActiveGlossaryFilter] = useState<string>('');

  const selectedStructure = useMemo(() => {
    return EYE_STRUCTURES.find(s => s.id === selectedStructureId) || EYE_STRUCTURES[4];
  }, [selectedStructureId]);

  // Derived values for accommodation in Station 1
  const distanceFactor = useMemo(() => {
    const minD = 0.15;
    const maxD = 10;
    const clamped = Math.max(minD, Math.min(maxD, distanceMeters));
    return 1 - (Math.log10(clamped) - Math.log10(minD)) / (Math.log10(maxD) - Math.log10(minD));
  }, [distanceMeters]);

  // ─── EXACT GEOMETRIC OPTICS FOR STATION 2 ───
  // In Station 2 SVG (viewBox 0 0 720 300):
  // Optical Axis: y = 150
  // Lens Plane: lensX = 400
  // Retina Wall: retinaX = 580
  // Fixed distance from lens to retina: b0 = 580 - 400 = 180 px
  const lensX = 400;
  const retinaX = 580;
  const b0 = 180;

  // Candle object geometry:
  // candleX = 380 - candleDist
  // Object distance to lens plane: g = 400 - candleX = 20 + candleDist
  const candleX = 380 - candleDist;
  const g = lensX - candleX; // 100 to 300
  const candleFlameTopY = 75; // flame tip
  const H_obj = 150 - candleFlameTopY; // 75 px

  // Required focal length f_req for candle at distance g to focus on retina at b0 = 180:
  // 1/f_req = 1/g + 1/b0 => f_req = (g * 180) / (g + 180)
  const fReq = useMemo(() => {
    return (g * b0) / (g + b0);
  }, [g, b0]);

  // When autoFocus is active, keep accommodateState in sync
  useEffect(() => {
    if (autoFocus) {
      if (opticsMode === 'parallel') {
        setAccommodateState(0); // Relaxed for distant parallel light
      } else {
        // g ranges from 100 to 300. fReq ranges from ~64.3 to 112.5.
        const acc = Math.max(0, Math.min(1, (112.5 - fReq) / (112.5 - 64.3)));
        setAccommodateState(acc);
      }
    }
  }, [candleDist, autoFocus, opticsMode, fReq]);

  // Actual focal length of the eye f_actual:
  const fActual = useMemo(() => {
    if (opticsMode === 'parallel') {
      // Resting eye: f = 180 px (focus exactly on retina)
      // Accommodation pulls focus forward
      return 180 - accommodateState * 40;
    }
    if (autoFocus) {
      return fReq;
    }
    // Manual: 0 = flat (112.5 px), 1 = thick (64.3 px)
    return 112.5 - accommodateState * (112.5 - 64.3);
  }, [opticsMode, autoFocus, fReq, accommodateState]);

  // Image distance b_actual from lens to focus point:
  // 1/b = 1/f - 1/g => b = (g * f) / (g - f)
  const bActual = useMemo(() => {
    if (opticsMode === 'parallel') {
      return fActual;
    }
    if (g <= fActual) return 999;
    return (g * fActual) / (g - fActual);
  }, [opticsMode, g, fActual]);

  // Coordinates of ray convergence / Bildpunkt:
  const focusX = useMemo(() => {
    return lensX + bActual;
  }, [lensX, bActual]);

  const focusY = useMemo(() => {
    if (opticsMode === 'parallel') {
      return 150; // on optical axis
    }
    // Inverted image height: H_img = H_obj * (b / g)
    return 150 + (H_obj * bActual) / g;
  }, [opticsMode, H_obj, bActual, g]);

  // Blur on retina based on distance from actual focus to retina (retinaX = 580):
  const blurAmount = useMemo(() => {
    const delta = Math.abs(focusX - retinaX);
    return Math.min(15, delta * 0.18);
  }, [focusX, retinaX]);

  // Station 3: Glasses calculation
  const conditionRetinaX = eyeCondition === 'myopie' ? 485 : eyeCondition === 'hyperopie' ? 415 : 450;
  const glassesEffect = withGlasses ? (lensType === 'concave' ? diopters * 14 : diopters * 14) : 0;
  const actualOpticFocusX = 450 - glassesEffect;
  const conditionBlur = Math.abs(actualOpticFocusX - conditionRetinaX);
  const isPerfectPrescription = conditionBlur < 6;

  // Station 4: Pupil diameter based on lux
  const pupilRadius = useMemo(() => {
    const logLux = Math.max(-1, Math.min(5, Math.log10(luxLevel)));
    const normalized = (logLux + 1) / 6;
    return 48 - normalized * 32;
  }, [luxLevel]);

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
                <IconEye className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white flex items-center gap-2">
                  Das Auge – Akkommodation & Optik
                  <span className="text-[10px] uppercase tracking-wider bg-forest-700 text-forest-100 px-2 py-0.5 rounded-full font-semibold border border-forest-600">
                    Bio 8
                  </span>
                </h1>
                <p className="text-xs text-forest-300 hidden md:block">
                  LehrplanPLUS Bayern (B8 2) • Bildentstehung, Ziliarmuskel-Mechanismus, Fehlsichtigkeiten & Adaption
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-dark-toggle
              onClick={(e) => {
                e.stopPropagation();
                setDarkMode(prev => !prev);
              }}
              aria-label={darkMode ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
              title={darkMode ? 'Helles Design' : 'Dunkles Design'}
              className="p-2 rounded-xl text-forest-200 hover:text-white hover:bg-forest-800 transition-colors flex items-center justify-center text-lg active:scale-95 cursor-pointer"
            >
              <span className="dark-mode-icon">{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>

        {/* ─── TAB NAVIGATION ─── */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-forest-800/80 text-sm font-medium">
          <button
            onClick={() => setActiveTab('anatomie')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'anatomie'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconZoom className="w-4 h-4 text-emerald-400" />
            <span>1. Anatomie & Akkommodation</span>
          </button>

          <button
            onClick={() => setActiveTab('optik')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'optik'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconFlame className="w-4 h-4 text-amber-400" />
            <span>2. Ray-Tracing & Bildentstehung</span>
          </button>

          <button
            onClick={() => setActiveTab('fehlsichtig')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'fehlsichtig'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconGlasses className="w-4 h-4 text-sky-400" />
            <span>3. Optiker-Werkstatt</span>
          </button>

          <button
            onClick={() => setActiveTab('adaption')}
            className={`px-3 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'adaption'
                ? 'border-emerald-400 text-white font-semibold bg-forest-800/60'
                : 'border-transparent text-forest-300 hover:text-forest-100 hover:bg-forest-800/30'
            }`}
          >
            <IconSun className="w-4 h-4 text-yellow-400" />
            <span>4. Adaption & Rezeptoren</span>
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
        {/* STATION 1: ANATOMIE & AKKOMMODATION MIT ZILIARKÖRPER-LUPE            */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'anatomie' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Station 1
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Anatomie des Auges & das Akkommodations-Paradoxon
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Erkunde den anatomischen Querschnitt des Auges. Nutze den Schieberegler für die Gegenstandsentfernung, um das kontraintuitive Zusammenspiel von <strong>Ziliarmuskel</strong>, <strong>Zonulafasern</strong> und <strong>Augenlinse</strong> in der Detail-Lupe zu verstehen.
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
                  👁️ Erkunden & Lupe
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
              {/* Left Column: Anatomical Cross-Section (SVG) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <span>Horizontalschnitt des rechten Auges</span>
                    <span className="text-xs font-normal text-gray-500">(Klicke auf Strukturen zum Erkunden)</span>
                  </h3>
                  <span className="text-xs bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full font-medium border border-forest-200">
                    Blick von oben
                  </span>
                </div>

                {/* SVG DIAGRAM */}
                <div className="relative w-full aspect-[480/320] bg-slate-50/70 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                  <svg
                    viewBox="0 0 480 320"
                    className="w-full h-full select-none"
                    style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))' }}
                  >
                    <defs>
                      <radialGradient id="vitreousGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.95" />
                      </radialGradient>
                    </defs>

                    {/* Optic axis line */}
                    <line x1="40" y1="160" x2="440" y2="160" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 4" />

                    {/* 1. SEHNERV */}
                    <g
                      className="cursor-pointer transition-opacity"
                      onClick={() => !trainerMode && setSelectedStructureId('sehnerv')}
                    >
                      <path
                        d="M 390 190 L 460 210 L 450 235 L 380 215 Z"
                        fill="#fca5a5"
                        stroke="#ef4444"
                        strokeWidth={selectedStructureId === 'sehnerv' ? 3 : 1.5}
                      />
                      <line x1="395" y1="200" x2="455" y2="220" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2 2" />
                    </g>

                    {/* 2. SKLERA (Lederhaut) */}
                    <path
                      d="M 140 70 C 230 40, 350 70, 400 150 C 420 185, 410 230, 390 250 C 340 285, 230 280, 140 250"
                      fill="none"
                      stroke={selectedStructureId === 'lederhaut' ? '#3b82f6' : '#94a3b8'}
                      strokeWidth={selectedStructureId === 'lederhaut' ? 14 : 10}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('lederhaut')}
                    />

                    {/* 3. ADERHAUT (Chorioidea) */}
                    <path
                      d="M 145 76 C 230 50, 345 78, 393 150 C 412 182, 403 224, 384 243 C 336 276, 230 272, 145 244"
                      fill="none"
                      stroke={selectedStructureId === 'aderhaut' ? '#dc2626' : '#b91c1c'}
                      strokeWidth={selectedStructureId === 'aderhaut' ? 8 : 5}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('aderhaut')}
                    />

                    {/* 4. NETZHAUT (Retina) */}
                    <path
                      d="M 160 88 C 235 65, 340 90, 385 152 C 400 178, 395 215, 378 232 C 330 262, 235 258, 160 232"
                      fill="none"
                      stroke={selectedStructureId === 'netzhaut' ? '#eab308' : '#fde047'}
                      strokeWidth={selectedStructureId === 'netzhaut' ? 8 : 5}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('netzhaut')}
                    />

                    {/* 5. GLASKÖRPER */}
                    <path
                      d="M 165 92 C 235 70, 335 95, 380 155 C 395 180, 390 210, 374 228 C 330 255, 235 252, 165 228 C 175 195, 175 125, 165 92 Z"
                      fill="url(#vitreousGrad)"
                      stroke={selectedStructureId === 'glaskoerper' ? '#059669' : '#a7f3d0'}
                      strokeWidth={selectedStructureId === 'glaskoerper' ? 3 : 1}
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('glaskoerper')}
                    />

                    {/* 6. GELBER FLECK (Fovea) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('gelber_fleck')}
                    >
                      <circle
                        cx="386"
                        cy="160"
                        r={selectedStructureId === 'gelber_fleck' ? 9 : 6}
                        fill="#eab308"
                        stroke="#ca8a04"
                        strokeWidth="2"
                      />
                      <circle cx="386" cy="160" r="2.5" fill="#ffffff" />
                    </g>

                    {/* 7. BLINDER FLECK */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('blinder_fleck')}
                    >
                      <rect
                        x="378"
                        y="198"
                        width="16"
                        height="18"
                        rx="4"
                        fill="#cbd5e1"
                        stroke={selectedStructureId === 'blinder_fleck' ? '#475569' : '#94a3b8'}
                        strokeWidth="2"
                      />
                      <line x1="381" y1="207" x2="391" y2="207" stroke="#64748b" strokeWidth="2" />
                    </g>

                    {/* 8. VORDERE AUGENKAMMER & HORNHAUT */}
                    <path
                      d="M 140 70 C 80 100, 80 220, 140 250 C 130 220, 130 100, 140 70 Z"
                      fill="#e0f2fe"
                      opacity="0.85"
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('vordere_kammer')}
                    />
                    <path
                      d="M 140 70 C 75 105, 75 215, 140 250"
                      fill="none"
                      stroke={selectedStructureId === 'hornhaut' ? '#0284c7' : '#38bdf8'}
                      strokeWidth={selectedStructureId === 'hornhaut' ? 8 : 5}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('hornhaut')}
                    />

                    {/* 9. ZILIARMUSKEL */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('ziliarmuskel')}
                    >
                      <path
                        d={`M 140 70 Q 155 75, 168 ${78 + distanceFactor * 6} Q 155 92, 140 85 Z`}
                        fill={selectedStructureId === 'ziliarmuskel' ? '#ea580c' : '#f97316'}
                        stroke="#c2410c"
                        strokeWidth="2"
                      />
                      <path
                        d={`M 140 250 Q 155 245, 168 ${242 - distanceFactor * 6} Q 155 228, 140 235 Z`}
                        fill={selectedStructureId === 'ziliarmuskel' ? '#ea580c' : '#f97316'}
                        stroke="#c2410c"
                        strokeWidth="2"
                      />
                    </g>

                    {/* 10. IRIS */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('iris')}
                    >
                      <path
                        d="M 145 82 L 158 128 L 152 130 L 140 85 Z"
                        fill={selectedStructureId === 'iris' ? '#047857' : '#10b981'}
                        stroke="#065f46"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 145 238 L 158 192 L 152 190 L 140 235 Z"
                        fill={selectedStructureId === 'iris' ? '#047857' : '#10b981'}
                        stroke="#065f46"
                        strokeWidth="1.5"
                      />
                    </g>

                    {/* PUPILLE */}
                    <line
                      x1="156"
                      y1="130"
                      x2="156"
                      y2="190"
                      stroke={selectedStructureId === 'pupille' ? '#0f172a' : '#475569'}
                      strokeWidth={selectedStructureId === 'pupille' ? 3 : 1}
                      strokeDasharray="3 3"
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('pupille')}
                    />

                    {/* 11. ZONULAFASERN */}
                    <g
                      className="cursor-pointer"
                      onClick={() => !trainerMode && setSelectedStructureId('zonulafasern')}
                    >
                      {distanceFactor > 0.6 ? (
                        <path
                          d={`M 166 ${84 + distanceFactor * 6} Q 163 100, 166 112 Q 170 120, 168 126`}
                          fill="none"
                          stroke={selectedStructureId === 'zonulafasern' ? '#d97706' : '#fbbf24'}
                          strokeWidth="2"
                        />
                      ) : (
                        <line
                          x1="166"
                          y1={84 + distanceFactor * 6}
                          x2="168"
                          y2="126"
                          stroke={selectedStructureId === 'zonulafasern' ? '#d97706' : '#fbbf24'}
                          strokeWidth="2"
                        />
                      )}

                      {distanceFactor > 0.6 ? (
                        <path
                          d={`M 166 ${236 - distanceFactor * 6} Q 163 220, 166 208 Q 170 200, 168 194`}
                          fill="none"
                          stroke={selectedStructureId === 'zonulafasern' ? '#d97706' : '#fbbf24'}
                          strokeWidth="2"
                        />
                      ) : (
                        <line
                          x1="166"
                          y1={236 - distanceFactor * 6}
                          x2="168"
                          y2="194"
                          stroke={selectedStructureId === 'zonulafasern' ? '#d97706' : '#fbbf24'}
                          strokeWidth="2"
                        />
                      )}
                    </g>

                    {/* 12. AUGENLINSE */}
                    <ellipse
                      cx="168"
                      cy="160"
                      rx={8 + distanceFactor * 9}
                      ry={35 - distanceFactor * 3}
                      fill="#ecfdf5"
                      stroke={selectedStructureId === 'linse' ? '#059669' : '#34d399'}
                      strokeWidth={selectedStructureId === 'linse' ? 4 : 2}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => !trainerMode && setSelectedStructureId('linse')}
                    />

                    {/* MARKERS */}
                    {!trainerMode && (
                      <>
                        {EYE_STRUCTURES.map((s) => {
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

                    {/* TRAINER MODE MARKERS */}
                    {trainerMode && (
                      <>
                        {EYE_STRUCTURES.slice(0, 10).map((s, idx) => {
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
                    {EYE_STRUCTURES.map((s) => (
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
              <div className="lg:col-span-5 space-y-4">
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
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedStructure.color }}></span>
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
                          <strong>Wichtiger Lehrplan-Hinweis:</strong> {selectedStructure.didacticNote}
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
                      {EYE_STRUCTURES.slice(0, 10).map((s, idx) => (
                        <div key={s.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg text-xs">
                          <span className="font-bold text-gray-700 w-6">#{idx + 1}</span>
                          <select
                            value={trainerAnswers[s.id] || ''}
                            onChange={(e) => setTrainerAnswers({ ...trainerAnswers, [s.id]: e.target.value })}
                            disabled={trainerSubmitted}
                            className="flex-1 p-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-forest-500"
                          >
                            <option value="">-- Wähle Struktur --</option>
                            {EYE_STRUCTURES.slice(0, 10).map(opt => (
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

                {/* ─── DETAIL-LUPE: ZILIARKÖRPER-MECHANISMUS ─── */}
                <div className="bg-gradient-to-br from-forest-900 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-forest-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <IconZoom className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-white">
                        Detail-Lupe: Ziliarkörper & Akkommodation
                      </h4>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      distanceFactor > 0.5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}>
                      {distanceFactor > 0.5 ? 'Nahsicht (Akkommodiert)' : 'Fernsicht (Ruhezustand)'}
                    </span>
                  </div>

                  {/* Distance Slider */}
                  <div className="space-y-1.5 bg-forest-950/60 p-3 rounded-xl border border-forest-800">
                    <div className="flex justify-between text-xs font-semibold text-forest-200">
                      <span>Gegenstandsentfernung:</span>
                      <span className="text-emerald-400 font-mono">
                        {distanceMeters >= 1 ? `${distanceMeters.toFixed(1)} m` : `${Math.round(distanceMeters * 100)} cm`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.15"
                      max="10"
                      step="0.05"
                      value={distanceMeters}
                      onChange={(e) => setDistanceMeters(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-forest-400">
                      <span>Nahpunkt (15 cm)</span>
                      <span>Lesen (25 cm)</span>
                      <span>Bildschirm (60 cm)</span>
                      <span>Ferne (10 m)</span>
                    </div>
                  </div>

                  {/* Enlarged Ciliary Body SVG Zoom */}
                  <div className="relative w-full aspect-[280/140] bg-slate-950 rounded-xl border border-forest-700/60 overflow-hidden flex items-center justify-center p-2">
                    <svg viewBox="0 0 280 140" className="w-full h-full">
                      <pattern id="zoomGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="10" y2="0" stroke="#1e293b" strokeWidth="0.5" />
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#1e293b" strokeWidth="0.5" />
                      </pattern>
                      <rect width="280" height="140" fill="url(#zoomGrid)" />

                      <path d="M 10 20 Q 140 10, 270 20" fill="none" stroke="#64748b" strokeWidth="8" />

                      {/* ZILIARMUSKEL in Zoom */}
                      <path
                        d={`M 50 24 Q 90 ${32 + distanceFactor * 16}, 130 ${38 + distanceFactor * 22} Q 80 50, 50 24 Z`}
                        fill="#ea580c"
                        stroke="#f97316"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <text x="60" y="38" fontSize="9" fill="#ffedd5" fontWeight="bold">
                        Ziliarmuskel
                      </text>

                      {/* ZONULAFASERN in Zoom */}
                      {distanceFactor > 0.6 ? (
                        <g stroke="#fbbf24" strokeWidth="2.5" fill="none">
                          <path d={`M 125 ${38 + distanceFactor * 22} Q 140 70, 155 76 Q 170 82, 185 82`} strokeDasharray="2 1" />
                          <path d={`M 115 ${35 + distanceFactor * 20} Q 135 65, 150 72 Q 165 78, 180 78`} strokeDasharray="2 1" />
                        </g>
                      ) : (
                        <g stroke="#fbbf24" strokeWidth="2.5">
                          <line x1={`125`} y1={38 + distanceFactor * 22} x2="185" y2="82" />
                          <line x1={`115`} y1={35 + distanceFactor * 20} x2="180" y2="78" />
                        </g>
                      )}

                      {/* LINSENÄQUATOR in Zoom */}
                      <ellipse
                        cx="220"
                        cy="110"
                        rx={25 + distanceFactor * 22}
                        ry={45}
                        fill="#10b981"
                        fillOpacity="0.3"
                        stroke="#34d399"
                        strokeWidth="3"
                        className="transition-all duration-300"
                      />
                      <text x="200" y="115" fontSize="10" fill="#a7f3d0" fontWeight="bold">
                        Linse
                      </text>
                    </svg>

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                      <div>
                        Muskel:{' '}
                        <span className={distanceFactor > 0.5 ? 'text-amber-400 font-bold' : 'text-sky-300'}>
                          {distanceFactor > 0.5 ? 'ANGESTRENGT KONTRAHIERT' : 'ENTSPANNT (Ruhe)'}
                        </span>
                      </div>
                      <div>
                        Fasern:{' '}
                        <span className={distanceFactor > 0.5 ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                          {distanceFactor > 0.5 ? 'LOCKER / ERSCHLAFFT' : 'STRAFF GESPANNT'}
                        </span>
                      </div>
                      <div>
                        Brechkraft:{' '}
                        <span className="text-emerald-300 font-mono">
                          ~{(19 + distanceFactor * 14).toFixed(0)} dpt
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                    <span className="font-bold text-amber-300">💡 Das Akkommodations-Paradoxon:</span> Beim Lesen spannt sich der Ziliarmuskel aktiv an. Dadurch wird der Ringdurchmesser <em>kleiner</em>, die Zonulafasern <em>erschlaffen</em> und die Linse kugelt sich aufgrund ihrer <em>Eigenelastizität</em> ab. Langes Lesen ermüdet, weil der Ziliarmuskel Dauerarbeit leistet!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 2: ECHTZEIT-RAY-TRACING & BILDENTSTEHUNG                     */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'optik' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Station 2
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Echtzeit-Ray-Tracing & geometrische Bildentstehung
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Verfolge den Strahlengang des Lichts (Parallelstrahl, Mittelpunktstrahl, Brennpunktstrahl) von einer brennenden Kerze bis zur Netzhaut. Beobachte, wie die Lichtstrahlen im scharfen Zustand <strong>exakt auf der Netzhaut</strong> konvergieren!
                </p>
              </div>

              {/* Inversion Toggle */}
              <button
                onClick={() => setBrainInversion(!brainInversion)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                  brainInversion
                    ? 'bg-purple-800 text-white border-purple-900 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>🧠 Gehirn-Korrektur:</span>
                <span className="font-bold">{brainInversion ? 'Aufrecht (Großhirn)' : 'Netzhaut (Kopfüber)'}</span>
              </button>
            </div>

            {/* Interactive Ray Tracing Canvas */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                {/* Ray Legend */}
                {opticsMode === 'candle' ? (
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-red-500 rounded"></span> Parallelstrahl
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-blue-500 rounded"></span> Mittelpunktsstrahl
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-emerald-500 rounded"></span> Brennpunktstrahl
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <span className="w-3 h-0.5 bg-red-500 rounded"></span> Parallele Fernlicht-Strahlen (vereinigen sich im Brennpunkt F' auf der Netzhaut)
                  </div>
                )}

                {/* Mode Selectors */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
                    <button
                      onClick={() => setOpticsMode('candle')}
                      className={`px-2.5 py-1 rounded font-semibold transition-all ${
                        opticsMode === 'candle' ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600'
                      }`}
                    >
                      🕯️ Kerze (Divergent)
                    </button>
                    <button
                      onClick={() => setOpticsMode('parallel')}
                      className={`px-2.5 py-1 rounded font-semibold transition-all ${
                        opticsMode === 'parallel' ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600'
                      }`}
                    >
                      ☀️ Fernlicht (Parallel)
                    </button>
                  </div>

                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer ml-2">
                    <input
                      type="checkbox"
                      checked={autoFocus}
                      onChange={(e) => setAutoFocus(e.target.checked)}
                      className="rounded text-forest-600 focus:ring-forest-500"
                    />
                    <span>Auto-Fokus</span>
                  </label>
                </div>
              </div>

              {/* RAY-TRACING SVG */}
              <div className="relative w-full aspect-[720/300] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden select-none">
                <svg viewBox="0 0 720 300" className="w-full h-full">
                  <defs>
                    <radialGradient id="flameGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="60%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                    </radialGradient>
                    <filter id="flameBlur" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="2" />
                    </filter>
                  </defs>

                  {/* Optical Axis */}
                  <line x1="20" y1="150" x2="680" y2="150" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

                  {/* EYE SCHEMATIC */}
                  {/* Eyeball contour */}
                  <path
                    d="M 380 70 C 460 40, 560 60, 600 150 C 560 240, 460 260, 380 230"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3"
                  />
                  {/* Cornea */}
                  <path
                    d="M 380 70 C 340 100, 340 200, 380 230"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Lens (Phakos) at x = 400 */}
                  <ellipse
                    cx="400"
                    cy="150"
                    rx={6 + accommodateState * 8}
                    ry="45"
                    fill="#34d399"
                    fillOpacity="0.25"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />

                  {/* Retina wall at x = 580 */}
                  <path
                    d="M 580 80 C 610 120, 610 180, 580 220"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <text x="592" y="154" fill="#fde047" fontSize="10" fontWeight="bold">
                    Netzhaut
                  </text>

                  {/* MODE A: CANDLE OBJECT & RAYS */}
                  {opticsMode === 'candle' && (() => {
                    const candleHeight = 50;
                    const candleTopY = 150 - candleHeight; // 100
                    const candleFlameTopY = 75;

                    // Slopes & Intersection calculations
                    // Parallel ray slope after lens:
                    const slopePar = (150 - candleFlameTopY) / fActual;
                    const parRetinaY = candleFlameTopY + slopePar * (retinaX - lensX);

                    // Central ray slope:
                    const slopeCen = (150 - candleFlameTopY) / g;
                    const cenRetinaY = 150 + slopeCen * (retinaX - lensX);

                    // Focal ray: after lens runs horizontally at focusY
                    const focRetinaY = focusY;

                    // Inverted candle dimensions on retina
                    const imgHeight = Math.max(10, Math.min(80, (candleHeight * bActual) / g));
                    const imgBaseY = 150;
                    const imgFlameTipY = 150 + (H_obj * bActual) / g;

                    const isSharp = blurAmount < 2.0;

                    return (
                      <g>
                        {/* Candle Body */}
                        <rect x={candleX - 8} y={candleTopY} width="16" height={candleHeight} fill="#f8fafc" rx="2" stroke="#94a3b8" />
                        <line x1={candleX} y1={candleTopY} x2={candleX} y2={candleTopY - 6} stroke="#475569" strokeWidth="2" />

                        {/* Candle Flame */}
                        <path
                          d={`M ${candleX} ${candleFlameTopY} Q ${candleX + 7} ${candleTopY - 10}, ${candleX} ${candleTopY - 5} Q ${candleX - 7} ${candleTopY - 10}, ${candleX} ${candleFlameTopY} Z`}
                          fill="url(#flameGrad)"
                          className="animate-flame"
                        />
                        <circle cx={candleX} cy={candleTopY - 12} r="12" fill="#fbbf24" opacity="0.15" filter="url(#flameBlur)" />

                        {/* --- RAYS --- */}
                        {/* 1. Parallel Ray (Red): Horizontal to lens, then through rear focal point and image point */}
                        <path
                          d={`M ${candleX} ${candleFlameTopY} L ${lensX} ${candleFlameTopY} L ${retinaX} ${parRetinaY}`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          className="animate-ray"
                        />

                        {/* 2. Central Ray (Blue): Straight through lens center */}
                        <path
                          d={`M ${candleX} ${candleFlameTopY} L ${retinaX} ${cenRetinaY}`}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          className="animate-ray"
                        />

                        {/* 3. Focal Ray (Green): Through front focal point, then parallel to axis */}
                        <path
                          d={`M ${candleX} ${candleFlameTopY} L ${lensX} ${focusY} L ${retinaX} ${focRetinaY}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          className="animate-ray"
                        />

                        {/* LENS REAR FOCAL POINT F' ON OPTICAL AXIS */}
                        <g>
                          <circle cx={lensX + fActual} cy="150" r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                          <text x={lensX + fActual - 8} y="142" fill="#fb923c" fontSize="9" fontWeight="bold">
                            F'
                          </text>
                        </g>

                        {/* CONVERGENCE POINT (BILDPUNKT / FOKUS DER STRAHLEN) */}
                        <g>
                          <circle
                            cx={focusX}
                            cy={focusY}
                            r="5"
                            fill={isSharp ? '#22c55e' : '#f59e0b'}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={Math.min(580, focusX - 40)}
                            y={focusY + 18}
                            fill={isSharp ? '#4ade80' : '#fbbf24'}
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {isSharp ? 'Scharfer Fokus (Netzhaut)' : focusX < retinaX ? 'Fokus VOR Netzhaut' : 'Fokus HINTER Netzhaut'}
                          </text>
                        </g>

                        {/* INVERTED IMAGE ON RETINA */}
                        <g opacity={Math.max(0.2, 1 - blurAmount / 8)}>
                          {/* Inverted candle on retina wall */}
                          <rect
                            x={retinaX - 4}
                            y={imgBaseY}
                            width="8"
                            height={Math.max(6, imgHeight - 16)}
                            fill="#f8fafc"
                            stroke="#94a3b8"
                          />
                          <line
                            x1={retinaX}
                            y1={imgBaseY + imgHeight - 16}
                            x2={retinaX}
                            y2={imgBaseY + imgHeight - 10}
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                          <path
                            d={`M ${retinaX} ${imgFlameTipY} Q ${retinaX + 4} ${imgBaseY + imgHeight - 12}, ${retinaX} ${imgBaseY + imgHeight - 8} Q ${retinaX - 4} ${imgBaseY + imgHeight - 12}, ${retinaX} ${imgFlameTipY} Z`}
                            fill="url(#flameGrad)"
                          />
                        </g>
                      </g>
                    );
                  })()}

                  {/* MODE B: PARALLEL DISTANT LIGHT RAYS */}
                  {opticsMode === 'parallel' && (() => {
                    const raysY = [105, 125, 175, 195];
                    const isSharp = Math.abs(focusX - retinaX) < 4;

                    return (
                      <g>
                        {raysY.map((y, idx) => (
                          <path
                            key={idx}
                            d={`M 40 ${y} L ${lensX} ${y} L ${focusX} 150`}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                            className="animate-ray"
                          />
                        ))}

                        {/* Brennpunkt F' indicator */}
                        <circle
                          cx={focusX}
                          cy="150"
                          r="6"
                          fill={isSharp ? '#22c55e' : '#f59e0b'}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={focusX - 35}
                          y="172"
                          fill={isSharp ? '#4ade80' : '#fbbf24'}
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {isSharp ? 'Brennpunkt F\' exakt auf Netzhaut' : 'Brennpunkt VOR Netzhaut'}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Sliders & Monitors Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Distance & Accommodation Controls */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 text-xs">
                  {opticsMode === 'candle' ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-semibold text-gray-800">
                        <span>Kerzenabstand zum Auge:</span>
                        <span className="font-mono text-forest-700">{candleDist} px ({((candleDist / 280) * 10).toFixed(1)} m)</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="280"
                        value={candleDist}
                        onChange={(e) => setCandleDist(parseInt(e.target.value))}
                        className="w-full accent-forest-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Nahsicht (80 px)</span>
                        <span>Mittlere Entfernung</span>
                        <span>Fernsicht (280 px)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900">
                      <strong>Modus Paralleles Fernlicht:</strong> Das Licht stammt von einem sehr weit entfernten Objekt (Sonne, Berggipfel im Unendlichen). Parallele Lichtstrahlen schneiden sich im entspannten Auge <strong>im Brennpunkt F' exakt auf der Netzhaut</strong>.
                    </div>
                  )}

                  {!autoFocus && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-200">
                      <div className="flex justify-between font-semibold text-gray-800">
                        <span>Manuelle Linsenwölbung (Akkommodation):</span>
                        <span className="font-mono text-emerald-700">{Math.round(accommodateState * 100)} %</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.02"
                        value={accommodateState}
                        onChange={(e) => setAccommodateState(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Flache Linse (Ferne)</span>
                        <span>Stark gekrümmt (Nähe)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* RETINA MONITOR (Live Perception Preview) */}
                <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${blurAmount < 1.5 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                      <span className="font-semibold text-slate-200">Live-Sehfeld Monitor</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Unschärfe: {blurAmount.toFixed(1)} px
                    </span>
                  </div>

                  {/* Render simulated perception with SVG feGaussianBlur */}
                  <div className="py-4 flex items-center justify-center">
                    <div
                      className="relative w-28 h-28 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden transition-transform duration-500"
                      style={{
                        transform: brainInversion ? 'rotate(0deg)' : 'rotate(180deg)'
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-20 h-20">
                        <defs>
                          <filter id="perceptionBlur">
                            <feGaussianBlur stdDeviation={blurAmount} />
                          </filter>
                        </defs>
                        <g filter="url(#perceptionBlur)">
                          <rect x="42" y="45" width="16" height="40" fill="#f1f5f9" rx="2" stroke="#64748b" />
                          <line x1="50" y1="45" x2="50" y2="38" stroke="#334155" strokeWidth="2" />
                          <path
                            d="M 50 18 Q 58 30, 50 38 Q 42 30, 50 18 Z"
                            fill="url(#flameGrad)"
                            className="animate-flame"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div className="text-[11px] text-center text-slate-300">
                    {blurAmount < 1.5 ? (
                      <span className="text-emerald-400 font-semibold">
                        ✅ Perfekter Fokus! Der Bildpunkt liegt exakt auf der Netzhaut.
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        ⚠️ Bild unscharf! Der Fokus liegt {focusX < retinaX ? 'VOR' : 'HINTER'} der Netzhaut.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Didactic Box on Image Characteristics */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-sm text-emerald-900">Merksatz für die Schulaufgabe (LehrplanPLUS B8 2):</span>
                  <p>
                    Das von Hornhaut und Augenlinse auf der Netzhaut entworfene Bild ist <strong>reell</strong> (auf einem Schirm auffangbar), steht <strong>auf dem Kopf (umgekehrt)</strong> und ist <strong>stark verkleinert</strong>. Erst das Sehzentrum im Großhirn dreht die elektrische Bildinformation für unser Bewusstsein wieder um!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 3: OPTIKER-WERKSTATT (FEHLSICHTIGKEITEN & KORREKTUR)         */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'fehlsichtig' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                    Station 3
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Optiker-Werkstatt: Fehlsichtigkeiten & Brillenkorrektur
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Untersuche die geometrischen Ursachen von <strong>Kurzsichtigkeit (Myopie)</strong> und <strong>Weitsichtigkeit (Hyperopie)</strong>. Wähle die passende Korrekturlinse (Sammellinse vs. Zerstreuungslinse) und passe die Dioptrienzahl an!
                </p>
              </div>

              {/* Patient Condition Selector */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => { setEyeCondition('normal'); setWithGlasses(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    eyeCondition === 'normal' ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600'
                  }`}
                >
                  🟢 Normal
                </button>
                <button
                  onClick={() => { setEyeCondition('myopie'); setWithGlasses(true); setLensType('concave'); setDiopters(-2.5); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    eyeCondition === 'myopie' ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600'
                  }`}
                >
                  🔵 Kurzsichtig (Myopie)
                </button>
                <button
                  onClick={() => { setEyeCondition('hyperopie'); setWithGlasses(true); setLensType('convex'); setDiopters(2.5); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    eyeCondition === 'hyperopie' ? 'bg-white shadow-sm text-forest-900' : 'text-gray-600'
                  }`}
                >
                  🟠 Weitsichtig (Hyperopie)
                </button>
              </div>
            </div>

            {/* Optician Interactive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Optics Ray Path with Eyeball Variation */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Strahlenverlauf im Auge {withGlasses ? 'mit Brille' : 'ohne Sehhilfe'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWithGlasses(!withGlasses)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        withGlasses ? 'bg-forest-800 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      👓 Brille {withGlasses ? 'aufgesetzt' : 'abgesetzt'}
                    </button>
                  </div>
                </div>

                {/* SVG OPTICS DIAGRAM */}
                <div className="relative w-full aspect-[640/280] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden select-none">
                  <svg viewBox="0 0 640 280" className="w-full h-full">
                    {/* Axis */}
                    <line x1="20" y1="140" x2="620" y2="140" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

                    {/* EYE OUTLINE WITH DYNAMIC RETINA POSITION */}
                    <path
                      d={`M 260 60 C 320 40, ${conditionRetinaX - 20} 50, ${conditionRetinaX} 140 C ${conditionRetinaX - 20} 230, 320 240, 260 220`}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    {/* Cornea */}
                    <path
                      d="M 260 60 C 230 90, 230 190, 260 220"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Eye Lens */}
                    <ellipse cx="285" cy="140" rx="9" ry="42" fill="#34d399" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />

                    {/* RETINA WALL */}
                    <path
                      d={`M ${conditionRetinaX} 70 C ${conditionRetinaX + 15} 105, ${conditionRetinaX + 15} 175, ${conditionRetinaX} 210`}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <text x={conditionRetinaX + 10} y="144" fill="#fde047" fontSize="10" fontWeight="bold">
                      Netzhaut
                    </text>

                    {/* GLASSES LENS IN FRONT OF EYE (x = 190) */}
                    {withGlasses && (
                      <g>
                        {lensType === 'concave' ? (
                          <path
                            d="M 185 70 Q 192 140, 185 210 L 195 210 Q 188 140, 195 70 Z"
                            fill="#38bdf8"
                            fillOpacity="0.4"
                            stroke="#0284c7"
                            strokeWidth="2"
                          />
                        ) : (
                          <path
                            d="M 185 70 Q 178 140, 185 210 L 195 210 Q 202 140, 195 70 Z"
                            fill="#38bdf8"
                            fillOpacity="0.4"
                            stroke="#0284c7"
                            strokeWidth="2"
                          />
                        )}
                        <text x="175" y="60" fill="#38bdf8" fontSize="9" fontWeight="bold">
                          {lensType === 'concave' ? 'Zerstreuungslinse (-)' : 'Sammellinse (+)'}
                        </text>
                      </g>
                    )}

                    {/* PARALLEL LIGHT BEAMS FROM DISTANT OBJECT */}
                    {(() => {
                      const rayY1 = 90;
                      const rayY2 = 190;
                      const glassesX = 190;
                      const eyeLensX = 285;

                      let eyeLensY1 = rayY1;
                      let eyeLensY2 = rayY2;

                      if (withGlasses) {
                        const div = lensType === 'concave' ? diopters * 2.5 : diopters * 2.5;
                        eyeLensY1 = rayY1 + div;
                        eyeLensY2 = rayY2 - div;
                      }

                      const focusPointX = actualOpticFocusX;

                      return (
                        <g>
                          {/* Top Beam */}
                          <line x1="40" y1={rayY1} x2={withGlasses ? glassesX : eyeLensX} y2={rayY1} stroke="#ef4444" strokeWidth="2" />
                          {withGlasses && (
                            <line x1={glassesX} y1={rayY1} x2={eyeLensX} y2={eyeLensY1} stroke="#ef4444" strokeWidth="2" />
                          )}
                          <line x1={eyeLensX} y1={eyeLensY1} x2={focusPointX} y2="140" stroke="#ef4444" strokeWidth="2" />

                          {/* Bottom Beam */}
                          <line x1="40" y1={rayY2} x2={withGlasses ? glassesX : eyeLensX} y2={rayY2} stroke="#ef4444" strokeWidth="2" />
                          {withGlasses && (
                            <line x1={glassesX} y1={rayY2} x2={eyeLensX} y2={eyeLensY2} stroke="#ef4444" strokeWidth="2" />
                          )}
                          <line x1={eyeLensX} y1={eyeLensY2} x2={focusPointX} y2="140" stroke="#ef4444" strokeWidth="2" />

                          {/* Focal Point Indicator */}
                          <circle cx={focusPointX} cy="140" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                          <text x={focusPointX - 25} y="160" fill="#fbbf24" fontSize="10" fontWeight="bold">
                            Fokus: {focusPointX.toFixed(0)}
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Patient Diagnosis Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block">Augapfel-Geometrie:</span>
                    <strong className="text-gray-900 text-sm">
                      {eyeCondition === 'myopie' ? 'Zu lang gebaut' : eyeCondition === 'hyperopie' ? 'Zu kurz gebaut' : 'Optimal proportioniert'}
                    </strong>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block">Brennpunkt-Lage:</span>
                    <strong className="text-gray-900 text-sm">
                      {actualOpticFocusX < conditionRetinaX - 5 ? 'VOR der Netzhaut' : actualOpticFocusX > conditionRetinaX + 5 ? 'HINTER der Netzhaut' : 'EXAKT auf Netzhaut'}
                    </strong>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block">Benötigte Brillenlinse:</span>
                    <strong className="text-forest-800 text-sm">
                      {eyeCondition === 'myopie' ? 'Zerstreuungslinse (Minus)' : eyeCondition === 'hyperopie' ? 'Sammellinse (Plus)' : 'Keine Brille nötig'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Prescription Trial Box */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <IconGlasses className="w-4 h-4 text-forest-600" />
                    Brillenprobierkasten
                  </h3>
                </div>

                {/* Lens Type Radio */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-700">Wähle Linsenart:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => { setLensType('concave'); setDiopters(-Math.abs(diopters || 2)); }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all ${
                        lensType === 'concave'
                          ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-400/30'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span>Zerstreuungslinse</span>
                      <span className="text-[10px] text-gray-500 font-normal">Konkavglas (Minus)</span>
                    </button>

                    <button
                      onClick={() => { setLensType('convex'); setDiopters(Math.abs(diopters || 2)); }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all ${
                        lensType === 'convex'
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-400/30'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span>Sammellinse</span>
                      <span className="text-[10px] text-gray-500 font-normal">Konvexglas (Plus)</span>
                    </button>
                  </div>
                </div>

                {/* Diopters Slider */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">Brechwert (Dioptrien):</span>
                    <span className="font-mono font-bold text-sm bg-gray-100 px-2.5 py-0.5 rounded-md text-gray-900">
                      {diopters > 0 ? `+${diopters.toFixed(1)}` : `${diopters.toFixed(1)}`} dpt
                    </span>
                  </div>
                  <input
                    type="range"
                    min={lensType === 'concave' ? -6 : 0.5}
                    max={lensType === 'concave' ? -0.5 : 6}
                    step="0.5"
                    value={diopters}
                    onChange={(e) => setDiopters(parseFloat(e.target.value))}
                    className="w-full accent-forest-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{lensType === 'concave' ? '-6.0 dpt' : '+0.5 dpt'}</span>
                    <span>{lensType === 'concave' ? '-0.5 dpt' : '+6.0 dpt'}</span>
                  </div>
                </div>

                {/* Visual Acuity / Sehschärfe Feedback Indicator */}
                <div className="p-4 rounded-xl border text-center space-y-2 transition-all" style={{
                  backgroundColor: isPerfectPrescription ? '#f0fdf4' : '#fffbeb',
                  borderColor: isPerfectPrescription ? '#86efac' : '#fde68a'
                }}>
                  <div className="text-xs font-semibold text-gray-700">
                    Sehschärfe auf der Netzhaut:
                  </div>
                  <div className="text-2xl font-black" style={{ color: isPerfectPrescription ? '#15803d' : '#b45309' }}>
                    {isPerfectPrescription ? '100 % (Visus 1.0)' : `${Math.max(10, Math.round(100 - conditionBlur * 2.2))} %`}
                  </div>
                  <p className="text-xs" style={{ color: isPerfectPrescription ? '#166534' : '#92400e' }}>
                    {isPerfectPrescription
                      ? '🎉 Perfekt korrigiert! Der Brennpunkt liegt exakt auf der Netzhaut.'
                      : 'Bild noch unscharf. Wähle die richtige Linsenart und korrigiere den Dioptrienwert!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* STATION 4: ADAPTION & FOTOREZEPTOREN (TAG- VS. NACHTSEHEN)          */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'adaption' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    Station 4
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Hell-Dunkel-Adaption & die Fotorezeptoren der Netzhaut
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  Bewege den Helligkeitsregler von grellem Sonnenlicht bis in die tiefste Dämmerung. Beobachte den <strong>Pupillenreflex</strong> und erforsche den Unterschied zwischen farbempfindlichen <strong>Zapfen</strong> und hochsensiblen <strong>Stäbchen</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono">
                <IconSun className="w-4 h-4 text-yellow-400" />
                <span>{luxLevel >= 1000 ? `${(luxLevel / 1000).toFixed(1)} kLux` : `${luxLevel.toFixed(1)} Lux`}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Pupil & Iris Reflex */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>Irisblende & Pupillenreaktion</span>
                  <span className="text-xs font-normal text-gray-500">
                    {luxLevel > 2000 ? 'Miosis (Pupillenverengung)' : luxLevel < 20 ? 'Mydriasis (Pupillenerweiterung)' : 'Normalweite'}
                  </span>
                </h3>

                {/* LUX SLIDER */}
                <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="flex justify-between text-xs font-semibold text-gray-800">
                    <span>Umgebungshelligkeit:</span>
                    <span className="text-forest-700">
                      {luxLevel > 50000 ? 'Grelle Sonne (100.000 Lux)' : luxLevel > 1000 ? 'Tageslicht (10.000 Lux)' : luxLevel > 100 ? 'Zimmerlicht (500 Lux)' : 'Dämmerung / Nacht (< 1 Lux)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="100000"
                    step="10"
                    value={luxLevel}
                    onChange={(e) => setLuxLevel(parseFloat(e.target.value))}
                    className="w-full accent-yellow-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Nacht (0.1 Lux)</span>
                    <span>Zimmer (500 Lux)</span>
                    <span>Sonne (100 kLux)</span>
                  </div>
                </div>

                {/* Frontal View of Pupil & Iris */}
                <div className="relative w-full aspect-[320/220] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden select-none">
                  <svg viewBox="0 0 320 220" className="w-full h-full">
                    <path
                      d="M 40 110 Q 160 30, 280 110 Q 160 190, 40 110 Z"
                      fill="#f8fafc"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />

                    {/* Iris Circle */}
                    <circle cx="160" cy="110" r="64" fill="#047857" stroke="#065f46" strokeWidth="3" />
                    {[...Array(24)].map((_, i) => (
                      <line
                        key={i}
                        x1="160"
                        y1="110"
                        x2={160 + 60 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={110 + 60 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="#064e3b"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    ))}

                    {/* Pupil Circle */}
                    <circle
                      cx="160"
                      cy="110"
                      r={pupilRadius}
                      fill="#020617"
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    {/* Light reflection gloss */}
                    <circle cx="145" cy="95" r="7" fill="#ffffff" opacity="0.6" />
                    <circle cx="152" cy="102" r="3" fill="#ffffff" opacity="0.4" />
                  </svg>

                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] text-slate-300 flex justify-between border border-white/10">
                    <span>Pupillendurchmesser: <strong className="text-white">~{(pupilRadius / 4).toFixed(1)} mm</strong></span>
                    <span>Aktiver Muskel: <strong className="text-yellow-400">{luxLevel > 1000 ? 'M. sphincter (Ring)' : 'M. dilatator (Fächer)'}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Die <strong>Regenbogenhaut (Iris)</strong> arbeitet wie die Blende einer Kamera: Bei starkem Licht zieht der ringförmige Schließmuskel die Pupille eng (Schutz vor Überblendung). Bei Dunkelheit spannt der radiale Erweiterungsmuskel an, um maximal viel Restlicht einzufangen.
                </p>
              </div>

              {/* Right Column: Rods vs. Cones Retinal Micro-View */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-forest-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Mikroskopie: Zapfen vs. Stäbchen
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setZoomRetinaType('zapfen')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        zoomRetinaType === 'zapfen' ? 'bg-forest-800 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      🎨 Zapfen (Tag)
                    </button>
                    <button
                      onClick={() => setZoomRetinaType('staebchen')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        zoomRetinaType === 'staebchen' ? 'bg-forest-800 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      🌙 Stäbchen (Nacht)
                    </button>
                  </div>
                </div>

                {/* Comparison Card */}
                {zoomRetinaType === 'zapfen' ? (
                  <div className="space-y-3">
                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-amber-950">Zapfen (Cones) – Photopisches Sehen</span>
                        <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">~6 Millionen</span>
                      </div>
                      <p>
                        <strong>Hauptort:</strong> Konzentriert im <strong>Gelben Fleck (Fovea centralis)</strong>.
                      </p>
                      <p>
                        <strong>Funktion:</strong> Verantwortlich für das <strong>Farbsehen</strong> und gestochen scharfe Details bei ausreichendem Licht. Es gibt 3 Zapfentypen: Rot-, Grün- und Blau-Zapfen.
                      </p>
                      <p className="text-amber-900 font-medium">
                        👉 Bei Nachtlicht (&lt; 1 Lux) sind sie inaktiv! Deshalb können wir nachts im Dunkeln keine Farben wahrnehmen.
                      </p>
                    </div>

                    <div className="w-full h-32 bg-slate-900 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
                      <svg viewBox="0 0 300 100" className="w-full h-full">
                        <g transform="translate(60, 10)">
                          <polygon points="20,10 10,60 30,60" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                          <rect x="15" y="60" width="10" height="20" fill="#fca5a5" />
                          <text x="20" y="92" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">Rot-Zapfen</text>
                        </g>
                        <g transform="translate(140, 10)">
                          <polygon points="20,10 10,60 30,60" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
                          <rect x="15" y="60" width="10" height="20" fill="#bbf7d0" />
                          <text x="20" y="92" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">Grün-Zapfen</text>
                        </g>
                        <g transform="translate(220, 10)">
                          <polygon points="20,10 10,60 30,60" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                          <rect x="15" y="60" width="10" height="20" fill="#bfdbfe" />
                          <text x="20" y="92" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">Blau-Zapfen</text>
                        </g>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 text-xs text-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">Stäbchen (Rods) – Skotopisches Sehen</span>
                        <span className="bg-slate-300 text-slate-900 px-2 py-0.5 rounded font-mono font-bold">~120 Millionen</span>
                      </div>
                      <p>
                        <strong>Hauptort:</strong> Dicht verteilt in der <strong>Netzhaut-Peripherie</strong> (keine Stäbchen in der Fovea!).
                      </p>
                      <p>
                        <strong>Funktion:</strong> Extrem lichtempfindlich (reagieren bereits auf einzelne Lichtquanten). Sie ermöglichen das <strong>Hell-Dunkel-Sehen</strong> in der Dämmerung und bei Nacht.
                      </p>
                      <p className="text-slate-900 font-medium">
                        👉 „Nachts sind alle Katzen grau“: Stäbchen besitzen nur einen Sehfarbstoff (Rhodopsin) und können Wellenlängen (Farben) nicht differenzieren.
                      </p>
                    </div>

                    <div className="w-full h-32 bg-slate-900 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
                      <svg viewBox="0 0 300 100" className="w-full h-full">
                        {[50, 110, 170, 230].map((x, i) => (
                          <g key={i} transform={`translate(${x}, 10)`}>
                            <rect x="15" y="10" width="10" height="50" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                            {[16, 24, 32, 40, 48].map((y, di) => (
                              <line key={di} x1="16" y1={y} x2="24" y2={y} stroke="#64748b" strokeWidth="1" />
                            ))}
                            <rect x="16" y="60" width="8" height="20" fill="#e2e8f0" />
                            <text x="20" y="92" fill="#cbd5e1" fontSize="9" textAnchor="middle">Stäbchen</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block">Simulierter Seheindruck aktuell:</span>
                    <span className="text-gray-500">
                      {luxLevel > 500 ? 'Vollfarbig, gestochen scharfes Fovea-Sehen' : luxLevel > 10 ? 'Leicht gedämpfte Farben, Purkinje-Verschiebung' : 'Reines Schwarz-Weiß-Dämmerungssehen'}
                    </span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg shadow-inner border border-gray-300 transition-colors"
                    style={{
                      backgroundColor: luxLevel > 500 ? '#ef4444' : luxLevel > 20 ? '#a855f7' : '#475569'
                    }}
                    title="Farbwahrnehmung"
                  />
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
                  Prüfe dein Verständnis mit 6 gezielten Aufgaben zu den häufigsten Fehlkonzepten des bayerischen Lehrplans (Ziliarmuskel-Paradoxon, Bildentstehung, Brillenkorrektur und Blinder Fleck).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-gray-700">
                  Punkte:{' '}
                  <span className="font-mono text-emerald-700 text-sm">
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
                              setShowExplanation({ ...showExplanation, [q.id]: true });
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
                    📚 Fachbegriff-Glossar (LehrplanPLUS B8 2)
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
