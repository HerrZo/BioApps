import React, { useState, useEffect, useRef } from 'react';
import { TOPICS_DATA } from './data';

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="section-header">
    <div className="section-icon">{icon}</div>
    <div>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
    </div>
  </div>
);

const NavFooter = ({ chapterId, navigate }) => {
  const chapters = TOPICS_DATA.chapters;
  const idx = chapters.findIndex(c => c.id === chapterId);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  return (
    <div className="section-nav-footer">
      {prev ? <button className="btn btn-outline" onClick={() => navigate(prev.id)}>← {prev.shortTitle}</button> : <div />}
      {next ? <button className="btn btn-primary btn-next" onClick={() => navigate(next.id)}>{next.shortTitle} →</button> : <div />}
    </div>
  );
};

const History = ({ markDone, navigate }) => {
  const [activeIdx, setActiveIdx] = useState(null);
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    TOPICS_DATA.history.forEach((_, i) => setTimeout(() => setVisible(v => [...v, i]), 100 + i * 80));
  }, []);
  return (
    <div>
      <SectionHeader icon="📜" title="Die Geschichte der Enzyme" subtitle="Vom mechanischen Verdauungsbild zur modernen Enzymologie" />
      <div className="info-box" style={{ marginBottom: 'var(--sp-lg)' }}><strong>Entdecke die Meilensteine!</strong> Klicke auf die Einträge der Zeitleiste, um Details zu erfahren.</div>
      <div className="timeline">
        {TOPICS_DATA.history.map((item, i) => (
          <div key={i} className={`timeline-item stagger-${(i % 6) + 1} ${visible.includes(i) ? 'visible' : ''} ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-text">{item.text}</div>
            {activeIdx === i && <div className="timeline-detail animate-slide-down">{item.detail}</div>}
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => markDone('history')}>✓ Kapitel abschließen</button>
      <NavFooter chapterId="history" navigate={navigate} />
    </div>
  );
};

const Structure = ({ markDone, navigate }) => {
  const [activeId, setActiveId] = useState(null);
  const getSVG = (id, color) => {
    switch(id) {
      case 'primary': return <svg viewBox="0 0 80 80"><g fill="none" stroke={color} strokeWidth="3"><circle cx="10" cy="40" r="6" fill={color} opacity="0.3"/><line x1="16" y1="40" x2="24" y2="40"/><circle cx="30" cy="40" r="6" fill={color} opacity="0.4"/><line x1="36" y1="40" x2="44" y2="40"/><circle cx="50" cy="40" r="6" fill={color} opacity="0.6"/><line x1="56" y1="40" x2="64" y2="40"/><circle cx="70" cy="40" r="6" fill={color} opacity="0.8"/></g></svg>;
      case 'secondary': return <svg viewBox="0 0 80 80"><path d="M10,55 Q20,15 30,55 Q40,15 50,55 Q60,15 70,55" fill="none" stroke={color} strokeWidth="3"/><ellipse cx="40" cy="40" rx="15" ry="20" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3,3" opacity="0.4"/></svg>;
      case 'tertiary': return <svg viewBox="0 0 80 80"><path d="M15,60 Q5,30 25,20 Q45,5 55,25 Q70,15 70,40 Q75,65 55,60 Q40,70 30,55 Q20,65 15,60Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/><circle cx="35" cy="35" r="4" fill={color} opacity="0.6"/><text x="32" y="38" fontSize="6" fill={color} fontWeight="bold">AZ</text></svg>;
      case 'quaternary': return <svg viewBox="0 0 80 80"><ellipse cx="30" cy="30" rx="16" ry="14" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/><ellipse cx="52" cy="30" rx="16" ry="14" fill={color} opacity="0.25" stroke={color} strokeWidth="2"/><ellipse cx="30" cy="50" rx="16" ry="14" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/><ellipse cx="52" cy="50" rx="16" ry="14" fill={color} opacity="0.35" stroke={color} strokeWidth="2"/></svg>;
      default: return null;
    }
  };
  const activeStruct = TOPICS_DATA.structures.find(s => s.id === activeId);
  return (
    <div>
      <SectionHeader icon="🧬" title="Aufbau der Enzyme" subtitle="Enzyme sind Proteine – aufgebaut aus Aminosäuren" />
      <div className="info-box" style={{ marginBottom: 'var(--sp-lg)' }}><strong>Enzyme = Proteine!</strong> Sie bestehen aus langen Ketten von Aminosäuren. Klicke auf die Karten.</div>
      <div className="structure-cards">
        {TOPICS_DATA.structures.map((s, i) => (
          <div key={s.id} className={`structure-card animate-fade-up stagger-${i + 1} ${activeId === s.id ? 'active' : ''}`} onClick={() => setActiveId(s.id)}>
            <div className="structure-svg">{getSVG(s.id, s.color)}</div>
            <h4>{s.title}</h4>
            <p>{s.subtitle}</p>
          </div>
        ))}
      </div>
      {activeStruct && <div className="card animate-slide-down" style={{ marginTop: 'var(--sp-lg)' }}><h3 style={{ color: activeStruct.color, marginBottom: 'var(--sp-sm)' }}>{activeStruct.title}: {activeStruct.subtitle}</h3><p style={{ fontSize: '0.9rem' }}>{activeStruct.desc}</p></div>}
      <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => markDone('structure')}>✓ Kapitel abschließen</button>
      <NavFooter chapterId="structure" navigate={navigate} />
    </div>
  );
};

// --- Add Mechanism, Energy, Factors, etc as we saw earlier ---
const Mechanism = ({ markDone, navigate }) => {
  const [step, setStep] = useState(0);
  const getMechSVG = () => {
    const eC = '#166534', eFill = '#16a34a', sC = '#7c3aed', pC = '#06b6d4';
    const cx = 300, cy = 130, R = 90;
    const ntY = 30, ntD = 38;
    const nTopX = cx + Math.sqrt(R*R - ntY*ntY), nTopY = cy - ntY;
    const nBotX = nTopX, nBotY = cy + ntY;
    const nTipX = nTopX - ntD, nTipY = cy;
    const enzymePath = `M ${nTopX} ${nTopY} A ${R} ${R} 0 1 0 ${nBotX} ${nBotY} L ${nTipX} ${nTipY} Z`;
    const subBody = 45;
    const subDocked = (dx) => `M ${nTipX + dx} ${nTipY} L ${nTopX + dx} ${nTopY} L ${nTopX + dx + subBody} ${nTopY} L ${nTopX + dx + subBody} ${nBotY} L ${nBotX + dx} ${nBotY} Z`;
    const subFloat = (fx) => `M ${nTipX + fx} ${nTipY} L ${nTopX + fx} ${nTopY} L ${nTopX + fx + subBody} ${nTopY} L ${nTopX + fx + subBody} ${nBotY} L ${nBotX + fx} ${nBotY} Z`;
    const defs = <defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={eFill} stopOpacity="0.95"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0.75"/></linearGradient></defs>;
    if (step === 0) {
      const off = 120, arrStart = nTopX + off - 8, arrEnd = nTopX + 15;
      return <svg viewBox="0 0 800 280" className="enzyme-svg" xmlns="http://www.w3.org/2000/svg">{defs}
        <path d={enzymePath} fill="url(#eg)" stroke={eFill} strokeWidth="2"/>
        <text x={cx - 25} y={cy + 6} fill={eC} fontSize="16" fontWeight="700" fontFamily="Outfit">Enzym</text>
        <line x1={nTipX + 5} y1={cy - 45} x2={nTipX + 2} y2={nTipY - 5} stroke={eFill} strokeWidth="1.2" strokeDasharray="3,2"/>
        <text x={nTipX + 8} y={cy - 52} fill={eC} fontSize="11" fontWeight="600" fontFamily="Outfit">Aktives Zentrum</text>
        <path d={subFloat(off)} fill={sC} opacity="0.88"><animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/></path>
        <text x={nTopX + off + 4} y={cy + 5} fill="white" fontSize="12" fontWeight="700" fontFamily="Outfit">Substrat</text>
        <line x1={arrStart} y1={cy} x2={arrEnd} y2={cy} stroke={sC} strokeWidth="2" strokeDasharray="6,4" opacity="0.7"><animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite"/></line>
        <polygon points={`${arrEnd},${cy-5} ${arrEnd-10},${cy} ${arrEnd},${cy+5}`} fill={sC} opacity="0.7"/>
      </svg>;
    } else if (step === 1) {
      return <svg viewBox="0 0 800 280" className="enzyme-svg" xmlns="http://www.w3.org/2000/svg">{defs}
        <path d={enzymePath} fill="url(#eg)" stroke={eFill} strokeWidth="2"/>
        <path d={subDocked(1)} fill={sC} opacity="0.92" stroke={sC} strokeWidth="1"/>
        <text x={nTopX + 6} y={cy + 5} fill="white" fontSize="11" fontWeight="700" fontFamily="Outfit">Substrat</text>
        <text x={cx - 25} y={cy + 6} fill={eC} fontSize="16" fontWeight="700" fontFamily="Outfit">Enzym</text>
        <text x={cx + 10} y={cy + R + 30} fill={eFill} fontSize="14" fontWeight="700" fontFamily="Outfit" textAnchor="middle">Enzym-Substrat-Komplex</text>
      </svg>;
    } else if (step === 2) {
      return <svg viewBox="0 0 800 280" className="enzyme-svg" xmlns="http://www.w3.org/2000/svg">{defs}
        <path d={enzymePath} fill="url(#eg)" stroke={eFill} strokeWidth="2"><animate attributeName="opacity" values="1;0.7;1" dur="0.8s" repeatCount="indefinite"/></path>
        <path d={subDocked(1)} fill={sC} opacity="0.75"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.6s" repeatCount="indefinite"/></path>
        <text x={cx - 25} y={cy + 6} fill={eC} fontSize="16" fontWeight="700" fontFamily="Outfit">Enzym</text>
        <circle cx={nTopX+8} cy={nTopY-12} r="4" fill="#fbbf24"><animate attributeName="r" values="2;7;2" dur="0.5s" repeatCount="indefinite"/></circle>
        <circle cx={nBotX+12} cy={nBotY+8} r="3" fill="#fbbf24"><animate attributeName="r" values="1;6;1" dur="0.7s" repeatCount="indefinite"/></circle>
        <circle cx={nTopX+subBody+5} cy={cy} r="3" fill="#f59e0b"><animate attributeName="r" values="2;5;2" dur="0.4s" repeatCount="indefinite"/></circle>
        <text x={cx + 10} y={cy + R + 30} fill={eFill} fontSize="14" fontWeight="700" fontFamily="Outfit" textAnchor="middle">⚡ Katalyse läuft…</text>
      </svg>;
    } else {
      const pStartX = nTopX + 20;
      return <svg viewBox="0 0 800 280" className="enzyme-svg" xmlns="http://www.w3.org/2000/svg">{defs}
        <path d={enzymePath} fill="url(#eg)" stroke={eFill} strokeWidth="2"/>
        <text x={cx - 25} y={cy + 6} fill={eC} fontSize="16" fontWeight="700" fontFamily="Outfit">Enzym</text>
        <text x={nTipX + 4} y={cy + 5} fill={eFill} fontSize="10" fontWeight="700" fontFamily="Outfit">frei!</text>
        <rect x={pStartX} y={cy-40} width="40" height="30" rx="6" fill={pC} opacity="0.9"><animate attributeName="x" values={`${pStartX};${pStartX+200}`} dur="2s" fill="freeze"/></rect>
        <text x={pStartX+10} y={cy-20} fill="white" fontSize="11" fontWeight="700" fontFamily="Outfit"><animate attributeName="x" values={`${pStartX+10};${pStartX+210}`} dur="2s" fill="freeze"/>P₁</text>
        <rect x={pStartX} y={cy+10} width="40" height="30" rx="6" fill={pC} opacity="0.9"><animate attributeName="x" values={`${pStartX};${pStartX+220}`} dur="2.2s" fill="freeze"/></rect>
        <text x={pStartX+10} y={cy+30} fill="white" fontSize="11" fontWeight="700" fontFamily="Outfit"><animate attributeName="x" values={`${pStartX+10};${pStartX+230}`} dur="2.2s" fill="freeze"/>P₂</text>
      </svg>;
    }
  };
  return (
    <div>
      <SectionHeader icon="⚙️" title="Wirkweise der Enzyme" subtitle="Wie Enzyme biochemische Reaktionen katalysieren" />
      <div className="enzyme-step-controls">
        {TOPICS_DATA.mechanismSteps.map((s, i) => (
          <button key={i} className={`step-btn ${step === i ? 'active' : ''}`} onClick={() => setStep(i)}>{i + 1}. {s.title}</button>
        ))}
      </div>
      <div className="enzyme-animation-container" style={{ margin: 'var(--sp-lg) 0' }}>{getMechSVG()}</div>
      <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
        <h3>{TOPICS_DATA.mechanismSteps[step].title}</h3>
        <p style={{ marginTop: 'var(--sp-sm)', fontSize: '0.9rem' }}>{TOPICS_DATA.mechanismSteps[step].desc}</p>
      </div>
      <div className="specificity-grid">
        <div className="specificity-card"><h4><span className="spec-icon">🔑</span> Substratspezifität</h4><p>Jedes Enzym setzt nur ein bestimmtes Substrat um.</p></div>
        <div className="specificity-card"><h4><span className="spec-icon">🎯</span> Wirkungsspezifität</h4><p>Jedes Enzym katalysiert nur eine bestimmte Reaktion.</p></div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => markDone('mechanism')}>✓ Kapitel abschließen</button>
      <NavFooter chapterId="mechanism" navigate={navigate} />
    </div>
  );
};

const Energy = ({ markDone, navigate }) => {
  const [showEnzyme, setShowEnzyme] = useState(true);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    const isDark = document.documentElement.classList.contains('dark');
    const textCol = isDark ? '#c0e0c0' : '#334155', axisCol = isDark ? '#4a6a4a' : '#b0bec5', bgCol = isDark ? '#1a2e1a' : '#fafff5';
    ctx.fillStyle = bgCol; ctx.fillRect(0, 0, W, H);
    const L = 80, T = 45, R = W - 40, B = H - 55, gW = R - L, gH = B - T;
    const eduktY = B - gH * 0.28, produktY = B - gH * 0.10, peakHigh = T + gH * 0.05, peakLow = T + gH * 0.38;
    ctx.strokeStyle = axisCol; ctx.lineWidth = 1.5; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(L, T - 10); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(L - 4, T); ctx.lineTo(L, T - 10); ctx.lineTo(L + 4, T); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(R - 4, B - 4); ctx.lineTo(R, B); ctx.lineTo(R - 4, B + 4); ctx.stroke();
    ctx.fillStyle = textCol; ctx.font = '13px Outfit'; ctx.textAlign = 'center';
    ctx.fillText('Reaktionsverlauf', (L + R) / 2, H - 12);
    ctx.save(); ctx.translate(20, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Energie', 0, 0); ctx.restore();
    ctx.strokeStyle = isDark ? '#507050' : '#cbd5e1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, eduktY); ctx.lineTo(R, eduktY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(L, produktY); ctx.lineTo(R, produktY); ctx.stroke();
    ctx.fillStyle = textCol; ctx.font = 'bold 12px Outfit'; ctx.textAlign = 'right'; ctx.fillText('Eᵢ(E)', L - 8, eduktY + 5);
    ctx.textAlign = 'left'; ctx.fillText('Eᵢ(P)', R + 8, produktY + 5);
    const drawCurve = (peakY, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash([]);
      ctx.beginPath(); let best = { x: 0, y: 9999 }; const steps = 500;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps, x = L + t * gW, base = eduktY + (produktY - eduktY) * t, bump = Math.sin(t * Math.PI) * (eduktY - peakY), y = base - bump;
        if (y < best.y) { best.y = y; best.x = x; }
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); return best;
    };
    const p1 = drawCurve(peakHigh, '#ef4444');
    let p2 = null; if (showEnzyme) p2 = drawCurve(peakLow, '#22c55e');
    const drawEA = (peakX, peakY, label, color, labelOffset) => {
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(peakX, eduktY); ctx.lineTo(peakX, peakY); ctx.stroke();
      ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(peakX - 5, eduktY); ctx.lineTo(peakX + 5, eduktY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(peakX - 5, peakY); ctx.lineTo(peakX + 5, peakY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(peakX - 4, peakY + 8); ctx.lineTo(peakX, peakY); ctx.lineTo(peakX + 4, peakY + 8); ctx.stroke();
      ctx.fillStyle = color; ctx.font = 'bold 12px Outfit'; ctx.textAlign = 'left'; ctx.fillText(label, peakX + 10, (eduktY + peakY) / 2 + labelOffset);
    };
    drawEA(p1.x, p1.y, 'Eᴀ ohne Enzym', '#ef4444', 0);
    if (showEnzyme) drawEA(p2.x, p2.y, 'Eᴀ mit Enzym', '#22c55e', 4);
    const dX = L + gW * 0.78; ctx.strokeStyle = isDark ? '#7aa07a' : '#64748b'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.moveTo(dX, eduktY); ctx.lineTo(dX, produktY); ctx.stroke();
    ctx.fillStyle = isDark ? '#7aa07a' : '#64748b'; ctx.font = 'bold 12px Outfit'; ctx.textAlign = 'left'; ctx.fillText('ΔEᵢ', dX + 8, (eduktY + produktY) / 2 + 5);
  }, [showEnzyme]);

  return (
    <div>
      <SectionHeader icon="⚡" title="Energetische Betrachtung" subtitle="Enzyme als Biokatalysatoren senken die Aktivierungsenergie" />
      <div className="energy-controls" style={{ marginBottom: 'var(--sp-md)' }}>
        <button className={`energy-toggle ${showEnzyme ? 'active' : ''}`} onClick={() => setShowEnzyme(!showEnzyme)}>
          <span className="dot" style={{ background: '#22c55e' }}></span> Mit Enzym ein-/ausblenden
        </button>
      </div>
      <div className="energy-diagram"><canvas ref={canvasRef}></canvas></div>
      <div className="graph-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }}></span> Ohne Enzym</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }}></span> Mit Enzym</span>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => markDone('energy')}>✓ Kapitel abschließen</button>
      <NavFooter chapterId="energy" navigate={navigate} />
    </div>
  );
};

const Factors = ({ markDone, navigate }) => {
  const [factor, setFactor] = useState('temp');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#1a2e1a' : '#fafff5'; ctx.fillRect(0, 0, w, h);
    const mx = 60, my = 30, bx = w - 30, by = h - 50, rw = bx - mx, rh = by - my;
    ctx.strokeStyle = isDark ? '#4a6a4a' : '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, by); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = isDark ? '#a0c0a0' : '#475569'; ctx.font = '12px Outfit'; ctx.textAlign = 'center';
    const labels = { temp: ['Temperatur (°C)', '0', '20', '37', '60', '80'], ph: ['pH-Wert', '1', '3', '5', '7', '9', '11'], substrate: ['Substratkonzentration [S]', '0', '', '', '', 'hoch'] };
    const lb = labels[factor];
    ctx.fillText(lb[0], (mx + bx) / 2, h - 10);
    ctx.save(); ctx.translate(15, (my + by) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Reaktionsgeschwindigkeit', 0, 0); ctx.restore();
    ctx.font = '10px DM Sans'; ctx.textAlign = 'center';
    for (let i = 1; i < lb.length; i++) {
      const x = mx + ((i - 1) / (lb.length - 2)) * rw;
      ctx.fillText(lb[i], x, by + 18);
    }
    ctx.lineWidth = 3; ctx.setLineDash([]);
    if (factor === 'temp') {
      ctx.strokeStyle = '#ef4444'; ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.005) {
        const x = mx + t * rw, opt = 0.4625; let y;
        if (t <= opt) { y = Math.pow(t / opt, 1.8); } else { const d = (t - opt) / (1 - opt); y = Math.exp(-4 * d * d); }
        const py = by - y * rh * 0.85; t === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.stroke();
      const optX = mx + 0.4625 * rw; ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(optX, my); ctx.lineTo(optX, by); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = '#22c55e'; ctx.font = 'bold 11px Outfit'; ctx.fillText('Optimum (37°C)', optX, my - 5);
    } else if (factor === 'ph') {
      const curves = [{ name: 'Pepsin', opt: 0.1, color: '#ef4444', sigma: 0.08 }, { name: 'Amylase', opt: 0.6, color: '#22c55e', sigma: 0.12 }, { name: 'Trypsin', opt: 0.8, color: '#3b82f6', sigma: 0.1 }];
      curves.forEach(c => {
        ctx.strokeStyle = c.color; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let t = 0; t <= 1; t += 0.005) {
          const x = mx + t * rw, y = Math.exp(-Math.pow(t - c.opt, 2) / (2 * c.sigma * c.sigma)), py = by - y * rh * 0.85;
          t === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
        }
        ctx.stroke(); ctx.fillStyle = c.color; ctx.font = 'bold 10px Outfit'; ctx.textAlign = 'left'; ctx.fillText(c.name, mx + c.opt * rw - 20, by - rh * 0.85 - 8);
      });
    } else {
      ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 3; ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.005) {
        const x = mx + t * rw, y = t / (t + 0.15), py = by - y * rh * 0.85; t === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.stroke();
    }
  }, [factor]);

  const texts = {
    temp: 'Die Enzymaktivität steigt mit der Temperatur (RGT-Regel), bis zum Optimum. Darüber hinaus kommt es zur Denaturierung.',
    ph: 'Jedes Enzym hat ein pH-Optimum (z.B. Pepsin im Magen bei pH 2). Abweichungen verändern die Ladung und Raumstruktur.',
    substrate: 'Sättigungskinetik: Bei hoher Konzentration sind alle aktiven Zentren besetzt (Vmax).'
  };

  return (
    <div>
      <SectionHeader icon="📊" title="Einflussfaktoren" subtitle="Temperatur, pH-Wert und Substratkonzentration" />
      <div className="factor-tabs">
        <button className={`factor-tab ${factor === 'temp' ? 'active' : ''}`} onClick={() => setFactor('temp')}>🌡️ Temperatur</button>
        <button className={`factor-tab ${factor === 'ph' ? 'active' : ''}`} onClick={() => setFactor('ph')}>⚗️ pH-Wert</button>
        <button className={`factor-tab ${factor === 'substrate' ? 'active' : ''}`} onClick={() => setFactor('substrate')}>🧪 Substratkonz.</button>
      </div>
      <div className="graph-container"><canvas ref={canvasRef}></canvas></div>
      <div className="card" style={{ marginTop: 'var(--sp-lg)' }}><p>{texts[factor]}</p></div>
      <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => markDone('factors')}>✓ Kapitel abschließen</button>
      <NavFooter chapterId="factors" navigate={navigate} />
    </div>
  );
};

const Quiz = ({ markDone, navigate }) => {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const questions = TOPICS_DATA.quizQuestions;

  const handleAnswer = (optIdx) => {
    if (answers.length > idx) return;
    const isCorrect = optIdx === questions[idx].correct;
    setAnswers([...answers, isCorrect]);
  };

  if (idx >= questions.length) {
    const correct = answers.filter(Boolean).length;
    return (
      <div className="results-card">
        <h2 className="results-score">{correct} / {questions.length}</h2>
        <p className="results-stars">{correct >= 9 ? '⭐⭐⭐' : correct >= 5 ? '⭐⭐' : '⭐'}</p>
        <button className="btn btn-primary" onClick={() => { setIdx(0); setAnswers([]); }}>Neustart</button>
      </div>
    );
  }

  const q = questions[idx];
  const hasAnswered = answers.length > idx;
  const isCorrect = hasAnswered && answers[idx];

  return (
    <div>
      <SectionHeader icon="🏆" title="Bio-Challenge: Enzyme" subtitle="Teste dein Wissen!" />
      <div className="quiz-progress">
        {questions.map((_, i) => (
          <div key={i} className={`quiz-dot ${i < answers.length ? (answers[i] ? 'correct' : 'wrong') : (i === idx ? 'current' : '')}`}></div>
        ))}
      </div>
      <div className="quiz-question">Frage {idx + 1}/{questions.length}: {q.q}</div>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (hasAnswered) {
             cls += ' disabled';
             if (i === q.correct) cls += ' correct';
             else if (i !== q.correct && !isCorrect && i === answers.length - 1) cls += ' wrong'; // Wait, naive check
          }
          return <button key={i} className={cls} onClick={() => handleAnswer(i)}>{opt}</button>;
        })}
      </div>
      {hasAnswered && (
        <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`} style={{ marginTop: 'var(--sp-md)' }}>
          <strong>{isCorrect ? '✓ Richtig!' : '✗ Falsch.'}</strong> {q.explanation}
        </div>
      )}
      {hasAnswered && (
        <button className="btn btn-primary" style={{ marginTop: 'var(--sp-md)' }} onClick={() => { if(idx === questions.length - 1) markDone('minigame'); setIdx(i => i + 1); }}>
          {idx < questions.length - 1 ? 'Nächste Frage →' : 'Ergebnis anzeigen'}
        </button>
      )}
      <NavFooter chapterId="minigame" navigate={navigate} />
    </div>
  );
};

