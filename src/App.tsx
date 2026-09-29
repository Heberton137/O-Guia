import React, { useState } from 'react';
import { StudyGuide } from './types/guide';
import { Header } from './components/Header';
import { PdfReceiver } from './components/PdfReceiver';
import { OverviewSection } from './components/OverviewSection';
import { VisualSchemaView } from './components/VisualSchemaView';
import { ModuleCard } from './components/ModuleCard';
import { ExercisesSection } from './components/ExercisesSection';
import { FlashcardsSection } from './components/FlashcardsSection';
import { GlossarySection } from './components/GlossarySection';
import { UploadModal } from './components/UploadModal';
import { DoubtModal } from './components/DoubtModal';
import { PrintSummaryModal } from './components/PrintSummaryModal';
import { ArrowRight, FileText, RefreshCw, Upload } from 'lucide-react';
import { sanitizeStudyGuide } from './utils/guideSanitizer';

export default function App() {
  // Inicialização limpa: sem pré-lista de assuntos.
  // Caso o estudante já tenha processado um PDF nesta sessão, o guia é recuperado localmente e sanitizado.
  const [currentGuide, setCurrentGuide] = useState<StudyGuide | null>(() => {
    try {
      const saved = localStorage.getItem('o_guia_active_guide');
      if (saved) {
        return sanitizeStudyGuide(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Falha ao restaurar guia salvo:', e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'visao' | 'exercicios' | 'flashcards' | 'glossario'>('visao');

  // Controle de resolução dos exercícios
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Modais
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isDoubtOpen, setIsDoubtOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [activeTopicDoubt, setActiveTopicDoubt] = useState<{ title: string; overview: string } | null>(null);

  const handleSelectAnswer = (exerciseId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseId]: optionId,
    }));
  };

  const handleRevealAnswer = (exerciseId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [exerciseId]: true,
    }));
  };

  const handleResetExercises = () => {
    setUserAnswers({});
    setRevealedAnswers({});
  };

  const handleGuideLoaded = (newGuide: StudyGuide) => {
    const sanitized = sanitizeStudyGuide(newGuide);
    setCurrentGuide(sanitized);
    try {
      localStorage.setItem('o_guia_active_guide', JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Não foi possível persistir no armazenamento local:', e);
    }
    setUserAnswers({});
    setRevealedAnswers({});
    setActiveTab('visao');
  };

  const handleClearCurrentGuide = () => {
    try {
      localStorage.removeItem('o_guia_active_guide');
    } catch (e) {}
    setCurrentGuide(null);
    setUserAnswers({});
    setRevealedAnswers({});
    setActiveTab('visao');
  };

  const handleAskTopicDoubt = (title: string, overview: string) => {
    setActiveTopicDoubt({ title, overview });
    setIsDoubtOpen(true);
  };

  const totalExercises = currentGuide?.practiceExercises?.length || 0;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Cabeçalho Fixo */}
      <Header
        currentGuide={currentGuide}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenDoubt={() => {
          setActiveTopicDoubt(null);
          setIsDoubtOpen(true);
        }}
        onOpenExport={() => setIsExportOpen(true)}
        answeredCount={answeredCount}
        totalExercises={totalExercises}
      />

      {/* Se houver guia ativo, exibe barra de contexto e botão de troca de material */}
      {currentGuide && (
        <div className="bg-stone-100/90 border-b border-stone-200/80 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-stone-800">Plano Gerado:</span>
              <span className="text-stone-500 truncate max-w-sm sm:max-w-md">
                {currentGuide.sourceFileName ? `Arquivo ${currentGuide.sourceFileName}` : currentGuide.title}
              </span>
            </div>

            <button
              onClick={handleClearCurrentGuide}
              className="text-stone-700 hover:text-stone-950 font-medium underline flex items-center gap-1.5 flex-shrink-0 ml-4 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Inserir Outro Documento</span>
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentGuide ? (
          /* Estado Inicial Limpo: Foco Total na Entrada do PDF */
          <PdfReceiver onGuideLoaded={handleGuideLoaded} />
        ) : (
          /* Estado Ativo: Plano de Estudos Criado a Partir do PDF */
          <div>
            {activeTab === 'visao' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Visão Panorâmica e Metas extraídas do documento */}
                <OverviewSection guide={currentGuide} />

                {/* Esquema Visual Principal do Documento */}
                {currentGuide.visualSchema && (
                  <VisualSchemaView schema={currentGuide.visualSchema} />
                )}

                {/* Decomposição dos Módulos Didáticos Reais do Documento */}
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-stone-950 font-serif">
                        Módulos e Tópicos do Seu Material
                      </h3>
                      <p className="text-xs text-stone-500">
                        Estruturação lógica das seções do documento com analogias para leigos e pontos de atenção.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-stone-500">
                      {(currentGuide.modules || []).length} tópicos estruturados
                    </span>
                  </div>

                  <div className="space-y-6">
                    {(currentGuide.modules || []).map((module, idx) => (
                      <ModuleCard
                        key={module.id || idx}
                        module={module}
                        index={idx}
                        onAskTopicDoubt={handleAskTopicDoubt}
                      />
                    ))}
                  </div>
                </div>

                {/* Chamada para Exercícios de Fixação */}
                {(currentGuide.practiceExercises || []).length > 0 && (
                  <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        Fixação Ativa do Conteúdo
                      </span>
                      <h3 className="text-xl font-bold font-serif">
                        Pronto para testar a fixação deste material?
                      </h3>
                      <p className="text-xs text-stone-300 max-w-xl">
                        Resolva as questões extraídas do seu documento com análise comentada detalhada da solução e justificativa de cada alternativa.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('exercicios');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
                    >
                      <span>Ir para os Exercícios ({(currentGuide.practiceExercises || []).length})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'exercicios' && (
              <div className="animate-fadeIn">
                <ExercisesSection
                  exercises={currentGuide.practiceExercises || []}
                  userAnswers={userAnswers}
                  revealedAnswers={revealedAnswers}
                  onSelectAnswer={handleSelectAnswer}
                  onRevealAnswer={handleRevealAnswer}
                  onResetExercises={handleResetExercises}
                />
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div className="animate-fadeIn">
                <FlashcardsSection flashcards={currentGuide.flashcards || []} />
              </div>
            )}

            {activeTab === 'glossario' && (
              <div className="animate-fadeIn">
                <GlossarySection glossary={currentGuide.glossary || []} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rodapé Pedagógico */}
      <footer className="border-t border-stone-200 bg-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-serif">O Guia</span>
            <span>·</span>
            <span>Plataforma Pedagógica de Estudos</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Fidelidade Estrita ao Material</span>
            <span>·</span>
            <span>Sem Bajulações</span>
            <span>·</span>
            <span>Análise Comentada de Soluções</span>
          </div>
        </div>
      </footer>

      {/* Modais do Sistema */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onGuideLoaded={handleGuideLoaded}
      />

      {currentGuide && (
        <>
          <DoubtModal
            isOpen={isDoubtOpen}
            onClose={() => setIsDoubtOpen(false)}
            guide={currentGuide}
            initialTopic={activeTopicDoubt}
          />

          <PrintSummaryModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            guide={currentGuide}
          />
        </>
      )}
    </div>
  );
}
