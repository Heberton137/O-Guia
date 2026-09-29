import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, Loader2, ShieldCheck, CheckCircle2, Binary, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { StudyGuide } from '../types/guide';
import { MathText } from './MathText';

interface PdfReceiverProps {
  onGuideLoaded: (guide: StudyGuide) => void;
}

export const PdfReceiver: React.FC<PdfReceiverProps> = ({ onGuideLoaded }) => {
  const [activeMode, setActiveMode] = useState<'pdf' | 'texto'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage('Por favor, selecione um arquivo no formato PDF.');
      return;
    }

    if (selectedFile.size > 30 * 1024 * 1024) {
      setErrorMessage('O arquivo excede o limite de 30 MB. Forneça um documento de tamanho menor.');
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setErrorMessage('Falha ao ler o arquivo selecionado.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    const stages = [
      'Lendo e examinando o conteúdo do seu documento...',
      'Estruturando linguagem acessível para leigos...',
      'Formatando fórmulas científicas e equações em LaTeX visual...',
      'Construindo esquemas visuais e fluxos conceituais...',
      'Formulando exercícios de fixação e análises comentadas de cada alternativa...',
      'Finalizando o seu plano de estudos personalizado...',
    ];

    let stageIdx = 0;
    setStatusMessage(stages[0]);
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setStatusMessage(stages[stageIdx]);
    }, 2600);

    try {
      let bodyData: any = {};
      if (activeMode === 'pdf') {
        if (!fileBase64) {
          throw new Error('Nenhum arquivo PDF carregado.');
        }
        bodyData = {
          pdfBase64: fileBase64,
          fileName: file?.name || 'material.pdf',
        };
      } else {
        if (!textContent.trim()) {
          throw new Error('Insira o texto do material de estudos.');
        }
        bodyData = {
          textContent: textContent.trim(),
        };
      }

      const response = await fetch('/api/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Falha ao processar material de estudos.');
      }

      const guide: StudyGuide = {
        ...json.data,
        sourceFileName: file?.name,
        processedAt: new Date().toLocaleDateString('pt-BR'),
      };

      onGuideLoaded(guide);
    } catch (err: any) {
      console.error('Erro na análise pedagógica:', err);
      setErrorMessage(
        err.message ||
          'Ocorreu uma falha no processamento. Verifique se o material contém texto legível e tente novamente.'
      );
    } finally {
      clearInterval(interval);
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Apresentação Limpa e Atraente */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 uppercase tracking-wider bg-white px-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fidelidade Estrita ao Conteúdo do Estudante</span>
          <span className="text-stone-300">·</span>
          <span className="text-amber-700 font-bold">Fórmulas em LaTeX</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-950 font-serif leading-tight">
          Transforme qualquer material em um{' '}
          <span className="text-amber-800 underline decoration-amber-300 decoration-wavy decoration-1 underline-offset-4">
            plano de estudo visual
          </span>
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-sans">
          Envie sua apostila, artigo, capítulo ou lista de notas. O Guia processa integralmente o conteúdo e gera explicações compreensíveis para leigos, esquemas visuais, equações formatadas em LaTeX e exercícios com análise comentada de cada alternativa.
        </p>

        {/* Recursos em Destaque */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs">
          <span className="px-3 py-1 rounded-md bg-stone-100/90 text-stone-700 border border-stone-200/70 flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5 text-stone-600" />
            <span>Fórmulas Matemáticas & Físicas em LaTeX</span>
          </span>
          <span className="px-3 py-1 rounded-md bg-stone-100/90 text-stone-700 border border-stone-200/70 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span>Esquemas Gráficos & Fluxogramas</span>
          </span>
          <span className="px-3 py-1 rounded-md bg-stone-100/90 text-stone-700 border border-stone-200/70 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-stone-600" />
            <span>Gabarito e Distratores Analisados</span>
          </span>
        </div>
      </div>

      {/* Caixa de Entrada Principal */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-9 space-y-6">
        {/* Alternador Limpo: PDF ou Texto */}
        <div className="flex items-center justify-center p-1 bg-stone-100 rounded-lg max-w-xs mx-auto border border-stone-200/80">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setActiveMode('pdf')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'pdf'
                ? 'bg-white text-stone-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documento PDF</span>
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setActiveMode('texto')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'texto'
                ? 'bg-white text-stone-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Colar Texto</span>
          </button>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modo PDF */}
        {activeMode === 'pdf' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-stone-900 bg-stone-50 scale-[1.01]'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-stone-300 hover:border-stone-400 bg-stone-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isProcessing}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center space-y-3.5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs transition-transform ${
                    file ? 'bg-emerald-100 text-emerald-800 scale-105' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {file ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>

                {file ? (
                  <div className="space-y-1.5">
                    <p className="text-base sm:text-lg font-bold text-stone-950 font-sans">
                      {file.name}
                    </p>
                    <p className="text-xs text-stone-500 font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Arquivo PDF pronto para leitura pedagógica
                    </p>
                    <span className="text-xs text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded font-medium inline-block mt-1">
                      Arquivo selecionado com sucesso · Clique se desejar trocar
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-stone-900">
                      Arraste e solte seu arquivo PDF aqui
                    </p>
                    <p className="text-xs text-stone-500">
                      ou clique para selecionar do seu computador ou smartphone (até 30 MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-stone-500 bg-stone-50 p-3.5 rounded-lg border border-stone-200/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                <strong>Garantia de Fidelidade:</strong> O plano e as questões serão derivados exclusivamente do seu documento, sem inventar matérias alheias.
              </span>
            </div>
          </div>
        )}

        {/* Modo Texto */}
        {activeMode === 'texto' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
              Cole o texto do material de estudos:
            </label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Cole aqui o texto do capítulo, lei, artigo, apostila ou anotações de aula..."
              rows={8}
              disabled={isProcessing}
              className="w-full p-3.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans leading-relaxed"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>Total de caracteres: {textContent.length}</span>
              <span>Mínimo recomendado: 200 caracteres</span>
            </div>
          </div>
        )}

        {/* Demonstração Visual de Fórmulas em Formato de Livro Didático */}
        <div className="bg-[#faf9f6] rounded-xl p-4 sm:p-5 border border-stone-200/90 border-l-4 border-l-amber-600 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-amber-700" />
              <span>Padrão Tipográfico de Livros Didáticos (LaTeX)</span>
            </span>
            <span className="text-amber-800 text-[10px] bg-amber-100/70 px-2 py-0.5 rounded font-mono">
              Fórmula em Destaque
            </span>
          </div>

          <div className="py-1">
            <MathText text="$$E_c = \frac{1}{2} m \cdot v^2$$" />
          </div>

          <div className="text-xs text-stone-600 border-t border-stone-200/60 pt-2 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <strong className="text-stone-900 font-serif"><MathText text="$E_c$" /></strong>: Energia Cinética (<MathText text="$\text{J}$" />)
            </span>
            <span>
              <strong className="text-stone-900 font-serif"><MathText text="$m$" /></strong>: Massa inercial (<MathText text="$\text{kg}$" />)
            </span>
            <span>
              <strong className="text-stone-900 font-serif"><MathText text="$v$" /></strong>: Velocidade (<MathText text="$\text{m/s}$" />)
            </span>
          </div>
        </div>

        {/* Estado de Processamento Ativo */}
        {isProcessing && (
          <div className="p-5 bg-stone-900 text-white rounded-xl space-y-2.5 animate-pulse shadow-md">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Gerando Plano de Estudos com O Guia...</span>
            </div>
            <p className="text-xs text-stone-300 pl-6 leading-relaxed font-mono">
              {statusMessage}
            </p>
          </div>
        )}

        {/* Botão de Ação Primária */}
        <div className="pt-2">
          <button
            type="button"
            disabled={
              isProcessing ||
              (activeMode === 'pdf' && !fileBase64) ||
              (activeMode === 'texto' && !textContent.trim())
            }
            onClick={handleProcess}
            className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:cursor-not-allowed hover:shadow"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando Documento...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Criar Plano de Estudo a Partir Deste Material</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pilares Metodológicos Visuais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <strong className="text-stone-900 block font-semibold text-sm">Explicação Intuitiva</strong>
          <p className="leading-relaxed">Metáforas claras para que até um leigo compreenda os conceitos centrais, sem perder a precisão científica.</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <strong className="text-stone-900 block font-semibold text-sm">Esquemas Gráficos</strong>
          <p className="leading-relaxed">Diagramas lógicos, sequências de passos e tabelas comparativas das regras e teorias do documento.</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <CheckSquare className="w-4 h-4" />
          </div>
          <strong className="text-stone-900 block font-semibold text-sm">Análise Comentada</strong>
          <p className="leading-relaxed">Exercícios contextualizados com justificativa técnica do gabarito e análise minuciosa de cada alternativa errada.</p>
        </div>
      </div>
    </div>
  );
};
