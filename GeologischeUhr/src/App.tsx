import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info, ChevronLeft, Milestone as MilestoneIcon } from 'lucide-react';
import {
  milestones,
  eons,
  hoursToTimeString,
  hoursToYearsAgo,
  formatYearsAgo,
  getEonForHours,
  getCurrentMilestone,
  type Milestone,
  type EonData,
} from './data';

// --- Clock Face Component ---
function ClockFace({
  currentHours,
  onHoursChange,
  onMilestoneClick,
}: {
  currentHours: number;
  onHoursChange: (h: number) => void;
  onMilestoneClick: (m: Milestone) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 210;

  const hoursToAngle = (h: number) => (h / 24) * 360 - 90;
  const angleToHours = (deg: number) => (((deg + 90 + 360) % 360) / 360) * 24;

  const getMouseAngle = useCallback(
    (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
      const svg = svgRef.current;
      if (!svg) return 0;
      const rect = svg.getBoundingClientRect();
      const scaleX = size / rect.width;
      const scaleY = size / rect.height;
      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      const x = (clientX - rect.left) * scaleX - cx;
      const y = (clientY - rect.top) * scaleY - cy;
      return (Math.atan2(y, x) * 180) / Math.PI;
    },
    [cx, cy]
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      const angle = getMouseAngle(e);
      onHoursChange(angleToHours(angle));
    },
    [getMouseAngle, onHoursChange]
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const angle = getMouseAngle(e);
      onHoursChange(angleToHours(angle));
    };
    const handleUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [getMouseAngle, onHoursChange]);

  const handAngle = hoursToAngle(currentHours);
  const handRad = (handAngle * Math.PI) / 180;
  const handLength = radius - 30;
  const handX = cx + Math.cos(handRad) * handLength;
  const handY = cy + Math.sin(handRad) * handLength;

  const currentEon = getEonForHours(currentHours);

  // Build eon arcs
  const eonArcs = eons.map((eon) => {
    const startAngle = ((eon.startHours / 24) * 360 - 90) * (Math.PI / 180);
    const endAngle = ((eon.endHours / 24) * 360 - 90) * (Math.PI / 180);
    const r = radius + 18;
    const largeArc = eon.endHours - eon.startHours > 12 ? 1 : 0;
    const x1 = cx + Math.cos(startAngle) * r;
    const y1 = cy + Math.sin(startAngle) * r;
    const x2 = cx + Math.cos(endAngle) * r;
    const y2 = cy + Math.sin(endAngle) * r;
    return (
      <path
        key={eon.name}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={eon.color}
        strokeWidth={12}
        opacity={0.5}
      />
    );
  });

  // Hour markers: 12 main markers (standard clock: 12 at top, 3 right, 6 bottom, 9 left)
  // Each clock-hour = 2 geological hours. Plus 24 minor ticks.
  const hourMarkers: JSX.Element[] = [];
  // 24 minor ticks
  for (let i = 0; i < 24; i++) {
    const angle = ((i / 24) * 360 - 90) * (Math.PI / 180);
    const isMain = i % 2 === 0; // every 2 geo-hours = 1 clock-hour
    const innerR = radius - (isMain ? 15 : 8);
    const outerR = radius;
    hourMarkers.push(
      <line
        key={`tick-${i}`}
        x1={cx + Math.cos(angle) * innerR}
        y1={cy + Math.sin(angle) * innerR}
        x2={cx + Math.cos(angle) * outerR}
        y2={cy + Math.sin(angle) * outerR}
        stroke={isMain ? '#94a3b8' : '#475569'}
        strokeWidth={isMain ? 2 : 1}
      />
    );
  }

  // Milestone dots
  const milestoneDots = milestones.map((m) => {
    const angle = ((m.timeHours / 24) * 360 - 90) * (Math.PI / 180);
    const r = radius - 25;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const eon = getEonForHours(m.timeHours);
    const isActive = getCurrentMilestone(currentHours)?.id === m.id;
    return (
      <g
        key={m.id}
        onClick={(e) => {
          e.stopPropagation();
          onMilestoneClick(m);
        }}
        className="cursor-pointer"
      >
        <circle cx={x} cy={y} r={isActive ? 7 : 5} fill={eon.color} opacity={isActive ? 1 : 0.6} />
        {isActive && <circle cx={x} cy={y} r={12} fill="none" stroke={eon.color} strokeWidth={1.5} opacity={0.5} />}
      </g>
    );
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[500px] select-none touch-none"
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={currentEon.color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={currentEon.color} stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={cx} cy={cy} r={radius + 30} fill="url(#clockGlow)" />

      {/* Clock face */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e293b" strokeWidth={2} />

      {/* Eon arcs */}
      {eonArcs}

      {/* Hour markers */}
      {hourMarkers}

      {/* Milestone dots */}
      {milestoneDots}

      {/* Hand */}
      <line
        x1={cx}
        y1={cy}
        x2={handX}
        y2={handY}
        stroke={currentEon.color}
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={8} fill={currentEon.color} filter="url(#glow)" />
      <circle cx={cx} cy={cy} r={4} fill="#0a0f0d" />

      {/* Center time display */}
      <text x={cx} y={cy + 50} textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="600">
        {hoursToTimeString(currentHours)} Uhr
      </text>
    </svg>
  );
}

// --- Eon Legend ---
function EonLegend({ currentEon }: { currentEon: EonData }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {eons.map((eon) => (
        <div
          key={eon.name}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            currentEon.name === eon.name ? 'ring-1 ring-offset-1 ring-offset-deep-900' : 'opacity-50'
          }`}
          style={{
            backgroundColor: currentEon.name === eon.name ? eon.bgColor : 'transparent',
            color: eon.color,
            ringColor: eon.color,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eon.color }} />
          {eon.name}
        </div>
      ))}
    </div>
  );
}

// --- Time Slider ---
function TimeSlider({
  currentHours,
  onHoursChange,
}: {
  currentHours: number;
  onHoursChange: (h: number) => void;
}) {
  const currentEon = getEonForHours(currentHours);
  return (
    <div className="w-full mt-4 px-2">
      <input
        type="range"
        min={0}
        max={24}
        step={0.001}
        value={currentHours}
        onChange={(e) => onHoursChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${eons.map((e) => `${e.color} ${(e.startHours / 24) * 100}%, ${e.color} ${(e.endHours / 24) * 100}%`).join(', ')})`,
          accentColor: currentEon.color,
        }}
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

// --- Info Panel ---
function InfoPanel({
  currentHours,
  selectedMilestone,
  onMilestoneSelect,
}: {
  currentHours: number;
  selectedMilestone: Milestone | null;
  onMilestoneSelect: (m: Milestone) => void;
}) {
  const currentEon = getEonForHours(currentHours);
  const mya = hoursToYearsAgo(currentHours);
  const closest = getCurrentMilestone(currentHours);
  const active = selectedMilestone ?? closest;

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Time Display */}
      <motion.div
        className="rounded-2xl p-5 border"
        style={{ backgroundColor: currentEon.bgColor + '80', borderColor: currentEon.color + '30' }}
        layout
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} style={{ color: currentEon.color }} />
          <span className="text-sm font-medium text-slate-400">Geologische Uhrzeit</span>
        </div>
        <div className="text-3xl font-bold tracking-tight" style={{ color: currentEon.color }}>
          {hoursToTimeString(currentHours)} Uhr
        </div>
        <div className="text-sm text-slate-400 mt-1">
          Vor ca. <span className="text-slate-200 font-medium">{formatYearsAgo(mya)}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentEon.color }} />
          <span className="text-sm font-medium" style={{ color: currentEon.color }}>
            {currentEon.name}
          </span>
          <span className="text-xs text-slate-500">
            ({currentEon.yearsStart.toLocaleString('de')} – {currentEon.yearsEnd.toLocaleString('de')} Mio. Jahre)
          </span>
        </div>
      </motion.div>

      {/* Active Milestone */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-5 border bg-deep-800/50"
            style={{ borderColor: getEonForHours(active.timeHours).color + '25' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Nächster Meilenstein</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{active.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{active.title}</h3>
                <p className="text-xs text-slate-500">
                  {hoursToTimeString(active.timeHours)} Uhr · {active.period}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{active.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone List */}
      <div className="rounded-2xl p-4 border border-slate-800/50 bg-deep-800/30 flex-1 overflow-auto">
        <div className="flex items-center gap-2 mb-3">
          <MilestoneIcon size={18} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-400">Alle Meilensteine</span>
        </div>
        <div className="space-y-1">
          {milestones.map((m) => {
            const eon = getEonForHours(m.timeHours);
            const isActive = active?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onMilestoneSelect(m)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-sm ${
                  isActive ? 'bg-white/5' : 'hover:bg-white/[0.03]'
                }`}
              >
                <span className="text-lg flex-shrink-0">{m.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className={`truncate font-medium ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                    {m.title}
                  </div>
                  <div className="text-xs text-slate-600">{hoursToTimeString(m.timeHours)} Uhr</div>
                </div>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: eon.color }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [currentHours, setCurrentHours] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const handleHoursChange = useCallback((h: number) => {
    setCurrentHours(Math.max(0, Math.min(24, h)));
    setSelectedMilestone(null);
  }, []);

  const handleMilestoneClick = useCallback((m: Milestone) => {
    setCurrentHours(m.timeHours);
    setSelectedMilestone(m);
  }, []);

  return (
    <div className="min-h-screen bg-deep-900 text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-deep-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="../index.html"
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-white/5"
              title="Zurück zum Dashboard"
            >
              <ChevronLeft size={20} />
            </a>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-slate-400">Geologische</span>{' '}
                <span className="text-emerald-400">Uhr</span>
              </h1>
              <p className="text-xs text-slate-500">4,6 Milliarden Jahre in 24 Stunden</p>
            </div>
          </div>
          <span className="text-2xl">🌍</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Clock */}
          <div className="flex-1 flex flex-col items-center">
            <ClockFace
              currentHours={currentHours}
              onHoursChange={handleHoursChange}
              onMilestoneClick={handleMilestoneClick}
            />
            <EonLegend currentEon={getEonForHours(currentHours)} />
            <TimeSlider currentHours={currentHours} onHoursChange={handleHoursChange} />
          </div>

          {/* Right: Info Panel */}
          <div className="w-full lg:w-[420px] lg:max-h-[calc(100vh-100px)] lg:overflow-auto">
            <InfoPanel
              currentHours={currentHours}
              selectedMilestone={selectedMilestone}
              onMilestoneSelect={handleMilestoneClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
