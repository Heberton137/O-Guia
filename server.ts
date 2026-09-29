import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Configuração para processamento de requisições com dados em base64 (documentos PDF)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Inicialização do cliente oficial do Gemini com telemetria obrigatória
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Instrução do sistema rigorosa para garantir postura pedagógica, fidelidade científica e português esmerado
const PEDAGOGICAL_SYSTEM_INSTRUCTION = `Você é o motor pedagógico da plataforma "O Guia", um sistema profissional de apoio ao estudo voltado a estudantes de língua portuguesa (Brasil).

DIRETRIZES FUNDAMENTAIS OBRIGATÓRIAS:
1. RIGOR CONCEITUAL E FIDELIDADE ABSOLUTA AO MATERIAL FORNECIDO:
   - O plano de estudo, os títulos dos módulos, as explicações, os esquemas visuais e os exercícios DEVEM derivar EXCLUSIVAMENTE do conteúdo presente no documento (PDF ou texto) enviado pelo estudante.
   - Jamais invente temas, tópicos ou exemplos alheios ao material. Não misture disciplinas distintas. Se o documento tratar de um tema específico, TODO o conteúdo gerado deve corresponder fielmente a esse tema.
   - Mapeie as seções, capítulos e conceitos reais do documento nos módulos estruturados.

2. CLAREZA ACESSÍVEL PARA LEIGOS:
   - O leitor pode ser um iniciante absoluto na matéria. Explique os mecanismos com comparações práticas do cotidiano e analogias visuais vívidas que façam sentido estritamente dentro do contexto do material.
   - Estruture os conceitos do mais simples ao mais elaborado, sem infantilizar o leitor e sem perder a precisão técnica.

3. LINGUAGEM FORMAL, PRECISA E SEM ESTRANGEIRISMOS:
   - Escreva em português do Brasil com rigorosa observância às normas gramaticais e sintéticas.
   - NÃO utilize termos estrangeiros desnecessários (como "insights", "mindset", "framework", "brainstorm", "dashboard", etc.). Utilize termos em português: "compreensões fundamentais", "postura mental", "estrutura conceitual", "painel", "síntese", "objetivos".

4. POSTURA PROFISSIONAL E ANTIBALUBAÇÃO (SEM PUXA-SACO):
   - Evite absolutamente elogios artificiais ("Excelente escolha!", "Você vai ser um gênio!", "Parabéns por estudar!").
   - Mantenha tom neutro, sério, pedagógico, construtivo e focado no objeto do conhecimento.

5. EXERCÍCIOS DE FIXAÇÃO COM ANÁLISE COMENTADA COMPLETA:
   - Formule exercícios baseados diretamente nas lições e regras do documento fornecido.
   - Para cada exercício gerado, apresente uma Análise Comentada da Solução com:
     a) Por que o gabarito é verdadeiro, com fundamento direto no material.
     b) Por que CADA UMA das alternativas incorretas (distratores) é falsa, apontando com exatidão a falha de raciocínio.
     c) Síntese mnemônica para consolidar o aprendizado.

6. ESQUEMAS VISUAIS DIDÁTICOS:
   - Proponha esquemas conceituais (fluxos de causa-efeito, etapas, tabelas comparativas do tipo "O que é vs. O que não é") extraídos das relações lógicas do próprio documento.

7. FÓRMULAS E NOTAÇÃO CIENTÍFICA EM FORMATO DE LIVRO DIDÁTICO (LATEX PROFISSIONAL):
   - Apresente as fórmulas e equações principais em blocos destacados usando $$...$$, exatamente como nas páginas de livros didáticos universitários consagrados.
   - Imediatamente após a equação em bloco, liste cada variável com sua respectiva definição e unidade de medida (ex.: "Onde: $F$ é a força resultante em Newtons (N); $m$ é a massa inercial em quilogramas (kg)...").
   - Use notação vetorial rigorosa ($\vec{F}$, $\vec{a}$), subscritos ($v_0$, $E_c$), frações claras (\\frac{a}{b}), radicais (\\sqrt{...}), somatórios (\\sum) e operadores formais (\\cdot, \\Delta).
   - No corpo do texto, qualquer variável isolada ou cálculo rápido deve estar rigorosamente entre $...$ (ex.: $x$, $t$, $\Delta s$).
   - O aplicativo renderiza o LaTeX graficamente com tipografia acadêmica de livro.`;

