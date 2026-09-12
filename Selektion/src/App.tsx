import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ENVIRONMENT_PRESETS,
  EnvironmentPreset,
  LAMARCK_VS_DARWIN_TOPICS,
  LamarckVsDarwinTopic,
  TELEOLOGY_EXERCISES,
  SPECIATION_STEPS,
  QUIZ_QUESTIONS,
  GLOSSARY_ITEMS
} from './data';

// --- TYPE DEFINITIONS ---
interface Mouse {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  colorValue: number; // 0.0 (light sand) to 1.0 (pitch black)
  size: number;
  angle: number;
  isAlive: boolean;
  sniffTime: number;
  population?: 'A' | 'B';
}

interface GenerationHistory {
  generation: number;
  meanColor: number;
  darkAlleleFreq: number; // % with colorValue > 0.5
  groundBrightness: number;
  populationSize: number;
  event?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'habitat' | 'diagrams' | 'speciation' | 'theories' | 'quiz'>('habitat');

  // --- HABITAT SIMULATION STATE ---
  const [popSize, setPopSize] = useState<number>(60);
  const [groundBrightness, setGroundBrightness] = useState<number>(0.8); // 0.8 = sand
  const [predatorPressure, setPredatorPressure] = useState<number>(0.7); // 0.0 to 1.0
  const [mutationRate, setMutationRate] = useState<number>(0.05); // 5%
  const [generation, setGeneration] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [selectedPreset, setSelectedPreset] = useState<string>('sand');
  
  // History for charts
  const [history, setHistory] = useState<GenerationHistory[]>([
    { generation: 1, meanColor: 0.25, darkAlleleFreq: 0.15, groundBrightness: 0.8, populationSize: 60 }
  ]);

  // Mice entities
  const [mice, setMice] = useState<Mouse[]>([]);
  const miceRef = useRef<Mouse[]>([]);
  miceRef.current = mice;

  // Owl predator state
  const [owl, setOwl] = useState<{ x: number; y: number; targetId: number | null; isDiving: boolean; shadowRadius: number }>({
    x: 100,
    y: 100,
    targetId: null,
    isDiving: false,
    shadowRadius: 35
  });
  const owlRef = useRef(owl);
  owlRef.current = owl;

  // Canvas refs
  const habitatCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const histogramCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const speciationCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- INITIALIZE POPULATION ---
  const initMice = (customPopSize = popSize, initialMean = 0.25) => {
    const newMice: Mouse[] = [];
    for (let i = 0; i < customPopSize; i++) {
      // Gaussian-like initial distribution around initialMean
      const rand = (Math.random() + Math.random() + Math.random()) / 3;
      const colorVal = Math.max(0.05, Math.min(0.95, initialMean + (rand - 0.5) * 0.4));
      newMice.push({
        id: i + 1,
        x: 40 + Math.random() * 560,
        y: 40 + Math.random() * 320,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        colorValue: colorVal,
        size: 10 + Math.random() * 3,
        angle: Math.random() * Math.PI * 2,
        isAlive: true,
        sniffTime: Math.random() * 60
      });
    }
    setMice(newMice);
    setGeneration(1);
    setHistory([{
      generation: 1,
      meanColor: initialMean,
      darkAlleleFreq: newMice.filter(m => m.colorValue > 0.5).length / customPopSize,
      groundBrightness,
      populationSize: customPopSize
    }]);
  };

  useEffect(() => {
    initMice(60, 0.25);
  }, []);

