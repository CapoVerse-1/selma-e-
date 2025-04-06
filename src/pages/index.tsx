import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income, Expense, MonthlyData } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiArrowUpRight, FiArrowDownRight, FiDollarSign, FiDownload } from 'react-icons/fi';
import { exportFinancialSummaryToExcel } from '@/utils/excelExport';

// Mock data - in a real app, this would come from a database
const mockIncomeData: Income[] = [
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
    date: '2023-04-05',
    amount: 2200.00,
    category: 'Großformatdruck',
    description: 'Messebanner und Displays',
    client: 'Tech Solutions AG',
    invoiceNumber: 'INV-2023-003',
    createdAt: '2023-04-05T09:15:00Z',
    updatedAt: '2023-04-05T09:15:00Z',
  },
];

const mockExpenseData: Expense[] = [
  {
    id: '1',
    date: '2023-03-05',
    amount: 450.00,
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
    amount: 120.00,
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
    date: '2023-04-01',
    amount: 350.00,
    category: 'Maschinenwartung',
    description: 'Wartung Digitaldrucker',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-002',
    taxDeductible: true,
    createdAt: '2023-04-01T15:20:00Z',
    updatedAt: '2023-04-01T15:20:00Z',
  },
];

const Dashboard = () => {
  const [income, setIncome] = useState<Income[]>(mockIncomeData);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenseData);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData | null>(null);
  const [yearlyTotals, setYearlyTotals] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  useEffect(() => {
    // Calculate monthly data
    const monthData: Record<string, MonthlyData> = {};
    
    // Process income
    income.forEach((item: Income) => {
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
    
    // Process expenses
    expenses.forEach((item: Expense) => {
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
    
    // Convert to array and sort by date
    const monthlyDataArray = Object.values(monthData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return getMonthNumber(b.month) - getMonthNumber(a.month);
    });
    
    setMonthlyData(monthlyDataArray);
    
    // Set current month data
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
    setCurrentMonthData(monthData[currentMonthKey] || null);
    
    // Calculate yearly totals
    const currentYear = now.getFullYear();
    const yearlyIncome = income
      .filter((item: Income) => new Date(item.date).getFullYear() === currentYear)
      .reduce((sum: number, item: Income) => sum + item.amount, 0);
      
    const yearlyExpenses = expenses
      .filter((item: Expense) => new Date(item.date).getFullYear() === currentYear)
      .reduce((sum: number, item: Expense) => sum + item.amount, 0);
      
    setYearlyTotals({
      income: yearlyIncome,
      expenses: yearlyExpenses,
      balance: yearlyIncome - yearlyExpenses,
    });
  }, [income, expenses]);

  const getMonthNumber = (monthName: string): number => {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months.indexOf(monthName);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleExportToExcel = () => {
    exportFinancialSummaryToExcel(income, expenses, {
      fileName: `Finanzübersicht_${new Date().toISOString().split('T')[0]}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button 
            onClick={handleExportToExcel}
            className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-4 py-2 border border-gray-300"
          >
            <FiDownload className="mr-2 transition-transform duration-300 group-hover:translate-y-[1px]" />
            Als Excel exportieren
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Einnahmen (Jahresübersicht)</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(yearlyTotals.income)}</p>
              <FiArrowUpRight className="ml-2 text-green-500" />
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ausgaben (Jahresübersicht)</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-red-600">{formatCurrency(yearlyTotals.expenses)}</p>
              <FiArrowDownRight className="ml-2 text-red-500" />
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Bilanz (Jahresübersicht)</h3>
            <div className="flex items-baseline">
              <p className={`text-2xl font-semibold ${yearlyTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(yearlyTotals.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monatliche Übersicht</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Einnahmen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ausgaben
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bilanz
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Keine Daten vorhanden
                    </td>
                  </tr>
                ) : (
                  monthlyData.map((month, index) => (
                    <tr key={`${month.year}-${month.month}`} className={`hover:bg-gray-50 ${index === 0 ? 'font-medium' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.month} {month.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatCurrency(month.totalIncome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {formatCurrency(month.totalExpenses)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(month.balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 