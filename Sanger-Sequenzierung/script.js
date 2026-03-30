/**
 * Logic for Sanger Mobile Learning App
 * Theme: Microlearning & Gamification (Biologie 12 - Advanced Level)
 * Ergänzt um Fachbegriffe (Tooltips), detaillierte Gel-Auswertung und tiefe Abitur-Didaktik.
 */

class SangerMobileApp {
    constructor() {
        // State
        this.currentScreen = 'home';
        this.currentCardIndex = 0;
        this.quizCurrentQuestion = 0;
        this.quizScore = 0;
        this.highscore = localStorage.getItem('sangerHighscore') || 0;
        
        // Colors for Nucleotides
        this.colors = {
            'A': 'var(--c-a)',
            'T': 'var(--c-t)',
            'C': 'var(--c-c)',
            'G': 'var(--c-g)',
            'dd': 'var(--c-dd)'
        };

        this.initData();
        this.initDOM();
        this.updateUI();
    }

    initData() {
        // ==================== LERNKARTEN (OBERSTUFE BAYERN) ====================
        this.learnCards = [
            {
                tag: 'Einleitung',
                title: 'Kettenabbruch',
                text: `Die von Frederick Sanger entwickelte Methode dient der <span class="tooltip-term" data-tooltip="Bestimmung der exakten Basenabfolge (Nukleotidsequenz) eines DNA-Moleküls.">Sequenzierung</span> von DNA. Sie ahmt die natürliche DNA-Replikation im Reagenzglas nach, stoppt diese jedoch gezielt an bestimmten Basen durch einen genialen chemischen Trick.`,
                interactiveHTML: `
                    <div class="interactive-zone" style="font-size: 50px;">
                        🧬 🛑 🔬
                    </div>
                `
            },
            {
                tag: 'Chemie',
                title: 'Der 3\'-Trick',
                text: `Normale Nukleotide (<span class="tooltip-term" data-tooltip="Desoxyribonukleosidtriphosphat: Besteht aus Base, Desoxyribose-Zucker und 3 Phosphatresten.">dNTPs</span>) besitzen eine lebenswichtige <b>3'-OH-Gruppe</b>. Nur an diese kann die <span class="tooltip-term" data-tooltip="Das Enzym, das die DNA-Synthese katalysiert.">DNA-Polymerase</span> das nächste Nukleotid per Esterbindung anknüpfen. Den künstlichen Sonden, den <b>ddNTPs</b> (<span class="tooltip-term" data-tooltip="Didesoxy... bedeutet, dass neben dem 2'-C-Atom auch am 3'-C-Atom der Sauerstoff fehlt.">Didesoxy-Nukleotiden</span>), fehlt dieses Sauerstoffatom (O). Sie enden nur mit einem -H. Folge: Die Kette kann nicht weitergebaut werden!`,
                interactiveHTML: `
                    <div class="interactive-zone">
                        <div class="molecule-stage">
                            <div class="molecule">
                                <div class="mol-label">dNTP</div>
                                <div class="mol-diagram">⬡</div>
                                <div>3'-Ende: <span class="oh-group">-OH</span></div>
                                <div style="font-size:12px; margin-top:5px; color:var(--text-muted)">"Bindung möglich"</div>
                            </div>
                            <div class="molecule" style="border: 2px solid var(--danger)">
                                <div class="mol-label" style="color: var(--danger)">ddNTP</div>
                                <div class="mol-diagram">⬡</div>
                                <div>3'-Ende: <span class="h-group">-H</span></div>
                                <div style="font-size:12px; margin-top:5px; color:var(--danger)">"Kettenabbruch!"</div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                tag: 'Setup',
                title: 'Die 4 Ansätze',
                text: `Die doppelsträngige DNA wird durch Hitze <span class="tooltip-term" data-tooltip="Trennung der Wasserstoffbrücken zwischen den DNA-Doppelsträngen bei ca. 90-95°C.">denaturiert</span>. Der resultierende Einzelstrang dient als <span class="tooltip-term" data-tooltip="Die Matrize ist der DNA-Strang, der abgelesen (kopiert) wird.">Matrize</span> und kommt mit Polymerase, normalen dNTPs und radioaktiv markierten <span class="tooltip-term" data-tooltip="Kurzes RNA- oder DNA-Stück, das an den Startbereich bindet und ein freies 3'-OH-Ende für die Polymerase bietet.">Primern</span> in vier Reagenzgläser. In jedes Glas kommt <b>zusätzlich nur eine einzige Sorte der abbrechenden ddNTPs</b> (entweder nur ddATP, ddTTP, ddCTP oder ddGTP) in sehr geringer Konzentration.`,
                interactiveHTML: `
                    <div class="interactive-zone">
                        <div class="tubes-container">
                            <div class="tube">
                                <div class="tube-label" style="color:var(--c-a)">+ ddATP</div>
                                <div class="tube-liquid" style="background:var(--c-a)"></div>
                            </div>
                            <div class="tube">
                                <div class="tube-label" style="color:var(--c-c)">+ ddCTP</div>
                                <div class="tube-liquid" style="background:var(--c-c)"></div>
                            </div>
                            <div class="tube">
                                <div class="tube-label" style="color:var(--c-g)">+ ddGTP</div>
                                <div class="tube-liquid" style="background:var(--c-g)"></div>
                            </div>
                            <div class="tube">
                                <div class="tube-label" style="color:var(--c-t)">+ ddTTP</div>
                                <div class="tube-liquid" style="background:var(--c-t)"></div>
                            </div>
                        </div>
                        <p style="font-size: 11px; margin-top: 20px; text-align:center;">Alle 4 enthalten dATP, dCTP, dGTP, dTTP (die normalen Bausteine).</p>
                    </div>
                `
            },
            {
                tag: 'Zufall',
                title: 'Der statistische Abbruch',
                text: `Da im z.B. "Adenin-Glas" hauptsächlich normale dATPs und nur wenige abbruch-verursachende ddATPs schwimmen, ist es purer Zufall, an welcher Stelle ein A eingebaut wird oder die Kette an einem A abbricht. So entstehen im Reagenzglas durch tausende gleichzeitige Reaktionen DNA-Fragmente in <b>jeder erdenklichen Länge</b>.`,
                interactiveHTML: `
                    <div class="interactive-zone" style="align-items: flex-start; padding: 20px;">
                        <div class="strand-bg">T A C G A T  <span style="font-size:12px;color:#fff;">(Matrize 3'-5')</span></div>
                        <div class="strand-active" id="sim-strand"></div>
                        <div class="action-box">
                            <button class="btn btn-secondary btn-sm" onclick="app.simulateElongation()">Synthese 5'-3'</button>
                            <p id="sim-log" style="font-size:12px; margin-top:10px; color:var(--text-muted)">Wir betrachten das ddA-Glas...</p>
                        </div>
                    </div>
                `
            },
            {
                tag: 'Trennung',
                title: 'Gelelektrophorese',
                text: `Die vier Reagenzgläser werden in vier getrennte Spuren eines Gels geleert und unter Strom gesetzt. DNA ist wegen ihrer Phosphatgruppen <span class="tooltip-term" data-tooltip="Die Phosphat-Desoxyribose-Rückgrat der DNA ist bei neutralem pH-Wert Polyanionisch.">negativ geladen</span> und wandert zur <span class="tooltip-term" data-tooltip="Der elektrische Pluspol in dieser Kammer.">Anode (+)</span>. Das feinporige Gel wirkt als Molekularsieb: <b>Kurze Fragmente wandern durch die Poren viel schneller als lange.</b> Am Ende hat sich jede Fragmentlänge auf eine exakte Base getrennt aufgereiht.`,
                interactiveHTML: `
                    <div class="interactive-zone">
                        <div style="font-size:12px; text-align:left; width: 100%; max-width: 250px; color: var(--text-muted)">Kathode (-) START</div>
                        <div style="display:flex; justify-content:space-between; width:100%; max-width: 250px; height: 160px; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--c-c); position:relative; margin: 10px 0;">
                            <!-- T-Spur -->
                            <div style="position:absolute; bottom:140px; width:40px; height:6px; background:var(--c-t); left:70px;"><span style="position:absolute;right:-20px;font-size:10px;color:white;">6b</span></div>
                            <!-- A-Spur -->
                            <div style="position:absolute; bottom:110px; width:40px; height:6px; background:var(--c-a); left:10px;"><span style="position:absolute;right:-20px;font-size:10px;color:white;">5b</span></div>
                            <!-- G-Spur -->
                            <div style="position:absolute; bottom:80px; width:40px; height:6px; background:var(--c-g); left:130px;"><span style="position:absolute;right:-20px;font-size:10px;color:white;">4b</span></div>
                            <!-- C-Spur -->
                            <div style="position:absolute; bottom:50px; width:40px; height:6px; background:var(--c-c); left:190px;"><span style="position:absolute;right:-20px;font-size:10px;color:white;">3b</span></div>
                            <div style="position:absolute; bottom:20px; width:40px; height:6px; background:var(--c-a); left:10px;"><span style="position:absolute;right:-20px;font-size:10px;color:white;">2b</span></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; width:100%; max-width: 250px; font-size: 12px; font-weight:bold;">
                            <div style="width:40px;text-align:center;color:var(--c-a)">A</div>
                            <div style="width:40px;text-align:center;color:var(--c-t)">T</div>
                            <div style="width:40px;text-align:center;color:var(--c-g)">G</div>
                            <div style="width:40px;text-align:center;color:var(--c-c)">C</div>
                        </div>
                        <div style="font-size:12px; text-align:left; width: 100%; max-width: 250px; color: var(--danger); margin-top:5px;">Anode (+)</div>
                    </div>
                `
            },
            {
                tag: 'Auswertung',
                title: 'Vom Gel zur Sequenz',
                text: `Wie liest man das ab? Die unterste Bande (z.B. bei Spur A) lief am schnellsten, ist also das <b>kürzeste Fragment (2 Basen)</b> direkt nach dem Primer. Die nächste Bande (Spur C) ist 3 Basen lang, usw. <br><br><b>WICHTIG für Klausuren:</b> Wenn man von unten nach oben vorliest (z.B. 5'- A-C-G-A-T -3'), liest man den <b>neu synthetisierten Strang</b> ab. Die gesuchte un-bekannte <span class="tooltip-term" data-tooltip="Die Matrize ist exakt komplementär und antiparallel zum neu synthetisierten Strang.">Matrize</span> lautet komplementär also: 3'- T-G-C-T-A -5'!`,
                interactiveHTML: `
                    <div class="interactive-zone" style="font-size: 14px; text-align: left; padding: 20px;">
                        <p style="margin-bottom: 10px;">Lese-Richtung Gel: von Unten nach Oben</p>
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <div style="font-size: 24px;">↑</div>
                            <div>
                                <strong style="color:var(--primary)">Synthetisierter Strang:</strong><br>
                                5'- A - C - G - A - T - 3'
                            </div>
                        </div>
                        <hr style="border-color:rgba(255,255,255,0.1); margin:10px 0;">
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <div style="font-size: 24px; visibility:hidden;">↑</div>
                            <div>
                                <strong style="color:var(--success)">Ursprüngliche Matrize (Ziel):</strong><br>
                                3'- T - G - C - T - A - 5'
                            </div>
                        </div>
                    </div>
                `
            },
            {
                tag: 'Modern',
                title: 'Automatisierung',
                text: `Moderne "Kapillarsequenzierer" nutzen keine 4 Gläser mehr, sondern koppeln alle ddNTPs an <span class="tooltip-term" data-tooltip="Ein Molekül (Fluorophor), das bei Bestrahlung mit Laserlicht in einer bestimmten Farbe leuchtet.">fluoreszierende Farbstoffe</span> (A=grün, T=rot...). Alles läuft in einem einzigen haarfeinen Röhrchen ab! Ein Laser am Ende des Röhrchens liest alle Fragmente nach der Reihe ab. Der Computer erstellt daraus messerscharfe Kurven, das <b>Chromatogramm</b>.`,
                interactiveHTML: `
                    <div class="interactive-zone" style="justify-content: flex-end">
                        <div class="chromatogram-wrapper" id="chrom-sim">
                            <!-- JS wird Peaks hier einfügen -->
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="app.animateChromatogram()" style="margin-top:10px; margin-bottom: 10px;">Laserscan starten</button>
                    </div>
                `
            }
        ];

        // ==================== LERNKONTROLLE (ABITURNIVEAU) ====================
        this.quizData = [
            {
                q: "Worin liegt chemisch der Grund für den Kettenabbruch bei durch Sangers ddNTPs?",
                options: [
                    { text: "Dem Nukleotid fehlt die Phosphatgruppe am 5'-Ende.", correct: false },
                    { text: "Dem Desoxyribose-Zucker fehlt die Hydroxylgruppe (OH) am 3'-C-Atom.", correct: true },
                    { text: "Die Basen der ddNTPs können keine Wasserstoffbrücken zum Matrizenstrang ausbilden.", correct: false }
                ]
            },
            {
                q: "Warum wandert die DNA im elektrischen Feld der Elektrophorese überhaupt zum Pluspol (Anode)?",
                options: [
                    { text: "Die Phosphatgruppen im Zucker-Phosphat-Rückgrat der DNA sind negativ geladen.", correct: true },
                    { text: "Die stickstoffhaltigen Basen sind stark negativ polarisiert.", correct: false },
                    { text: "DNA bewegt sich immer mit dem Fließwasser des Gels zur Anode.", correct: false }
                ]
            },
            {
                q: "Du liest ein Sequenziergel von Unten (kleinste Fragmente) nach Oben und ermittelst die Bandenfolge: 5'-A-T-C-G-3'. Wie lautete die ursprüngliche, zu untersuchende Matrize?",
                options: [
                    { text: "5'- T-A-G-C -3'", correct: false },  // Falsch, da Antiparallelität ignoriert
                    { text: "3'- A-T-C-G -5'", correct: false }, // Falsch, da nicht komplementär
                    { text: "3'- T-A-G-C -5'", correct: true }   // Korrekt! Komplementär und antiparallel.
                ]
            },
            {
                q: "Was passiert in einem Reaktionsansatz, wenn man im Verhältnis zu den normalen dNTPs VIEL ZU VIELE ddNTPs hinzugibt?",
                options: [
                    { text: "Die Polymerase synthetisiert extrem lange, ungekürzte Fragmente.", correct: false },
                    { text: "Die meisten Ketten brechen sofort ab, es entstehen fast nur sehr kurze Fragmente.", correct: true },
                    { text: "Die Gelelektrophorese würde in die entgegengesetzte Richtung ablaufen.", correct: false }
                ]
            }
        ];

        // Simulation State
        this.targetSeq = ['A','T','G','C','T','A'];
        this.currentSeqIndex = 0;
    }

    initDOM() {
        document.getElementById('highscore-val').textContent = this.highscore;
        
        // Render Cards
        const container = document.getElementById('learn-cards');
        let html = '';
        this.learnCards.forEach((card, idx) => {
            html += `
                <div class="learn-card" id="card-${idx}">
                    <div class="card-tag">${card.tag}</div>
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-text">${card.text}</p>
                    ${card.interactiveHTML}
                </div>
            `;
        });
        container.innerHTML = html;
        this.showCard(0);
    }

    // ==================== ROUTING ====================
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`screen-${screenId}`).classList.add('active');
        this.currentScreen = screenId;
    }

    // ==================== APPRENTICESHIP (LEARN) ====================
    startLesson() {
        this.currentCardIndex = 0;
        this.showCard(0);
        this.showScreen('learn');
    }

    showCard(index) {
        // Logik für Simulation Reset bei bestimmten Karten
        if(index !== 3) {
            this.currentSeqIndex = 0;
            const log = document.getElementById('sim-log');
            const strand = document.getElementById('sim-strand');
            if(log) log.textContent = "Reaktion im ddA-Glas startklar...";
            if(strand) strand.innerHTML = "";
        }

        document.querySelectorAll('.learn-card').forEach(c => c.classList.remove('active'));
        document.getElementById(`card-${index}`).classList.add('active');
        
        const isFirst = index === 0;
        const isLast = index === this.learnCards.length - 1;
        
        const prevBtn = document.getElementById('btn-prev-card');
        const nextBtn = document.getElementById('btn-next-card');
        
        prevBtn.disabled = isFirst;
        
        if (isLast) {
            nextBtn.textContent = 'Zum Abitur-Quiz';
            nextBtn.style.backgroundColor = "var(--danger)"; // Make it look distinct
            nextBtn.onclick = () => this.startQuiz();
        } else {
            nextBtn.textContent = 'Weiter';
            nextBtn.style.backgroundColor = "var(--primary)";
            nextBtn.onclick = () => this.nextCard();
        }

        // Progress Bar Update
        const progress = ((index + 1) / this.learnCards.length) * 100;
        document.getElementById('learn-progress').style.width = `${progress}%`;
    }

    nextCard() {
        if (this.currentCardIndex < this.learnCards.length - 1) {
            this.currentCardIndex++;
            this.showCard(this.currentCardIndex);
        }
    }

    prevCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.showCard(this.currentCardIndex);
        }
    }

    // --- Interactive Logic ---
    simulateElongation() {
        if(this.currentSeqIndex >= this.targetSeq.length) {
            document.getElementById('sim-log').textContent = "Kein Platz mehr auf der Matrize.";
            return;
        }

        const nextBase = this.targetSeq[this.currentSeqIndex];
        
        // Wir befinden uns hypothetisch im "ddA"-Glas, also ist ein Abbruch NUR bei Adenin (A) möglich.
        let isAbbruch = false;
        if(nextBase === 'A') {
            // Wenn A gefordert ist, gibt es z.B. eine 30% Chance, dass es abbricht.
            isAbbruch = Math.random() < 0.3 || this.currentSeqIndex === this.targetSeq.length - 1;
        }

        const box = document.createElement('div');
        box.className = 'nucleotide-box';
        box.textContent = nextBase;
        box.style.color = this.colors[nextBase];

        const log = document.getElementById('sim-log');

        if(isAbbruch) {
            box.style.color = this.colors['dd'];
            box.style.textShadow = "0 0 5px var(--c-dd)";
            log.textContent = `Pech/Glück! dd${nextBase}NTP eingebaut -> KETTENABBRUCH!`;
            log.style.color = "var(--danger)";
            this.currentSeqIndex = 999; // Stopp
        } else {
            log.textContent = `Normales d${nextBase}NTP eingebaut (OH-Gruppe frei). Synthese geht weiter.`;
            log.style.color = "var(--success)";
            this.currentSeqIndex++;
        }

        document.getElementById('sim-strand').appendChild(box);
    }

    animateChromatogram() {
        const sim = document.getElementById('chrom-sim');
        sim.innerHTML = '';
        
        const sequence = "ATCGTTAGCA";
        
        let delay = 0;
        for(let i=0; i<sequence.length; i++) {
            const base = sequence[i];
            const peak = document.createElement('div');
            peak.className = 'chrom-peak';
            peak.style.height = '0px';
            peak.style.backgroundColor = this.colors[base];
            
            sim.appendChild(peak);
            
            setTimeout(() => {
                peak.style.height = (Math.random() * 60 + 40) + '%';
            }, delay);
            delay += 100;
        }
    }

    // ==================== ASSESSMENT (QUIZ) ====================
    startQuiz() {
        this.quizCurrentQuestion = 0;
        this.quizScore = 0;
        document.getElementById('quiz-score').textContent = 0;
        this.showQuizQuestion();
        this.showScreen('quiz');
    }

    cancelQuiz() {
        // Zurück zur letzten Karte
        this.showCard(this.learnCards.length - 1);
        this.showScreen('learn');
    }

    showQuizQuestion() {
        const qData = this.quizData[this.quizCurrentQuestion];
        document.getElementById('quiz-question-text').textContent = qData.q;
        
        const optsContainer = document.getElementById('quiz-options-container');
        optsContainer.innerHTML = '';
        
        // Progress
        const percent = (this.quizCurrentQuestion / this.quizData.length) * 100;
        document.getElementById('quiz-progress').style.width = `${percent}%`;
        
        document.getElementById('quiz-action-bar').style.display = 'none';

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span>${opt.text}</span>`;
            btn.onclick = () => this.selectOption(btn, opt.correct);
            optsContainer.appendChild(btn);
        });
    }

