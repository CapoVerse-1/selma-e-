import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income, Expense, MonthlyData } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  FiDownload, 
  FiBarChart2, 
  FiTrendingUp, 
  FiTrendingDown,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { exportFinancialSummaryToExcel } from '@/utils/excelExport';
import { 
  fetchIncome, 
  fetchExpenses, 
  fetchMonthlyData 
} from '@/lib/mockDatabase';

// CSS für automatisch verschwindende Scrollbars
const scrollbarStyles = `
  /* Hide scrollbar by default */
  .auto-hide-scrollbar::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
    opacity: 0;
  }
  
  .auto-hide-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(203, 213, 225, 0);
    border-radius: 4px;
    transition: background-color 0.3s ease-in-out;
  }
  
  /* Show scrollbar when scrolling */
  .auto-hide-scrollbar:hover::-webkit-scrollbar-thumb,
  .auto-hide-scrollbar:active::-webkit-scrollbar-thumb,
  .auto-hide-scrollbar:focus::-webkit-scrollbar-thumb,
  .auto-hide-scrollbar.scrolling::-webkit-scrollbar-thumb {
    background-color: rgba(203, 213, 225, 0.8);
  }
  
  /* For Firefox */
  .auto-hide-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  
  .auto-hide-scrollbar:hover,
  .auto-hide-scrollbar:active,
  .auto-hide-scrollbar:focus,
  .auto-hide-scrollbar.scrolling {
    scrollbar-color: rgba(203, 213, 225, 0.8) transparent;
  }
`;

