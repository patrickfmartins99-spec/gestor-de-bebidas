// relatorio-mobile.js
const relatorioGenerator = {
    gerarRelatorio: (dados, filenamePrefix, tipoRelatorio) => {
        // Criar uma nova janela/aba para o relatório
        const janelaRelatorio = window.open('', '_blank');
        
        // Obter dados necessários
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dataFormatada = new Date(dados.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const bebidas = AppState.getBebidas();
        
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
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .cabecalho { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #dc3545; padding-bottom: 10px; }
                .titulo { color: #dc3545; font-size: 24px; margin: 0; }
                .subtitulo { color: #6c757d; font-size: 18px; margin: 5px 0; }
                .info { margin-bottom: 15px; font-size: 14px; }
                .categoria { margin-top: 15px; font-weight: bold; color: #495057; border-bottom: 1px solid #dee2e6; padding-bottom: 5px; }
                .item { margin: 5px 0; padding-left: 15px; font-size: 14px; }
                .rodape { margin-top: 30px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 10px; }
                .botoes { margin: 20px 0; text-align: center; }
                button { background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 0 5px; }
                button:hover { background: #0056b3; }
                @media print {
                    .botoes { display: none; }
                    body { margin: 0; padding: 15px; }
                }
            </style>
        </head>
        <body>
            <div class="cabecalho">
                <h1 class="titulo">La Giovana's Pizzaria</h1>
                <h2 class="subtitulo">${tipoRelatorio === 'contagem' ? 'Relatório de Contagem' : 'Relatório de Estoque'} de Bebidas</h2>
            </div>
            
            <div class="info">
                <p><strong>Responsável:</strong> ${dados.responsavel}</p>
                <p><strong>Data da contagem:</strong> ${dataFormatada}</p>
                <p><strong>Emitido em:</strong> ${dataAtual} às ${horaAtual}</p>
            </div>
        `;
        
        // Adicionar conteúdo das categorias
        Object.keys(categorias).sort().forEach(categoria => {
            html += `<div class="categoria">${categoria}</div>`;
            
            categorias[categoria].forEach(bebida => {
                const dadosBebida = dados.detalhesContagem[bebida.id] || {};
                const totalUnidades = dadosBebida.totalUnidades || 0;
                
                html += `
                <div class="item">
                    ${bebida.nome} - <strong>${totalUnidades} unidades</strong>
                </div>`;
            });
        });
        
        // Rodapé e botões
        html += `
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
                }
            </script>
        </body>
        </html>`;
        
        // Escrever o HTML na nova janela
        janelaRelatorio.document.write(html);
        janelaRelatorio.document.close();
        
        showNotification('Relatório gerado com sucesso!', 'success');
    }
};
