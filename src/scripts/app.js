/**
 * SupplierFlow - Interactive Application Controller
 * Handles local state, filtering, KPIs, CRUD, workflow advancement, alerts, and export.
 */

import { MOCK_FORNECEDORES, ETAPAS_FLUXO } from '../data/mockFornecedores.js';

// Application State
let suppliersData = [];
let activeView = 'table'; // 'table' | 'kanban' | 'alerts'
let activeFilter = {
  search: '',
  status: 'ALL',
  area: 'ALL',
  sla: 'ALL',
  kpi: 'ALL',
  onlyAlerts: false
};
let selectedRiv = null;

// Initialize Application
export function initApp() {
  loadData();
  bindGlobalEvents();
  renderAll();
}

// Data persistence
function loadData() {
  try {
    const stored = localStorage.getItem('supplierflow_rivs_v1');
    if (stored) {
      suppliersData = JSON.parse(stored);
    } else {
      suppliersData = JSON.parse(JSON.stringify(MOCK_FORNECEDORES));
      saveData();
    }
  } catch (e) {
    console.error('Erro ao ler localStorage', e);
    suppliersData = JSON.parse(JSON.stringify(MOCK_FORNECEDORES));
  }
}

function saveData() {
  try {
    localStorage.setItem('supplierflow_rivs_v1', JSON.stringify(suppliersData));
  } catch (e) {
    console.error('Erro ao salvar localStorage', e);
  }
}

export function resetToDemoData() {
  if (confirm('Deseja restaurar os dados originais da demonstração? Suas alterações locais serão resetadas.')) {
    suppliersData = JSON.parse(JSON.stringify(MOCK_FORNECEDORES));
    saveData();
    renderAll();
    showToast('Dados de demonstração restaurados com sucesso!', 'success');
  }
}

// Render Master
function renderAll() {
  updateKpiMetrics();
  renderAlertBanner();
  renderFilterOptions();

  if (activeView === 'table') {
    renderTable();
    document.getElementById('view-table-container')?.classList.remove('hidden');
    document.getElementById('view-kanban-container')?.classList.add('hidden');
    document.getElementById('view-alerts-container')?.classList.add('hidden');
  } else if (activeView === 'kanban') {
    renderKanban();
    document.getElementById('view-table-container')?.classList.add('hidden');
    document.getElementById('view-kanban-container')?.classList.remove('hidden');
    document.getElementById('view-alerts-container')?.classList.add('hidden');
  } else if (activeView === 'alerts') {
    renderAlertsCenter();
    document.getElementById('view-table-container')?.classList.add('hidden');
    document.getElementById('view-kanban-container')?.classList.add('hidden');
    document.getElementById('view-alerts-container')?.classList.remove('hidden');
  }

  // Update tabs active state
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === activeView);
  });

  // Update alert badge count
  const criticalCount = suppliersData.filter(s => s.slaStatus === 'Atrasado' || s.diasParado >= 5).length;
  const badgeEl = document.getElementById('badge-alertas-count');
  if (badgeEl) {
    badgeEl.textContent = criticalCount;
    badgeEl.style.display = criticalCount > 0 ? 'inline-block' : 'none';
  }
}

// Calculate KPIs
function getKpiMetrics() {
  const total = suppliersData.length;
  const emAndamento = suppliersData.filter(s => s.status !== 'Concluído').length;
  const concluidos = suppliersData.filter(s => s.status === 'Concluído').length;
  const atrasados = suppliersData.filter(s => s.slaStatus === 'Atrasado').length;
  const compras = suppliersData.filter(s => s.status === 'Aprovação Compras').length;
  const financeiro = suppliersData.filter(s => s.status === 'Aprovação Financeira').length;
  const global = suppliersData.filter(s => s.status === 'Aprovação Global').length;

  return { total, emAndamento, concluidos, atrasados, compras, financeiro, global };
}

function updateKpiMetrics() {
  const m = getKpiMetrics();
  const elTotal = document.getElementById('kpi-total-val');
  const elAndamento = document.getElementById('kpi-andamento-val');
  const elConcluidos = document.getElementById('kpi-concluidos-val');
  const elAtrasados = document.getElementById('kpi-atrasados-val');
  const elCompras = document.getElementById('kpi-compras-val');
  const elFinanceiro = document.getElementById('kpi-financeiro-val');
  const elGlobal = document.getElementById('kpi-global-val');

  if (elTotal) elTotal.textContent = m.total;
  if (elAndamento) elAndamento.textContent = m.emAndamento;
  if (elConcluidos) elConcluidos.textContent = m.concluidos;
  if (elAtrasados) elAtrasados.textContent = m.atrasados;
  if (elCompras) elCompras.textContent = m.compras;
  if (elFinanceiro) elFinanceiro.textContent = m.financeiro;
  if (elGlobal) elGlobal.textContent = m.global;

  // Active KPI highlight
  document.querySelectorAll('.kpi-card').forEach(card => {
    const kpiType = card.getAttribute('data-kpi');
    card.classList.toggle('kpi-active', activeFilter.kpi === kpiType);
  });
}

function renderAlertBanner() {
  const atrasados = suppliersData.filter(s => s.slaStatus === 'Atrasado');
  const banner = document.getElementById('sla-alert-banner');
  if (!banner) return;

  if (atrasados.length > 0) {
    banner.style.display = 'flex';
    const textEl = document.getElementById('sla-alert-banner-text');
    if (textEl) {
      textEl.innerHTML = `<strong>Atenção Executiva:</strong> Existem <strong>${atrasados.length} processos de RIV com SLA vencido</strong> aguardando resolução imediata.`;
    }
  } else {
    banner.style.display = 'none';
  }
}

