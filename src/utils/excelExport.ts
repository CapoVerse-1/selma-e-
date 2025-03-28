import * as XLSX from 'xlsx';
import { Income, Expense } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
}

export const exportIncomeToExcel = (
  income: Income[],
  options: ExportOptions = {}
) => {
  const { fileName = 'Einnahmen', sheetName = 'Einnahmen' } = options;

  const data = income.map((item) => ({
    'Datum': formatDate(item.date),
    'Betrag (€)': item.amount,
    'Kategorie': item.category,
    'Mandant': item.client,
    'Rechnungsnummer': item.invoiceNumber || '',
    'Beschreibung': item.description,
  }));

  exportToExcel(data, fileName, sheetName);
};

export const exportExpensesToExcel = (
  expenses: Expense[],
  options: ExportOptions = {}
) => {
  const { fileName = 'Ausgaben', sheetName = 'Ausgaben' } = options;

  const data = expenses.map((item) => ({
    'Datum': formatDate(item.date),
    'Betrag (€)': item.amount,
    'Kategorie': item.category,
    'Lieferant': item.vendor,
    'Belegnummer': item.receiptNumber || '',
    'Beschreibung': item.description,
    'Steuerlich absetzbar': item.taxDeductible ? 'Ja' : 'Nein',
  }));

  exportToExcel(data, fileName, sheetName);
};

export const exportFinancialSummaryToExcel = (
  income: Income[],
  expenses: Expense[],
  options: ExportOptions = {}
) => {
  const { fileName = 'Finanzübersicht', sheetName = 'Übersicht' } = options;
  
  // Group entries by month and year
  const entriesByMonth: Record<string, { income: number; expenses: number }> = {};
  
  // Process income
  income.forEach((item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!entriesByMonth[key]) {
      entriesByMonth[key] = { income: 0, expenses: 0 };
    }
    
    entriesByMonth[key].income += item.amount;
  });
  
  // Process expenses
  expenses.forEach((item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!entriesByMonth[key]) {
      entriesByMonth[key] = { income: 0, expenses: 0 };
    }
    
    entriesByMonth[key].expenses += item.amount;
  });
  
  // Convert to array and sort by date
  const summaryData = Object.entries(entriesByMonth)
    .map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      
      return {
        'Monat': format(date, 'MMMM yyyy', { locale: de }),
        'Einnahmen (€)': value.income,
        'Ausgaben (€)': value.expenses,
        'Bilanz (€)': value.income - value.expenses,
      };
    })
    .sort((a, b) => {
      const monthA = a['Monat'].split(' ')[0];
      const yearA = parseInt(a['Monat'].split(' ')[1], 10);
      const monthB = b['Monat'].split(' ')[0];
      const yearB = parseInt(b['Monat'].split(' ')[1], 10);
      
      if (yearA !== yearB) return yearB - yearA;
      return getMonthNumber(monthB) - getMonthNumber(monthA);
    });
  
  // Add totals row
  const totalIncome = summaryData.reduce((sum, item) => sum + item['Einnahmen (€)'], 0);
  const totalExpenses = summaryData.reduce((sum, item) => sum + item['Ausgaben (€)'], 0);
  
  summaryData.push({
    'Monat': 'GESAMT',
    'Einnahmen (€)': totalIncome,
    'Ausgaben (€)': totalExpenses,
    'Bilanz (€)': totalIncome - totalExpenses,
  });
  
  exportToExcel(summaryData, fileName, sheetName);
};

// Helper functions
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: de });
  } catch (error) {
    return dateString;
  }
};

const getMonthNumber = (monthName: string): number => {
  const months: Record<string, number> = {
    'Januar': 0,
    'Februar': 1,
    'März': 2,
    'April': 3,
    'Mai': 4,
    'Juni': 5,
    'Juli': 6,
    'August': 7,
    'September': 8,
    'Oktober': 9,
    'November': 10,
    'Dezember': 11,
  };
  
  return months[monthName] || 0;
};

const exportToExcel = <T extends Record<string, unknown>>(data: T[], fileName: string, sheetName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Auto-size columns
  const colWidths: number[] = [];
  data.forEach((row) => {
    Object.keys(row).forEach((key, i) => {
      const value = String(row[key]);
      colWidths[i] = Math.max(colWidths[i] || 0, key.length, value.length);
    });
  });
  
  // Apply column widths
  worksheet['!cols'] = colWidths.map((width) => ({ width: Math.min(width + 2, 30) }));
  
  // Export workbook
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}; 