import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income } from '@/types';
import { FiPlus, FiEdit, FiTrash2, FiDownload, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { exportIncomeToExcel } from '@/utils/excelExport';
import { fetchIncome, saveIncome } from '@/lib/mockDatabase';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE');
};

const IncomeForm = ({ currentIncome, onSave, onCancel }: { 
  currentIncome: Income | null, 
  onSave: (income: Income) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<Income>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: '',
    description: '',
    client: '',
    invoiceNumber: '',
    createdAt: '',
    updatedAt: '',
  });
  
  useEffect(() => {
    if (currentIncome) {
      setFormData({
        ...currentIncome,
        date: currentIncome.date.split('T')[0],
      });
    } else {
      setFormData({
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: '',
        description: '',
        client: '',
        invoiceNumber: '',
        createdAt: '',
        updatedAt: '',
      });
    }
  }, [currentIncome]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Konvertiere das Betragsfeld in eine Zahl, wenn es nicht leer ist
    if (name === 'amount' && value !== '') {
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
    const updatedIncome = {
      ...formData,
      updatedAt: now,
      createdAt: formData.createdAt || now,
    };
    
    onSave(updatedIncome);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {currentIncome ? 'Einnahme bearbeiten' : 'Neue Einnahme hinzufügen'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechnungsnummer</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
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

const IncomePage = () => {
  const [income, setIncome] = useState<Income[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Income>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const incomeData = await fetchIncome();
        setIncome(incomeData);
      } catch (error) {
        console.error("Fehler beim Laden der Einnahmen:", error);
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
    setCurrentIncome(null);
    setShowForm(true);
  };

  const handleEditClick = (income: Income) => {
    setCurrentIncome(income);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Möchten Sie diese Einnahme wirklich löschen?')) {
      setIncome(prevIncome => prevIncome.filter(item => item.id !== id));
    }
  };

  const handleSave = async (updatedIncome: Income) => {
    try {
      // Bei echter Datenbankimplementierung würden wir hier die Daten speichern
      await saveIncome(updatedIncome);
      
      setIncome(prevIncome => {
        const exists = prevIncome.find(item => item.id === updatedIncome.id);
        if (exists) {
          return prevIncome.map(item => item.id === updatedIncome.id ? updatedIncome : item);
        } else {
          return [...prevIncome, updatedIncome];
        }
      });
      
      setShowForm(false);
    } catch (error) {
      console.error('Fehler beim Speichern der Einnahme:', error);
      alert('Fehler beim Speichern der Einnahme');
    }
  };

  const handleSort = (field: keyof Income) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportToExcel = () => {
    exportIncomeToExcel(income, {
      fileName: `Einnahmen_${new Date().toISOString().split('T')[0]}`,
    });
  };

  // Einnahmen filtern
  const filteredIncome = income.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.client.toLowerCase().includes(searchLower) ||
      (item.invoiceNumber || '').toLowerCase().includes(searchLower) ||
      formatCurrency(item.amount).includes(searchTerm) ||
      formatDate(item.date).includes(searchTerm)
    );
  });

  // Einnahmen sortieren
  const sortedIncome = [...filteredIncome].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    const valueA = String(a[sortField] || '').toLowerCase();
    const valueB = String(b[sortField] || '').toLowerCase();
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);

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
          <h1 className="text-2xl font-semibold text-gray-800">Einnahmen</h1>
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
              Neue Einnahme
            </button>
          </div>
        </div>

        {showForm && (
          <IncomeForm
            currentIncome={currentIncome}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
          <div className="flex flex-col md:flex-row justify-between mb-4 items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800">Einnahmenübersicht</h2>
              <span className="ml-4 text-lg font-medium bg-green-100 text-green-800 py-1 px-3 rounded-full">
                {formatCurrency(totalIncome)}
              </span>
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
                    onClick={() => handleSort('client')}
                  >
                    Kunde {sortField === 'client' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('invoiceNumber')}
                  >
                    Rechnungsnr. {sortField === 'invoiceNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    Betrag {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedIncome.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'Keine Ergebnisse gefunden.' : 'Keine Einnahmen vorhanden.'}
                    </td>
                  </tr>
                ) : (
                  sortedIncome.map((item) => (
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
                        {item.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.invoiceNumber || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(item.amount)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(totalIncome)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IncomePage; 