    selectOption(btnSelected, isCorrect) {
        // Disable all
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btnSelected.classList.add('correct');
            this.quizScore += 100;
            document.getElementById('quiz-score').textContent = this.quizScore;
        } else {
            btnSelected.classList.add('wrong');
            // Zeige die korrekte auch an
            const qData = this.quizData[this.quizCurrentQuestion];
            const correctIdx = qData.options.findIndex(o => o.correct);
            btns[correctIdx].classList.add('correct');
        }

        document.getElementById('quiz-action-bar').style.display = 'flex';
    }

    nextQuizQuestion() {
        this.quizCurrentQuestion++;
        if (this.quizCurrentQuestion < this.quizData.length) {
            this.showQuizQuestion();
        } else {
            this.showResults();
        }
    }

    // ==================== RESULTS ====================
    showResults() {
        // Progress auf 100
        document.getElementById('quiz-progress').style.width = `100%`;
        
        const totalMax = this.quizData.length * 100;
        const percentage = Math.round((this.quizScore / totalMax) * 100);
        
        // Update Highscore
        if(this.highscore === '-' || this.quizScore > this.highscore) {
            this.highscore = this.quizScore;
            localStorage.setItem('sangerHighscore', this.highscore);
            document.getElementById('highscore-val').textContent = this.highscore;
        }

        // SVG Circle Animation
        const circle = document.getElementById('result-circle');
        const circumference = 2 * Math.PI * 45; // r=45
        const offset = circumference - (percentage / 100) * circumference;
        
        // Timeout to allow DOM transition before animating stroke
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
            this.animateValue('final-score-val', 0, percentage, 1500);
        }, 300);

        // Feedback Text
        const fbEl = document.getElementById('result-feedback-text');
        if(percentage === 100) {
            fbEl.textContent = "Mit Auszeichnung bestanden! Abitur-Niveau sicher erreicht.";
        } else if (percentage >= 50) {
            fbEl.textContent = "Stolide Leistung. Schau dir die Matrizen-Umrechnung vielleicht noch 1x an.";
        } else {
            fbEl.textContent = "Das war noch etwas wackelig. Wiederhole die Lektion am besten komplett.";
        }

        setTimeout(() => {
            this.showScreen('result');
        }, 200);
    }

    animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Utils
    updateUI() {}
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new SangerMobileApp();
});