const STUDY_GUIDE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Título conciso e formal do assunto estudado.',
    },
    discipline: {
      type: Type.STRING,
      description: 'Disciplina ou ramo do conhecimento (ex.: Direito Constitucional, Biologia Celular, Mecânica Clássica, História do Brasil).',
    },
    summaryForBeginners: {
      type: Type.STRING,
      description: 'Visão panorâmica em linguagem acessível para leigos, usando uma metáfora visual elucidativa do cotidiano.',
    },
    keyObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 a 5 metas concretas de aprendizagem que o estudante dominará ao final da leitura.',
    },
    visualSchema: {
      type: Type.OBJECT,
      properties: {
        schemaType: {
          type: Type.STRING,
          description: 'Tipo do esquema principal: "fluxograma", "ciclo", "pilares", "hierarquia" ou "tabela_comparativa".',
        },
        title: {
          type: Type.STRING,
          description: 'Título do esquema visual.',
        },
        description: {
          type: Type.STRING,
          description: 'Explicação de como ler e interpretar o esquema.',
        },
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              description: { type: Type.STRING },
              keyConcept: { type: Type.STRING },
              visualTag: { type: Type.STRING, description: 'Ex.: "Origem", "Processamento", "Efeito", "Consequência", "Regra Geral", "Exceção".' },
              connections: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Identificadores dos próximos nós relacionados no fluxo.',
              },
            },
            required: ['id', 'title', 'description', 'keyConcept'],
          },
        },
        comparisonTable: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            headers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: { type: Type.STRING },
                  itemA: { type: Type.STRING },
                  itemB: { type: Type.STRING },
                  practicalExample: { type: Type.STRING },
                },
                required: ['criterion', 'itemA', 'itemB'],
              },
            },
          },
        },
      },
      required: ['schemaType', 'title', 'description', 'nodes'],
    },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          overview: { type: Type.STRING },
          visualDiagram: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: 'Ex.: "passo_a_passo", "causa_efeito", "pilares".' },
              title: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    visualAnalogy: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'explanation'],
                },
              },
            },
            required: ['type', 'title', 'steps'],
          },
          detailedExplanation: { type: Type.STRING, description: 'Explicação detalhada, estruturada em parágrafos claros fundamentados no material.' },
          practicalExample: { type: Type.STRING, description: 'Exemplo prático concreto que elucida a aplicação real da regra ou teoria.' },
          frequentPitfall: { type: Type.STRING, description: 'Atenção ao detalhe: pegadinha habitual ou erro comum de interpretação que deve ser evitado.' },
          textualEvidence: { type: Type.STRING, description: 'Trecho representativo ou fundamento bibliográfico retirado do material de apoio.' },
        },
        required: ['id', 'title', 'overview', 'visualDiagram', 'detailedExplanation', 'practicalExample', 'frequentPitfall'],
      },
    },
    glossary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
          simpleAnalogy: { type: Type.STRING },
        },
        required: ['term', 'definition', 'simpleAnalogy'],
      },
    },
    practiceExercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, description: '"multipla_escolha", "verdadeiro_falso" ou "caso_pratico".' },
          difficulty: { type: Type.STRING, description: '"Iniciante", "Intermediário" ou "Aprofundado".' },
          statement: { type: Type.STRING, description: 'Enunciado do exercício contextualizado.' },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: '"A", "B", "C", "D" ou "E".' },
                text: { type: Type.STRING },
              },
              required: ['id', 'text'],
            },
          },
          correctOptionId: { type: Type.STRING, description: 'Identificador da alternativa correta.' },
          commentedAnalysis: {
            type: Type.OBJECT,
            properties: {
              correctReason: { type: Type.STRING, description: 'Explicação fundamentada do porquê o gabarito é o correto.' },
              distractorExplanations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    whyIncorrect: { type: Type.STRING, description: 'Por que esta opção específica está incorreta.' },
                  },
                  required: ['optionId', 'whyIncorrect'],
                },
              },
              keyTakeaway: { type: Type.STRING, description: 'Lição mnemônica de síntese.' },
              referenceInMaterial: { type: Type.STRING, description: 'Localização ou base teórica dentro da disciplina.' },
            },
            required: ['correctReason', 'distractorExplanations', 'keyTakeaway'],
          },
        },
        required: ['id', 'type', 'difficulty', 'statement', 'options', 'correctOptionId', 'commentedAnalysis'],
      },
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          front: { type: Type.STRING, description: 'Pergunta ou conceito para recordar.' },
          back: { type: Type.STRING, description: 'Resposta sintética e precisa.' },
          category: { type: Type.STRING },
        },
        required: ['id', 'front', 'back', 'category'],
      },
    },
    sourceGroundingNotes: {
      type: Type.STRING,
      description: 'Nota de fidelidade documental: especificação de quais tópicos do material foram cobertos com estrito rigor científico.',
    },
  },
  required: [
    'title',
    'discipline',
    'summaryForBeginners',
    'keyObjectives',
    'visualSchema',
    'modules',
    'glossary',
    'practiceExercises',
    'flashcards',
    'sourceGroundingNotes',
  ],
};

