((root) => {
  'use strict';

  const profiles = {
  "brand": {
    "title": "Branding e identidade visual",
    "interest": "Branding e identidade visual",
    "intro": "Sua prioridade é organizar o posicionamento e a apresentação da empresa. O serviço de branding conecta público, mensagem, identidade visual e aplicações da marca.",
    "step": "Definir posicionamento, mensagem, logo, cores e tipografia para a comunicação da empresa."
  },
  "content": {
    "title": "Gestão de redes sociais",
    "interest": "Gestão de redes sociais",
    "intro": "Sua prioridade é planejar o conteúdo e dar consistência às redes sociais. Um calendário editorial organiza os temas, formatos e peças em torno da oferta e do público.",
    "step": "Planejar calendário, posts, legendas e roteiros para Reels e stories."
  },
  "campaigns": {
    "title": "Tráfego pago e campanhas",
    "interest": "Tráfego pago e campanhas",
    "intro": "Sua prioridade está na divulgação da oferta e na geração de contatos. Uma campanha reúne público, verba, criativos e uma página ou canal de destino para o anúncio.",
    "step": "Definir objetivo, público, orçamento, anúncios e indicadores de acompanhamento."
  },
  "pages": {
    "title": "Sites e landing pages",
    "interest": "Sites e landing pages",
    "intro": "Sua prioridade é ter uma página que apresente o negócio, explique a oferta e facilite o contato. O projeto reúne estrutura, texto, design e chamadas para ação.",
    "step": "Criar a estrutura e o texto da página, o layout responsivo e os pontos de contato."
  }
};

  const questions = [
  {
    "id": "stage",
    "title": "Em que momento sua empresa está?",
    "note": "Considere como o negócio divulga seus produtos ou serviços hoje.",
    "options": [
      {
        "value": "starting",
        "label": "Estou começando",
        "description": "Preciso apresentar a empresa e estruturar o marketing."
      },
      {
        "value": "repositioning",
        "label": "Quero reorganizar meu marketing",
        "description": "Já divulgo, mas preciso alinhar minha marca e minha comunicação."
      },
      {
        "value": "growing",
        "label": "Quero ampliar a divulgação",
        "description": "Já tenho uma base e quero trabalhar novas oportunidades."
      }
    ]
  },
  {
    "id": "challenge",
    "title": "Qual é o principal desafio de marketing?",
    "note": "Escolha a frente que mais precisa de atenção.",
    "options": [
      {
        "value": "brand",
        "label": "Posicionamento e identidade visual",
        "description": "Preciso definir como minha empresa se apresenta ao público."
      },
      {
        "value": "content",
        "label": "Conteúdo e redes sociais",
        "description": "Preciso planejar e criar posts, vídeos e stories."
      },
      {
        "value": "campaigns",
        "label": "Anúncios e captação de contatos",
        "description": "Quero divulgar minha oferta com campanhas de tráfego pago."
      },
      {
        "value": "pages",
        "label": "Site ou página de vendas",
        "description": "Preciso explicar minha oferta e facilitar o contato online."
      }
    ]
  },
  {
    "id": "goal",
    "title": "Qual objetivo você quer trabalhar primeiro?",
    "note": "O objetivo ajuda a preparar o plano e a proposta.",
    "options": [
      {
        "value": "launch",
        "label": "Divulgar uma oferta ou lançamento",
        "description": "Quero apresentar um produto, serviço ou uma nova fase da empresa."
      },
      {
        "value": "consistency",
        "label": "Organizar minha presença digital",
        "description": "Quero ter identidade, conteúdo e canais mais consistentes."
      },
      {
        "value": "conversations",
        "label": "Atrair contatos comerciais",
        "description": "Quero criar oportunidades de conversa com possíveis clientes."
      }
    ]
  }
];

  const stageSteps = {
  "starting": "Mapear oferta, público e canais para construir as bases do marketing da empresa.",
  "repositioning": "Revisar identidade, comunicação e ações atuais para organizar as prioridades do marketing.",
  "growing": "Avaliar os canais que já funcionam e planejar as próximas ações de divulgação."
};

  const goalSteps = {
  "launch": "Organizar as peças e os canais necessários para divulgar a oferta ou o lançamento.",
  "consistency": "Definir uma rotina de criação, aprovação e acompanhamento das ações de marketing.",
  "conversations": "Facilitar o caminho até o contato comercial e acompanhar os indicadores disponíveis."
};

  function getRecommendation(answers) {
    const selected = {};
    questions.forEach((question) => {
      const option = question.options.find((item) => item.value === answers?.[question.id]);
      if (!option) throw new TypeError('Responda às três perguntas para obter um direcionamento.');
      selected[question.id] = option;
    });
    const profile = profiles[answers.challenge];
    return {
      key: answers.challenge,
      title: profile.title,
      interest: profile.interest,
      intro: profile.intro,
      steps: [stageSteps[answers.stage], profile.step, goalSteps[answers.goal]],
      contextText: `Momento: ${selected.stage.label}.\nPrioridade: ${profile.title}.\nObjetivo: ${selected.goal.label}.`
    };
  }

  function buildBriefing(values) {
    const clean = (key) => String(values[key] ?? '').trim();
    const optional = [
      ['segment', 'Segmento'], ['channel', 'Site ou perfil'],
      ['timeline', 'Quando pretendo começar'], ['contact', 'Meu contato']
    ].filter(([key]) => clean(key)).map(([key, label]) => `${label}: ${clean(key)}.`);
    return [
      'Olá, equipe Nômade Impérius!', '',
      `Meu nome é ${clean('name')} e minha marca é ${clean('brand')}.`,
      ...(optional.length ? ['', ...optional] : []), '',
      `Serviço de interesse: ${clean('interest')}.`,
      ...(clean('challenge') ? ['', `Meu desafio: ${clean('challenge')}`] : []),
      ...(clean('direction') ? ['', 'Meu direcionamento inicial:', clean('direction')] : []),
      ...(clean('reference') ? ['', `Referência de serviço: ${clean('reference')}.`] : []), '',
      'Gostaria de conversar sobre o plano de marketing e a proposta para minha empresa.'
    ].join('\n');
  }

  const projects = {
  "brand": {
    "title": "Branding e identidade visual",
    "label": "SERVIÇO DE MARKETING / BRANDING",
    "interest": "brand",
    "description": "O trabalho de marca organiza o que sua empresa representa e como ela se apresenta. Posicionamento, mensagem e identidade visual orientam as peças usadas nas redes, nas campanhas e nos materiais comerciais.",
    "notes": [
      [
        "Estratégia",
        "Leitura do público, dos concorrentes, da proposta de valor e dos diferenciais da empresa."
      ],
      [
        "Criação",
        "Logo ou revisão da marca, paleta de cores, tipografia e aplicações previstas no projeto."
      ],
      [
        "Entrega",
        "Arquivos e orientações de uso organizados de acordo com o escopo aprovado."
      ]
    ],
    "disclosure": "Imagem ilustrativa gerada para explicar o serviço. Não representa material de cliente, fotografia de equipe ou projeto contratado.",
    "reference": "Branding e identidade visual — frente de trabalho da Nômade Impérius"
  },
  "content": {
    "title": "Gestão de redes sociais",
    "label": "SERVIÇO DE MARKETING / CONTEÚDO",
    "interest": "content",
    "description": "O conteúdo conecta a rotina das redes sociais ao que sua empresa oferece. O serviço reúne planejamento editorial e criação das peças e textos para os formatos escolhidos, com uma rotina de aprovação.",
    "notes": [
      [
        "Planejamento",
        "Temas, calendário e formatos escolhidos a partir do público e dos objetivos da empresa."
      ],
      [
        "Criação",
        "Posts, carrosséis, legendas, sequências de stories e roteiros para Reels."
      ],
      [
        "Acompanhamento",
        "Revisão do conteúdo e dos indicadores disponíveis para orientar os próximos temas."
      ]
    ],
    "disclosure": "Cena ilustrativa gerada para apresentar o serviço. Não é uma gravação real da agência, um integrante da equipe ou uma campanha de cliente.",
    "reference": "Gestão de redes sociais — frente de trabalho da Nômade Impérius"
  },
  "campaigns": {
    "title": "Tráfego pago e campanhas",
    "label": "SERVIÇO DE MARKETING / ANÚNCIOS",
    "interest": "campaigns",
    "description": "Campanhas de mídia paga conectam sua oferta a um público definido. O planejamento reúne objetivo, verba, criativos e destino do anúncio, com acompanhamento para orientar ajustes.",
    "notes": [
      [
        "Planejamento",
        "Objetivo da campanha, público, orçamento e plataformas definidos para o projeto."
      ],
      [
        "Execução",
        "Textos, criativos e organização do caminho entre o anúncio e o contato comercial."
      ],
      [
        "Acompanhamento",
        "Análise dos indicadores disponíveis. A verba de mídia é separada do serviço da agência."
      ]
    ],
    "disclosure": "Cena e interface ilustrativas geradas para explicar o serviço. Não exibem conta real de anúncios, dados de desempenho ou resultados de clientes.",
    "reference": "Tráfego pago e campanhas — frente de trabalho da Nômade Impérius"
  },
  "pages": {
    "title": "Sites e landing pages",
    "label": "SERVIÇO DE MARKETING / SITES",
    "interest": "pages",
    "description": "Sites e landing pages apresentam sua empresa e dão contexto à sua oferta. A estrutura combina texto, design e chamadas para ação, com adaptação para diferentes telas.",
    "notes": [
      [
        "Estrutura e texto",
        "Organização da página e apresentação dos produtos, serviços e diferenciais do negócio."
      ],
      [
        "Design",
        "Layout alinhado à marca e adaptado para celular, tablet e computador."
      ],
      [
        "Contato",
        "Botões, formulários e integrações definidos na proposta, com um próximo passo claro."
      ]
    ],
    "disclosure": "Imagem de uma interface conceitual gerada para apresentar o serviço. Não representa um site contratado ou um projeto real de cliente.",
    "reference": "Sites e landing pages — frente de trabalho da Nômade Impérius"
  }
};

  root.NomadeExperience = Object.freeze({ profiles, questions, getRecommendation, buildBriefing, projects });
})(globalThis);
