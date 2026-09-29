import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Sparkles, AlertCircle, Loader2, ShieldCheck, CheckCircle2, Zap, ArrowRight, Play } from 'lucide-react';
import { StudyGuide } from '../types/guide';
import { SAMPLE_PHYSICS_GUIDE, SAMPLE_CALCULUS_GUIDE } from '../data/sampleGuides';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuideLoaded: (guide: StudyGuide) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onGuideLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'texto'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage('Por favor, selecione um arquivo em formato PDF.');
      return;
    }

    if (selectedFile.size > 30 * 1024 * 1024) {
      setErrorMessage('O arquivo excede o limite de 30 MB. Forneça um arquivo menor ou um extrato do material.');
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
      'Lendo e examinando o conteúdo documental...',
      'Estruturando linguagem acessível para leigos...',
      'Formatando fórmulas científicas e equações em LaTeX visual...',
      'Construindo esquemas visuais e fluxos conceituais...',
      'Formulando exercícios de fixação e análises comentadas de cada alternativa...',
      'Consolidando o plano de estudos sob normas da língua portuguesa...',
    ];

    let stageIdx = 0;
    setStatusMessage(stages[0]);
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setStatusMessage(stages[stageIdx]);
    }, 2800);

    try {
      let bodyData: any = {};
      if (activeTab === 'pdf') {
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
      onClose();
    } catch (err: any) {
      console.error('Erro na análise pedagógica:', err);
      setErrorMessage(
        err.message || 'Ocorreu uma falha no processamento. Verifique se o material contém texto legível e tente novamente.'
      );
    } finally {
      clearInterval(interval);
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-950 font-serif">
                Carregar Novo Material
              </h2>
              <p className="text-xs text-stone-500">
                O plano de estudos será gerado exclusivamente a partir deste novo documento.
              </p>
            </div>
          </div>
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Entrada */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-6 pt-2">
          <button
            disabled={isProcessing}
            onClick={() => setActiveTab('pdf')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Arquivo PDF</span>
          </button>
          <button
            disabled={isProcessing}
            onClick={() => setActiveTab('texto')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'texto'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Colar Texto ou Notas</span>
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-stone-900 bg-stone-50'
                    : file
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                    {file ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : <FileText className="w-6 h-6" />}
                  </div>

                  {file ? (
                    <div>
                      <p className="text-sm font-bold text-stone-900">{file.name}</p>
                      <p className="text-xs text-stone-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB · Arquivo PDF pronto para leitura
                      </p>
                      <span className="text-xs text-emerald-700 font-medium mt-1 inline-block">
                        Clique para trocar de arquivo se desejar
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Arraste e solte seu arquivo PDF aqui
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        ou clique para selecionar do seu dispositivo
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>O plano de estudo será gerado com rigor conceitual baseado exclusivamente no material enviado.</span>
              </div>
            </div>
          )}

          {activeTab === 'texto' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Conteúdo textual da disciplina (artigo, aula, notas de estudo):
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Cole aqui o texto ou extrato do material que deseja estudar..."
                rows={8}
                className="w-full p-3.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans leading-relaxed"
              />
              <div className="flex justify-between text-xs text-stone-400">
                <span>Total de caracteres: {textContent.length}</span>
                <span>Mínimo recomendado: 200 caracteres</span>
              </div>
            </div>
          )}

          {/* Opções Rápidas de Teste / Demonstração */}
          <div className="pt-2 border-t border-stone-200/70 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Ou teste agora com um material pré-processado:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onGuideLoaded(SAMPLE_PHYSICS_GUIDE);
                  onClose();
                }}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">Física & Mecânica</div>
                  <div className="text-[10px] text-stone-500">Trabalho, Energia e Conservação</div>
                </div>
                <Play className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onGuideLoaded(SAMPLE_CALCULUS_GUIDE);
                  onClose();
                }}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">Cálculo Diferencial</div>
                  <div className="text-[10px] text-stone-500">Limites, Taxas e Derivadas</div>
                </div>
                <Play className="w-3.5 h-3.5 text-stone-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Estado de Processamento Ativo */}
          {isProcessing && (
            <div className="p-4 bg-stone-900 text-white rounded-xl space-y-2 animate-pulse">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Processando Material com O Guia...</span>
              </div>
              <p className="text-xs text-stone-300 pl-6 leading-relaxed font-mono">
                {statusMessage}
              </p>
            </div>
          )}
        </div>

        {/* Rodapé / Ações */}
        <div className="p-4 sm:p-6 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-md transition-colors"
          >
            Cancelar
          </button>

          <button
            disabled={
              isProcessing ||
              (activeTab === 'pdf' && !fileBase64) ||
              (activeTab === 'texto' && !textContent.trim())
            }
            onClick={handleProcess}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 rounded-md transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Gerando Explicação...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gerar Plano de Estudos</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
