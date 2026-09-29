import { StudyGuide } from '../types/guide';

export const SAMPLE_PHYSICS_GUIDE: StudyGuide = {
  title: 'Mecânica Clássica: Trabalho, Energia Cinética e Leis de Conservação',
  discipline: 'Física Universitária & Ensino Médio',
  summaryForBeginners:
    'Neste guia, você entenderá por que a energia nunca se perde, apenas muda de forma. Veremos como uma força aplicada ao longo de uma distância transfere capacidade de movimento (trabalho) e como montanhas-russas, satélites e veículos convertem energia de posição em velocidade.',
  keyObjectives: [
    'Dominar o Teorema do Trabalho e da Energia Cinética: $$W_{\\text{total}} = \\Delta E_c$$',
    'Diferenciar formalmente Forças Conservativas (gravitacional, elástica) de Não-Conservativas (atrito cinético, resistência do ar).',
    'Equacionar a Conservação da Energia Mecânica em sistemas isolados: $$E_{m,i} = E_{m,f}$$',
    'Calcular a energia dissipada por atrito e interpretar o balanço energético completo.',
  ],
  visualSchema: {
    schemaType: 'fluxograma',
    title: 'Ciclo de Conversão e Conservação da Energia Mecânica',
    description:
      'Mapa causal ilustrando como o trabalho de forças externas e internas converte energia de configuração (potencial) em energia cinética de movimento.',
    nodes: [
      {
        id: 'node-1',
        title: 'Trabalho da Força Resultante ($W_{\\text{res}}$)',
        subtitle: 'Agente Propulsor',
        description: 'Força aplicada ao longo do deslocamento: $$W = \\int_{r_i}^{r_f} \\vec{F} \\cdot d\\vec{r}$$',
        keyConcept: 'Mede a transferência de energia entre o agente e a partícula.',
        visualTag: 'Origem',
      },
      {
        id: 'node-2',
        title: 'Energia Cinética ($E_c$)',
        subtitle: 'Energia de Movimento',
        description: 'Capacidade de realizar trabalho associada à velocidade: $$E_c = \\frac{1}{2}m v^2$$',
        keyConcept: 'Escalar estritamente positivo ou nulo, proporcional ao quadrado da velocidade.',
        visualTag: 'Processamento',
      },
      {
        id: 'node-3',
        title: 'Energia Potencial ($U$)',
        subtitle: 'Energia de Posição / Configuração',
        description: 'Gravitacional ($$U_g = mgh$$) ou Elástica ($$U_e = \\frac{1}{2}kx^2$$).',
        keyConcept: 'Trabalho associado depende apenas dos pontos inicial e final.',
        visualTag: 'Regra Geral',
      },
      {
        id: 'node-4',
        title: 'Balanço & Dissipação Térmica ($Q$)',
        subtitle: 'Princípio Geral da Termodinâmica',
        description: 'Quando atua atrito: $$W_{\\text{fat}} = \\Delta E_m < 0$$. A energia converte-se em agitação molecular.',
        keyConcept: 'A energia mecânica decresce, mas a energia total do universo se conserva.',
        visualTag: 'Efeito',
      },
    ],
    comparisonTable: {
      title: 'Quadro Comparativo: Forças Conservativas vs. Não-Conservativas',
      headers: ['Critério de Avaliação', 'Forças Conservativas (Gravidade / Mola)', 'Forças Não-Conservativas (Atrito / Arrasto)'],
      rows: [
        {
          criterion: 'Dependência da Trajetória',
          itemA: 'O trabalho depende unicamente das posições inicial e final; nulo em circuito fechado: $$\\oint \\vec{F} \\cdot d\\vec{r} = 0$$',
          itemB: 'O trabalho depende da distância percorrida pelo percurso: $$|W_{\\text{fat}}| = f_{\\text{atrito}} \\cdot d$$',
          practicalExample: 'Subir uma montanha por trilha íngreme ou curva exige o mesmo trabalho gravitacional.',
        },
        {
          criterion: 'Energia Potencial Associada',
          itemA: 'Existe função potencial explícita $$U(\\vec{r})$$ tal que $$\\vec{F} = -\\vec{\\nabla} U$$.',
          itemB: 'Não é possível definir uma função de energia potencial.',
          practicalExample: 'Não existe "energia potencial de atrito", apenas energia térmica irreversível.',
        },
        {
          criterion: 'Conservação da Energia Mecânica',
          itemA: '$$E_m = E_c + U = \\text{constante}$$ ao longo de todo o intervalo.',
          itemB: 'A energia mecânica decresce: $$E_{m,f} = E_{m,i} - |W_{\\text{dissipado}}|$$',
          practicalExample: 'Frear o carro transforma energia cinética diretamente em aquecimento dos discos de freio.',
        },
      ],
    },
  },
  modules: [
    {
      id: 'mod-1',
      title: 'Módulo 1: O Teorema do Trabalho e da Energia Cinética (TEC)',
      overview:
        'A integral de linha da força resultante sobre uma partícula equivale com rigor à variação de sua energia cinética.',
      visualDiagram: {
        type: 'passo_a_passo',
        title: 'Dedução do Teorema do Trabalho em 3 Etapas',
        steps: [
          {
            stepNumber: 1,
            title: '2ª Lei de Newton na Trajetória',
            explanation: 'Substitui-se a força resultante pela aceleração: $$F_{\\text{res}} = m \\frac{dv}{dt}$$.',
            visualAnalogy: 'Empurrar um carrinho de compras acelera sua massa gradativamente.',
          },
          {
            stepNumber: 2,
            title: 'Regra da Cadeia de Leibniz',
            explanation: 'Multiplica-se pelo elemento de deslocamento $$dx = v \\, dt$$, obtendo $$F \\, dx = m v \\, dv$$.',
            visualAnalogy: 'A taxa com que a velocidade cresce depende de quanto espaço foi percorrido.',
          },
          {
            stepNumber: 3,
            title: 'Integração Definida',
            explanation: 'Integrando entre os instantes inicial e final: $$\\int_{x_i}^{x_f} F \\, dx = \\int_{v_i}^{v_f} m v \\, dv = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$.',
            visualAnalogy: 'O acúmulo de todos os pequenos empurrões resulta na velocidade final do corpo.',
          },
        ],
      },
      detailedExplanation:
        'O Teorema do Trabalho e Energia Cinética é um dos pilares mais elegantes da Física. Ele afirma que o trabalho escalar realizado por todas as forças (sejam elas conservativas ou dissipativas) resulta exatamente na alteração da energia cinética do móvel:\n\n$$W_{\\text{total}} = \\Delta E_c = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$\n\nOnde:\n- $W_{\\text{total}}$ é o trabalho em Joules ($\\text{J}$)\n- $m$ é a massa inercial em quilogramas ($\\text{kg}$)\n- $v$ é o módulo da velocidade em metros por segundo ($\\text{m/s}$)',
      practicalExample:
        'Em um teste de frenagem, um veículo de $1.200\\text{ kg}$ a $20\\text{ m/s}$ ($72\\text{ km/h}$) possui energia cinética $$E_c = \\frac{1}{2} \\cdot 1200 \\cdot (20)^2 = 240.000\\text{ J} = 240\\text{ kJ}$$. Os freios devem realizar exatos $-240\\text{ kJ}$ de trabalho para imobilizá-lo.',
      frequentPitfall:
        'Atenção: A força centrípeta em movimento circular uniforme NUNCA realiza trabalho ($W = 0$), pois a força aponta para o centro e é perpendicular à velocidade instantânea ($\\cos 90^\\circ = 0$). O vetor velocidade muda de direção, mas a energia cinética permanece constante.',
      textualEvidence:
        'Halliday, Resnick & Walker, Fundamentos de Física: "O trabalho é energia transferida de ou para um objeto por meio de uma força que atua sobre ele."',
    },
    {
      id: 'mod-2',
      title: 'Módulo 2: Energia Potencial e Conservação em Campos Gravitacionais',
      overview:
        'Quando atuam apenas forças conservativas, a soma das energias cinética e potencial permanece rigorosamente constante.',
      visualDiagram: {
        type: 'causa_efeito',
        title: 'Balanço da Montanha-Russa sem Atrito',
        steps: [
          {
            stepNumber: 1,
            title: 'Ponto Mais Alto (Cume)',
            explanation: 'Velocidade baixa, altitude máxima: $$E_m = mgh_{\\max}$$. A energia está 100% armazenada no campo gravitacional.',
            visualAnalogy: 'Uma mola completamente comprimida aguardando liberação.',
          },
          {
            stepNumber: 2,
            title: 'Meio da Descida',
            explanation: 'Conversão contínua: metade da altura foi perdida, tornando-se energia cinética: $$E_m = \\frac{1}{2}m v^2 + mgh$$.',
            visualAnalogy: 'Uma ampulheta onde os grãos caem sem qualquer vazamento externo.',
          },
          {
            stepNumber: 3,
            title: 'Ponto Mais Baixo (Vale)',
            explanation: 'Altitude nula ($h = 0$): velocidade atinge o máximo: $$v_{\\max} = \\sqrt{2gh}$$.',
            visualAnalogy: 'Toda a reserva potencial foi convertida em velocidade máxima.',
          },
        ],
      },
      detailedExplanation:
        'A energia potencial gravitacional próxima à superfície terrestre decorre da atração da massa do planeta:\n\n$$U_g = m \\cdot g \\cdot h$$\n\nEm um sistema mecânico conservativo isolado:\n\n$$E_m = E_c + U_g = \\text{constante}$$\n\n$$\\frac{1}{2}m v_1^2 + m g h_1 = \\frac{1}{2}m v_2^2 + m g h_2$$',
      practicalExample:
        'Um esquiador parte do repouso ($v_1 = 0$) de uma colina com altura $h = 20\\text{ m}$. Desprezando o atrito da neve e considerando $g = 9{,}8\\text{ m/s}^2$:\n\n$$v_2 = \\sqrt{2gh} = \\sqrt{2 \\cdot 9{,}8 \\cdot 20} = \\sqrt{392} \\approx 19{,}8\\text{ m/s} \\approx 71{,}3\\text{ km/h}$$',
      frequentPitfall:
        'Cuidado ao escolher a referência do nível zero ($h = 0$). O valor absoluto de $U_g$ depende de onde você posiciona a origem, porém a variação $\\Delta U_g$ é universal e invariante.',
      textualEvidence:
        'Tipler & Mosca, Física para Cientistas e Engenheiros: "A variação de energia potencial é o negativo do trabalho realizado pela força conservativa: $\\Delta U = -W_c$."',
    },
    {
      id: 'mod-3',
      title: 'Módulo 3: Força Elástica e Movimento Harmônico',
      overview:
        'A lei de Hooke descreve forças restauradoras proporcionais à deformação, gerando energia potencial elástica quadrática.',
      visualDiagram: {
        type: 'pilares',
        title: 'Propriedades do Oscilador Harmônico Simples (Massa-Mola)',
        steps: [
          {
            stepNumber: 1,
            title: 'Lei de Hooke',
            explanation: 'A força restauradora aponta sempre no sentido oposto ao deslocamento: $$\\vec{F}_e = -k \\vec{x}$$.',
          },
          {
            stepNumber: 2,
            title: 'Integral da Energia Elástica',
            explanation: 'O trabalho acumulado na mola é quadrático: $$U_e = \\int_0^x kx \\, dx = \\frac{1}{2}k x^2$$.',
          },
          {
            stepNumber: 3,
            title: 'Frequência Angular Natural',
            explanation: 'A oscilação do sistema depende da rigidez e da inércia: $$\\omega = \\sqrt{\\frac{k}{m}}$$.',
          },
        ],
      },
      detailedExplanation:
        'Diferente da força gravitacional (que é constante perto do solo), a força elástica varia continuamente com a compressão ou distensão $x$. Por isso, a média da força durante a deformação é $\\frac{kx}{2}$, resultando em:\n\n$$U_e = \\frac{1}{2} k x^2$$\n\nOnde:\n- $k$ é a constante elástica da mola em Newtons por metro ($\\text{N/m}$)\n- $x$ é a deformação linear a partir da posição de equilíbrio em metros ($\\text{m}$)',
      practicalExample:
        'O sistema de amortecedores de uma locomotiva utiliza molas com $k = 50.000\\text{ N/m}$. Uma compressão de apenas $20\\text{ cm}$ ($0{,}2\\text{ m}$) acumula:\n\n$$U_e = \\frac{1}{2} \\cdot 50.000 \\cdot (0{,}2)^2 = 25.000 \\cdot 0{,}04 = 1.000\\text{ J} = 1\\text{ kJ}$$',
      frequentPitfall:
        'Não confunda a força instantânea com a energia acumulada: a força é máxima no extremo ($F = kx$), mas a energia não é $F \\cdot x$, e sim $\\frac{1}{2}kx^2$ devido à natureza linear crescente da força.',
      textualEvidence:
        'Feynman Lectures on Physics, Vol. 1: "The potential energy of an oscillator is parabolic with respect to the displacement."',
    },
  ],
  glossary: [
    {
      term: 'Trabalho Mecânico ($W$)',
      definition:
        'Quantidade escalar que quantifica a transferência de energia executada por uma força que atua ao longo de um deslocamento. No Sistema Internacional, a unidade é o Joule ($\\text{J} = \\text{N} \\cdot \\text{m}$).',
      simpleAnalogy: 'É como o extrato bancário da energia: mostra quanto dinheiro energético foi transferido de uma conta para outra.',
    },
    {
      term: 'Energia Cinética ($E_c$)',
      definition:
        'Energia que uma partícula com massa inercial $m$ possui em virtude de sua velocidade escalar $v$: $$E_c = \\frac{1}{2}mv^2$$.',
      simpleAnalogy: 'É o "impacto" acumulado pelo movimento. Dobrar a velocidade de um carro quadruplica a energia do impacto.',
    },
    {
      term: 'Força Conservativa',
      definition:
        'Força cujo trabalho total realizado sobre uma partícula é nulo ao longo de qualquer percurso fechado: $$\\oint \\vec{F} \\cdot d\\vec{r} = 0$$. Admite a formulação de uma função energia potencial.',
      simpleAnalogy: 'É como subir e descer um lance de escadas sem perder moedas: a altitude ganha na subida é exatamente devolvida na descida.',
    },
    {
      term: 'Dissipação Térmica',
      definition:
        'Conversão irreversível de energia mecânica organizada em energia interna microscópica desorganizada (calor) decorrente de forças de atrito ou arraste viscoso.',
      simpleAnalogy: 'Esfregar as mãos no inverno: a energia do movimento das suas mãos vira calor nos seus dedos.',
    },
    {
      term: 'Constante Elástica ($k$)',
      definition:
        'Medida de rigidez mecânica de um corpo deformável elástico na Lei de Hooke ($\\vec{F} = -k\\vec{x}$), expressa em $\\text{N/m}$.',
      simpleAnalogy: 'O quão dura é a mola. Uma mola de caneta tem $k$ baixo; a mola da suspensão de um caminhão tem $k$ altíssimo.',
    },
  ],
  practiceExercises: [
    {
      id: 'ex-1',
      type: 'multipla_escolha',
      difficulty: 'Iniciante',
      statement:
        'Um projétil de massa $m = 20\\text{ g}$ ($0{,}02\\text{ kg}$) é disparado com velocidade de $400\\text{ m/s}$. Qual é o valor de sua energia cinética e o trabalho total que as forças de atrito do alvo precisam exercer para detê-lo completamente?',
      options: [
        { id: 'A', text: '$E_c = 1.600\\text{ J}$; Trabalho do alvo: $W = -1.600\\text{ J}$' },
        { id: 'B', text: '$E_c = 3.200\\text{ J}$; Trabalho do alvo: $W = +3.200\\text{ J}$' },
        { id: 'C', text: '$E_c = 160\\text{ J}$; Trabalho do alvo: $W = -160\\text{ J}$' },
        { id: 'D', text: '$E_c = 800\\text{ J}$; Trabalho do alvo: $W = -800\\text{ J}$' },
      ],
      correctOptionId: 'A',
      commentedAnalysis: {
        correctReason:
          'Aplicando a fórmula da energia cinética com as grandezas convertidas ao Sistema Internacional ($m = 0{,}02\\text{ kg}$ e $v = 400\\text{ m/s}$):\n\n$$E_c = \\frac{1}{2}m v^2 = \\frac{1}{2} \\cdot 0{,}02 \\cdot (400)^2 = 0{,}01 \\cdot 160.000 = 1.600\\text{ J}$$\n\nPelo Teorema do Trabalho e Energia Cinética, $W_{\\text{res}} = E_{c,f} - E_{c,i} = 0 - 1.600 = -1.600\\text{ J}$. O sinal negativo indica que a força de resistência do alvo se opõe ao deslocamento.',
        distractorExplanations: [
          { optionId: 'B', whyIncorrect: 'Esqueceu o fator $\\frac{1}{2}$ na fórmula da energia cinética e utilizou sinal positivo para o trabalho resistente.' },
          { optionId: 'C', whyIncorrect: 'Errou na conversão de gramas para quilogramas, dividindo por 10.000 em vez de 1.000.' },
          { optionId: 'D', whyIncorrect: 'Dividiu a velocidade por 2 antes de elevá-la ao quadrado.' },
        ],
        keyTakeaway: 'Sempre converta massas para $\\text{kg}$ e lembre-se: trabalho que retira energia cinética tem sinal negativo.',
        referenceInMaterial: 'Módulo 1: Teorema do Trabalho e Energia Cinética.',
      },
    },
    {
      id: 'ex-2',
      type: 'multipla_escolha',
      difficulty: 'Intermediário',
      statement:
        'Um bloco de $2\\text{ kg}$ desliza sem atrito a partir do repouso do alto de uma rampa curva com altura $h = 5\\text{ m}$. Na base da rampa, o bloco colide com uma mola horizontal de constante elástica $k = 400\\text{ N/m}$. Adotando $g = 10\\text{ m/s}^2$, qual é a compressão máxima sofrida pela mola?',
      options: [
        { id: 'A', text: '$x = 0{,}25\\text{ m}$' },
        { id: 'B', text: '$x = 0{,}71\\text{ m}$ (ou $\\frac{\\sqrt{2}}{2}\\text{ m}$)' },
        { id: 'C', text: '$x = 0{,}50\\text{ m}$' },
        { id: 'D', text: '$x = 1{,}00\\text{ m}$' },
      ],
      correctOptionId: 'B',
      commentedAnalysis: {
        correctReason:
          'Como o sistema é conservativo e não há atrito, toda a energia potencial gravitacional inicial no topo da rampa transforma-se em energia potencial elástica na compressão máxima (onde a velocidade momentânea é zero):\n\n$$E_{m,i} = E_{m,f}$$\n\n$$mgh = \\frac{1}{2}kx^2$$\n\nSubstituindo os valores conhecidos:\n\n$$2 \\cdot 10 \\cdot 5 = \\frac{1}{2} \\cdot 400 \\cdot x^2$$\n\n$$100 = 200 \\cdot x^2 \\implies x^2 = \\frac{100}{200} = 0{,}5$$\n\n$$x = \\sqrt{0{,}5} = \\frac{\\sqrt{2}}{2} \\approx 0{,}707\\text{ m} \\approx 0{,}71\\text{ m}$$',
        distractorExplanations: [
          { optionId: 'A', whyIncorrect: 'Inverteu a fração ou esqueceu de extrair a raiz quadrada de $x^2$.' },
          { optionId: 'C', whyIncorrect: 'Esqueceu o fator $\\frac{1}{2}$ na energia potencial elástica, calculando $100 = 400 x^2 \\implies x = 0{,}5\\text{ m}$.' },
          { optionId: 'D', whyIncorrect: 'Igualou a força do peso diretamente à força elástica sem considerar o balanço integral de energia.' },
        ],
        keyTakeaway: 'Em compressão máxima ou altura máxima, a velocidade é nula, permitindo igualar as formas potenciais de energia diretamente.',
        referenceInMaterial: 'Módulo 2 e Módulo 3: Conservação da Energia Mecânica Global.',
      },
    },
    {
      id: 'ex-3',
      type: 'multipla_escolha',
      difficulty: 'Aprofundado',
      statement:
        'Um carrinho de montanha-russa de massa $m$ parte do repouso de uma altura $H$ e entra em um loop circular vertical de raio $R$. Desprezando todos os atritos, qual é a altura mínima $H_{\\min}$ necessária para que o carrinho consiga completar o loop sem perder o contato com os trilhos no ponto mais alto?',
      options: [
        { id: 'A', text: '$$H_{\\min} = 2R$$' },
        { id: 'B', text: '$$H_{\\min} = 2{,}5R = \\frac{5}{2}R$$' },
        { id: 'C', text: '$$H_{\\min} = 3R$$' },
        { id: 'D', text: '$$H_{\\min} = \\sqrt{5}R$$' },
      ],
      correctOptionId: 'B',
      commentedAnalysis: {
        correctReason:
          '1. Condição dinâmica no ponto mais alto do loop (altura $2R$):\nPara não perder contato, a força normal $N$ exercida pelo trilho deve ser maior ou igual a zero ($N \\ge 0$). No limite crítico ($N = 0$), apenas a gravidade atua como força centrípeta:\n\n$$F_{\\text{cp}} = mg = m \\frac{v_{\\text{topo}}^2}{R} \\implies v_{\\text{topo}}^2 = gR$$\n\n2. Conservação da energia mecânica entre a partida (altura $H$) e o topo do loop (altura $2R$):\n\n$$mgH = mg(2R) + \\frac{1}{2}m v_{\\text{topo}}^2$$\n\nDividindo por $m$ e substituindo $v_{\\text{topo}}^2 = gR$:\n\n$$gH = 2gR + \\frac{1}{2}gR = \\frac{5}{2}gR$$\n\n$$H_{\\min} = 2{,}5R = \\frac{5}{2}R$$',
        distractorExplanations: [
          { optionId: 'A', whyIncorrect: 'Se $H = 2R$, o carrinho chega ao topo com velocidade zero, o que faria com que ele despencasse verticalmente antes de atingir o topo.' },
          { optionId: 'C', whyIncorrect: 'Estimativa excessiva que não deduz a condição de força normal nula.' },
          { optionId: 'D', whyIncorrect: 'Misturou dimensões de raiz quadrada com a relação linear de altura.' },
        ],
        keyTakeaway: 'Para completar um loop vertical, o corpo precisa de energia potencial e também de energia cinética residual suficiente para a aceleração centrípeta no zênite.',
        referenceInMaterial: 'Módulo 2: Conservação de Energia em Trajetórias Curvilíneas.',
      },
    },
  ],
  flashcards: [
    {
      id: 'fc-1',
      front: 'O que afirma o Teorema do Trabalho e Energia Cinética (TEC)?',
      back: 'O trabalho realizado pela força resultante sobre uma partícula equivale à variação de sua energia cinética: $$W_{\\text{total}} = \\Delta E_c = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2$$',
      category: 'Teoremas Fundamentais',
    },
    {
      id: 'fc-2',
      front: 'Qual é a condição necessária e suficiente para uma força ser classificada como "Conservativa"?',
      back: 'O trabalho realizado por ela entre dois pontos independe da trajetória percorrida (ou, equivalentemente, a integral ao longo de qualquer percurso fechado é nula: $$\\oint \\vec{F} \\cdot d\\vec{r} = 0$$).',
      category: 'Propriedades de Forças',
    },
    {
      id: 'fc-3',
      front: 'Como se calcula a energia potencial elástica acumulada em uma mola deformada em $x$?',
      back: 'Pela integração da Lei de Hooke: $$U_e = \\frac{1}{2} k x^2$$. É quadrática em relação à deformação.',
      category: 'Energia Potencial',
    },
    {
      id: 'fc-4',
      front: 'A força centrípeta de uma órbita circular realiza trabalho?',
      back: 'NÃO! O vetor força centrípeta aponta para o centro e é perpendicular à velocidade instantânea ($\\cos 90^\\circ = 0$). Logo, $W = 0$ e a energia cinética permanece constante.',
      category: 'Casos Especiais',
    },
  ],
  sourceGroundingNotes:
    'Guia canônico compilado com base nos manuais de referência internacional: Halliday & Resnick (Fundamentos de Física), Sears & Zemansky e Tipler & Mosca.',
  sourceFileName: 'mecanica_classica_teorema_trabalho_energia.pdf',
  processedAt: new Date().toLocaleDateString('pt-BR'),
};

