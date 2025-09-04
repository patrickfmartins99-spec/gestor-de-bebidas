// --- SISTEMA DE ESTADO CENTRALIZADO ---
const AppState = {
  bebidas: [],
  historicoContagens: [],
  ultimaContagem: null,
  
  init() {
    this.bebidas = this.getBebidas();
    this.historicoContagens = this.getHistoricoContagensBebidas();
    this.ultimaContagem = this.getUltimaContagemBebidas();
    
    // Verificar se já inicializou as bebidas padrão
    if (this.bebidas.length === 0) {
      this.inicializarBebidasPadrao();
    }
  },
  
  inicializarBebidasPadrao() {
    const bebidasPadrao = [
      // Refrigerantes Pet (Fardos de 6)
      { id: 'bebida-fruki', nome: 'Fruki 1,5L', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Refrigerantes Pet' },

      // Refrigerantes Lata (Fardos de 12)
      { id: 'bebida-cocacola', nome: 'Coca-Cola Lata', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-cocacolazero', nome: 'Coca-Cola Zero Lata', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-pepsi', nome: 'Pepsi Lata', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-pepsiblack', nome: 'Pepsi Black', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-guarana', nome: 'Guaraná Antarctica', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-guaranazero', nome: 'Guaraná Antarctica Zero', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-soda', nome: 'Soda Limonada', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-sukita', nome: 'Sukita Laranja', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-h2o', nome: 'H2O Limão', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },
      { id: 'bebida-aguatonica', nome: 'Água Tônica', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Refrigerantes Lata' },

      // Águas (Fardos de 12)
      { id: 'bebida-aguacomgas', nome: 'Água com Gás 500ml', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Águas' },
      { id: 'bebida-aguasemgas', nome: 'Água sem Gás 500ml', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Águas' },
      
      // Cervejas 600ml (Caixas de 24)
      { id: 'bebida-bud600', nome: 'Budweiser 600ml', unidade: 'caixa', unidadePorFardo: 24, categoria: 'Cervejas 600ml' },
      { id: 'bebida-orig600', nome: 'Original 600ml', unidade: 'caixa', unidadePorFardo: 24, categoria: 'Cervejas 600ml' },
      { id: 'bebida-heineken600', nome: 'Heineken 600ml', unidade: 'caixa', unidadePorFardo: 24, categoria: 'Cervejas 600ml' },
      
      // Cervejas Long Neck (Fardos de 6)
      { id: 'bebida-stella', nome: 'Stella Artois', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
      { id: 'bebida-budlong', nome: 'Budweiser Long Neck', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
      { id: 'bebida-heinekenzero', nome: 'Heineken Zero Álcool', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
      { id: 'bebida-heinekenlong', nome: 'Heineken', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
      
      // Vinhos e Espumantes (Unidades)
      { id: 'bebida-brut', nome: 'Brut', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-demiseco', nome: 'Brut Demiseco', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-rose', nome: 'Brut Rosé', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-moscatel', nome: 'Moscatel', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-merlot', nome: 'Concha y Toro Merlot', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-marcuscab', nome: 'Marcus James Cabernet Sauvignon', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-marcusmer', nome: 'Marcus James Merlot', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-country', nome: 'Country Wine Suave', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-branco-seco', nome: 'Vinho Branco Seco', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-branco-suave', nome: 'Vinho Branco Suave', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-tinto-suave', nome: 'Vinho Tinto Suave (Garrafão)', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },
      { id: 'bebida-tinto-seco', nome: 'Vinho Tinto Seco (Garrafão)', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Espumantes e Vinhos' },

      // Destilados (Unidades)
      { id: 'bebida-baly', nome: 'Energético Baly', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-bacardi', nome: 'Bacardi', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-vodka', nome: 'Vodka', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-gin', nome: 'Gin', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-licor', nome: 'Licor de Pêssego', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-groselha', nome: 'Xarope de Groselha', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-cachaca', nome: 'Cachaça Velho Barreiro', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
      { id: 'bebida-maracuja-maguary', nome: 'Suco Concentrado de Maracujá Maguary', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
    ];
    
    this.saveBebidas(bebidasPadrao);
    this.bebidas = bebidasPadrao;
  },
  
  // --- FUNÇÕES DE ARMAZENAMENTO (LOCAL STORAGE) ---
  getBebidas() {
    const bebidas = localStorage.getItem('bebidas');
    return bebidas ? JSON.parse(bebidas) : [];
  },

  saveBebidas(bebidas) {
    localStorage.setItem('bebidas', JSON.stringify(bebidas));
    this.bebidas = bebidas;
  },

  getUltimaContagemBebidas() {
    const contagem = localStorage.getItem('ultimaContagemBebidas');
    return contagem ? JSON.parse(contagem) : null;
  },

  setUltimaContagemBebidas(contagem) {
    localStorage.setItem('ultimaContagemBebidas', JSON.stringify(contagem));
    this.ultimaContagem = contagem;
  },

  getHistoricoContagensBebidas() {
    const historico = localStorage.getItem('historicoContagensBebidas');
    return historico ? JSON.parse(historico) : [];
  },

  saveHistoricoContagensBebidas(contagem) {
    const historico = this.getHistoricoContagensBebidas();
    historico.push(contagem);
    localStorage.setItem('historicoContagensBebidas', JSON.stringify(historico));
    this.historicoContagens = historico;
  },

  deleteContagemBebidas(id) {
    let historico = this.getHistoricoContagensBebidas();
    const novoHistorico = historico.filter(contagem => contagem.id !== id);
    localStorage.setItem('historicoContagensBebidas', JSON.stringify(novoHistorico));
    this.historicoContagens = novoHistorico;
  }
};

// Inicializar o estado quando o script carregar
if (!window.AppStateInitialized) {
  AppState.init();
  window.AppStateInitialized = true;
}

// --- SISTEMA DE NOTIFICAÇÕES ---
function showNotification(message, type = 'info') {
  // Remove notificação existente
  const existingAlert = document.getElementById('app-notification');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Cria nova notificação
  const alertDiv = document.createElement('div');
  alertDiv.id = 'app-notification';
  alertDiv.className = `alert alert-${type} alert-dismissible fade show app-notification`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// --- FUNÇÕES DE LÓGICA DE NEGÓCIO ---

const calcularGastoEstimado = (estoqueAtual, ultimoEstoque) => {
  if (estoqueAtual < ultimoEstoque) {
    return ultimoEstoque - estoqueAtual;
  }
  return 0;
};

const calcularReposicaoEstimada = (estoqueAtual, ultimoEstoque) => {
  if (estoqueAtual > ultimoEstoque) {
    return estoqueAtual - ultimoEstoque;
  }
  return 0;
};

const calcularSugestaoDeCompra = (gastoSemanal) => {
  return gastoSemanal > 0 ? Math.ceil(gastoSemanal * 1.2) : 0;
};

// CORREÇÃO: Função isDomingo com formato de data correto
const isDomingo = (dataString) => {
  // Converter data no formato YYYY-MM-DD para objeto Date
  const [year, month, day] = dataString.split('-');
  const dateObj = new Date(year, month - 1, day);
  return dateObj.getDay() === 0; // 0 = Domingo
};

const calcularEstatisticas = () => {
  const historico = AppState.getHistoricoContagensBebidas();
  const ultimaContagem = historico[historico.length - 1];
  const penultimaContagem = historico[historico.length - 2];

  const estatisticas = {};

  if (ultimaContagem && penultimaContagem) {
    const bebidas = AppState.getBebidas();
    bebidas.forEach(bebida => {
      const totalUltimo = ultimaContagem.detalhesContagem[bebida.id]?.totalUnidades || 0;
      const totalPenultimo = penultimaContagem.detalhesContagem[bebida.id]?.totalUnidades || 0;
      
      const gasto = calcularGastoEstimado(totalUltimo, totalPenultimo);
      const reposicao = calcularReposicaoEstimada(totalUltimo, totalPenultimo);
      const sugestao = calcularSugestaoDeCompra(gasto);

      estatisticas[bebida.id] = {
        gasto,
        reposicao,
        sugestao
      };
    });
  }
  return estatisticas;
};

// --- FUNÇÕES AUXILIARES DE RELATÓRIO ---
const gerarRelatorioPDFBebidas = (contagem, filenamePrefix) => {
  const bebidas = AppState.getBebidas();
  const dadosEmpresa = {
    nome: "La Giovana's Pizzaria",
    titulo: "Relatório de Contagem de Bebidas"
  };
  
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (!contagem || !contagem.detalhesContagem || Object.keys(contagem.detalhesContagem).length === 0) {
    showNotification('Não há dados de contagem para gerar o relatório.', 'warning');
    return;
  }

  const stats = calcularEstatisticas();
  const ehDomingo = isDomingo(contagem.data);

  let tabelaContagemRows = '';
  let tabelaEstatisticasRows = '';
  let hasStats = Object.keys(stats).length > 0;

  bebidas.forEach(bebida => {
    const dados = contagem.detalhesContagem[bebida.id] || {};
    const totalUnidades = dados.totalUnidades || 0;
    const statsBebida = stats[bebida.id] || {};
    
    let depositoTexto = '';
    if (bebida.unidade === 'caixa' || bebida.unidade === 'fardo') {
      depositoTexto = `${dados.deposito || 0} ${bebida.unidade}s e ${dados.unidadesAvulsas || 0} unidades`;
    } else {
      depositoTexto = `${dados.deposito || 0} unidades`;
    }

    // Tabela Principal de Contagem
    tabelaContagemRows += `
      <tr>
        <td style="padding: 10px; border: 1px solid #000;">${bebida.nome}</td>
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">${depositoTexto}</td>
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.freezer || 0}</td>
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">${totalUnidades}</td>
      </tr>
    `;

    // Tabela de Estatísticas (se houver dados)
    if (hasStats) {
      tabelaEstatisticasRows += `
        <tr>
          <td style="padding: 10px; border: 1px solid #000;">${bebida.nome}</td>
          <td style="padding: 10px; border: 1px solid #000; text-align: center;">${statsBebida.gasto !== undefined ? statsBebida.gasto : 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #000; text-align: center;">${statsBebida.reposicao !== undefined ? statsBebida.reposicao : 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #000; text-align: center;">${ehDomingo && statsBebida.sugestao !== undefined ? statsBebida.sugestao : 'N/A'}</td>
        </tr>
      `;
    }
  });
  
  let conteudoTabelaEstatisticas = '';
  if (hasStats) {
    conteudoTabelaEstatisticas = `
      <div style="margin-top: 30px;">
        <h2 style="text-align: center; margin-bottom: 15px; font-size: 20px;">Estatísticas de Consumo e Reposição</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
          <thead>
            <tr style="background-color: #333; color: white;">
              <th style="padding: 12px; border: 1px solid #000; text-align: left;">BEBIDA</th>
              <th style="padding: 12px; border: 1px solid #000; text-align: center;">CONSUMO (UNIDADES)</th>
              <th style="padding: 12px; border: 1px solid #000; text-align: center;">REPOSIÇÃO (UNIDADES)</th>
              ${ehDomingo ? '<th style="padding: 12px; border: 1px solid #000; text-align: center;">SUGESTÃO DE COMPRA (UNIDADES)</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${tabelaEstatisticasRows}
          </tbody>
        </table>
      </div>
    `;
  }

  const conteudoRelatorio = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #000;">
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; color: #000; font-size: 24px;">${dadosEmpresa.nome}</h1>
        <p style="margin: 5px 0; font-size: 18px; color: #000;">${dadosEmpresa.titulo}</p>
      </div>
      
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #000; border-radius: 8px;">
        <p style="margin: 5px 0; font-size: 16px;"><strong>Responsável:</strong> ${contagem.responsavel}</p>
        <p style="margin: 5px 0; font-size: 16px;"><strong>Data da contagem:</strong> ${contagem.data}</p>
        <p style="margin: 5px 0; font-size: 14px; color: #333;">Nº do Registro: ${contagem.id}</p>
      </div>
      
      <h2 style="text-align: center; margin-bottom: 15px; font-size: 20px;">Relatório de Contagem</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
        <thead>
          <tr style="background-color: #333; color: white;">
            <th style="padding: 12px; border: 1px solid #000; text-align: left;">BEBIDA</th>
            <th style="padding: 12px; border: 1px solid #000; text-align: center;">DEPÓSITO</th>
            <th style="padding: 12px; border: 1px solid #000; text-align: center;">FREEZER (UNIDADES)</th>
            <th style="padding: 12px; border: 1px solid #000; text-align: center;">TOTAL EM ESTOQUE (UNIDADES)</th>
          </tr>
        </thead>
        <tbody>
          ${tabelaContagemRows}
        </tbody>
      </table>
      
      ${conteudoTabelaEstatisticas}

      <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #6c757d;">
        Documento gerado em ${dataAtual} às ${horaAtual}.
      </div>
    </div>
  `;

  const orientation = ehDomingo && hasStats ? 'landscape' : 'portrait';
  const options = {
    margin: 0.5,
    filename: `${filenamePrefix}_${contagem.data}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: orientation }
  };

  // Adicionar indicador de carregamento
  showNotification('Gerando relatório PDF...', 'info');
  
  html2pdf().set(options).from(conteudoRelatorio).save().then(() => {
    showNotification('Relatório gerado com sucesso!', 'success');
  });
};

// --- LÓGICA PARA A TELA DE CONTAGEM (index.html) ---
const setupContagemPage = () => {
  const formContagemBebidas = document.getElementById('formContagemBebidas');
  const listaBebidasContainer = document.getElementById('listaBebidas');

  // Função para renderizar a lista de bebidas no formulário de contagem
  const renderizarListaBebidas = () => {
    const bebidas = AppState.getBebidas();
    
    // Usar documentFragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    if (bebidas.length === 0) {
      listaBebidasContainer.innerHTML = `<p class="text-center text-muted">Nenhuma bebida cadastrada. Vá para a tela "Gerenciar" para adicionar novas bebidas.</p>`;
      return;
    }

    bebidas.forEach(bebida => {
      const bebidaItem = document.createElement('div');
      bebidaItem.classList.add('bebida-item', 'p-3', 'mb-3', 'fade-in');
      bebidaItem.dataset.id = bebida.id;

      const bebidaNome = document.createElement('h5');
      bebidaNome.classList.add('bebida-nome', 'mb-3');
      bebidaNome.textContent = bebida.nome;
      bebidaItem.appendChild(bebidaNome);

      // Campos para contagem
      const formRow = document.createElement('div');
      formRow.classList.add('row', 'g-3');

      // Campo de depósito
      const depositoCol = document.createElement('div');
      depositoCol.classList.add('col-md-6');
      depositoCol.innerHTML = `
        <label for="deposito-${bebida.id}" class="form-label">Depósito (${bebida.unidade === 'unidade' ? 'unidades' : bebida.unidade + 's'})</label>
        <input type="number" class="form-control" id="deposito-${bebida.id}" value="0" min="0" data-id="${bebida.id}">
        <div class="invalid-feedback">Valor não pode ser negativo</div>
      `;
      formRow.appendChild(depositoCol);

      // Se for fardo ou caixa, adiciona o campo de unidades avulsas
      if (bebida.unidade !== 'unidade') {
        const avulsoCol = document.createElement('div');
        avulsoCol.classList.add('col-md-6');
        avulsoCol.innerHTML = `
          <label for="unidades-avulsas-${bebida.id}" class="form-label">Unidades Avulsas</label>
          <input type="number" class="form-control" id="unidades-avulsas-${bebida.id}" value="0" min="0" data-id="${bebida.id}">
          <div class="invalid-feedback">Valor não pode ser negativo</div>
        `;
        formRow.appendChild(avulsoCol);
      }

      // Campo para freezer
      const freezerCol = document.createElement('div');
      freezerCol.classList.add('col-md-6');
      freezerCol.innerHTML = `
        <label for="freezer-${bebida.id}" class="form-label">Freezer (unidades)</label>
        <input type="number" class="form-control" id="freezer-${bebida.id}" value="0" min="0" data-id="${bebida.id}">
        <div class="invalid-feedback">Valor não pode ser negativo</div>
      `;
      formRow.appendChild(freezerCol);
      
      // Exibição do total em tempo real
      const totalCol = document.createElement('div');
      totalCol.classList.add('col-12', 'mt-3');
      totalCol.innerHTML = `
        <p class="fw-bold m-0">Total em Estoque: <span id="total-${bebida.id}" data-campo="total-unidades">0</span> unidades</p>
      `;
      formRow.appendChild(totalCol);

      bebidaItem.appendChild(formRow);
      fragment.appendChild(bebidaItem);
    });
    
    // Limpar container e adicionar tudo de uma vez
    listaBebidasContainer.innerHTML = '';
    listaBebidasContainer.appendChild(fragment);
    
    // Configurar event listeners para o cálculo em tempo real
    setupRealTimeCalculation();
  };

  // Configurar cálculo em tempo real
  const setupRealTimeCalculation = () => {
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const bebidaId = e.currentTarget.dataset.id;
        const bebida = AppState.getBebidas().find(b => b.id === bebidaId);
        if (!bebida) return;
        
        const depositoInput = document.getElementById(`deposito-${bebidaId}`);
        const unidadesAvulsasInput = document.getElementById(`unidades-avulsas-${bebidaId}`);
        const freezerInput = document.getElementById(`freezer-${bebidaId}`);
        const totalSpan = document.getElementById(`total-${bebidaId}`);
        
        const deposito = parseFloat(depositoInput.value) || 0;
        const unidadesAvulsas = parseFloat(unidadesAvulsasInput?.value) || 0;
        const freezer = parseFloat(freezerInput.value) || 0;
        
        // Validação em tempo real
        if (deposito < 0 || unidadesAvulsas < 0 || freezer < 0) {
          e.currentTarget.classList.add('is-invalid');
          return;
        } else {
          e.currentTarget.classList.remove('is-invalid');
        }
        
        const totalUnidades = (deposito * (bebida.unidadePorFardo || 1)) + unidadesAvulsas + freezer;
        totalSpan.textContent = totalUnidades;
      });
    });
  };

  // Função para salvar a contagem com validações
  const salvarContagemBebidas = (event) => {
    event.preventDefault();
    const responsavel = document.getElementById('responsavel').value;
    const dataContagem = document.getElementById('dataContagem').value;
    
    // Validações básicas
    if (!responsavel || !dataContagem) {
      showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }
    
    const bebidas = AppState.getBebidas();
    const detalhesContagem = {};
    let hasInvalidInput = false;

    bebidas.forEach(bebida => {
      const depositoInput = document.getElementById(`deposito-${bebida.id}`);
      const unidadesAvulsasInput = document.getElementById(`unidades-avulsas-${bebida.id}`);
      const freezerInput = document.getElementById(`freezer-${bebida.id}`);

      const deposito = parseFloat(depositoInput.value) || 0;
      const unidadesAvulsas = parseFloat(unidadesAvulsasInput?.value) || 0;
      const freezer = parseFloat(freezerInput.value) || 0;
      
      // Validação de valores negativos
      if (deposito < 0 || unidadesAvulsas < 0 || freezer < 0) {
        hasInvalidInput = true;
        depositoInput.classList.add('is-invalid');
        if (unidadesAvulsasInput) unidadesAvulsasInput.classList.add('is-invalid');
        freezerInput.classList.add('is-invalid');
        return;
      }
      
      // Calcula o total de unidades
      const totalUnidades = (deposito * bebida.unidadePorFardo) + unidadesAvulsas + freezer;

      detalhesContagem[bebida.id] = {
        deposito,
        unidadesAvulsas,
        freezer,
        totalUnidades
      };
    });

    if (hasInvalidInput) {
      showNotification('Valores de contagem não podem ser negativos. Por favor, corrija o formulário.', 'danger');
      return;
    }

    const novaContagem = {
      id: `contagem-bebidas-${Date.now()}`,
      responsavel,
      data: dataContagem,
      detalhesContagem
    };
    
    AppState.saveHistoricoContagensBebidas(novaContagem);
    AppState.setUltimaContagemBebidas(novaContagem);

    showNotification('Contagem salva com sucesso! O relatório será gerado.', 'success');
    formContagemBebidas.reset();
    gerarRelatorioPDFBebidas(novaContagem, `Relatorio_Contagem_Bebidas`);
    renderizarListaBebidas(); // Reseta a lista após salvar
  };

  // Inicializar a tela de contagem
  renderizarListaBebidas();
  formContagemBebidas.addEventListener('submit', salvarContagemBebidas);
};

// --- LÓGICA PARA A TELA DE ESTOQUE (bebidas-estoque.html) ---
const setupEstoquePage = () => {
  const tabelaEstoqueBebidasBody = document.getElementById('tabelaEstoqueBebidas');
  const btnGerarPdfEstoqueBebidas = document.getElementById('btnGerarPdfEstoqueBebidas');
  const semEstoqueBebidasText = document.getElementById('semEstoqueBebidas');

  const renderizarEstoqueBebidas = () => {
    const ultimaContagem = AppState.getUltimaContagemBebidas();
    const bebidas = AppState.getBebidas();
    
    // Usar documentFragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    if (!ultimaContagem || Object.keys(ultimaContagem.detalhesContagem).length === 0) {
      semEstoqueBebidasText.style.display = 'block';
      return;
    }
    semEstoqueBebidasText.style.display = 'none';

    bebidas.forEach(bebida => {
      const totalUnidades = ultimaContagem.detalhesContagem[bebida.id]?.totalUnidades || 0;
      
      const tr = document.createElement('tr');
      tr.classList.add('fade-in');
      tr.innerHTML = `
        <td>${bebida.nome}</td>
        <td><span class="badge bg-primary">${bebida.unidade}</span></td>
        <td class="text-end fw-bold">${totalUnidades}</td>
      `;
      fragment.appendChild(tr);
    });
    
    tabelaEstoqueBebidasBody.innerHTML = '';
    tabelaEstoqueBebidasBody.appendChild(fragment);
  };

  if (btnGerarPdfEstoqueBebidas) {
    btnGerarPdfEstoqueBebidas.addEventListener('click', () => {
      const ultimaContagem = AppState.getUltimaContagemBebidas();
      if (ultimaContagem) {
        gerarRelatorioPDFBebidas(ultimaContagem, 'Relatorio_Estoque_Atual_Bebidas');
      } else {
        showNotification('Não há dados de contagem para gerar o relatório de estoque.', 'warning');
      }
    });
  }
  
  renderizarEstoqueBebidas();
};

// --- LÓGICA PARA A TELA DE HISTÓRICO (bebidas-historico.html) ---
const setupHistoricoPage = () => {
  const tabelaHistoricoBebidasBody = document.getElementById('tabelaHistoricoBebidas');
  const semHistoricoBebidasText = document.getElementById('semHistoricoBebidas');

  const renderizarHistoricoBebidas = () => {
    const historico = AppState.getHistoricoContagensBebidas().reverse();
    
    // Usar documentFragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    if (historico.length === 0) {
      semHistoricoBebidasText.style.display = 'block';
      return;
    }
    semHistoricoBebidasText.style.display = 'none';

    historico.forEach(contagem => {
      const tr = document.createElement('tr');
      tr.classList.add('fade-in');
      tr.innerHTML = `
        <td>${contagem.data}</td>
        <td>${contagem.responsavel}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-danger btn-excluir-historico" data-id="${contagem.id}"><i class="bi bi-trash"></i></button>
          <button class="btn btn-sm btn-info btn-baixar-pdf" data-id="${contagem.id}"><i class="bi bi-file-earmark-arrow-down"></i></button>
        </td>
      `;
      fragment.appendChild(tr);
    });
    
    tabelaHistoricoBebidasBody.innerHTML = '';
    tabelaHistoricoBebidasBody.appendChild(fragment);

    // Configurar event listeners para os botões
    document.querySelectorAll('.btn-baixar-pdf').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const contagemId = e.currentTarget.dataset.id;
        const contagem = AppState.getHistoricoContagensBebidas().find(c => c.id === contagemId);
        if (contagem) {
          gerarRelatorioPDFBebidas(contagem, `Relatorio_Contagem_Bebidas`);
        }
      });
    });

    document.querySelectorAll('.btn-excluir-historico').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const contagemId = e.currentTarget.dataset.id;
        if (confirm('Tem certeza que deseja excluir esta contagem?')) {
          AppState.deleteContagemBebidas(contagemId);
          showNotification('Contagem excluída com sucesso.', 'success');
          renderizarHistoricoBebidas();
        }
      });
    });
  };
  
  renderizarHistoricoBebidas();
};

