import React, { useMemo, useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { Copy, Check, Binary } from 'lucide-react';

interface MathTextProps {
  text: string;
  className?: string;
  allowCopy?: boolean;
}

interface Segment {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
}

// Normalizador de notação LaTeX para evitar falhas decorrentes de escape JSON
function normalizeLatex(math: string): string {
  if (!math) return '';
  let str = math.trim();
  // Se contiver barras duplas residuais em comandos comuns, normaliza
  str = str.replace(/\\\\([a-zA-Z]+)/g, '\\$1');
  return str;
}

// Caixa de Equação em Destaque no Padrão de Livro Didático Acadêmico
const DisplayEquationBox: React.FC<{ math: string; equationNumber?: number }> = ({
  math,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanMath = useMemo(() => normalizeLatex(math), [math]);

  // Renderização inicial rápida com KaTeX (renderToString)
  const initialHtml = useMemo(() => {
    try {
      return katex.renderToString(cleanMath, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
      });
    } catch (e) {
      return null;
    }
  }, [cleanMath]);

  // Se o MathJax 3 SVG estiver disponível na janela global, aplicar o motor vetorial SVG de livros didáticos
  useEffect(() => {
    const win = window as any;
    if (win.MathJax && win.MathJax.tex2svg && containerRef.current) {
      try {
        const svgNode = win.MathJax.tex2svg(cleanMath, { display: true });
        if (svgNode && containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(svgNode);
        }
      } catch (err) {
        // Mantém a renderização do KaTeX caso ocorra erro no MathJax
      }
    }
  }, [cleanMath]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanMath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 rounded-xl border border-stone-200/90 bg-[#faf9f6] border-l-4 border-l-amber-600 shadow-2xs overflow-hidden transition-all hover:border-stone-300 hover:shadow-xs">
      {/* Barra superior no formato de publicação científica */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1 text-[11px] font-sans text-stone-500 uppercase tracking-wider select-none border-b border-stone-200/50">
        <span className="flex items-center gap-1.5 font-semibold text-stone-700">
          <Binary className="w-3.5 h-3.5 text-amber-700" />
          <span>Fórmula Canônica</span>
        </span>

        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 px-1.5 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-md border border-stone-200 flex items-center gap-1 text-[10px] cursor-pointer shadow-2xs"
          title="Copiar fórmula em código LaTeX"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copiar LaTeX</span>
            </>
          )}
        </button>
      </div>

      {/* Área da Fórmula Renderizada (SVG vetorial de livro ou KaTeX) */}
      <div
        ref={containerRef}
        className="p-4 sm:p-5 overflow-x-auto text-center font-serif text-stone-950 flex items-center justify-center min-h-[50px]"
        dangerouslySetInnerHTML={initialHtml ? { __html: initialHtml } : undefined}
      >
        {!initialHtml && (
          <code className="text-xs font-mono text-stone-800 bg-stone-100 p-2 rounded">
            $${cleanMath}$$
          </code>
        )}
      </div>
    </div>
  );
};

// Renderização de Fórmulas no Meio do Texto (Inline Math)
const InlineEquation: React.FC<{ math: string }> = ({ math }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const cleanMath = useMemo(() => normalizeLatex(math), [math]);

  const initialHtml = useMemo(() => {
    try {
      return katex.renderToString(cleanMath, {
        displayMode: false,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
      });
    } catch (e) {
      return null;
    }
  }, [cleanMath]);

  useEffect(() => {
    const win = window as any;
    if (win.MathJax && win.MathJax.tex2svg && containerRef.current) {
      try {
        const svgNode = win.MathJax.tex2svg(cleanMath, { display: false });
        if (svgNode && containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(svgNode);
        }
      } catch (err) {
        // Mantém KaTeX caso ocorra erro
      }
    }
  }, [cleanMath]);

  if (!initialHtml) {
    return <span className="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">${cleanMath}$</span>;
  }

  return (
    <span
      ref={containerRef}
      className="inline-equation inline-block mx-0.5 px-0.5 py-0.2 text-stone-950 font-serif align-baseline"
      dangerouslySetInnerHTML={{ __html: initialHtml }}
    />
  );
};

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const renderedElements = useMemo(() => {
    if (text === null || text === undefined) return null;
    const strText = String(text);
    if (!strText) return null;

    const segments: Segment[] = [];
    let currentIdx = 0;
    const len = strText.length;

    while (currentIdx < len) {
      // 1. Procurar delimitadores de Display Math ($$...$$, \[...\], \begin{equation}...\end{equation})
      const nextDisplayDollar = strText.indexOf('$$', currentIdx);
      const nextDisplayBracket = strText.indexOf('\\[', currentIdx);
      const nextBeginEquation = strText.indexOf('\\begin{equation}', currentIdx);
      const nextBeginAlign = strText.indexOf('\\begin{align}', currentIdx);

      const displayCandidates = [
        { idx: nextDisplayDollar, start: '$$', end: '$$' },
        { idx: nextDisplayBracket, start: '\\[', end: '\\]' },
        { idx: nextBeginEquation, start: '\\begin{equation}', end: '\\end{equation}' },
        { idx: nextBeginAlign, start: '\\begin{align}', end: '\\end{align}' },
      ].filter((c) => c.idx !== -1);

      displayCandidates.sort((a, b) => a.idx - b.idx);
      const firstDisplay = displayCandidates[0];

      // 2. Procurar delimitadores de Inline Math ($...$, \(...\))
      let nextInlineDollar = strText.indexOf('$', currentIdx);
      if (nextInlineDollar !== -1 && nextDisplayDollar !== -1 && nextInlineDollar === nextDisplayDollar) {
        nextInlineDollar = -1;
      }
      const nextInlineParen = strText.indexOf('\\(', currentIdx);

      const inlineCandidates = [
        { idx: nextInlineDollar, start: '$', end: '$' },
        { idx: nextInlineParen, start: '\\(', end: '\\)' },
      ].filter((c) => c.idx !== -1);

      inlineCandidates.sort((a, b) => a.idx - b.idx);
      const firstInline = inlineCandidates[0];

      let target: { idx: number; start: string; end: string; isDisplay: boolean } | null = null;

      if (firstDisplay && (!firstInline || firstDisplay.idx < firstInline.idx)) {
        target = { ...firstDisplay, isDisplay: true };
      } else if (firstInline) {
        target = { ...firstInline, isDisplay: false };
      }

      if (!target) {
        segments.push({
          type: 'text',
          content: strText.slice(currentIdx),
        });
        break;
      }

      if (target.idx > currentIdx) {
        segments.push({
          type: 'text',
          content: strText.slice(currentIdx, target.idx),
        });
      }

      const contentStart = target.idx + target.start.length;
      const closingIdx = strText.indexOf(target.end, contentStart);

      if (closingIdx === -1) {
        segments.push({
          type: 'text',
          content: strText.slice(target.idx),
        });
        break;
      }

      const mathContent = strText.slice(contentStart, closingIdx);

      segments.push({
        type: target.isDisplay ? 'display-math' : 'inline-math',
        content: mathContent,
      });

      currentIdx = closingIdx + target.end.length;
    }

    return segments.map((seg, i) => {
      if (seg.type === 'display-math') {
        return <DisplayEquationBox key={i} math={seg.content} equationNumber={i + 1} />;
      }

      if (seg.type === 'inline-math') {
        return <InlineEquation key={i} math={seg.content} />;
      }

      const lines = seg.content.split('\n');
      return (
        <span key={i}>
          {lines.map((line, lineIdx) => {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <React.Fragment key={lineIdx}>
                {parts.map((p, pIdx) => {
                  if (p.startsWith('**') && p.endsWith('**')) {
                    return (
                      <strong key={pIdx} className="font-semibold text-stone-950">
                        {p.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <React.Fragment key={pIdx}>{p}</React.Fragment>;
                })}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  }, [text]);

  return <span className={className}>{renderedElements}</span>;
};
