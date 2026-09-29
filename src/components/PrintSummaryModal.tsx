import React from 'react';
import { X, Printer, BookOpen } from 'lucide-react';
import { StudyGuide } from '../types/guide';
import { MathText } from './MathText';

interface PrintSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: StudyGuide;
}

export const PrintSummaryModal: React.FC<PrintSummaryModalProps> = ({
  isOpen,
  onClose,
  guide,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn print:p-0 print:bg-white print:fixed">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Barra de Ações (oculta na impressão) */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between print:hidden bg-stone-50/50">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h3 className="text-sm sm:text-base font-bold text-stone-950 font-serif">
              Caderno de Estudos Consolidado
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 font-serif print:overflow-visible print:p-0">
          {/* Cabeçalho do Documento */}
          <div className="border-b-2 border-stone-900 pb-4">
            <div className="flex items-center justify-between text-xs text-stone-500 font-sans uppercase tracking-wider mb-1">
              <span>{guide.discipline}</span>
              <span>O Guia · Plataforma Pedagógica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-950">
              <MathText text={guide.title} />
            </h1>
            <p className="text-xs text-stone-500 font-sans mt-1">
              Material estruturado com fórmulas renderizadas em LaTeX para fixação ativa.
            </p>
          </div>

          {/* Visão Panorâmica */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-700">
              Visão Panorâmica do Assunto (Para Leigos)
            </h2>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm leading-relaxed text-stone-800 italic">
              “<MathText text={guide.summaryForBeginners} />”
            </div>
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-700">
              Objetivos de Aprendizagem
            </h2>
            <ul className="list-disc pl-5 text-xs sm:text-sm font-sans text-stone-800 space-y-1">
              {(guide.keyObjectives || []).map((obj, i) => (
                <li key={i}>
                  <MathText text={obj} />
                </li>
              ))}
            </ul>
          </div>

          {/* Módulos com Análise e Esquemas */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
              Decomposição dos Tópicos e Fundamentos
            </h2>

            {(guide.modules || []).map((mod, idx) => (
              <div key={idx} className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-stone-900">
                  <MathText text={mod.title} />
                </h3>
                <div className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed whitespace-pre-line">
                  <MathText text={mod.detailedExplanation} />
                </div>
                <div className="text-xs font-sans bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-stone-800">
                  <strong>Aplicação Prática: </strong> <MathText text={mod.practicalExample} />
                </div>
                <div className="text-xs font-sans text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                  <strong>Atenção ao Detalhe: </strong> <MathText text={mod.frequentPitfall} />
                </div>
              </div>
            ))}
          </div>

          {/* Exercícios de Fixação com Gabarito Comentado */}
          <div className="space-y-6 pt-4 border-t-2 border-stone-900">
            <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-700">
              Exercícios de Fixação com Análise Comentada das Soluções
            </h2>

            {(guide.practiceExercises || []).map((ex, i) => (
              <div key={ex.id} className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs sm:text-sm font-sans">
                <div className="font-bold text-stone-900">
                  Questão {i + 1} ({ex.difficulty} · {ex.type.replace('_', ' ')})
                </div>
                <div className="font-serif text-stone-900 text-sm leading-relaxed">
                  <MathText text={ex.statement} />
                </div>

                <div className="space-y-1.5 pl-2">
                  {(ex.options || []).map((opt) => (
                    <div
                      key={opt.id}
                      className={
                        opt.id === ex.correctOptionId
                          ? 'font-bold text-emerald-800'
                          : 'text-stone-600'
                      }
                    >
                      ({opt.id}) <MathText text={opt.text} />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs space-y-2">
                  <div className="font-bold text-stone-900">
                    Gabarito Oficial: Alternativa ({ex.correctOptionId})
                  </div>
                  <div className="text-stone-700">
                    <strong>Justificativa do Gabarito: </strong>
                    <MathText text={ex.commentedAnalysis?.correctReason || ''} />
                  </div>
                  {(ex.commentedAnalysis?.distractorExplanations || []).map((d) => (
                    <div key={d.optionId} className="text-stone-600 pl-2">
                      • Opção ({d.optionId}) incorreta: <MathText text={d.whyIncorrect} />
                    </div>
                  ))}
                  <div className="text-stone-800 font-semibold pt-1">
                    Síntese mnemônica: <MathText text={ex.commentedAnalysis?.keyTakeaway || ''} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé de Compromisso Metodológico */}
          <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 font-sans flex items-center justify-between">
            <span>O Guia — Plataforma Pedagógica</span>
            <span>Rigor conceitual · Notação LaTeX · Português esmerado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
