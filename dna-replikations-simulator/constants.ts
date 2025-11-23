import { GlossaryTerm, QuizQuestion } from './types';

// Color Palette
export const COLORS = {
  primary: '#2C3E50', // Dark Blue
  secondary: '#16A085', // Turquoise
  secondaryHover: '#1ABC9C',
  strand1: '#9B59B6', // Violet
  strand2: '#E67E22', // Orange
  newStrand1: '#D7BDE2', // Light Violet
  newStrand2: '#F5CBA7', // Light Orange
  helicase: '#F39C12', // Yellow
  primase: '#E74C3C', // Red
  polymerase: '#27AE60', // Green
  ligase: '#3498DB', // Blue
  primer: '#C0392B', // Dark Red
  background: '#ECF0F1', // Light Gray
  text: '#34495E', // Dark Gray
  success: '#2ECC71',
  error: '#E74C3C',
};

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'Antiparallel', definition: "Die beiden DNA-Stränge verlaufen in entgegengesetzter Richtung: Ein Strang in 5'→3'-Richtung, der andere in 3'→5'-Richtung." },
  { term: 'DNA-Ligase', definition: "Enzym, das DNA-Stränge verknüpft, indem es Phosphodiesterbindungen bildet. 'Kleber' der DNA." },
  { term: 'DNA-Polymerase', definition: "Zentrales Enzym, das neue DNA-Stränge synthetisiert (5'→3'). Benötigt einen Primer." },
  { term: 'Folgestrang', definition: "Der DNA-Strang, der diskontinuierlich in Okazaki-Fragmenten synthetisiert wird." },
  { term: 'Helikase', definition: "Enzym, das die DNA-Doppelhelix entwindet und die Stränge trennt." },
  { term: 'Leitstrang', definition: "Der DNA-Strang, der kontinuierlich in Richtung der Replikationsgabel synthetisiert wird." },
  { term: 'Matrizenstrang', definition: "Der Elternstrang, der als Kopiervorlage dient." },
  { term: 'Okazaki-Fragmente', definition: "Kurze DNA-Abschnitte am Folgestrang, die später verknüpft werden." },
  { term: 'Primase', definition: "Enzym, das kurze RNA-Primer als Startpunkt synthetisiert." },
  { term: 'Primer', definition: "Kurze RNA-Sequenz, Startpunkt für die DNA-Polymerase." },
  { term: 'Semikonservativ', definition: "Replikationsmechanismus: Jede Tochter-DNA besteht aus einem alten und einem neuen Strang." },
  { term: "5'→3'-Richtung", definition: "Syntheserichtung der DNA-Polymerase. Sie kann nur am 3'-Ende anbauen." },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Was bewies das Meselson-Stahl-Experiment?",
    options: [
      { id: 'A', text: "Die DNA ist eine Doppelhelix" },
      { id: 'B', text: "Die Replikation verläuft semikonservativ" },
      { id: 'C', text: "DNA-Polymerase benötigt einen Primer" },
      { id: 'D', text: "Okazaki-Fragmente existieren" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Korrekt! Das Experiment zeigte, dass nach der ersten Replikation alle DNA-Moleküle hybrid waren.",
    feedbackWrong: "❌ Nicht ganz. Es ging um den Beweis, dass jeder alte Strang als Matrize dient (semikonservativ)."
  },
  {
    id: 2,
    question: "Welche Funktion hat die Helikase?",
    options: [
      { id: 'A', text: "Verknüpft Okazaki-Fragmente" },
      { id: 'B', text: "Synthetisiert RNA-Primer" },
      { id: 'C', text: "Trennt die DNA-Stränge" },
      { id: 'D', text: "Fügt Nukleotide hinzu" }
    ],
    correctAnswer: 'C',
    feedbackCorrect: "✅ Richtig! Die Helikase öffnet die Doppelhelix.",
    feedbackWrong: "❌ Die Helikase ist der 'Reißverschluss-Öffner' am Anfang."
  },
  {
    id: 3,
    question: "In welcher Richtung synthetisiert die DNA-Polymerase?",
    options: [
      { id: 'A', text: "3'→5'" },
      { id: 'B', text: "5'→3'" },
      { id: 'C', text: "Beide Richtungen" },
      { id: 'D', text: "Variabel" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Korrekt! Immer von 5' nach 3'.",
    feedbackWrong: "❌ Die Chemie erlaubt nur das Anfügen an das 3'-OH Ende, also wächst der Strang in 5'→3' Richtung."
  },
  {
    id: 4,
    question: "Warum ist ein RNA-Primer notwendig?",
    options: [
      { id: 'A', text: "RNA ist stabiler" },
      { id: 'B', text: "Polymerase kann nicht eigenständig beginnen" },
      { id: 'C', text: "Verhindert Fehler" },
      { id: 'D', text: "Markiert das Ende" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Genau! Die Polymerase braucht ein freies 3'-Ende zum Starten.",
    feedbackWrong: "❌ Die Polymerase kann nicht 'aus dem Nichts' starten, sie braucht einen Ansatzpunkt (Primer)."
  },
  {
    id: 5,
    question: "Warum wird der Leitstrang kontinuierlich synthetisiert?",
    options: [
      { id: 'A', text: "Er ist kürzer" },
      { id: 'B', text: "Syntheserichtung stimmt mit Gabelbewegung überein" },
      { id: 'C', text: "Braucht keine Primer" },
      { id: 'D', text: "Er ist wichtiger" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Richtig! Die Polymerase läuft einfach hinter der Helikase her.",
    feedbackWrong: "❌ Es liegt an der Richtung. Die Gabel öffnet sich in die gleiche Richtung wie die Synthese."
  },
  {
    id: 6,
    question: "Was sind Okazaki-Fragmente?",
    options: [
      { id: 'A', text: "Primer am Leitstrang" },
      { id: 'B', text: "Kurze DNA-Stücke am Folgestrang" },
      { id: 'C', text: "Fehler bei der Replikation" },
      { id: 'D', text: "Enzyme" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Korrekt! Entstehen durch die diskontinuierliche Synthese.",
    feedbackWrong: "❌ Das sind die 'Stückchen' am Folgestrang."
  },
  {
    id: 7,
    question: "Welche Funktion hat die DNA-Ligase?",
    options: [
      { id: 'A', text: "Öffnet Helix" },
      { id: 'B', text: "Fügt Nukleotide hinzu" },
      { id: 'C', text: "Verknüpft Fragmente" },
      { id: 'D', text: "Macht Primer" }
    ],
    correctAnswer: 'C',
    feedbackCorrect: "✅ Richtig! Sie ist der molekulare Kleber.",
    feedbackWrong: "❌ Sie verbindet die Okazaki-Fragmente am Ende."
  },
  {
    id: 8,
    question: "Warum gibt es Leit- und Folgestrang?",
    options: [
      { id: 'A', text: "Weil DNA eine Doppelhelix ist" },
      { id: 'B', text: "Antiparallele Stränge + 5'→3' Zwang" },
      { id: 'C', text: "Unterschiedliche Enzyme" },
      { id: 'D', text: "Zufall" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Exzellent! Eine Kombination aus Struktur und Enzym-Chemie.",
    feedbackWrong: "❌ Die DNA ist antiparallel, aber die Polymerase funktioniert nur in eine Richtung."
  },
  {
    id: 9,
    question: "Was passiert mit den RNA-Primern?",
    options: [
      { id: 'A', text: "Bleiben erhalten" },
      { id: 'B', text: "Werden entfernt und durch DNA ersetzt" },
      { id: 'C', text: "Werden Proteine" },
      { id: 'D', text: "Markieren das Ende" }
    ],
    correctAnswer: 'B',
    feedbackCorrect: "✅ Korrekt! In der fertigen DNA soll keine RNA sein.",
    feedbackWrong: "❌ Sie werden ausgetauscht gegen DNA-Bausteine."
  },
  {
    id: 10,
    question: "Was bedeutet 'semikonservativ'?",
    options: [
      { id: 'A', text: "Zur Hälfte repliziert" },
      { id: 'B', text: "Elternstränge bleiben zusammen" },
      { id: 'C', text: "1 alter + 1 neuer Strang pro Molekül" },
      { id: 'D', text: "Nur an bestimmten Stellen" }
    ],
    correctAnswer: 'C',
    feedbackCorrect: "✅ Perfekt! Die Hälfte (semi) bleibt erhalten (konservativ).",
    feedbackWrong: "❌ Jeder neue Doppelstrang enthält einen alten Strang als Vorlage."
  }
];
