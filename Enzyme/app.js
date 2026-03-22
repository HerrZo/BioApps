/* ═══════════════════════════════════════════════════════════════
   ENZYME LERN-APP · app.js
   Architecture: ES6 Modules Pattern (IIFE)
   ═══════════════════════════════════════════════════════════════ */

// ── TOPICS DATA ─────────────────────────────────────────────────
const TOPICS_DATA = {
  chapters: [
    { id: 'history',    title: 'Geschichte der Enzyme', icon: '📜', shortTitle: 'Geschichte' },
    { id: 'structure',  title: 'Aufbau der Enzyme',     icon: '🧬', shortTitle: 'Aufbau' },
    { id: 'mechanism',  title: 'Wirkweise der Enzyme',  icon: '⚙️', shortTitle: 'Wirkweise' },
    { id: 'energy',     title: 'Energetik',             icon: '⚡', shortTitle: 'Energetik' },
    { id: 'factors',    title: 'Einflussfaktoren',      icon: '📊', shortTitle: 'Einflussfaktoren' },
    { id: 'minigame',   title: 'Bio-Challenge',         icon: '🏆', shortTitle: 'Challenge' }
  ],

  history: [
    { year: '1752', text: 'Verdauung gilt als rein mechanischer Vorgang', detail: 'Man dachte, der Magen zerkleinere Nahrung nur durch Muskelkraft – ähnlich einer Mühle.' },
    { year: '1783', text: 'Magensaft reicht aus, um Fleisch zu verflüssigen', detail: 'Experiment mit Magensaft von Greifvögeln zeigt: Eine chemische Komponente ist beteiligt.' },
    { year: '1831', text: 'Mundspeichel „verzuckert" Stärke', detail: 'Speichel kann Stärke in Zucker umwandeln – ein Hinweis auf chemische Katalysatoren im Körper.' },
    { year: '1835', text: 'Zuckerspaltung ist eine chemische Reaktion', detail: 'Es handelt sich nicht um eine bloße Stofftrennung, sondern um eine echte chemische Umwandlung.' },
    { year: '1837', text: 'Hefe ist ein Mikroorganismus', detail: 'Hefe besteht aus winzigen, mit dem bloßen Auge nicht sichtbaren Lebewesen.' },
    { year: '1862', text: 'Fermentation funktioniert auch nach Tod der Mikroorganismen', detail: 'Pasteur zeigt: Die Gärung hängt mit Mikroorganismen zusammen, aber die Substanz bleibt auch nach deren Tod aktiv.' },
    { year: '1878', text: 'Begriff „Enzym" wird eingeführt', detail: 'Kühne prägt den Begriff aus dem Griechischen: en = in, zyme = Sauerteig/Hefe → „im Sauerteig".' },
    { year: '1890', text: 'Fischer: Schlüssel-Schloss-Prinzip', detail: 'Emil Fischer beschreibt: Enzym und Substrat passen wie Schlüssel und Schloss zusammen → Substratspezifität.' },
    { year: '1897', text: 'Buchner: Gärung ohne lebende Zellen', detail: 'Eduard Buchner zeigt: Alkoholische Gärung funktioniert auch mit zellfreiem Hefeextrakt → Enzyme sind die Ursache!' },
    { year: '1908', text: 'Röhm isoliert erstmals Enzyme', detail: 'Erste industrielle Isolation von Enzymen – Beginn der Enzymtechnologie.' },
    { year: '~1900er', text: 'Streit: Sind Enzyme Proteine?', detail: 'Große Debatte: Sind Enzyme selbst Proteine, oder transportieren Proteine nur die eigentlichen Wirkstoffe?' },
    { year: '1926', text: 'Sumner: Urease ist ein Protein', detail: 'James Sumner kristallisiert das Enzym Urease und weist nach, dass es ein Protein ist – Nobelpreis!' },
    { year: '1930', text: 'Northrop & Stanley bestätigen: Enzyme = Proteine', detail: 'Sie beweisen am Beispiel Pepsin endgültig: Enzyme bestehen aus Proteinen. Nobelpreis 1946.' }
  ],

  structures: [
    { id: 'primary', title: 'Primärstruktur', subtitle: 'Aminosäuresequenz', desc: 'Die lineare Abfolge der Aminosäuren, verbunden durch Peptidbindungen. Sie bestimmt alle weiteren Strukturebenen.', color: '#16a34a' },
    { id: 'secondary', title: 'Sekundärstruktur', subtitle: 'α-Helix & β-Faltblatt', desc: 'Regelmäßige, lokale Faltungsmuster durch Wasserstoffbrücken zwischen benachbarten Aminosäuren.', color: '#0ea5e9' },
    { id: 'tertiary', title: 'Tertiärstruktur', subtitle: '3D-Faltung', desc: 'Die vollständige dreidimensionale Raumstruktur eines Proteins, stabilisiert durch verschiedene Wechselwirkungen (Disulfidbrücken, hydrophobe WW, Ionenbindungen).', color: '#8b5cf6' },
    { id: 'quaternary', title: 'Quartärstruktur', subtitle: 'Untereinheiten', desc: 'Zusammenlagerung mehrerer Polypeptidketten (Untereinheiten) zu einem funktionellen Proteinkomplex, z.B. Hämoglobin aus 4 Untereinheiten.', color: '#f59e0b' }
  ],

  mechanismSteps: [
    { id: 'step1', title: 'Substrat nähert sich', desc: 'Das Substrat bewegt sich zum aktiven Zentrum des Enzyms und wird durch seine komplementäre Form angezogen.' },
    { id: 'step2', title: 'Enzym-Substrat-Komplex', desc: 'Das Substrat bindet an das aktive Zentrum – es entsteht der Enzym-Substrat-Komplex (nach dem Schlüssel-Schloss-Prinzip).' },
    { id: 'step3', title: 'Katalyse / Umsetzung', desc: 'Das Enzym senkt die Aktivierungsenergie und wandelt das Substrat in die Produkte um.' },
    { id: 'step4', title: 'Produkte werden freigesetzt', desc: 'Die Produkte lösen sich vom Enzym ab. Das aktive Zentrum ist wieder frei für ein neues Substrat.' }
  ],

  quizQuestions: [
    { q: 'Was bedeutet der Begriff "Enzym"?', options: ['Im Sauerteig/Hefe', 'Schneller Stoff', 'Verdauungshelfer', 'Zellbaustein'], correct: 0, explanation: 'Der Begriff kommt aus dem Griechischen: en = in, zyme = Sauerteig/Hefe.' },
    { q: 'Was beschreibt die Substratspezifität?', options: ['Enzyme können alle Substrate umsetzen', 'Jedes Enzym setzt nur bestimmte Substrate um', 'Substrate wählen ihr Enzym aus', 'Enzyme verändern ihre Form beliebig'], correct: 1, explanation: 'Wie ein Schlüssel nur in ein bestimmtes Schloss passt, setzt jedes Enzym nur bestimmte Substrate um (Schlüssel-Schloss-Prinzip nach Fischer).' },
    { q: 'Woraus bestehen Enzyme?', options: ['Aus Fetten', 'Aus Kohlenhydraten', 'Aus Proteinen (Aminosäuren)', 'Aus Nukleinsäuren'], correct: 2, explanation: 'Sumner (1926) wies nach, dass das Enzym Urease ein Protein ist. Enzyme bestehen aus Aminosäureketten.' },
    { q: 'Was bewirkt ein Enzym als Biokatalysator?', options: ['Es erhöht die Aktivierungsenergie', 'Es senkt die Aktivierungsenergie', 'Es verändert die Reaktionsenergie', 'Es erzeugt neue Energie'], correct: 1, explanation: 'Enzyme senken die Aktivierungsenergie einer Reaktion, ohne selbst verbraucht zu werden.' },
    { q: 'Was passiert bei Denaturierung eines Enzyms?', options: ['Es wird stärker', 'Die 3D-Struktur wird zerstört', 'Es verdoppelt sich', 'Nichts Besonderes'], correct: 1, explanation: 'Bei hohen Temperaturen oder extremem pH-Wert wird die Tertiärstruktur zerstört und das aktive Zentrum verliert seine Form.' },
    { q: 'Was ist das Optimum bei der Temperaturabhängigkeit?', options: ['Die niedrigste Temperatur', 'Die höchste Temperatur', 'Die Temperatur mit maximaler Aktivität', 'Raumtemperatur immer'], correct: 2, explanation: 'Am Temperaturoptimum arbeitet das Enzym am schnellsten. Darüber wird es denaturiert.' },
    { q: 'Wer formulierte das Schlüssel-Schloss-Prinzip?', options: ['Buchner', 'Sumner', 'Emil Fischer', 'Pasteur'], correct: 2, explanation: 'Emil Fischer beschrieb 1890, dass Enzym und Substrat sich wie Schlüssel und Schloss verhalten.' },
    { q: 'Was entsteht, wenn das Substrat an das Enzym bindet?', options: ['Ein Produkt-Enzym-Komplex', 'Ein Enzym-Substrat-Komplex', 'Ein Enzym-Inhibitor-Komplex', 'Eine kovalente Bindung'], correct: 1, explanation: 'Wenn das Substrat an das aktive Zentrum bindet, entsteht vorübergehend ein Enzym-Substrat-Komplex (E+S → ES → E+P).' },
    { q: 'Wie wirkt eine hohe Substratkonzentration?', options: ['linear steigend, unbegrenzt', 'Sättigungskinetik: erst schnell, dann Plateau', 'Gar nicht', 'Hemmend'], correct: 1, explanation: 'Bei steigender Substratkonzentration sind irgendwann alle Enzyme besetzt → Sättigung (Vmax).' },
    { q: 'Welche Strukturebene ist für die Funktion des aktiven Zentrums entscheidend?', options: ['Primärstruktur', 'Sekundärstruktur', 'Tertiärstruktur', 'Keine davon'], correct: 2, explanation: 'Die Tertiärstruktur formt die 3D-Gestalt und damit das aktive Zentrum, in das das Substrat passt.' }
  ]
};

