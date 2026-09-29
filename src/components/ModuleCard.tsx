import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, HelpCircle, ChevronDown, ChevronUp, Quote, Layers, CheckCircle2 } from 'lucide-react';
import { ModuleItem } from '../types/guide';
import { MathText } from './MathText';

interface ModuleCardProps {
  module: ModuleItem;
  index: number;
  onAskTopicDoubt: (moduleTitle: string, overview: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index, onAskTopicDoubt }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <article className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden transition-all hover:border-stone-300">
      {/* Cabeçalho do Módulo */}
      <div className="p-6 md:p-7 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/30">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span className="text-amber-800 font-bold">Tópico {index + 1}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Decomposição Conceitual</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-stone-950 font-serif">
            <MathText text={module.title} />
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
            <MathText text={module.overview} />
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
          <button
            onClick={() => onAskTopicDoubt(module.title, module.overview)}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Dúvida sobre este tópico"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            <span>Tirar dúvida</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Recolher tópico' : 'Expandir tópico'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 md:p-8 space-y-7 animate-fadeIn">
          {/* Decomposição Visual em Passos Didáticos */}
          {module.visualDiagram && Array.isArray(module.visualDiagram.steps) && module.visualDiagram.steps.length > 0 && (
            <div className="bg-stone-50/90 rounded-xl p-5 sm:p-6 border border-stone-200/80 space-y-3.5 shadow-2xs">
              <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>
                  Esquema Didático: <MathText text={module.visualDiagram.title} />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {(module.visualDiagram.steps || []).map((step) => (
                  <div
                    key={step.stepNumber}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2.5 transition-all hover:border-stone-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-mono font-bold flex items-center justify-center shadow-2xs">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">
                        <MathText text={step.title} />
                      </h4>
                    </div>
                    <div className="text-xs text-stone-700 leading-relaxed">
                      <MathText text={step.explanation} />
                    </div>
                    {step.visualAnalogy && (
                      <div className="pt-2 border-t border-stone-100 text-[11px] text-amber-900 italic font-serif">
                        Analogia: <MathText text={step.visualAnalogy} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explicação Detalhada Fundamentada */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900"></span>
              <span>Fundamentos e Desenvolvimento Teórico</span>
            </h3>
            <div className="text-sm sm:text-base text-stone-800 leading-relaxed font-sans space-y-3 whitespace-pre-line">
              <MathText text={module.detailedExplanation} />
            </div>
          </div>

          {/* Exemplo Prático Concreto */}
          <div className="bg-emerald-50/60 rounded-xl p-5 sm:p-6 border border-emerald-200/80 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              <span>Aplicação Prática no Mundo Real</span>
            </div>
            <div className="text-sm text-stone-800 leading-relaxed">
              <MathText text={module.practicalExample} />
            </div>
          </div>

          {/* Atenção ao Detalhe / Pegadinha Habitual */}
          <div className="bg-amber-50/70 rounded-xl p-5 sm:p-6 border border-amber-200/90 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Atenção ao Detalhe (Ponto Crítico de Fixação)</span>
            </div>
            <div className="text-sm text-stone-900 leading-relaxed font-medium">
              <MathText text={module.frequentPitfall} />
            </div>
          </div>

          {/* Evidência Textual / Citação do Documento */}
          {module.textualEvidence && (
            <div className="pt-4 border-t border-stone-100 flex items-start gap-2.5 text-xs text-stone-600">
              <Quote className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-700">Base no material analisado: </span>
                <span className="italic">
                  <MathText text={module.textualEvidence} />
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
