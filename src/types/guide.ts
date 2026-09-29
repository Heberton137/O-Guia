export interface VisualNode {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  keyConcept: string;
  visualTag?: string; // ex.: 'Origem', 'Processamento', 'Regra Geral', 'Exceção', 'Efeito'
  connections?: string[];
}

export interface ComparisonRow {
  criterion: string;
  itemA: string;
  itemB: string;
  practicalExample?: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: ComparisonRow[];
}

export interface VisualSchema {
  schemaType: 'fluxograma' | 'ciclo' | 'pilares' | 'hierarquia' | 'tabela_comparativa';
  title: string;
  description: string;
  nodes: VisualNode[];
  comparisonTable?: ComparisonTable;
}

export interface VisualStep {
  stepNumber: number;
  title: string;
  explanation: string;
  visualAnalogy?: string;
}

export interface VisualDiagram {
  type: 'passo_a_passo' | 'causa_efeito' | 'pilares' | 'esquema_visual';
  title: string;
  steps: VisualStep[];
}

export interface ModuleItem {
  id: string;
  title: string;
  overview: string;
  visualDiagram: VisualDiagram;
  detailedExplanation: string;
  practicalExample: string;
  frequentPitfall: string;
  textualEvidence: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  simpleAnalogy: string;
}

export interface ExerciseOption {
  id: string; // 'A', 'B', 'C', 'D' ou 'V', 'F'
  text: string;
}

export interface DistractorExplanation {
  optionId: string;
  whyIncorrect: string;
}

export interface CommentedAnalysis {
  correctReason: string;
  distractorExplanations: DistractorExplanation[];
  keyTakeaway: string;
  referenceInMaterial?: string;
}

export interface PracticeExercise {
  id: string;
  type: 'multipla_escolha' | 'verdadeiro_falso' | 'caso_pratico';
  difficulty: 'Iniciante' | 'Intermediário' | 'Aprofundado';
  statement: string;
  options: ExerciseOption[];
  correctOptionId: string;
  commentedAnalysis: CommentedAnalysis;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface StudyGuide {
  title: string;
  discipline: string;
  summaryForBeginners: string;
  keyObjectives: string[];
  visualSchema: VisualSchema;
  modules: ModuleItem[];
  glossary: GlossaryTerm[];
  practiceExercises: PracticeExercise[];
  flashcards: Flashcard[];
  sourceGroundingNotes: string;
  sourceFileName?: string;
  processedAt?: string;
}