// Filtering Logic
function getFilteredSuppliers() {
  return suppliersData.filter(item => {
    // Search query
    if (activeFilter.search) {
      const q = activeFilter.search.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.fornecedor.toLowerCase().includes(q) ||
        item.cnpj.toLowerCase().includes(q) ||
        item.responsavel.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q) ||
        item.proximaAcao.toLowerCase().includes(q);
      if (!match) return false;
    }

    // KPI Direct Filter
    if (activeFilter.kpi !== 'ALL') {
      if (activeFilter.kpi === 'total') return true;
      if (activeFilter.kpi === 'andamento' && item.status === 'Concluído') return false;
      if (activeFilter.kpi === 'concluido' && item.status !== 'Concluído') return false;
      if (activeFilter.kpi === 'atrasado' && item.slaStatus !== 'Atrasado') return false;
      if (activeFilter.kpi === 'compras' && item.status !== 'Aprovação Compras') return false;
      if (activeFilter.kpi === 'financeiro' && item.status !== 'Aprovação Financeira') return false;
      if (activeFilter.kpi === 'global' && item.status !== 'Aprovação Global') return false;
    }

    // Status filter
    if (activeFilter.status !== 'ALL' && item.status !== activeFilter.status) {
      return false;
    }

    // SLA filter
    if (activeFilter.sla !== 'ALL' && item.slaStatus !== activeFilter.sla) {
      return false;
    }

    // Area filter
    if (activeFilter.area !== 'ALL' && !item.responsavelArea.toLowerCase().includes(activeFilter.area.toLowerCase())) {
      return false;
    }

    // Only Alerts filter
    if (activeFilter.onlyAlerts) {
      const hasUnresolved = item.pendencias && item.pendencias.some(p => !p.resolvida);
      const isCritical = item.slaStatus === 'Atrasado' || item.diasParado >= 3 || hasUnresolved;
      if (!isCritical) return false;
    }

    return true;
  });
}

function renderFilterOptions() {
  const chipContainer = document.getElementById('filter-chips');
  if (!chipContainer) return;

  const chips = [
    { id: 'ALL', label: 'Todos os Processos' },
    { id: 'ATRASADOS', label: '🚨 Atrasados / SLA Vencido' },
    { id: 'PENDENCIAS', label: '⚠️ Com Pendências' },
    { id: 'PARADOS', label: '⏳ Parados > 3 Dias' },
    { id: 'CONCLUIDOS', label: '✅ Concluídos' }
  ];

  chipContainer.innerHTML = chips.map(c => `
    <button class="filter-chip ${activeFilter.chipMode === c.id ? 'active' : ''}" data-chip="${c.id}">
      ${c.label}
    </button>
  `).join('');
}

