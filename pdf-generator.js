// pdf-generator.js - Sistema dedicado para geração de relatórios PDF

class PDFGenerator {
    constructor() {
        this.templateURL = 'pdf-template.html';
    }

    async gerarRelatorioPDF(contagem, filenamePrefix, tipoRelatorio = 'contagem') {
        try {
            showNotification('Gerando relatório PDF...', 'info');
            
            // Carregar o template
            const templateContent = await this.carregarTemplate();
            
            // Preparar os dados
            const dados = this.prepararDados(contagem, tipoRelatorio);
            
            // Renderizar o template com os dados
            const htmlContent = this.renderizarTemplate(templateContent, dados);
            
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

    async carregarTemplate() {
        const response = await fetch(this.templateURL);
        if (!response.ok) {
            throw new Error('Template de PDF não encontrado');
        }
        return await response.text();
    }

    prepararDados(contagem, tipoRelatorio) {
        const bebidas = AppState.getBebidas();
        const historico = AppState.getHistoricoContagensBebidas();
        const ultimaContagemIndex = historico.findIndex(c => c.id === contagem.id);
        const penultimaContagem = ultimaContagemIndex > 0 ? historico[ultimaContagemIndex - 1] : null;
        const temComparativo = !!penultimaContagem;

        // Agrupar bebidas por categoria
        const bebidasPorCategoria = {};
        bebidas.forEach(bebida => {
            if (!bebidasPorCategoria[bebida.categoria]) {
                bebidasPorCategoria[bebida.categoria] = [];
            }
            bebidasPorCategoria[bebida.categoria].push(bebida);
        });

        return {
            contagem,
            penultimaContagem,
            bebidasPorCategoria,
            temComparativo,
            tipoRelatorio,
            dataAtual: new Date().toLocaleDateString('pt-BR'),
            horaAtual: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    }

    renderizarTemplate(templateContent, dados) {
        const { contagem, penultimaContagem, bebidasPorCategoria, temComparativo, dataAtual, horaAtual } = dados;
        const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const dataContagemAnterior = penultimaContagem ? new Date(penultimaContagem.data + 'T00:00:00').toLocaleDateString('pt-BR') : '';

        // Construir informações da contagem
        const infoBoxContent = `
            <p class="pdf-info-text"><strong>Responsável:</strong> <span class="pdf-highlight">${contagem.responsavel}</span></p>
            <p class="pdf-info-text"><strong>Data da contagem:</strong> ${dataFormatada}</p>
            ${temComparativo ? `<p class="pdf-info-text"><strong>Comparativo com:</strong> ${dataContagemAnterior}</p>` : ''}
            <p class="pdf-info-text"><strong>Nº do Registro:</strong> ${contagem.id}</p>
            <p class="pdf-info-text"><strong>Emitido em:</strong> ${dataAtual} às ${horaAtual}</p>
        `;

        // Construir cabeçalho da tabela
        const tableHeadContent = `
            <tr>
                <th>BEBIDA</th>
                <th>DEPÓSITO</th>
                <th>FREEZER</th>
                <th>TOTAL</th>
                ${temComparativo ? `
                    <th>VARIAÇÃO</th>
                    <th>CONSUMO</th>
                    <th>REPOSIÇÃO</th>
                ` : ''}
            </tr>
        `;

        // Construir corpo da tabela
        let tableBodyContent = '';
        Object.keys(bebidasPorCategoria).sort().forEach(categoria => {
            tableBodyContent += `
                <tr class="pdf-category-row">
                    <td colspan="${temComparativo ? '7' : '4'}">
                        📁 ${categoria}
                    </td>
                </tr>
            `;
            
            bebidasPorCategoria[categoria].forEach(bebida => {
                const dadosBebida = contagem.detalhesContagem[bebida.id] || {};
                const totalUnidades = dadosBebida.totalUnidades || 0;
                
                let depositoUnidades = 0;
                let depositoTexto = '';
                if (bebida.unidade === 'caixa' || bebida.unidade === 'fardo') {
                    depositoUnidades = (dadosBebida.deposito || 0) * bebida.unidadePorFardo;
                    depositoTexto = `${dadosBebida.deposito || 0} ${bebida.unidade === 'caixa' ? 'cx' : 'fd'}`;
                } else {
                    depositoUnidades = dadosBebida.deposito || 0;
                    depositoTexto = `${dadosBebida.deposito || 0} un`;
                }
                
                const freezerUnidades = dadosBebida.freezer || 0;
                
                let gastoEstimado = 0;
                let reposicaoEstimada = 0;
                let variacaoTexto = '→ 0';
                let variacaoClass = '';
                
                if (temComparativo) {
                    const dadosAnteriores = penultimaContagem.detalhesContagem[bebida.id] || {};
                    const totalAnterior = dadosAnteriores.totalUnidades || 0;
                    
                    if (totalUnidades < totalAnterior) {
                        gastoEstimado = totalAnterior - totalUnidades;
                        variacaoTexto = `↓ ${gastoEstimado}`;
                        variacaoClass = 'pdf-consumo';
                    } else if (totalUnidades > totalAnterior) {
                        reposicaoEstimada = totalUnidades - totalAnterior;
                        variacaoTexto = `↑ ${reposicaoEstimada}`;
                        variacaoClass = 'pdf-reposicao';
                    }
                }

                tableBodyContent += `
                    <tr>
                        <td>${bebida.nome}</td>
                        <td style="text-align: center;">${depositoTexto}</td>
                        <td style="text-align: center;">${freezerUnidades}</td>
                        <td style="text-align: center; font-weight: bold; ${totalUnidades === 0 ? 'background-color: #fff3cd;' : ''}">${totalUnidades}</td>
                        ${temComparativo ? `
                            <td style="text-align: center; font-weight: bold;" class="${variacaoClass}">${variacaoTexto}</td>
                            <td style="text-align: center;" class="${gastoEstimado > 0 ? 'pdf-consumo' : ''}">${gastoEstimado}</td>
                            <td style="text-align: center;" class="${reposicaoEstimada > 0 ? 'pdf-reposicao' : ''}">${reposicaoEstimada}</td>
                        ` : ''}
                    </tr>
                `;
            });
        });

        // Construir legenda
        const legendContent = `
            <p><strong>Legenda:</strong> cx = caixa, fd = fardo, un = unidades. 
            ${temComparativo ? '↓ Consumo, ↑ Reposição, → Sem alteração. ' : ''}
            Itens em amarelo indicam estoque zerado.</p>
        `;

        // Substituir os conteúdos dinâmicos no template
        let html = templateContent;
        html = html.replace('<!-- Informações dinâmicas serão inseridas aqui via JavaScript -->', infoBoxContent);
        html = html.replace('<!-- Cabeçalho dinâmico -->', tableHeadContent);
        html = html.replace('<!-- Conteúdo dinâmico -->', tableBodyContent);
        html = html.replace('<!-- Legenda dinâmica -->', legendContent);
        html = html.replace('Documento gerado automaticamente', `Documento gerado automaticamente em ${dataAtual} às ${horaAtual}`);

        return html;
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
