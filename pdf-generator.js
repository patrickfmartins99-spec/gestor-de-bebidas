// pdf-generator.js

const pdfGenerator = {
    // Função principal que orquestra a geração do PDF
    gerarRelatorioPDF: (dados, filenamePrefix, tipoRelatorio) => {
        let conteudoHTML = '';
        
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        switch (tipoRelatorio) {
            case 'contagem':
                conteudoHTML = pdfGenerator.criarConteudoHTMLContagem(dados, dataAtual, horaAtual);
                break;
            case 'estoque':
                conteudoHTML = pdfGenerator.criarConteudoHTMLEstoque(dados, dataAtual, horaAtual);
                break;
            default:
                showNotification('Tipo de relatório não suportado.', 'warning');
                return;
        }

        const options = {
            margin: [10, 10, 10, 10], // Margem top, right, bottom, left (em mm)
            filename: `${filenamePrefix}_${dataAtual.replace(/\//g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = conteudoHTML;
        tempDiv.style.cssText = 'position: fixed; left: -9999px;';
        document.body.appendChild(tempDiv);

        html2pdf().set(options).from(tempDiv).save().finally(() => {
            document.body.removeChild(tempDiv);
        });
    },

    // Funções para criar o HTML de cada tipo de relatório
    criarConteudoHTMLContagem: (contagem, dataAtual, horaAtual) => {
        const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const bebidas = AppState.getBebidas();

        const bebidasPorCategoria = {};
        bebidas.forEach(bebida => {
            if (!bebidasPorCategoria[bebida.categoria]) {
                bebidasPorCategoria[bebida.categoria] = [];
            }
            bebidasPorCategoria[bebida.categoria].push(bebida);
        });

        let categoriasHTML = '';
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

                bebidasHTML += `
                    <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                        <div style="font-weight: bold;">${bebida.nome}</div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px;">
                            <span>Dep: ${depositoTexto}</span>
                            <span>Freezer: ${freezerUnidades} un</span>
                            <span style="font-weight: bold; background-color: ${totalUnidades === 0 ? '#fff3cd' : 'transparent'}; padding: 0 5px;">
                                Total: ${totalUnidades}
                            </span>
                        </div>
                    </div>
                `;
            });

            categoriasHTML += `
                <div style="margin-bottom: 15px;">
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
                <title>Relatório de Contagem - La Giovana's</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 12px; padding: 10px; color: #333; line-height: 1.4; }
                    .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #dc3545; }
                    .company-name { color: #dc3545; font-size: 18px; font-weight: bold; margin: 0; }
                    .report-title { font-size: 14px; color: #495057; margin: 5px 0; }
                    .info-box { background-color: #f8f9fa; padding: 12px; border-radius: 5px; border-left: 4px solid #dc3545; margin-bottom: 15px; font-size: 11px; }
                    .info-text { margin: 3px 0; }
                    .info-text strong { color: #495057; }
                    .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dee2e6; font-size: 9px; color: #6c757d; }
                    .legend { font-size: 9px; color: #6c757d; margin-top: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 4px; }
                    @media print { body { padding: 5mm; margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="company-name">La Giovana's Pizzaria</h1>
                    <h2 class="report-title">Relatório de Contagem de Bebidas</h2>
                </div>
                
                <div class="info-box">
                    <p class="info-text"><strong>Responsável:</strong> ${contagem.responsavel}</p>
                    <p class="info-text"><strong>Data da contagem:</strong> ${dataFormatada}</p>
                    <p class="info-text"><strong>Emitido em:</strong> ${dataAtual} às ${horaAtual}</p>
                </div>
                
                ${categoriasHTML}
                
                <div class="footer">
                    <p>La Giovana's Pizzaria - Sistema de Gestão de Estoque</p>
                    <p>Documento gerado automaticamente em ${dataAtual} às ${horaAtual}</p>
                </div>
            </body>
            </html>
        `;
    },
    
    criarConteudoHTMLEstoque: (contagem, dataAtual, horaAtual) => {
        const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const bebidas = AppState.getBebidas();

        const bebidasPorCategoria = {};
        bebidas.forEach(bebida => {
            if (!bebidasPorCategoria[bebida.categoria]) {
                bebidasPorCategoria[bebida.categoria] = [];
            }
            bebidasPorCategoria[bebida.categoria].push(bebida);
        });

        let categoriasHTML = '';
        Object.keys(bebidasPorCategoria).sort().forEach(categoria => {
            let bebidasHTML = '';
            bebidasPorCategoria[categoria].forEach(bebida => {
                const totalUnidades = contagem.detalhesContagem[bebida.id]?.totalUnidades || 0;
                bebidasHTML += `
                    <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                        <div style="font-weight: bold;">${bebida.nome}</div>
                        <div style="font-size: 11px;">
                            <span style="font-weight: bold; background-color: ${totalUnidades === 0 ? '#fff3cd' : 'transparent'}; padding: 0 5px;">
                                Total: ${totalUnidades} unidades
                            </span>
                        </div>
                    </div>
                `;
            });

            categoriasHTML += `
                <div style="margin-bottom: 15px;">
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
                <title>Relatório de Estoque - La Giovana's</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 12px; padding: 10px; color: #333; line-height: 1.4; }
                    .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #dc3545; }
                    .company-name { color: #dc3545; font-size: 18px; font-weight: bold; margin: 0; }
                    .report-title { font-size: 14px; color: #495057; margin: 5px 0; }
                    .info-box { background-color: #f8f9fa; padding: 12px; border-radius: 5px; border-left: 4px solid #dc3545; margin-bottom: 15px; font-size: 11px; }
                    .info-text { margin: 3px 0; }
                    .info-text strong { color: #495057; }
                    .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dee2e6; font-size: 9px; color: #6c757d; }
                    .legend { font-size: 9px; color: #6c757d; margin-top: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 4px; }
                    @media print { body { padding: 5mm; margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="company-name">La Giovana's Pizzaria</h1>
                    <h2 class="report-title">Relatório de Estoque de Bebidas</h2>
                </div>
                
                <div class="info-box">
                    <p class="info-text"><strong>Última contagem:</strong> ${dataFormatada} por ${contagem.responsavel}</p>
                    <p class="info-text"><strong>Emitido em:</strong> ${dataAtual} às ${horaAtual}</p>
                </div>
                
                ${categoriasHTML}
                
                <div class="footer">
                    <p>La Giovana's Pizzaria - Sistema de Gestão de Estoque</p>
                    <p>Documento gerado automaticamente em ${dataAtual} às ${horaAtual}</p>
                </div>
            </body>
            </html>
        `;
    }
};
