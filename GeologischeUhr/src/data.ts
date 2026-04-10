export interface Milestone {
  id: string;
  timeHours: number; // 0-24 decimal hours on the geological clock
  yearsAgo: number; // in millions of years
  title: string;
  period: string;
  eon: Eon;
  description: string;
  icon: string; // emoji
}

export type Eon = 'Hadaikum' | 'Archaikum' | 'Proterozoikum' | 'Phanerozoikum';

export interface EonData {
  name: Eon;
  startHours: number;
  endHours: number;
  color: string; // neon accent color
  bgColor: string; // darker variant
  yearsStart: number; // mya
  yearsEnd: number; // mya
}

// 4600 mya = 24h => 1h = 191.67 mya => 1 mya = 0.005217h = 0.31304 min = 18.78s
const MYA_TO_HOURS = 24 / 4600;

function myaToHours(mya: number): number {
  return 24 - mya * MYA_TO_HOURS;
}

export const eons: EonData[] = [
  {
    name: 'Hadaikum',
    startHours: 0,
    endHours: myaToHours(4000), // ~3.13h
    color: '#ff4444',
    bgColor: '#441111',
    yearsStart: 4600,
    yearsEnd: 4000,
  },
  {
    name: 'Archaikum',
    startHours: myaToHours(4000),
    endHours: myaToHours(2500), // ~10.96h
    color: '#ff8844',
    bgColor: '#442211',
    yearsStart: 4000,
    yearsEnd: 2500,
  },
  {
    name: 'Proterozoikum',
    startHours: myaToHours(2500),
    endHours: myaToHours(541), // ~21.18h
    color: '#44bbff',
    bgColor: '#112233',
    yearsStart: 2500,
    yearsEnd: 541,
  },
  {
    name: 'Phanerozoikum',
    startHours: myaToHours(541),
    endHours: 24,
    color: '#44ff88',
    bgColor: '#114422',
    yearsStart: 541,
    yearsEnd: 0,
  },
];