// ── THEME MANAGER ──────────────────────────────────────────────
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('enzyme-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateBtn();
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('enzyme-theme', next);
    this.updateBtn();
    if (App.currentChapter === 'energy') App.renderEnergy();
    if (App.currentChapter === 'factors') App.renderFactorGraph();
  },
  updateBtn() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
  }
};

// ── PROGRESS CONTROLLER ────────────────────────────────────────
const Progress = {
  completed: new Set(JSON.parse(localStorage.getItem('enzyme-progress') || '[]')),
  markDone(id) {
    this.completed.add(id);
    localStorage.setItem('enzyme-progress', JSON.stringify([...this.completed]));
    this.updateUI();
  },
  getPercent() { return Math.round((this.completed.size / TOPICS_DATA.chapters.length) * 100); },
  updateUI() {
    const pct = this.getPercent();
    const bar = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = pct + '%';
    TOPICS_DATA.chapters.forEach(ch => {
      const navItem = document.getElementById('nav-' + ch.id);
      if (navItem) navItem.classList.toggle('completed', this.completed.has(ch.id));
    });
  }
};

// ── SCORING SYSTEM ─────────────────────────────────────────────
const Scoring = {
  score: parseInt(localStorage.getItem('enzyme-score') || '0'),
  add(pts) {
    this.score += pts;
    localStorage.setItem('enzyme-score', this.score);
    this.updateUI();
  },
  updateUI() {
    const el = document.getElementById('score-value');
    if (el) el.textContent = this.score;
  }
};

