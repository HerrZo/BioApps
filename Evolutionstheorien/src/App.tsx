import React, { useState, useCallback } from 'react';

// ── Icons ──
const IconChevronLeft = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
);
const IconChevronRight = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
);
const IconColumns = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" /></svg>
);
const IconList = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
);
const IconCheck = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconLightbulb = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>
);
const IconUsers = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconAlertTriangle = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const IconStar = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const IconClock = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

// ── Data ──
interface Theory {
  id: string;
  title: string;
  shortTitle: string;
  period: string;
  context: string;
  color: string;
  colorLight: string;
  colorDark: string;
  colorBorder: string;
  coreIdeas: { title: string; desc: string }[];
  representatives: { name: string; years: string; contribution: string }[];
  weaknesses: string[];
  legacy: string[];
  quiz: { question: string; options: string[]; correct: number; explanation: string }[];
}

const THEORIES: Theory[] = [
  {
    id: 'antike',
    title: 'Antike Naturphilosophie',
    shortTitle: 'Antike',
    period: '~384 v. Chr. – frühes 19. Jh.',
    context: 'Von der griechischen Antike bis zur Aufklärung versuchten Gelehrte, die Vielfalt des Lebens zu ordnen und zu erklären. Aristoteles schuf die erste systematische Klassifikation, Linné formalisierte die binäre Nomenklatur, und Cuvier begründete die vergleichende Anatomie. Gemeinsam war ihnen die Annahme der Konstanz der Arten.',
    color: 'amber',
    colorLight: 'bg-amber-50',
    colorDark: 'bg-amber-700',
    colorBorder: 'border-amber-200',
    coreIdeas: [
      { title: 'Scala Naturae', desc: 'Aristoteles ordnete alle Lebewesen in eine lineare Stufenleiter vom Einfachen zum Komplexen – von Mineralien über Pflanzen und Tiere bis zum Menschen.' },
      { title: 'Konstanz der Arten', desc: 'Arten galten als unveränderlich und von Anfang an in ihrer heutigen Form erschaffen (Fixismus).' },
      { title: 'Binäre Nomenklatur', desc: 'Carl von Linné führte das bis heute gültige System der Doppelnamen ein (Gattung + Art), z. B. Homo sapiens.' },
      { title: 'Katastrophismus', desc: 'Georges Cuvier erklärte das Aussterben von Arten durch wiederkehrende Naturkatastrophen, nach denen Neubesiedlung stattfand.' },
      { title: 'Teleologie', desc: 'Die Natur wurde als zweckgerichtet betrachtet – jede Struktur hat einen von der Natur oder einem Schöpfer vorgesehenen Zweck.' },
    ],
    representatives: [
      { name: 'Aristoteles', years: '384–322 v. Chr.', contribution: 'Begründer der systematischen Biologie, Scala Naturae, erste vergleichende Anatomie' },
      { name: 'Carl von Linné', years: '1707–1778', contribution: 'Binäre Nomenklatur, hierarchisches Klassifikationssystem (Reich, Klasse, Ordnung, Gattung, Art)' },
      { name: 'Georges Cuvier', years: '1769–1832', contribution: 'Vergleichende Anatomie, Paläontologie, Katastrophentheorie' },
    ],
    weaknesses: [
      'Die Annahme der Artenkonstanz konnte die Fossilfunde nicht erklären – warum existieren ausgestorbene Formen?',
      'Die Scala Naturae ist linear und kann Verwandtschaftsbeziehungen nicht darstellen.',
      'Katastrophismus konnte die graduellen Übergänge in Fossilschichten nicht erklären.',
      'Teleologisches Denken verhinderte die Suche nach mechanistischen Ursachen.',
      'Das System konnte die Ähnlichkeit zwischen verschiedenen Arten (Homologien) nicht erklären.',
    ],
    legacy: [
      'Linnés Klassifikationssystem wird bis heute (in erweiterter Form) weltweit verwendet.',
      'Cuviers vergleichende Anatomie ist eine Grundlage der modernen Paläontologie.',
      'Die Idee der systematischen Ordnung der Natur war Voraussetzung für das Erkennen evolutionärer Muster.',
    ],
    quiz: [
      { question: 'Was versteht man unter der Scala Naturae?', options: ['Ein Messgerät für Biodiversität', 'Eine lineare Stufenleiter aller Lebewesen', 'Ein Stammbaum der Arten', 'Eine geologische Zeitskala'], correct: 1, explanation: 'Die Scala Naturae (Stufenleiter des Seins) ordnet alle Lebewesen linear vom Einfachen zum Komplexen – von Mineralien bis zum Menschen.' },
      { question: 'Wer führte die binäre Nomenklatur ein?', options: ['Aristoteles', 'Cuvier', 'Linné', 'Darwin'], correct: 2, explanation: 'Carl von Linné führte im 18. Jahrhundert die binäre Nomenklatur ein, bei der jede Art einen Doppelnamen aus Gattung und Art erhält.' },
      { question: 'Was besagt der Katastrophismus?', options: ['Arten entwickeln sich langsam weiter', 'Naturkatastrophen führen zum Aussterben von Arten', 'Alle Arten existieren seit Anbeginn', 'Die Erde ist erst wenige tausend Jahre alt'], correct: 1, explanation: 'Cuvier erklärte das Aussterben von Fossilarten durch wiederkehrende Naturkatastrophen, nach denen Neubesiedlung aus anderen Regionen stattfand.' },
    ],
  },
  {
    id: 'lamarck',
    title: 'Lamarckismus',
    shortTitle: 'Lamarck',
    period: '1809',
    context: 'Jean-Baptiste de Lamarck veröffentlichte 1809 seine „Philosophie zoologique" und formulierte damit die erste umfassende Evolutionstheorie. Er erkannte, dass Arten sich im Laufe der Zeit verändern, erklärte den Mechanismus jedoch über die Vererbung erworbener Eigenschaften – eine Idee, die heute weitgehend widerlegt ist.',
    color: 'orange',
    colorLight: 'bg-orange-50',
    colorDark: 'bg-orange-700',
    colorBorder: 'border-orange-200',
    coreIdeas: [
      { title: 'Vererbung erworbener Eigenschaften', desc: 'Veränderungen, die ein Organismus während seines Lebens erwirbt (z. B. stärkere Muskeln), werden an die Nachkommen weitergegeben.' },
      { title: 'Gebrauch und Nichtgebrauch', desc: 'Organe, die häufig genutzt werden, verstärken sich; nicht genutzte Organe verkümmern über Generationen (z. B. der lange Giraffenhals).' },
      { title: 'Innerer Vervollkommnungstrieb', desc: 'Lamarck nahm an, dass Organismen einen inneren Drang haben, sich von einfach zu komplex zu entwickeln.' },
      { title: 'Anpassung an die Umwelt', desc: 'Organismen reagieren aktiv auf Umweltveränderungen und passen sich zielgerichtet an.' },
      { title: 'Artenwandel statt Artenkonstanz', desc: 'Erstmals wurde die Veränderlichkeit der Arten als wissenschaftliches Konzept formuliert – ein revolutionärer Bruch mit dem Fixismus.' },
    ],
    representatives: [
      { name: 'Jean-Baptiste de Lamarck', years: '1744–1829', contribution: 'Erste zusammenhängende Evolutionstheorie, Philosophie zoologique (1809)' },
      { name: 'Étienne Geoffroy Saint-Hilaire', years: '1772–1844', contribution: 'Unterstützer Lamarcks, betonte die Einheit des Bauplans aller Wirbeltiere' },
    ],
    weaknesses: [
      'Die Vererbung erworbener Eigenschaften konnte experimentell nie bestätigt werden (z. B. Weismanns Schwanzexperiment bei Mäusen).',
      'Der innere Vervollkommnungstrieb ist teleologisch und wissenschaftlich nicht fassbar.',
      'Lamarck konnte nicht erklären, warum es weiterhin einfache Organismen gibt.',
      'Die Genetik (Mendel, später Molekularbiologie) zeigte, dass nur Keimbahnmutationen vererbt werden.',
      'Die Theorie erklärt nicht, wie neue Strukturen erstmals entstehen – nur wie bestehende sich verändern.',
    ],
    legacy: [
      'Lamarck war der Erste, der eine kohärente Evolutionstheorie formulierte – ein Paradigmenwechsel.',
      'Epigenetik zeigt heute, dass Umwelteinflüsse tatsächlich die Genexpression beeinflussen können – eine teilweise Rehabilitation.',
      'Die Betonung der Anpassung an die Umwelt war ein richtiger Grundgedanke, nur der Mechanismus war falsch.',
    ],
    quiz: [
      { question: 'Was ist die zentrale Idee des Lamarckismus?', options: ['Natürliche Selektion', 'Vererbung erworbener Eigenschaften', 'Genetische Drift', 'Artenkonstanz'], correct: 1, explanation: 'Lamarck nahm an, dass Organismen Eigenschaften, die sie im Laufe ihres Lebens erwerben, an ihre Nachkommen vererben.' },
      { question: 'Wie erklärt Lamarck den langen Hals der Giraffe?', options: ['Zufällige Mutation und Selektion', 'Ständiges Recken über Generationen führt zu längerem Hals', 'Giraffen mit langem Hals überleben besser', 'Genetische Drift in kleinen Populationen'], correct: 1, explanation: 'Nach Lamarck streckten Giraffen ihre Hälse, um an hohe Blätter zu gelangen, und gaben den verlängerten Hals an ihre Nachkommen weiter.' },
      { question: 'Warum gilt Lamarcks Mechanismus heute als widerlegt?', options: ['Weil es keine Evolution gibt', 'Weil nur Keimbahnmutationen vererbt werden', 'Weil Giraffen kurze Hälse haben', 'Weil Cuvier ihn widerlegte'], correct: 1, explanation: 'Die moderne Genetik zeigt, dass nur Veränderungen in der DNA der Keimzellen (Keimbahnmutationen) an Nachkommen weitergegeben werden.' },
    ],
  },
  {
    id: 'darwin',
    title: 'Darwinismus',
    shortTitle: 'Darwin',
    period: '1859',
    context: 'Charles Darwin veröffentlichte 1859 „On the Origin of Species" und revolutionierte damit die Biologie. Basierend auf seinen Beobachtungen während der Beagle-Reise (1831–1836) formulierte er die Theorie der natürlichen Selektion als Mechanismus der Evolution. Alfred Russel Wallace entwickelte unabhängig ähnliche Ideen.',
    color: 'green',
    colorLight: 'bg-green-50',
    colorDark: 'bg-green-700',
    colorBorder: 'border-green-200',
    coreIdeas: [
      { title: 'Natürliche Selektion', desc: 'Individuen mit vorteilhaften Eigenschaften haben höhere Überlebens- und Fortpflanzungschancen. Diese Eigenschaften werden häufiger an die nächste Generation weitergegeben.' },
      { title: 'Variation', desc: 'Innerhalb einer Population gibt es natürliche Variation. Individuen unterscheiden sich in ihren Merkmalen – Grundlage für Selektion.' },
      { title: 'Struggle for Existence', desc: 'Mehr Individuen werden geboren, als überleben können. Es entsteht ein Wettbewerb um begrenzte Ressourcen.' },
      { title: 'Abstammung mit Modifikation', desc: 'Alle Lebewesen stammen von gemeinsamen Vorfahren ab und haben sich durch schrittweise Veränderungen diversifiziert (Deszendenztheorie).' },
      { title: 'Sexuelle Selektion', desc: 'Neben natürlicher Selektion treiben auch Partnerwahl und Konkurrenz um Paarungspartner die Evolution an (z. B. Pfauenrad).' },
    ],
    representatives: [
      { name: 'Charles Darwin', years: '1809–1882', contribution: 'Natürliche Selektion, On the Origin of Species (1859), Deszendenztheorie' },
      { name: 'Alfred Russel Wallace', years: '1823–1913', contribution: 'Unabhängige Entdeckung der natürlichen Selektion, Biogeographie' },
      { name: 'Thomas H. Huxley', years: '1825–1895', contribution: '„Darwins Bulldogge" – wichtigster Verteidiger der Evolutionstheorie' },
    ],
    weaknesses: [
      'Darwin kannte den Mechanismus der Vererbung nicht – er wusste nicht, wie Variation entsteht und weitergegeben wird.',
      'Seine Theorie der „Pangenesis" (Vererbungstheorie) war falsch.',
      'Gradualismus konnte nicht alle Muster im Fossilbericht erklären (fehlende Übergangsformen).',
      'Die Frage, wie Variation aufrechterhalten wird (Jenkin\'s „Blending Inheritance"-Einwand), blieb ungelöst.',
      'Altruismus und Kooperation zwischen Individuen waren schwer zu erklären.',
    ],
    legacy: [
      'Die natürliche Selektion ist bis heute der zentrale Mechanismus der Evolutionsbiologie.',
      'Die Deszendenztheorie (gemeinsame Abstammung) ist durch DNA-Analysen vielfach bestätigt.',
      'Darwins Arbeitsweise – lange Datensammlung, sorgfältige Argumentation – gilt als Vorbild wissenschaftlicher Methodik.',
      'Die Evolutionstheorie vereint alle biologischen Disziplinen (Dobzhansky: „Nichts in der Biologie ergibt Sinn außer im Licht der Evolution").',
    ],
    quiz: [
      { question: 'Was ist natürliche Selektion?', options: ['Gezielte Zucht durch den Menschen', 'Überleben und Fortpflanzung der am besten Angepassten', 'Vererbung erworbener Eigenschaften', 'Zufällige Veränderung der DNA'], correct: 1, explanation: 'Natürliche Selektion beschreibt, dass Individuen mit vorteilhaften Eigenschaften häufiger überleben und sich fortpflanzen – „Survival of the Fittest".' },
      { question: 'Was beobachtete Darwin auf den Galápagos-Inseln?', options: ['Identische Arten auf allen Inseln', 'Unterschiedliche Finkenarten mit angepassten Schnäbeln', 'Fossilien von Dinosauriern', 'Identische Pflanzen wie in England'], correct: 1, explanation: 'Darwin beobachtete, dass Finken auf verschiedenen Inseln unterschiedliche Schnabelformen hatten, angepasst an die jeweilige Nahrungsquelle.' },
      { question: 'Welches Problem hatte Darwins Theorie?', options: ['Er kannte keine natürliche Selektion', 'Er verstand den Vererbungsmechanismus nicht', 'Er glaubte an Artenkonstanz', 'Er hatte keine Beobachtungen'], correct: 1, explanation: 'Darwin kannte Mendels Vererbungsgesetze nicht und konnte nicht erklären, wie Variation entsteht und erhalten bleibt.' },
    ],
  },
  {
    id: 'synthese',
    title: 'Synthetische Evolutionstheorie',
    shortTitle: 'Synthese',
    period: '1930er–1950er',
    context: 'Die Synthetische Evolutionstheorie (Moderne Synthese) vereinte ab den 1930er Jahren Darwins Selektionstheorie mit der Mendelschen Genetik, Populationsgenetik, Paläontologie und Systematik zu einem umfassenden Rahmenwerk. Sie ist bis heute die Grundlage der modernen Evolutionsbiologie, wird aber durch neue Erkenntnisse (Epigenetik, Evo-Devo) erweitert.',
    color: 'blue',
    colorLight: 'bg-blue-50',
    colorDark: 'bg-blue-700',
    colorBorder: 'border-blue-200',
    coreIdeas: [
      { title: 'Mutation als Variationsquelle', desc: 'Zufällige Mutationen in der DNA erzeugen die genetische Variation, auf der Selektion wirken kann.' },
      { title: 'Populationsdenken', desc: 'Evolution findet in Populationen statt, nicht bei Einzelindividuen. Die Veränderung der Allelfrequenzen über Generationen ist Evolution.' },
      { title: 'Natürliche Selektion + Genetik', desc: 'Die Verknüpfung von Darwins Selektionstheorie mit Mendels Vererbungsgesetzen erklärt, wie vorteilhafte Merkmale weitergegeben werden.' },
      { title: 'Genetische Drift', desc: 'Zufällige Veränderungen der Allelfrequenzen, besonders in kleinen Populationen, sind ein weiterer Evolutionsfaktor neben Selektion.' },
      { title: 'Artbildung durch Isolation', desc: 'Geografische oder reproduktive Isolation führt zur Aufspaltung von Populationen und schließlich zur Bildung neuer Arten (Speziation).' },
    ],
    representatives: [
      { name: 'Theodosius Dobzhansky', years: '1900–1975', contribution: 'Genetics and the Origin of Species (1937) – Brücke zwischen Genetik und Evolution' },
      { name: 'Ernst Mayr', years: '1904–2005', contribution: 'Biologisches Artkonzept, allopatrische Artbildung, Populationsdenken' },
      { name: 'Julian Huxley', years: '1887–1975', contribution: 'Prägte den Begriff „Moderne Synthese" in Evolution: The Modern Synthesis (1942)' },
      { name: 'Ronald Fisher / J. B. S. Haldane / Sewall Wright', years: 'frühes 20. Jh.', contribution: 'Mathematische Populationsgenetik – quantitative Modelle der Evolution' },
    ],
    weaknesses: [
      'Epigenetische Vererbung (Methylierung, Histonmodifikation) wurde nicht berücksichtigt.',
      'Horizontaler Gentransfer (besonders bei Bakterien) passt nicht ins klassische Modell.',
      'Evo-Devo zeigt, dass Veränderungen in der Genregulation wichtiger sein können als Mutationen in Strukturgenen.',
      'Neutrale Evolution (Kimura) – viele Mutationen sind weder vorteilhaft noch nachteilig.',
      'Die Extended Evolutionary Synthesis erweitert das Rahmenwerk um Nischenkonstruktion, Plastizität und kulturelle Evolution.',
    ],
    legacy: [
      'Bildet bis heute das Fundament der Evolutionsbiologie und wird ständig durch neue Erkenntnisse erweitert.',
      'Populationsgenetische Modelle sind Grundlage der medizinischen Genetik, Züchtung und Naturschutzbiologie.',
      'Die Integration verschiedener Disziplinen bleibt methodisches Vorbild für interdisziplinäre Wissenschaft.',
      'DNA-Sequenzierung hat die Vorhersagen der Synthese (gemeinsame Abstammung, molekulare Uhr) vielfach bestätigt.',
    ],
    quiz: [
      { question: 'Was war die Hauptleistung der Modernen Synthese?', options: ['Widerlegung der Evolution', 'Vereinigung von Genetik und Selektionstheorie', 'Entdeckung der DNA', 'Entdeckung neuer Arten'], correct: 1, explanation: 'Die Moderne Synthese verband Darwins Selektionstheorie mit Mendels Genetik und der Populationsgenetik zu einem einheitlichen Rahmenwerk.' },
      { question: 'Was ist genetische Drift?', options: ['Gerichtete Selektion', 'Zufällige Veränderung der Allelfrequenzen', 'Migration zwischen Populationen', 'Mutation eines Gens'], correct: 1, explanation: 'Genetische Drift beschreibt zufällige Schwankungen der Allelfrequenzen, besonders wirksam in kleinen Populationen.' },
      { question: 'Was erweitert die Extended Evolutionary Synthesis?', options: ['Artenkonstanz', 'Lamarcks Theorie', 'Die Moderne Synthese um Epigenetik, Evo-Devo und Nischenkonstruktion', 'Cuviers Katastrophismus'], correct: 2, explanation: 'Die Extended Evolutionary Synthesis integriert Epigenetik, Evo-Devo, Nischenkonstruktion und kulturelle Evolution in das bestehende Rahmenwerk.' },
    ],
  },
];