export const SAMPLE_CALCULUS_GUIDE: StudyGuide = {
  title: 'Cálculo Diferencial: Taxas de Variação, Limites e Derivadas',
  discipline: 'Matemática Superior & Engenharia',
  summaryForBeginners:
    'Descubra como medir o ritmo de mudança de qualquer fenômeno da natureza ou da economia. A derivada nos permite calcular velocidades instantâneas, taxas de juros contínuas e encontrar o ponto ótimo de máximo lucro ou mínimo custo.',
  keyObjectives: [
    'Compreender a definição formal de derivada via limite: $$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$',
    'Dominar as regras operatórias fundamentais: Regra do Produto, do Quociente e Regra da Cadeia: $$\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)$$',
    'Aplicar o teste da primeira e da segunda derivada para encontrar máximos e mínimos locais.',
  ],
  visualSchema: {
    schemaType: 'fluxograma',
    title: 'Da Reta Secante à Reta Tangente Instantânea',
    description:
      'Passo a passo geométrico demonstrando como a aproximação infinitesimal transforma uma velocidade média em velocidade instantânea.',
    nodes: [
      {
        id: 'node-c1',
        title: 'Reta Secante entre Dois Pontos',
        subtitle: 'Taxa de Variação Média',
        description: 'Inclinação dada por $$\\frac{\\Delta y}{\\Delta x} = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}$$.',
        keyConcept: 'Média global ao longo de um intervalo finito.',
        visualTag: 'Origem',
      },
      {
        id: 'node-c2',
        title: 'Passagem ao Limite Infinitesimal',
        subtitle: 'Aproximação de Leibniz & Newton',
        description: 'Faz-se o intervalo de tempo tender a zero: $$h \\to 0$$.',
        keyConcept: 'Elimina a indeterminação $$\\frac{0}{0}$$ por fatoração algébrica.',
        visualTag: 'Processamento',
      },
      {
        id: 'node-c3',
        title: 'Inclinação da Reta Tangente ($f\'(x)$)',
        subtitle: 'Derivada Instantânea',
        description: 'Equação da reta tangente: $$y - y_0 = f\'(x_0)(x - x_0)$$.',
        keyConcept: 'Taxa de variação no exato milissegundo presente.',
        visualTag: 'Regra Geral',
      },
      {
        id: 'node-c4',
        title: 'Otimização e Pontos Críticos',
        subtitle: 'Aplicações Práticas',
        description: 'Onde a taxa de variação se anula: $$f\'(x) = 0$$.',
        keyConcept: 'Indica pontos de máximo, mínimo ou inflexão horizontal.',
        visualTag: 'Efeito',
      },
    ],
    comparisonTable: {
      title: 'Quadro de Regras de Derivação Mais Usadas',
      headers: ['Regra Operatória', 'Fórmula Diferencial', 'Aplicação Típica'],
      rows: [
        {
          criterion: 'Regra da Potência',
          itemA: '$$\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$$',
          itemB: 'Aplica-se a qualquer expoente real (inteiro, fracionário ou negativo).',
          practicalExample: 'Se $$f(x) = \\sqrt{x} = x^{1/2}$$, então $$f\'(x) = \\frac{1}{2\\sqrt{x}}$$.',
        },
        {
          criterion: 'Regra da Cadeia',
          itemA: '$$\\frac{d}{dx}[f(u)] = f\'(u) \\cdot \\frac{du}{dx}$$',
          itemB: 'Diferenciação de funções compostas.',
          practicalExample: 'Se $$f(x) = (3x^2 + 1)^5$$, então $$f\'(x) = 5(3x^2 + 1)^4 \\cdot (6x)$$.',
        },
        {
          criterion: 'Exponencial Natural',
          itemA: '$$\\frac{d}{dx}[e^{kx}] = k \\cdot e^{kx}$$',
          itemB: 'Crescimento populacional, radioatividade e juros compostos.',
          practicalExample: 'A derivada de $$e^x$$ é a própria função $$e^x$$.',
        },
      ],
    },
  },
  modules: [
    {
      id: 'mod-c1',
      title: 'Módulo 1: O Conceito Geométrico e Físico de Derivada',
      overview: 'A derivada traduz a inclinação da reta tangente em um gráfico e a velocidade instantânea em um movimento.',
      visualDiagram: {
        type: 'passo_a_passo',
        title: 'Calculando a derivada de $f(x) = x^2$ pelo Limite',
        steps: [
          {
            stepNumber: 1,
            title: 'Expressão da Razão Incremental',
            explanation: '$$\\frac{f(x+h) - f(x)}{h} = \\frac{(x+h)^2 - x^2}{h}$$',
          },
          {
            stepNumber: 2,
            title: 'Desenvolvimento do Binômio',
            explanation: '$$\\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h}$$',
          },
          {
            stepNumber: 3,
            title: 'Cancelamento e Limite',
            explanation: '$$2x + h \\xrightarrow{h \\to 0} 2x$$. Conclusão: $$\\frac{d}{dx}[x^2] = 2x$$.',
          },
        ],
      },
      detailedExplanation:
        'A derivada formaliza a intuição de "velocidade instantânea". Quando dirigimos um veículo, o velocímetro não mostra a média das últimas duas horas, mas a derivada da posição em relação ao tempo:\n\n$$v(t) = \\lim_{\\Delta t \\to 0} \\frac{s(t + \\Delta t) - s(t)}{\\Delta t} = \\frac{ds}{dt}$$\n\nNo gráfico cartesiano, o valor numérico de $f\'(a)$ representa exatamente a inclinação (coeficiente angular $m = \\tan \\theta$) da reta tangente à curva no ponto $(a, f(a))$.',
      practicalExample:
        'Uma empresa calcula que seu custo de produção de $q$ unidades é $$C(q) = 1000 + 50q + 0{,}2q^2$$. O custo marginal para produzir a 101ª unidade é dado por $$C\'(q) = 50 + 0{,}4q$$. Para $q = 100$, temos $$C\'(100) = 50 + 40 = R\\$ 90$$.',
      frequentPitfall:
        'Não cometa o erro de calcular $f\'(x)$ substituindo primeiro o ponto $x_0$ antes de derivar! A derivada de uma constante é zero. Se você substituir o número primeiro, obterá uma constante cuja derivada parecerá falsamente zero.',
      textualEvidence:
        'James Stewart, Cálculo, Vol. 1: "A derivada de uma função em um número a representa a taxa de variação instantânea de y em relação a x quando x = a."',
    },
  ],
  glossary: [
    {
      term: 'Derivada Instantânea ($f\'(x)$)',
      definition:
        'Limite da razão incremental quando o passo tende a zero: $$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$.',
      simpleAnalogy: 'O velocímetro digital do seu carro medindo a velocidade no milésimo de segundo atual.',
    },
    {
      term: 'Ponto Crítico',
      definition:
        'Um número $c$ no domínio de $f$ tal que $f\'(c) = 0$ ou $f\'(c)$ não existe. É o candidato primário a ponto de máximo ou mínimo relativo.',
      simpleAnalogy: 'O topo exato de uma colina ou o fundo de um vale, onde o chão fica perfeitamente plano.',
    },
  ],
  practiceExercises: [
    {
      id: 'ex-calc-1',
      type: 'multipla_escolha',
      difficulty: 'Intermediário',
      statement:
        'Dada a função posição de um móvel em linha reta $$s(t) = 2t^3 - 9t^2 + 12t + 4$$ (com $s$ em metros e $t$ em segundos), em quais instantes de tempo o móvel fica momentaneamente parado ($v = 0$)?',
      options: [
        { id: 'A', text: '$$t = 1\\text{ s}$$ e $$t = 2\\text{ s}$$' },
        { id: 'B', text: '$$t = 3\\text{ s}$$ e $$t = 4\\text{ s}$$' },
        { id: 'C', text: 'Apenas em $$t = 2\\text{ s}$$' },
        { id: 'D', text: '$$t = 0\\text{ s}$$ e $$t = 1\\text{ s}$$' },
      ],
      correctOptionId: 'A',
      commentedAnalysis: {
        correctReason:
          '1. A velocidade instantânea é a primeira derivada da posição no tempo:\n\n$$v(t) = \\frac{ds}{dt} = 6t^2 - 18t + 12$$\n\n2. Para encontrar quando o corpo fica parado, igualamos a zero:\n\n$$6t^2 - 18t + 12 = 0$$\n\nDividindo toda a equação por 6:\n\n$$t^2 - 3t + 2 = 0$$\n\nFatorando o trinômio:\n\n$$(t - 1)(t - 2) = 0 \\implies t = 1\\text{ s} \\quad \\text{e} \\quad t = 2\\text{ s}$$',
        distractorExplanations: [
          { optionId: 'B', whyIncorrect: 'Errou na simplificação das raízes de Bhaskara.' },
          { optionId: 'C', whyIncorrect: 'Identificou apenas uma das raízes da equação quadrática.' },
          { optionId: 'D', whyIncorrect: 'Assumiu erroneamente que o repouso inicial acontecia em $t = 0$. Em $t = 0$, $v(0) = 12\\text{ m/s}$.' },
        ],
        keyTakeaway: 'Para encontrar quando algo para, zere a derivada da posição ($v = s\' = 0$).',
        referenceInMaterial: 'Módulo 1: Derivada como Velocidade Instantânea.',
      },
    },
  ],
  flashcards: [
    {
      id: 'fc-c1',
      front: 'Qual é a derivada da função $f(x) = \\ln(x)$ para $x > 0$?',
      back: '$$f\'(x) = \\frac{1}{x}$$',
      category: 'Regras Fundamentais',
    },
    {
      id: 'fc-c2',
      front: 'O que estabelece a Regra da Cadeia?',
      back: 'Para diferenciar uma função composta $y = f(g(x))$: $$\\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x)$$',
      category: 'Técnicas de Derivação',
    },
  ],
  sourceGroundingNotes: 'Compilado a partir do livro Stewart - Cálculo Diferencial e Integral.',
  sourceFileName: 'calculo_diferencial_fundamentos.pdf',
  processedAt: new Date().toLocaleDateString('pt-BR'),
};