  // --- HELPER: CONVERT COLOR VALUE TO RGB / HEX ---
  const getMouseColor = (val: number) => {
    // 0.0 is light sandy beige (#edd6b4), 0.5 is brown (#8c6747), 1.0 is basalt black (#1e2024)
    if (val < 0.5) {
      const t = val / 0.5;
      const r = Math.round(237 + t * (140 - 237));
      const g = Math.round(214 + t * (103 - 214));
      const b = Math.round(180 + t * (71 - 180));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (val - 0.5) / 0.5;
      const r = Math.round(140 + t * (30 - 140));
      const g = Math.round(103 + t * (32 - 103));
      const b = Math.round(71 + t * (36 - 71));
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const getGroundColorHex = (brightness: number) => {
    // 0.08 is basalt (#1a1c20), 0.8 is sand (#d6b88d)
    const t = Math.max(0, Math.min(1, brightness));
    const r = Math.round(26 + t * (214 - 26));
    const g = Math.round(28 + t * (184 - 28));
    const b = Math.round(32 + t * (141 - 32));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // --- PRESET SELECTOR ---
  const handleSelectPreset = (preset: EnvironmentPreset) => {
    setSelectedPreset(preset.id);
    setGroundBrightness(preset.groundBrightness);
    
    // Add historic event marker
    setHistory(prev => [
      ...prev,
      {
        ...prev[prev.length - 1],
        event: `${preset.name} (${Math.round(preset.groundBrightness * 100)} % Helligkeit)`
      }
    ]);
  };

  // --- PREDATION & SELECTION STEP ---
  const stepGeneration = () => {
    const currentMice = miceRef.current;
    if (currentMice.length === 0) return;

    // Calculate survival probability based on contrast to ground
    // Contrast = |mouse.colorValue - groundBrightness|
    // High contrast = high probability of being spotted by predator
    const survivors: Mouse[] = [];
    const preyKilled: Mouse[] = [];

    currentMice.forEach(m => {
      const contrast = Math.abs(m.colorValue - groundBrightness);
      // Risk score between 0 and 1
      const spotRisk = Math.pow(contrast, 1.4) * predatorPressure * 0.85;
      if (Math.random() < spotRisk) {
        preyKilled.push(m);
      } else {
        survivors.push(m);
      }
    });

    // Ensure we keep at least 8 survivors to prevent total extinction
    let actualSurvivors = survivors;
    if (survivors.length < 8) {
      // Keep the 8 mice with lowest contrast
      const sorted = [...currentMice].sort((a, b) => {
        const cA = Math.abs(a.colorValue - groundBrightness);
        const cB = Math.abs(b.colorValue - groundBrightness);
        return cA - cB;
      });
      actualSurvivors = sorted.slice(0, 8);
    }

    // Reproduction: generate next generation offspring from survivors
    const nextGen: Mouse[] = [];
    const targetCount = popSize;

    for (let i = 0; i < targetCount; i++) {
      // Pick two random parents from survivors
      const p1 = actualSurvivors[Math.floor(Math.random() * actualSurvivors.length)];
      const p2 = actualSurvivors[Math.floor(Math.random() * actualSurvivors.length)];

      // Inherited color value is average of parents plus random recombination noise
      let childColor = (p1.colorValue + p2.colorValue) / 2 + (Math.random() - 0.5) * 0.08;

      // Mutation
      if (Math.random() < mutationRate) {
        // Random mutation up or down
        childColor += (Math.random() - 0.5) * 0.35;
      }

      // Bound between 0.05 and 0.95
      childColor = Math.max(0.05, Math.min(0.95, childColor));

      nextGen.push({
        id: i + 1,
        x: 40 + Math.random() * 560,
        y: 40 + Math.random() * 320,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        colorValue: childColor,
        size: 10 + Math.random() * 3,
        angle: Math.random() * Math.PI * 2,
        isAlive: true,
        sniffTime: Math.random() * 60
      });
    }

    const nextGenNum = generation + 1;
    const meanCol = nextGen.reduce((acc, m) => acc + m.colorValue, 0) / nextGen.length;
    const darkFreq = nextGen.filter(m => m.colorValue > 0.5).length / nextGen.length;

    setMice(nextGen);
    setGeneration(nextGenNum);
    setHistory(prev => [
      ...prev,
      {
        generation: nextGenNum,
        meanColor: meanCol,
        darkAlleleFreq: darkFreq,
        groundBrightness,
        populationSize: targetCount
      }
    ]);
  };

  // --- ANIMATION LOOP (HABITAT CANVAS) ---
  useEffect(() => {
    let animFrame: number;
    let cycleCounter = 0;

    const render = () => {
      const canvas = habitatCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Habitat Ground
      ctx.fillStyle = getGroundColorHex(groundBrightness);
      ctx.fillRect(0, 0, w, h);

      // Subtle texture dots (gravel / rock / sand grain)
      ctx.fillStyle = groundBrightness > 0.5 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 70; i++) {
        const rx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
        const ry = (Math.cos(i * 33) * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update & Draw Mice
      const curMice = miceRef.current;
      curMice.forEach(m => {
        // Move mouse
        if (m.sniffTime > 0) {
          m.sniffTime--;
        } else {
          m.x += m.vx * simSpeed;
          m.y += m.vy * simSpeed;

          // Bounce off walls
          if (m.x < 20) { m.x = 20; m.vx *= -1; }
          if (m.x > w - 20) { m.x = w - 20; m.vx *= -1; }
          if (m.y < 20) { m.y = 20; m.vy *= -1; }
          if (m.y > h - 20) { m.y = h - 20; m.vy *= -1; }

          // Random turn & pause
          if (Math.random() < 0.03) {
            m.vx = (Math.random() - 0.5) * 2;
            m.vy = (Math.random() - 0.5) * 2;
            m.angle = Math.atan2(m.vy, m.vx);
          }
          if (Math.random() < 0.01) {
            m.sniffTime = 20 + Math.random() * 40;
          }
        }

        // Draw Mouse
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle || Math.atan2(m.vy, m.vx));

        // Tail
        ctx.strokeStyle = '#d4a373';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-m.size, 0);
        ctx.quadraticCurveTo(-m.size * 1.8, Math.sin(Date.now() * 0.01 + m.id) * 4, -m.size * 2.2, 0);
        ctx.stroke();

        // Body ellipse
        ctx.fillStyle = getMouseColor(m.colorValue);
        ctx.beginPath();
        ctx.ellipse(0, 0, m.size, m.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ears
        ctx.fillStyle = '#fbcfe8'; // pink inner ear
        ctx.beginPath();
        ctx.arc(-m.size * 0.2, -m.size * 0.5, m.size * 0.25, 0, Math.PI * 2);
        ctx.arc(-m.size * 0.2, m.size * 0.5, m.size * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(m.size * 0.4, -m.size * 0.3, 1.5, 0, Math.PI * 2);
        ctx.arc(m.size * 0.4, m.size * 0.3, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(m.size * 0.9, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 3. Draw Predatory Owl Shadow
      const curOwl = owlRef.current;
      curOwl.x += 1.5 * simSpeed;
      curOwl.y += 0.8 * simSpeed;
      if (curOwl.x > w + 60) {
        curOwl.x = -60;
        curOwl.y = 50 + Math.random() * (h - 100);
      }

      // Flying silhouette / shadow
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
      ctx.beginPath();
      ctx.ellipse(curOwl.x, curOwl.y, 45, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Wing flapping shape
      const flap = Math.sin(Date.now() * 0.008 * simSpeed);
      ctx.beginPath();
      ctx.moveTo(curOwl.x - 30, curOwl.y);
      ctx.quadraticCurveTo(curOwl.x - 10, curOwl.y - 35 * flap, curOwl.x + 35, curOwl.y);
      ctx.quadraticCurveTo(curOwl.x - 10, curOwl.y + 35 * flap, curOwl.x - 30, curOwl.y);
      ctx.fill();
      ctx.restore();

      // 4. Automatic generation advance if running
      if (isRunning) {
        cycleCounter += simSpeed;
        if (cycleCounter >= 180) { // ~3 seconds per generation at 60fps
          cycleCounter = 0;
          stepGeneration();
        }
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [isRunning, simSpeed, groundBrightness, predatorPressure, mutationRate, popSize, generation]);

  // --- RENDER HISTOGRAM CANVAS ---
  useEffect(() => {
    const canvas = histogramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Bins from 0.0 to 1.0
    const numBins = 10;
    const bins = new Array(numBins).fill(0);
    mice.forEach(m => {
      const idx = Math.min(numBins - 1, Math.floor(m.colorValue * numBins));
      bins[idx]++;
    });

    const maxCount = Math.max(1, ...bins, 25);
    const barWidth = (w - 60) / numBins;

    // Draw background grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gy = h - 35 - (i / 4) * (h - 60);
      ctx.beginPath();
      ctx.moveTo(40, gy);
      ctx.lineTo(w - 10, gy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(Math.round((i / 4) * maxCount).toString(), 15, gy + 3);
    }

    // Draw bars
    bins.forEach((count, i) => {
      const x = 45 + i * barWidth;
      const barH = (count / maxCount) * (h - 60);
      const y = h - 35 - barH;

      const binCenter = (i + 0.5) / numBins;
      ctx.fillStyle = getMouseColor(binCenter);
      ctx.fillRect(x + 2, y, barWidth - 4, barH);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(x + 2, y, barWidth - 4, barH);

      // Label at bottom
      ctx.fillStyle = '#334155';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`${Math.round(i * 10)}%`, x + 3, h - 20);
    });

    // Mark current ground brightness
    const groundX = 45 + groundBrightness * (w - 60);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(groundX, 15);
    ctx.lineTo(groundX, h - 35);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('🎯 Bodenfarbe', Math.min(groundX - 35, w - 85), 12);
  }, [mice, groundBrightness]);

  // --- RENDER TIMELINE HISTORY CANVAS ---
  useEffect(() => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (history.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText('Lasse die Simulation einige Generationen laufen, um den Verlauf zu sehen...', 30, h / 2);
      return;
    }

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gy = 25 + (i / 4) * (h - 55);
      ctx.beginPath();
      ctx.moveTo(40, gy);
      ctx.lineTo(w - 15, gy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${100 - i * 25}%`, 10, gy + 3);
    }

    const maxGen = Math.max(20, history[history.length - 1].generation);
    const plotW = w - 60;
    const plotH = h - 55;

    // Draw ground brightness reference line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    history.forEach((hist, i) => {
      const x = 45 + ((hist.generation - 1) / maxGen) * plotW;
      const y = 25 + (1 - hist.groundBrightness) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Mean Color Line (Green / Forest)
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    history.forEach((hist, i) => {
      const x = 45 + ((hist.generation - 1) / maxGen) * plotW;
      const y = 25 + (1 - hist.meanColor) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Dark Allele Frequency Line (Dark Gray / Black)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((hist, i) => {
      const x = 45 + ((hist.generation - 1) / maxGen) * plotW;
      const y = 25 + (1 - hist.darkAlleleFreq) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Event Markers
    history.forEach(hist => {
      if (hist.event) {
        const ex = 45 + ((hist.generation - 1) / maxGen) * plotW;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ex, 15);
        ctx.lineTo(ex, h - 30);
        ctx.stroke();

        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText(hist.event.split(' ')[0], ex + 2, 22);
      }
    });

    // X Axis Labels
    ctx.fillStyle = '#475569';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('Gen 1', 45, h - 10);
    ctx.fillText(`Gen ${maxGen}`, w - 45, h - 10);
  }, [history]);

  // --- ALLOPATRIC SPECIATION EXPERIMENT STATE ---
  const [canyonOpen, setCanyonOpen] = useState<boolean>(false);
  const [speciationGenerations, setSpeciationGenerations] = useState<number>(0);
  const [popAColor, setPopAColor] = useState<number>(0.2); // Left starts light
  const [popBColor, setPopBColor] = useState<number>(0.2); // Right starts light
  const [groundLeft, setGroundLeft] = useState<number>(0.08); // Basalt lava
  const [groundRight, setGroundRight] = useState<number>(0.85); // Light sand
  const [matingTestResult, setMatingTestResult] = useState<{
    tested: boolean;
    divergence: number;
    successRate: number;
    title: string;
    description: string;
    isIsolated: boolean;
  } | null>(null);

  // Allopatric step
  const stepSpeciationGeneration = () => {
    setSpeciationGenerations(prev => prev + 1);
    // If canyon is closed (barrier exists), both populations evolve toward their local ground
    if (canyonOpen) {
      setPopAColor(prev => prev + (groundLeft - prev) * 0.15 + (Math.random() - 0.5) * 0.04);
      setPopBColor(prev => prev + (groundRight - prev) * 0.15 + (Math.random() - 0.5) * 0.04);
    } else {
      // Free migration / gene flow homogenizes them
      const avg = (popAColor + popBColor) / 2;
      setPopAColor(avg + (Math.random() - 0.5) * 0.02);
      setPopBColor(avg + (Math.random() - 0.5) * 0.02);
    }
  };

  const handleTestMating = () => {
    // Divergence depends on generations separated and phenotypic distance
    const colorDist = Math.abs(popAColor - popBColor);
    const timeFactor = Math.min(1.0, speciationGenerations / 30);
    const totalDivergence = colorDist * 0.6 + timeFactor * 0.5;

    if (speciationGenerations < 8) {
      setMatingTestResult({
        tested: true,
        divergence: Math.round(totalDivergence * 100),
        successRate: 95,
        title: 'Keine Isolation – Eine einzige Art (Panmixie)',
        description: 'Tiere beider Gruppen erkennen sich uneingeschränkt als Paarungspartner. Es entstehen voll fruchtbare Nachkommen. Der Genfluss vermischt die Populationen sofort wieder.',
        isIsolated: false
      });
    } else if (speciationGenerations < 25) {
      setMatingTestResult({
        tested: true,
        divergence: Math.round(totalDivergence * 100),
        successRate: 40,
        title: 'Beginnende Präzygotische Isolation (Unterarten)',
        description: 'Veränderte Duftmarken und abweichende Paarungsrufe führen dazu, dass 60 % der Annäherungen abgebrochen werden. Hybride zeigen verringerte Fitness (Hybriddepression). Noch keine vollwertigen Arten!',
        isIsolated: false
      });
    } else {
      setMatingTestResult({
        tested: true,
        divergence: Math.round(totalDivergence * 100),
        successRate: 0,
        title: '🎉 Vollständige Reproduktive Isolation: Zwei neue Biospezies!',
        description: 'Die getrennte Evolution über viele Generationen hat das Paarungsverhalten (Balzsignale) und das Genom so weit verändert, dass keine Paarung mehr stattfindet (präzygotisch) oder Gameten inkompatibel sind (postzygotisch). Aus einer Stammart sind zwei eigenständige Arten entstanden!',
        isIsolated: true
      });
    }
  };

  // --- WEISMANN EXPERIMENT (LAMARCK LAB) ---
  const [paintedMouse, setPaintedMouse] = useState<{
    originalColor: number;
    isSootCoated: boolean;
    offspringCount: number;
    offspringColors: number[];
  }>({
    originalColor: 0.8, // natural sand color
    isSootCoated: false,
    offspringCount: 0,
    offspringColors: []
  });

  const handlePaintMouse = () => {
    setPaintedMouse(prev => ({
      ...prev,
      isSootCoated: true
    }));
  };

  const handleBreedPaintedMouse = () => {
    // Generate offspring: ALL babies inherit the GENETIC color, NOT the soot!
    const babies = [0.78, 0.82, 0.80, 0.79, 0.83];
    setPaintedMouse(prev => ({
      ...prev,
      offspringCount: prev.offspringCount + 1,
      offspringColors: babies
    }));
  };

  const handleResetWeismann = () => {
    setPaintedMouse({
      originalColor: 0.8,
      isSootCoated: false,
      offspringCount: 0,
      offspringColors: []
    });
  };

  // --- TELEOLOGY EXERCISE STATE ---
  const [teleologyIndex, setTeleologyIndex] = useState<number>(0);
  const [selectedTeleologyOption, setSelectedTeleologyOption] = useState<number | null>(null);

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

  // --- GLOSSARY SEARCH STATE ---
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Evolution – Selektion & Artbildung
                </h1>
                <p className="text-xs text-forest-700 font-medium">
                  LehrplanPLUS Bayern • Biologie 9. Klasse (B9 3)
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
            { id: 'habitat', label: '🏜️ 1. Live-Habitat', desc: 'Selektions-Simulator' },
            { id: 'diagrams', label: '📊 2. Populationsgenetik', desc: 'Gauß-Kurve & Allele' },
            { id: 'speciation', label: '🏔️ 3. Artbildung', desc: 'Canyon & Isolation' },
            { id: 'theories', label: '🦒 4. Lamarck vs. Darwin', desc: 'Fehlkonzept-Labor' },
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
        {/* STATION 1: LIVE-HABITAT (2D CANVAS SIMULATOR)                            */}
        {/* ========================================================================= */}
        {activeTab === 'habitat' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Didactic Intro Banner */}
            <div className="bg-gradient-to-r from-forest-700 to-forest-800 rounded-2xl p-5 text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-600 text-forest-100 uppercase tracking-wider mb-2">
                    Natürliche Selektion in Aktion
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Das Felsentaschenmaus-Experiment (Chaetodipus intermedius)
                  </h2>
                  <p className="text-forest-100 text-sm mt-1 max-w-3xl">
                    Die Eule jagt visuell nach dem <strong>Farbkontrast</strong> zwischen Fell und Untergrund.
                    Mäuse passen sich nicht willentlich an – zufällige Mutationen erzeugen vorab Variabilität,
                    die Umwelt wählt durch Beutegreifung aus!
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[130px] border border-white/20">
                  <div className="text-xs text-forest-200 font-medium">Generation</div>
                  <div className="text-3xl font-extrabold">{generation}</div>
                  <div className="text-[11px] text-forest-200 mt-0.5">Pop: {mice.length} Mäuse</div>
                </div>
              </div>
            </div>

            {/* Simulation Layout: Canvas Left + Controls Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 2D Canvas Container */}
              <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-forest-200 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-gray-800">
                      Live-Biotop (640 × 380 px)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d6b88d] border border-gray-400" /> Hell
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1a1c20]" /> Schwarz
                    </span>
                    <span className="text-forest-700 font-medium ml-2">🦉 Eule auf Beutezug</span>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-inner border border-gray-300">
                  <canvas
                    ref={habitatCanvasRef}
                    width={640}
                    height={380}
                    className="w-full h-auto block cursor-crosshair"
                  />
                  {/* Overlay for quick info */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono">
                    Ø Fellfarbe: {Math.round((history[history.length - 1]?.meanColor || 0.25) * 100)} % Dunkel
                  </div>
                </div>

                {/* Primary Simulation Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-forest-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-sm transition-all ${
                        isRunning
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-forest-700 hover:bg-forest-800 text-white'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          <span>Start (Dauerlauf)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={stepGeneration}
                      disabled={isRunning}
                      className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-forest-100 hover:bg-forest-200 text-forest-800 disabled:opacity-50 transition-colors"
                      title="Simuliert einen Beutezug der Eule und verpaart die Überlebenden"
                    >
                      ⏭️ 1 Generation weiter
                    </button>

                    <button
                      onClick={() => initMice(popSize, 0.25)}
                      className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Auf Ausgangspopulation zurücksetzen"
                    >
                      🔄 Reset
                    </button>
                  </div>

                  {/* Speed Controls */}
                  <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                    <span className="px-2 text-gray-500">Tempo:</span>
                    {[1, 2, 5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => setSimSpeed(spd)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          simSpeed === spd ? 'bg-white text-forest-800 shadow-sm font-bold' : 'text-gray-600'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Environmental Control Center */}
              <div className="lg:col-span-4 space-y-4">
                {/* Environmental Presets */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                    <span>🌍 Umwelt-Ereignis wählen</span>
                    <span className="text-xs text-forest-700">Plötzlicher Wandel</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ENVIRONMENT_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2.5 rounded-xl text-left transition-all border ${
                          selectedPreset === preset.id
                            ? 'border-forest-600 bg-forest-50 shadow-sm'
                            : 'border-gray-200 hover:border-forest-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-inner border border-gray-400 shrink-0"
                            style={{ backgroundColor: preset.groundColor }}
                          />
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {preset.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-1">
                          {preset.badge}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Manual Ground Color Slider */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Bodenfarbe (Helligkeit):</span>
                      <span className="font-bold text-forest-800">
                        {groundBrightness > 0.6 ? 'Heller Sand' : groundBrightness > 0.3 ? 'Brauner Humus' : 'Pechschwarze Lava'} ({Math.round(groundBrightness * 100)} %)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.01"
                      value={groundBrightness}
                      onChange={e => {
                        setGroundBrightness(parseFloat(e.target.value));
                        setSelectedPreset('custom');
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>Lava (0 %)</span>
                      <span>Waldboden (50 %)</span>
                      <span>Sandstein (100 %)</span>
                    </div>
                  </div>
                </div>

                {/* Evolutionary Parameter Sliders */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                    <span>⚙️ Selektions-Parameter</span>
                  </h3>

                  {/* Predator Pressure */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Räuber-Jagddruck (Eule):</span>
                      <span className="font-bold text-forest-800">
                        {predatorPressure === 0 ? 'Ausgeschaltet (0 %)' : `${Math.round(predatorPressure * 100)} %`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={predatorPressure}
                      onChange={e => setPredatorPressure(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      {predatorPressure === 0
                        ? '⚠️ Kein Selektionsdruck: Nur zufällige Gendrift!'
                        : 'Hoher Druck: Kontrastreiche Mäuse werden sofort geschlagen.'}
                    </p>
                  </div>

                  {/* Mutation Rate */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Spontanmutations-Rate:</span>
                      <span className="font-bold text-forest-800">{Math.round(mutationRate * 100)} %</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.2"
                      step="0.01"
                      value={mutationRate}
                      onChange={e => setMutationRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Erzeugt neue, ungerichtete Farbvarianten in jeder Generation.
                    </p>
                  </div>
                </div>

                {/* Didactic Takeaway Card */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                  <span className="font-bold block mb-1">💡 Darwinistischer Goldstandard:</span>
                  Schalte plötzlich auf <em>„Vulkanausbruch (Lavafeld)“</em>. Beobachte, wie die hellen Mäuse innerhalb von 10–20 Generationen verschwinden, weil die Eule sie sofort erbeutet. Nicht der Wille der Maus, sondern der <strong>Fortpflanzungserfolg (Fitness)</strong> formt die Population!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 2: POPULATIONSGENETIK & ECHTZEIT-DIAGRAMME                       */}
        {/* ========================================================================= */}
        {activeTab === 'diagrams' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Populationsgenetik: Phänotypen & Allelfrequenzen über Generationen
              </h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Evolution ist mathematisch definiert als <strong>die Veränderung von Allelhäufigkeiten in einem Genpool</strong> über Generationen.
                Unten siehst du die Verteilung der Phänotypen in Echtzeit und den Verlauf über Generation 1 bis {generation}.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Histogram: Phenotype Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-forest-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Häufigkeitsverteilung der Fellfarben (Gen {generation})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Histogramm der aktuellen Population (Gaußsche Normalverteilung)
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold">
                    N = {mice.length}
                  </span>
                </div>

                <canvas
                  ref={histogramCanvasRef}
                  width={520}
                  height={240}
                  className="w-full h-auto bg-slate-50 rounded-xl border border-gray-200"
                />

                <div className="mt-3 text-xs text-gray-600 flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
                  <span>
                    <strong>Mittelwert:</strong> {Math.round((history[history.length - 1]?.meanColor || 0.25) * 100)} % Dunkelpigment
                  </span>
                  <span>
                    <strong>Dunkel-Allel (D):</strong> {Math.round((history[history.length - 1]?.darkAlleleFreq || 0.15) * 100)} %
                  </span>
                </div>
              </div>

              {/* Timeline Graph */}
              <div className="bg-white rounded-2xl shadow-sm border border-forest-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Allel- & Phänotyp-Verlauf (Gen 1 bis {generation})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Grün: Mittlere Fellfarbe | Schwarz: Dunkel-Allel (D) | Grau: Boden
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!isRunning) stepGeneration();
                    }}
                    className="px-2.5 py-1 bg-forest-700 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors"
                  >
                    +1 Gen züchten
                  </button>
                </div>

                <canvas
                  ref={timelineCanvasRef}
                  width={520}
                  height={240}
                  className="w-full h-auto bg-slate-50 rounded-xl border border-gray-200"
                />

                <div className="mt-3 text-xs text-gray-600 flex flex-wrap gap-4 items-center bg-gray-50 p-2.5 rounded-xl">
                  <span className="inline-flex items-center gap-1.5 font-medium text-forest-700">
                    <span className="w-3 h-1 bg-forest-700 rounded-full" /> Ø Fellfarbe
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                    <span className="w-3 h-1 bg-slate-900 rounded-full" /> Allelfrequenz D
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-gray-500">
                    <span className="w-3 h-0.5 border-t border-dashed border-gray-500" /> Bodenfarbe
                  </span>
                </div>
              </div>
            </div>

            {/* Selection Types Theory Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Die drei Grundformen der natürlichen Selektion (LehrplanPLUS B9 3)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-forest-50 border border-forest-200">
                  <div className="flex items-center space-x-2 text-forest-800 font-bold text-sm mb-1.5">
                    <span>➡️</span>
                    <h4>Gerichtete Selektion</h4>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Ein einzelnes phänotypisches Extrem wird begünstigt (z. B. nur dunkle Mäuse auf neuer Basaltlava).
                    <strong> Folge:</strong> Die Verteilungskurve verschiebt sich gerichtet in eine Richtung.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-800 font-bold text-sm mb-1.5">
                    <span>🎯</span>
                    <h4>Stabilisierende Selektion</h4>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Der Mittelwert ist am besten angepasst; beide Extreme werden benachteiligt (z. B. mittleres Geburtsgewicht beim Menschen).
                    <strong> Folge:</strong> Die Kurve wird schmaler und steiler; die Variabilität sinkt.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm mb-1.5">
                    <span>⚡</span>
                    <h4>Disruptive Selektion</h4>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Beide Extreme sind im Vorteil (z. B. sehr helle auf Sand UND sehr dunkle auf Fels; Zwischenformen fallen überall auf).
                    <strong> Folge:</strong> Die Kurve bildet zwei Gipfel; Vorstufe zur Artbildung!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 3: ALLOPATRISCHE ARTBILDUNG (GEOGRAPHISCHE ISOLATION)            */}
        {/* ========================================================================= */}
        {activeTab === 'speciation' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Speciation Overview Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 uppercase tracking-wider">
                Makroevolution & Artbildung
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                Experiment: Allopatrische Artbildung durch geographische Isolation
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                Öffne die Barriere (Canyon / reißender Fluss), um die Population in zwei Hälften zu teilen.
                Lasse auf beiden Seiten getrennte Selektionsdrücke wirken. Teste anschließend,
                ob sich die Gruppen noch erfolgreich paaren können (Reproduktive Isolation)!
              </p>
            </div>

            {/* Split Habitat Canvas & Interactive Speciation Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dual Habitat Box */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-forest-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900">
                      Geteiltes Verbreitungsgebiet
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      canyonOpen ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {canyonOpen ? '⛔ Barriere aktiv (m = 0)' : '🟢 Genfluss frei (m = 1)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    Getrennt seit: <strong>{speciationGenerations} Generationen</strong>
                  </span>
                </div>

                {/* SVG Split Representation */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-inner h-[280px]">
                  {/* Left Habitat A */}
                  <div
                    className="absolute inset-y-0 left-0 transition-colors duration-500 flex flex-col justify-between p-4"
                    style={{
                      width: canyonOpen ? '46%' : '50%',
                      backgroundColor: getGroundColorHex(groundLeft)
                    }}
                  >
                    <div className="bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold w-fit">
                      Gebiet A: Vulkanfeld ({Math.round((1 - popAColor) * 100)} % Dunkel)
                    </div>

                    {/* Mice representations on side A */}
                    <div className="flex flex-wrap gap-2 items-center justify-center p-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-4 rounded-full shadow-sm border border-black/20 transition-all duration-300 transform hover:scale-125"
                          style={{ backgroundColor: getMouseColor(popAColor + (Math.sin(i * 3) * 0.08)) }}
                          title={`Individuum A-${i+1}`}
                        />
                      ))}
                    </div>

                    <div className="text-[11px] text-white/90 font-medium">
                      Selektion: Kaltes Basalt-Lavafeld
                    </div>
                  </div>

                  {/* Center Barrier: Canyon / River */}
                  {canyonOpen && (
                    <div
                      className="absolute inset-y-0 left-[46%] w-[8%] bg-gradient-to-r from-amber-900 via-blue-600 to-amber-900 flex flex-col items-center justify-center text-white text-center shadow-lg border-x-2 border-amber-950 animate-pulse"
                      title="Unüberwindbarer Canyon mit tiefem Wildwasserfluss"
                    >
                      <span className="text-xs font-black rotate-90 whitespace-nowrap">
                        🌊 CANYON 🌊
                      </span>
                    </div>
                  )}

                  {/* Right Habitat B */}
                  <div
                    className="absolute inset-y-0 right-0 transition-colors duration-500 flex flex-col justify-between p-4"
                    style={{
                      width: canyonOpen ? '46%' : '50%',
                      backgroundColor: getGroundColorHex(groundRight)
                    }}
                  >
                    <div className="bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold w-fit ml-auto">
                      Gebiet B: Wüstensand ({Math.round((1 - popBColor) * 100)} % Dunkel)
                    </div>

                    {/* Mice representations on side B */}
                    <div className="flex flex-wrap gap-2 items-center justify-center p-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-4 rounded-full shadow-sm border border-black/20 transition-all duration-300 transform hover:scale-125"
                          style={{ backgroundColor: getMouseColor(popBColor + (Math.sin(i * 5) * 0.08)) }}
                          title={`Individuum B-${i+1}`}
                        />
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-900 font-medium text-right">
                      Selektion: Heißer Quarzsand
                    </div>
                  </div>
                </div>

                {/* Speciation Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCanyonOpen(!canyonOpen);
                        setMatingTestResult(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${
                        canyonOpen
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-red-700 hover:bg-red-800 text-white'
                      }`}
                    >
                      {canyonOpen ? '🌉 Canyon schließen (Barriere weg)' : '🏔️ Canyon öffnen (Isolation!)'}
                    </button>

                    <button
                      onClick={stepSpeciationGeneration}
                      className="px-3.5 py-2 bg-forest-100 hover:bg-forest-200 text-forest-900 rounded-xl text-sm font-semibold transition-colors"
                    >
                      ⏭️ +1 Generation trennen
                    </button>

                    <button
                      onClick={() => {
                        for (let i = 0; i < 10; i++) stepSpeciationGeneration();
                      }}
                      className="px-3 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      ⏩ +10 Generationen
                    </button>
                  </div>

                  <button
                    onClick={handleTestMating}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <span>🔬 Paarungsfähigkeitstest</span>
                  </button>
                </div>
              </div>

              {/* Mating Test Results & Explanations */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    🧪 Paarungstest: Reproduktive Isolation
                  </h3>
                  {matingTestResult ? (
                    <div className={`p-4 rounded-xl border ${
                      matingTestResult.isIsolated
                        ? 'bg-purple-50 border-purple-300 text-purple-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Divergenz: {matingTestResult.divergence} %
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">
                          Erfolg: {matingTestResult.successRate} %
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold mb-1">
                        {matingTestResult.title}
                      </h4>
                      <p className="text-xs leading-relaxed mt-1">
                        {matingTestResult.description}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
                      Öffne den Canyon, lasse 20–30 Generationen getrennt evolvieren und klicke auf <strong>„Paarungsfähigkeitstest“</strong>!
                    </div>
                  )}
                </div>

                {/* The 5 Steps of Allopatric Speciation */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Stufen der allopatrischen Artbildung:
                  </h3>
                  <div className="space-y-2.5">
                    {SPECIATION_STEPS.map(step => (
                      <div key={step.stepNumber} className="flex items-start space-x-2.5 text-xs">
                        <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {step.stepNumber}
                        </span>
                        <div>
                          <strong className="text-gray-900">{step.title}</strong>
                          <p className="text-gray-600 text-[11px] leading-tight mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 4: LAMARCK VS. DARWIN (FEHLKONZEPT-LABOR)                       */}
        {/* ========================================================================= */}
        {activeTab === 'theories' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-forest-200">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 uppercase tracking-wider">
                Didaktischer Schwerpunkt (B9 3)
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                Lamarckismus vs. Darwinismus: Die Teleologie-Falle dekonstruieren
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                Schüler denken intuitiv: <em>„Die Maus wurde dunkel, DAMIT sie überlebt.“</em> Das ist Lamarcks widerlegter Irrtum!
                Erforsche hier den Gegenbeweis über die Weismann-Barriere und trainiere die korrekte darwinistische Ausdrucksweise.
              </p>
            </div>

            {/* Part A: The Weismann Modification Experiment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center justify-between">
                <span>🧪 Das Weismann-Experiment: Modifikation vs. Mutation</span>
                <span className="text-xs text-forest-700 font-medium">Interaktiver Gegenbeweis</span>
              </h3>
              <p className="text-xs text-gray-600 mb-4 max-w-3xl">
                Lamarck behauptete: Erworbene Merkmale (Modifikationen) vererben sich an die nächste Generation.
                August Weismann bewies 1889: Veränderungen am Körper (Soma) gelangen niemals in die Keimzellen (Spermien/Eizellen)!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 bg-forest-50/60 rounded-xl border border-forest-200">
                {/* Step 1: Adult Mouse */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">1. Eltern-Maus (Genotyp: dd)</span>
                  <div className="my-3 flex justify-center">
                    <div
                      className="w-16 h-12 rounded-full shadow-md border border-gray-400 flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: paintedMouse.isSootCoated ? '#1a1c20' : '#d6b88d'
                      }}
                    >
                      <span className="text-[10px] text-white font-bold bg-black/40 px-1 rounded">
                        {paintedMouse.isSootCoated ? 'Kohlrabenschwarz (Ruß)' : 'Natur Sandfarbe'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePaintMouse}
                    disabled={paintedMouse.isSootCoated}
                    className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    🎨 Maus mit Ruß schwarz anmalen
                  </button>
                </div>

                {/* Step 2: Breeding */}
                <div className="text-center space-y-2">
                  <span className="text-2xl block">➔</span>
                  <button
                    onClick={handleBreedPaintedMouse}
                    disabled={!paintedMouse.isSootCoated}
                    className="py-2.5 px-4 bg-forest-700 hover:bg-forest-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    🐭 Nachkommen zeugen lassen
                  </button>
                  <button
                    onClick={handleResetWeismann}
                    className="text-[11px] text-gray-500 hover:text-gray-800 block mx-auto underline"
                  >
                    Experiment zurücksetzen
                  </button>
                </div>

                {/* Step 3: Offspring result */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">2. Nachkommen (Filialgeneration)</span>
                  <div className="my-3 flex justify-center gap-1.5 flex-wrap min-h-[48px] items-center">
                    {paintedMouse.offspringColors.length > 0 ? (
                      paintedMouse.offspringColors.map((col, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-5 rounded-full shadow-inner border border-gray-300 animate-fadeIn"
                          style={{ backgroundColor: getMouseColor(col) }}
                          title="Baby-Maus: Sandfarben!"
                        />
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Noch keine Nachkommen gezeugt</span>
                    )}
                  </div>
                  {paintedMouse.offspringColors.length > 0 && (
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                      Ergebnis: 100 % Sandfarben! Die schwarze Modifikation wurde NICHT vererbt.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Part B: Classic Comparative Case Studies */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Vergleich der beiden Theorien an 4 klassischen Fallbeispielen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LAMARCK_VS_DARWIN_TOPICS.map(topic => (
                  <div key={topic.id} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{topic.title}</h4>
                      <span className="text-[11px] text-forest-700 italic">{topic.organism}</span>
                    </div>
                    <p className="text-xs text-gray-700 italic">
                      „{topic.question}“
                    </p>

                    <div className="space-y-2 text-xs">
                      {/* Lamarck Column */}
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-950">
                        <strong className="block text-red-800 font-bold mb-0.5">
                          ❌ Lamarcks Erklärung (Widerlegt):
                        </strong>
                        {topic.lamarckView.mechanism}
                        <span className="block mt-1 text-[10px] text-red-700 font-semibold">
                          {topic.lamarckView.fallacy}
                        </span>
                      </div>

                      {/* Darwin Column */}
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                        <strong className="block text-emerald-800 font-bold mb-0.5">
                          ✔️ Darwins Erklärung (Wissenschaftlich fundiert):
                        </strong>
                        {topic.darwinView.mechanism}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part C: Teleology / Wording Trainer */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 uppercase tracking-wider">
                Sprachsensibler Biologie-Trainer
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1 mb-2">
                Teleologie-Falle entlarven: Formuliere nach Darwin statt Lamarck
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                In bayerischen Schulaufgaben führt die Formulierung <em>„Die Tiere passten sich an, WEIL...“</em> zu Punktabzug!
                Finde die fachlich einwandfreie Formulierung:
              </p>

              {(() => {
                const exercise = TELEOLOGY_EXERCISES[teleologyIndex];
                return (
                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-4">
                    <div className="p-3 bg-red-100/70 border border-red-300 rounded-xl text-xs text-red-950">
                      <strong className="block font-bold mb-1">Typischer Schüler-Aussagefehler:</strong>
                      <span className="text-sm font-semibold italic">{exercise.flawedStatement}</span>
                      <p className="text-[11px] text-red-800 mt-1">{exercise.flawExplanation}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-800">
                        Wähle die biologisch korrekte darwinistische Aussage:
                      </span>
                      {exercise.correctOptions.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setSelectedTeleologyOption(optIdx)}
                          className={`w-full p-3 rounded-xl text-left text-xs transition-all border ${
                            selectedTeleologyOption === optIdx
                              ? opt.isCorrect
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-medium'
                                : 'bg-red-100 border-red-500 text-red-950 font-medium'
                              : 'bg-white border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="font-bold">{String.fromCharCode(65 + optIdx)})</span>
                            <div className="flex-1">
                              <span>{opt.text}</span>
                              {selectedTeleologyOption === optIdx && (
                                <p className={`mt-1.5 text-[11px] font-semibold ${
                                  opt.isCorrect ? 'text-emerald-800' : 'text-red-800'
                                }`}>
                                  {opt.isCorrect ? '✔️ Richtig: ' : '❌ Falsch: '}{opt.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">
                        Aufgabe {teleologyIndex + 1} von {TELEOLOGY_EXERCISES.length}
                      </span>
                      <button
                        onClick={() => {
                          setTeleologyIndex((teleologyIndex + 1) % TELEOLOGY_EXERCISES.length);
                          setSelectedTeleologyOption(null);
                        }}
                        className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Nächste Aufgabe ➔
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATION 5: DIDAKTISCHES QUIZ & FACHGLOSSAR                               */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quiz Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 uppercase tracking-wider">
                    Lernzielkontrolle B9 3
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    Bayerisches Lehrplan-Quiz: Evolution & Selektion
                  </h2>
                  <p className="text-xs text-gray-600">
                    6 anspruchsvolle Multiple-Choice-Fragen mit individueller Fehleranalyse und Begründung.
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

                      {/* Misconception Alert if present */}
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
                    📖 Fachbegriff-Glossar: Evolution (LehrplanPLUS Bayern)
                  </h3>
                  <p className="text-xs text-gray-600">
                    Definitionen und Schulbuch-Beispiele für die 9. Jahrgangsstufe.
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
          BioApps • Johannes-Scharrer-Gymnasium • Entwickelt für den Biologieunterricht der 9. Jahrgangsstufe (LehrplanPLUS Bayern B9 3).
        </p>
      </footer>
    </div>
  );
}
