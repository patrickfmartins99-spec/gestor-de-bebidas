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


    // --- FUNÇÃO PARA INICIALIZAR BEBIDAS ---
    const inicializarBebidas = () => {
        const bebidasExistentes = getBebidas();
        if (bebidasExistentes.length === 0) {
            const bebidasPadrao = [
                // Ordem: Fruki, Refrigerantes, Águas, Cervejas 600ml, Long Necks, Vinhos e Espumantes, Destilados
                
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
            saveBebidas(bebidasPadrao);
        }
    };


    // --- FUNÇÃO AUXILIAR DE RELATÓRIO ---
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

        let tabelaRows = '';
        Object.keys(contagem.detalhesContagem).forEach(bebidaId => {
            const bebidaInfo = bebidas.find(b => b.id === bebidaId) || { nome: 'Desconhecida', unidade: 'N/A', unidadePorFardo: 1 };
            const dados = contagem.detalhesContagem[bebidaId];
            
            let depositoTexto = '';
            if (bebidaInfo.unidade === 'caixa' || bebidaInfo.unidade === 'fardo') {
                depositoTexto = `${dados.deposito} ${bebidaInfo.unidade}s e ${dados.unidadesAvulsas} unidades`;
            } else {
                depositoTexto = `${dados.unidadesAvulsas} unidades`;
            }

            tabelaRows += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #000;">${bebidaInfo.nome}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${depositoTexto}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.freezer}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.totalUnidades}</td>
                </tr>
            `;
        });
        
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
                        ${tabelaRows}
                    </tbody>
                </table>
                
                <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #6c757d;">
                    Documento gerado em ${dataAtual} às ${horaAtual}.
                </div>
            </div>
        `;

        const options = {
            margin: 0.5,
            filename: `${filenamePrefix}_${contagem.data}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(conteudoRelatorio).save();
    };


    // --- LÓGICA DE PÁGINAS ---
    // Lógica para a tela de Contagem de Bebidas (bebidas-contagem.html)
    const formContagemBebidas = document.getElementById('formContagemBebidas');
    const listaBebidasDiv = document.getElementById('listaBebidas');

    if (formContagemBebidas) {
        const renderizarBebidasContagem = () => {
            const bebidas = getBebidas();
            const ultimaContagem = getUltimaContagemBebidas();
            listaBebidasDiv.innerHTML = '';
            
            if (bebidas.length === 0) {
                listaBebidasDiv.innerHTML = '<p class="text-center text-muted">Nenhuma bebida cadastrada. Vá para "Gerenciar Bebidas" para adicionar.</p>';
                return;
            }

            // Agrupa as bebidas por categoria
            const bebidasPorCategoria = bebidas.reduce((acc, bebida) => {
                const categoria = bebida.categoria;
                if (!acc[categoria]) {
                    acc[categoria] = [];
                }
                acc[categoria].push(bebida);
                return acc;
            }, {});

            // Ordem das categorias para renderização
            const ordemCategorias = [
                'Refrigerantes Pet', 'Refrigerantes Lata', 'Águas', 
                'Cervejas 600ml', 'Cervejas Long Neck', 
                'Espumantes e Vinhos', 'Destilados'
            ];

            ordemCategorias.forEach(categoria => {
                if (bebidasPorCategoria[categoria]) {
                    const categoriaDiv = document.createElement('div');
                    categoriaDiv.classList.add('categoria-bebida', 'mb-4');
                    categoriaDiv.innerHTML = `<h3 class="border-bottom pb-2">${categoria}</h3>`;
                    
                    bebidasPorCategoria[categoria].forEach(bebida => {
                        const bebidaDiv = document.createElement('div');
                        bebidaDiv.classList.add('bebida-item', 'border', 'p-3', 'rounded', 'mb-3');
                        bebidaDiv.dataset.id = bebida.id;
                        
                        const ultimoTotalUnidades = ultimaContagem?.detalhesContagem?.[bebida.id]?.totalUnidades || 0;
                        
                        let camposContagem = '';
                        if (bebida.unidade === 'caixa' || bebida.unidade === 'fardo') {
                            camposContagem = `
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Depósito (${bebida.unidade} de ${bebida.unidadePorFardo})</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="deposito-fardos" placeholder="Qtd. Fardos" value="0">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Unidades Avulsas</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="unidades-avulsas" placeholder="Qtd. Unidades" value="0">
                                </div>
                            `;
                        } else {
                            camposContagem = `
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Depósito (un.)</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="deposito-unidades" placeholder="Qtd. Unidades" value="0">
                                </div>
                                <div class="col-6 col-md-3" style="display:none;"></div>
                            `;
                        }

                        bebidaDiv.innerHTML = `
                            <h5 class="bebida-nome">${bebida.nome}</h5>
                            <p class="text-muted small mb-2">Último Estoque Total: <span class="fw-bold">${ultimoTotalUnidades}</span></p>
                            <div class="row g-2 align-items-end">
                                ${camposContagem}
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Freezer (un.)</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="freezer" placeholder="Qtd. Freezer" value="0">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Total em Estoque (un.)</label>
                                    <p class="mb-0 fw-bold fs-4 text-success" data-campo="total-unidades">0</p>
                                </div>
                                <div class="col-12 mt-3">
                                    <label class="form-label">Gasto/Reposição Estimado(a)</label>
                                    <p class="mb-0 fw-bold fs-5" data-campo="gasto-reposicao">0</p>
                                </div>
                            </div>
                        `;
                        categoriaDiv.appendChild(bebidaDiv);
                        listaBebidasDiv.appendChild(categoriaDiv);
                        
                        // Lógica de cálculo
                        const inputs = bebidaDiv.querySelectorAll('input[type="number"]');
                        inputs.forEach(input => {
                            input.addEventListener('input', () => calcularValoresBebida(bebidaDiv, ultimoTotalUnidades, bebida.unidadePorFardo, bebida.unidade));
                        });

                        calcularValoresBebida(bebidaDiv, ultimoTotalUnidades, bebida.unidadePorFardo, bebida.unidade);
                    });
                }
            });
        };

        const calcularValoresBebida = (bebidaDiv, ultimoTotalUnidades, unidadesPorFardo, tipoUnidade) => {
            let depositoFardos = 0;
            let unidadesAvulsas = 0;
            
            const depositoFardosInput = bebidaDiv.querySelector('[data-campo="deposito-fardos"]');
            const unidadesAvulsasInput = bebidaDiv.querySelector('[data-campo="unidades-avulsas"]');
            
            if (tipoUnidade === 'caixa' || tipoUnidade === 'fardo') {
                depositoFardos = parseFloat(depositoFardosInput?.value) || 0;
                unidadesAvulsas = parseFloat(unidadesAvulsasInput?.value) || 0;
            } else {
                const depositoUnidadesInput = bebidaDiv.querySelector('[data-campo="deposito-unidades"]');
                unidadesAvulsas = parseFloat(depositoUnidadesInput?.value) || 0;
            }
            
            const freezer = parseFloat(bebidaDiv.querySelector('[data-campo="freezer"]')?.value) || 0;
            
            const totalDeposito = (depositoFardos * unidadesPorFardo) + unidadesAvulsas;
            const totalUnidades = totalDeposito + freezer;

            bebidaDiv.querySelector('[data-campo="total-unidades"]').textContent = totalUnidades;

            const gastoReposicaoSpan = bebidaDiv.querySelector('[data-campo="gasto-reposicao"]');
            const diferenca = totalUnidades - ultimoTotalUnidades;
            if (diferenca > 0) {
                gastoReposicaoSpan.textContent = `+${diferenca} (Reposição)`;
                gastoReposicaoSpan.style.color = 'green';
            } else if (diferenca < 0) {
                gastoReposicaoSpan.textContent = `${diferenca} (Gasto)`;
                gastoReposicaoSpan.style.color = 'red';
            } else {
                gastoReposicaoSpan.textContent = 'Sem alteração';
                gastoReposicaoSpan.style.color = 'black';
            }
        };

        formContagemBebidas.addEventListener('submit', (event) => {
            event.preventDefault();
            const responsavel = document.getElementById('responsavel').value;
            const dataContagem = document.getElementById('dataContagem').value;
            if (!responsavel || !dataContagem) {
                alert('Por favor, preencha o nome do responsável e a data da contagem.');
                return;
            }

            const detalhesContagem = {};
            const bebidasNaTela = document.querySelectorAll('.bebida-item');
            let temDados = false;
            bebidasNaTela.forEach(bebidaDiv => {
                const id = bebidaDiv.dataset.id;
                const bebidaInfo = getBebidas().find(b => b.id === id);
                const ultimaContagem = getUltimaContagemBebidas();
                const ultimoTotalUnidades = ultimaContagem?.detalhesContagem?.[id]?.totalUnidades || 0;
                
                let depositoValor = 0;
                let unidadesAvulsasValor = 0;
                
                if (bebidaInfo.unidade === 'caixa' || bebidaInfo.unidade === 'fardo') {
                    depositoValor = parseFloat(bebidaDiv.querySelector('[data-campo="deposito-fardos"]')?.value) || 0;
                    unidadesAvulsasValor = parseFloat(bebidaDiv.querySelector('[data-campo="unidades-avulsas"]')?.value) || 0;
                } else {
                    unidadesAvulsasValor = parseFloat(bebidaDiv.querySelector('[data-campo="deposito-unidades"]')?.value) || 0;
                }
                
                const freezerValor = parseFloat(bebidaDiv.querySelector('[data-campo="freezer"]')?.value) || 0;
                const totalUnidadesValor = parseFloat(bebidaDiv.querySelector('[data-campo="total-unidades"]').textContent) || 0;
                const gastoEstimado = calcularGastoEstimado(totalUnidadesValor, ultimoTotalUnidades);
                const reposicaoEstimada = calcularReposicaoEstimada(totalUnidadesValor, ultimoTotalUnidades);

                detalhesContagem[id] = { 
                    deposito: depositoValor, 
                    unidadesAvulsas: unidadesAvulsasValor,
                    freezer: freezerValor,
                    totalUnidades: totalUnidadesValor,
                    gastoEstimado: gastoEstimado,
                    reposicaoEstimada: reposicaoEstimada
                };
                
                if (depositoValor > 0 || unidadesAvulsasValor > 0 || freezerValor > 0) {
                    temDados = true;
                }
            });

            if (!temDados) {
                alert('Nenhuma bebida foi contada. Por favor, adicione dados antes de salvar.');
                return;
            }

            const novaContagem = {
                id: `contagem-${Date.now()}`,
                data: dataContagem,
                responsavel: responsavel,
                detalhesContagem
            };

            setUltimaContagemBebidas(novaContagem);
            saveHistoricoContagensBebidas(novaContagem);
            gerarRelatorioPDFBebidas(novaContagem, 'Relatorio_Contagem_Bebidas');
            formContagemBebidas.reset();
            renderizarBebidasContagem();
        });

        inicializarBebidas();
        renderizarBebidasContagem();
    }


    // --- FUNÇÃO AUXILIAR DE RELATÓRIO ---
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

        let tabelaRows = '';
        Object.keys(contagem.detalhesContagem).forEach(bebidaId => {
            const bebidaInfo = bebidas.find(b => b.id === bebidaId) || { nome: 'Desconhecida', unidade: 'N/A', unidadePorFardo: 1 };
            const dados = contagem.detalhesContagem[bebidaId];
            
            let depositoTexto = '';
            if (bebidaInfo.unidade === 'caixa' || bebidaInfo.unidade === 'fardo') {
                depositoTexto = `${dados.deposito} ${bebidaInfo.unidade}s e ${dados.unidadesAvulsas} unidades`;
            } else {
                depositoTexto = `${dados.unidadesAvulsas} unidades`;
            }

            tabelaRows += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #000;">${bebidaInfo.nome}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${depositoTexto}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.freezer}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.totalUnidades}</td>
                </tr>
            `;
        });
        
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
                        ${tabelaRows}
                    </tbody>
                </table>
                
                <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #6c757d;">
                    Documento gerado em ${dataAtual} às ${horaAtual}.
                </div>
            </div>
        `;

        const options = {
            margin: 0.5,
            filename: `${filenamePrefix}_${contagem.data}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(conteudoRelatorio).save();
    };


    // --- LÓGICA DE PÁGINAS ---
    // Lógica para a tela de Contagem de Bebidas (bebidas-contagem.html)
    const formContagemBebidas = document.getElementById('formContagemBebidas');
    const listaBebidasDiv = document.getElementById('listaBebidas');

    if (formContagemBebidas) {
        const renderizarBebidasContagem = () => {
            const bebidas = getBebidas();
            const ultimaContagem = getUltimaContagemBebidas();
            listaBebidasDiv.innerHTML = '';
            
            if (bebidas.length === 0) {
                listaBebidasDiv.innerHTML = '<p class="text-center text-muted">Nenhuma bebida cadastrada. Vá para "Gerenciar Bebidas" para adicionar.</p>';
                return;
            }

            // Agrupa as bebidas por categoria
            const bebidasPorCategoria = bebidas.reduce((acc, bebida) => {
                const categoria = bebida.categoria;
                if (!acc[categoria]) {
                    acc[categoria] = [];
                }
                acc[categoria].push(bebida);
                return acc;
            }, {});

            // Ordem das categorias para renderização
            const ordemCategorias = [
                'Refrigerantes Pet', 'Refrigerantes Lata', 'Águas', 
                'Cervejas 600ml', 'Cervejas Long Neck', 
                'Espumantes e Vinhos', 'Destilados'
            ];

            ordemCategorias.forEach(categoria => {
                if (bebidasPorCategoria[categoria]) {
                    const categoriaDiv = document.createElement('div');
                    categoriaDiv.classList.add('categoria-bebida', 'mb-4');
                    categoriaDiv.innerHTML = `<h3 class="border-bottom pb-2">${categoria}</h3>`;
                    
                    bebidasPorCategoria[categoria].forEach(bebida => {
                        const bebidaDiv = document.createElement('div');
                        bebidaDiv.classList.add('bebida-item', 'border', 'p-3', 'rounded', 'mb-3');
                        bebidaDiv.dataset.id = bebida.id;
                        
                        const ultimoTotalUnidades = ultimaContagem?.detalhesContagem?.[bebida.id]?.totalUnidades || 0;
                        
                        let camposContagem = '';
                        if (bebida.unidade === 'caixa' || bebida.unidade === 'fardo') {
                            camposContagem = `
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Depósito (${bebida.unidade} de ${bebida.unidadePorFardo})</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="deposito-fardos" placeholder="Qtd. Fardos" value="0">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Unidades Avulsas</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="unidades-avulsas" placeholder="Qtd. Unidades" value="0">
                                </div>
                            `;
                        } else {
                            camposContagem = `
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Depósito (un.)</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="deposito-unidades" placeholder="Qtd. Unidades" value="0">
                                </div>
                                <div class="col-6 col-md-3" style="display:none;"></div>
                            `;
                        }

                        bebidaDiv.innerHTML = `
                            <h5 class="bebida-nome">${bebida.nome}</h5>
                            <p class="text-muted small mb-2">Último Estoque Total: <span class="fw-bold">${ultimoTotalUnidades}</span></p>
                            <div class="row g-2 align-items-end">
                                ${camposContagem}
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Freezer (un.)</label>
                                    <input type="number" step="any" class="form-control form-control-sm" data-campo="freezer" placeholder="Qtd. Freezer" value="0">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label">Total em Estoque (un.)</label>
                                    <p class="mb-0 fw-bold fs-4 text-success" data-campo="total-unidades">0</p>
                                </div>
                                <div class="col-12 mt-3">
                                    <label class="form-label">Gasto/Reposição Estimado(a)</label>
                                    <p class="mb-0 fw-bold fs-5" data-campo="gasto-reposicao">0</p>
                                </div>
                            </div>
                        `;
                        categoriaDiv.appendChild(bebidaDiv);
                        listaBebidasDiv.appendChild(categoriaDiv);
                        
                        // Lógica de cálculo
                        const inputs = bebidaDiv.querySelectorAll('input[type="number"]');
                        inputs.forEach(input => {
                            input.addEventListener('input', () => calcularValoresBebida(bebidaDiv, ultimoTotalUnidades, bebida.unidadePorFardo, bebida.unidade));
                        });

                        calcularValoresBebida(bebidaDiv, ultimoTotalUnidades, bebida.unidadePorFardo, bebida.unidade);
                    });
                }
            });
        };

        const calcularValoresBebida = (bebidaDiv, ultimoTotalUnidades, unidadesPorFardo, tipoUnidade) => {
            let depositoFardos = 0;
            let unidadesAvulsas = 0;
            
            const depositoFardosInput = bebidaDiv.querySelector('[data-campo="deposito-fardos"]');
            const unidadesAvulsasInput = bebidaDiv.querySelector('[data-campo="unidades-avulsas"]');
            
            if (tipoUnidade === 'caixa' || tipoUnidade === 'fardo') {
                depositoFardos = parseFloat(depositoFardosInput?.value) || 0;
                unidadesAvulsas = parseFloat(unidadesAvulsasInput?.value) || 0;
            } else {
                const depositoUnidadesInput = bebidaDiv.querySelector('[data-campo="deposito-unidades"]');
                unidadesAvulsas = parseFloat(depositoUnidadesInput?.value) || 0;
            }
            
            const freezer = parseFloat(bebidaDiv.querySelector('[data-campo="freezer"]')?.value) || 0;
            
            const totalDeposito = (depositoFardos * unidadesPorFardo) + unidadesAvulsas;
            const totalUnidades = totalDeposito + freezer;

            bebidaDiv.querySelector('[data-campo="total-unidades"]').textContent = totalUnidades;

            const gastoReposicaoSpan = bebidaDiv.querySelector('[data-campo="gasto-reposicao"]');
            const diferenca = totalUnidades - ultimoTotalUnidades;
            if (diferenca > 0) {
                gastoReposicaoSpan.textContent = `+${diferenca} (Reposição)`;
                gastoReposicaoSpan.style.color = 'green';
            } else if (diferenca < 0) {
                gastoReposicaoSpan.textContent = `${diferenca} (Gasto)`;
                gastoReposicaoSpan.style.color = 'red';
            } else {
                gastoReposicaoSpan.textContent = 'Sem alteração';
                gastoReposicaoSpan.style.color = 'black';
            }
        };

        formContagemBebidas.addEventListener('submit', (event) => {
            event.preventDefault();
            const responsavel = document.getElementById('responsavel').value;
            const dataContagem = document.getElementById('dataContagem').value;
            if (!responsavel || !dataContagem) {
                alert('Por favor, preencha o nome do responsável e a data da contagem.');
                return;
            }

            const detalhesContagem = {};
            const bebidasNaTela = document.querySelectorAll('.bebida-item');
            let temDados = false;
            bebidasNaTela.forEach(bebidaDiv => {
                const id = bebidaDiv.dataset.id;
                const bebidaInfo = getBebidas().find(b => b.id === id);
                const ultimaContagem = getUltimaContagemBebidas();
                const ultimoTotalUnidades = ultimaContagem?.detalhesContagem?.[id]?.totalUnidades || 0;
                
                let depositoValor = 0;
                let unidadesAvulsasValor = 0;
                
                if (bebidaInfo.unidade === 'caixa' || bebidaInfo.unidade === 'fardo') {
                    depositoValor = parseFloat(bebidaDiv.querySelector('[data-campo="deposito-fardos"]')?.value) || 0;
                    unidadesAvulsasValor = parseFloat(bebidaDiv.querySelector('[data-campo="unidades-avulsas"]')?.value) || 0;
                } else {
                    unidadesAvulsasValor = parseFloat(bebidaDiv.querySelector('[data-campo="deposito-unidades"]')?.value) || 0;
                }
                
                const freezerValor = parseFloat(bebidaDiv.querySelector('[data-campo="freezer"]')?.value) || 0;
                const totalUnidadesValor = parseFloat(bebidaDiv.querySelector('[data-campo="total-unidades"]').textContent) || 0;
                const gastoEstimado = calcularGastoEstimado(totalUnidadesValor, ultimoTotalUnidades);
                const reposicaoEstimada = calcularReposicaoEstimada(totalUnidadesValor, ultimoTotalUnidades);

                detalhesContagem[id] = { 
                    deposito: depositoValor, 
                    unidadesAvulsas: unidadesAvulsasValor,
                    freezer: freezerValor,
                    totalUnidades: totalUnidadesValor,
                    gastoEstimado: gastoEstimado,
                    reposicaoEstimada: reposicaoEstimada
                };
                
                if (depositoValor > 0 || unidadesAvulsasValor > 0 || freezerValor > 0) {
                    temDados = true;
                }
            });

            if (!temDados) {
                alert('Nenhuma bebida foi contada. Por favor, adicione dados antes de salvar.');
                return;
            }

            const novaContagem = {
                id: `contagem-${Date.now()}`,
                data: dataContagem,
                responsavel: responsavel,
                detalhesContagem
            };

            setUltimaContagemBebidas(novaContagem);
            saveHistoricoContagensBebidas(novaContagem);
            gerarRelatorioPDFBebidas(novaContagem, 'Relatorio_Contagem_Bebidas');
            formContagemBebidas.reset();
            renderizarBebidasContagem();
        });

        inicializarBebidas();
        renderizarBebidasContagem();
    }


    // --- FUNÇÃO AUXILIAR DE RELATÓRIO ---
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

        let tabelaRows = '';
        Object.keys(contagem.detalhesContagem).forEach(bebidaId => {
            const bebidaInfo = bebidas.find(b => b.id === bebidaId) || { nome: 'Desconhecida', unidade: 'N/A', unidadePorFardo: 1 };
            const dados = contagem.detalhesContagem[bebidaId];
            
            let depositoTexto = '';
            if (bebidaInfo.unidade === 'caixa' || bebidaInfo.unidade === 'fardo') {
                depositoTexto = `${dados.deposito} ${bebidaInfo.unidade}s e ${dados.unidadesAvulsas} unidades`;
            } else {
                depositoTexto = `${dados.unidadesAvulsas} unidades`;
            }

            tabelaRows += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #000;">${bebidaInfo.nome}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${depositoTexto}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.freezer}</td>
                    <td style="padding: 10px; border: 1px solid #000; text-align: center;">${dados.totalUnidades}</td>
                </tr>
            `;
        });
        
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
                        ${tabelaRows}
                    </tbody>
                </table>
                
                <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #6c757d;">
                    Documento gerado em ${dataAtual} às ${horaAtual}.
                </div>
            </div>
        `;

        const options = {
            margin: 0.5,
            filename: `${filenamePrefix}_${contagem.data}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(conteudoRelatorio).save();
    };


    // Lógica para a tela de Estoque de Bebidas (bebidas-estoque.html)
    const tabelaEstoqueBebidasBody = document.getElementById('tabelaEstoqueBebidas');
    const btnGerarPdfEstoqueBebidas = document.getElementById('btnGerarPdfEstoqueBebidas');
    const semEstoqueBebidasText = document.getElementById('semEstoqueBebidas');

    if (tabelaEstoqueBebidasBody && btnGerarPdfEstoqueBebidas) {
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

        btnGerarPdfEstoqueBebidas.addEventListener('click', () => {
            const ultimaContagem = getUltimaContagemBebidas();
            if (ultimaContagem) {
                gerarRelatorioPDFBebidas(ultimaContagem, 'Relatorio_Estoque_Atual_Bebidas');
            } else {
                alert('Não há dados de contagem para gerar o relatório de estoque.');
            }
        });
        
        renderizarEstoqueBebidas();
    }
    
    // Lógica para a tela de Histórico de Contagens de Bebidas (bebidas-historico.html)
    const tabelaHistoricoBebidasBody = document.getElementById('tabelaHistoricoBebidas');
    const semHistoricoBebidasText = document.getElementById('semHistoricoBebidas');

    if (tabelaHistoricoBebidasBody) {
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
                        <button class="btn btn-sm btn-danger btn-excluir-historico" data-id="${contagem.id}"><i class="bi bi-trash"></i></button>
                        <button class="btn btn-sm btn-info btn-baixar-pdf" data-id="${contagem.id}"><i class="bi bi-file-earmark-arrow-down"></i></button>
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
        renderizarHistoricoBebidas();
    }

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

    if (formBebida) {
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

        bebidaUnidadeSelect.addEventListener('change', toggleUnidadesPorFardo);

        const renderizarTabelaBebidas = () => {
            const bebidas = getBebidas();
            tabelaBebidasBody.innerHTML = '';
            if (bebidas.length === 0) {
                semBebidas.style.display = 'block';
                return;
            }
            semBebidas.style.display = 'none';
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

        formBebida.addEventListener('submit', salvarBebida);
        btnCancelarEdicao.addEventListener('click', cancelarEdicao);
        
        inicializarBebidas(); // Inicializa as bebidas antes de renderizar a tabela
        renderizarTabelaBebidas();
        toggleUnidadesPorFardo();
    }
});
