# SupplierFlow - MVP Funcional para Gestão de Cadastro de Fornecedores (RIVs)

Aplicação corporativa e interativa desenvolvida em **Astro** para o acompanhamento e governança de todo o ciclo de homologação e cadastro de fornecedores (**RIV - Registro de Identificação do Fornecedor**).

O sistema resolve problemas críticos de **baixa visibilidade**, **dependência de pessoas específicas**, **acompanhamento manual em planilhas** e **dificuldade em identificar responsáveis, pendências e atrasos/gargalos**.

---

## 🎯 Funcionalidades Principais

### 1. Dashboard Executivo em Tempo Real
- **Total de Cadastros**: Visão global da base de fornecedores.
- **Cadastros em Andamento**: Fornecedores ativos no pipeline de homologação.
- **Cadastros Concluídos**: Fornecedores com aprovação e integração concluída.
- **Cadastros Atrasados (SLA Vencido)**: Destaque visual crítico para desvios de prazo.
- **Aguardando Compras**: Fila operacional do time de Compras e Suprimentos.
- **Aguardando Financeiro**: Fila da Controladoria e Análise Fiscal/Crédito.
- **Aguardando Global**: Fila da Diretoria / Comitê de Suprimentos Global.
- *Filtro Rápido com 1 Clique*: Ao clicar em qualquer card do Dashboard, a tabela é filtrada imediatamente.

### 2. Consulta Interativa de RIVs
Tabela corporativa completa contendo:
- **Número da RIV** (ex: `RIV-2026-0041`)
- **Nome do Fornecedor & CNPJ** com categoria de fornecimento
- **Status Atual** (com tags coloridas por área e indicação de pendências ativas)
- **Responsável Atual & Departamento** (com avatar e cargo)
- **Próxima Ação Necessária**
- **SLA da Etapa** (No prazo, Em risco, Atrasado/Vencido e contagem de horas restantes)
- **Data de Criação** e **Última Atualização** (com dias parado)

### 3. Detalhamento da RIV (Modal Interativo Completo)
Ao selecionar qualquer fornecedor na tabela ou no kanban:
- **Fluxo Visual de 6 Etapas (Stepper)**:
  1. `Cadastro iniciado`
  2. `Validação documental`
  3. `Aprovação Compras`
  4. `Aprovação Financeira`
  5. `Aprovação Global`
  6. `Concluído`
- **Painel de SLA**: Barra de progresso visual de tempo decorrido vs. limite da etapa, prazo restante e horas de atraso.
- **Checklist Interativo de Pendências**:
  - Marcação de pendência como resolvida / reaberta.
  - Adição de novas pendências com criticidade (Alta, Média, Baixa).
  - Exclusão de pendências.
- **Histórico de Auditoria & Tramitações (Timeline)**:
  - Registro de todas as movimentações, alterações e aprovações com data, hora e autor.
  - Campo para inclusão de notas e observações operacionais.
- **Ações de Workflow**:
  - `Avançar para Próxima Etapa` (com validação de pendências críticas).
  - `Retornar Etapa` (com justificativa registrada no histórico).
  - `Editar Dados da RIV`.

### 4. Central de Alertas & Gargalos
Visão dedicada agrupando:
- **🚨 SLA Vencido / Em Atraso**: Processos com tempo estourado que requerem escalonamento.
- **⏳ Processos Parados (Gargalos)**: Cadastros sem movimentação há 3 ou mais dias.
- **📑 Pendências Documentais & Regulatórias**: CNDs vencidas, balanços pendentes ou certidões fiscais.
- **⚖️ Aprovações Executivas Pendentes**: Processos aguardando parecer final das diretorias.

### 5. Visão Kanban (Pipeline de 6 Colunas)
- Visualização de funil em colunas correspondentes às etapas de homologação.
- Destaque em vermelho para cartões com SLA vencido.

### 6. Gestão de Dados & Exportação
- **Adicionar / Editar RIV**: Formulário completo para cadastrar novos fornecedores ou alterar dados existentes.
- **Persistência Local (LocalStorage)**: Todas as alterações (avanços, novas pendências, novos cadastros) ficam salvas localmente no navegador.
- **Restaurar Dados da Demo**: Botão para recarregar o conjunto de dados fictícios corporativos a qualquer momento.
- **Exportação CSV**: Exportação instantânea para Excel/CSV dos dados filtrados com codificação UTF-8.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Astro](https://astro.build/) (v5 / v7)
- **Arquitetura**: Component-based (Astro Components + JavaScript Modular no Cliente)
- **Estilização**: CSS Vanilla Moderno com Design System Corporativo Executivo (Paleta de azuis corporativos, ardósia, tipografia *Plus Jakarta Sans* e *JetBrains Mono*, sombras sutis, micro-interações fluidas e responsividade)
- **Persistência**: LocalStorage com sincronização reativa em tempo real

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18+)
- npm instalado

### Instalação e Execução

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou
   npm start
   ```

3. **Acessar no navegador**:
   Abra [http://localhost:4321](http://localhost:4321)

4. **Gerar build de produção**:
   ```bash
   npm run build
   ```

---

## 📁 Estrutura de Pastas

```text
├── public/                  # Arquivos estáticos
├── src/
│   ├── components/          # Componentes modulares da interface
│   │   ├── Header.astro           # Barra de navegação, abas e ações
│   │   ├── KpiDashboard.astro     # Cards dos 7 KPIs + alerta de SLA
│   │   ├── FilterBar.astro        # Busca e filtros rápidos
│   │   ├── RivTable.astro         # Tabela detalhada de RIVs
│   │   ├── KanbanView.astro       # Pipeline visual em 6 etapas
│   │   ├── AlertsCenter.astro     # Central de alertas e gargalos
│   │   ├── RivDetailModal.astro   # Modal com stepper, SLA, checklist e timeline
│   │   └── RivFormModal.astro     # Formulário de criação e edição
│   ├── data/
│   │   └── mockFornecedores.js    # Dados corporativos fictícios realistas
│   ├── scripts/
│   │   └── app.js                 # Controlador reativo de estado, filtros e workflow
│   ├── styles/
│   │   └── global.css             # Design System corporativo completo
│   └── pages/
│       └── index.astro            # Página principal do sistema
├── package.json
└── README.md
```
