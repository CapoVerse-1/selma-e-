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
    id: '3',
    date: '2023-03-22',
    amount: 780.00,
    category: 'Siebdruck',
    description: 'T-Shirt-Druck für Firmenveranstaltung',
    client: 'EventPro GmbH',
    invoiceNumber: 'INV-2023-003',
    createdAt: '2023-03-22T11:00:00Z',
    updatedAt: '2023-03-22T11:00:00Z',
  },
  // Zusätzliche Einträge für März 2023
  {
    id: '101',
    date: '2023-03-02',
    amount: 620.00,
    category: 'Druckaufträge',
    description: 'Flyer für lokale Veranstaltung',
    client: 'Stadtmarketing GmbH',
    invoiceNumber: 'INV-2023-101',
    createdAt: '2023-03-02T09:30:00Z',
    updatedAt: '2023-03-02T09:30:00Z',
  },
  {
    id: '102',
    date: '2023-03-04',
    amount: 850.00,
    category: 'Großformatdruck',
    description: 'Poster für Galerieeröffnung',
    client: 'Kunstgalerie Modern',
    invoiceNumber: 'INV-2023-102',
    createdAt: '2023-03-04T11:15:00Z',
    updatedAt: '2023-03-04T11:15:00Z',
  },
  {
    id: '103',
    date: '2023-03-08',
    amount: 320.00,
    category: 'Digitaldruck',
    description: 'Broschüren für Patienteninformation',
    client: 'Praxis Dr. Schneider',
    invoiceNumber: 'INV-2023-103',
    createdAt: '2023-03-08T14:00:00Z',
    updatedAt: '2023-03-08T14:00:00Z',
  },
  {
    id: '104',
    date: '2023-03-12',
    amount: 480.00,
    category: 'Buchdruck',
    description: 'Selbstpubliziertes Buch',
    client: 'Autor Klaus Weber',
    invoiceNumber: 'INV-2023-104',
    createdAt: '2023-03-12T10:45:00Z',
    updatedAt: '2023-03-12T10:45:00Z',
  },
  {
    id: '105',
    date: '2023-03-18',
    amount: 290.00,
    category: 'Siebdruck',
    description: 'Werbegeschenke mit Logo',
    client: 'Versicherung Müller AG',
    invoiceNumber: 'INV-2023-105',
    createdAt: '2023-03-18T15:30:00Z',
    updatedAt: '2023-03-18T15:30:00Z',
  },
  {
    id: '106',
    date: '2023-03-24',
    amount: 740.00,
    category: 'Druckaufträge',
    description: 'Katalog für Frühjahrssortiment',
    client: 'Modehaus Chic',
    invoiceNumber: 'INV-2023-106',
    createdAt: '2023-03-24T13:15:00Z',
    updatedAt: '2023-03-24T13:15:00Z',
  },
  {
    id: '107',
    date: '2023-03-27',
    amount: 920.00,
    category: 'Großformatdruck',
    description: 'Baustellenbanner',
    client: 'Bau & Projektierung GmbH',
    invoiceNumber: 'INV-2023-107',
    createdAt: '2023-03-27T09:00:00Z',
    updatedAt: '2023-03-27T09:00:00Z',
  },
  {
    id: '108',
    date: '2023-03-29',
    amount: 540.00,
    category: 'Digitaldruck',
    description: 'Schulungsunterlagen',
    client: 'Bildungszentrum Zukunft',
    invoiceNumber: 'INV-2023-108',
    createdAt: '2023-03-29T14:45:00Z',
    updatedAt: '2023-03-29T14:45:00Z',
  },
  {
    id: '109',
    date: '2023-03-30',
    amount: 380.00,
    category: 'Siebdruck',
    description: 'T-Shirts für Sportverein',
    client: 'TSV Blau-Weiß',
    invoiceNumber: 'INV-2023-109',
    createdAt: '2023-03-30T10:30:00Z',
    updatedAt: '2023-03-30T10:30:00Z',
  },
  // April 2023
  {
    id: '4',
    date: '2023-04-05',
    amount: 2200.00,
    category: 'Großformatdruck',
    description: 'Messebanner und Displays',
    client: 'Tech Solutions AG',
    invoiceNumber: 'INV-2023-004',
    createdAt: '2023-04-05T09:15:00Z',
    updatedAt: '2023-04-05T09:15:00Z',
  },
  {
    id: '5',
    date: '2023-04-12',
    amount: 3400.00,
    category: 'Druckaufträge',
    description: 'Produktkataloge mit Spezialpapier',
    client: 'Möbel Meister KG',
    invoiceNumber: 'INV-2023-005',
    createdAt: '2023-04-12T13:45:00Z',
    updatedAt: '2023-04-12T13:45:00Z',
  },
  {
    id: '6',
    date: '2023-04-18',
    amount: 560.00,
    category: 'Digitaldruck',
    description: 'Flyer für Saisonverkauf',
    client: 'Mode Express GmbH',
    invoiceNumber: 'INV-2023-006',
    createdAt: '2023-04-18T10:30:00Z',
    updatedAt: '2023-04-18T10:30:00Z',
  },
  // Weitere Einträge für andere Monate...
];

