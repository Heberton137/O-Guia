import React, { useState } from 'react';
import { RotateCw, ArrowLeft, ArrowRight, Brain, Check, RefreshCw } from 'lucide-react';
import { Flashcard } from '../types/guide';
import { MathText } from './MathText';

interface FlashcardsSectionProps {
  flashcards: Flashcard[];
}

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [learnedCards, setLearnedCards] = useState<Record<string, boolean>>({});

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
        Nenhum cartão de memorização disponível para este guia.
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isLearned = learnedCards[currentCard.id] || false;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleLearned = (val: boolean) => {
    setLearnedCards((prev) => ({
      ...prev,
      [currentCard.id]: val,
    }));
    handleNext();
  };

  const learnedCount = Object.values(learnedCards).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Cabeçalho da Seção */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <Brain className="w-3.5 h-3.5 text-amber-700" />
            <span>Recuperação Ativa & Fixação Mnemônica</span>
          </div>
          <h2 className="text-xl font-bold text-stone-950 font-serif">
            Cartões de Fixação Ativa
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Tente responder mentalmente antes de virar o cartão. Fórmulas são renderizadas em LaTeX.
          </p>
        </div>

        {/* Métricas sem pílula */}
        <div className="text-xs text-stone-600 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3">
          <span>
            Cartão{' '}
            <strong className="text-stone-900 font-mono">
              {currentIndex + 1} de {flashcards.length}
            </strong>
          </span>
          <span className="text-stone-300">|</span>
          <span>
            Dominados:{' '}
            <strong className="text-emerald-700 font-mono">
              {learnedCount}
            </strong>
          </span>
        </div>
      </div>

      {/* Cartão de Estudo Virável */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[300px] sm:min-h-[340px] bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-xs flex flex-col justify-between cursor-pointer hover:border-stone-300 hover:shadow-md transition-all select-none relative group"
      >
        <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
          <span className="uppercase tracking-wider font-semibold text-stone-600">
            {currentCard.category || 'Conceito Fundamental'}
          </span>
          <span className="flex items-center gap-1.5 text-stone-500 group-hover:text-stone-800 transition-colors">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Clique para {isFlipped ? 'ver pergunta' : 'virar e ver resposta'}</span>
          </span>
        </div>

        <div className="my-auto py-6 text-center">
          <div className="text-xs font-bold uppercase tracking-wider mb-3 text-stone-400 font-mono">
            {isFlipped ? 'Resposta Pedagógica' : 'Conceito para Recordar'}
          </div>

          <div
            className={`transition-all leading-relaxed ${
              isFlipped
                ? 'text-lg sm:text-xl font-sans text-stone-900 font-medium'
                : 'text-xl sm:text-2xl font-serif text-stone-950 font-bold'
            }`}
          >
            <MathText text={isFlipped ? currentCard.back : currentCard.front} />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 pt-4">
          <span>{isLearned ? '✓ Marcado como dominado' : 'Ainda em treino'}</span>
          <span className="text-stone-400 italic">O Guia · Fixação Ativa</span>
        </div>
      </div>

      {/* Controles de Navegação e Autoavaliação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>
          <button
            onClick={handleNext}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Próximo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isFlipped && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLearned(false)}
              className="px-4 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              Preciso Revisar Mais
            </button>
            <button
              onClick={() => toggleLearned(true)}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Compreendi Bem</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