// Render Table View
function renderTable() {
  const tbody = document.getElementById('riv-table-body');
  const countEl = document.getElementById('table-records-count');
  if (!tbody) return;

  const filtered = getFilteredSuppliers();
  if (countEl) countEl.textContent = `${filtered.length} de ${suppliersData.length}`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style="font-weight: 700; color: var(--neutral-700);">Nenhuma RIV encontrada para os filtros selecionados.</p>
            <p style="font-size: 0.8rem; margin-top: 4px;">Tente redefinir a busca ou limpar os filtros aplicados.</p>
            <button class="btn btn-white btn-sm" id="btn-clear-filters" style="margin-top: 0.85rem;">Limpar Filtros</button>
          </div>
        </td>
      </tr>
    `;
    document.getElementById('btn-clear-filters')?.addEventListener('click', clearFilters);
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const statusClass = getStatusClass(item.status);
    const slaClass = getSlaClass(item.slaStatus);
    const initials = item.responsavel.split(' ').map(n => n[0]).slice(0, 2).join('');
    const hasPendingDocs = item.pendencias?.filter(p => !p.resolvida).length || 0;

    return `
      <tr class="table-row-item" data-id="${item.id}">
        <td>
          <span class="riv-id-badge">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            ${item.id}
          </span>
        </td>
        <td>
          <div class="supplier-cell-name">${escapeHtml(item.fornecedor)}</div>
          <div class="supplier-cell-meta">
            <span>${item.cnpj}</span>
            <span>•</span>
            <span>${escapeHtml(item.categoria)}</span>
          </div>
        </td>
        <td>
          <span class="status-pill ${statusClass}">
            ${item.status}
          </span>
          ${hasPendingDocs > 0 ? `<div style="font-size: 0.7rem; color: #dc2626; font-weight: 600; margin-top: 3px;">⚠️ ${hasPendingDocs} pendência(s)</div>` : ''}
        </td>
        <td>
          <div class="user-avatar-cell">
            <div class="avatar-circle">${initials}</div>
            <div>
              <div class="user-cell-name">${escapeHtml(item.responsavel)}</div>
              <div class="user-cell-dept">${escapeHtml(item.responsavelArea)}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="next-action-cell">
            ${escapeHtml(item.proximaAcao)}
          </div>
        </td>
        <td>
          <span class="sla-badge ${slaClass}">
            ${getSlaIcon(item.slaStatus)}
            ${item.slaStatus}
          </span>
          <div style="font-size: 0.72rem; color: var(--neutral-500); margin-top: 2px;">
            ${formatSlaTimeRemaining(item)}
          </div>
        </td>
        <td>
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--neutral-700);">${formatDate(item.dataCriacao)}</div>
          <div style="font-size: 0.72rem; color: var(--neutral-400);">Criado</div>
        </td>
        <td>
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--neutral-700);">${formatDate(item.dataAtualizacao)}</div>
          <div style="font-size: 0.72rem; color: var(--neutral-400);">Parado há ${item.diasParado}d</div>
        </td>
      </tr>
    `;
  }).join('');

  // Row click to open detail
  tbody.querySelectorAll('.table-row-item').forEach(tr => {
    tr.addEventListener('click', () => {
      const id = tr.getAttribute('data-id');
      openRivDetail(id);
    });
  });
}

// Render Kanban View
function renderKanban() {
  const container = document.getElementById('view-kanban-board');
  if (!container) return;

  const filtered = getFilteredSuppliers();

  container.innerHTML = ETAPAS_FLUXO.map(etapa => {
    const etapaItems = filtered.filter(s => s.status === etapa);
    return `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="kanban-col-title">
            <span>${etapa}</span>
          </div>
          <span class="kanban-col-count">${etapaItems.length}</span>
        </div>
        <div class="kanban-cards-list">
          ${etapaItems.map(item => `
            <div class="kanban-card ${item.slaStatus === 'Atrasado' ? 'card-sla-atrasado' : ''}" data-id="${item.id}">
              <div class="kanban-card-top">
                <span class="riv-id-badge" style="font-size: 0.72rem;">${item.id}</span>
                <span class="sla-badge ${getSlaClass(item.slaStatus)}" style="font-size: 0.68rem; padding: 1px 6px;">
                  ${item.slaStatus}
                </span>
              </div>
              <div class="kanban-card-title">${escapeHtml(item.fornecedor)}</div>
              <div style="font-size: 0.75rem; color: var(--neutral-600); line-height: 1.3;">
                ${escapeHtml(item.proximaAcao)}
              </div>
              <div class="kanban-card-meta">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-weight: 700;">👤</span>
                  <span>${escapeHtml(item.responsavel.split(' ')[0])}</span>
                </div>
                <span>⏳ ${item.diasParado}d atrás</span>
              </div>
            </div>
          `).join('')}
          ${etapaItems.length === 0 ? `
            <div style="padding: 1.5rem 0.5rem; text-align: center; color: var(--neutral-400); font-size: 0.78rem;">
              Nenhum processo nesta etapa
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openRivDetail(id);
    });
  });
}

// Render Alerts Center
function renderAlertsCenter() {
  const container = document.getElementById('view-alerts-grid');
  if (!container) return;

  const slaVencidos = suppliersData.filter(s => s.slaStatus === 'Atrasado');
  const parados = suppliersData.filter(s => s.diasParado >= 3 && s.status !== 'Concluído');
  const comPendencias = suppliersData.filter(s => s.pendencias?.some(p => !p.resolvida));
  const aguardandoAprovacao = suppliersData.filter(s => ['Aprovação Compras', 'Aprovação Financeira', 'Aprovação Global'].includes(s.status));

  container.innerHTML = `
    <!-- Categoria 1: SLA Vencido -->
    <div class="alert-category-card">
      <div class="alert-card-header" style="background: #fff1f2; border-bottom-color: #fecdd3;">
        <div class="alert-card-title" style="color: #9f1239;">
          <span>🚨 SLA Vencido / Em Atraso</span>
        </div>
        <span class="tab-badge danger">${slaVencidos.length}</span>
      </div>
      <div class="alert-item-list">
        ${slaVencidos.map(item => `
          <div class="alert-item-card critical" data-id="${item.id}">
            <div class="alert-item-header">
              <span class="riv-id-badge">${item.id}</span>
              <span class="sla-badge sla-atrasado">Atrasado</span>
            </div>
            <div class="alert-item-supplier">${escapeHtml(item.fornecedor)}</div>
            <div class="alert-item-desc"><strong>Próxima Ação:</strong> ${escapeHtml(item.proximaAcao)}</div>
            <div class="alert-item-footer">
              <span>👤 ${escapeHtml(item.responsavel)}</span>
              <span>Parado há ${item.diasParado} dias</span>
            </div>
          </div>
        `).join('')}
        ${slaVencidos.length === 0 ? '<div class="empty-state">Nenhum processo com SLA vencido! 🎉</div>' : ''}
      </div>
    </div>

    <!-- Categoria 2: Parado há mais de 3 dias -->
    <div class="alert-category-card">
      <div class="alert-card-header" style="background: #fffbeb; border-bottom-color: #fde68a;">
        <div class="alert-card-title" style="color: #92400e;">
          <span>⏳ Gargalos (Parados há ≥ 3 dias)</span>
        </div>
        <span class="tab-badge" style="background: #f59e0b; color: white;">${parados.length}</span>
      </div>
      <div class="alert-item-list">
        ${parados.map(item => `
          <div class="alert-item-card" data-id="${item.id}">
            <div class="alert-item-header">
              <span class="riv-id-badge">${item.id}</span>
              <span class="status-pill ${getStatusClass(item.status)}">${item.status}</span>
            </div>
            <div class="alert-item-supplier">${escapeHtml(item.fornecedor)}</div>
            <div class="alert-item-desc">Sem avanço no fluxo há <strong>${item.diasParado} dias</strong> seguidos.</div>
            <div class="alert-item-footer">
              <span>👤 ${escapeHtml(item.responsavel)}</span>
              <span>Área: ${escapeHtml(item.responsavelArea)}</span>
            </div>
          </div>
        `).join('')}
        ${parados.length === 0 ? '<div class="empty-state">Nenhum processo represado!</div>' : ''}
      </div>
    </div>

    <!-- Categoria 3: Pendências Documentais e Técnicas -->
    <div class="alert-category-card">
      <div class="alert-card-header" style="background: #f0fdf4; border-bottom-color: #bbf7d0;">
        <div class="alert-card-title" style="color: #166534;">
          <span>📑 Pendências Ativas no Cadastro</span>
        </div>
        <span class="tab-badge" style="background: #059669; color: white;">${comPendencias.length}</span>
      </div>
      <div class="alert-item-list">
        ${comPendencias.map(item => {
          const abertas = item.pendencias.filter(p => !p.resolvida);
          return `
            <div class="alert-item-card" data-id="${item.id}">
              <div class="alert-item-header">
                <span class="riv-id-badge">${item.id}</span>
                <span style="font-size: 0.72rem; font-weight: 700; color: #dc2626;">${abertas.length} pendência(s)</span>
              </div>
              <div class="alert-item-supplier">${escapeHtml(item.fornecedor)}</div>
              <div class="alert-item-desc">
                ${abertas.slice(0, 2).map(p => `• ${escapeHtml(p.texto)}`).join('<br>')}
              </div>
              <div class="alert-item-footer">
                <span>Status: ${item.status}</span>
                <span>${item.cnpj}</span>
              </div>
            </div>
          `;
        }).join('')}
        ${comPendencias.length === 0 ? '<div class="empty-state">Sem pendências registradas!</div>' : ''}
      </div>
    </div>

    <!-- Categoria 4: Aprovações Corporativas Pendentes -->
    <div class="alert-category-card">
      <div class="alert-card-header" style="background: #eff6ff; border-bottom-color: #bfdbfe;">
        <div class="alert-card-title" style="color: #1e40af;">
          <span>⚖️ Aprovações Executivas Pendentes</span>
        </div>
        <span class="tab-badge" style="background: #2563eb; color: white;">${aguardandoAprovacao.length}</span>
      </div>
      <div class="alert-item-list">
        ${aguardandoAprovacao.map(item => `
          <div class="alert-item-card" data-id="${item.id}">
            <div class="alert-item-header">
              <span class="riv-id-badge">${item.id}</span>
              <span class="status-pill ${getStatusClass(item.status)}">${item.status}</span>
            </div>
            <div class="alert-item-supplier">${escapeHtml(item.fornecedor)}</div>
            <div class="alert-item-desc"><strong>Próxima Ação:</strong> ${escapeHtml(item.proximaAcao)}</div>
            <div class="alert-item-footer">
              <span>👤 ${escapeHtml(item.responsavel)}</span>
              <span>Valor: ${item.valorEstimadoAnual || 'N/A'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.alert-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openRivDetail(id);
    });
  });
}

// Open RIV Detail Modal
export function openRivDetail(id) {
  const item = suppliersData.find(s => s.id === id);
  if (!item) return;

  selectedRiv = item;
  const modal = document.getElementById('modal-riv-detail');
  if (!modal) return;

  // Title & ID
  document.getElementById('modal-detail-riv-id').textContent = item.id;
  document.getElementById('modal-detail-supplier-title').textContent = item.fornecedor;
  document.getElementById('modal-detail-cnpj').textContent = item.cnpj;
  document.getElementById('modal-detail-categoria').textContent = item.categoria;
  document.getElementById('modal-detail-cidade').textContent = item.cidadeUf || 'São Paulo - SP';
  document.getElementById('modal-detail-valor').textContent = item.valorEstimadoAnual || 'Não informado';

  // Current Responsible & Next Action
  document.getElementById('modal-detail-responsavel').textContent = `${item.responsavel} (${item.responsavelCargo || item.responsavelArea})`;
  document.getElementById('modal-detail-email').textContent = item.responsavelEmail || 'email@empresa.com';
  document.getElementById('modal-detail-contato').textContent = `${item.contatoNome || 'Contato Comercial'} - ${item.contatoTelefone || ''} (${item.contatoEmail || ''})`;
  document.getElementById('modal-detail-proxima-acao').textContent = item.proximaAcao;

  // Status Badge
  const statusBadge = document.getElementById('modal-detail-status-badge');
  if (statusBadge) {
    statusBadge.className = `status-pill ${getStatusClass(item.status)}`;
    statusBadge.textContent = item.status;
  }

  // SLA Panel
  renderModalSla(item);

  // Stepper Visual Workflow
  renderModalStepper(item.status);

  // Pendências Checklist
  renderModalPendencias(item);

  // Auditoria Timeline
  renderModalTimeline(item);

  // Update Advance & Back Buttons
  updateModalActionButtons(item);

  modal.classList.add('open');
}

function renderModalStepper(currentStatus) {
  const stepperTrack = document.getElementById('modal-stepper-track');
  if (!stepperTrack) return;

  const currentIndex = ETAPAS_FLUXO.indexOf(currentStatus);

  stepperTrack.innerHTML = ETAPAS_FLUXO.map((etapa, idx) => {
    let stateClass = '';
    let iconContent = idx + 1;

    if (idx < currentIndex || currentStatus === 'Concluído') {
      stateClass = 'completed';
      iconContent = '✓';
    } else if (idx === currentIndex) {
      stateClass = 'current';
      iconContent = '●';
    }

    return `
      <div class="step-item ${stateClass}">
        <div class="step-circle">${iconContent}</div>
        <div class="step-label">${etapa}</div>
      </div>
    `;
  }).join('');
}

function renderModalSla(item) {
  const badge = document.getElementById('modal-detail-sla-badge');
  const textInfo = document.getElementById('modal-detail-sla-text');
  const barFill = document.getElementById('modal-detail-sla-bar-fill');

  if (badge) {
    badge.className = `sla-badge ${getSlaClass(item.slaStatus)}`;
    badge.innerHTML = `${getSlaIcon(item.slaStatus)} ${item.slaStatus}`;
  }

  const limite = item.slaLimiteHoras || 48;
  const decorrido = item.slaHorasDecorridas || 24;
  const restante = limite - decorrido;
  const percent = Math.min(100, Math.round((decorrido / limite) * 100));

  let fillClass = 'fill-green';
  if (percent > 75) fillClass = 'fill-yellow';
  if (item.slaStatus === 'Atrasado' || percent >= 100) fillClass = 'fill-red';

  if (barFill) {
    barFill.className = `sla-progress-bar-fill ${fillClass}`;
    barFill.style.width = `${percent}%`;
  }

  if (textInfo) {
    if (item.status === 'Concluído') {
      textInfo.innerHTML = `Homologação concluída com êxito em ${decorrido} horas úteis.`;
    } else if (item.slaStatus === 'Atrasado') {
      textInfo.innerHTML = `<span style="color: #dc2626; font-weight: 700;">SLA Ultrapassado em ${decorrido - limite} horas</span> (Limite: ${limite}h | Decorrido: ${decorrido}h | Parado há ${item.diasParado} dias).`;
    } else {
      textInfo.innerHTML = `<strong>${restante}h restantes</strong> de ${limite}h limite para esta etapa (Utilizado ${percent}% do prazo).`;
    }
  }
}

function renderModalPendencias(item) {
  const container = document.getElementById('modal-detail-pendencias-list');
  if (!container) return;

  if (!item.pendencias || item.pendencias.length === 0) {
    container.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--neutral-500); padding: 0.5rem 0;">
        Nenhuma pendência documental ou técnica no momento. Tudo em ordem! ✅
      </div>
    `;
    return;
  }

  container.innerHTML = item.pendencias.map(p => `
    <div class="pendencia-item ${p.resolvida ? 'resolvida' : ''}" data-p-id="${p.id}">
      <label class="pendencia-checkbox-label">
        <input type="checkbox" class="pendencia-toggle" ${p.resolvida ? 'checked' : ''} data-p-id="${p.id}" />
        <span class="pendencia-text">${escapeHtml(p.texto)}</span>
      </label>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pendencia-badge ${p.criticidade === 'Alta' ? 'badge-alta' : 'badge-media'}">${p.criticidade || 'Média'}</span>
        <button class="btn btn-sm btn-white" style="padding: 2px 6px; font-size: 0.7rem; color: #dc2626;" title="Remover pendência" onclick="window.supplierFlowApp.removePendencia('${p.id}')">✕</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.pendencia-toggle').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const pId = e.target.getAttribute('data-p-id');
      togglePendencia(pId, e.target.checked);
    });
  });
}

function togglePendencia(pId, resolvida) {
  if (!selectedRiv || !selectedRiv.pendencias) return;
  const p = selectedRiv.pendencias.find(item => item.id === pId);
  if (p) {
    p.resolvida = resolvida;
    selectedRiv.dataAtualizacao = new Date().toISOString().split('T')[0];

    // Add to history
    selectedRiv.historico.unshift({
      data: formatDateTimeNow(),
      autor: 'Usuário Conectado',
      acao: resolvida ? 'Pendência Marcada como Resolvida' : 'Pendência Reaberta',
      detalhe: `Item: "${p.texto}"`
    });

    saveData();
    renderAll();
    renderModalPendencias(selectedRiv);
    renderModalTimeline(selectedRiv);
    showToast(resolvida ? 'Pendência marcada como resolvida!' : 'Pendência reaberta.', 'success');
  }
}

export function addPendenciaPrompt() {
  if (!selectedRiv) return;
  const texto = prompt('Digite a descrição da nova pendência:');
  if (!texto || !texto.trim()) return;

  const criticidade = prompt('Criticidade (Alta, Média, Baixa):', 'Alta') || 'Alta';

  if (!selectedRiv.pendencias) selectedRiv.pendencias = [];
  const novaPendencia = {
    id: 'p-' + Date.now(),
    texto: texto.trim(),
    resolvida: false,
    criticidade: criticidade,
    dataCriacao: new Date().toISOString().split('T')[0]
  };

  selectedRiv.pendencias.push(novaPendencia);
  selectedRiv.dataAtualizacao = new Date().toISOString().split('T')[0];

  selectedRiv.historico.unshift({
    data: formatDateTimeNow(),
    autor: 'Usuário Conectado',
    acao: 'Nova Pendência Apontada',
    detalhe: `[${criticidade}] ${texto.trim()}`
  });

  saveData();
  renderAll();
  renderModalPendencias(selectedRiv);
  renderModalTimeline(selectedRiv);
  showToast('Pendência adicionada com sucesso!', 'warning');
}

export function removePendencia(pId) {
  if (!selectedRiv || !selectedRiv.pendencias) return;
  selectedRiv.pendencias = selectedRiv.pendencias.filter(p => p.id !== pId);
  saveData();
  renderAll();
  renderModalPendencias(selectedRiv);
  showToast('Pendência removida.', 'success');
}

function renderModalTimeline(item) {
  const container = document.getElementById('modal-detail-timeline');
  if (!container) return;

  if (!item.historico || item.historico.length === 0) {
    container.innerHTML = '<div style="font-size: 0.8rem; color: var(--neutral-400);">Nenhum histórico gravado.</div>';
    return;
  }

  container.innerHTML = item.historico.map(h => `
    <div class="timeline-event">
      <div class="timeline-meta">${h.data} • <strong>${escapeHtml(h.autor)}</strong></div>
      <div class="timeline-title">${escapeHtml(h.acao)}</div>
      <div class="timeline-desc">${escapeHtml(h.detalhe)}</div>
    </div>
  `).join('');
}

export function addAuditCommentPrompt() {
  if (!selectedRiv) return;
  const comentario = prompt('Insira uma observação para registro no histórico de auditoria:');
  if (!comentario || !comentario.trim()) return;

  selectedRiv.historico.unshift({
    data: formatDateTimeNow(),
    autor: 'Usuário Executivo',
    acao: 'Observação Registrada',
    detalhe: comentario.trim()
  });
  selectedRiv.dataAtualizacao = new Date().toISOString().split('T')[0];

  saveData();
  renderAll();
  renderModalTimeline(selectedRiv);
  showToast('Observação adicionada ao histórico de auditoria!', 'success');
}

function updateModalActionButtons(item) {
  const btnAdvance = document.getElementById('btn-modal-advance-stage');
  const btnBack = document.getElementById('btn-modal-back-stage');
  const currentIdx = ETAPAS_FLUXO.indexOf(item.status);

  if (btnAdvance) {
    if (currentIdx === ETAPAS_FLUXO.length - 1) {
      btnAdvance.textContent = 'Processo Concluído ✅';
      btnAdvance.disabled = true;
      btnAdvance.style.opacity = '0.6';
    } else {
      const nextEtapa = ETAPAS_FLUXO[currentIdx + 1];
      btnAdvance.textContent = `Avançar para ${nextEtapa} ➔`;
      btnAdvance.disabled = false;
      btnAdvance.style.opacity = '1';
    }
  }

  if (btnBack) {
    if (currentIdx === 0) {
      btnBack.style.display = 'none';
    } else {
      btnBack.style.display = 'inline-flex';
      const prevEtapa = ETAPAS_FLUXO[currentIdx - 1];
      btnBack.textContent = `⬅ Retornar para ${prevEtapa}`;
    }
  }
}

// Workflow Advance / Back
export function advanceCurrentRivStage() {
  if (!selectedRiv) return;
  const currentIdx = ETAPAS_FLUXO.indexOf(selectedRiv.status);
  if (currentIdx >= ETAPAS_FLUXO.length - 1) {
    showToast('Processo já se encontra concluído.', 'info');
    return;
  }

  // Check unresolved high priority pendencias
  const hasHighPending = selectedRiv.pendencias?.some(p => !p.resolvida && p.criticidade === 'Alta');
  if (hasHighPending) {
    const prosseguir = confirm('Atenção: Existem pendências de ALTA criticidade não resolvidas. Deseja prosseguir com o avanço mesmo assim?');
    if (!prosseguir) return;
  }

  const nextStage = ETAPAS_FLUXO[currentIdx + 1];
  const oldStage = selectedRiv.status;
  selectedRiv.status = nextStage;
  selectedRiv.diasParado = 0;
  selectedRiv.slaHorasDecorridas = 0;
  selectedRiv.slaStatus = nextStage === 'Concluído' ? 'Concluído' : 'No prazo';
  selectedRiv.dataAtualizacao = new Date().toISOString().split('T')[0];

  // Update responsible according to stage
  assignStageResponsible(selectedRiv, nextStage);

  // Add history event
  selectedRiv.historico.unshift({
    data: formatDateTimeNow(),
    autor: 'Aprovador do Processo',
    acao: `Etapa Avançada: de "${oldStage}" para "${nextStage}"`,
    detalhe: `Processo migrado para a fila de ${selectedRiv.responsavelArea} (${selectedRiv.responsavel}).`
  });

  saveData();
  renderAll();
  openRivDetail(selectedRiv.id);
  showToast(`Processo avançado com sucesso para "${nextStage}"!`, 'success');
}

export function returnCurrentRivStage() {
  if (!selectedRiv) return;
  const currentIdx = ETAPAS_FLUXO.indexOf(selectedRiv.status);
  if (currentIdx <= 0) return;

  const motivo = prompt(`Informe o motivo do retorno da etapa para ${ETAPAS_FLUXO[currentIdx - 1]}:`, 'Ajuste documental ou comercial solicitado');
  if (!motivo) return;

  const prevStage = ETAPAS_FLUXO[currentIdx - 1];
  const oldStage = selectedRiv.status;
  selectedRiv.status = prevStage;
  selectedRiv.diasParado = 0;
  selectedRiv.slaHorasDecorridas = 0;
  selectedRiv.slaStatus = 'Em risco';
  selectedRiv.dataAtualizacao = new Date().toISOString().split('T')[0];

  assignStageResponsible(selectedRiv, prevStage);

  selectedRiv.historico.unshift({
    data: formatDateTimeNow(),
    autor: 'Aprovador do Processo',
    acao: `Retorno de Etapa: de "${oldStage}" para "${prevStage}"`,
    detalhe: `Motivo: ${motivo}`
  });

  saveData();
  renderAll();
  openRivDetail(selectedRiv.id);
  showToast(`Processo retornado para "${prevStage}".`, 'warning');
}

function assignStageResponsible(item, stage) {
  if (stage === 'Cadastro iniciado') {
    item.responsavel = 'Equipe de Triagem';
    item.responsavelArea = 'Cadastro & Triagem';
    item.proximaAcao = 'Triagem inicial de documentos e envio de credenciais';
  } else if (stage === 'Validação documental') {
    item.responsavel = 'Mariana Silveira';
    item.responsavelArea = 'Compliance & Documental';
    item.proximaAcao = 'Conferência de certidões negativas (CNDs) e contrato social';
  } else if (stage === 'Aprovação Compras') {
    item.responsavel = 'Carlos Eduardo Rocha';
    item.responsavelArea = 'Compras / Suprimentos';
    item.proximaAcao = 'Validação técnica da proposta, capacidade de fornecimento e preços';
  } else if (stage === 'Aprovação Financeira') {
    item.responsavel = 'Fernando Diniz';
    item.responsavelArea = 'Controladoria & Financeiro';
    item.proximaAcao = 'Análise de crédito, balanço patrimonial e dados bancários';
  } else if (stage === 'Aprovação Global') {
    item.responsavel = 'Juliana Paes Fontes';
    item.responsavelArea = 'Diretoria Global de Suprimentos';
    item.proximaAcao = 'Homologação corporativa global e criação de código SAP';
  } else if (stage === 'Concluído') {
    item.responsavel = 'Juliana Paes Fontes';
    item.proximaAcao = 'Fornecedor homologado e habilitado no catálogo de compras';
  }
}

// Modal Form (Create / Edit RIV)
export function openRivFormModal(isEdit = false) {
  const modal = document.getElementById('modal-riv-form');
  const title = document.getElementById('modal-form-title');
  if (!modal) return;

  if (isEdit && selectedRiv) {
    title.textContent = `Editar RIV: ${selectedRiv.id}`;
    document.getElementById('form-riv-id').value = selectedRiv.id;
    document.getElementById('form-razao-social').value = selectedRiv.fornecedor;
    document.getElementById('form-cnpj').value = selectedRiv.cnpj;
    document.getElementById('form-categoria').value = selectedRiv.categoria;
    document.getElementById('form-status').value = selectedRiv.status;
    document.getElementById('form-responsavel').value = selectedRiv.responsavel;
    document.getElementById('form-area').value = selectedRiv.responsavelArea;
    document.getElementById('form-proxima-acao').value = selectedRiv.proximaAcao;
    document.getElementById('form-valor').value = selectedRiv.valorEstimadoAnual || '';
    document.getElementById('form-contato-nome').value = selectedRiv.contatoNome || '';
    document.getElementById('form-contato-email').value = selectedRiv.contatoEmail || '';
    document.getElementById('form-contato-tel').value = selectedRiv.contatoTelefone || '';
  } else {
    title.textContent = 'Novo Cadastro de Fornecedor (+ Nova RIV)';
    document.getElementById('form-riv-id').value = '';
    document.getElementById('form-razao-social').value = '';
    document.getElementById('form-cnpj').value = '';
    document.getElementById('form-categoria').value = 'Serviços Gerais';
    document.getElementById('form-status').value = 'Cadastro iniciado';
    document.getElementById('form-responsavel').value = 'Equipe de Triagem';
    document.getElementById('form-area').value = 'Cadastro & Triagem';
    document.getElementById('form-proxima-acao').value = 'Triagem cadastral e envio de checklist ao fornecedor';
    document.getElementById('form-valor').value = '';
    document.getElementById('form-contato-nome').value = '';
    document.getElementById('form-contato-email').value = '';
    document.getElementById('form-contato-tel').value = '';
  }

  modal.classList.add('open');
}

export function saveRivForm(e) {
  if (e) e.preventDefault();
  const id = document.getElementById('form-riv-id').value;
  const razaoSocial = document.getElementById('form-razao-social').value.trim();
  const cnpj = document.getElementById('form-cnpj').value.trim();
  const categoria = document.getElementById('form-categoria').value.trim();
  const status = document.getElementById('form-status').value;
  const responsavel = document.getElementById('form-responsavel').value.trim();
  const area = document.getElementById('form-area').value.trim();
  const proximaAcao = document.getElementById('form-proxima-acao').value.trim();
  const valor = document.getElementById('form-valor').value.trim();
  const contatoNome = document.getElementById('form-contato-nome').value.trim();
  const contatoEmail = document.getElementById('form-contato-email').value.trim();
  const contatoTel = document.getElementById('form-contato-tel').value.trim();

  if (!razaoSocial || !cnpj) {
    showToast('Preencha os campos obrigatórios (Razão Social e CNPJ)!', 'danger');
    return;
  }

  if (id) {
    // Edit existing
    const item = suppliersData.find(s => s.id === id);
    if (item) {
      item.fornecedor = razaoSocial;
      item.cnpj = cnpj;
      item.categoria = categoria;
      item.status = status;
      item.responsavel = responsavel;
      item.responsavelArea = area;
      item.proximaAcao = proximaAcao;
      item.valorEstimadoAnual = valor || item.valorEstimadoAnual;
      item.contatoNome = contatoNome;
      item.contatoEmail = contatoEmail;
      item.contatoTelefone = contatoTel;
      item.dataAtualizacao = new Date().toISOString().split('T')[0];

      item.historico.unshift({
        data: formatDateTimeNow(),
        autor: 'Usuário Conectado',
        acao: 'Edição de Dados Cadastrais',
        detalhe: 'Dados da RIV atualizados via formulário.'
      });

      saveData();
      renderAll();
      openRivDetail(item.id);
      showToast('RIV atualizada com sucesso!', 'success');
    }
  } else {
    // Create New RIV
    const nextNum = suppliersData.length + 42;
    const newId = `RIV-2026-00${nextNum}`;
    const newItem = {
      id: newId,
      fornecedor: razaoSocial,
      cnpj: cnpj,
      categoria: categoria,
      status: status,
      responsavel: responsavel || 'Equipe de Triagem',
      responsavelArea: area || 'Cadastro & Triagem',
      responsavelEmail: 'triagem@empresa.com',
      proximaAcao: proximaAcao || 'Aguardando validação inicial',
      slaStatus: 'No prazo',
      slaLimiteHoras: 48,
      slaHorasDecorridas: 2,
      diasParado: 0,
      dataCriacao: new Date().toISOString().split('T')[0],
      dataAtualizacao: new Date().toISOString().split('T')[0],
      valorEstimadoAnual: valor || 'A definir',
      contatoNome: contatoNome,
      contatoEmail: contatoEmail,
      contatoTelefone: contatoTel,
      pendencias: [],
      historico: [
        {
          data: formatDateTimeNow(),
          autor: 'Usuário Conectado',
          acao: 'Cadastro Criado',
          detalhe: 'Nova RIV cadastrada manualmente no sistema de homologação.'
        }
      ]
    };

    suppliersData.unshift(newItem);
    saveData();
    renderAll();
    showToast(`Nova RIV ${newId} criada com sucesso!`, 'success');
  }

  closeAllModals();
}

// Close Modals
export function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('open');
  });
}

// Export to CSV
export function exportToCsv() {
  const filtered = getFilteredSuppliers();
  if (filtered.length === 0) {
    showToast('Não há dados para exportar com os filtros atuais.', 'warning');
    return;
  }

  const headers = ['RIV', 'Fornecedor', 'CNPJ', 'Categoria', 'Status', 'Responsavel', 'Area', 'Proxima Acao', 'SLA', 'Dias Parado', 'Criacao', 'Ultima Atualizacao', 'Valor Anual'];
  const rows = filtered.map(item => [
    `"${item.id}"`,
    `"${item.fornecedor.replace(/"/g, '""')}"`,
    `"${item.cnpj}"`,
    `"${item.categoria.replace(/"/g, '""')}"`,
    `"${item.status}"`,
    `"${item.responsavel.replace(/"/g, '""')}"`,
    `"${item.responsavelArea.replace(/"/g, '""')}"`,
    `"${item.proximaAcao.replace(/"/g, '""')}"`,
    `"${item.slaStatus}"`,
    item.diasParado,
    item.dataCriacao,
    item.dataAtualizacao,
    `"${item.valorEstimadoAnual || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_fornecedores_riv_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Relatório CSV exportado com sucesso!', 'success');
}

// Filter Actions
function clearFilters() {
  activeFilter = {
    search: '',
    status: 'ALL',
    area: 'ALL',
    sla: 'ALL',
    kpi: 'ALL',
    chipMode: 'ALL',
    onlyAlerts: false
  };

  const searchInp = document.getElementById('search-riv-input');
  const selectStatus = document.getElementById('filter-select-status');
  const selectSla = document.getElementById('filter-select-sla');

  if (searchInp) searchInp.value = '';
  if (selectStatus) selectStatus.value = 'ALL';
  if (selectSla) selectSla.value = 'ALL';

  renderAll();
  showToast('Filtros redefinidos.', 'info');
}

// Global Event Listeners
function bindGlobalEvents() {
  // View Switcher Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeView = btn.getAttribute('data-view');
      renderAll();
    });
  });

  // KPI card clicks
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      const kpi = card.getAttribute('data-kpi');
      if (activeFilter.kpi === kpi) {
        activeFilter.kpi = 'ALL'; // toggle off
      } else {
        activeFilter.kpi = kpi;
        if (activeView !== 'table') {
          activeView = 'table';
        }
      }
      renderAll();
    });
  });

  // Search input
  const searchInp = document.getElementById('search-riv-input');
  if (searchInp) {
    searchInp.addEventListener('input', (e) => {
      activeFilter.search = e.target.value.trim();
      renderAll();
    });
  }

  // Filter selects
  const selectStatus = document.getElementById('filter-select-status');
  if (selectStatus) {
    selectStatus.addEventListener('change', (e) => {
      activeFilter.status = e.target.value;
      renderAll();
    });
  }

  const selectSla = document.getElementById('filter-select-sla');
  if (selectSla) {
    selectSla.addEventListener('change', (e) => {
      activeFilter.sla = e.target.value;
      renderAll();
    });
  }

  // Quick Chip click delegation
  const chipsContainer = document.getElementById('filter-chips');
  if (chipsContainer) {
    chipsContainer.addEventListener('click', (e) => {
      const chipBtn = e.target.closest('.filter-chip');
      if (!chipBtn) return;
      const chipId = chipBtn.getAttribute('data-chip');
      activeFilter.chipMode = chipId;

      if (chipId === 'ALL') {
        clearFilters();
      } else if (chipId === 'ATRASADOS') {
        activeFilter.sla = 'Atrasado';
        activeFilter.status = 'ALL';
        activeFilter.kpi = 'ALL';
        renderAll();
      } else if (chipId === 'PENDENCIAS') {
        activeFilter.onlyAlerts = true;
        renderAll();
      } else if (chipId === 'PARADOS') {
        activeFilter.search = '';
        activeFilter.kpi = 'ALL';
        // will show stalled
        activeFilter.onlyAlerts = true;
        renderAll();
      } else if (chipId === 'CONCLUIDOS') {
        activeFilter.status = 'Concluído';
        activeFilter.kpi = 'ALL';
        renderAll();
      }
    });
  }

  // Modal Backdrop Click to close
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Global Action Buttons
  document.getElementById('btn-new-riv')?.addEventListener('click', () => openRivFormModal(false));
  document.getElementById('btn-export-csv')?.addEventListener('click', exportToCsv);
  document.getElementById('btn-reset-demo')?.addEventListener('click', resetToDemoData);

  // Modal Detail action buttons
  document.getElementById('btn-modal-advance-stage')?.addEventListener('click', advanceCurrentRivStage);
  document.getElementById('btn-modal-back-stage')?.addEventListener('click', returnCurrentRivStage);
  document.getElementById('btn-modal-edit-riv')?.addEventListener('click', () => {
    closeAllModals();
    openRivFormModal(true);
  });
  document.getElementById('btn-modal-add-pendencia')?.addEventListener('click', addPendenciaPrompt);
  document.getElementById('btn-modal-add-audit')?.addEventListener('click', addAuditCommentPrompt);

  // Form submit
  document.getElementById('form-riv')?.addEventListener('submit', saveRivForm);
}

// Helpers
function getStatusClass(status) {
  switch (status) {
    case 'Cadastro iniciado': return 'status-iniciado';
    case 'Validação documental': return 'status-validacao';
    case 'Aprovação Compras': return 'status-compras';
    case 'Aprovação Financeira': return 'status-financeiro';
    case 'Aprovação Global': return 'status-global';
    case 'Concluído': return 'status-concluido';
    default: return 'status-iniciado';
  }
}

function getSlaClass(sla) {
  switch (sla) {
    case 'No prazo': return 'sla-no-prazo';
    case 'Em risco': return 'sla-em-risco';
    case 'Atrasado': return 'sla-atrasado';
    case 'Concluído': return 'sla-concluido';
    default: return 'sla-no-prazo';
  }
}

function getSlaIcon(sla) {
  switch (sla) {
    case 'No prazo': return '🟢';
    case 'Em risco': return '🟡';
    case 'Atrasado': return '🔴';
    case 'Concluído': return '✅';
    default: return '⚪';
  }
}

function formatSlaTimeRemaining(item) {
  if (item.status === 'Concluído') return 'Concluído';
  const limite = item.slaLimiteHoras || 48;
  const decorrido = item.slaHorasDecorridas || 24;
  const restante = limite - decorrido;
  if (restante < 0) {
    return `<span style="color: #dc2626; font-weight: 700;">+${Math.abs(restante)}h de atraso</span>`;
  }
  return `Restam ${restante}h`;
}

function formatDate(dStr) {
  if (!dStr) return '-';
  const parts = dStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dStr;
}

function formatDateTimeNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Expose to window for inline onclick handlers if needed
if (typeof window !== 'undefined') {
  window.supplierFlowApp = {
    initApp,
    openRivDetail,
    openRivFormModal,
    closeAllModals,
    exportToCsv,
    resetToDemoData,
    advanceCurrentRivStage,
    returnCurrentRivStage,
    addPendenciaPrompt,
    removePendencia,
    addAuditCommentPrompt,
    saveRivForm
  };
}