// Função resiliente de chamada com tolerância a picos temporários de demanda (fallback automático)
async function generateWithFallback(params: any) {
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      console.warn(`[O Guia] Modelo ${model} encontrou indisponibilidade temporária. Alternando...`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError;
}

// Rota de análise pedagógica de materiais (PDF ou texto)
app.post('/api/analyze-material', async (req: Request, res: Response) => {
  try {
    const { pdfBase64, textContent, fileName } = req.body;

    if (!pdfBase64 && (!textContent || textContent.trim().length === 0)) {
      return res.status(400).json({
        error: 'É necessário fornecer um arquivo PDF em formato codificado ou um texto didático para estudo.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave de acesso à API Gemini não configurada no ambiente.',
      });
    }

    const contents: any[] = [];

    if (pdfBase64) {
      // Remove cabeçalho de data URI se presente (ex.: "data:application/pdf;base64,")
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').trim();
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
      contents.push({
        text: `Você é o analisador do sistema "O Guia". Você recebeu o documento PDF anexo "${fileName || 'documento.pdf'}".
LEIA TODO O DOCUMENTO COM ATENÇÃO CRÍTICA.
Crie o Plano de Estudos estruturado, visual e pedagógico EXCLUSIVAMENTE a partir das informações, capítulos, teorias, dados e conceitos presentes neste documento.
- Título do Guia e Disciplina: Identifique com exatidão a disciplina e o assunto central do documento.
- Visão Panorâmica (Para Leigos): Crie uma síntese compreensível com uma analogia que elucide o que o documento ensina.
- Módulos Didáticos: Devem corresponder aos tópicos e seções reais abordados no documento, com explicação aprofundada baseada no texto.
- Esquemas Visuais e Comparações: Devem refletir as classificações, fluxos e regras explicados no próprio PDF.
- Exercícios de Fixação: Devem testar estritamente o conteúdo do material fornecido, com a Análise Comentada da Solução detalhando a razão do gabarito e a justificativa do erro de cada alternativa.
- Proibição absoluta de alucinações, extrapolações fora do tema do documento ou bajulações ("puxa-saco"). Rigor gramatical do português do Brasil sem estrangeirismos.`,
      });
    } else {
      contents.push({
        text: `Material de estudo fornecido pelo estudante:\n\n"""\n${textContent}\n"""\n\nAnalise detalhadamente o material acima e gere o Plano de Estudos pedagógico estruturado EXCLUSIVAMENTE a partir dos tópicos presentes neste texto. Inclua esquemas visuais, exercícios de fixação e análise comentada rigorosa de cada alternativa, seguindo linguagem acessível, gramática esmerada do português do Brasil e ausência total de bajulação.`,
      });
    }

    const response = await generateWithFallback({
      contents,
      config: {
        systemInstruction: PEDAGOGICAL_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: STUDY_GUIDE_SCHEMA,
        temperature: 0.2, // Baixa temperatura para maximizar fidelidade e evitar alucinações
      },
    });

    const rawText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Erro ao decodificar JSON gerado pelo modelo:', parseError, rawText);
      return res.status(500).json({
        error: 'Houve uma falha ao estruturar os dados pedagógicos do material. Tente novamente.',
        raw: rawText,
      });
    }

    // Garantir que todos os arrays essenciais existam
    if (!Array.isArray(parsedData.keyObjectives)) parsedData.keyObjectives = [];
    if (!Array.isArray(parsedData.modules)) parsedData.modules = [];
    if (!Array.isArray(parsedData.practiceExercises)) parsedData.practiceExercises = [];
    if (!Array.isArray(parsedData.flashcards)) parsedData.flashcards = [];
    if (!Array.isArray(parsedData.glossary)) parsedData.glossary = [];
    if (parsedData.visualSchema && !Array.isArray(parsedData.visualSchema.nodes)) {
      parsedData.visualSchema.nodes = [];
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Erro na rota /api/analyze-material:', error);
    return res.status(500).json({
      error: error.message || 'Ocorreu um erro ao processar o material com o modelo pedagógico.',
    });
  }
});

// Rota para resolução de dúvidas pontuais do estudante baseadas estritamente no guia
app.post('/api/ask-doubt', async (req: Request, res: Response) => {
  try {
    const { question, currentTheme, moduleContext } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Pergunta não informada.' });
    }

    const prompt = `Você é o tutor da plataforma "O Guia". Responda à dúvida do estudante sobre o tema "${currentTheme || 'Geral'}".
Contexto pedagógico do módulo em estudo:
"""
${moduleContext || 'Fundamentos gerais da disciplina'}
"""

Pergunta do estudante:
"${question}"

Diretrizes obrigatórias de resposta:
1. Responda em português do Brasil impecável, com sintaxe concisa e sem estrangeirismos.
2. Seja direto, didático e elucide com um exemplo visual ou prático para que até um leigo entenda com facilidade.
3. Não use puxa-saco ou bajulações ("Excelente pergunta!", "Muito bem!"). Vá direto ao esclarecimento.
4. Mantenha fidelidade estrita aos fundamentos científicos do tema. Não invente regras que contradigam o material.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: PEDAGOGICAL_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    return res.json({
      answer: response.text || 'Não foi possível gerar a resposta neste momento.',
    });
  } catch (error: any) {
    console.error('Erro na rota /api/ask-doubt:', error);
    return res.status(500).json({
      error: error.message || 'Erro ao processar a dúvida.',
    });
  }
});

// Rota de fontes KaTeX para garantir renderização perfeita sem falha de carregamento
app.use('/fonts', express.static(path.resolve(__dirname, 'node_modules/katex/dist/fonts')));
app.use('/fonts', express.static(path.resolve(__dirname, 'public/fonts')));

// Inicialização do servidor com Vite integrado
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[O Guia] Servidor pedagógico ativo na porta ${PORT}`);
  });
}

startServer();