export const mockExpenseData: Expense[] = [
  // März 2023
  {
    id: '1',
    date: '2023-03-05',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete März',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-03-05T08:00:00Z',
    updatedAt: '2023-03-05T08:00:00Z',
  },
  {
    id: '2',
    date: '2023-03-12',
    amount: 720.00,
    category: 'Druckmaterial',
    description: 'Toner und Spezialpapier',
    vendor: 'Print Supply Store',
    receiptNumber: 'R-2023-001',
    taxDeductible: true,
    createdAt: '2023-03-12T11:45:00Z',
    updatedAt: '2023-03-12T11:45:00Z',
  },
  {
    id: '3',
    date: '2023-03-18',
    amount: 180.00,
    category: 'Versicherungen',
    description: 'Betriebshaftpflicht Quartalsbeitrag',
    vendor: 'AllSecure Versicherungen',
    receiptNumber: 'R-2023-003',
    taxDeductible: true,
    createdAt: '2023-03-18T14:30:00Z',
    updatedAt: '2023-03-18T14:30:00Z',
  },
  // Zusätzliche Einträge für März 2023
  {
    id: '201',
    date: '2023-03-02',
    amount: 85.00,
    category: 'Druckmaterial',
    description: 'Spezialpapier Premium',
    vendor: 'Paper Wholesale GmbH',
    receiptNumber: 'R-2023-201',
    taxDeductible: true,
    createdAt: '2023-03-02T10:15:00Z',
    updatedAt: '2023-03-02T10:15:00Z',
  },
  {
    id: '202',
    date: '2023-03-04',
    amount: 120.00,
    category: 'Büromaterial',
    description: 'Schreibwaren und Organisationsmaterial',
    vendor: 'Office Center GmbH',
    receiptNumber: 'R-2023-202',
    taxDeductible: true,
    createdAt: '2023-03-04T13:30:00Z',
    updatedAt: '2023-03-04T13:30:00Z',
  },
  {
    id: '203',
    date: '2023-03-07',
    amount: 45.00,
    category: 'Marketing',
    description: 'Social Media Werbung',
    vendor: 'Online Marketing Pro',
    receiptNumber: 'R-2023-203',
    taxDeductible: true,
    createdAt: '2023-03-07T09:00:00Z',
    updatedAt: '2023-03-07T09:00:00Z',
  },
  {
    id: '204',
    date: '2023-03-11',
    amount: 65.00,
    category: 'Infrastruktur',
    description: 'Hosting & Domain-Gebühren',
    vendor: 'Web Services Pro',
    receiptNumber: 'R-2023-204',
    taxDeductible: true,
    createdAt: '2023-03-11T11:30:00Z',
    updatedAt: '2023-03-11T11:30:00Z',
  },
  {
    id: '205',
    date: '2023-03-15',
    amount: 320.00,
    category: 'Druckmaterial',
    description: 'Spezialfarben für Siebdruck',
    vendor: 'ColorExpert GmbH',
    receiptNumber: 'R-2023-205',
    taxDeductible: true,
    createdAt: '2023-03-15T14:45:00Z',
    updatedAt: '2023-03-15T14:45:00Z',
  },
  {
    id: '206',
    date: '2023-03-20',
    amount: 250.00,
    category: 'Maschinenwartung',
    description: 'Kleinere Reparatur Digitaldrucker',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-206',
    taxDeductible: true,
    createdAt: '2023-03-20T10:00:00Z',
    updatedAt: '2023-03-20T10:00:00Z',
  },
  {
    id: '207',
    date: '2023-03-24',
    amount: 130.00,
    category: 'Büromaterial',
    description: 'Bindegeräte-Zubehör',
    vendor: 'Office Supply Store',
    receiptNumber: 'R-2023-207',
    taxDeductible: true,
    createdAt: '2023-03-24T13:15:00Z',
    updatedAt: '2023-03-24T13:15:00Z',
  },
  {
    id: '208',
    date: '2023-03-28',
    amount: 75.00,
    category: 'Marketing',
    description: 'Branchenbucheintrag',
    vendor: 'Branchenverzeichnis Druck',
    receiptNumber: 'R-2023-208',
    taxDeductible: true,
    createdAt: '2023-03-28T15:45:00Z',
    updatedAt: '2023-03-28T15:45:00Z',
  },
  {
    id: '209',
    date: '2023-03-31',
    amount: 190.00,
    category: 'Betriebskosten',
    description: 'Stromkosten Druckwerkstatt',
    vendor: 'Energieversorger Stadt',
    receiptNumber: 'R-2023-209',
    taxDeductible: true,
    createdAt: '2023-03-31T09:30:00Z',
    updatedAt: '2023-03-31T09:30:00Z',
  },
  // April 2023
  {
    id: '4',
    date: '2023-04-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete April',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-04-01T09:00:00Z',
    updatedAt: '2023-04-01T09:00:00Z',
  },
  {
    id: '5',
    date: '2023-04-10',
    amount: 350.00,
    category: 'Maschinenwartung',
    description: 'Wartung Digitaldrucker',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-004',
    taxDeductible: true,
    createdAt: '2023-04-10T15:20:00Z',
    updatedAt: '2023-04-10T15:20:00Z',
  },
  {
    id: '6',
    date: '2023-04-22',
    amount: 850.00,
    category: 'Druckmaterial',
    description: 'Spezialfarben und Folien',
    vendor: 'ColorExpert GmbH',
    receiptNumber: 'R-2023-005',
    taxDeductible: true,
    createdAt: '2023-04-22T10:15:00Z',
    updatedAt: '2023-04-22T10:15:00Z',
  },
  // Weitere Einträge für andere Monate...
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