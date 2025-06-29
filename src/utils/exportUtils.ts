
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ExportTransaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  currency: string;
  payment_gateway: string;
}

export const exportToPDF = (transactions: ExportTransaction[], userInfo: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('व्याकरणी - बिलिंग रिपोर्ट', 20, 30);
  
  // User Info
  doc.setFontSize(12);
  doc.text(`उपयोगकर्ता: ${userInfo.name || 'N/A'}`, 20, 50);
  doc.text(`ईमेल: ${userInfo.email || 'N/A'}`, 20, 60);
  doc.text(`रिपोर्ट तारीख: ${new Date().toLocaleDateString('hi-IN')}`, 20, 70);
  
  // Table Header
  let yPosition = 90;
  doc.setFontSize(10);
  doc.text('तारीख', 20, yPosition);
  doc.text('राशि', 60, yPosition);
  doc.text('स्थिति', 100, yPosition);
  doc.text('भुगतान माध्यम', 130, yPosition);
  
  // Table Data
  transactions.forEach((transaction, index) => {
    yPosition += 10;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(new Date(transaction.created_at).toLocaleDateString('hi-IN'), 20, yPosition);
    doc.text(`₹${transaction.amount}`, 60, yPosition);
    doc.text(transaction.status === 'success' ? 'सफल' : 'असफल', 100, yPosition);
    doc.text(transaction.payment_gateway || 'N/A', 130, yPosition);
  });
  
  // Footer
  doc.setFontSize(8);
  doc.text('यह रिपोर्ट व्याकरणी द्वारा स्वचालित रूप से तैयार की गई है।', 20, 280);
  
  return doc;
};

export const exportToExcel = (transactions: ExportTransaction[]) => {
  const formattedData = transactions.map(transaction => ({
    'तारीख': new Date(transaction.created_at).toLocaleDateString('hi-IN'),
    'राशि': transaction.amount,
    'मुद्रा': transaction.currency,
    'स्थिति': transaction.status === 'success' ? 'सफल' : 'असफल',
    'भुगतान माध्यम': transaction.payment_method || 'N/A',
    'भुगतान गेटवे': transaction.payment_gateway || 'N/A',
    'लेनदेन ID': transaction.id
  }));
  
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Billing History');
  
  return wb;
};

export const exportToCSV = (transactions: ExportTransaction[]) => {
  const headers = ['तारीख', 'राशि', 'मुद्रा', 'स्थिति', 'भुगतान माध्यम', 'भुगतान गेटवे', 'लेनदेन ID'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      new Date(transaction.created_at).toLocaleDateString('hi-IN'),
      transaction.amount,
      transaction.currency,
      transaction.status === 'success' ? 'सफल' : 'असफल',
      transaction.payment_method || 'N/A',
      transaction.payment_gateway || 'N/A',
      transaction.id
    ].join(','))
  ].join('\n');
  
  return csvContent;
};
