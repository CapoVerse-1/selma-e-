import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income, Expense, MonthlyData } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  FiDownload, 
  FiBarChart2, 
  FiTrendingUp, 
  FiTrendingDown 
} from 'react-icons/fi';
import { exportFinancialSummaryToExcel } from '@/utils/excelExport';

// Mock data - in a real app, this would come from a database
const mockIncomeData: Income[] = [
  {
    id: '1',
    date: '2023-03-10',
    amount: 1500.00,
    category: 'Mandatsgebühren',
    description: 'Vertretung im Zivilrechtsfall',
    client: 'Schmidt GmbH',
    invoiceNumber: 'INV-2023-001',
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2023-03-10T10:00:00Z',
  },
  {
    id: '2',
    date: '2023-03-15',
    amount: 950.00,
    category: 'Beratungsgebühren',
    description: 'Rechtliche Beratung zum Arbeitsrecht',
    client: 'M. Müller',
    invoiceNumber: 'INV-2023-002',
    createdAt: '2023-03-15T14:30:00Z',
    updatedAt: '2023-03-15T14:30:00Z',
  },
  {
    id: '3',
    date: '2023-04-05',
    amount: 2200.00,
    category: 'Mandatsgebühren',
    description: 'Vertretung im Handelsrechtsfall',
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
    category: 'Büromaterial',
    description: 'Druckerpapier, Stifte, Ordner',
    vendor: 'Office Supply Store',
    receiptNumber: 'R-2023-001',
    taxDeductible: true,
    createdAt: '2023-03-12T11:45:00Z',
    updatedAt: '2023-03-12T11:45:00Z',
  },
  {
    id: '3',
    date: '2023-04-01',
    amount: 350.00,
    category: 'Software & Lizenzen',
    description: 'Buchhaltungssoftware Jahresabonnement',
    vendor: 'Software Solutions GmbH',
    receiptNumber: 'R-2023-002',
    taxDeductible: true,
    createdAt: '2023-04-01T15:20:00Z',
    updatedAt: '2023-04-01T15:20:00Z',
  },
];

const ReportsPage = () => {
  const [income, setIncome] = useState<Income[]>(mockIncomeData);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenseData);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string>('thisYear');
  const [categoryData, setCategoryData] = useState<{
    incomeByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }>({
    incomeByCategory: {},
    expensesByCategory: {},
  });

  useEffect(() => {
    // Calculate filtered data based on period filter
    let filteredIncome = [...income];
    let filteredExpenses = [...expenses];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    if (periodFilter === 'thisMonth') {
      filteredIncome = income.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
      
      filteredExpenses = expenses.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
    } else if (periodFilter === 'thisYear') {
      filteredIncome = income.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
      
      filteredExpenses = expenses.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
    }
    // 'all' doesn't need filtering
    
    // Calculate monthly data
    const monthData: Record<string, MonthlyData> = {};
    
    // Process income
    filteredIncome.forEach((item) => {
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
    filteredExpenses.forEach((item) => {
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
    
    // Calculate category data
    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};
    
    filteredIncome.forEach((item) => {
      if (!incomeByCategory[item.category]) {
        incomeByCategory[item.category] = 0;
      }
      incomeByCategory[item.category] += item.amount;
    });
    
    filteredExpenses.forEach((item) => {
      if (!expensesByCategory[item.category]) {
        expensesByCategory[item.category] = 0;
      }
      expensesByCategory[item.category] += item.amount;
    });
    
    setCategoryData({
      incomeByCategory,
      expensesByCategory,
    });
    
  }, [income, expenses, periodFilter]);
  
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
  
  const getTotalIncome = () => {
    return monthlyData.reduce((sum, month) => sum + month.totalIncome, 0);
  };
  
  const getTotalExpenses = () => {
    return monthlyData.reduce((sum, month) => sum + month.totalExpenses, 0);
  };
  
  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };
  
  const handleExportToExcel = () => {
    exportFinancialSummaryToExcel(
      periodFilter === 'all' ? income : income.filter((item) => {
        const date = new Date(item.date);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        if (periodFilter === 'thisMonth') {
          return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
        } else if (periodFilter === 'thisYear') {
          return date.getFullYear() === currentYear;
        }
        return true;
      }),
      periodFilter === 'all' ? expenses : expenses.filter((item) => {
        const date = new Date(item.date);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        if (periodFilter === 'thisMonth') {
          return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
        } else if (periodFilter === 'thisYear') {
          return date.getFullYear() === currentYear;
        }
        return true;
      }),
      {
        fileName: `Finanzübersicht_${periodFilter}_${new Date().toISOString().split('T')[0]}`,
      }
    );
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Finanzberichte</h1>
          <div className="flex items-center space-x-2">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="input px-3 py-2 pr-8"
            >
              <option value="thisMonth">Dieser Monat</option>
              <option value="thisYear">Dieses Jahr</option>
              <option value="all">Gesamter Zeitraum</option>
            </select>
            <button
              onClick={handleExportToExcel}
              className="btn btn-outline flex items-center"
            >
              <FiDownload className="mr-2" />
              Als Excel exportieren
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center mb-2">
              <FiTrendingUp className="text-green-500 mr-2 text-xl" />
              <h3 className="text-lg font-medium text-gray-700">Einnahmen</h3>
            </div>
            <p className="text-2xl font-semibold text-green-600">{formatCurrency(getTotalIncome())}</p>
          </div>
          
          <div className="card">
            <div className="flex items-center mb-2">
              <FiTrendingDown className="text-red-500 mr-2 text-xl" />
              <h3 className="text-lg font-medium text-gray-700">Ausgaben</h3>
            </div>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(getTotalExpenses())}</p>
          </div>
          
          <div className="card">
            <div className="flex items-center mb-2">
              <FiBarChart2 className="text-primary mr-2 text-xl" />
              <h3 className="text-lg font-medium text-gray-700">Bilanz</h3>
            </div>
            <p className={`text-2xl font-semibold ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getBalance())}
            </p>
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
                    <tr key={`${month.year}-${month.month}`} className="hover:bg-gray-50">
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
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    GESAMT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(getTotalIncome())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(getTotalExpenses())}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(getBalance())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Einnahmen nach Kategorie</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Betrag
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % vom Gesamt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(categoryData.incomeByCategory).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        Keine Daten vorhanden
                      </td>
                    </tr>
                  ) : (
                    Object.entries(categoryData.incomeByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <tr key={category} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {formatCurrency(amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(amount / getTotalIncome() * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausgaben nach Kategorie</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Betrag
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % vom Gesamt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(categoryData.expensesByCategory).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        Keine Daten vorhanden
                      </td>
                    </tr>
                  ) : (
                    Object.entries(categoryData.expensesByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <tr key={category} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {formatCurrency(amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(amount / getTotalExpenses() * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage; 