export const milestones: Milestone[] = [
  {
    id: 'earth-formation',
    timeHours: 0,
    yearsAgo: 4600,
    title: 'Entstehung der Erde',
    period: 'Hadaikum',
    eon: 'Hadaikum',
    description:
      'Aus einer rotierenden Scheibe aus Gas und Staub formt sich unser Planet. Die junge Erde ist eine glühende Kugel aus geschmolzenem Gestein, ständig bombardiert von Asteroiden. Es gibt weder Atmosphäre noch Ozeane – nur eine Hölle aus Magma und kosmischem Staub.',
    icon: '🌍',
  },
  {
    id: 'moon-formation',
    timeHours: myaToHours(4500),
    yearsAgo: 4500,
    title: 'Entstehung des Mondes',
    period: 'Hadaikum',
    eon: 'Hadaikum',
    description:
      'Ein marsgroßer Himmelskörper namens Theia kollidiert mit der Erde. Aus den Trümmern dieser gewaltigen Kollision bildet sich der Mond. Er stabilisiert die Erdachse und ermöglicht so langfristig ein stabiles Klima.',
    icon: '🌙',
  },
  {
    id: 'first-oceans',
    timeHours: myaToHours(4400),
    yearsAgo: 4400,
    title: 'Erste Ozeane',
    period: 'Hadaikum',
    eon: 'Hadaikum',
    description:
      'Die Erde kühlt ab und Wasserdampf kondensiert zu den ersten Ozeanen. Diese Urmeere sind heiß und sauer – aber sie werden zur Wiege des Lebens. Zirkonkristalle aus dieser Zeit zeigen Spuren von flüssigem Wasser.',
    icon: '🌊',
  },
  {
    id: 'first-life',
    timeHours: myaToHours(3800),
    yearsAgo: 3800,
    title: 'Erstes Leben',
    period: 'Eoarchaikum',
    eon: 'Archaikum',
    description:
      'In der Umgebung hydrothermaler Schlote am Meeresboden entstehen die ersten einfachen Zellen – Prokaryoten. Diese winzigen Organismen ohne Zellkern sind die Urväter allen Lebens auf der Erde.',
    icon: '🦠',
  },
  {
    id: 'photosynthesis',
    timeHours: myaToHours(3500),
    yearsAgo: 3500,
    title: 'Erste Photosynthese',
    period: 'Paläoarchaikum',
    eon: 'Archaikum',
    description:
      'Cyanobakterien entwickeln die Fähigkeit zur Photosynthese. Sie nutzen Sonnenlicht, um aus Wasser und CO₂ Energie zu gewinnen – und produzieren dabei Sauerstoff als „Abfallprodukt". Dies wird die Atmosphäre für immer verändern.',
    icon: '☀️',
  },
  {
    id: 'great-oxidation',
    timeHours: myaToHours(2400),
    yearsAgo: 2400,
    title: 'Große Sauerstoffkatastrophe',
    period: 'Siderium',
    eon: 'Proterozoikum',
    description:
      'Der von Cyanobakterien produzierte Sauerstoff reichert sich in der Atmosphäre an. Für die meisten anaeroben Organismen ist dies tödlich – das größte Massenaussterben der Erdgeschichte. Gleichzeitig ermöglicht der Sauerstoff komplexeres Leben.',
    icon: '💨',
  },
  {
    id: 'eukaryotes',
    timeHours: myaToHours(2100),
    yearsAgo: 2100,
    title: 'Erste Eukaryoten',
    period: 'Rhyacium',
    eon: 'Proterozoikum',
    description:
      'Durch Endosymbiose – ein Bakterium wird von einem anderen verschluckt, aber nicht verdaut – entstehen die ersten Zellen mit Zellkern. Mitochondrien und später Chloroplasten sind die Überreste dieser uralten Partnerschaft.',
    icon: '🔬',
  },
  {
    id: 'multicellular',
    timeHours: myaToHours(1200),
    yearsAgo: 1200,
    title: 'Erste Mehrzeller',
    period: 'Stenium',
    eon: 'Proterozoikum',
    description:
      'Einzellige Organismen beginnen, dauerhafte Zellverbände zu bilden. Die Bangiomorpha-Rotalge ist einer der ältesten bekannten Mehrzeller und zeigt sogar bereits sexuelle Fortpflanzung.',
    icon: '🧬',
  },
  {
    id: 'fossils',
    timeHours: myaToHours(600),
    yearsAgo: 600,
    title: 'Ediacara-Fauna',
    period: 'Ediacarium',
    eon: 'Proterozoikum',
    description:
      'Die ersten großen, komplexen Lebewesen erscheinen: bizarre, farnähnliche und kissenförmige Organismen. Die Ediacara-Fauna umfasst Formen, die keiner heutigen Tiergruppe zugeordnet werden können – ein einzigartiges Experiment der Evolution.',
    icon: '🪸',
  },
  {
    id: 'cambrian-explosion',
    timeHours: myaToHours(541),
    yearsAgo: 541,
    title: 'Kambrische Explosion',
    period: 'Kambrium',
    eon: 'Phanerozoikum',
    description:
      'In einem geologischen Wimpernschlag entstehen fast alle heutigen Tierstämme. Trilobiten, erste Räuber mit Augen, und bizarre Formen wie Anomalocaris bevölkern die Meere. Die Evolution der Hartteile (Schalen, Skelette) revolutioniert das Leben.',
    icon: '🐚',
  },
  {
    id: 'first-vertebrates',
    timeHours: myaToHours(500),
    yearsAgo: 500,
    title: 'Erste Wirbeltiere (Fische)',
    period: 'Ordovizium',
    eon: 'Phanerozoikum',
    description:
      'Kieferlose, gepanzerte Fische sind die ersten Wirbeltiere. Mit ihrer inneren Skelettstruktur aus Knorpel und später Knochen legen sie den Grundstein für alle späteren Wirbeltiere – einschließlich uns Menschen.',
    icon: '🐟',
  },
  {
    id: 'land-plants',
    timeHours: myaToHours(470),
    yearsAgo: 470,
    title: 'Erste Landpflanzen',
    period: 'Ordovizium',
    eon: 'Phanerozoikum',
    description:
      'Moosähnliche Pflanzen erobern das Festland. Ohne Wurzeln und Leitgefäße bleiben sie klein, aber sie verändern die Landschaften fundamental und bereiten den Boden für die spätere Besiedlung durch Tiere vor.',
    icon: '🌿',
  },
  {
    id: 'land-animals',
    timeHours: myaToHours(375),
    yearsAgo: 375,
    title: 'Erste Landwirbeltiere',
    period: 'Devon',
    eon: 'Phanerozoikum',
    description:
      'Tiktaalik und andere Übergangsformen wagen den Schritt ans Land. Mit kräftigen Flossen, die fast schon Beine sind, und primitiven Lungen erobern die ersten Amphibien das Festland – einer der bedeutendsten Übergänge der Evolution.',
    icon: '🐸',
  },
  {
    id: 'reptiles',
    timeHours: myaToHours(312),
    yearsAgo: 312,
    title: 'Erste Reptilien',
    period: 'Karbon',
    eon: 'Phanerozoikum',
    description:
      'Das amniotische Ei befreit die Wirbeltiere vom Wasser. Reptilien können nun ihre Eier an Land legen und sich von Gewässern unabhängig machen. Riesige Wälder aus Farnen und Schachtelhalmen dominieren die Landschaft.',
    icon: '🦎',
  },
  {
    id: 'mass-extinction-permian',
    timeHours: myaToHours(252),
    yearsAgo: 252,
    title: 'Großes Sterben (Perm)',
    period: 'Perm/Trias-Grenze',
    eon: 'Phanerozoikum',
    description:
      'Das schlimmste Massenaussterben der Erdgeschichte: 96 % aller Meeresarten und 70 % der Landwirbeltiere sterben aus. Vulkanismus in Sibirien vergiftet Atmosphäre und Ozeane. Das Leben braucht Millionen Jahre, um sich zu erholen.',
    icon: '💀',
  },
  {
    id: 'dinosaurs',
    timeHours: myaToHours(230),
    yearsAgo: 230,
    title: 'Erste Dinosaurier & Säugetiere',
    period: 'Trias',
    eon: 'Phanerozoikum',
    description:
      'Nach dem großen Sterben erobern Dinosaurier und die ersten kleinen Säugetiere die frei gewordenen ökologischen Nischen. Die Dinosaurier werden für über 160 Millionen Jahre die dominierenden Landtiere sein.',
    icon: '🦕',
  },
  {
    id: 'first-birds',
    timeHours: myaToHours(150),
    yearsAgo: 150,
    title: 'Erste Vögel (Archaeopteryx)',
    period: 'Jura',
    eon: 'Phanerozoikum',
    description:
      'Archaeopteryx, ein gefiederter Dinosaurier, zeigt den Übergang von Reptil zu Vogel. Mit Zähnen, Krallen an den Flügeln und einem langen Knochenschwanz ist er eine perfekte Übergangsform – Beweis, dass Vögel lebende Dinosaurier sind.',
    icon: '🐦',
  },
  {
    id: 'first-flowers',
    timeHours: myaToHours(130),
    yearsAgo: 130,
    title: 'Erste Blütenpflanzen',
    period: 'Kreide',
    eon: 'Phanerozoikum',
    description:
      'Blütenpflanzen (Angiospermen) revolutionieren die Pflanzenwelt. Ihre Co-Evolution mit bestäubenden Insekten führt zu einer explosionsartigen Diversifizierung und sie verdrängen nach und nach die Nadelbäume und Farne.',
    icon: '🌸',
  },
  {
    id: 'dino-extinction',
    timeHours: myaToHours(66),
    yearsAgo: 66,
    title: 'Aussterben der Dinosaurier',
    period: 'Kreide/Paläogen-Grenze',
    eon: 'Phanerozoikum',
    description:
      'Ein 10 km großer Asteroid schlägt im heutigen Mexiko (Chicxulub) ein. Der Impact-Winter und seine Folgen löschen 75 % aller Arten aus, darunter alle Nicht-Vogel-Dinosaurier. Für die kleinen Säugetiere öffnet sich eine Welt voller Möglichkeiten.',
    icon: '☄️',
  },
  {
    id: 'primates',
    timeHours: myaToHours(55),
    yearsAgo: 55,
    title: 'Erste Primaten',
    period: 'Eozän',
    eon: 'Phanerozoikum',
    description:
      'Kleine, nachtaktive Baumbewohner mit Greifhänden und nach vorne gerichteten Augen – die ersten Primaten. Das Stereosehen und die Geschicklichkeit ihrer Hände legen den Grundstein für die spätere Entwicklung zum Menschen.',
    icon: '🐒',
  },
  {
    id: 'grasslands',
    timeHours: myaToHours(25),
    yearsAgo: 25,
    title: 'Graslandschaften entstehen',
    period: 'Oligozän/Miozän',
    eon: 'Phanerozoikum',
    description:
      'Weite Graslandschaften ersetzen Wälder. Diese neue Umgebung fördert die Evolution von Huftieren, Raubtieren und schließlich aufrecht gehenden Menschenaffen, die die offene Savanne besiedeln.',
    icon: '🌾',
  },
  {
    id: 'homo-sapiens',
    timeHours: myaToHours(0.3), // ~23:59:54 – Homo sapiens vor ca. 300.000 Jahren
    yearsAgo: 0.3,
    title: 'Homo sapiens',
    period: 'Quartär',
    eon: 'Phanerozoikum',
    description:
      'Erst in der allerletzten Sekunde des 24-Stunden-Tages erscheint der moderne Mensch. Unsere gesamte Geschichte – von den Höhlenmalereien bis zur Raumfahrt – spielt sich in einem Wimpernschlag der Erdgeschichte ab.',
    icon: '👤',
  },
];

