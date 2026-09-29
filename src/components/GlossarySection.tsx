import React, { useState } from 'react';
import { BookMarked, Search, Sparkles } from 'lucide-react';
import { GlossaryTerm } from '../types/guide';
import { MathText } from './MathText';

interface GlossarySectionProps {
  glossary: GlossaryTerm[];
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ glossary = [] }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const safeGlossary = glossary || [];
  const filteredGlossary = safeGlossary.filter(
    (item) =>
      item &&
      ((item.term || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (item.definition || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (item.simpleAnalogy || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <BookMarked className="w-3.5 h-3.5 text-amber-700" />
            <span>Terminologia e Notação Conceitual</span>
          </div>
          <h2 className="text-xl font-bold text-stone-950 font-serif">
            Glossário Conceitual Acessível
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Definições precisas com analogias do cotidiano e suporte a fórmulas em LaTeX.
          </p>
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar termo ou conceito..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400 shadow-2xs"
          />
        </div>
      </div>

      {filteredGlossary.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
          Nenhum termo encontrado para "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-3 hover:border-stone-300 transition-all"
            >
              <h3 className="text-base font-bold text-stone-950 font-serif border-b border-stone-100 pb-2.5">
                <MathText text={item.term} />
              </h3>
              <div className="text-sm text-stone-700 leading-relaxed font-sans">
                <MathText text={item.definition} />
              </div>
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/70 text-xs text-stone-800 space-y-1 shadow-2xs">
                <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wide block">
                  Analogia para Leigos
                </span>
                <p className="italic font-serif text-stone-800 leading-relaxed">
                  “<MathText text={item.simpleAnalogy} />”
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