const ReportsPage = () => {
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState({
    incomeByCategory: {} as Record<string, number>,
    expensesByCategory: {} as Record<string, number>,
  });
  const [periodFilter, setPeriodFilter] = useState<'thisMonth' | 'thisYear' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Lade alle Daten parallel
        const [incomeData, expensesData, monthlyDataResult] = await Promise.all([
          fetchIncome(),
          fetchExpenses(),
          fetchMonthlyData()
        ]);

        setIncome(incomeData);
        setExpenses(expensesData);
        setMonthlyData(monthlyDataResult);
        
        // Berechne Kategoriedaten
        const incomeByCategory: Record<string, number> = {};
        const expensesByCategory: Record<string, number> = {};
        
        incomeData.forEach((item: Income) => {
          if (!incomeByCategory[item.category]) {
            incomeByCategory[item.category] = 0;
          }
          incomeByCategory[item.category] += item.amount;
        });
        
        expensesData.forEach((item: Expense) => {
          if (!expensesByCategory[item.category]) {
            expensesByCategory[item.category] = 0;
          }
          expensesByCategory[item.category] += item.amount;
        });
        
        setCategoryData({ incomeByCategory, expensesByCategory });
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
    // Verwende die gleichen simulierten Konstanten für die Filterung beim Export
    const simulatedCurrentYear = 2024;
    const simulatedCurrentMonth = 2; // März (0-basiert)
    
    exportFinancialSummaryToExcel(
      periodFilter === 'all' ? income : income.filter((item) => {
        const date = new Date(item.date);
        
        if (periodFilter === 'thisMonth') {
          return date.getFullYear() === simulatedCurrentYear && date.getMonth() === simulatedCurrentMonth;
        } else if (periodFilter === 'thisYear') {
          return date.getFullYear() === simulatedCurrentYear;
        }
        return true;
      }),
      periodFilter === 'all' ? expenses : expenses.filter((item) => {
        const date = new Date(item.date);
        
        if (periodFilter === 'thisMonth') {
          return date.getFullYear() === simulatedCurrentYear && date.getMonth() === simulatedCurrentMonth;
        } else if (periodFilter === 'thisYear') {
          return date.getFullYear() === simulatedCurrentYear;
        }
        return true;
      }),
      {
        fileName: `Finanzübersicht_${periodFilter}_${new Date().toISOString().split('T')[0]}`,
      }
    );
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
          <h1 className="text-2xl font-semibold text-gray-800">Finanzberichte</h1>
          <div className="flex items-center space-x-4">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as 'thisMonth' | 'thisYear' | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            >
              <option value="thisMonth">März 2024</option>
              <option value="thisYear">Jahr 2024</option>
              <option value="all">Gesamter Zeitraum</option>
            </select>
            <button
              onClick={handleExportToExcel}
              className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-4 py-2 border border-gray-300"
            >
              <FiDownload className="mr-2 transition-transform duration-300 group-hover:translate-y-[1px]" />
              Als Excel exportieren
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FiTrendingUp className="text-xl" />
              </div>
              <div>
              <h3 className="text-lg font-medium text-gray-700">Einnahmen</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalIncome())}</p>
            </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className="h-1 bg-green-500 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                <FiTrendingDown className="text-xl" />
              </div>
              <div>
              <h3 className="text-lg font-medium text-gray-700">Ausgaben</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</p>
            </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className="h-1 bg-red-500 rounded-full" 
                style={{ width: `${(getTotalExpenses() / (getTotalIncome() > 0 ? getTotalIncome() : 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FiBarChart2 className="text-xl" />
            </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Bilanz</h3>
                <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getBalance())}
            </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className={`h-1 rounded-full ${getBalance() >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min(Math.abs(getBalance()) / (getTotalIncome() > 0 ? getTotalIncome() : 1) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monatliche Übersicht</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-md">
                    Monat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Einnahmen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Ausgaben
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-md">
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
                      <tr className="transition-colors duration-200 hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
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
                              aria-label={expandedMonths.includes(`${month.year}-${month.month}`) ? "Collapse" : "Expand"}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(month.totalIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {formatCurrency(month.totalExpenses)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 rounded-bl-md">
                    GESAMT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(getTotalIncome())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(getTotalExpenses())}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'} rounded-br-md`}>
                    {formatCurrency(getBalance())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                <FiTrendingUp className="text-lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Einnahmen nach Kategorie</h2>
            </div>
            
            <div className="overflow-x-auto">
              <style jsx>{scrollbarStyles}</style>
              <div 
                className="max-h-60 overflow-y-auto auto-hide-scrollbar" 
                onScroll={(e) => {
                  const element = e.currentTarget;
                  element.classList.add('scrolling');
                  
                  // Remove the class after 2 seconds of no scrolling
                  clearTimeout(element.getAttribute('data-scroll-timeout') as unknown as number);
                  const timeoutId = setTimeout(() => {
                    element.classList.remove('scrolling');
                  }, 2000);
                  element.setAttribute('data-scroll-timeout', timeoutId.toString());
                }}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-md">
                        Kategorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Betrag
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-md">
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
                        .map(([category, amount], index, array) => (
                          <tr key={category} className="transition-colors duration-200 hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-green-500 h-2.5 rounded-full" 
                                    style={{ width: `${Math.round((amount / getTotalIncome()) * 100)}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs font-medium text-gray-500">
                                  {Math.round((amount / getTotalIncome()) * 100)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-md bg-red-100 text-red-600 mr-3">
                <FiTrendingDown className="text-lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Ausgaben nach Kategorie</h2>
            </div>
            
            <div className="overflow-x-auto">
              <style jsx>{scrollbarStyles}</style>
              <div 
                className="max-h-60 overflow-y-auto auto-hide-scrollbar" 
                onScroll={(e) => {
                  const element = e.currentTarget;
                  element.classList.add('scrolling');
                  
                  // Remove the class after 2 seconds of no scrolling
                  clearTimeout(element.getAttribute('data-scroll-timeout') as unknown as number);
                  const timeoutId = setTimeout(() => {
                    element.classList.remove('scrolling');
                  }, 2000);
                  element.setAttribute('data-scroll-timeout', timeoutId.toString());
                }}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-md">
                        Kategorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Betrag
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-md">
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
                          <tr key={category} className="transition-colors duration-200 hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                              {formatCurrency(amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-red-500 h-2.5 rounded-full" 
                                    style={{ width: `${Math.round((amount / getTotalExpenses()) * 100)}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs font-medium text-gray-500">
                                  {Math.round((amount / getTotalExpenses()) * 100)}%
                                </span>
                              </div>
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
      </div>
    </Layout>
  );
};

export default ReportsPage; 