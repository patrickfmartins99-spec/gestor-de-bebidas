document.addEventListener('DOMContentLoaded', () => {

    // --- FUNÇÕES DE ARMAZENAMENTO (LOCAL STORAGE) ---
    const getBebidas = () => {
        const bebidas = localStorage.getItem('bebidas');
        return bebidas ? JSON.parse(bebidas) : [];
    };

    const saveBebidas = (bebidas) => {
        localStorage.setItem('bebidas', JSON.stringify(bebidas));
    };

    const getUltimaContagemBebidas = () => {
        const contagem = localStorage.getItem('ultimaContagemBebidas');
        return contagem ? JSON.parse(contagem) : null;
    };

    const setUltimaContagemBebidas = (contagem) => {
        localStorage.setItem('ultimaContagemBebidas', JSON.stringify(contagem));
    };

    const getHistoricoContagensBebidas = () => {
        const historico = localStorage.getItem('historicoContagensBebidas');
        return historico ? JSON.parse(historico) : [];
    };

    const saveHistoricoContagensBebidas = (contagem) => {
        const historico = getHistoricoContagensBebidas();
        historico.push(contagem);
        localStorage.setItem('historicoContagensBebidas', JSON.stringify(historico));
    };

    const deleteContagemBebidas = (id) => {
        let historico = getHistoricoContagensBebidas();
        const novoHistorico = historico.filter(contagem => contagem.id !== id);
        localStorage.setItem('historicoContagensBebidas', JSON.stringify(novoHistorico));
    };


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

    const isDomingo = (dataString) => {
        const dateObj = new Date(dataString.replace(/-/g, '/'));
        return dateObj.getDay() === 0;
    };
    
    const calcularEstatisticas = () => {
        const historico = getHistoricoContagensBebidas();
        // Acessa as duas últimas contagens (se existirem)
        const ultimaContagem = historico[historico.length - 1];
        const penultimaContagem = historico[historico.length - 2];

        const estatisticas = {};

        // Adiciona uma verificação para garantir que há dados suficientes para o cálculo
        if (ultimaContagem && penultimaContagem) {
            const bebidas = getBebidas();
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

    // --- FUNÇÃO PARA INICIALIZAR BEBIDAS ---
    const inicializarBebidas = () => {
        const bebidasExistentes = getBebidas();
        if (bebidasExistentes.length === 0) {
            const bebidasPadrao = [
                { id: 'bebida-fruki', nome: 'Fruki 1,5L', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Refrigerantes Pet' },
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
                { id: 'bebida-aguacomgas', nome: 'Água com Gás 500ml', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Águas' },
                { id: 'bebida-aguasemgas', nome: 'Água sem Gás 500ml', unidade: 'fardo', unidadePorFardo: 12, categoria: 'Águas' },
                { id: 'bebida-bud600', nome: 'Budweiser 600ml', unidade: 'caixa', unidadePorFardo: 24, categoria: 'Cervejas 600ml' },
                { id: 'bebida-orig600', nome: 'Original 600ml', unidade: 'caixa', unidadePorFardo: 24, categoria: 'Cervejas 600ml' },
                { id: 'bebida-heineken600', nome: 'Heineken 600ml', unidade: 'caixa', unidadePorFardo: 24, categoria: 'Cervejas 600ml' },
                { id: 'bebida-stella', nome: 'Stella Artois', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
                { id: 'bebida-budlong', nome: 'Budweiser Long Neck', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
                { id: 'bebida-heinekenzero', nome: 'Heineken Zero Álcool', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
                { id: 'bebida-heinekenlong', nome: 'Heineken', unidade: 'fardo', unidadePorFardo: 6, categoria: 'Cervejas Long Neck' },
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
                { id: 'bebida-baly', nome: 'Energético Baly', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-bacardi', nome: 'Bacardi', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-vodka', nome: 'Vodka', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-gin', nome: 'Gin', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-licor', nome: 'Licor de Pêssego', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-groselha', nome: 'Xarope de Groselha', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-cachaca', nome: 'Cachaça Velho Barreiro', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
                { id: 'bebida-maracuja-maguary', nome: 'Suco Concentrado de Maracujá Maguary', unidade: 'unidade', unidadePorFardo: 1, categoria: 'Destilados' },
            ];
            saveBebidas(bebidasPadrao);
        }
    };

    // --- FUNÇÕES AUXILIARES DE RELATÓRIO (MODIFICADO) ---
    const gerarRelatorioPDFBebidas = (contagem, filenamePrefix) => {
        const bebidas = getBebidas();
        const dadosEmpresa = {
            nome: "La Giovana's Pizzaria",
            titulo: "Relatório de Contagem de Bebidas"
        };
        
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        if (!contagem || !contagem.detalhesContagem || Object.keys(contagem.detalhesContagem).length === 0) {
            alert('Não há dados de contagem para gerar o relatório.');
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

        html2pdf().set(options).from(conteudoRelatorio).save();
    };


    // Lógica para a tela de Contagem (index.html)
    const formContagemBebidas = document.getElementById('formContagemBebidas');
    const listaBebidasContainer = document.getElementById('listaBebidas');

    // Função para renderizar a lista de bebidas no formulário de contagem
    const renderizarListaBebidas = () => {
        const bebidas = getBebidas();
        listaBebidasContainer.innerHTML = '';
        if (bebidas.length === 0) {
            listaBebidasContainer.innerHTML = `<p class="text-center text-muted">Nenhuma bebida cadastrada. Vá para a tela "Gerenciar" para adicionar novas bebidas.</p>`;
            return;
        }

        bebidas.forEach(bebida => {
            const bebidaItem = document.createElement('div');
            bebidaItem.classList.add('bebida-item', 'p-3', 'mb-3');
            bebidaItem.dataset.id = bebida.id;

            const bebidaNome = document.createElement('h5');
            bebidaNome.classList.add('bebida-nome', 'mb-3');
            bebidaNome.textContent = bebida.nome;
            bebidaItem.appendChild(bebidaNome);

            const formRow = document.createElement('div');
            formRow.classList.add('row', 'g-3');

            // Campo de depósito
            const depositoCol = document.createElement('div');
            depositoCol.classList.add('col-md-6');
            depositoCol.innerHTML = `
                <label for="deposito-${bebida.id}" class="form-label">Depósito (${bebida.unidade === 'unidade' ? 'unidades' : bebida.unidade + 's'})</label>
                <input type="number" class="form-control" id="deposito-${bebida.id}" value="0" min="0" data-id="${bebida.id}">
            `;
            formRow.appendChild(depositoCol);

            // Se for fardo ou caixa, adiciona o campo de unidades avulsas
            if (bebida.unidade !== 'unidade') {
                const avulsoCol = document.createElement('div');
                avulsoCol.classList.add('col-md-6');
                avulsoCol.innerHTML = `
                    <label for="unidades-avulsas-${bebida.id}" class="form-label">Unidades Avulsas</label>
                    <input type="number" class="form-control" id="unidades-avulsas-${bebida.id}" value="0" min="0" data-id="${bebida.id}">
                `;
                formRow.appendChild(avulsoCol);
            }

            // Campo para freezer
            const freezerCol = document.createElement('div');
            freezerCol.classList.add('col-md-6');
            freezerCol.innerHTML = `
                <label for="freezer-${bebida.id}" class="form-label">Freezer (unidades)</label>
                <input type="number" class="form-control" id="freezer-${bebida.id}" value="0" min="0" data-id="${bebida.id}">
            `;
            formRow.appendChild(freezerCol);
            
            // Exibição do total em tempo real
            const totalCol = document.createElement('div');
            totalCol.classList.add('col-12', 'mt-3');
            totalCol.innerHTML = `
                <p class="fw-bold m-0">Total em Estoque: <span id="total-${bebida.id}">0</span> unidades</p>
            `;
            formRow.appendChild(totalCol);

            bebidaItem.appendChild(formRow);
            listaBebidasContainer.appendChild(bebidaItem);
        });
    };

    // Função para calcular o total em tempo real e atualizar a exibição
    const setupRealTimeCalculation = () => {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const bebidaId = e.currentTarget.dataset.id;
                const bebida = getBebidas().find(b => b.id === bebidaId);
                
                if (!bebida) return;
                
                const depositoInput = document.getElementById(`deposito-${bebidaId}`);
                const unidadesAvulsasInput = document.getElementById(`unidades-avulsas-${bebidaId}`);
                const freezerInput = document.getElementById(`freezer-${bebidaId}`);
                const totalSpan = document.getElementById(`total-${bebidaId}`);
                
                const deposito = parseFloat(depositoInput.value) || 0;
                const unidadesAvulsas = parseFloat(unidadesAvulsasInput?.value) || 0;
                const freezer = parseFloat(freezerInput.value) || 0;
                
                // Validação de input para garantir valores não-negativos
                if (deposito < 0 || unidadesAvulsas < 0 || freezer < 0) {
                    alert('Os valores de contagem não podem ser negativos.');
                    e.currentTarget.value = 0; // Reseta o valor para 0
                    return;
                }
                
                const totalUnidades = (deposito * (bebida.unidadePorFardo || 1)) + unidadesAvulsas + freezer;
                totalSpan.textContent = totalUnidades;
            });
        });
    };

    // Função para salvar a contagem
    const salvarContagemBebidas = (event) => {
        event.preventDefault();

        // Validação básica do formulário
        const responsavel = document.getElementById('responsavel').value;
        const dataContagem = document.getElementById('dataContagem').value;

        if (!responsavel || !dataContagem) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const bebidas = getBebidas();
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
                return;
            }

            const totalUnidades = (deposito * bebida.unidadePorFardo) + unidadesAvulsas + freezer;

            detalhesContagem[bebida.id] = {
                deposito,
                unidadesAvulsas,
                freezer,
                totalUnidades
            };
        });

        if (hasInvalidInput) {
            alert('Valores de contagem não podem ser negativos. Por favor, corrija o formulário.');
            return;
        }

        const novaContagem = {
            id: `contagem-bebidas-${Date.now()}`,
            responsavel,
            data: dataContagem,
            detalhesContagem
        };
        
        saveHistoricoContagensBebidas(novaContagem);
        setUltimaContagemBebidas(novaContagem);

        alert('Contagem salva com sucesso! O relatório será gerado.');
        formContagemBebidas.reset();
        gerarRelatorioPDFBebidas(novaContagem, `Relatorio_Contagem_Bebidas`);
        renderizarListaBebidas(); // Reseta a lista após salvar
    };

    // Lógica para a tela de Estoque de Bebidas (bebidas-estoque.html)
    const tabelaEstoqueBebidasBody = document.getElementById('tabelaEstoqueBebidas');
    const btnGerarPdfEstoqueBebidas = document.getElementById('btnGerarPdfEstoqueBebidas');
    const semEstoqueBebidasText = document.getElementById('semEstoqueBebidas');

    const renderizarEstoqueBebidas = () => {
        const ultimaContagem = getUltimaContagemBebidas();
        const bebidas = getBebidas();
        tabelaEstoqueBebidasBody.innerHTML = '';

        if (!ultimaContagem || Object.keys(ultimaContagem.detalhesContagem).length === 0) {
            semEstoqueBebidasText.style.display = 'block';
            return;
        }
        semEstoqueBebidasText.style.display = 'none';

        bebidas.forEach(bebida => {
            const totalUnidades = ultimaContagem.detalhesContagem[bebida.id]?.totalUnidades || 0;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${bebida.nome}</td>
                <td><span class="badge bg-primary">${bebida.unidade}</span></td>
                <td class="text-end fw-bold">${totalUnidades}</td>
            `;
            tabelaEstoqueBebidasBody.appendChild(tr);
        });
    };

    // Lógica para a tela de Histórico de Contagens de Bebidas (bebidas-historico.html)
    const tabelaHistoricoBebidasBody = document.getElementById('tabelaHistoricoBebidas');
    const semHistoricoBebidasText = document.getElementById('semHistoricoBebidas');

    const renderizarHistoricoBebidas = () => {
        const historico = getHistoricoContagensBebidas().reverse();
        tabelaHistoricoBebidasBody.innerHTML = '';
        
        if (historico.length === 0) {
            semHistoricoBebidasText.style.display = 'block';
            return;
        }
        semHistoricoBebidasText.style.display = 'none';

        historico.forEach(contagem => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${contagem.data}</td>
                <td>${contagem.responsavel}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-danger btn-excluir-historico" data-id="${contagem.id}" aria-label="Excluir contagem"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-sm btn-info btn-baixar-pdf" data-id="${contagem.id}" aria-label="Baixar relatório em PDF"><i class="bi bi-file-earmark-arrow-down"></i></button>
                </td>
            `;
            tabelaHistoricoBebidasBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-baixar-pdf').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contagemId = e.currentTarget.dataset.id;
                const contagem = getHistoricoContagensBebidas().find(c => c.id === contagemId);
                if (contagem) {
                    gerarRelatorioPDFBebidas(contagem, `Relatorio_Contagem_Bebidas`);
                }
            });
        });

        document.querySelectorAll('.btn-excluir-historico').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contagemId = e.currentTarget.dataset.id;
                if (confirm('Tem certeza que deseja excluir esta contagem?')) {
                    deleteContagemBebidas(contagemId);
                    renderizarHistoricoBebidas();
                }
            });
        });
    };
    
    // Lógica para a tela de Gerenciamento de Bebidas (bebidas-gerenciar.html)
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

    const toggleUnidadesPorFardo = () => {
        if (bebidaUnidadeSelect.value === 'unidade') {
            unidadesPorFardoDiv.style.display = 'none';
            unidadePorFardoInput.required = false;
        } else {
            unidadesPorFardoDiv.style.display = 'block';
            unidadePorFardoInput.required = true;
        }
    };

    const renderizarTabelaBebidas = () => {
        const bebidas = getBebidas();
        tabelaBebidasBody.innerHTML = '';
        if (bebidas.length === 0) {
            semBebidasText.style.display = 'block';
            return;
        }
        semBebidasText.style.display = 'none';
        bebidas.forEach(bebida => {
            const tr = document.createElement('tr');
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
            tabelaBebidasBody.appendChild(tr);
        });
        document.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', (e) => editarBebida(e.currentTarget.dataset.id)));
        document.querySelectorAll('.btn-excluir').forEach(btn => btn.addEventListener('click', (e) => excluirBebida(e.currentTarget.dataset.id)));
    };

    const salvarBebida = (event) => {
        event.preventDefault();
        const nome = bebidaNomeInput.value;
        const categoria = bebidaCategoriaSelect.value;
        const unidade = bebidaUnidadeSelect.value;
        const unidadePorFardo = (unidade === 'unidade') ? 1 : parseFloat(unidadePorFardoInput.value) || 0;
        const id = bebidaIdInput.value;
        let bebidas = getBebidas();
        
        if (unidade !== 'unidade' && unidadePorFardo <= 0) {
            alert('A quantidade por fardo/caixa deve ser um número positivo.');
            return;
        }

        if (id) {
            const bebidaIndex = bebidas.findIndex(bebida => bebida.id === id);
            if (bebidaIndex !== -1) {
                bebidas[bebidaIndex].nome = nome;
                bebidas[bebidaIndex].categoria = categoria;
                bebidas[bebidaIndex].unidade = unidade;
                bebidas[bebidaIndex].unidadePorFardo = unidadePorFardo;
            }
        } else {
            const novaBebida = {
                id: `bebida-${Date.now()}`,
                nome,
                categoria,
                unidade,
                unidadePorFardo
            };
            bebidas.push(novaBebida);
        }
        saveBebidas(bebidas);
        formBebida.reset();
        bebidaIdInput.value = '';
        renderizarTabelaBebidas();
        btnCancelarEdicao.style.display = 'none';
        toggleUnidadesPorFardo(); // Adicionado para garantir o estado correto do formulário
    };

    const editarBebida = (id) => {
        const bebida = getBebidas().find(bebida => bebida.id === id);
        if (bebida) {
            bebidaIdInput.value = bebida.id;
            bebidaNomeInput.value = bebida.nome;
            bebidaCategoriaSelect.value = bebida.categoria;
            bebidaUnidadeSelect.value = bebida.unidade;
            unidadePorFardoInput.value = bebida.unidadePorFardo;
            toggleUnidadesPorFardo();
            btnCancelarEdicao.style.display = 'block';
        }
    };

    const excluirBebida = (id) => {
        if (confirm('Tem certeza que deseja excluir esta bebida?')) {
            let bebidas = getBebidas().filter(bebida => bebida.id !== id);
            saveBebidas(bebidas);
            renderizarTabelaBebidas();
        }
    };

    const cancelarEdicao = () => {
        formBebida.reset();
        bebidaIdInput.value = '';
        toggleUnidadesPorFardo();
        btnCancelarEdicao.style.display = 'none';
    };

    // --- INICIALIZAÇÃO E EVENT LISTENERS DA PÁGINA ---
    if (document.getElementById('formContagemBebidas')) {
        inicializarBebidas();
        renderizarListaBebidas();
        setupRealTimeCalculation(); // Chama a função para adicionar listeners
        formContagemBebidas.addEventListener('submit', salvarContagemBebidas);
    } else if (document.getElementById('tabelaEstoqueBebidas')) {
        renderizarEstoqueBebidas();
        btnGerarPdfEstoqueBebidas.addEventListener('click', () => {
            const ultimaContagem = getUltimaContagemBebidas();
            if (ultimaContagem) {
                gerarRelatorioPDFBebidas(ultimaContagem, 'Relatorio_Estoque_Atual_Bebidas');
            } else {
                alert('Não há dados de contagem para gerar o relatório de estoque.');
            }
        });
    } else if (document.getElementById('tabelaHistoricoBebidas')) {
        renderizarHistoricoBebidas();
    } else if (document.getElementById('formBebida')) {
        inicializarBebidas();
        renderizarTabelaBebidas();
        toggleUnidadesPorFardo();
        formBebida.addEventListener('submit', salvarBebida);
        bebidaUnidadeSelect.addEventListener('change', toggleUnidadesPorFardo);
        btnCancelarEdicao.addEventListener('click', cancelarEdicao);
    }
});
