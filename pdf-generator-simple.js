// pdf-generator-simple.js

const pdfGenerator = {
    gerarRelatorioPDF: (dados, filenamePrefix, tipoRelatorio) => {
        // Importação dinâmica para evitar problemas de carregamento
        import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
            .then((jsPDFModule) => {
                const { jsPDF } = jsPDFModule;
                const doc = new jsPDF();
                
                // Adicionar conteúdo com base no tipo de relatório
                if (tipoRelatorio === 'contagem') {
                    pdfGenerator.adicionarContagem(doc, dados);
                } else if (tipoRelatorio === 'estoque') {
                    pdfGenerator.adicionarEstoque(doc, dados);
                }
                
                // Salvar o PDF
                doc.save(`${filenamePrefix}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
            })
            .catch(error => {
                console.error('Erro ao carregar jsPDF:', error);
                showNotification('Erro ao gerar PDF. Verifique sua conexão.', 'danger');
            });
    },

    adicionarContagem: (doc, contagem) => {
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const bebidas = AppState.getBebidas();

        // Cabeçalho
        doc.setFontSize(18);
        doc.setTextColor(220, 53, 69);
        doc.text("La Giovana's Pizzaria", 105, 15, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(73, 80, 87);
        doc.text("Relatório de Contagem de Bebidas", 105, 22, { align: 'center' });
        
        // Informações
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Responsável: ${contagem.responsavel}`, 20, 35);
        doc.text(`Data da contagem: ${dataFormatada}`, 20, 40);
        doc.text(`Emitido em: ${dataAtual} às ${horaAtual}`, 20, 45);
        
        // Conteúdo das bebidas
        let yPosition = 60;
        const categorias = {};
        
        // Agrupar bebidas por categoria
        bebidas.forEach(bebida => {
            if (!categorias[bebida.categoria]) {
                categorias[bebida.categoria] = [];
            }
            categorias[bebida.categoria].push(bebida);
        });
        
        // Adicionar cada categoria
        Object.keys(categorias).sort().forEach(categoria => {
            // Título da categoria
            doc.setFontSize(12);
            doc.setTextColor(33, 37, 41);
            doc.text(categoria, 20, yPosition);
            yPosition += 8;
            
            // Itens da categoria
            doc.setFontSize(10);
            categorias[categoria].forEach(bebida => {
                const dadosBebida = contagem.detalhesContagem[bebida.id] || {};
                const totalUnidades = dadosBebida.totalUnidades || 0;
                
                let textoLinha = `${bebida.nome} - Total: ${totalUnidades} unidades`;
                
                // Quebra de linha se necessário
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.text(textoLinha, 25, yPosition);
                yPosition += 7;
            });
            
            yPosition += 5; // Espaço entre categorias
        });
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(108, 117, 125);
        doc.text("La Giovana's Pizzaria - Sistema de Gestão de Estoque", 105, 280, { align: 'center' });
        doc.text(`Documento gerado automaticamente em ${dataAtual} às ${horaAtual}`, 105, 285, { align: 'center' });
    },

    adicionarEstoque: (doc, contagem) => {
        // Implementação similar à adicionarContagem, mas focada no estoque
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dataFormatada = new Date(contagem.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const bebidas = AppState.getBebidas();

        // Cabeçalho
        doc.setFontSize(18);
        doc.setTextColor(220, 53, 69);
        doc.text("La Giovana's Pizzaria", 105, 15, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(73, 80, 87);
        doc.text("Relatório de Estoque de Bebidas", 105, 22, { align: 'center' });
        
        // Informações
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Última contagem: ${dataFormatada} por ${contagem.responsavel}`, 20, 35);
        doc.text(`Emitido em: ${dataAtual} às ${horaAtual}`, 20, 40);
        
        // Conteúdo (similar ao método adicionarContagem)
        let yPosition = 55;
        const categorias = {};
        
        bebidas.forEach(bebida => {
            if (!categorias[bebida.categoria]) {
                categorias[bebida.categoria] = [];
            }
            categorias[bebida.categoria].push(bebida);
        });
        
        Object.keys(categorias).sort().forEach(categoria => {
            doc.setFontSize(12);
            doc.setTextColor(33, 37, 41);
            doc.text(categoria, 20, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            categorias[categoria].forEach(bebida => {
                const totalUnidades = contagem.detalhesContagem[bebida.id]?.totalUnidades || 0;
                
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.text(`${bebida.nome} - ${totalUnidades} unidades`, 25, yPosition);
                yPosition += 7;
            });
            
            yPosition += 5;
        });
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(108, 117, 125);
        doc.text("La Giovana's Pizzaria - Sistema de Gestão de Estoque", 105, 280, { align: 'center' });
        doc.text(`Documento gerado automaticamente em ${dataAtual} às ${horaAtual}`, 105, 285, { align: 'center' });
    }
};
