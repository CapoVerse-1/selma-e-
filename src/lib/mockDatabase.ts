import { Income, Expense, MonthlyData } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Mock-Daten - dies würde in einer echten App aus einer Datenbank kommen
export const mockIncomeData: Income[] = [
  // März 2023
  {
    id: '1',
    date: '2023-03-10',
    amount: 1500.00,
    category: 'Druckaufträge',
    description: 'Broschüren-Druck für Marketingkampagne',
    client: 'Schmidt GmbH',
    invoiceNumber: 'INV-2023-001',
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2023-03-10T10:00:00Z',
  },
  {
    id: '2',
    date: '2023-03-15',
    amount: 950.00,
    category: 'Digitaldruck',
    description: 'Visitenkarten und Briefpapier',
    client: 'M. Müller',
    invoiceNumber: 'INV-2023-002',
    createdAt: '2023-03-15T14:30:00Z',
    updatedAt: '2023-03-15T14:30:00Z',
  },
  {
    id: '253',
    date: '2024-08-03',
    amount: 670.00,
    category: 'Großformatdruck',
    description: 'Werbetafeln für Produkteinführung',
    client: 'Autohaus Fahrspaß',
    invoiceNumber: 'INV-2024-063',
    createdAt: '2024-08-03T09:00:00Z',
    updatedAt: '2024-08-03T09:00:00Z',
  }
];

// Ausgaben-Daten - dies würde in einer echten App aus einer Datenbank kommen
export const mockExpenseData: Expense[] = [
  // März 2023
  {
    id: '1001',
    date: '2023-03-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete März',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-03-01T08:00:00Z',
    updatedAt: '2023-03-01T08:00:00Z',
  },
  // September 2023
  {
    id: '263',
    date: '2023-09-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete September',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-09-01T08:10:00Z',
    updatedAt: '2023-09-01T08:10:00Z',
  },
  {
    id: '264',
    date: '2023-09-04',
    amount: 78.00,
    category: 'Büromaterial',
    description: 'Bürobedarf monatlich',
    vendor: 'Office Supplies GmbH',
    receiptNumber: 'R-2023-264',
    taxDeductible: true,
    createdAt: '2023-09-04T11:30:00Z',
    updatedAt: '2023-09-04T11:30:00Z',
  },
  {
    id: '331',
    date: '2024-03-13',
    amount: 98.00,
    category: 'Telekommunikation',
    description: 'Geschäftshandyvertrag',
    vendor: 'TeleMobil GmbH',
    receiptNumber: 'R-2024-023',
    taxDeductible: true,
    createdAt: '2024-03-13T16:15:00Z',
    updatedAt: '2024-03-13T16:15:00Z',
  }
];

// Hilfsfunktionen zur Simulation von API-Aufrufen
export async function fetchIncome(): Promise<Income[]> {
  // Simulierte Verzögerung, um einen echten API-Aufruf nachzuahmen
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIncomeData;
}

export async function fetchExpenses(): Promise<Expense[]> {
  // Simulierte Verzögerung, um einen echten API-Aufruf nachzuahmen
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockExpenseData;
}

export async function fetchMonthlyData(): Promise<MonthlyData[]> {
  // Simulierte Verzögerung, um einen echten API-Aufruf nachzuahmen
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Berechne die Monatsdaten aus den Einnahmen und Ausgaben
  const monthData: Record<string, MonthlyData> = {};
  
  // Verarbeite Einnahmen
  mockIncomeData.forEach((item: Income) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const key = `${year}-${month}`;
    if (!monthData[key]) {
      const monthName = format(date, 'MMMM', { locale: de }) as any;
      monthData[key] = {
        month: monthName,
        year,
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      };
    }
    
    monthData[key].totalIncome += item.amount;
    monthData[key].balance += item.amount;
  });
  
  // Verarbeite Ausgaben
  mockExpenseData.forEach((item: Expense) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const key = `${year}-${month}`;
    if (!monthData[key]) {
      const monthName = format(date, 'MMMM', { locale: de }) as any;
      monthData[key] = {
        month: monthName,
        year,
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
      };
    }
    
    monthData[key].totalExpenses += item.amount;
    monthData[key].balance -= item.amount;
  });
  
  // Konvertiere in Array und sortiere nach Datum (neueste zuerst)
  const monthlyDataArray = Object.values(monthData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return getMonthNumber(b.month) - getMonthNumber(a.month);
  });
  
  return monthlyDataArray;
}

// Hilfsfunktion zur Konvertierung des Monatsnamens in eine Zahl
function getMonthNumber(monthName: string): number {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  return months.indexOf(monthName);
}

// Hilfsfunktion zur Berechnung der Jahrestotale
export async function fetchYearlyTotals(year: number = new Date().getFullYear()): Promise<{
  income: number;
  expenses: number;
  balance: number;
}> {
  // Simulierte Verzögerung, um einen echten API-Aufruf nachzuahmen
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const yearlyIncome = mockIncomeData
    .filter((item: Income) => new Date(item.date).getFullYear() === year)
    .reduce((sum: number, item: Income) => sum + item.amount, 0);
    
  const yearlyExpenses = mockExpenseData
    .filter((item: Expense) => new Date(item.date).getFullYear() === year)
    .reduce((sum: number, item: Expense) => sum + item.amount, 0);
    
  return {
    income: yearlyIncome,
    expenses: yearlyExpenses,
    balance: yearlyIncome - yearlyExpenses,
  };
}

// Diese Funktion kann später gegen Supabase ausgetauscht werden
export async function saveIncome(income: Income): Promise<Income> {
  // Simulierte Verzögerung, um einen echten API-Aufruf nachzuahmen
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Hier würde der echte Speichervorgang zur Datenbank stattfinden
  return {
    ...income,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Diese Funktion kann später gegen Supabase ausgetauscht werden
export async function saveExpense(expense: Expense): Promise<Expense> {
  // Simulierte Verzögerung, um einen echten API-Aufruf nachzuahmen
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Hier würde der echte Speichervorgang zur Datenbank stattfinden
  return {
    ...expense,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
} 