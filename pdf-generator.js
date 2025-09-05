criarConteudoHTML(dados) {
    const { contagem, penultimaContagem, bebidas, temComparativo, dataAtual, horaAtual } = dados;
    const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
    const dataContagemAnterior = penultimaContagem ? new Date(penultimaContagem.data + 'T00:00:00').toLocaleDateString('pt-BR') : '';

    // Agrupar bebidas por categoria
    const bebidasPorCategoria = {};
    bebidas.forEach(bebida => {
        if (!bebidasPorCategoria[bebida.categoria]) {
            bebidasPorCategoria[bebida.categoria] = [];
        }
        bebidasPorCategoria[bebida.categoria].push(bebida);
    });

    let categoriasHTML = '';

    // Gerar conteúdo organizado por categorias
    Object.keys(bebidasPorCategoria).sort().forEach(categoria => {
        let bebidasHTML = '';
        
        bebidasPorCategoria[categoria].forEach(bebida => {
            const dadosBebida = contagem.detalhesContagem[bebida.id] || {};
            const totalUnidades = dadosBebida.totalUnidades || 0;
            
            let depositoTexto = '';
            if (bebida.unidade === 'caixa' || bebida.unidade === 'fardo') {
                depositoTexto = `${dadosBebida.deposito || 0} ${bebida.unidade === 'caixa' ? 'cx' : 'fd'}`;
            } else {
                depositoTexto = `${dadosBebida.deposito || 0} un`;
            }
            
            const freezerUnidades = dadosBebida.freezer || 0;
            
            let variacaoHTML = '';
            if (temComparativo) {
                const dadosAnteriores = penultimaContagem.detalhesContagem[bebida.id] || {};
                const totalAnterior = dadosAnteriores.totalUnidades || 0;
                
                if (totalUnidades < totalAnterior) {
                    variacaoHTML = `<span style="color: #dc3545;">↓ ${totalAnterior - totalUnidades}</span>`;
                } else if (totalUnidades > totalAnterior) {
                    variacaoHTML = `<span style="color: #198754;">↑ ${totalUnidades - totalAnterior}</span>`;
                } else {
                    variacaoHTML = '<span>→ 0</span>';
                }
            }

            bebidasHTML += `
                <div class="bebida-item" style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: bold; margin-bottom: 4px;">${bebida.nome}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>Dep: ${depositoTexto}</span>
                        <span>Freezer: ${freezerUnidades} un</span>
                        <span style="font-weight: bold; ${totalUnidades === 0 ? 'color: #856404; background-color: #fff3cd; padding: 2px 5px;' : ''}">
                            Total: ${totalUnidades}
                        </span>
                        ${temComparativo ? `<span>Variação: ${variacaoHTML}</span>` : ''}
                    </div>
                </div>
            `;
        });

        categoriasHTML += `
            <div class="categoria" style="margin-bottom: 15px;">
                <div style="background-color: #e9ecef; padding: 8px; font-weight: bold; border-radius: 4px;">
                    ${categoria}
                </div>
                <div style="padding: 10px;">
                    ${bebidasHTML}
                </div>
            </div>
        `;
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Bebidas - La Giovana's</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    font-size: 12px; 
                    padding: 10px; 
                    color: #333;
                    line-height: 1.4;
                    width: 100%;
                    box-sizing: border-box;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 15px; 
                    padding-bottom: 10px; 
                    border-bottom: 2px solid #dc3545; 
                }
                .company-name { 
                    color: #dc3545; 
                    font-size: 18px; 
                    font-weight: bold; 
                    margin: 0; 
                }
                .report-title { 
                    font-size: 14px; 
                    color: #495057; 
                    margin: 5px 0; 
                }
                .info-box { 
                    background-color: #f8f9fa; 
                    padding: 12px; 
                    border-radius: 5px; 
                    border-left: 4px solid #dc3545; 
                    margin-bottom: 15px; 
                    font-size: 11px;
                }
                .info-text { 
                    margin: 3px 0; 
                }
                .info-text strong { 
                    color: #495057; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 20px; 
                    padding-top: 10px; 
                    border-top: 1px solid #dee2e6; 
                    font-size: 9px; 
                    color: #6c757d; 
                }
                .legend {
                    font-size: 9px;
                    color: #6c757d;
                    margin-top: 8px;
                    padding: 8px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                }
                @media print {
                    body { 
                        padding: 5mm; 
                        margin: 0;
                    }
                    .bebida-item {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="company-name">La Giovana's Pizzaria</h1>
                <h2 class="report-title">Relatório de ${temComparativo ? 'Contagem' : 'Estoque'} de Bebidas</h2>
            </div>
            
            <div class="info-box">
                <p class="info-text"><strong>Responsável:</strong> ${contagem.responsavel}</p>
                <p class="info-text"><strong>Data da contagem:</strong> ${dataFormatada}</p>
                ${temComparativo ? `<p class="info-text"><strong>Comparativo com:</strong> ${dataContagemAnterior}</p>` : ''}
                <p class="info-text"><strong>Emitido em:</strong> ${dataAtual} às ${horaAtual}</p>
            </div>
            
            ${categoriasHTML}
            
            <div class="legend">
                <p><strong>Legenda:</strong> cx = caixa, fd = fardo, un = unidades. 
                ${temComparativo ? '↓ Consumo, ↑ Reposição, → Sem alteração. ' : ''}
                Itens em amarelo indicam estoque zerado.</p>
            </div>

            <div class="footer">
                <p>La Giovana's Pizzaria - Sistema de Gestão de Estoque</p>
                <p>Documento gerado automaticamente em ${dataAtual} às ${horaAtual}</p>
            </div>
        </body>
        </html>
    `;
}
