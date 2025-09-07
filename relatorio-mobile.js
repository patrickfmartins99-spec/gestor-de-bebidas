// relatorio-mobile.js - Sistema completo de geração de relatórios
const relatorioGenerator = {
    gerarRelatorio: (dados, filenamePrefix, tipoRelatorio) => {
        // Criar uma nova janela/aba para o relatório
        const janelaRelatorio = window.open('', '_blank');
        
        // Obter dados necessários
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dataFormatada = new Date(dados.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const bebidas = AppState.getBebidas();
        const ultimaContagemAnterior = relatorioGenerator.obterUltimaContagemAnterior(dados.data);
        
        // Agrupar bebidas por categoria
        const categorias = {};
        bebidas.forEach(bebida => {
            if (!categorias[bebida.categoria]) {
                categorias[bebida.categoria] = [];
            }
            categorias[bebida.categoria].push(bebida);
        });
        
        // Construir o HTML do relatório
        let html = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Relatório - La Giovana's Pizzaria</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    color: #333; 
                    background-color: #fff;
                    font-size: 14px;
                }
                .cabecalho { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    border-bottom: 2px solid #dc3545; 
                    padding-bottom: 10px; 
                }
                .titulo { 
                    color: #dc3545; 
                    font-size: 24px; 
                    margin: 0; 
                    font-weight: bold;
                }
                .subtitulo { 
                    color: #6c757d; 
                    font-size: 18px; 
                    margin: 5px 0; 
                }
                .info { 
                    margin-bottom: 20px; 
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #007bff;
                }
                .info-item {
                    margin: 5px 0;
                }
                .categoria { 
                    margin-top: 25px; 
                    font-weight: bold; 
                    color: #495057; 
                    border-bottom: 2px solid #dee2e6; 
                    padding-bottom: 8px;
                    font-size: 16px;
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                }
                .tabela-relatorio {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                    font-size: 12px;
                }
                .tabela-relatorio th {
                    background-color: #343a40;
                    color: white;
                    padding: 8px;
                    text-align: left;
                    border: 1px solid #dee2e6;
                }
                .tabela-relatorio td {
                    padding: 8px;
                    border: 1px solid #dee2e6;
                }
                .tabela-relatorio tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .positivo {
                    color: #28a745;
                    font-weight: bold;
                }
                .negativo {
                    color: #dc3545;
                    font-weight: bold;
                }
                .neutro {
                    color: #6c757d;
                }
                .destaque {
                    background-color: #fff3cd !important;
                }
                .rodape { 
                    margin-top: 30px; 
                    text-align: center; 
                    font-size: 12px; 
                    color: #6c757d; 
                    border-top: 1px solid #dee2e6; 
                    padding-top: 10px; 
                }
                .botoes { 
                    margin: 20px 0; 
                    text-align: center; 
                }
                button { 
                    background: #007bff; 
                    color: white; 
                    border: none; 
                    padding: 10px 15px; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    margin: 0 5px; 
                    font-size: 14px;
                }
                button:hover { 
                    background: #0056b3; 
                }
                .resumo-geral {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #e9ecef;
                    border-radius: 5px;
                    border-left: 4px solid #28a745;
                }
                .resumo-item {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                }
                @media print {
                    .botoes { 
                        display: none; 
                    }
                    body { 
                        margin: 10px; 
                        padding: 0;
                        font-size: 12px;
                    }
                    .info {
                        background-color: transparent;
                        border-left: none;
                        padding: 10px 0;
                    }
                }
                @media (max-width: 768px) {
                    body {
                        margin: 8px;
                    }
                    .titulo {
                        font-size: 20px;
                    }
                    .subtitulo {
                        font-size: 16px;
                    }
                    .tabela-relatorio {
                        font-size: 11px;
                    }
                    .botoes {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    button {
                        margin: 5px 0;
                        width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="cabecalho">
                <h1 class="titulo">La Giovana's Pizzaria</h1>
                <h2 class="subtitulo">${tipoRelatorio === 'contagem' ? 'Relatório de Contagem' : 'Relatório de Estoque'} de Bebidas</h2>
            </div>
            
            <div class="info">
                <div class="info-item"><strong>Responsável:</strong> ${dados.responsavel}</div>
                <div class="info-item"><strong>Data da contagem:</strong> ${dataFormatada}</div>
                <div class="info-item"><strong>Emitido em:</strong> ${dataAtual} às ${horaAtual}</div>
                ${ultimaContagemAnterior ? `<div class="info-item"><strong>Comparativo com:</strong> ${new Date(ultimaContagemAnterior.data + 'T00:00:00').toLocaleDateString('pt-BR')}</div>` : ''}
            </div>
        `;
        
        let totalGeralUnidades = 0;
        let totalGeralGastoEstimado = 0;
        let totalGeralReposicaoEstimada = 0;
        
        // Adicionar conteúdo das categorias
        Object.keys(categorias).sort().forEach(categoria => {
            html += `<div class="categoria">${categoria}</div>`;
            html += `
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>Bebida</th>
                        <th>Depósito</th>
                        <th>Avulsas</th>
                        <th>Freezer</th>
                        <th>Total</th>
                        <th>Gasto Estimado</th>
                        <th>Reposição</th>
                    </tr>
                </thead>
                <tbody>
            `;
            
            categorias[categoria].forEach(bebida => {
                const dadosBebida = dados.detalhesContagem[bebida.id] || {};
                const deposito = dadosBebida.deposito || 0;
                const unidadesAvulsas = dadosBebida.unidadesAvulsas || 0;
                const freezer = dadosBebida.freezer || 0;
                const totalUnidades = dadosBebida.totalUnidades || 0;
                
                // Calcular comparativo com contagem anterior
                let gastoEstimado = 0;
                let reposicaoEstimada = 0;
                let variacaoClass = 'neutro';
                
                if (ultimaContagemAnterior && ultimaContagemAnterior.detalhesContagem[bebida.id]) {
                    const totalAnterior = ultimaContagemAnterior.detalhesContagem[bebida.id].totalUnidades || 0;
                    
                    if (totalUnidades < totalAnterior) {
                        gastoEstimado = totalAnterior - totalUnidades;
                        variacaoClass = 'negativo';
                    } else if (totalUnidades > totalAnterior) {
                        reposicaoEstimada = totalUnidades - totalAnterior;
                        variacaoClass = 'positivo';
                    }
                }
                
                totalGeralUnidades += totalUnidades;
                totalGeralGastoEstimado += gastoEstimado;
                totalGeralReposicaoEstimada += reposicaoEstimada;
                
                html += `
                <tr>
                    <td><strong>${bebida.nome}</strong></td>
                    <td>${deposito} ${bebida.unidade !== 'unidade' ? bebida.unidade + '(s)' : 'unid.'}</td>
                    <td>${unidadesAvulsas} unid.</td>
                    <td>${freezer} unid.</td>
                    <td><strong>${totalUnidades} unid.</strong></td>
                    <td class="${gastoEstimado > 0 ? 'negativo' : 'neutro'}">${gastoEstimado > 0 ? gastoEstimado + ' unid.' : '-'}</td>
                    <td class="${reposicaoEstimada > 0 ? 'positivo' : 'neutro'}">${reposicaoEstimada > 0 ? reposicaoEstimada + ' unid.' : '-'}</td>
                </tr>
                `;
            });
            
            html += `</tbody></table>`;
        });
        
        // Adicionar resumo geral
        html += `
            <div class="resumo-geral">
                <h3 style="margin-top: 0; text-align: center;">Resumo Geral</h3>
                <div class="resumo-item">
                    <span>Total em Estoque:</span>
                    <span><strong>${totalGeralUnidades} unidades</strong></span>
                </div>
                <div class="resumo-item">
                    <span>Gasto Estimado:</span>
                    <span class="${totalGeralGastoEstimado > 0 ? 'negativo' : 'neutro'}"><strong>${totalGeralGastoEstimado} unidades</strong></span>
                </div>
                <div class="resumo-item">
                    <span>Reposição Estimada:</span>
                    <span class="${totalGeralReposicaoEstimada > 0 ? 'positivo' : 'neutro'}"><strong>${totalGeralReposicaoEstimada} unidades</strong></span>
                </div>
            </div>
            
            <div class="rodape">
                La Giovana's Pizzaria - Sistema de Gestão de Estoque<br>
                Documento gerado automaticamente em ${dataAtual} às ${horaAtual}
            </div>
            
            <div class="botoes">
                <button onclick="window.print()">🖨️ Imprimir/Salvar como PDF</button>
                <button onclick="downloadHTML()">📥 Baixar como HTML</button>
                <button onclick="window.close()">❌ Fechar</button>
            </div>
            
            <script>
                function downloadHTML() {
                    const htmlContent = document.documentElement.outerHTML;
                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '${filenamePrefix}_${dataAtual.replace(/\//g, '-')}.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    alert('Relatório baixado com sucesso!');
                }
                
                // Focar na janela ao carregar
                window.focus();
                
                // Ajustar layout para impressão
                window.addEventListener('beforeprint', function() {
                    document.querySelectorAll('.botoes').forEach(el => el.style.display = 'none');
                });
                
                window.addEventListener('afterprint', function() {
                    document.querySelectorAll('.botoes').forEach(el => el.style.display = 'block');
                });
            </script>
        </body>
        </html>`;
        
        // Escrever o HTML na nova janela
        janelaRelatorio.document.write(html);
        janelaRelatorio.document.close();
        
        showNotification('Relatório completo gerado com sucesso! Use os botões para imprimir ou salvar.', 'success');
    },
    
    obterUltimaContagemAnterior: (dataAtual) => {
        const historico = AppState.getHistoricoContagensBebidas();
        const contagensOrdenadas = historico
            .filter(contagem => contagem.data < dataAtual)
            .sort((a, b) => new Date(b.data) - new Date(a.data));
        
        return contagensOrdenadas.length > 0 ? contagensOrdenadas[0] : null;
    }
};
