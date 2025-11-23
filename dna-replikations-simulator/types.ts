export enum ViewState {
  HOME = 'HOME',
  MESELSON = 'MESELSON',
  SIMULATOR = 'SIMULATOR',
  COMPARISON = 'COMPARISON',
  QUIZ = 'QUIZ'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface EnzymeConfig {
  showHelicase: boolean;
  showPrimase: boolean;
  showPolymerase: boolean;
  showLigase: boolean;
  showLabels: boolean;
  showArrows: boolean;
}