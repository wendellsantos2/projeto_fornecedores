/**
 * SupplierFlow - Conjunto de Dados Iniciais de Demonstração (Mock Corporativo)
 * Dados realistas de empresas, categorias, etapas de aprovação, SLAs e pendências.
 */

export const ETAPAS_FLUXO = [
  'Cadastro iniciado',
  'Validação documental',
  'Aprovação Compras',
  'Aprovação Financeira',
  'Aprovação Global',
  'Concluído'
];

export const MOCK_FORNECEDORES = [
  {
    id: 'RIV-2026-0041',
    fornecedor: 'LogiTech Transportes e Armazéns Ltda',
    cnpj: '14.289.403/0001-92',
    categoria: 'Logística & Fretes Rodoviários',
    status: 'Aprovação Compras',
    responsavel: 'Carlos Eduardo Rocha',
    responsavelArea: 'Compras / Suprimentos',
    responsavelEmail: 'carlos.rocha@empresa.com',
    responsavelCargo: 'Especialista Sênior de Suprimentos',
    proximaAcao: 'Avaliação da tabela de frete spot e SLA de entrega regional',
    slaStatus: 'Atrasado',
    slaLimiteHoras: 48,
    slaHorasDecorridas: 72,
    diasParado: 6,
    dataCriacao: '2026-09-28',
    dataAtualizacao: '2026-10-06',
    valorEstimadoAnual: 'R$ 840.000,00',
    contatoNome: 'Roberto Albuquerque',
    contatoEmail: 'contato@logitechtransp.com.br',
    contatoTelefone: '(11) 98455-2201',
    cidadeUf: 'Campinas - SP',
    pendencias: [
      {
        id: 'p-41-1',
        texto: 'Última alteração consolidada do Contrato Social não autenticada',
        resolvida: false,
        criticidade: 'Alta',
        dataCriacao: '2026-09-29',
        area: 'Documental'
      },
      {
        id: 'p-41-2',
        texto: 'Comprovante bancário de conta corrente jurídica com CNPJ correto',
        resolvida: true,
        criticidade: 'Média',
        dataCriacao: '2026-09-28',
        area: 'Financeiro'
      }
    ],
    historico: [
      {
        data: '2026-09-28 09:15',
        autor: 'Portal de Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Fornecedor completou pré-cadastro com CNPJ e dados cadastrais básicos.'
      },
      {
        data: '2026-09-30 14:40',
        autor: 'Mariana Silveira (Compliance)',
        acao: 'Validação documental aprovada com ressalva',
        detalhe: 'CNDs Federal e FGTS válidas. Apontada pendência no Contrato Social consolidado.'
      },
      {
        data: '2026-10-01 10:00',
        autor: 'Sistema Workflow',
        acao: 'Transferência para Aprovação Compras',
        detalhe: 'Encaminhado para a fila do responsável Carlos Eduardo Rocha.'
      }
    ]
  },
  {
    id: 'RIV-2026-0042',
    fornecedor: 'Metalúrgica Vulcano do Brasil S.A.',
    cnpj: '03.882.119/0001-35',
    categoria: 'Usinagem & Estruturas Metálicas',
    status: 'Validação documental',
    responsavel: 'Mariana Silveira',
    responsavelArea: 'Compliance & Documental',
    responsavelEmail: 'mariana.silveira@empresa.com',
    responsavelCargo: 'Analista de Compliance',
    proximaAcao: 'Conferência de CND Trabalhista (BNDT) e certidão falimentar',
    slaStatus: 'No prazo',
    slaLimiteHoras: 24,
    slaHorasDecorridas: 10,
    diasParado: 2,
    dataCriacao: '2026-10-05',
    dataAtualizacao: '2026-10-07',
    valorEstimadoAnual: 'R$ 1.650.000,00',
    contatoNome: 'Cláudia Mendonça',
    contatoEmail: 'financeiro@vulcanometal.com.br',
    contatoTelefone: '(19) 3456-7890',
    cidadeUf: 'Piracicaba - SP',
    pendencias: [
      {
        id: 'p-42-1',
        texto: 'Certidão Negativa de Débitos Trabalhistas (BNDT) desatualizada',
        resolvida: false,
        criticidade: 'Alta',
        dataCriacao: '2026-10-06',
        area: 'Documental'
      }
    ],
    historico: [
      {
        data: '2026-10-05 11:20',
        autor: 'Portal de Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Submissão de documentos obrigatórios via portal externo.'
      },
      {
        data: '2026-10-06 09:00',
        autor: 'Mariana Silveira',
        acao: 'Início da Validação Documental',
        detalhe: 'Documentação recebida e inserida em triagem de certidões negativas.'
      }
    ]
  },
  {
    id: 'RIV-2026-0043',
    fornecedor: 'CloudNexus Soluções em Tecnologia S.A.',
    cnpj: '28.194.502/0001-70',
    categoria: 'SaaS, Nuvem & Infraestrutura TI',
    status: 'Aprovação Financeira',
    responsavel: 'Fernando Diniz',
    responsavelArea: 'Controladoria & Financeiro',
    responsavelEmail: 'fernando.diniz@empresa.com',
    responsavelCargo: 'Coordenador Financeiro',
    proximaAcao: 'Análise de balanço patrimonial dos últimos 2 exercícios e score de crédito',
    slaStatus: 'Em risco',
    slaLimiteHoras: 48,
    slaHorasDecorridas: 42,
    diasParado: 4,
    dataCriacao: '2026-09-30',
    dataAtualizacao: '2026-10-05',
    valorEstimadoAnual: 'R$ 520.000,00',
    contatoNome: 'Lucas Guimarães',
    contatoEmail: 'vendas@cloudnexus.io',
    contatoTelefone: '(11) 97123-4567',
    cidadeUf: 'São Paulo - SP',
    pendencias: [
      {
        id: 'p-43-1',
        texto: 'Balanço Patrimonial assinado com recibo do SPED Contábil',
        resolvida: false,
        criticidade: 'Média',
        dataCriacao: '2026-10-02',
        area: 'Financeiro'
      }
    ],
    historico: [
      {
        data: '2026-09-30 08:30',
        autor: 'Portal de Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Cadastro submetido.'
      },
      {
        data: '2026-10-01 16:00',
        autor: 'Mariana Silveira',
        acao: 'Validação documental concluída',
        detalhe: 'Documentos fiscais e societários 100% regulares.'
      },
      {
        data: '2026-10-03 14:10',
        autor: 'Carlos Eduardo Rocha',
        acao: 'Aprovação Compras concluída',
        detalhe: 'Proposta técnica e comercial dentro do teto de contratação aprovada.'
      }
    ]
  },
  {
    id: 'RIV-2026-0044',
    fornecedor: 'BioClean Produtos e Higiene Hospitalar',
    cnpj: '09.314.281/0001-08',
    categoria: 'Químicos & Materiais de Limpeza',
    status: 'Aprovação Global',
    responsavel: 'Juliana Paes Fontes',
    responsavelArea: 'Diretoria Global de Suprimentos',
    responsavelEmail: 'juliana.fontes@empresa.com',
    responsavelCargo: 'Head of Global Procurement',
    proximaAcao: 'Validação final de matriz de risco ESG e aprovação corporativa no ERP',
    slaStatus: 'No prazo',
    slaLimiteHoras: 72,
    slaHorasDecorridas: 24,
    diasParado: 1,
    dataCriacao: '2026-09-25',
    dataAtualizacao: '2026-10-07',
    valorEstimadoAnual: 'R$ 2.400.000,00',
    contatoNome: 'Patrícia Alencar',
    contatoEmail: 'governanca@bioclean.ind.br',
    contatoTelefone: '(31) 3290-1122',
    cidadeUf: 'Belo Horizonte - MG',
    pendencias: [],
    historico: [
      {
        data: '2026-09-25 10:00',
        autor: 'Portal Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Submissão completa.'
      },
      {
        data: '2026-09-28 15:30',
        autor: 'Mariana Silveira',
        acao: 'Validação documental aprovada',
        detalhe: 'Licença Sanitária e Anvisa validadas com sucesso.'
      },
      {
        data: '2026-10-02 11:20',
        autor: 'Carlos Eduardo Rocha',
        acao: 'Aprovação Compras aprovada',
        detalhe: 'Tabela de preços anual fixada.'
      },
      {
        data: '2026-10-06 17:00',
        autor: 'Fernando Diniz',
        acao: 'Aprovação Financeira aprovada',
        detalhe: 'Limite de crédito e prazo de pagamento D+45 homologados.'
      }
    ]
  },
  {
    id: 'RIV-2026-0045',
    fornecedor: 'Apex Consultoria Tributária & Auditoria',
    cnpj: '18.774.912/0001-44',
    categoria: 'Serviços Jurídicos & Consultoria',
    status: 'Concluído',
    responsavel: 'Juliana Paes Fontes',
    responsavelArea: 'Diretoria Global de Suprimentos',
    responsavelEmail: 'juliana.fontes@empresa.com',
    responsavelCargo: 'Head of Global Procurement',
    proximaAcao: 'Processo concluído com êxito. Fornecedor ativo no catálogo.',
    slaStatus: 'Concluído',
    slaLimiteHoras: 72,
    slaHorasDecorridas: 50,
    diasParado: 0,
    dataCriacao: '2026-09-20',
    dataAtualizacao: '2026-10-02',
    valorEstimadoAnual: 'R$ 380.000,00',
    contatoNome: 'Marcelo Castro',
    contatoEmail: 'marcelo.castro@apextax.com.br',
    contatoTelefone: '(11) 3045-8900',
    cidadeUf: 'São Paulo - SP',
    pendencias: [],
    historico: [
      {
        data: '2026-09-20 09:00',
        autor: 'Portal Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Início do fluxo de homologação.'
      },
      {
        data: '2026-09-24 16:00',
        autor: 'Mariana Silveira',
        acao: 'Validação documental concluída',
        detalhe: 'Todas as certidões e comprovantes em conformidade.'
      },
      {
        data: '2026-09-28 11:00',
        autor: 'Carlos Eduardo Rocha',
        acao: 'Aprovação Compras concluída',
        detalhe: 'Homologação técnica do escopo tributário.'
      },
      {
        data: '2026-09-30 14:00',
        autor: 'Fernando Diniz',
        acao: 'Aprovação Financeira concluída',
        detalhe: 'Condições de faturamento aprovadas.'
      },
      {
        data: '2026-10-02 10:30',
        autor: 'Juliana Paes Fontes',
        acao: 'Aprovação Global concluída',
        detalhe: 'Registro SAP gerado. Fornecedor ativo.'
      }
    ]
  },
  {
    id: 'RIV-2026-0046',
    fornecedor: 'Delta Segurança Patrimonial & Facilities',
    cnpj: '07.412.890/0001-19',
    categoria: 'Facilities & Vigilância Armada',
    status: 'Cadastro iniciado',
    responsavel: 'Equipe de Triagem',
    responsavelArea: 'Cadastro & Triagem',
    responsavelEmail: 'triagem@empresa.com',
    responsavelCargo: 'Assistente de Cadastros',
    proximaAcao: 'Aguardando envio de alvará da Polícia Federal e apólices de seguro',
    slaStatus: 'No prazo',
    slaLimiteHoras: 24,
    slaHorasDecorridas: 8,
    diasParado: 1,
    dataCriacao: '2026-10-07',
    dataAtualizacao: '2026-10-07',
    valorEstimadoAnual: 'R$ 1.120.000,00',
    contatoNome: 'Tenente Rangel',
    contatoEmail: 'operacoes@deltaseg.com.br',
    contatoTelefone: '(21) 2544-7711',
    cidadeUf: 'Rio de Janeiro - RJ',
    pendencias: [
      {
        id: 'p-46-1',
        texto: 'Certificado de Segurança emitido pelo DPF/CGCSP',
        resolvida: false,
        criticidade: 'Alta',
        dataCriacao: '2026-10-07',
        area: 'Documental'
      }
    ],
    historico: [
      {
        data: '2026-10-07 14:00',
        autor: 'Equipe de Triagem',
        acao: 'Cadastro iniciado',
        detalhe: 'Link de acesso ao portal enviado para o fornecedor.'
      }
    ]
  },
  {
    id: 'RIV-2026-0047',
    fornecedor: 'Prime Embalagens Sustentáveis Eireli',
    cnpj: '21.503.744/0001-82',
    categoria: 'Insumos Industriais & Embalagens',
    status: 'Aprovação Compras',
    responsavel: 'Carlos Eduardo Rocha',
    responsavelArea: 'Compras / Suprimentos',
    responsavelEmail: 'carlos.rocha@empresa.com',
    responsavelCargo: 'Especialista Sênior de Suprimentos',
    proximaAcao: 'Negociação de lote mínimo e condições de entrega FOB',
    slaStatus: 'Em risco',
    slaLimiteHoras: 48,
    slaHorasDecorridas: 40,
    diasParado: 3,
    dataCriacao: '2026-10-02',
    dataAtualizacao: '2026-10-06',
    valorEstimadoAnual: 'R$ 670.000,00',
    contatoNome: 'Amanda Prado',
    contatoEmail: 'amanda@primeembalagens.com.br',
    contatoTelefone: '(41) 3322-1100',
    cidadeUf: 'Curitiba - PR',
    pendencias: [],
    historico: [
      {
        data: '2026-10-02 08:00',
        autor: 'Portal de Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Cadastro inicial submetido.'
      },
      {
        data: '2026-10-04 15:00',
        autor: 'Mariana Silveira',
        acao: 'Validação documental concluída',
        detalhe: 'Documentação validada sem inconformidades.'
      }
    ]
  },
  {
    id: 'RIV-2026-0048',
    fornecedor: 'Vortex Telecomunicações e Fibra Óptica',
    cnpj: '33.910.428/0001-05',
    categoria: 'Telecomunicações & Links Dedicados',
    status: 'Aprovação Financeira',
    responsavel: 'Fernando Diniz',
    responsavelArea: 'Controladoria & Financeiro',
    responsavelEmail: 'fernando.diniz@empresa.com',
    responsavelCargo: 'Coordenador Financeiro',
    proximaAcao: 'Regularização de pendência de dados bancários para depósito e faturamento',
    slaStatus: 'Atrasado',
    slaLimiteHoras: 48,
    slaHorasDecorridas: 96,
    diasParado: 8,
    dataCriacao: '2026-09-22',
    dataAtualizacao: '2026-10-01',
    valorEstimadoAnual: 'R$ 410.000,00',
    contatoNome: 'Gabriel Esteves',
    contatoEmail: 'contas@vortextelecom.com.br',
    contatoTelefone: '(11) 4004-9898',
    cidadeUf: 'Barueri - SP',
    pendencias: [
      {
        id: 'p-48-1',
        texto: 'Carta do banco com confirmação de titularidade da conta PJ',
        resolvida: false,
        criticidade: 'Alta',
        dataCriacao: '2026-09-26',
        area: 'Financeiro'
      },
      {
        id: 'p-48-2',
        texto: 'Inscrição Municipal não localizada no cadastro de Barueri',
        resolvida: false,
        criticidade: 'Média',
        dataCriacao: '2026-09-27',
        area: 'Financeiro'
      }
    ],
    historico: [
      {
        data: '2026-09-22 10:15',
        autor: 'Portal Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Documentação inicial.'
      },
      {
        data: '2026-09-24 11:30',
        autor: 'Mariana Silveira',
        acao: 'Validação documental aprovada',
        detalhe: 'Documentação primária analisada.'
      },
      {
        data: '2026-09-26 16:00',
        autor: 'Carlos Eduardo Rocha',
        acao: 'Aprovação Compras aprovada',
        detalhe: 'Contrato de prestação de serviços pré-validado.'
      },
      {
        data: '2026-09-27 09:30',
        autor: 'Fernando Diniz',
        acao: 'Pendência Financeira Aberta',
        detalhe: 'Divergência de dígito de conta bancária detectada.'
      }
    ]
  },
  {
    id: 'RIV-2026-0049',
    fornecedor: 'Synthex Insumos Químicos do Brasil',
    cnpj: '05.621.908/0001-63',
    categoria: 'Matérias-Primas Químicas & Reagentes',
    status: 'Validação documental',
    responsavel: 'Mariana Silveira',
    responsavelArea: 'Compliance & Documental',
    responsavelEmail: 'mariana.silveira@empresa.com',
    responsavelCargo: 'Analista de Compliance',
    proximaAcao: 'Cobrança do Certificado de Regularidade do Ibama (CTF/APP)',
    slaStatus: 'Atrasado',
    slaLimiteHoras: 24,
    slaHorasDecorridas: 68,
    diasParado: 5,
    dataCriacao: '2026-10-01',
    dataAtualizacao: '2026-10-04',
    valorEstimadoAnual: 'R$ 3.200.000,00',
    contatoNome: 'Beatriz Vasconcelos',
    contatoEmail: 'compliance@synthex.com.br',
    contatoTelefone: '(12) 3944-5500',
    cidadeUf: 'São José dos Campos - SP',
    pendencias: [
      {
        id: 'p-49-1',
        texto: 'Certificado de Registro Cadastral do Ibama vencido',
        resolvida: false,
        criticidade: 'Alta',
        dataCriacao: '2026-10-02',
        area: 'Documental'
      }
    ],
    historico: [
      {
        data: '2026-10-01 13:40',
        autor: 'Portal de Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Fornecedor anexou documentos regulatórios.'
      },
      {
        data: '2026-10-02 10:00',
        autor: 'Mariana Silveira',
        acao: 'Pendência Ambiental Registrada',
        detalhe: 'Documento do Ibama venceu no mês anterior.'
      }
    ]
  },
  {
    id: 'RIV-2026-0050',
    fornecedor: 'Horizonte Energia Solar & Eficiência',
    cnpj: '19.455.302/0001-11',
    categoria: 'Energia & Infraestrutura Elétrica',
    status: 'Concluído',
    responsavel: 'Juliana Paes Fontes',
    responsavelArea: 'Diretoria Global de Suprimentos',
    responsavelEmail: 'juliana.fontes@empresa.com',
    responsavelCargo: 'Head of Global Procurement',
    proximaAcao: 'Fornecedor homologado e apto a participar de cotações',
    slaStatus: 'Concluído',
    slaLimiteHoras: 72,
    slaHorasDecorridas: 45,
    diasParado: 0,
    dataCriacao: '2026-09-18',
    dataAtualizacao: '2026-09-29',
    valorEstimadoAnual: 'R$ 950.000,00',
    contatoNome: 'Vinícius Ramos',
    contatoEmail: 'projetos@horizonteenergia.com.br',
    contatoTelefone: '(31) 99887-6655',
    cidadeUf: 'Uberlândia - MG',
    pendencias: [],
    historico: [
      {
        data: '2026-09-18 10:00',
        autor: 'Portal Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Submissão de dados cadastrais.'
      },
      {
        data: '2026-09-29 16:30',
        autor: 'Juliana Paes Fontes',
        acao: 'Aprovação Global concluída',
        detalhe: 'Homologação concluída com sucesso.'
      }
    ]
  },
  {
    id: 'RIV-2026-0051',
    fornecedor: 'Vanguard Manutenção Predial e Climatização',
    cnpj: '11.890.123/0001-49',
    categoria: 'Manutenção & Engenharia de Climatização',
    status: 'Aprovação Global',
    responsavel: 'Juliana Paes Fontes',
    responsavelArea: 'Diretoria Global de Suprimentos',
    responsavelEmail: 'juliana.fontes@empresa.com',
    responsavelCargo: 'Head of Global Procurement',
    proximaAcao: 'Assinatura do Acordo de Nível de Serviço (SLA) Global',
    slaStatus: 'Em risco',
    slaLimiteHoras: 72,
    slaHorasDecorridas: 65,
    diasParado: 3,
    dataCriacao: '2026-09-29',
    dataAtualizacao: '2026-10-06',
    valorEstimadoAnual: 'R$ 720.000,00',
    contatoNome: 'Rodrigo Medeiros',
    contatoEmail: 'comercial@vanguardmanutencao.com.br',
    contatoTelefone: '(11) 3211-9000',
    cidadeUf: 'Santos - SP',
    pendencias: [],
    historico: [
      {
        data: '2026-09-29 14:00',
        autor: 'Portal Autoatendimento',
        acao: 'Cadastro iniciado',
        detalhe: 'Cadastro submetido.'
      },
      {
        data: '2026-10-06 11:00',
        autor: 'Fernando Diniz',
        acao: 'Aprovação Financeira concluída',
        detalhe: 'Todas as aprovações fiscais ok.'
      }
    ]
  }
];
