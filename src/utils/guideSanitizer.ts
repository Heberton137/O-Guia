import { StudyGuide } from '../types/guide';

export function sanitizeStudyGuide(raw: any): StudyGuide {
  if (!raw || typeof raw !== 'object') {
    return {
      title: 'Guia de Estudos',
      discipline: 'Geral',
      summaryForBeginners: '',
      keyObjectives: [],
      visualSchema: {
        schemaType: 'fluxograma',
        title: '',
        description: '',
        nodes: [],
      },
      modules: [],
      glossary: [],
      practiceExercises: [],
      flashcards: [],
      sourceGroundingNotes: '',
    };
  }

  const sanitized: StudyGuide = {
    title: raw.title || 'Guia de Estudos',
    discipline: raw.discipline || 'Geral',
    summaryForBeginners: raw.summaryForBeginners || '',
    keyObjectives: Array.isArray(raw.keyObjectives) ? raw.keyObjectives : [],
    visualSchema: {
      schemaType: raw.visualSchema?.schemaType || 'fluxograma',
      title: raw.visualSchema?.title || '',
      description: raw.visualSchema?.description || '',
      nodes: Array.isArray(raw.visualSchema?.nodes) ? raw.visualSchema.nodes : [],
      comparisonTable: raw.visualSchema?.comparisonTable
        ? {
            title: raw.visualSchema.comparisonTable.title || '',
            headers: Array.isArray(raw.visualSchema.comparisonTable.headers)
              ? raw.visualSchema.comparisonTable.headers
              : [],
            rows: Array.isArray(raw.visualSchema.comparisonTable.rows)
              ? raw.visualSchema.comparisonTable.rows
              : [],
          }
        : undefined,
    },
    modules: Array.isArray(raw.modules)
      ? raw.modules.map((m: any, idx: number) => ({
          id: m?.id || `mod-${idx}`,
          title: m?.title || `Tópico ${idx + 1}`,
          overview: m?.overview || '',
          visualDiagram: {
            type: m?.visualDiagram?.type || 'passo_a_passo',
            title: m?.visualDiagram?.title || '',
            steps: Array.isArray(m?.visualDiagram?.steps) ? m.visualDiagram.steps : [],
          },
          detailedExplanation: m?.detailedExplanation || '',
          practicalExample: m?.practicalExample || '',
          frequentPitfall: m?.frequentPitfall || '',
          textualEvidence: m?.textualEvidence || '',
        }))
      : [],
    glossary: Array.isArray(raw.glossary) ? raw.glossary : [],
    practiceExercises: Array.isArray(raw.practiceExercises)
      ? raw.practiceExercises.map((ex: any, idx: number) => ({
          id: ex?.id || `ex-${idx}`,
          type: ex?.type || 'multipla_escolha',
          difficulty: ex?.difficulty || 'Intermediário',
          statement: ex?.statement || '',
          options: Array.isArray(ex?.options) ? ex.options : [],
          correctOptionId: ex?.correctOptionId || 'A',
          commentedAnalysis: {
            correctReason: ex?.commentedAnalysis?.correctReason || '',
            distractorExplanations: Array.isArray(
              ex?.commentedAnalysis?.distractorExplanations
            )
              ? ex.commentedAnalysis.distractorExplanations
              : [],
            keyTakeaway: ex?.commentedAnalysis?.keyTakeaway || '',
            referenceInMaterial: ex?.commentedAnalysis?.referenceInMaterial || '',
          },
        }))
      : [],
    flashcards: Array.isArray(raw.flashcards) ? raw.flashcards : [],
    sourceGroundingNotes: raw.sourceGroundingNotes || '',
    sourceFileName: raw.sourceFileName,
    processedAt: raw.processedAt || new Date().toLocaleDateString('pt-BR'),
  };

  return sanitized;
}