// --- LÓGICA PARA A TELA DE GERENCIAMENTO (bebidas-gerenciar.html) ---
const setupGerenciamentoPage = () => {
  const formBebida = document.getElementById('formBebida');
  const bebidaIdInput = document.getElementById('bebidaId');
  const bebidaNomeInput = document.getElementById('bebidaNome');
  const bebidaCategoriaSelect = document.getElementById('bebidaCategoria');
  const bebidaUnidadeSelect = document.getElementById('bebidaUnidade');
  const unidadesPorFardoDiv = document.getElementById('unidadesPorFardoDiv');
  const unidadePorFardoInput = document.getElementById('unidadePorFardo');
  const tabelaBebidasBody = document.getElementById('tabelaBebidas');
  const semBebidasText = document.getElementById('semBebidas');
  const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

  // Lógica para mostrar/esconder o campo de "quantidade por fardo"
  const toggleUnidadesPorFardo = () => {
    if (bebidaUnidadeSelect.value === 'unidade') {
      unidadesPorFardoDiv.style.display = 'none';
      unidadePorFardoInput.required = false;
    } else {
      unidadesPorFardoDiv.style.display = 'block';
      unidadePorFardoInput.required = true;
    }
  };

  // Função para criar uma linha da tabela de bebidas
  const createBebidaRow = (bebida) => {
    const tr = document.createElement('tr');
    tr.classList.add('fade-in');
    const qtdUnidadeTexto = (bebida.unidade !== 'unidade') ? `${bebida.unidadePorFardo} unidades` : 'N/A';
    tr.innerHTML = `
      <td>${bebida.nome}</td>
      <td>${bebida.categoria}</td>
      <td><span class="badge bg-primary">${bebida.unidade}</span></td>
      <td>${qtdUnidadeTexto}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-info me-2 btn-editar" data-id="${bebida.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-danger btn-excluir" data-id="${bebida.id}"><i class="bi bi-trash"></i></button>
      </td>
    `;
    return tr;
  };

  const renderizarTabelaBebidas = () => {
    const bebidas = AppState.getBebidas();
    
    // Usar documentFragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    if (bebidas.length === 0) {
      semBebidasText.style.display = 'block';
      return;
    }
    semBebidasText.style.display = 'none';
    
    bebidas.forEach(bebida => {
      const tr = createBebidaRow(bebida);
      fragment.appendChild(tr);
    });
    
    tabelaBebidasBody.innerHTML = '';
    tabelaBebidasBody.appendChild(fragment);
    
    // Configurar event listeners para os botões
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => editarBebida(e.currentTarget.dataset.id));
    });
    
    document.querySelectorAll('.btn-excluir').forEach(btn => {
      btn.addEventListener('click', (e) => excluirBebida(e.currentTarget.dataset.id));
    });
  };

  const salvarBebida = (event) => {
    event.preventDefault();
    const nome = bebidaNomeInput.value.trim();
    const categoria = bebidaCategoriaSelect.value;
    const unidade = bebidaUnidadeSelect.value;
    const unidadePorFardo = (unidade === 'unidade') ? 1 : parseFloat(unidadePorFardoInput.value) || 0;
    const id = bebidaIdInput.value;
    
    // Validações
    if (!nome || !categoria || !unidade) {
      showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }
    
    if (unidade !== 'unidade' && unidadePorFardo <= 0) {
      showNotification('A quantidade por fardo/caixa deve ser um número positivo.', 'warning');
      unidadePorFardoInput.classList.add('is-invalid');
      return;
    }
    
    let bebidas = AppState.getBebidas();
    
    if (id) {
      // Modo edição
      const bebidaIndex = bebidas.findIndex(bebida => bebida.id === id);
      if (bebidaIndex !== -1) {
        bebidas[bebidaIndex].nome = nome;
        bebidas[bebidaIndex].categoria = categoria;
        bebidas[bebidaIndex].unidade = unidade;
        bebidas[bebidaIndex].unidadePorFardo = unidadePorFardo;
        showNotification('Bebida atualizada com sucesso!', 'success');
      }
    } else {
      // Modo criação
      const novaBebida = {
        id: `bebida-${Date.now()}`,
        nome,
        categoria,
        unidade,
        unidadePorFardo
      };
      bebidas.push(novaBebida);
      showNotification('Bebida adicionada com sucesso!', 'success');
    }
    
    AppState.saveBebidas(bebidas);
    formBebida.reset();
    bebidaIdInput.value = '';
    renderizarTabelaBebidas();
    btnCancelarEdicao.style.display = 'none';
    toggleUnidadesPorFardo();
  };

  const editarBebida = (id) => {
    const bebida = AppState.getBebidas().find(bebida => bebida.id === id);
    if (bebida) {
      bebidaIdInput.value = bebida.id;
      bebidaNomeInput.value = bebida.nome;
      bebidaCategoriaSelect.value = bebida.categoria;
      bebidaUnidadeSelect.value = bebida.unidade;
      unidadePorFardoInput.value = bebida.unidadePorFardo;
      toggleUnidadesPorFardo();
      btnCancelarEdicao.style.display = 'block';
      
      // Scroll para o formulário
      formBebida.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const excluirBebida = (id) => {
    if (confirm('Tem certeza que deseja excluir esta bebida?')) {
      let bebidas = AppState.getBebidas().filter(bebida => bebida.id !== id);
      AppState.saveBebidas(bebidas);
      showNotification('Bebida excluída com sucesso.', 'success');
      renderizarTabelaBebidas();
    }
  };

  const cancelarEdicao = () => {
    formBebida.reset();
    bebidaIdInput.value = '';
    toggleUnidadesPorFardo();
    btnCancelarEdicao.style.display = 'none';
  };

  // Configurar event listeners
  if (bebidaUnidadeSelect) {
    bebidaUnidadeSelect.addEventListener('change', toggleUnidadesPorFardo);
  }
  
  if (formBebida) {
    formBebida.addEventListener('submit', salvarBebida);
  }
  
  if (btnCancelarEdicao) {
    btnCancelarEdicao.addEventListener('click', cancelarEdicao);
  }
  
  // Inicializar a tela
  renderizarTabelaBebidas();
  toggleUnidadesPorFardo();
};

// --- INICIALIZAÇÃO DA PÁGINA ATUAL ---
document.addEventListener('DOMContentLoaded', () => {
  // Verificar qual página está carregada e inicializar a lógica correspondente
  if (document.getElementById('formContagemBebidas')) {
    setupContagemPage();
  } else if (document.getElementById('tabelaEstoqueBebidas')) {
    setupEstoquePage();
  } else if (document.getElementById('tabelaHistoricoBebidas')) {
    setupHistoricoPage();
  } else if (document.getElementById('formBebida')) {
    setupGerenciamentoPage();
  }
});
