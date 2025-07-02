
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { createProfessionalInvoice, createBulkReport, generateInvoiceNumber, COMPANY_INFO, InvoiceData } from './invoiceTemplates';

export interface ExportTransaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  currency: string;
  payment_gateway: string;
}

// Generate individual professional invoice
export const exportSingleInvoice = (transaction: ExportTransaction, userInfo: any) => {
  const invoiceData: InvoiceData = {
    invoiceNumber: generateInvoiceNumber(transaction.id),
    invoiceDate: new Date().toLocaleDateString('en-IN'),
    transaction,
    userInfo,
    companyInfo: COMPANY_INFO
  };
  
  return createProfessionalInvoice(invoiceData);
};

// Enhanced bulk PDF export with professional formatting
export const exportToPDF = (transactions: ExportTransaction[], userInfo: any) => {
  return createBulkReport(transactions, userInfo);
};

export const exportToExcel = (transactions: ExportTransaction[]) => {
  // Company header information
  const companyData = [
    [COMPANY_INFO.name],
    [`GST No: ${COMPANY_INFO.gstNo}`],
    [COMPANY_INFO.address],
    [`Email: ${COMPANY_INFO.email}`],
    [''],
    ['BILLING REPORT'],
    [`Generated: ${new Date().toLocaleDateString('en-IN')}`],
    [''],
    ['Date', 'Amount (INR)', 'Currency', 'Status', 'Payment Method', 'Payment Gateway', 'Transaction ID']
  ];
  
  const transactionData = transactions.map(transaction => [
    new Date(transaction.created_at).toLocaleDateString('en-IN'),
    transaction.amount,
    transaction.currency,
    transaction.status === 'success' ? 'Paid' : 'Failed',
    transaction.payment_method || 'N/A',
    transaction.payment_gateway || 'N/A',
    transaction.id
  ]);
  
  // Summary section
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  
  const summaryData = [
    [''],
    ['SUMMARY'],
    ['Total Transactions', transactions.length],
    ['Successful Payments', successfulTransactions],
    ['Total Amount (INR)', totalAmount]
  ];
  
  const allData = [...companyData, ...transactionData, ...summaryData];
  
  const ws = XLSX.utils.aoa_to_sheet(allData);
  
  // Set column widths
  ws['!cols'] = [
    { width: 15 }, // Date
    { width: 12 }, // Amount
    { width: 10 }, // Currency
    { width: 10 }, // Status
    { width: 15 }, // Payment Method
    { width: 15 }, // Payment Gateway
    { width: 25 }  // Transaction ID
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Billing Report');
  
  return wb;
};

export const exportToCSV = (transactions: ExportTransaction[]) => {
  const companyHeader = [
    `# ${COMPANY_INFO.name}`,
    `# GST No: ${COMPANY_INFO.gstNo}`,
    `# ${COMPANY_INFO.address}`,
    `# Email: ${COMPANY_INFO.email}`,
    `# Report Generated: ${new Date().toLocaleDateString('en-IN')}`,
    '#'
  ];
  
  const headers = ['Date', 'Amount (INR)', 'Currency', 'Status', 'Payment Method', 'Payment Gateway', 'Transaction ID'];
  
  const transactionRows = transactions.map(transaction => [
    new Date(transaction.created_at).toLocaleDateString('en-IN'),
    transaction.amount,
    transaction.currency,
    transaction.status === 'success' ? 'Paid' : 'Failed',
    transaction.payment_method || 'N/A',
    transaction.payment_gateway || 'N/A',
    transaction.id
  ].join(','));
  
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  
  const summary = [
    '#',
    '# SUMMARY',
    `# Total Transactions: ${transactions.length}`,
    `# Successful Payments: ${successfulTransactions}`,
    `# Total Amount: ${totalAmount} INR`
  ];
  
  const csvContent = [
    ...companyHeader,
    headers.join(','),
    ...transactionRows,
    ...summary
  ].join('\n');
  
  return csvContent;
};