// ── Visualization Components ──

const AntikeVisualization = () => {
  const levels = [
    { label: 'Mensch', width: 50, color: '#f59e0b' },
    { label: 'Säugetiere', width: 70, color: '#f59e0b' },
    { label: 'Vögel & Reptilien', width: 85, color: '#fbbf24' },
    { label: 'Fische', width: 100, color: '#fbbf24' },
    { label: 'Insekten', width: 115, color: '#fcd34d' },
    { label: 'Pflanzen', width: 130, color: '#fde68a' },
    { label: 'Mineralien', width: 145, color: '#fef3c7' },
  ];
  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-2 tracking-wide uppercase">Scala Naturae – Stufenleiter des Seins</p>
      {levels.map((l, i) => (
        <div key={i} className="animate-fade-in flex items-center gap-2" style={{ animationDelay: `${i * 100}ms` }}>
          <div
            className="h-8 rounded-lg flex items-center justify-center text-xs font-semibold text-white shadow-sm transition-all hover:scale-105"
            style={{ width: `${l.width * 1.2}px`, backgroundColor: l.color }}
          >
            {l.label}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-1 mt-2 text-[10px] text-amber-600 dark:text-amber-400">
        <span>einfach</span>
        <svg className="w-12 h-3" viewBox="0 0 48 12"><line x1="0" y1="6" x2="48" y2="6" stroke="currentColor" strokeWidth="1.5" /><polygon points="42,2 48,6 42,10" fill="currentColor" /></svg>
        <span>komplex</span>
      </div>
    </div>
  );
};

const LamarckVisualization = () => {
  const generations = [
    { neck: 30, label: 'Generation 1', desc: 'Kurzer Hals' },
    { neck: 45, label: 'Generation 2', desc: 'Streckt sich' },
    { neck: 60, label: 'Generation 3', desc: 'Noch länger' },
    { neck: 75, label: 'Generation 4', desc: 'Langer Hals' },
  ];
  return (
    <div className="py-4">
      <p className="text-xs font-semibold text-orange-800 dark:text-orange-200 mb-3 tracking-wide uppercase text-center">Vererbung erworbener Eigenschaften – Giraffenhals</p>
      <div className="flex justify-center items-end gap-3 sm:gap-6">
        {generations.map((g, i) => (
          <div key={i} className="animate-fade-in flex flex-col items-center" style={{ animationDelay: `${i * 150}ms` }}>
            <svg width="50" height={g.neck + 56} viewBox={`0 0 50 ${g.neck + 56}`}>
              {/* body */}
              <rect x="7" y={g.neck + 13} width="36" height="22" rx="4" fill="#f0c24a" />
              <circle cx="15" cy={g.neck + 20} r="3" fill="#8B5E3C" opacity="0.5" />
              <circle cx="28" cy={g.neck + 18} r="2.5" fill="#8B5E3C" opacity="0.5" />
              <circle cx="22" cy={g.neck + 28} r="2" fill="#8B5E3C" opacity="0.45" />
              <circle cx="35" cy={g.neck + 26} r="2.5" fill="#8B5E3C" opacity="0.5" />
              {/* legs */}
              <rect x="11" y={g.neck + 34} width="4" height="16" rx="2" fill="#d4a836" />
              <rect x="21" y={g.neck + 34} width="4" height="16" rx="2" fill="#d4a836" />
              <rect x="27" y={g.neck + 34} width="4" height="16" rx="2" fill="#d4a836" />
              <rect x="37" y={g.neck + 34} width="4" height="16" rx="2" fill="#d4a836" />
              {/* neck */}
              <rect x="20" y="15" width="10" height={g.neck} rx="5" fill="#e6b73e" />
              <circle cx="23" cy={g.neck * 0.4 + 15} r="1.5" fill="#8B5E3C" opacity="0.4" />
              <circle cx="27" cy={g.neck * 0.7 + 15} r="1.5" fill="#8B5E3C" opacity="0.4" />
              {/* head */}
              <rect x="15" y="4" width="20" height="14" rx="4" fill="#f0c24a" />
              <circle cx="19" cy="8" r="2" fill="#8B5E3C" opacity="0.4" />
              <circle cx="22" cy="9" r="1.5" fill="white" />
              <circle cx="22" cy="9" r="0.7" fill="#333" />
              {/* horns */}
              <line x1="22" y1="4" x2="20" y2="0" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="4" x2="30" y2="0" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
              {/* leaves */}
              <g opacity="0.5">
                <ellipse cx="42" cy="5" rx="6" ry="3" fill="#22c55e" transform="rotate(-20 42 5)" />
                <ellipse cx="38" cy="12" rx="5" ry="2.5" fill="#4ade80" transform="rotate(10 38 12)" />
              </g>
            </svg>
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 mt-1">{g.label}</span>
            <span className="text-[9px] text-orange-500 dark:text-orange-400">{g.desc}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
          <span>→ Erworbene Eigenschaft wird vererbt (widerlegt!)</span>
        </div>
      </div>
    </div>
  );
};

const DarwinVisualization = () => (
  <div className="py-4">
    <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-3 tracking-wide uppercase text-center">Abstammungsbaum – Descent with Modification</p>
    <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto">
      {/* trunk */}
      <line x1="150" y1="170" x2="150" y2="120" stroke="#15803d" strokeWidth="3" className="animate-draw" />
      {/* main branches */}
      <line x1="150" y1="120" x2="80" y2="80" stroke="#16a34a" strokeWidth="2.5" className="animate-draw" />
      <line x1="150" y1="120" x2="220" y2="80" stroke="#16a34a" strokeWidth="2.5" className="animate-draw" />
      {/* sub-branches left */}
      <line x1="80" y1="80" x2="45" y2="40" stroke="#22c55e" strokeWidth="2" className="animate-draw" />
      <line x1="80" y1="80" x2="100" y2="40" stroke="#22c55e" strokeWidth="2" className="animate-draw" />
      {/* sub-branches right */}
      <line x1="220" y1="80" x2="190" y2="40" stroke="#22c55e" strokeWidth="2" className="animate-draw" />
      <line x1="220" y1="80" x2="255" y2="40" stroke="#22c55e" strokeWidth="2" className="animate-draw" />
      {/* leaf nodes */}
      {[45, 100, 190, 255].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="35" r="12" fill="#4ade80" opacity="0.8" />
          <text x={x} y="38" textAnchor="middle" fontSize="8" fill="#052e16" fontWeight="600">Art {String.fromCharCode(65 + i)}</text>
        </g>
      ))}
      {/* root label */}
      <text x="150" y="178" textAnchor="middle" fontSize="9" fill="#15803d" fontWeight="600">Gemeinsamer Vorfahre</text>
      {/* selection pressure arrows */}
      <g opacity="0.5">
        <text x="15" y="65" fontSize="8" fill="#dc2626">Selektion ↓</text>
        <text x="230" y="65" fontSize="8" fill="#dc2626">Selektion ↓</text>
      </g>
      {/* variation dots */}
      {[40, 50, 55, 95, 105, 110, 185, 195, 250, 260].map((x, i) => (
        <circle key={i} cx={x} cy={25 + Math.random() * 10} r="2" fill="#86efac" opacity="0.6" />
      ))}
    </svg>
    <div className="flex justify-center gap-4 mt-2 text-[10px]">
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Überlebende Variation</span>
      <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-300 inline-block" /> Selektionsdruck</span>
    </div>
  </div>
);

const SyntheseVisualization = () => {
  const factors = [
    { label: 'Mutation', angle: 0, color: '#3b82f6', icon: '🧬' },
    { label: 'Selektion', angle: 72, color: '#22c55e', icon: '🎯' },
    { label: 'Drift', angle: 144, color: '#a855f7', icon: '🎲' },
    { label: 'Genfluss', angle: 216, color: '#f59e0b', icon: '🔄' },
    { label: 'Rekombination', angle: 288, color: '#ef4444', icon: '✂️' },
  ];
  const r = 65;
  const cx = 100, cy = 80;
  return (
    <div className="py-4">
      <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-3 tracking-wide uppercase text-center">Evolutionsfaktoren der Modernen Synthese</p>
      <svg viewBox="0 0 200 170" className="w-full max-w-xs mx-auto">
        {/* connecting lines */}
        {factors.map((f, i) => {
          const x = cx + r * Math.cos((f.angle - 90) * Math.PI / 180);
          const y = cy + r * Math.sin((f.angle - 90) * Math.PI / 180);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={f.color} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 2" />;
        })}
        {/* center */}
        <circle cx={cx} cy={cy} r="22" fill="#1e40af" opacity="0.15" />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="7" fill="#1e40af" fontWeight="700">Evolution</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontSize="6" fill="#3b82f6">Δ Allel-</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="6" fill="#3b82f6">frequenz</text>
        {/* factor nodes */}
        {factors.map((f, i) => {
          const x = cx + r * Math.cos((f.angle - 90) * Math.PI / 180);
          const y = cy + r * Math.sin((f.angle - 90) * Math.PI / 180);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="16" fill={f.color} opacity="0.2" />
              <circle cx={x} cy={y} r="12" fill={f.color} opacity="0.3" />
              <text x={x} y={y + 1} textAnchor="middle" fontSize="10">{f.icon}</text>
              <text x={x} y={y + 24} textAnchor="middle" fontSize="7" fill={f.color} fontWeight="600">{f.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const VISUALIZATIONS: Record<string, React.FC> = {
  antike: AntikeVisualization,
  lamarck: LamarckVisualization,
  darwin: DarwinVisualization,
  synthese: SyntheseVisualization,
};

// ── Section Components ──

const SectionCard = ({ title, icon, children, colorClass }: { title: string; icon: React.ReactNode; children: React.ReactNode; colorClass: string }) => (
  <div className={`bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm border ${colorClass} animate-fade-in`}>
    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const TheoryDetail = ({ theory }: { theory: Theory }) => {
  const [quizState, setQuizState] = useState<Record<number, number | null>>({});
  const Viz = VISUALIZATIONS[theory.id];
  const iconColor = `text-${theory.color}-600 dark:text-${theory.color}-400`;

  const handleAnswer = useCallback((qi: number, ai: number) => {
    setQuizState(prev => ({ ...prev, [qi]: ai }));
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Header */}
      <div className={`${theory.colorLight} dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border ${theory.colorBorder} dark:border-gray-700`}>
        <div className="flex items-start gap-3">
          <IconClock className={`w-5 h-5 ${iconColor} mt-0.5 shrink-0`} />
          <div>
            <h3 className={`font-semibold text-${theory.color}-800 dark:text-${theory.color}-200 text-sm`}>Zeitraum & Kontext</h3>
            <p className={`text-xs text-${theory.color}-700 dark:text-${theory.color}-300 font-medium mt-0.5`}>{theory.period}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{theory.context}</p>
          </div>
        </div>
      </div>

      {/* Visualization */}
      {Viz && (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${theory.colorBorder} dark:border-gray-700 overflow-hidden`}>
          <Viz />
        </div>
      )}

      {/* Core Ideas */}
      <SectionCard title="Kernideen" icon={<IconLightbulb className={`w-5 h-5 ${iconColor}`} />} colorClass={`${theory.colorBorder} dark:border-gray-700`}>
        <div className="space-y-3">
          {theory.coreIdeas.map((idea, i) => (
            <div key={i} className={`${theory.colorLight} dark:bg-gray-700/50 p-3 rounded-xl`}>
              <p className={`font-semibold text-sm text-${theory.color}-800 dark:text-${theory.color}-200`}>{i + 1}. {idea.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{idea.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Representatives */}
      <SectionCard title="Hauptvertreter" icon={<IconUsers className={`w-5 h-5 ${iconColor}`} />} colorClass={`${theory.colorBorder} dark:border-gray-700`}>
        <div className="space-y-3">
          {theory.representatives.map((rep, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`w-8 h-8 rounded-full bg-${theory.color}-100 dark:bg-${theory.color}-900/40 flex items-center justify-center text-sm font-bold text-${theory.color}-700 dark:text-${theory.color}-300 shrink-0`}>
                {rep.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{rep.name} <span className="font-normal text-xs text-gray-500 dark:text-gray-400">({rep.years})</span></p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{rep.contribution}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Weaknesses */}
      <SectionCard title="Schwächen & Kritik" icon={<IconAlertTriangle className={`w-5 h-5 ${iconColor}`} />} colorClass={`${theory.colorBorder} dark:border-gray-700`}>
        <ul className="space-y-2">
          {theory.weaknesses.map((w, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className={`text-${theory.color}-400 mt-0.5 shrink-0`}>●</span>
              {w}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Legacy */}
      <SectionCard title="Nachwirkung" icon={<IconStar className={`w-5 h-5 ${iconColor}`} />} colorClass={`${theory.colorBorder} dark:border-gray-700`}>
        <ul className="space-y-2">
          {theory.legacy.map((l, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className={`text-${theory.color}-400 mt-0.5 shrink-0`}>★</span>
              {l}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Quiz */}
      <SectionCard title="Quiz – Teste dein Wissen!" icon={<span className="text-lg">🧠</span>} colorClass={`${theory.colorBorder} dark:border-gray-700`}>
        <div className="space-y-4">
          {theory.quiz.map((q, qi) => {
            const answered = quizState[qi] !== undefined && quizState[qi] !== null;
            const correct = quizState[qi] === q.correct;
            return (
              <div key={qi} className={`p-3 rounded-xl ${answered ? (correct ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800') : `${theory.colorLight} dark:bg-gray-700/50`}`}>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">{qi + 1}. {q.question}</p>
                <div className="grid gap-1.5">
                  {q.options.map((opt, ai) => {
                    const isSelected = quizState[qi] === ai;
                    const isCorrectOpt = ai === q.correct;
                    let btnClass = `text-left px-3 py-2 rounded-lg text-xs transition-all border `;
                    if (!answered) {
                      btnClass += `border-gray-200 dark:border-gray-600 hover:border-${theory.color}-400 hover:bg-${theory.color}-50 dark:hover:bg-gray-600 cursor-pointer`;
                    } else if (isCorrectOpt) {
                      btnClass += 'border-green-400 bg-green-100 dark:bg-green-900/40 dark:border-green-600 text-green-800 dark:text-green-200 font-semibold';
                    } else if (isSelected) {
                      btnClass += 'border-red-400 bg-red-100 dark:bg-red-900/40 dark:border-red-600 text-red-700 dark:text-red-300 line-through';
                    } else {
                      btnClass += 'border-gray-200 dark:border-gray-600 opacity-50';
                    }
                    return (
                      <button key={ai} className={btnClass} onClick={() => !answered && handleAnswer(qi, ai)} disabled={answered}>
                        <span className="flex items-center gap-2">
                          {answered && isCorrectOpt && <IconCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                          {answered && isSelected && !isCorrectOpt && <IconX className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed bg-white/60 dark:bg-gray-800/60 p-2 rounded-lg">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

// ── Compare Mode ──

const CompareView = ({ theories, onBack }: { theories: Theory[]; onBack: () => void }) => {
  const [leftId, setLeftId] = useState(theories[0].id);
  const [rightId, setRightId] = useState(theories[2].id);
  const left = theories.find(t => t.id === leftId)!;
  const right = theories.find(t => t.id === rightId)!;

  const CompareSection = ({ title, leftItems, rightItems }: { title: string; leftItems: React.ReactNode; rightItems: React.ReactNode }) => (
    <div className="animate-fade-in">
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 text-center">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={`${left.colorLight} dark:bg-gray-800 p-3 rounded-xl border ${left.colorBorder} dark:border-gray-700`}>{leftItems}</div>
        <div className={`${right.colorLight} dark:bg-gray-800 p-3 rounded-xl border ${right.colorBorder} dark:border-gray-700`}>{rightItems}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Selector */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm flex items-center gap-2">
            <IconColumns className="w-4 h-4 text-green-600" />
            Vergleichsmodus
          </h3>
          <button onClick={onBack} className="text-xs text-green-700 dark:text-green-300 hover:text-green-900 flex items-center gap-1 font-medium">
            <IconList className="w-3.5 h-3.5" /> Normalansicht
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Theorie A</label>
            <select value={leftId} onChange={e => setLeftId(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-lg border-2 border-${left.color}-300 bg-${left.colorLight} dark:bg-gray-700 dark:border-gray-600 text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none`}>
              {theories.map(t => <option key={t.id} value={t.id} disabled={t.id === rightId}>{t.shortTitle}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Theorie B</label>
            <select value={rightId} onChange={e => setRightId(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-lg border-2 border-${right.color}-300 bg-${right.colorLight} dark:bg-gray-700 dark:border-gray-600 text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none`}>
              {theories.map(t => <option key={t.id} value={t.id} disabled={t.id === leftId}>{t.shortTitle}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${left.colorLight} dark:bg-gray-800 p-3 rounded-xl border ${left.colorBorder} dark:border-gray-700 text-center`}>
          <h3 className={`font-bold text-${left.color}-800 dark:text-${left.color}-200`}>{left.title}</h3>
          <p className={`text-xs text-${left.color}-600 dark:text-${left.color}-400 mt-0.5`}>{left.period}</p>
        </div>
        <div className={`${right.colorLight} dark:bg-gray-800 p-3 rounded-xl border ${right.colorBorder} dark:border-gray-700 text-center`}>
          <h3 className={`font-bold text-${right.color}-800 dark:text-${right.color}-200`}>{right.title}</h3>
          <p className={`text-xs text-${right.color}-600 dark:text-${right.color}-400 mt-0.5`}>{right.period}</p>
        </div>
      </div>

      {/* Core Ideas */}
      <CompareSection
        title="Kernideen"
        leftItems={
          <ul className="space-y-2">
            {left.coreIdeas.map((idea, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300">
                <span className={`font-semibold text-${left.color}-700 dark:text-${left.color}-300`}>{idea.title}:</span> {idea.desc}
              </li>
            ))}
          </ul>
        }
        rightItems={
          <ul className="space-y-2">
            {right.coreIdeas.map((idea, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300">
                <span className={`font-semibold text-${right.color}-700 dark:text-${right.color}-300`}>{idea.title}:</span> {idea.desc}
              </li>
            ))}
          </ul>
        }
      />

      {/* Weaknesses */}
      <CompareSection
        title="Schwächen & Kritik"
        leftItems={
          <ul className="space-y-1.5">
            {left.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex gap-1.5">
                <span className={`text-${left.color}-400 shrink-0`}>●</span>{w}
              </li>
            ))}
          </ul>
        }
        rightItems={
          <ul className="space-y-1.5">
            {right.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex gap-1.5">
                <span className={`text-${right.color}-400 shrink-0`}>●</span>{w}
              </li>
            ))}
          </ul>
        }
      />

      {/* Approach to Diversity */}
      <CompareSection
        title="Erklärung der Artenvielfalt"
        leftItems={
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {left.id === 'antike' && 'Artenvielfalt ist von Natur aus gegeben und unveränderlich. Jede Art hat ihren festen Platz in der Stufenleiter (Scala Naturae). Vielfalt wird nicht erklärt, sondern als gegeben hingenommen.'}
            {left.id === 'lamarck' && 'Artenvielfalt entsteht durch Anpassung an verschiedene Umwelten. Organismen verändern sich aktiv und geben erworbene Anpassungen weiter. Verschiedene Umwelten erzeugen verschiedene Arten.'}
            {left.id === 'darwin' && 'Artenvielfalt entsteht durch natürliche Selektion auf zufällige Variationen. Über lange Zeiträume führt Anpassung an unterschiedliche ökologische Nischen zur Aufspaltung in verschiedene Arten.'}
            {left.id === 'synthese' && 'Artenvielfalt entsteht durch das Zusammenspiel von Mutation, Selektion, Drift, Genfluss und Isolation. Speziation erfolgt durch Aufspaltung von Populationen und reproduktive Isolation.'}
          </p>
        }
        rightItems={
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {right.id === 'antike' && 'Artenvielfalt ist von Natur aus gegeben und unveränderlich. Jede Art hat ihren festen Platz in der Stufenleiter (Scala Naturae). Vielfalt wird nicht erklärt, sondern als gegeben hingenommen.'}
            {right.id === 'lamarck' && 'Artenvielfalt entsteht durch Anpassung an verschiedene Umwelten. Organismen verändern sich aktiv und geben erworbene Anpassungen weiter. Verschiedene Umwelten erzeugen verschiedene Arten.'}
            {right.id === 'darwin' && 'Artenvielfalt entsteht durch natürliche Selektion auf zufällige Variationen. Über lange Zeiträume führt Anpassung an unterschiedliche ökologische Nischen zur Aufspaltung in verschiedene Arten.'}
            {right.id === 'synthese' && 'Artenvielfalt entsteht durch das Zusammenspiel von Mutation, Selektion, Drift, Genfluss und Isolation. Speziation erfolgt durch Aufspaltung von Populationen und reproduktive Isolation.'}
          </p>
        }
      />

      {/* Legacy */}
      <CompareSection
        title="Nachwirkung heute"
        leftItems={
          <ul className="space-y-1.5">
            {left.legacy.map((l, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex gap-1.5"><span className={`text-${left.color}-400 shrink-0`}>★</span>{l}</li>
            ))}
          </ul>
        }
        rightItems={
          <ul className="space-y-1.5">
            {right.legacy.map((l, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex gap-1.5"><span className={`text-${right.color}-400 shrink-0`}>★</span>{l}</li>
            ))}
          </ul>
        }
      />
    </div>
  );
};

// ── Main App ──

const App = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [compareMode, setCompareMode] = useState(false);

  const theory = THEORIES[activeIndex];

  const goPrev = () => setActiveIndex(i => Math.max(0, i - 1));
  const goNext = () => setActiveIndex(i => Math.min(THEORIES.length - 1, i + 1));

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
      {/* Title */}
      <div className="text-center mb-5 sm:mb-6 animate-fade-in">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200">
          Geschichte der Evolutionstheorien
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Von der Antike zur Modernen Synthese</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm ${
            compareMode
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-gray-700'
          }`}
        >
          {compareMode ? <><IconList className="w-4 h-4" /> Normalansicht</> : <><IconColumns className="w-4 h-4" /> Vergleichsmodus</>}
        </button>
      </div>

      {compareMode ? (
        <CompareView theories={THEORIES} onBack={() => setCompareMode(false)} />
      ) : (
        <>
          {/* Timeline */}
          <div className="relative mb-5 sm:mb-6">
            {/* Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            <div className="flex justify-between items-start gap-1 overflow-x-auto no-scrollbar">
              {THEORIES.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveIndex(i)}
                  className="flex flex-col items-center gap-1.5 relative z-10 min-w-[70px] group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all timeline-dot ${
                      i === activeIndex
                        ? `bg-${t.color}-500 text-white shadow-lg active`
                        : `bg-white dark:bg-gray-700 text-gray-400 border-2 border-gray-200 dark:border-gray-600 group-hover:border-${t.color}-300`
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight transition-colors ${
                    i === activeIndex ? `text-${t.color}-700 dark:text-${t.color}-300` : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {t.shortTitle}
                  </span>
                  <span className={`text-[8px] sm:text-[9px] transition-colors ${
                    i === activeIndex ? `text-${t.color}-500 dark:text-${t.color}-400` : 'text-gray-300 dark:text-gray-600'
                  }`}>
                    {t.period}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows + Content */}
          <div className="flex items-start gap-2">
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="mt-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all shrink-0"
            >
              <IconChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex-grow min-w-0" key={theory.id}>
              <TheoryDetail theory={theory} />
            </div>

            <button
              onClick={goNext}
              disabled={activeIndex === THEORIES.length - 1}
              className="mt-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all shrink-0"
            >
              <IconChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Bottom Navigation Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {THEORIES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeIndex ? `bg-${t.color}-500 scale-125` : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Zu ${t.title} wechseln`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