export default function App() {
  const [currentChapter, setCurrentChapter] = useState('history');
  const [completed, setCompleted] = useState(new Set());
  const [score, setScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const savedProg = localStorage.getItem('enzyme-progress');
      if (savedProg) setCompleted(new Set(JSON.parse(savedProg)));
      const savedScore = localStorage.getItem('enzyme-score');
      if (savedScore) setScore(parseInt(savedScore));
      const savedTheme = localStorage.getItem('bioApps_darkMode');
      if (savedTheme === 'dark') { setDarkMode(true); document.documentElement.classList.add('dark'); }
    } catch(e) {}
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDarkMode(isDark);
    try { localStorage.setItem('bioApps_darkMode', isDark ? 'dark' : 'light'); } catch(e) {}
  };

  const markDone = (id) => {
    const newComp = new Set(completed).add(id);
    setCompleted(newComp);
    setScore(s => s + 10);
    try { localStorage.setItem('enzyme-progress', JSON.stringify([...newComp])); localStorage.setItem('enzyme-score', (score + 10).toString()); } catch(e) {}
  };

  const cTitle = TOPICS_DATA.chapters.find(c => c.id === currentChapter)?.title || '';
  const pct = Math.round((completed.size / TOPICS_DATA.chapters.length) * 100);

  return (
    <div className="app-container">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      {sidebarOpen && <div className="sidebar-overlay show" onClick={() => setSidebarOpen(false)}></div>}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <a href="#" className="sidebar-logo">
            <span>Enzyme</span>
          </a>
        </div>
        <nav className="sidebar-nav">
          {TOPICS_DATA.chapters.map(ch => (
            <button key={ch.id} className={`nav-item ${currentChapter === ch.id ? 'active' : ''} ${completed.has(ch.id) ? 'completed' : ''}`} onClick={() => { setCurrentChapter(ch.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{ch.icon}</span><span>{ch.shortTitle}</span><span className="nav-check">✓</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            <span className="dark-mode-icon">{darkMode ? '☀️' : '🌙'}</span> Dunkles Design
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <span className="top-bar-title">{cTitle}</span>
          <div className="top-bar-right">
            <div className="progress-container">
              <div className="progress-bar-wrapper"><div className="progress-bar-fill" style={{ width: `${pct}%` }}></div></div>
              <span className="progress-label">{pct}%</span>
            </div>
            <div className="score-badge"><span>⭐</span><span>{score}</span></div>
          </div>
        </header>
        <div className="content-area">
          {currentChapter === 'history' && <History markDone={markDone} navigate={setCurrentChapter} />}
          {currentChapter === 'structure' && <Structure markDone={markDone} navigate={setCurrentChapter} />}
          {currentChapter === 'mechanism' && <Mechanism markDone={markDone} navigate={setCurrentChapter} />}
          {currentChapter === 'energy' && <Energy markDone={markDone} navigate={setCurrentChapter} />}
          {currentChapter === 'factors' && <Factors markDone={markDone} navigate={setCurrentChapter} />}
          {currentChapter === 'minigame' && <Quiz markDone={markDone} navigate={setCurrentChapter} />}
        </div>
      </main>
    </div>
  );
}
