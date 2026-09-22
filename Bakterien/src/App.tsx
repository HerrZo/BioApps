import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GROWTH_PHASES,
  GrowthPhase,
  BIOTECH_PRESETS,
  BiotechPreset,
  FOOD_CHALLENGE_SCENARIOS,
  FoodChallengeScenario,
  QUIZ_QUESTIONS,
  GLOSSARY_ITEMS
} from './data';

interface MicrobeCell {
  id: number;
  x: number;
  y: number;
  length: number;
  angle: number;
  divisionProgress: number; // 0.0 to 1.0 (furrow formation)
  vx: number;
  vy: number;
}

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

  const [activeTab, setActiveTab] = useState<'fermenter' | 'growth' | 'parameters' | 'challenge' | 'quiz'>('fermenter');

  // --- PARAMETER & REACTOR STATE ---
  const [temperature, setTemperature] = useState<number>(37); // 0 to 100 °C
  const [isAerobic, setIsAerobic] = useState<boolean>(true); // true = O2 ventilation, false = Anaerobic
  const [glucoseLevel, setGlucoseLevel] = useState<number>(100); // 0 to 100 %
  const [phValue, setPhValue] = useState<number>(6.8); // 3.0 to 9.0
  const [stirrerSpeed, setStirrerSpeed] = useState<number>(50); // 0 to 100 %
  const [selectedPreset, setSelectedPreset] = useState<string>('biomass');

  // --- GROWTH SIMULATION STATE ---
  const [simHours, setSimHours] = useState<number>(0); // 0 to 24 hours
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [isLogScale, setIsLogScale] = useState<boolean>(true); // true = log10(N), false = linear
  const [yogurtCurdled, setYogurtCurdled] = useState<boolean>(false);

  // Microbe visual cells in microscope
  const [cells, setCells] = useState<MicrobeCell[]>([]);
  const cellsRef = useRef<MicrobeCell[]>([]);
  cellsRef.current = cells;

  // Canvas refs
  const microscopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const growthCurveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- CALCULATION OF GENERATION TIME & GROWTH RATE ---
  // RGT rule: Q10 ≈ 2.2 between 4 °C and 37 °C; denatures above 55 °C, lethal at > 70 °C
  const growthMetrics = useMemo(() => {
    let baseTimeMinutes = 20; // 20 min at 37 °C for E. coli

    // 1. Temperature factor
    let tempFactor = 0;
    if (temperature <= 0) {
      tempFactor = 0; // Frozen, no growth
    } else if (temperature <= 37) {
      // RGT curve up to optimum
      tempFactor = Math.pow(temperature / 37, 2.5);
    } else if (temperature <= 45) {
      // Slight decrease
      tempFactor = 1.0 - (temperature - 37) * 0.08;
    } else if (temperature <= 60) {
      // Heat stress, rapid drop
      tempFactor = Math.max(0, 0.4 - (temperature - 45) * 0.025);
    } else {
      // Irreversible enzyme denaturation!
      tempFactor = -1.0; // Lethal killing rate
    }

    // 2. pH factor (Optimum around 6.5 - 7.5, acid inhibits)
    let phFactor = 1.0;
    if (phValue < 4.5) {
      phFactor = Math.max(0.1, (phValue - 3.0) / 1.5);
    } else if (phValue > 8.5) {
      phFactor = Math.max(0.1, (9.5 - phValue));
    }

    // 3. Glucose substrate factor
    const substrateFactor = glucoseLevel / 100;

    // 4. Oxygen factor
    const o2Factor = isAerobic ? 1.0 : 0.65; // Anaerobic is slower for E. coli, but enables lactic acid

    let actualGenTime = 0;
    let isDenatured = false;

    if (tempFactor < 0) {
      isDenatured = true;
      actualGenTime = Infinity;
    } else if (tempFactor === 0 || substrateFactor === 0) {
      actualGenTime = Infinity;
    } else {
      actualGenTime = baseTimeMinutes / (tempFactor * phFactor * substrateFactor * o2Factor);
    }

    return {
      generationTimeMinutes: actualGenTime,
      isDenatured,
      growthVelocityScore: tempFactor < 0 ? -100 : Math.round(tempFactor * 100)
    };
  }, [temperature, phValue, glucoseLevel, isAerobic]);

  // --- COMPUTE BACTERIA COUNT AS FUNCTION OF TIME ---
  // Lag phase (0-2h), Log phase (2-8h), Stationary (8-16h), Death (16-24h)
  const getBacterialCountAtTime = (hours: number) => {
    const N0 = 1000; // 1000 KBE/ml start

    // If heat denatured
    if (temperature > 65) {
      if (hours > 0.5) return 0;
      return Math.max(0, N0 * Math.exp(-hours * 8));
    }

    // Normal four phase sigmoid / bell model
    const gHours = Math.max(0.33, growthMetrics.generationTimeMinutes / 60);

    if (hours < 2.0) {
      // 1. Lag Phase: very slight division
      return N0 * (1 + (hours / 2.0) * 0.5);
    } else if (hours < 8.0) {
      // 2. Log Phase: exponential N = N0 * 2^(t/g)
      const tLog = hours - 2.0;
      const count = (N0 * 1.5) * Math.pow(2, (tLog / gHours) * 1.2);
      return Math.min(1e9, count);
    } else if (hours < 16.0) {
      // 3. Stationary Phase: plateau around 8e8 - 1e9
      const maxPop = Math.min(1e9, (N0 * 1.5) * Math.pow(2, (6.0 / gHours) * 1.2));
      const tStat = hours - 8.0;
      return maxPop * (1 - 0.05 * (tStat / 8.0));
    } else {
      // 4. Death Phase: lysis & toxicity
      const maxPop = Math.min(1e9, (N0 * 1.5) * Math.pow(2, (6.0 / gHours) * 1.2));
      const tDeath = hours - 16.0;
      const decay = Math.exp(-tDeath * 0.45);
      return Math.max(10, maxPop * 0.95 * decay);
    }
  };

  const currentCount = useMemo(() => {
    return getBacterialCountAtTime(simHours);
  }, [simHours, temperature, growthMetrics]);

  // Determine current growth phase
  const currentPhase: GrowthPhase = useMemo(() => {
    if (growthMetrics.isDenatured) return GROWTH_PHASES[3];
    if (simHours < 2.0) return GROWTH_PHASES[0]; // Lag
    if (simHours < 8.0) return GROWTH_PHASES[1]; // Log
    if (simHours < 16.0) return GROWTH_PHASES[2]; // Stationary
    return GROWTH_PHASES[3]; // Death
  }, [simHours, growthMetrics]);

  // --- INITIALIZE MICROSCOPE CELLS ---
  useEffect(() => {
    const initialCells: MicrobeCell[] = [];
    const count = Math.min(40, Math.max(6, Math.round(Math.log10(Math.max(10, currentCount)) * 4)));
    for (let i = 0; i < count; i++) {
      initialCells.push({
        id: i,
        x: 40 + Math.random() * 200,
        y: 40 + Math.random() * 200,
        length: 18 + Math.random() * 8,
        angle: Math.random() * Math.PI,
        divisionProgress: Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      });
    }
    setCells(initialCells);
  }, []);

  // --- PRESET APPLICATION ---
  const applyPreset = (preset: BiotechPreset) => {
    setSelectedPreset(preset.id);
    setTemperature(preset.temperature);
    setIsAerobic(preset.isAerobic);
    setGlucoseLevel(preset.glucoseLevel);
    setPhValue(preset.id === 'yogurt' ? 4.2 : 6.8);
    setSimHours(0);
    setYogurtCurdled(preset.id === 'yogurt');
  };

  // --- SIMULATION TICK TIMER ---
  useEffect(() => {
    let interval: any = null;
    if (isSimRunning) {
      interval = setInterval(() => {
        setSimHours(prev => {
          const next = prev + 0.1 * simSpeed;
          if (next >= 24) {
            setIsSimRunning(false);
            return 24;
          }
          return next;
        });

        // If in anaerobic fermentation mode, pH decreases gradually
        if (!isAerobic && temperature >= 35 && temperature <= 45) {
          setPhValue(prev => {
            const nextPh = Math.max(4.2, prev - 0.02 * simSpeed);
            if (nextPh <= 4.6 && !yogurtCurdled) {
              setYogurtCurdled(true);
            }
            return parseFloat(nextPh.toFixed(2));
          });
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimRunning, simSpeed, isAerobic, temperature, yogurtCurdled]);

  // --- RENDER MICROSCOPE CANVAS ---
  useEffect(() => {
    const canvas = microscopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Circular viewport mask
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    ctx.clip();

    // Microscope light background
    const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.8, '#e2e8f0');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Grid lines for counting chamber (Neubauer reticle)
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 20; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Number of visual cells depends on current bacterial count
    const targetCellCount = growthMetrics.isDenatured
      ? 0
      : Math.min(80, Math.max(3, Math.round(Math.log10(Math.max(10, currentCount)) * 8)));

    // Update cells array size
    let curCells = [...cellsRef.current];
    if (curCells.length < targetCellCount) {
      for (let i = curCells.length; i < targetCellCount; i++) {
        curCells.push({
          id: i + Date.now(),
          x: 40 + Math.random() * (w - 80),
          y: 40 + Math.random() * (h - 80),
          length: 16 + Math.random() * 8,
          angle: Math.random() * Math.PI,
          divisionProgress: Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7
        });
      }
    } else if (curCells.length > targetCellCount) {
      curCells = curCells.slice(0, targetCellCount);
    }

    // Draw rod bacteria (Bacillus / Lactobacillus)
    curCells.forEach(cell => {
      // Move slightly (Brownian motion / swimming)
      cell.x += cell.vx;
      cell.y += cell.vy;
      if (cell.x < 25) { cell.x = 25; cell.vx *= -1; }
      if (cell.x > w - 25) { cell.x = w - 25; cell.vx *= -1; }
      if (cell.y < 25) { cell.y = 25; cell.vy *= -1; }
      if (cell.y > h - 25) { cell.y = h - 25; cell.vy *= -1; }

      // Advance division progress during log phase
      if (currentPhase.id === 'log' && isSimRunning) {
        cell.divisionProgress += 0.005 * simSpeed;
        if (cell.divisionProgress > 1.0) cell.divisionProgress = 0.1;
      }

      ctx.save();
      ctx.translate(cell.x, cell.y);
      ctx.rotate(cell.angle);

      // Rod body (capsule shape)
      const rodL = cell.length;
      const rodR = 4.5;

      // Color depends on yogurt curdling or bacteria type
      ctx.fillStyle = yogurtCurdled ? '#0284c7' : '#15803d'; // blue or green
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;

      // If dividing: draw constriction furrow in the middle
      if (cell.divisionProgress > 0.4) {
        const pinch = cell.divisionProgress * 2.5;
        // Left half
        ctx.beginPath();
        ctx.arc(-rodL / 4, 0, rodR, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.lineTo(0, -rodR + pinch);
        ctx.lineTo(0, rodR - pinch);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right half
        ctx.beginPath();
        ctx.arc(rodL / 4, 0, rodR, (3 * Math.PI) / 2, Math.PI / 2);
        ctx.lineTo(0, rodR - pinch);
        ctx.lineTo(0, -rodR + pinch);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Division septum indicator
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -rodR + pinch);
        ctx.lineTo(0, rodR - pinch);
        ctx.stroke();
      } else {
        // Single normal rod bacterium
        ctx.beginPath();
        ctx.arc(-rodL / 2 + rodR, 0, rodR, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.arc(rodL / 2 - rodR, 0, rodR, (3 * Math.PI) / 2, Math.PI / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    });

    ctx.restore(); // restore viewport clip

    // Circular frame overlay
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();

    cellsRef.current = curCells;
  }, [currentCount, currentPhase, isSimRunning, simSpeed, yogurtCurdled, growthMetrics]);

  // --- RENDER GROWTH CURVE CANVAS ---
  useEffect(() => {
    const canvas = growthCurveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 65;
    const padBottom = 35;
    const plotW = w - padLeft - 20;
    const plotH = h - padBottom - 25;

    // 1. Draw Phase Background Banners
    // Hours 0-2 (Lag: 2/24), 2-8 (Log: 6/24), 8-16 (Stat: 8/24), 16-24 (Death: 8/24)
    const phaseSlices = [
      { startH: 0, endH: 2, color: 'rgba(234, 179, 8, 0.12)', label: 'Lag-Phase' },
      { startH: 2, endH: 8, color: 'rgba(22, 163, 74, 0.12)', label: 'Log-Phase (Exponentiell)' },
      { startH: 8, endH: 16, color: 'rgba(37, 99, 235, 0.12)', label: 'Stationäre Phase' },
      { startH: 16, endH: 24, color: 'rgba(220, 38, 38, 0.12)', label: 'Absterbephase' }
    ];

    phaseSlices.forEach(ps => {
      const x1 = padLeft + (ps.startH / 24) * plotW;
      const x2 = padLeft + (ps.endH / 24) * plotW;
      ctx.fillStyle = ps.color;
      ctx.fillRect(x1, 20, x2 - x1, plotH);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(ps.label, x1 + 5, 16);
    });

    // 2. Grid lines & Y-Axis labels
    ctx.strokeStyle = darkMode ? '#166534' : '#e2e8f0';
    ctx.lineWidth = 1;

    if (isLogScale) {
      // Log scale: log10(N) from 1 to 9 (10^1 to 10^9)
      for (let exp = 1; exp <= 9; exp += 2) {
        const y = 20 + (1 - (exp - 1) / 8) * plotH;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + plotW, y);
        ctx.stroke();

        ctx.fillStyle = darkMode ? '#86efac' : '#475569';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`10^${exp}`, 20, y + 4);
      }
    } else {
      // Linear scale: 0 to 1 Mrd. (10^9)
      for (let i = 0; i <= 4; i++) {
        const y = 20 + (1 - i / 4) * plotH;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + plotW, y);
        ctx.stroke();

        ctx.fillStyle = darkMode ? '#86efac' : '#475569';
        ctx.font = '10px Inter, sans-serif';
        const val = i === 4 ? '1 Mrd.' : i === 2 ? '500 Mio.' : `${i * 250} Mio.`;
        ctx.fillText(val, 10, y + 4);
      }
    }

    // X-Axis hours (0 to 24h)
    for (let hr = 0; hr <= 24; hr += 4) {
      const x = padLeft + (hr / 24) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 20 + plotH);
      ctx.stroke();

      ctx.fillStyle = darkMode ? '#86efac' : '#475569';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${hr} h`, x - 8, h - 15);
    }

    // 3. Plot the Growth Curve
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#15803d'; // Forest green
    ctx.beginPath();

    const stepPoints = 120;
    for (let i = 0; i <= stepPoints; i++) {
      const t = (i / stepPoints) * 24;
      const count = getBacterialCountAtTime(t);

      const x = padLeft + (t / 24) * plotW;
      let y = 0;

      if (isLogScale) {
        const logVal = Math.max(1, Math.min(9, Math.log10(Math.max(10, count))));
        y = 20 + (1 - (logVal - 1) / 8) * plotH;
      } else {
        const linVal = Math.max(0, Math.min(1e9, count));
        y = 20 + (1 - linVal / 1e9) * plotH;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 4. Current Time Needle & Point
    const currentX = padLeft + (simHours / 24) * plotW;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(currentX, 20);
    ctx.lineTo(currentX, 20 + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current point circle
    let currentY = 0;
    if (isLogScale) {
      const logVal = Math.max(1, Math.min(9, Math.log10(Math.max(10, currentCount))));
      currentY = 20 + (1 - (logVal - 1) / 8) * plotH;
    } else {
      currentY = 20 + (1 - Math.min(1e9, currentCount) / 1e9) * plotH;
    }

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [simHours, currentCount, isLogScale, temperature, growthMetrics, darkMode]);

  // --- FOOD CHALLENGE STATE ---
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('milk');
  const [challengeHours, setChallengeHours] = useState<number>(0);
  const [challengeActions, setChallengeActions] = useState<{
    cooling: boolean;
    freezing: boolean;
    boiling: boolean;
    pasteurizing: boolean;
    salting: boolean;
    acidifying: boolean;
    vacuum: boolean;
  }>({
    cooling: false,
    freezing: false,
    boiling: false,
    pasteurizing: false,
    salting: false,
    acidifying: false,
    vacuum: false
  });

  const selectedScenario = useMemo(() => {
    return FOOD_CHALLENGE_SCENARIOS.find(s => s.id === selectedScenarioId) || FOOD_CHALLENGE_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Calculate challenge shelf life and microbial growth
  const challengeResult = useMemo(() => {
    let effectiveTemp = selectedScenario.defaultTemp;
    let initialReduction = 1.0;
    let growthRateMultiplier = 1.0;

    if (challengeActions.freezing) {
      effectiveTemp = -18;
      growthRateMultiplier = 0.005; // almost completely arrested
    } else if (challengeActions.cooling) {
      effectiveTemp = 4;
      growthRateMultiplier = 0.08; // RGT rule: ~12x slower
    }

    if (challengeActions.boiling) {
      initialReduction = 0.0001; // 99.99 % killed
    } else if (challengeActions.pasteurizing) {
      initialReduction = 0.005; // 99.5 % killed
    }

    if (challengeActions.salting) {
      growthRateMultiplier *= 0.15; // Osmotic water withdrawal
    }

    if (challengeActions.acidifying) {
      growthRateMultiplier *= 0.2; // Acidic pH inhibits enzymes
    }

    if (challengeActions.vacuum) {
      growthRateMultiplier *= 0.35; // Oxygen removed
    }

    const startCount = Math.max(1, selectedScenario.initialCount * initialReduction);
    // Exponential multiplication: N(t) = startCount * 2^(hours * rate)
    const baseHourlyDoublings = 2.0; // at room temperature
    const actualDoublingsPerHour = baseHourlyDoublings * growthRateMultiplier;
    const countAtChallengeHours = startCount * Math.pow(2, challengeHours * actualDoublingsPerHour);

    const isSpoiled = countAtChallengeHours >= selectedScenario.spoilageThreshold;

    return {
      currentCount: Math.round(countAtChallengeHours),
      isSpoiled,
      doublingsPerHour: actualDoublingsPerHour.toFixed(2),
      shelfLifeDays: (selectedScenario.unpreservedHoursToSpoil / (actualDoublingsPerHour || 0.001) / 24).toFixed(1)
    };
  }, [selectedScenario, challengeActions, challengeHours]);

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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 5h6m-6 0v7l-4 8a1 1 0 001 1h12a1 1 0 001-1l-4-8V5" />
                </svg>
              </span>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Bakterien – Wachstum & Bioreaktor
                </h1>
                <p className="text-xs text-forest-700 font-medium">
                  LehrplanPLUS Bayern • Biologie 9. Klasse (B9 2 / B9 3)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              data-dark-toggle
              onClick={(e) => {
                e.stopPropagation();
                setDarkMode(prev => !prev);
              }}
              aria-label={darkMode ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
              title={darkMode ? 'Helles Design' : 'Dunkles Design'}
              className="p-2 rounded-xl text-forest-700 hover:bg-forest-100 dark:text-forest-200 dark:hover:bg-forest-800 transition-colors flex items-center justify-center text-lg active:scale-95 cursor-pointer"
            >
              <span className="dark-mode-icon">{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>

        {/* --- STATION TABS --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-forest-100 text-xs sm:text-sm font-medium">
          {[
            { id: 'fermenter', label: '⚗️ 1. Bioreaktor & Lupe', desc: 'Fermenter Querschnitt' },
            { id: 'growth', label: '📈 2. Wachstumskurve', desc: 'Linear & Logarithmisch' },
            { id: 'parameters', label: '🎛️ 3. Parameter & Joghurt', desc: 'Temperatur & Gärung' },
            { id: 'challenge', label: '🥫 4. Lebensmittel retten', desc: 'Konservierungs-Labor' },
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
        {/* STATION 1: INTERAKTIVER BIOREAKTOR / FERMENTER & MIKROSKOP               */}
        {/* ========================================================================= */}
        {activeTab === 'fermenter' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-forest-700 to-forest-800 rounded-2xl p-5 text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-600 text-forest-100 uppercase tracking-wider mb-2">
                    Biotechnologie & Mikrobiologie
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Der industrielle Bioreaktor (Fermenter)
                  </h2>
                  <p className="text-forest-100 text-sm mt-1 max-w-3xl">
                    Hier werden Mikroorganismen unter exakter Kontrolle von <strong>Temperatur, pH-Wert, Rührwerk und Sauerstoff</strong> vermehrt.
                    Beobachte im Mikroskopie-Ausschnitt, wie sich die Stäbchenbakterien durch Zweiteilung verdoppeln!
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[140px] border border-white/20">
                  <div className="text-xs text-forest-200 font-medium">Aktuelle Keimzahl</div>
                  <div className="text-2xl font-extrabold text-amber-300">
                    {currentCount > 1e6 ? `${(currentCount / 1e6).toFixed(1)} Mio.` : `${Math.round(currentCount)}`}
                  </div>
                  <div className="text-[11px] text-forest-200 mt-0.5">KBE / ml</div>
                </div>
              </div>
            </div>

            {/* Layout: Bioreactor Cross-Section (Left) + Microscope Viewport & Quick Controls (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Bioreactor Visual Diagram */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                    <span>⚗️ Schnittbild des Rührkessel-Fermenters</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isAerobic ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {isAerobic ? '🌬️ Aerob (Zellatmung)' : '🍶 Anaerob (Gärung)'}
                  </span>
                </div>

                {/* SVG Bioreactor Vessel */}
                <div className="relative rounded-2xl bg-slate-900 p-4 border border-gray-700 shadow-inner overflow-hidden flex items-center justify-center min-h-[380px]">
                  <svg viewBox="0 0 400 380" className="w-full max-w-[360px] h-auto">
                    {/* Heating / Cooling Jacket (Heizmantel) */}
                    <path
                      d="M 60 70 L 60 290 Q 60 350 200 350 Q 340 350 340 290 L 340 70"
                      fill="none"
                      stroke={temperature > 50 ? '#ef4444' : temperature < 15 ? '#3b82f6' : '#d97706'}
                      strokeWidth="18"
                      strokeLinecap="round"
                      opacity="0.75"
                    />

                    {/* Main Stainless Vessel Inner Wall */}
                    <path
                      d="M 75 60 L 75 290 Q 75 335 200 335 Q 325 335 325 290 L 325 60 Z"
                      fill={yogurtCurdled ? '#f8fafc' : '#fef3c7'} // milky or broth
                      stroke="#cbd5e1"
                      strokeWidth="6"
                    />

                    {/* Liquid Broth Wave Surface */}
                    <path
                      d="M 78 120 Q 140 115 200 120 Q 260 125 322 120 L 322 290 Q 322 332 200 332 Q 78 332 78 290 Z"
                      fill={yogurtCurdled ? 'rgba(241, 245, 249, 0.95)' : 'rgba(245, 158, 11, 0.45)'}
                    />

                    {/* Stirrer Shaft (Rührwerk) */}
                    <line x1="200" y1="20" x2="200" y2="300" stroke="#475569" strokeWidth="10" />
                    {/* Top Motor */}
                    <rect x="175" y="10" width="50" height="35" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="200" cy="28" r="5" fill="#22c55e" className="animate-ping" />

                    {/* Impeller Blades (Animated Rotation) */}
                    <g className={stirrerSpeed > 0 ? 'animate-stirrer' : ''} style={{ transformOrigin: '200px 240px' }}>
                      <rect x="120" y="235" width="160" height="10" rx="3" fill="#64748b" stroke="#334155" />
                      <rect x="115" y="225" width="12" height="30" rx="2" fill="#475569" />
                      <rect x="273" y="225" width="12" height="30" rx="2" fill="#475569" />
                    </g>
                    <g className={stirrerSpeed > 0 ? 'animate-stirrer' : ''} style={{ transformOrigin: '200px 170px' }}>
                      <rect x="135" y="165" width="130" height="8" rx="2" fill="#64748b" stroke="#334155" />
                    </g>

                    {/* Sparger Ring for O2 Bubbles at Bottom */}
                    {isAerobic && (
                      <g>
                        <ellipse cx="200" cy="310" rx="45" ry="8" fill="none" stroke="#38bdf8" strokeWidth="3" />
                        {/* Rising Animated Bubbles */}
                        <circle cx="180" cy="290" r="3.5" fill="#e0f2fe" className="animate-bubble-1" />
                        <circle cx="220" cy="295" r="4.5" fill="#e0f2fe" className="animate-bubble-2" />
                        <circle cx="195" cy="300" r="3" fill="#e0f2fe" className="animate-bubble-3" />
                        <circle cx="210" cy="285" r="4" fill="#e0f2fe" className="animate-bubble-4" />
                      </g>
                    )}

                    {/* Probes: Temperature & pH Sensor */}
                    <g>
                      {/* Left: pH probe */}
                      <line x1="110" y1="40" x2="110" y2="210" stroke="#94a3b8" strokeWidth="5" />
                      <circle cx="110" cy="210" r="7" fill="#8b5cf6" stroke="#4c1d95" strokeWidth="2" />
                      <text x="90" y="32" fill="#c4b5fd" fontSize="10" fontWeight="bold">pH: {phValue.toFixed(1)}</text>

                      {/* Right: Temp sensor */}
                      <line x1="290" y1="40" x2="290" y2="210" stroke="#94a3b8" strokeWidth="5" />
                      <circle cx="290" cy="210" r="7" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                      <text x="270" y="32" fill="#fca5a5" fontSize="10" fontWeight="bold">{temperature} °C</text>
                    </g>

                    {/* Infeed Nozzles at Top */}
                    <path d="M 130 10 L 130 60" stroke="#cbd5e1" strokeWidth="6" />
                    <text x="100" y="15" fill="#93c5fd" fontSize="9">Nährstoffe</text>

                    <path d="M 270 10 L 270 60" stroke="#cbd5e1" strokeWidth="6" />
                    <text x="265" y="15" fill="#86efac" fontSize="9">Säure/Lauge</text>
                  </svg>

                  {/* Yogurt Curdling Overlay Status */}
                  {yogurtCurdled && (
                    <div className="absolute bottom-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-sky-300 text-sky-950 text-xs font-bold shadow-lg flex items-center space-x-2">
                      <span>🍶</span>
                      <span>Kasein geronnen! Die Milch ist zu Joghurt erstarrt (pH {phValue.toFixed(1)}).</span>
                    </div>
                  )}

                  {/* Temperature Alert Warning */}
                  {growthMetrics.isDenatured && (
                    <div className="absolute top-6 bg-red-600/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl animate-bounce flex items-center space-x-2">
                      <span>🔥</span>
                      <span>Hitzetod: Enzyme bei {temperature} °C irreversibel denaturiert!</span>
                    </div>
                  )}
                </div>

                {/* Quick Simulation Bar */}
                <div className="mt-4 pt-3 border-t border-forest-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsSimRunning(!isSimRunning)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 text-white shadow-sm transition-all ${
                        isSimRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-forest-700 hover:bg-forest-800'
                      }`}
                    >
                      {isSimRunning ? '⏸️ Pause' : '▶️ Simulation starten'}
                    </button>
                    <button
                      onClick={() => {
                        setSimHours(0);
                        setPhValue(6.8);
                        setYogurtCurdled(false);
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      🔄 Reset
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    Fermentationszeit: <strong>{simHours.toFixed(1)} Stunden</strong>
                  </div>
                </div>
              </div>

              {/* Microscope Viewport & Biological Details */}
              <div className="lg:col-span-5 space-y-4 flex flex-col">
                {/* Microscope Circular Box */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 text-center">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center justify-between">
                    <span>🔬 Mikroskopie-Ausschnitt (1000×)</span>
                    <span className="text-xs text-forest-700 font-semibold">Zellteilung</span>
                  </h3>
                  <div className="flex justify-center my-2">
                    <canvas
                      ref={microscopeCanvasRef}
                      width={240}
                      height={240}
                      className="rounded-full shadow-lg border-2 border-slate-700"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Stäbchenbakterien (z. B. <em>Lactobacillus</em>). Achte auf die gelben <strong>Einschnürungsfurchen</strong> bei der Zweiteilung!
                  </p>
                </div>

                {/* Biological Growth Phase Info Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase">Aktuelle Wachstumsphase:</span>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: currentPhase.color }}
                    >
                      {currentPhase.name} ({currentPhase.germanName})
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {currentPhase.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-200 text-[11px] text-gray-600">
                    <strong className="block text-gray-900 mb-0.5">Molekularer Mechanismus:</strong>
                    {currentPhase.biologicalMechanism}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                    <span className="text-gray-500">Generationszeit (g):</span>
                    <span className="font-bold text-forest-800">
                      {growthMetrics.isDenatured
                        ? 'Kein Wachstum (tot)'
                        : `${Math.round(growthMetrics.generationTimeMinutes)} Minuten`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 2: DYNAMISCHE WACHSTUMSKURVE (LINEAR & LOGARITHMISCH)            */}
        {/* ========================================================================= */}
        {activeTab === 'growth' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Die 4 Phasen der bakteriellen Wachstumskurve
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Schalte zwischen <strong>Linearer</strong> und <strong>Logarithmischer Skala</strong> um:
                Auf der linearen Skala wirkt der Anstieg anfangs unscheinbar und schießt plötzlich wie eine Wand empor.
                Erst auf der logarithmischen Skala ($\log_{10}$) erkennt man die konstante Steigung der Verdopplungsrate!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Curve Plotter Canvas */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      Keimzahl vs. Zeit (0 bis 24 Stunden)
                    </span>
                  </div>

                  {/* Scale Switcher Toggle */}
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                    <span className="px-2 text-gray-500">Y-Achse:</span>
                    <button
                      onClick={() => setIsLogScale(true)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        isLogScale ? 'bg-forest-700 text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Logarithmisch (log₁₀ N)
                    </button>
                    <button
                      onClick={() => setIsLogScale(false)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        !isLogScale ? 'bg-forest-700 text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Linear (N)
                    </button>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-slate-50 p-2">
                  <canvas
                    ref={growthCurveCanvasRef}
                    width={620}
                    height={320}
                    className="w-full h-auto block"
                  />
                </div>

                {/* Timeline Navigation Slider */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Zeitpunkt verschieben: <strong>{simHours.toFixed(1)} h</strong></span>
                    <span className="font-bold text-forest-800">
                      {currentCount >= 1e6 ? `${(currentCount / 1e6).toFixed(2)} Mio.` : `${Math.round(currentCount)}`} KBE / ml
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="0.2"
                    value={simHours}
                    onChange={e => setSimHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Explanatory Cards for the 4 Phases */}
              <div className="lg:col-span-4 space-y-3">
                {GROWTH_PHASES.map((p, idx) => {
                  const isActive = currentPhase.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'border-forest-600 bg-forest-50 shadow-sm scale-[1.02]'
                          : 'border-gray-200 bg-white opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-900">
                          {idx + 1}. {p.name} ({p.germanName})
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  );
                })}

                {/* Math Takeaway Box */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs">
                  <strong className="block font-bold mb-1">📐 Das Verdopplungsgesetz:</strong>
                  \(N(t) = N_0 \cdot 2^{t/g}\). Nach 20 Generationen sind aus 1 Zelle bereits <strong>1.048.576 Zellen</strong> entstanden!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 3: PARAMETER-LABOR & JOGHURT-GÄRUNG                              */}
        {/* ========================================================================= */}
        {activeTab === 'parameters' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Parameter-Labor: Umwelteinflüsse, Zellatmung & Milchsäuregärung
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Erforsche die RGT-Regel, enzymatische Denaturierung und die Umschaltung zwischen
                <strong> aerober Zellatmung</strong> (hohe Biomasse) und <strong>anaerober Gärung</strong> (Joghurt/Bier).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Presets & Controls (Left) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Biotechnological Presets */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    🏭 Industrielle Praxis-Szenarien
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {BIOTECH_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedPreset === preset.id
                            ? 'border-forest-600 bg-forest-50 shadow-sm'
                            : 'border-gray-200 hover:border-forest-300 bg-white'
                        }`}
                      >
                        <strong className="text-xs font-bold text-gray-900 block truncate">
                          {preset.title}
                        </strong>
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          {preset.organism.split(' ')[0]} • {preset.temperature} °C
                        </span>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-700">
                          {preset.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Sliders */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    🎛️ Umwelt-Parameter regeln
                  </h3>

                  {/* Temperature Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Temperatur:</span>
                      <span className={`font-bold ${
                        temperature > 65 ? 'text-red-600' : temperature < 10 ? 'text-blue-600' : 'text-forest-800'
                      }`}>
                        {temperature} °C {temperature > 65 && '(Denaturierung!)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={temperature}
                      onChange={e => setTemperature(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>0°C (Eis)</span>
                      <span>4°C (Kühlschrank)</span>
                      <span>37°C (Optimum)</span>
                      <span>75°C (Pasteurisierung)</span>
                      <span>100°C</span>
                    </div>
                  </div>

                  {/* Oxygen Switch */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Sauerstoff-Belüftung:</span>
                      <span className="text-[11px] text-gray-500">
                        {isAerobic ? 'Zellatmung aktiv (O₂-Begasung)' : 'Sauerstoffausschluss (Gärung)'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsAerobic(!isAerobic)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isAerobic ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                      }`}
                    >
                      {isAerobic ? '🌬️ Aerob' : '🍶 Anaerob'}
                    </button>
                  </div>

                  {/* Glucose Level Slider */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Nährstoffgehalt (Glukose / Laktose):</span>
                      <span className="font-bold text-forest-800">{glucoseLevel} %</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={glucoseLevel}
                      onChange={e => setGlucoseLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Biochemical Effects & Explanation (Right) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Yogurt Deep-Dive Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🍶</span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Didaktischer Fokus: Die Joghurt-Herstellung
                      </h3>
                      <p className="text-xs text-forest-700">Biochemie der Milchsäuregärung</p>
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-2">
                    <p>
                      <strong>Reaktionsgleichung:</strong><br />
                      \(\text{C}_6\text{H}_{12}\text{O}_6 \text{ (Milchzucker)} \longrightarrow 2\,\text{C}_3\text{H}_6\text{O}_3 \text{ (Milchsäure)} + 2\,\text{ATP}\)
                    </p>
                    <p>
                      <strong>Die Kasein-Fällung:</strong> Milchproteine (Kasein-Mizellen) sind bei neutralem pH (6,8) negativ geladen und stoßen sich ab.
                      Durch die Milchsäure sinkt der pH auf <strong>4,2</strong> (isoelektrischer Punkt). Die Ladung neutralisiert sich, das Eiweiß denaturiert
                      und vernetzt sich zu einem festen Gitter – der flüssige Milchbrei wird stichfester Joghurt!
                    </p>
                  </div>
                </div>

                {/* Pasteurization & Sterilization Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                    <span>🔥 Thermische Keimabtötung</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                      <strong className="text-orange-900 block mb-1">Pasteurisierung (72–75 °C)</strong>
                      <p className="text-orange-800 text-[11px] leading-relaxed">
                        15–30 Sekunden. Tötet pathogene vegetative Keime (Salmonellen, Listerien) ab. Geschmack und Vitamine bleiben erhalten.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                      <strong className="text-red-900 block mb-1">Sterilisation (121 °C Autoklav)</strong>
                      <p className="text-red-800 text-[11px] leading-relaxed">
                        Dampfüberdruck für 20 Minuten. Zerstört selbst hitzestabile Bakteriensporen. Produkt ist absolut keimfrei.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 4: CHALLENGE: „LEBENSMITTEL RETTEN“ (KONSERVIERUNG)              */}
        {/* ========================================================================= */}
        {activeTab === 'challenge' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Intro */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 uppercase tracking-wider">
                Praxis-Labor
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                Challenge: Lebensmittel vor dem mikrobiellen Verderb retten!
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                Wähle ein empfindliches Lebensmittel aus und verhindere den Verderb durch gezielte
                biophysikalische und chemische Konservierungsmethoden (Temperatur, Osmose, pH, Sauerstoffentzug).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Product Selection & Actions (Left) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">
                  1. Lebensmittel auswählen:
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {FOOD_CHALLENGE_SCENARIOS.map(scen => (
                    <button
                      key={scen.id}
                      onClick={() => {
                        setSelectedScenarioId(scen.id);
                        setChallengeHours(0);
                      }}
                      className={`p-3 rounded-xl text-center border transition-all ${
                        selectedScenarioId === scen.id
                          ? 'border-forest-600 bg-forest-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-forest-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{scen.imageIcon}</span>
                      <strong className="text-xs font-bold text-gray-900 block">{scen.name}</strong>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
                  <p><strong>Ausgangslage:</strong> {selectedScenario.description}</p>
                  <p className="text-red-700 mt-1"><strong>Verderbniserreger:</strong> {selectedScenario.threatOrganisms}</p>
                </div>

                {/* Preservation Methods Checklist */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    2. Konservierungs-Methoden anwenden:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Cooling 4°C */}
                    <button
                      onClick={() => setChallengeActions(prev => ({ ...prev, cooling: !prev.cooling, freezing: false }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        challengeActions.cooling ? 'bg-blue-100 border-blue-500 font-bold text-blue-950' : 'bg-white border-gray-200'
                      }`}
                    >
                      <span>❄️ Kühlen (Kühlschrank 4 °C)</span>
                      <span>{challengeActions.cooling ? '✔️' : '➕'}</span>
                    </button>

                    {/* Freezing -18°C */}
                    <button
                      onClick={() => setChallengeActions(prev => ({ ...prev, freezing: !prev.freezing, cooling: false }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        challengeActions.freezing ? 'bg-cyan-100 border-cyan-500 font-bold text-cyan-950' : 'bg-white border-gray-200'
                      }`}
                    >
                      <span>🧊 Tiefkühlen (-18 °C)</span>
                      <span>{challengeActions.freezing ? '✔️' : '➕'}</span>
                    </button>

                    {/* Boiling 100°C */}
                    <button
                      onClick={() => setChallengeActions(prev => ({ ...prev, boiling: !prev.boiling, pasteurizing: false }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        challengeActions.boiling ? 'bg-orange-100 border-orange-500 font-bold text-orange-950' : 'bg-white border-gray-200'
                      }`}
                    >
                      <span>🔥 Kochen (100 °C Abkochen)</span>
                      <span>{challengeActions.boiling ? '✔️' : '➕'}</span>
                    </button>

                    {/* Pasteurizing 75°C */}
                    <button
                      onClick={() => setChallengeActions(prev => ({ ...prev, pasteurizing: !prev.pasteurizing, boiling: false }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        challengeActions.pasteurizing ? 'bg-amber-100 border-amber-500 font-bold text-amber-950' : 'bg-white border-gray-200'
                      }`}
                    >
                      <span>♨️ Pasteurisieren (75 °C)</span>
                      <span>{challengeActions.pasteurizing ? '✔️' : '➕'}</span>
                    </button>

                    {/* Salting / Sugar */}
                    <button
                      onClick={() => setChallengeActions(prev => ({ ...prev, salting: !prev.salting }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        challengeActions.salting ? 'bg-emerald-100 border-emerald-500 font-bold text-emerald-950' : 'bg-white border-gray-200'
                      }`}
                    >
                      <span>🧂 Salzen / Zuckern (Osmose)</span>
                      <span>{challengeActions.salting ? '✔️' : '➕'}</span>
                    </button>

                    {/* Acidifying / Vinegar */}
                    <button
                      onClick={() => setChallengeActions(prev => ({ ...prev, acidifying: !prev.acidifying }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        challengeActions.acidifying ? 'bg-purple-100 border-purple-500 font-bold text-purple-950' : 'bg-white border-gray-200'
                      }`}
                    >
                      <span>🍋 Säuern (Essig / pH 3,5)</span>
                      <span>{challengeActions.acidifying ? '✔️' : '➕'}</span>
                    </button>
                  </div>
                </div>

                {/* Storage Time Slider */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Lagerzeit simulieren: <strong>{challengeHours} Stunden</strong></span>
                    <span>(Entspricht {(challengeHours / 24).toFixed(1)} Tagen)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="168"
                    step="2"
                    value={challengeHours}
                    onChange={e => setChallengeHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0 h</span>
                    <span>24 h (1 Tag)</span>
                    <span>72 h (3 Tage)</span>
                    <span>168 h (1 Woche)</span>
                  </div>
                </div>
              </div>

              {/* Live Challenge Feedback & Shelf Life Results (Right) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col">
                <div className={`p-6 rounded-2xl border shadow-sm flex-1 flex flex-col justify-between ${
                  challengeResult.isSpoiled
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{challengeResult.isSpoiled ? '🤢' : '✨'}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        challengeResult.isSpoiled ? 'bg-red-200 text-red-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {challengeResult.isSpoiled ? 'VERDORBEN!' : 'EINWANDFREI ESSBAR'}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold">
                      {challengeResult.isSpoiled
                        ? 'Lebensmittel ist gekippt!'
                        : 'Perfekt konserviert!'}
                    </h4>

                    <div className="my-4 space-y-2 text-xs">
                      <div className="flex justify-between pb-1 border-b border-black/10">
                        <span>Keimzahl nach {challengeHours} h:</span>
                        <strong className="font-mono">{challengeResult.currentCount.toLocaleString()} KBE / ml</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-black/10">
                        <span>Kritische Verderbsgrenze:</span>
                        <span className="font-mono text-gray-600">{selectedScenario.spoilageThreshold.toLocaleString()} KBE / ml</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Errechnete Haltbarkeit:</span>
                        <strong>ca. {challengeResult.shelfLifeDays} Tage</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl text-xs text-gray-800 leading-relaxed">
                    <strong>Didaktischer Tipp:</strong>{' '}
                    {challengeResult.isSpoiled
                      ? 'Die Verdopplung war zu schnell! Kombiniere Kühlen (4 °C) mit vorherigem Abkochen oder Senkung des pH-Werts.'
                      : 'Hervorragende Hürden-Technologie! Durch die Kombination mehrerer Faktoren haben Keime keine Chance sich zu vermehren.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 5: DIDAKTISCHES QUIZ & FACHGLOSSAR                               */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quiz Container */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 uppercase tracking-wider">
                    Lernzielkontrolle B9 2 / B9 3
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    Bayerisches Lehrplan-Quiz: Bakterien & Biotechnologie
                  </h2>
                  <p className="text-xs text-gray-600">
                    6 fundierte Aufgaben zu Wachstumskinetik, Fermentern, Milchsäuregärung und Konservierung.
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

              {/* Questions */}
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

            {/* Glossary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    📖 Fachbegriff-Glossar: Mikrobiologie & Biotechnologie
                  </h3>
                  <p className="text-xs text-gray-600">
                    Wichtige Definitionen für die 9. Jahrgangsstufe am Gymnasium Bayern.
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
          BioApps • Johannes-Scharrer-Gymnasium • Entwickelt für den Biologieunterricht der 9. Jahrgangsstufe (LehrplanPLUS Bayern B9 2 / B9 3).
        </p>
      </footer>
    </div>
  );
}
