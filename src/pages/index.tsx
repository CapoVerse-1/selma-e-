import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income, Expense, MonthlyData } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  FiArrowUpRight, 
  FiArrowDownRight, 
  FiDollarSign,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import { exportFinancialSummaryToExcel } from '@/utils/excelExport';
import { 
  fetchIncome, 
  fetchExpenses, 
  fetchMonthlyData, 
  fetchYearlyTotals 
} from '@/lib/mockDatabase';

const Dashboard = () => {
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [yearlyTotals, setYearlyTotals] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Lade alle Daten parallel
        const [incomeData, expensesData, monthlyDataResult, yearlyTotalsResult] = await Promise.all([
          fetchIncome(),
          fetchExpenses(),
          fetchMonthlyData(),
          fetchYearlyTotals()
        ]);

        setIncome(incomeData);
        setExpenses(expensesData);
        setMonthlyData(monthlyDataResult);
        setYearlyTotals(yearlyTotalsResult);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

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
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Einnahmen (Jahresübersicht)</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(yearlyTotals.income)}</p>
              <FiArrowUpRight className="ml-2 text-green-500" />
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ausgaben (Jahresübersicht)</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-red-600">{formatCurrency(yearlyTotals.expenses)}</p>
              <FiArrowDownRight className="ml-2 text-red-500" />
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Bilanz (Jahresübersicht)</h3>
            <div className="flex items-baseline">
              <p className={`text-2xl font-semibold ${yearlyTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(yearlyTotals.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
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
                    <React.Fragment key={`${month.year}-${month.month}`}>
                      <tr className={`hover:bg-gray-50 ${index === 0 ? 'font-medium' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <button 
                              onClick={() => {
                                const monthKey = `${month.year}-${month.month}`;
                                setExpandedMonths(prev => 
                                  prev.includes(monthKey)
                                    ? prev.filter(m => m !== monthKey)
                                    : [...prev, monthKey]
                                );
                              }}
                              className="mr-2 text-gray-400 hover:text-gray-700 transition-colors"
                              aria-label={expandedMonths.includes(`${month.year}-${month.month}`) ? "Einklappen" : "Ausklappen"}
                            >
                              {expandedMonths.includes(`${month.year}-${month.month}`) 
                                ? <FiChevronUp className="h-4 w-4" /> 
                                : <FiChevronDown className="h-4 w-4" />}
                            </button>
                            <div>
                              <div className="font-medium">{month.month} {month.year}</div>
                              {expandedMonths.includes(`${month.year}-${month.month}`) && (
                                <div className="text-xs mt-1 text-gray-500">
                                  <span className="text-green-600 font-medium">{formatCurrency(month.totalIncome)}</span>
                                  {" / "}
                                  <span className="text-red-600 font-medium">{formatCurrency(month.totalExpenses)}</span>
                                </div>
                              )}
                            </div>
                          </div>
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
                      
                      {expandedMonths.includes(`${month.year}-${month.month}`) && (
                        <tr>
                          <td colSpan={4} className="px-0">
                            <div className="bg-gray-50 p-4 border-t border-b border-gray-200">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FiTrendingUp className="mr-1 text-green-500" /> Einnahmen im {month.month} {month.year}
                                  </h3>
                                  <div className="overflow-x-auto bg-white rounded shadow">
                                    <div className="max-h-60 overflow-y-auto">
                                      <table className="min-w-full">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                          <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Datum</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kategorie</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Betrag</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Beschreibung</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {income
                                            .filter(item => {
                                              const date = new Date(item.date);
                                              return date.getFullYear() === month.year && 
                                                    date.getMonth() === getMonthNumber(month.month);
                                            })
                                            .map(item => (
                                              <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {new Date(item.date).toLocaleDateString('de-DE')}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">{item.category}</td>
                                                <td className="px-3 py-2 text-xs font-medium text-green-600">
                                                  {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {item.description.length > 25 
                                                    ? `${item.description.slice(0, 25)}...` 
                                                    : item.description}
                                                </td>
                                              </tr>
                                            ))}
                                          {income.filter(item => {
                                            const date = new Date(item.date);
                                            return date.getFullYear() === month.year && 
                                                  date.getMonth() === getMonthNumber(month.month);
                                          }).length === 0 && (
                                            <tr>
                                              <td colSpan={4} className="px-3 py-2 text-center text-xs text-gray-500">
                                                Keine Einnahmen in diesem Monat
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FiTrendingDown className="mr-1 text-red-500" /> Ausgaben im {month.month} {month.year}
                                  </h3>
                                  <div className="overflow-x-auto bg-white rounded shadow">
                                    <div className="max-h-60 overflow-y-auto">
                                      <table className="min-w-full">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                          <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Datum</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kategorie</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Betrag</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Beschreibung</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {expenses
                                            .filter(item => {
                                              const date = new Date(item.date);
                                              return date.getFullYear() === month.year && 
                                                    date.getMonth() === getMonthNumber(month.month);
                                            })
                                            .map(item => (
                                              <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {new Date(item.date).toLocaleDateString('de-DE')}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">{item.category}</td>
                                                <td className="px-3 py-2 text-xs font-medium text-red-600">
                                                  {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {item.description.length > 25 
                                                    ? `${item.description.slice(0, 25)}...` 
                                                    : item.description}
                                                </td>
                                              </tr>
                                            ))}
                                          {expenses.filter(item => {
                                            const date = new Date(item.date);
                                            return date.getFullYear() === month.year && 
                                                  date.getMonth() === getMonthNumber(month.month);
                                          }).length === 0 && (
                                            <tr>
                                              <td colSpan={4} className="px-3 py-2 text-center text-xs text-gray-500">
                                                Keine Ausgaben in diesem Monat
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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