// ── MAIN APP ───────────────────────────────────────────────────
const App = {
  currentChapter: null,
  sidebarOpen: false,

  init() {
    ThemeManager.init();
    this.renderSidebar();
    this.navigate(TOPICS_DATA.chapters[0].id);
    Progress.updateUI();
    Scoring.updateUI();
    document.getElementById('mobile-menu-btn').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebar-overlay').addEventListener('click', () => this.toggleSidebar(false));
  },

  toggleSidebar(force) {
    this.sidebarOpen = force !== undefined ? force : !this.sidebarOpen;
    document.getElementById('sidebar').classList.toggle('open', this.sidebarOpen);
    document.getElementById('sidebar-overlay').classList.toggle('show', this.sidebarOpen);
  },

  renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = TOPICS_DATA.chapters.map(ch => `
      <button class="nav-item ${Progress.completed.has(ch.id) ? 'completed' : ''}"
              id="nav-${ch.id}" onclick="App.navigate('${ch.id}')">
        <span class="nav-icon">${ch.icon}</span>
        <span>${ch.shortTitle}</span>
        <span class="nav-check">✓</span>
      </button>
    `).join('');
  },

  navigate(chapterId) {
    this.currentChapter = chapterId;
    this.toggleSidebar(false);
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById('nav-' + chapterId);
    if (navEl) navEl.classList.add('active');
    // Update top bar
    const ch = TOPICS_DATA.chapters.find(c => c.id === chapterId);
    document.getElementById('top-bar-title').textContent = ch ? ch.icon + ' ' + ch.title : '';
    // Render chapter
    const content = document.getElementById('content-area');
    content.style.opacity = '0';
    setTimeout(() => {
      switch(chapterId) {
        case 'history': this.renderHistory(); break;
        case 'structure': this.renderStructure(); break;
        case 'mechanism': this.renderMechanism(); break;
        case 'energy': this.renderEnergy(); break;
        case 'factors': this.renderFactors(); break;
        case 'minigame': this.renderMinigame(); break;
      }
      content.style.opacity = '1';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  },

  getNavFooter(chapterId) {
    const chapters = TOPICS_DATA.chapters;
    const idx = chapters.findIndex(c => c.id === chapterId);
    const prev = idx > 0 ? chapters[idx - 1] : null;
    const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;
    return `<div class="section-nav-footer">
      ${prev ? `<button class="btn btn-outline" onclick="App.navigate('${prev.id}')">← ${prev.shortTitle}</button>` : '<div></div>'}
      ${next ? `<button class="btn btn-primary btn-next" onclick="App.navigate('${next.id}')">${next.shortTitle} →</button>` : '<div></div>'}
    </div>`;
  },

  // ── HISTORY RENDER ──────────────────────────────────────────
  renderHistory() {
    const content = document.getElementById('content-area');
    const items = TOPICS_DATA.history;
    content.innerHTML = `
      <div class="section-header">
        <div class="section-icon">📜</div>
        <div><h2 class="section-title">Die Geschichte der Enzyme</h2>
        <p class="section-subtitle">Vom mechanischen Verdauungsbild zur modernen Enzymologie</p></div>
      </div>
      <div class="info-box" style="margin-bottom:var(--sp-lg)">
        <strong>Entdecke die Meilensteine!</strong> Klicke auf die Einträge der Zeitleiste, um Details zu erfahren.
      </div>
      <div class="timeline" id="timeline-container">
        ${items.map((item, i) => `
          <div class="timeline-item stagger-${(i % 6) + 1}" data-index="${i}" onclick="App.toggleTimelineItem(this, ${i})">
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-text">${item.text}</div>
            <div class="timeline-detail hidden" id="tl-detail-${i}">${item.detail}</div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-primary" style="margin-top:var(--sp-lg)" onclick="App.completeHistory()">
        ✓ Kapitel abschließen
      </button>
      ${this.getNavFooter('history')}
    `;
    // Staggered reveal
    setTimeout(() => {
      document.querySelectorAll('.timeline-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 100);
  },

  toggleTimelineItem(el, idx) {
    const detail = document.getElementById('tl-detail-' + idx);
    const wasActive = el.classList.contains('active');
    document.querySelectorAll('.timeline-item').forEach(item => {
      item.classList.remove('active');
      item.querySelector('.timeline-detail')?.classList.add('hidden');
    });
    if (!wasActive) {
      el.classList.add('active');
      detail.classList.remove('hidden');
    }
  },

  completeHistory() { Progress.markDone('history'); Scoring.add(10); },

  // ── STRUCTURE RENDER ────────────────────────────────────────
  renderStructure() {
    const content = document.getElementById('content-area');
    const structs = TOPICS_DATA.structures;
    content.innerHTML = `
      <div class="section-header">
        <div class="section-icon">🧬</div>
        <div><h2 class="section-title">Aufbau der Enzyme</h2>
        <p class="section-subtitle">Enzyme sind Proteine – aufgebaut aus Aminosäuren</p></div>
      </div>
      <div class="info-box" style="margin-bottom:var(--sp-lg)">
        <strong>Enzyme = Proteine!</strong> Sie bestehen aus langen Ketten von Aminosäuren (bis zu mehreren tausend). Die Abfolge und Faltung bestimmt ihre Funktion. Klicke auf die Karten für Details.
      </div>
      <div class="structure-cards" id="structure-cards">
        ${structs.map((s, i) => `
          <div class="structure-card animate-fade-up stagger-${i + 1}" onclick="App.showStructDetail('${s.id}')" id="struct-${s.id}">
            <div class="structure-svg">${App.getStructureSVG(s.id, s.color)}</div>
            <h4>${s.title}</h4>
            <p>${s.subtitle}</p>
          </div>
        `).join('')}
      </div>
      <div id="structure-detail" class="card" style="margin-top:var(--sp-lg);display:none"></div>
      <button class="btn btn-primary" style="margin-top:var(--sp-lg)" onclick="Progress.markDone('structure');Scoring.add(10)">
        ✓ Kapitel abschließen
      </button>
      ${this.getNavFooter('structure')}
    `;
  },

  getStructureSVG(id, color) {
    switch(id) {
      case 'primary': return `<svg viewBox="0 0 80 80"><g fill="none" stroke="${color}" stroke-width="3"><circle cx="10" cy="40" r="6" fill="${color}" opacity="0.3"/><line x1="16" y1="40" x2="24" y2="40"/><circle cx="30" cy="40" r="6" fill="${color}" opacity="0.4"/><line x1="36" y1="40" x2="44" y2="40"/><circle cx="50" cy="40" r="6" fill="${color}" opacity="0.6"/><line x1="56" y1="40" x2="64" y2="40"/><circle cx="70" cy="40" r="6" fill="${color}" opacity="0.8"/></g></svg>`;
      case 'secondary': return `<svg viewBox="0 0 80 80"><path d="M10,55 Q20,15 30,55 Q40,15 50,55 Q60,15 70,55" fill="none" stroke="${color}" stroke-width="3"/><ellipse cx="40" cy="40" rx="15" ry="20" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="3,3" opacity="0.4"/></svg>`;
      case 'tertiary': return `<svg viewBox="0 0 80 80"><path d="M15,60 Q5,30 25,20 Q45,5 55,25 Q70,15 70,40 Q75,65 55,60 Q40,70 30,55 Q20,65 15,60Z" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="2"/><circle cx="35" cy="35" r="4" fill="${color}" opacity="0.6"/><text x="32" y="38" font-size="6" fill="${color}" font-weight="bold">AZ</text></svg>`;
      case 'quaternary': return `<svg viewBox="0 0 80 80"><ellipse cx="30" cy="30" rx="16" ry="14" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="2"/><ellipse cx="52" cy="30" rx="16" ry="14" fill="${color}" opacity="0.25" stroke="${color}" stroke-width="2"/><ellipse cx="30" cy="50" rx="16" ry="14" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="2"/><ellipse cx="52" cy="50" rx="16" ry="14" fill="${color}" opacity="0.35" stroke="${color}" stroke-width="2"/></svg>`;
      default: return '';
    }
  },

  showStructDetail(id) {
    const s = TOPICS_DATA.structures.find(x => x.id === id);
    document.querySelectorAll('.structure-card').forEach(el => el.classList.remove('active'));
    document.getElementById('struct-' + id).classList.add('active');
    const detail = document.getElementById('structure-detail');
    detail.style.display = 'block';
    detail.innerHTML = `<h3 style="color:${s.color};margin-bottom:var(--sp-sm)">${s.title}: ${s.subtitle}</h3><p style="font-size:0.9rem">${s.desc}</p>`;
    detail.className = 'card animate-slide-down';
  },

  // ── MECHANISM RENDER ────────────────────────────────────────
  renderMechanism() {
    const content = document.getElementById('content-area');
    content.innerHTML = `
      <div class="section-header">
        <div class="section-icon">⚙️</div>
        <div><h2 class="section-title">Wirkweise der Enzyme</h2>
        <p class="section-subtitle">Wie Enzyme biochemische Reaktionen katalysieren</p></div>
      </div>
      <div class="enzyme-step-controls" id="mech-controls">
        ${TOPICS_DATA.mechanismSteps.map((s, i) => `
          <button class="step-btn ${i === 0 ? 'active' : ''}" onclick="App.showMechStep(${i})">${i + 1}. ${s.title}</button>
        `).join('')}
      </div>
      <div class="enzyme-animation-container" id="mech-svg-container" style="margin:var(--sp-lg) 0">
        ${this.getMechSVG(0)}
      </div>
      <div class="card" id="mech-desc" style="margin-bottom:var(--sp-lg)">
        <h3>${TOPICS_DATA.mechanismSteps[0].title}</h3>
        <p style="margin-top:var(--sp-sm);font-size:0.9rem">${TOPICS_DATA.mechanismSteps[0].desc}</p>
      </div>
      <div class="specificity-grid">
        <div class="specificity-card">
          <h4><span class="spec-icon">🔑</span> Substratspezifität</h4>
          <p>Jedes Enzym setzt nur ein bestimmtes Substrat oder eine Gruppe chemisch ähnlicher Substrate um. Die Form des aktiven Zentrums passt nur zu einem Substrat – wie ein Schlüssel nur in ein Schloss passt.</p>
        </div>
        <div class="specificity-card">
          <h4><span class="spec-icon">🎯</span> Wirkungsspezifität</h4>
          <p>Jedes Enzym katalysiert nur eine bestimmte Reaktion. Z.B. kann eine Protease Proteine spalten, aber keine Fette. Das Enzym bestimmt also nicht nur WAS, sondern auch WIE umgesetzt wird.</p>
        </div>
      </div>
      <button class="btn btn-primary" style="margin-top:var(--sp-lg)" onclick="Progress.markDone('mechanism');Scoring.add(10)">
        ✓ Kapitel abschließen
      </button>
      ${this.getNavFooter('mechanism')}
    `;
  },

  showMechStep(idx) {
    document.querySelectorAll('#mech-controls .step-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
    document.getElementById('mech-svg-container').innerHTML = this.getMechSVG(idx);
    const step = TOPICS_DATA.mechanismSteps[idx];
    document.getElementById('mech-desc').innerHTML = `<h3>${step.title}</h3><p style="margin-top:var(--sp-sm);font-size:0.9rem">${step.desc}</p>`;
  },

  getMechSVG(step) {
    const enzymeColor = '#16a34a';
    const substrateColor = '#8b5cf6';
    const productColor = '#06b6d4';
    const w = 800, h = 260;
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="enzyme-svg" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs><linearGradient id="enz-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${enzymeColor}" stop-opacity="0.9"/><stop offset="100%" stop-color="#22c55e" stop-opacity="0.7"/></linearGradient></defs>`;
    // Enzyme body (pac-man shape with active site notch)
    const ex = 350, ey = 130, er = 80;
    if (step === 0) {
      // Enzyme open, substrate approaching
      svg += `<path d="M${ex},${ey - er} A${er},${er} 0 1,1 ${ex},${ey + er} L${ex},${ey + 25} L${ex + 30},${ey} L${ex},${ey - 25} Z" fill="url(#enz-grad)" stroke="${enzymeColor}" stroke-width="2"/>`;
      svg += `<text x="${ex - 30}" y="${ey + 5}" fill="white" font-size="14" font-weight="bold" font-family="Outfit">Enzym</text>`;
      // Substrate floating right
      svg += `<rect x="550" y="105" width="50" height="50" rx="8" fill="${substrateColor}" opacity="0.85"><animate attributeName="x" values="600;540;600" dur="2s" repeatCount="indefinite"/></rect>`;
      svg += `<text x="560" y="137" fill="white" font-size="11" font-weight="bold" font-family="Outfit"><animate attributeName="x" values="610;550;610" dur="2s" repeatCount="indefinite"/>Sub.</text>`;
      svg += `<text x="${ex - 10}" y="${ey + 5}" fill="${enzymeColor}" font-size="10" font-weight="bold" font-family="Outfit">AZ</text>`;
    } else if (step === 1) {
      // ES-complex: substrate docked
      svg += `<path d="M${ex},${ey - er} A${er},${er} 0 1,1 ${ex},${ey + er} L${ex},${ey + 25} L${ex + 30},${ey} L${ex},${ey - 25} Z" fill="url(#enz-grad)" stroke="${enzymeColor}" stroke-width="2"/>`;
      svg += `<rect x="${ex + 2}" y="${ey - 25}" width="50" height="50" rx="8" fill="${substrateColor}" opacity="0.9"/>`;
      svg += `<text x="${ex + 10}" y="${ey + 5}" fill="white" font-size="11" font-weight="bold" font-family="Outfit">Sub.</text>`;
      svg += `<text x="${ex - 45}" y="${ey + 5}" fill="white" font-size="14" font-weight="bold" font-family="Outfit">Enzym</text>`;
      // Arrow label
      svg += `<text x="${ex - 10}" y="${ey + er + 30}" fill="${enzymeColor}" font-size="13" font-weight="bold" font-family="Outfit" text-anchor="middle">Enzym-Substrat-Komplex</text>`;
    } else if (step === 2) {
      // Catalysis happening
      svg += `<path d="M${ex},${ey - er} A${er},${er} 0 1,1 ${ex},${ey + er} L${ex},${ey + 25} L${ex + 30},${ey} L${ex},${ey - 25} Z" fill="url(#enz-grad)" stroke="${enzymeColor}" stroke-width="2"><animate attributeName="opacity" values="1;0.7;1" dur="0.8s" repeatCount="indefinite"/></path>`;
      svg += `<rect x="${ex + 2}" y="${ey - 25}" width="50" height="50" rx="8" fill="${substrateColor}" opacity="0.7"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="0.6s" repeatCount="indefinite"/></rect>`;
      svg += `<text x="${ex - 45}" y="${ey + 5}" fill="white" font-size="14" font-weight="bold" font-family="Outfit">Enzym</text>`;
      // Energy sparks
      svg += `<circle cx="${ex + 35}" cy="${ey - 35}" r="4" fill="#fbbf24"><animate attributeName="r" values="2;6;2" dur="0.5s" repeatCount="indefinite"/></circle>`;
      svg += `<circle cx="${ex + 55}" cy="${ey + 10}" r="3" fill="#fbbf24"><animate attributeName="r" values="1;5;1" dur="0.7s" repeatCount="indefinite"/></circle>`;
      svg += `<text x="${ex + 20}" y="${ey + er + 30}" fill="${enzymeColor}" font-size="13" font-weight="bold" font-family="Outfit" text-anchor="middle">⚡ Katalyse läuft...</text>`;
    } else {
      // Products released
      svg += `<path d="M${ex},${ey - er} A${er},${er} 0 1,1 ${ex},${ey + er} L${ex},${ey + 25} L${ex + 30},${ey} L${ex},${ey - 25} Z" fill="url(#enz-grad)" stroke="${enzymeColor}" stroke-width="2"/>`;
      svg += `<text x="${ex - 45}" y="${ey + 5}" fill="white" font-size="14" font-weight="bold" font-family="Outfit">Enzym</text>`;
      svg += `<text x="${ex - 5}" y="${ey + 5}" fill="${enzymeColor}" font-size="10" font-weight="bold" font-family="Outfit">frei!</text>`;
      // Two products moving away
      svg += `<rect x="550" y="85" width="35" height="35" rx="6" fill="${productColor}" opacity="0.85"><animate attributeName="x" values="480;600" dur="2s" fill="freeze"/></rect>`;
      svg += `<text x="555" y="108" fill="white" font-size="9" font-weight="bold" font-family="Outfit"><animate attributeName="x" values="485;605" dur="2s" fill="freeze"/>P1</text>`;
      svg += `<rect x="550" y="145" width="35" height="35" rx="6" fill="${productColor}" opacity="0.85"><animate attributeName="x" values="480;620" dur="2.2s" fill="freeze"/></rect>`;
      svg += `<text x="555" y="168" fill="white" font-size="9" font-weight="bold" font-family="Outfit"><animate attributeName="x" values="485;625" dur="2.2s" fill="freeze"/>P2</text>`;
    }
    svg += '</svg>';
    return svg;
  },

  // ── ENERGY RENDER ───────────────────────────────────────────
  energyShowEnzyme: true,
  renderEnergy() {
    const content = document.getElementById('content-area');
    content.innerHTML = `
      <div class="section-header">
        <div class="section-icon">⚡</div>
        <div><h2 class="section-title">Energetische Betrachtung</h2>
        <p class="section-subtitle">Enzyme als Biokatalysatoren senken die Aktivierungsenergie</p></div>
      </div>
      <div class="info-box" style="margin-bottom:var(--sp-lg)">
        <strong>Biokatalysator:</strong> Enzyme beschleunigen Reaktionen, indem sie die Aktivierungsenergie herabsetzen und Bindungen im Substrat auflockern – ohne selbst verbraucht zu werden.
      </div>
      <div class="energy-controls" style="margin-bottom:var(--sp-md)">
        <button class="energy-toggle ${this.energyShowEnzyme ? 'active' : ''}" id="enz-toggle-btn" onclick="App.energyShowEnzyme=!App.energyShowEnzyme;App.drawEnergyDiagram();document.getElementById('enz-toggle-btn').classList.toggle('active',App.energyShowEnzyme)">
          <span class="dot" style="background:#22c55e"></span> Mit Enzym ein-/ausblenden
        </button>
      </div>
      <div class="energy-diagram"><canvas id="energy-canvas"></canvas></div>
      <div class="graph-legend"><span class="legend-item"><span class="legend-dot" style="background:#ef4444"></span> Ohne Enzym</span><span class="legend-item"><span class="legend-dot" style="background:#22c55e"></span> Mit Enzym</span></div>
      <div class="card" style="margin-top:var(--sp-lg)"><h3>Was passiert?</h3><p style="font-size:0.85rem;margin-top:var(--sp-sm)">Das Enzym stabilisiert den Übergangszustand. Die <strong>Aktivierungsenergie (EA)</strong> wird gesenkt, die <strong>Reaktionsenergie (ΔG)</strong> bleibt gleich.</p></div>
      <button class="btn btn-primary" style="margin-top:var(--sp-lg)" onclick="Progress.markDone('energy');Scoring.add(10)">✓ Kapitel abschließen</button>
      ${this.getNavFooter('energy')}`;
    setTimeout(() => this.drawEnergyDiagram(), 50);
  },
  drawEnergyDiagram() {
    const canvas = document.getElementById('energy-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#1a2e1a' : '#fafff5'; ctx.fillRect(0, 0, w, h);
    const mx = 60, my = 30, bx = w - 30, by = h - 50;
    ctx.strokeStyle = isDark ? '#4a6a4a' : '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, by); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = isDark ? '#a0c0a0' : '#475569'; ctx.font = '13px Outfit'; ctx.textAlign = 'center';
    ctx.fillText('Reaktionsverlauf', (mx + bx) / 2, h - 10);
    ctx.save(); ctx.translate(18, (my + by) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Energie', 0, 0); ctx.restore();
    const rw = bx - mx, eduktY = by - 80, produktY = by - 50, peakNoEnz = my + 40, peakEnz = my + 120;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.005) { const x = mx + t * rw; const base = eduktY + (produktY - eduktY) * t; const bump = Math.sin(t * Math.PI) * (eduktY - peakNoEnz); const y = base - bump; t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    if (this.energyShowEnzyme) { ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.beginPath(); for (let t = 0; t <= 1; t += 0.005) { const x = mx + t * rw; const base = eduktY + (produktY - eduktY) * t; const bump = Math.sin(t * Math.PI) * (eduktY - peakEnz); const y = base - bump; t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    const arrowX = mx + rw * 0.35;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(arrowX, eduktY); ctx.lineTo(arrowX, peakNoEnz + 15); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px Outfit'; ctx.textAlign = 'left';
    ctx.fillText('EA ohne Enzym', arrowX + 6, (eduktY + peakNoEnz) / 2);
    if (this.energyShowEnzyme) { const ax2 = mx + rw * 0.55; ctx.strokeStyle = '#22c55e'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ax2, eduktY); ctx.lineTo(ax2, peakEnz + 15); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#22c55e'; ctx.font = 'bold 11px Outfit'; ctx.fillText('EA mit Enzym', ax2 + 6, (eduktY + peakEnz) / 2 + 10); }
    ctx.fillStyle = isDark ? '#c0e0c0' : '#334155'; ctx.font = 'bold 13px Outfit'; ctx.textAlign = 'center';
    ctx.fillText('Edukte', mx + 40, eduktY - 10); ctx.fillText('Produkte', bx - 50, produktY - 10);
  },

  // ── FACTORS RENDER ──────────────────────────────────────────
  currentFactor: 'temp',
  factorSliderVal: 50,
  renderFactors() {
    const content = document.getElementById('content-area');
    content.innerHTML = `
      <div class="section-header">
        <div class="section-icon">📊</div>
        <div><h2 class="section-title">Einflussfaktoren auf die Enzymaktivität</h2>
        <p class="section-subtitle">Temperatur, pH-Wert und Substratkonzentration</p></div>
      </div>
      <div class="factor-tabs">
        <button class="factor-tab ${this.currentFactor==='temp'?'active':''}" onclick="App.currentFactor='temp';App.renderFactors()">🌡️ Temperatur</button>
        <button class="factor-tab ${this.currentFactor==='ph'?'active':''}" onclick="App.currentFactor='ph';App.renderFactors()">⚗️ pH-Wert</button>
        <button class="factor-tab ${this.currentFactor==='substrate'?'active':''}" onclick="App.currentFactor='substrate';App.renderFactors()">🧪 Substratkonz.</button>
      </div>
      <div class="graph-container"><canvas id="factor-canvas"></canvas></div>
      <div id="factor-info" class="card" style="margin-top:var(--sp-lg)"></div>
      <button class="btn btn-primary" style="margin-top:var(--sp-lg)" onclick="Progress.markDone('factors');Scoring.add(10)">✓ Kapitel abschließen</button>
      ${this.getNavFooter('factors')}`;
    setTimeout(() => { this.renderFactorGraph(); this.renderFactorInfo(); }, 50);
  },
  renderFactorInfo() {
    const info = document.getElementById('factor-info');
    if (!info) return;
    const texts = {
      temp: '<h3>🌡️ Temperaturabhängigkeit</h3><p style="font-size:0.85rem;margin-top:var(--sp-sm)">Die Enzymaktivität steigt mit der Temperatur (RGT-Regel), bis zum <strong>Temperaturoptimum</strong> (bei den meisten menschlichen Enzymen ca. 37°C). Darüber hinaus kommt es zur <strong>Denaturierung</strong>: Die 3D-Struktur wird zerstört und das aktive Zentrum verliert seine Form → Aktivität sinkt rapide auf 0.</p>',
      ph: '<h3>⚗️ pH-Wert-Abhängigkeit</h3><p style="font-size:0.85rem;margin-top:var(--sp-sm)">Jedes Enzym hat ein <strong>pH-Optimum</strong>, bei dem es am besten arbeitet. Beispiele: Pepsin (Magen) bei pH 2, Amylase (Speichel) bei pH 7, Trypsin (Darm) bei pH 8. Abweichungen verändern die Ladung der Aminosäuren und damit die Raumstruktur.</p>',
      substrate: '<h3>🧪 Substratkonzentration</h3><p style="font-size:0.85rem;margin-top:var(--sp-sm)">Bei niedriger Substratkonzentration steigt die Reaktionsgeschwindigkeit fast linear. Bei hoher Konzentration sind alle aktiven Zentren besetzt → <strong>Sättigungskinetik (Vmax)</strong>. Mehr Substrat bringt dann keinen weiteren Geschwindigkeitszuwachs.</p>'
    };
    info.innerHTML = texts[this.currentFactor] || '';
  },
  renderFactorGraph() {
    const canvas = document.getElementById('factor-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#1a2e1a' : '#fafff5'; ctx.fillRect(0, 0, w, h);
    const mx = 60, my = 30, bx = w - 30, by = h - 50, rw = bx - mx, rh = by - my;
    ctx.strokeStyle = isDark ? '#4a6a4a' : '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, by); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = isDark ? '#a0c0a0' : '#475569'; ctx.font = '12px Outfit'; ctx.textAlign = 'center';
    const labels = { temp: ['Temperatur (°C)', '0', '20', '37', '60', '80'], ph: ['pH-Wert', '1', '3', '5', '7', '9', '11'], substrate: ['Substratkonzentration [S]', '0', '', '', '', 'hoch'] };
    const lb = labels[this.currentFactor];
    ctx.fillText(lb[0], (mx + bx) / 2, h - 10);
    ctx.save(); ctx.translate(15, (my + by) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Reaktionsgeschwindigkeit', 0, 0); ctx.restore();
    // Draw ticks
    ctx.font = '10px DM Sans'; ctx.textAlign = 'center';
    for (let i = 1; i < lb.length; i++) {
      const x = mx + ((i - 1) / (lb.length - 2)) * rw;
      ctx.fillText(lb[i], x, by + 18);
    }
    // Draw curve
    ctx.lineWidth = 3; ctx.setLineDash([]);
    if (this.currentFactor === 'temp') {
      // Bell curve peaking at ~37°C (0.4625 of range 0-80)
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.005) {
        const x = mx + t * rw;
        // Asymmetric bell: rises slowly, drops fast after optimum
        const opt = 0.4625;
        let y;
        if (t <= opt) { y = Math.pow(t / opt, 1.8); } else { const d = (t - opt) / (1 - opt); y = Math.exp(-4 * d * d); }
        const py = by - y * rh * 0.85;
        t === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.stroke();
      // Optimum line
      const optX = mx + 0.4625 * rw;
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(optX, my); ctx.lineTo(optX, by); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = '#22c55e'; ctx.font = 'bold 11px Outfit';
      ctx.fillText('Optimum (37°C)', optX, my - 5);
      // Denaturierung zone
      ctx.fillStyle = 'rgba(239,68,68,0.08)';
      ctx.fillRect(mx + 0.6 * rw, my, rw * 0.4, rh);
      ctx.fillStyle = '#ef4444'; ctx.font = '10px Outfit';
      ctx.fillText('Denaturierung', mx + 0.8 * rw, my + 20);
    } else if (this.currentFactor === 'ph') {
      // Show 2 enzymes with different optima
      const curves = [
        { name: 'Pepsin (Magen)', opt: 0.1, color: '#ef4444', sigma: 0.08 },
        { name: 'Amylase (Speichel)', opt: 0.6, color: '#22c55e', sigma: 0.12 },
        { name: 'Trypsin (Darm)', opt: 0.8, color: '#3b82f6', sigma: 0.1 }
      ];
      curves.forEach(c => {
        ctx.strokeStyle = c.color; ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let t = 0; t <= 1; t += 0.005) {
          const x = mx + t * rw;
          const y = Math.exp(-Math.pow(t - c.opt, 2) / (2 * c.sigma * c.sigma));
          const py = by - y * rh * 0.85;
          t === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
        }
        ctx.stroke();
        ctx.fillStyle = c.color; ctx.font = 'bold 10px Outfit'; ctx.textAlign = 'left';
        ctx.fillText(c.name, mx + c.opt * rw - 20, by - rh * 0.85 - 8);
      });
    } else {
      // Michaelis-Menten saturation curve
      ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.005) {
        const x = mx + t * rw;
        const y = t / (t + 0.15); // Michaelis-Menten-like
        const py = by - y * rh * 0.85;
        t === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.stroke();
      // Vmax line
      const vmaxY = by - 0.85 * rh * (1 / 1.15);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(mx, vmaxY); ctx.lineTo(bx, vmaxY); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 11px Outfit'; ctx.textAlign = 'right';
      ctx.fillText('Vmax (Sättigung)', bx - 5, vmaxY - 8);
      // Km
      const km = 0.15; const kmX = mx + km * rw; const kmY = by - (km / (km + 0.15)) * rh * 0.85;
      ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(kmX, by); ctx.lineTo(kmX, kmY); ctx.lineTo(mx, kmY); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = '#64748b'; ctx.font = '10px Outfit'; ctx.textAlign = 'center';
      ctx.fillText('Km', kmX, by + 18);
      ctx.textAlign = 'right'; ctx.fillText('½ Vmax', mx - 5, kmY + 4);
    }
  },

  // ── MINIGAME RENDER ─────────────────────────────────────────
  quizIdx: 0,
  quizAnswers: [],
  quizLocked: false,
  renderMinigame() {
    this.quizIdx = 0; this.quizAnswers = []; this.quizLocked = false;
    const content = document.getElementById('content-area');
    content.innerHTML = `
      <div class="section-header">
        <div class="section-icon">🏆</div>
        <div><h2 class="section-title">Bio-Challenge: Enzyme</h2>
        <p class="section-subtitle">Teste dein Wissen in 10 Fragen!</p></div>
      </div>
      <div class="quiz-container" id="quiz-container"></div>
      ${this.getNavFooter('minigame')}`;
    this.renderQuizQuestion();
  },
  renderQuizQuestion() {
    const container = document.getElementById('quiz-container');
    const questions = TOPICS_DATA.quizQuestions;
    if (this.quizIdx >= questions.length) { this.renderQuizResults(); return; }
    const q = questions[this.quizIdx];
    this.quizLocked = false;
    container.innerHTML = `
      <div class="quiz-progress">${questions.map((_, i) => {
        let cls = 'quiz-dot';
        if (i < this.quizAnswers.length) cls += this.quizAnswers[i] ? ' correct' : ' wrong';
        else if (i === this.quizIdx) cls += ' current';
        return `<div class="${cls}"></div>`;
      }).join('')}</div>
      <div class="quiz-question">Frage ${this.quizIdx + 1}/${questions.length}: ${q.q}</div>
      <div class="quiz-options" id="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option" onclick="App.answerQuiz(${i})" id="qopt-${i}">${opt}</button>`).join('')}
      </div>
      <div id="quiz-feedback"></div>`;
  },
  answerQuiz(idx) {
    if (this.quizLocked) return;
    this.quizLocked = true;
    const q = TOPICS_DATA.quizQuestions[this.quizIdx];
    const isCorrect = idx === q.correct;
    this.quizAnswers.push(isCorrect);
    if (isCorrect) Scoring.add(5);
    // Mark options
    document.querySelectorAll('.quiz-option').forEach((el, i) => {
      el.classList.add('disabled');
      if (i === q.correct) el.classList.add('correct');
      else if (i === idx && !isCorrect) el.classList.add('wrong');
    });
    const fb = document.getElementById('quiz-feedback');
    fb.innerHTML = `<div class="quiz-feedback ${isCorrect ? 'correct' : 'wrong'}">
      <strong>${isCorrect ? '✓ Richtig!' : '✗ Leider falsch.'}</strong> ${q.explanation}
    </div>
    <button class="btn btn-primary" style="margin-top:var(--sp-md)" onclick="App.nextQuiz()">
      ${this.quizIdx < TOPICS_DATA.quizQuestions.length - 1 ? 'Nächste Frage →' : 'Ergebnis anzeigen'}
    </button>`;
  },
  nextQuiz() {
    this.quizIdx++;
    this.renderQuizQuestion();
  },
  renderQuizResults() {
    const correct = this.quizAnswers.filter(Boolean).length;
    const total = TOPICS_DATA.quizQuestions.length;
    const pct = Math.round((correct / total) * 100);
    const stars = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐' : pct >= 50 ? '⭐' : '😔';
    Progress.markDone('minigame');
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
      <div class="card results-card">
        <div class="results-score">${correct}/${total}</div>
        <div class="results-stars">${stars}</div>
        <h3>${pct >= 90 ? 'Fantastisch!' : pct >= 70 ? 'Gut gemacht!' : pct >= 50 ? 'Nicht schlecht!' : 'Weiter üben!'}</h3>
        <p style="color:var(--text-secondary);margin-top:var(--sp-sm);font-size:0.9rem">${pct}% der Fragen richtig beantwortet</p>
        <button class="btn btn-primary" style="margin-top:var(--sp-lg)" onclick="App.renderMinigame()">🔄 Nochmal spielen</button>
      </div>`;
  }
};

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
window.addEventListener('resize', () => {
  if (App.currentChapter === 'energy') App.drawEnergyDiagram();
  if (App.currentChapter === 'factors') App.renderFactorGraph();
});
