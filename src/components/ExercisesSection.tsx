import React, { useState } from 'react';
import { CheckCircle2, XCircle, BookOpen, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { PracticeExercise } from '../types/guide';
import { MathText } from './MathText';

interface ExercisesSectionProps {
  exercises: PracticeExercise[];
  userAnswers: Record<string, string>;
  revealedAnswers: Record<string, boolean>;
  onSelectAnswer: (exerciseId: string, optionId: string) => void;
  onRevealAnswer: (exerciseId: string) => void;
  onResetExercises: () => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({
  exercises = [],
  userAnswers,
  revealedAnswers,
  onSelectAnswer,
  onRevealAnswer,
  onResetExercises,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('todos');

  const safeExercises = exercises || [];

  const filteredExercises = safeExercises.filter((ex) => {
    if (!ex) return false;
    if (filterDifficulty === 'todos') return true;
    return (ex.difficulty || '').toLowerCase() === filterDifficulty.toLowerCase();
  });

  // Cálculo de pontuação
  const totalCount = safeExercises.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = safeExercises.filter(
    (ex) => ex && userAnswers[ex.id] === ex.correctOptionId
  ).length;

  return (
    <div className="space-y-6">
      {/* Barra de Progresso e Métricas de Fixação */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Avaliação Formativa e Fixação Conceitual</span>
          </div>
          <h2 className="text-xl font-bold text-stone-950 font-serif">
            Exercícios de Fixação com Análise Comentada
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Cada questão traz a justificativa do gabarito, a refutação de cada alternativa errada e fórmulas renderizadas em LaTeX.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-auto">
          {/* Métricas sem pílulas estáticas (Zero-Pill discipline) */}
          <div className="flex items-center gap-3 text-xs text-stone-600 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs">
            <div>
              Respondidas:{' '}
              <span className="font-bold text-stone-900 font-mono">
                {answeredCount}/{totalCount}
              </span>
            </div>
            <span className="text-stone-300">|</span>
            <div>
              Acertos:{' '}
              <span className="font-bold text-emerald-700 font-mono">
                {correctCount}
              </span>
            </div>
          </div>

          {answeredCount > 0 && (
            <button
              onClick={onResetExercises}
              title="Reiniciar exercícios"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtro por Nível de Dificuldade (Controle Segmentado Interativo) */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl max-w-fit border border-stone-200/70">
        {['todos', 'iniciante', 'intermediário', 'aprofundado'].map((level) => (
          <button
            key={level}
            onClick={() => setFilterDifficulty(level)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
              filterDifficulty === level
                ? 'bg-white text-stone-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            {level === 'todos' ? 'Todos os Níveis' : level}
          </button>
        ))}
      </div>

      {/* Lista de Exercícios */}
      <div className="space-y-6">
        {filteredExercises.map((exercise, index) => {
          const selectedOption = userAnswers[exercise.id];
          const isRevealed = revealedAnswers[exercise.id] || false;
          const isCorrect = selectedOption === exercise.correctOptionId;

          return (
            <div
              key={exercise.id}
              className={`bg-white rounded-2xl border transition-all p-6 md:p-8 shadow-xs ${
                isRevealed
                  ? isCorrect
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-rose-300 ring-2 ring-rose-500/10'
                  : 'border-stone-200/90 hover:border-stone-300'
              }`}
            >
              {/* Cabeçalho da Questão */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                  <span className="font-bold text-stone-800">Questão {index + 1}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="capitalize">{exercise.difficulty}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="capitalize">{exercise.type.replace('_', ' ')}</span>
                </div>

                {isRevealed && (
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resposta Correta</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Resposta Incorreta</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Enunciado com MathText */}
              <div className="text-base sm:text-lg font-serif text-stone-900 leading-relaxed mb-5">
                <MathText text={exercise.statement} />
              </div>

              {/* Alternativas */}
              <div className="space-y-2.5 mb-5">
                {(exercise.options || []).map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isThisCorrect = option.id === exercise.correctOptionId;

                  let optionStyle =
                    'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-800';

                  if (isRevealed) {
                    if (isThisCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyle =
                        'border-rose-400 bg-rose-50/80 text-rose-950';
                    } else {
                      optionStyle = 'border-stone-200 bg-white opacity-60 text-stone-600';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-stone-900 bg-stone-900 text-white shadow-xs';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={isRevealed}
                      onClick={() => onSelectAnswer(exercise.id, option.id)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 shadow-2xs ${
                          isRevealed
                            ? isThisCorrect
                              ? 'bg-emerald-700 text-white'
                              : isSelected
                              ? 'bg-rose-600 text-white'
                              : 'bg-stone-200 text-stone-700'
                            : isSelected
                            ? 'bg-stone-100 text-stone-900'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {option.id}
                      </span>
                      <span className="leading-relaxed flex-1">
                        <MathText text={option.text} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ação de Conferência */}
              {!isRevealed ? (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-stone-500">
                    {selectedOption
                      ? `Opção selecionada: (${selectedOption}). Clique para conferir a análise da solução.`
                      : 'Selecione uma alternativa acima para responder.'}
                  </span>
                  <button
                    disabled={!selectedOption}
                    onClick={() => onRevealAnswer(exercise.id)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    Conferir Resposta
                  </button>
                </div>
              ) : (
                /* Análise Comentada da Solução */
                <div className="mt-6 pt-6 border-t border-stone-200/90 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>Análise Comentada da Solução</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-700 font-mono">
                      Gabarito Oficial: Alternativa ({exercise.correctOptionId})
                    </span>
                  </div>

                  {/* Fundamentação do Gabarito Correto */}
                  <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200/80 space-y-2 shadow-2xs">
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Por que a alternativa ({exercise.correctOptionId}) é a correta:
                    </h4>
                    <div className="text-sm text-stone-800 leading-relaxed font-sans">
                      <MathText text={exercise.commentedAnalysis.correctReason} />
                    </div>
                  </div>

                  {/* Análise de Cada Distrator Incorreto */}
                  {exercise.commentedAnalysis?.distractorExplanations && exercise.commentedAnalysis.distractorExplanations.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                        Refutação das alternativas incorretas (distratores):
                      </h4>
                      <div className="space-y-2">
                        {(exercise.commentedAnalysis.distractorExplanations || []).map(
                          (dist) => (
                            <div
                              key={dist.optionId}
                              className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80 text-xs sm:text-sm text-stone-700 space-y-1 shadow-2xs"
                            >
                              <div className="font-semibold text-stone-900 flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-stone-200 text-stone-700 text-[11px] font-mono font-bold flex items-center justify-center">
                                  {dist.optionId}
                                </span>
                                <span>Alternativa ({dist.optionId}):</span>
                              </div>
                              <div className="text-stone-600 pl-7 leading-relaxed">
                                <MathText text={dist.whyIncorrect} />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lição de Fixação Mnemônica */}
                  <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 flex items-start gap-3 text-xs sm:text-sm text-stone-800 shadow-2xs">
                    <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">
                        Síntese para fixação:{' '}
                      </span>
                      <span>
                        <MathText text={exercise.commentedAnalysis.keyTakeaway} />
                      </span>
                    </div>
                  </div>

                  {/* Base documental */}
                  {exercise.commentedAnalysis.referenceInMaterial && (
                    <div className="text-[11px] text-stone-500 italic pl-1">
                      Base teórica: <MathText text={exercise.commentedAnalysis.referenceInMaterial} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
