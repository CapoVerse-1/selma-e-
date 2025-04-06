import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Expense } from '@/types';
import { FiPlus, FiEdit, FiTrash2, FiDownload, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { exportExpensesToExcel } from '@/utils/excelExport';
import { fetchExpenses, saveExpense } from '@/lib/mockDatabase';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE');
};

const ExpenseForm = ({ currentExpense, onSave, onCancel }: { 
  currentExpense: Expense | null, 
  onSave: (expense: Expense) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<Expense>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: '',
    description: '',
    vendor: '',
    receiptNumber: '',
    taxDeductible: true,
    createdAt: '',
    updatedAt: '',
  });
  
  useEffect(() => {
    if (currentExpense) {
      setFormData({
        ...currentExpense,
        date: currentExpense.date.split('T')[0],
      });
    } else {
      setFormData({
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: '',
        description: '',
        vendor: '',
        receiptNumber: '',
        taxDeductible: true,
        createdAt: '',
        updatedAt: '',
      });
    }
  }, [currentExpense]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'amount' && value !== '') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const updatedExpense = {
      ...formData,
      updatedAt: now,
      createdAt: formData.createdAt || now,
    };
    
    onSave(updatedExpense);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {currentExpense ? 'Ausgabe bearbeiten' : 'Neue Ausgabe hinzufügen'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Betrag (€)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anbieter</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Belegnummer</label>
            <input
              type="text"
              name="receiptNumber"
              value={formData.receiptNumber || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="taxDeductible"
              id="taxDeductible"
              checked={formData.taxDeductible}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="taxDeductible" className="ml-2 block text-sm text-gray-700">
              Steuerlich absetzbar
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              required
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary border border-transparent rounded-md text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Expense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const expensesData = await fetchExpenses();
        setExpenses(expensesData);
      } catch (error) {
        console.error("Fehler beim Laden der Ausgaben:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleAddClick = () => {
    setCurrentExpense(null);
    setShowForm(true);
  };

  const handleEditClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Möchten Sie diese Ausgabe wirklich löschen?')) {
      setExpenses(prevExpenses => prevExpenses.filter(item => item.id !== id));
    }
  };

  const handleSave = async (updatedExpense: Expense) => {
    try {
      // Bei echter Datenbankimplementierung würden wir hier die Daten speichern
      await saveExpense(updatedExpense);
      
      setExpenses(prevExpenses => {
        const exists = prevExpenses.find(item => item.id === updatedExpense.id);
        if (exists) {
          return prevExpenses.map(item => item.id === updatedExpense.id ? updatedExpense : item);
        } else {
          return [...prevExpenses, updatedExpense];
        }
      });
      
      setShowForm(false);
    } catch (error) {
      console.error('Fehler beim Speichern der Ausgabe:', error);
      alert('Fehler beim Speichern der Ausgabe');
    }
  };

  const handleSort = (field: keyof Expense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportToExcel = () => {
    exportExpensesToExcel(expenses, {
      fileName: `Ausgaben_${new Date().toISOString().split('T')[0]}`,
    });
  };

  // Ausgaben filtern
  const filteredExpenses = expenses.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.vendor.toLowerCase().includes(searchLower) ||
      (item.receiptNumber || '').toLowerCase().includes(searchLower) ||
      formatCurrency(item.amount).includes(searchTerm) ||
      formatDate(item.date).includes(searchTerm)
    );
  });

  // Ausgaben sortieren
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === 'taxDeductible') {
      return sortDirection === 'asc' 
        ? (a.taxDeductible === b.taxDeductible ? 0 : a.taxDeductible ? -1 : 1)
        : (a.taxDeductible === b.taxDeductible ? 0 : a.taxDeductible ? 1 : -1);
    }
    
    const valueA = String(a[sortField] || '').toLowerCase();
    const valueB = String(b[sortField] || '').toLowerCase();
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductible = filteredExpenses
    .filter(item => item.taxDeductible)
    .reduce((sum, item) => sum + item.amount, 0);

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
          <h1 className="text-2xl font-semibold text-gray-800">Ausgaben</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleExportToExcel}
              className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-4 py-2 border border-gray-300"
            >
              <FiDownload className="mr-2 transition-transform duration-300 group-hover:translate-y-[1px]" />
              Als Excel exportieren
            </button>
            <button
              onClick={handleAddClick}
              className="btn btn-primary flex items-center bg-primary hover:bg-primary-dark text-white rounded-md px-4 py-2"
            >
              <FiPlus className="mr-2" />
              Neue Ausgabe
            </button>
          </div>
        </div>

        {showForm && (
          <ExpenseForm
            currentExpense={currentExpense}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
          <div className="flex flex-col md:flex-row justify-between mb-4 items-start md:items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Ausgabenübersicht</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Gesamt:</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalExpenses)}</span>
                  <span className="text-gray-600 ml-2">Absetzbar:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(totalDeductible)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Suchen..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    Datum {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    Kategorie {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('description')}
                  >
                    Beschreibung {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('vendor')}
                  >
                    Anbieter {sortField === 'vendor' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('receiptNumber')}
                  >
                    Belegnr. {sortField === 'receiptNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    Betrag {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('taxDeductible')}
                  >
                    Absetzbar {sortField === 'taxDeductible' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'Keine Ergebnisse gefunden.' : 'Keine Ausgaben vorhanden.'}
                    </td>
                  </tr>
                ) : (
                  sortedExpenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.receiptNumber || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.taxDeductible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.taxDeductible ? 'Ja' : 'Nein'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-primary hover:text-primary-dark mr-3 transition-colors"
                        >
                          <FiEdit className="inline" /> Bearbeiten
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <FiTrash2 className="inline" /> Löschen
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    Gesamt:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {formatCurrency(totalExpenses)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    Steuerlich absetzbar:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {formatCurrency(totalDeductible)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpensesPage; 