import React from 'react';
import { BookOpen, HelpCircle, Printer, Upload } from 'lucide-react';
import { StudyGuide } from '../types/guide';

interface HeaderProps {
  currentGuide: StudyGuide | null;
  activeTab: 'visao' | 'exercicios' | 'flashcards' | 'glossario';
  setActiveTab: (tab: 'visao' | 'exercicios' | 'flashcards' | 'glossario') => void;
  onOpenUpload: () => void;
  onOpenDoubt: () => void;
  onOpenExport: () => void;
  answeredCount: number;
  totalExercises: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentGuide,
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenDoubt,
  onOpenExport,
  answeredCount,
  totalExercises,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Marca e Identidade */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-stone-950 font-serif">
                  O Guia
                </span>
                {currentGuide && (
                  <>
                    <span className="text-stone-300">|</span>
                    <span className="text-xs font-semibold tracking-wide text-stone-600 uppercase">
                      {currentGuide.discipline}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-stone-500 hidden sm:block truncate max-w-md">
                {currentGuide ? currentGuide.title : 'Plataforma Pedagógica de Estudos'}
              </p>
            </div>
          </div>

          {/* Abas de Navegação Pedagógica (Somente se houver guia ativo) */}
          {currentGuide && (
            <nav className="hidden md:flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200/80">
              <button
                onClick={() => setActiveTab('visao')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'visao'
                    ? 'bg-white text-stone-950 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                1. Explicação & Esquemas
              </button>
              <button
                onClick={() => setActiveTab('exercicios')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'exercicios'
                    ? 'bg-white text-stone-950 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <span>2. Exercícios Comentados</span>
                {totalExercises > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-800 rounded font-mono">
                    {answeredCount}/{totalExercises}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-white text-stone-950 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                3. Fixação Ativa
              </button>
              <button
                onClick={() => setActiveTab('glossario')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'glossario'
                    ? 'bg-white text-stone-950 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                4. Glossário
              </button>
            </nav>
          )}

          {/* Ações Rápidas */}
          <div className="flex items-center space-x-2">
            {currentGuide && (
              <>
                <button
                  onClick={onOpenDoubt}
                  title="Tirar dúvida conceitual sobre o material"
                  className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5 border border-stone-200"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden lg:inline">Tirar Dúvida</span>
                </button>

                <button
                  onClick={onOpenExport}
                  title="Imprimir ou exportar caderno de estudos"
                  className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors border border-transparent hover:border-stone-200"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{currentGuide ? 'Trocar PDF' : 'Inserir PDF'}</span>
            </button>
          </div>
        </div>

        {/* Abas móveis (mobile) */}
        {currentGuide && (
          <div className="flex md:hidden items-center justify-between py-2 border-t border-stone-100 overflow-x-auto space-x-1">
            <button
              onClick={() => setActiveTab('visao')}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
                activeTab === 'visao' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
              }`}
            >
              Explicação
            </button>
            <button
              onClick={() => setActiveTab('exercicios')}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
                activeTab === 'exercicios' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
              }`}
            >
              Exercícios ({answeredCount}/{totalExercises})
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
                activeTab === 'flashcards' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
              }`}
            >
              Fixação
            </button>
            <button
              onClick={() => setActiveTab('glossario')}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
                activeTab === 'glossario' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
              }`}
            >
              Glossário
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
