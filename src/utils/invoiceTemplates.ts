import jsPDF from 'jspdf';
import { ExportTransaction } from './exportUtils';

export interface CompanyInfo {
  name: string;
  gstNo: string;
  address: string;
  email: string;
  phone?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  transaction: ExportTransaction;
  userInfo: any;
  companyInfo: CompanyInfo;
}

export const COMPANY_INFO: CompanyInfo = {
  name: 'SNS Innovation Labs Pvt. Ltd.',
  gstNo: '09ABHCS1973M1ZO',
  address: 'B-2/316, Sector A, Jankipuram, Lucknow, PIN-226021',
  email: 'support@vyakarni.com'
};

export const generateInvoiceNumber = (transactionId: string): string => {
  const currentYear = new Date().getFullYear();
  const shortId = transactionId.slice(-8).toUpperCase();
  return `VYAK-${currentYear}-${shortId}`;
};

export const createProfessionalInvoice = (data: InvoiceData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Company Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(data.companyInfo.name, 20, 25);
  
  doc.setFontSize(10);
  doc.text(`GST No: ${data.companyInfo.gstNo}`, 20, 35);
  doc.text(data.companyInfo.address, 20, 42);
  doc.text(`Email: ${data.companyInfo.email}`, 20, 49);
  
  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', pageWidth - 60, 25);
  
  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Invoice No: ${data.invoiceNumber}`, pageWidth - 80, 35);
  doc.text(`Date: ${data.invoiceDate}`, pageWidth - 80, 42);
  
  // Divider Line
  doc.setLineWidth(0.5);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // Bill To Section
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 70);
  doc.setFontSize(10);
  doc.text(`Name: ${data.userInfo.name || 'N/A'}`, 20, 80);
  doc.text(`Email: ${data.userInfo.email || 'N/A'}`, 20, 87);
  
  // Transaction Details Header
  const startY = 105;
  doc.setFontSize(12);
  doc.text('Transaction Details', 20, startY);
  
  // Table Headers
  const tableStartY = startY + 15;
  doc.setFontSize(10);
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableStartY - 5, pageWidth - 40, 10, 'F');
  
  doc.text('Description', 25, tableStartY);
  doc.text('Date', 90, tableStartY);
  doc.text('Amount (INR)', 140, tableStartY);
  
  // Transaction Row
  const rowY = tableStartY + 15;
  const baseAmount = Math.round(data.transaction.amount / 1.18); // Remove GST to get base
  const gstAmount = data.transaction.amount - baseAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);
  
  doc.text('Vyakarni Word Credits Purchase', 25, rowY);
  doc.text(new Date(data.transaction.created_at).toLocaleDateString('en-IN'), 90, rowY);
  doc.text(baseAmount.toString(), 140, rowY);
  
  // Tax Breakdown
  const taxStartY = rowY + 20;
  doc.text('Tax Breakdown:', 25, taxStartY);
  doc.text(`Base Amount: ₹${baseAmount}`, 25, taxStartY + 10);
  doc.text(`CGST (9%): ₹${cgst}`, 25, taxStartY + 20);
  doc.text(`SGST (9%): ₹${sgst}`, 25, taxStartY + 30);
  
  // Total Section
  doc.setFontSize(12);
  doc.setFillColor(240, 240, 240);
  doc.rect(100, taxStartY + 40, pageWidth - 120, 15, 'F');
  doc.text(`Total Amount: ₹${data.transaction.amount}`, 105, taxStartY + 50);
  
  // Payment Details
  const paymentY = taxStartY + 70;
  doc.setFontSize(10);
  doc.text('Payment Details:', 20, paymentY);
  doc.text(`Payment Method: ${data.transaction.payment_gateway || 'Online'}`, 20, paymentY + 10);
  doc.text(`Transaction ID: ${data.transaction.id}`, 20, paymentY + 20);
  doc.text(`Status: ${data.transaction.status === 'success' ? 'Paid' : 'Pending'}`, 20, paymentY + 30);
  
  // Terms and Conditions
  const termsY = paymentY + 50;
  doc.setFontSize(8);
  doc.text('Terms & Conditions:', 20, termsY);
  doc.text('1. This is a computer-generated invoice and does not require a signature.', 20, termsY + 8);
  doc.text('2. All disputes subject to Lucknow jurisdiction.', 20, termsY + 16);
  doc.text('3. Payment terms: Immediate for online transactions.', 20, termsY + 24);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for using Vyakarni!', pageWidth / 2, 280, { align: 'center' });
  
  return doc;
};

export const createBulkReport = (transactions: ExportTransaction[], userInfo: any): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Company Header
  doc.setFontSize(18);
  doc.text(COMPANY_INFO.name, 20, 25);
  
  doc.setFontSize(10);
  doc.text(`GST No: ${COMPANY_INFO.gstNo}`, 20, 35);
  doc.text(COMPANY_INFO.address, 20, 42);
  
  // Report Title
  doc.setFontSize(16);
  doc.text('BILLING REPORT', pageWidth - 70, 25);
  
  // Report Details
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 80, 35);
  doc.text(`Customer: ${userInfo.name || userInfo.email}`, pageWidth - 80, 42);
  
  // Divider
  doc.line(20, 50, pageWidth - 20, 50);
  
  // Table Headers
  let yPosition = 70;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
  
  doc.text('Date', 25, yPosition);
  doc.text('Amount', 70, yPosition);
  doc.text('Status', 110, yPosition);
  doc.text('Payment Method', 140, yPosition);
  
  // Transactions
  transactions.forEach((transaction, index) => {
    yPosition += 15;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 30;
      
      // Repeat headers on new page
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
      doc.text('Date', 25, yPosition);
      doc.text('Amount', 70, yPosition);
      doc.text('Status', 110, yPosition);
      doc.text('Payment Method', 140, yPosition);
      yPosition += 15;
    }
    
    doc.setFillColor(255, 255, 255);
    doc.text(new Date(transaction.created_at).toLocaleDateString('en-IN'), 25, yPosition);
    doc.text(`₹${transaction.amount}`, 70, yPosition);
    doc.text(transaction.status === 'success' ? 'Paid' : 'Pending', 110, yPosition);
    doc.text(transaction.payment_gateway || 'Online', 140, yPosition);
  });
  
  // Summary
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  
  yPosition += 30;
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
  doc.setFontSize(12);
  doc.text('Summary', 25, yPosition + 5);
  doc.setFontSize(10);
  doc.text(`Total Transactions: ${transactions.length}`, 25, yPosition + 15);
  doc.text(`Successful Payments: ${successfulTransactions}`, 100, yPosition + 15);
  doc.text(`Total Amount: ₹${totalAmount}`, 25, yPosition + 25);
  
  return doc;
};