export function hoursToTimeString(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function hoursToYearsAgo(hours: number): number {
  return (24 - hours) / MYA_TO_HOURS;
}

export function formatYearsAgo(mya: number): string {
  if (mya >= 1000) return `${(mya / 1000).toFixed(1)} Milliarden Jahren`;
  if (mya >= 1) return `${Math.round(mya)} Millionen Jahren`;
  const years = Math.round(mya * 1_000_000);
  if (years >= 1000) return `${years.toLocaleString('de-DE')} Jahren`;
  if (years > 0) return `${years} Jahren`;
  return 'der Gegenwart';
}

export function getEonForHours(hours: number): EonData {
  return eons.find((e) => hours >= e.startHours && hours < e.endHours) ?? eons[eons.length - 1];
}

export function getCurrentMilestone(hours: number): Milestone | null {
  let best: Milestone | null = null;
  let bestDist = Infinity;
  for (const m of milestones) {
    const dist = Math.abs(m.timeHours - hours);
    if (dist < bestDist) {
      bestDist = dist;
      best = m;
    }
  }
  return best;
}

export function getNearbyMilestones(hours: number, count = 3): Milestone[] {
  return [...milestones]
    .sort((a, b) => Math.abs(a.timeHours - hours) - Math.abs(b.timeHours - hours))
    .slice(0, count);
}
