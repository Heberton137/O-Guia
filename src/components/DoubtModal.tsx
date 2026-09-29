import React, { useState } from 'react';
import { X, HelpCircle, Send, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { StudyGuide } from '../types/guide';
import { MathText } from './MathText';

interface DoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: StudyGuide;
  initialTopic?: { title: string; overview: string } | null;
}

export const DoubtModal: React.FC<DoubtModalProps> = ({
  isOpen,
  onClose,
  guide,
  initialTopic,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userText = question.trim();
    setQuestion('');
    setErrorMsg(null);
    setConversation((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          currentTheme: guide.title,
          moduleContext: initialTopic
            ? `Tópico focal: ${initialTopic.title}. Resumo: ${initialTopic.overview}`
            : `Guia Geral: ${guide.title}. Visão: ${guide.summaryForBeginners}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao consultar o assistente pedagógico.');
      }

      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer },
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha na comunicação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-950 font-serif">
                Esclarecimento Pontual de Dúvidas
              </h3>
              <p className="text-xs text-stone-500 truncate max-w-sm">
                {initialTopic ? `Tópico: ${initialTopic.title}` : `Tema: ${guide.title}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Histórico da Conversa */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-stone-50/50">
          {conversation.length === 0 ? (
            <div className="text-center py-8 px-4 text-stone-500 space-y-2">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs sm:text-sm font-medium text-stone-700">
                Tem alguma dúvida sobre este conceito?
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Pergunte livremente. A resposta será concisa, didática, sem bajulação, embasada no material e com fórmulas em LaTeX.
              </p>
            </div>
          ) : (
            conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-stone-900 text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs font-sans'
                  }`}
                >
                  <MathText text={msg.text} />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.role === 'user' ? 'Sua pergunta' : 'O Guia (Tutor Científico)'}
                </span>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-xl border border-stone-200 w-fit shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
              <span>Consultando fundamentos teóricos do material...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Campo de Entrada da Pergunta */}
        <form onSubmit={handleSend} className="p-4 border-t border-stone-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua dúvida conceitual aqui (fórmulas são aceitas)..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="p-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 transition-colors shadow-xs cursor-pointer"
            title="Enviar pergunta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
