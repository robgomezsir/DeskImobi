import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateLeadProposalPDF = async (leadData, simulationResults) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(0, 0, 0); // Pure Black
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('BROKERVISION', 15, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 245, 160); // BV accent (#00F5A0)
  doc.setFont('helvetica', 'normal');
  doc.text('RELATÓRIO DE VIABILIDADE SOBERANA', 15, 32);
  
  // Client Info
  doc.setTextColor(31, 31, 31);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA SIMULAÇÃO', 15, 60);
  doc.line(15, 62, 60, 62);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Valor do Imóvel: ${formatCurrency(simulationResults.propertyValue)}`, 15, 70);
  doc.text(`Entrada: ${formatCurrency(simulationResults.downPayment)}`, 15, 76);
  doc.text(`Prazo: ${simulationResults.termYears} anos`, 15, 82);
  doc.text(`Taxa de Juros: ${simulationResults.interestRate}% ao ano`, 15, 88);
  
  // Results
  doc.setFillColor(245, 245, 245);
  doc.rect(15, 100, pageWidth - 30, 50, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('VALOR DA PARCELA MENSAL', 20, 115);
  
  doc.setFontSize(24);
  doc.setTextColor(0, 245, 160); // BV accent (#00F5A0)
  doc.text(formatCurrency(simulationResults.monthlyPayment), 20, 130);
  
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text(`* Parcelas calculadas pelo Sistema de Amortização Price.`, 20, 140);
  
  // Totals Breakdown
  doc.setTextColor(31, 31, 31);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHAMENTO FINANCEIRO', 15, 170);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Valor Financiado: ${formatCurrency(simulationResults.principal)}`, 15, 180);
  doc.text(`Total de Juros: ${formatCurrency(simulationResults.totalInterest)}`, 15, 186);
  doc.text(`Total Geral Pago: ${formatCurrency(simulationResults.totalPaid)}`, 15, 192);
  
  // AI Insights
  doc.setFillColor(240, 250, 245); // Very light Green
  doc.rect(15, 210, pageWidth - 30, 40, 'F');
  
  doc.setTextColor(0, 168, 84); // BV Green (Darker)
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISE SOBERANA (INTELIGÊNCIA BV)', 20, 222);
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const insightText = `Para este cenário, estima-se que sua renda familiar mensal bruta deva ser superior a ${formatCurrency(simulationResults.monthlyPayment * 3.33)}, garantindo que a parcela não ultrapasse 30% da sua capacidade financeira.`;
  const splitText = doc.splitTextToSize(insightText, pageWidth - 40);
  doc.text(splitText, 20, 230);
  
  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Gerado pelo BrokerVision - The Sovereign Analyst of Real Estate.', pageWidth / 2, 285, { align: 'center' });
  
  doc.save(`Relatorio_BrokerVision_${Date.now()}.pdf`);
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
};
