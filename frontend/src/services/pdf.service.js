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

/**
 * Relatório da calculadora de fluxo (entrada / mensais / intercaladas / chaves).
 * @param {{ projectName: string; unit: string; valorTotal: number; rows: Array<{ label: string; pct: number; parcelas: number; totalFase: number; valorParcela: number }> }} payload
 */
export const generateFlowPaymentPDF = async (payload) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 36, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('BROKERVISION', 15, 18);
  doc.setFontSize(9);
  doc.setTextColor(0, 245, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('CALCULADORA DE FLUXO DE PAGAMENTO', 15, 28);
  y = 48;

  doc.setTextColor(31, 31, 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DADOS DO EMPREENDIMENTO', 15, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nome: ${payload.projectName || '—'}`, 15, y);
  y += 6;
  doc.text(`Unidade: ${payload.unit?.trim() ? payload.unit : '—'}`, 15, y);
  y += 6;
  doc.text(`Valor total do imóvel: ${formatCurrency(payload.valorTotal)}`, 15, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DISTRIBUIÇÃO POR FASE', 15, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Fase | % | Parcelas | Total da fase | Valor por parcela', 15, y);
  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, pageWidth - 15, y);
  y += 6;
  doc.setTextColor(31, 31, 31);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  for (const row of payload.rows) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const line = `${row.label} | ${row.pct}% | ${row.parcelas} | ${formatCurrency(row.totalFase)} | ${formatCurrency(row.valorParcela)}`;
    const wrapped = doc.splitTextToSize(line, pageWidth - 30);
    doc.text(wrapped, 15, y);
    y += wrapped.length * 5 + 3;
  }

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const note =
    '* Valores por parcela = (valor total × percentagem da fase) ÷ número de parcelas. Cada % é independente sobre o valor total.';
  doc.text(doc.splitTextToSize(note, pageWidth - 30), 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Gerado pelo BrokerVision.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Fluxo_Pagamento_BrokerVision_${Date.now()}.pdf`);
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
};
