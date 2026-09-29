import React, { useState } from 'react';
import { ArrowRight, Layers, Table as TableIcon, Info, Sparkles } from 'lucide-react';
import { VisualSchema, VisualNode } from '../types/guide';
import { MathText } from './MathText';

interface VisualSchemaViewProps {
  schema: VisualSchema;
}

export const VisualSchemaView: React.FC<VisualSchemaViewProps> = ({ schema }) => {
  const [selectedNode, setSelectedNode] = useState<VisualNode | null>(
    schema?.nodes && schema.nodes.length > 0 ? schema.nodes[0] : null
  );

  const getTagColor = (tag?: string) => {
    switch (tag?.toLowerCase()) {
      case 'origem':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'processamento':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'regra geral':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'exceção':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'efeito':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-stone-700 bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 md:p-8 shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Esquema Visual Didático · {schema.schemaType.toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-bold text-stone-950 font-serif">
            <MathText text={schema.title} />
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            <MathText text={schema.description} />
          </p>
        </div>
        <div className="text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/70 self-start md:self-auto font-sans">
          Dica: Clique nos blocos abaixo para inspecionar cada elemento
        </div>
      </div>

      {/* Nós do Esquema Visual (Fluxograma / Ciclo / Pilares) */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(schema.nodes || []).map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`relative text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-md ring-2 ring-stone-900/10'
                    : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 hover:border-stone-300 text-stone-800'
                }`}
              >
                {/* Indicador de ordem */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-stone-800 text-stone-300'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  {node.visualTag && (
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        isSelected
                          ? 'border-stone-700 bg-stone-800 text-stone-200'
                          : getTagColor(node.visualTag)
                      }`}
                    >
                      {node.visualTag}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                  <MathText text={node.title} />
                </h3>
                {node.subtitle && (
                  <p
                    className={`text-xs mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    <MathText text={node.subtitle} />
                  </p>
                )}

                <div
                  className={`mt-3 pt-2 border-t text-xs line-clamp-2 ${
                    isSelected
                      ? 'border-stone-800 text-stone-300'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <MathText text={node.keyConcept} />
                </div>

                {index < schema.nodes.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                    <span className="w-5 h-5 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-400 shadow-2xs">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detalhe do Bloco Selecionado */}
        {selectedNode && (
          <div className="p-5 sm:p-6 rounded-xl bg-stone-50 border border-stone-200/90 space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
              <Info className="w-4 h-4 text-amber-700" />
              <span>
                Conceito Detalhado: <MathText text={selectedNode.title} />
              </span>
            </div>
            <div className="text-sm text-stone-800 leading-relaxed font-sans">
              <MathText text={selectedNode.description} />
            </div>
            <div className="pt-2 text-xs text-stone-600 flex items-start gap-1.5 border-t border-stone-200/60">
              <span className="font-bold text-stone-900 flex-shrink-0">Princípio-chave:</span>
              <span className="font-medium text-stone-950">
                <MathText text={selectedNode.keyConcept} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabela Comparativa (se disponível) */}
      {schema.comparisonTable && (
        <div className="pt-6 border-t border-stone-100 space-y-3">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-stone-700" />
            <h3 className="text-base font-bold text-stone-950 font-serif">
              <MathText text={schema.comparisonTable.title} />
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-2xs">
            <table className="min-w-full divide-y divide-stone-200 text-left text-xs sm:text-sm">
              <thead className="bg-stone-100/90 text-stone-800 font-semibold">
                <tr>
                  {(schema.comparisonTable.headers || []).map((head, i) => (
                    <th key={i} className="px-4 py-3 border-r border-stone-200 last:border-r-0">
                      <MathText text={head} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {(schema.comparisonTable.rows || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-stone-900 bg-stone-50/50 border-r border-stone-200 whitespace-nowrap">
                      <MathText text={row.criterion} />
                    </td>
                    <td className="px-4 py-3 text-stone-700 border-r border-stone-200">
                      <MathText text={row.itemA} />
                    </td>
                    <td className="px-4 py-3 text-stone-700 border-r border-stone-200">
                      <MathText text={row.itemB} />
                    </td>
                    {row.practicalExample && (
                      <td className="px-4 py-3 text-stone-600 italic">
                        <MathText text={row.practicalExample} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
