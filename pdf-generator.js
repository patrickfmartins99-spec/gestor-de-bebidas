// pdf-generator.js - Sistema independente para geração de PDF

class PDFGenerator {
    async gerarRelatorioPDF(contagem, filenamePrefix, tipoRelatorio = 'contagem') {
        try {
            showNotification('Gerando relatório PDF...', 'info');
            
            // Preparar os dados
            const dados = this.prepararDados(contagem, tipoRelatorio);
            
            // Criar conteúdo HTML diretamente
            const htmlContent = this.criarConteudoHTML(dados);
            
            // Gerar o PDF
            await this.gerarPDF(htmlContent, filenamePrefix);
            
            showNotification('Relatório gerado com sucesso!', 'success');
            return true;
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            showNotification('Erro ao gerar o relatório. Tente novamente.', 'danger');
            return false;
        }
    }

    prepararDados(contagem, tipoRelatorio) {
        const bebidas = AppState.getBebidas();
        const historico = AppState.getHistoricoContagensBebidas();
        const ultimaContagemIndex = historico.findIndex(c => c.id === contagem.id);
        const penultimaContagem = ultimaContagemIndex > 0 ? historico[ultimaContagemIndex - 1] : null;
        const temComparativo = !!penultimaContagem;

        return {
            contagem,
            penultimaContagem,
            bebidas,
            temComparativo,
            tipoRelatorio,
            dataAtual: new Date().toLocaleDateString('pt-BR'),
            horaAtual: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    }

    criarConteudoHTML(dados) {
        const { contagem, penultimaContagem, bebidas, temComparativo, dataAtual, horaAtual } = dados;
        const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const dataContagemAnterior = penultimaContagem ? new Date(penultimaContagem.data + 'T00:00:00').toLocaleDateString('pt-BR') : '';

        // Agrupar bebidas por categoria para melhor organização
        const bebidasPorCategoria = {};
        bebidas.forEach(bebida => {
            if (!bebidasPorCategoria[bebida.categoria]) {
                bebidasPorCategoria[bebida.categoria] = [];
            }
            bebidasPorCategoria[bebida.categoria].push(bebida);
        });

        let tabelaRows = '';

        // Gerar tabela organizada por categorias
        Object.keys(bebidasPorCategoria).sort().forEach(categoria => {
            tabelaRows += `
                <tr style="background-color: #e9ecef;">
                    <td colspan="${temComparativo ? 5 : 4}" style="padding: 8px; font-weight: bold;">
                        ${categoria}
                    </td>
                </tr>
            `;
            
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
                
                let variacaoTexto = '';
                let variacaoStyle = '';
                if (temComparativo) {
                    const dadosAnteriores = penultimaContagem.detalhesContagem[bebida.id] || {};
                    const totalAnterior = dadosAnteriores.totalUnidades || 0;
                    
                    if (totalUnidades < totalAnterior) {
                        variacaoTexto = `↓ ${totalAnterior - totalUnidades}`;
                        variacaoStyle = 'color: #dc3545;';
                    } else if (totalUnidades > totalAnterior) {
                        variacaoTexto = `↑ ${totalUnidades - totalAnterior}`;
                        variacaoStyle = 'color: #198754;';
                    } else {
                        variacaoTexto = '→ 0';
                    }
                }

                tabelaRows += `
                    <tr>
                        <td style="padding: 6px;">${bebida.nome}</td>
                        <td style="padding: 6px; text-align: center;">${depositoTexto}</td>
                        <td style="padding: 6px; text-align: center;">${freezerUnidades}</td>
                        <td style="padding: 6px; text-align: center; font-weight: bold; ${totalUnidades === 0 ? 'background-color: #fff3cd;' : ''}">${totalUnidades}</td>
                        ${temComparativo ? `<td style="padding: 6px; text-align: center; font-weight: bold; ${variacaoStyle}">${variacaoTexto}</td>` : ''}
                    </tr>
                `;
            });
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
                        padding: 20px; 
                        color: #333;
                        line-height: 1.4;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 20px; 
                        padding-bottom: 15px; 
                        border-bottom: 2px solid #dc3545; 
                    }
                    .company-name { 
                        color: #dc3545; 
                        font-size: 22px; 
                        font-weight: bold; 
                        margin: 0; 
                    }
                    .report-title { 
                        font-size: 16px; 
                        color: #495057; 
                        margin: 5px 0; 
                    }
                    .info-box { 
                        background-color: #f8f9fa; 
                        padding: 15px; 
                        border-radius: 5px; 
                        border-left: 4px solid #dc3545; 
                        margin-bottom: 20px; 
                    }
                    .info-text { 
                        margin: 4px 0; 
                        font-size: 12px; 
                    }
                    .info-text strong { 
                        color: #495057; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 15px; 
                        font-size: 11px; 
                    }
                    th { 
                        background-color: #495057; 
                        color: white; 
                        padding: 10px; 
                        border: 1px solid #dee2e6; 
                        text-align: center; 
                        font-weight: bold;
                    }
                    td { 
                        padding: 8px; 
                        border: 1px solid #dee2e6; 
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 25px; 
                        padding-top: 15px; 
                        border-top: 1px solid #dee2e6; 
                        font-size: 10px; 
                        color: #6c757d; 
                    }
                    .legend {
                        font-size: 10px;
                        color: #6c757d;
                        margin-top: 10px;
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
                
                <table>
                    <thead>
                        <tr>
                            <th>Bebida</th>
                            <th>Depósito</th>
                            <th>Freezer</th>
                            <th>Total</th>
                            ${temComparativo ? '<th>Variação</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${tabelaRows}
                    </tbody>
                </table>
                
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

    async gerarPDF(htmlContent, filenamePrefix) {
        return new Promise((resolve, reject) => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            setTimeout(() => {
                const options = {
                    margin: [10, 10, 10, 10],
                    filename: `${filenamePrefix}.pdf`,
                    image: { 
                        type: 'jpeg', 
                        quality: 0.95 
                    },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true, 
                        logging: false,
                        backgroundColor: '#ffffff',
                        width: 800
                    },
                    jsPDF: { 
                        unit: 'mm', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: true
                    }
                };

                html2pdf()
                    .set(options)
                    .from(printWindow.document.body)
                    .save()
                    .then(() => {
                        printWindow.close();
                        resolve();
                    })
                    .catch(error => {
                        printWindow.close();
                        reject(error);
                    });
            }, 500);
        });
    }
}

// Instância global do gerador de PDF
const pdfGenerator = new PDFGenerator();
