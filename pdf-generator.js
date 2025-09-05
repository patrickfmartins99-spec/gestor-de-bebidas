// pdf-generator.js - Sistema independente para geração de PDF

class PDFGenerator {
    async gerarRelatorioPDF(contagem, filenamePrefix, tipoRelatorio = 'contagem') {
        try {
            showNotification('Gerando relatório PDF...', 'info');
            
            // Preparar os dados
            const dados = this.prepararDados(contagem, tipoRelatorio);
            
            // Criar conteúdo HTML diretamente
            const htmlContent = this.criarConteudoHTML(dados);
            
            // Gerar o PDF diretamente sem abrir nova janela
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
                        <td style="padding: 6px; width: 25%;">${bebida.nome}</td>
                        <td style="padding: 6px; text-align: center; width: 15%;">${depositoTexto}</td>
                        <td style="padding: 6px; text-align: center; width: 15%;">${freezerUnidades}</td>
                        <td style="padding: 6px; text-align: center; font-weight: bold; width: 15%; ${totalUnidades === 0 ? 'background-color: #fff3cd;' : ''}">${totalUnidades}</td>
                        ${temComparativo ? `<td style="padding: 6px; text-align: center; font-weight: bold; width: 15%; ${variacaoStyle}">${variacaoTexto}</td>` : ''}
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
                        font-size: 20px; 
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
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 12px; 
                        font-size: 10px;
                        table-layout: fixed;
                    }
                    th { 
                        background-color: #495057; 
                        color: white; 
                        padding: 8px 4px; 
                        border: 1px solid #dee2e6; 
                        text-align: center; 
                        font-weight: bold;
                        font-size: 10px;
                    }
                    td { 
                        padding: 6px 4px; 
                        border: 1px solid #dee2e6; 
                        word-wrap: break-word;
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
                    }
                    @media print {
                        body { 
                            padding: 5mm; 
                            margin: 0;
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
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Bebida</th>
                            <th style="width: 15%;">Depósito</th>
                            <th style="width: 15%;">Freezer</th>
                            <th style="width: 15%;">Total</th>
                            ${temComparativo ? '<th style="width: 15%;">Variação</th>' : ''}
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
            // Criar elemento temporário em vez de nova janela
            const element = document.createElement('div');
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.innerHTML = htmlContent;
            document.body.appendChild(element);

            const options = {
                margin: [5, 5, 5, 5],
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
                    width: 800,
                    height: element.scrollHeight
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
                .from(element)
                .save()
                .then(() => {
                    document.body.removeChild(element);
                    resolve();
                })
                .catch(error => {
                    document.body.removeChild(element);
                    reject(error);
                });
        });
    }
}

// Instância global do gerador de PDF
const pdfGenerator = new PDFGenerator();
