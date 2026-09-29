import React from 'react';
import { Target, ShieldCheck, Compass, Sparkles, BookOpen } from 'lucide-react';
import { StudyGuide } from '../types/guide';
import { MathText } from './MathText';

interface OverviewSectionProps {
  guide: StudyGuide;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ guide }) => {
  return (
    <section className="space-y-6">
      {/* Banner Principal de Contexto Acadêmico */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 md:p-9 shadow-xs transition-all">
        <div className="max-w-4xl space-y-4">
          {/* Metadados sem enclausuramento em pílula (Zero-Pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span className="text-amber-800 font-bold">{guide.discipline}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Plano Personalizado</span>
            {guide.sourceFileName && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="truncate max-w-xs text-stone-800 font-medium">
                  {guide.sourceFileName}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-950 font-serif leading-tight">
            <MathText text={guide.title} />
          </h1>

          {/* Visão Panorâmica para Leigos */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 tracking-wide uppercase mb-2.5">
              <Compass className="w-4 h-4 text-amber-700" />
              <span>Visão Panorâmica do Assunto (Para Leigos)</span>
            </div>
            <div className="text-base sm:text-lg text-stone-800 font-serif leading-relaxed bg-amber-50/70 p-5 sm:p-6 rounded-xl border border-amber-200/70 shadow-2xs">
              <span className="text-2xl text-amber-400 font-serif mr-1">“</span>
              <MathText text={guide.summaryForBeginners} />
              <span className="text-2xl text-amber-400 font-serif ml-1">”</span>
            </div>
          </div>
        </div>

        {/* Grade: Objetivos Pedagógicos & Rigor Científico */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
          {/* Metas de Aprendizagem */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
              <Target className="w-4 h-4 text-amber-700" />
              <span>O que você dominará com este guia</span>
            </div>
            <ul className="space-y-2.5">
              {(guide.keyObjectives || []).map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-stone-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-900 text-stone-100 text-xs font-semibold flex items-center justify-center mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">
                    <MathText text={goal} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nota de Fidelidade às Referências */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200/90 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Compromisso Metodológico</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              <MathText
                text={
                  guide.sourceGroundingNotes ||
                  'Explicações rigorosamente ancoradas no material documental analisado, evitando alucinações e conceitos alheios.'
                }
              />
            </p>
            <div className="pt-2.5 border-t border-stone-200/80 text-[11px] text-stone-500 font-sans">
              Linguagem em norma culta brasileira · Sem estrangeirismos supérfluos.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
