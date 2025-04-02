import React, { useState } from 'react';
import Layout from '@/components/Layout';
import FinancialEntryForm from '@/components/FinancialEntryForm';
import FinancialEntriesTable from '@/components/FinancialEntriesTable';
import { Income, Expense } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { exportExpensesToExcel } from '@/utils/excelExport';
import { FiPlus, FiDownload } from 'react-icons/fi';

// Mock data - in a real app, this would come from a database
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

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenseData);
  const [showForm, setShowForm] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  const handleAddExpense = (data: Partial<Expense>) => {
    const now = new Date().toISOString();
    
    const newExpense: Expense = {
      id: uuidv4(),
      date: data.date || now.split('T')[0],
      amount: data.amount || 0,
      category: data.category || '',
      description: data.description || '',
      vendor: data.vendor || '',
      receiptNumber: data.receiptNumber,
      taxDeductible: data.taxDeductible || false,
      createdAt: now,
      updatedAt: now,
    };
    
    setExpenses([newExpense, ...expenses]);
    setShowForm(false);
  };

  const handleUpdateExpense = (data: Partial<Expense>) => {
    if (!currentExpense) return;
    
    const updatedExpenses = expenses.map((item: Expense) => {
      if (item.id === currentExpense.id) {
        return {
          ...item,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    
    setExpenses(updatedExpenses);
    setCurrentExpense(null);
    setShowForm(false);
  };

  const handleEditExpense = (entry: Income | Expense) => {
    // We know this will always be Expense in this context
    setCurrentExpense(entry as Expense);
    setShowForm(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?')) {
      setExpenses(expenses.filter((item: Expense) => item.id !== id));
    }
  };

  const handleExportToExcel = () => {
    exportExpensesToExcel(expenses, {
      fileName: `Ausgaben_${new Date().toISOString().split('T')[0]}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Ausgaben & Rechnungen</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleExportToExcel}
              className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-4 py-2 border border-gray-300"
            >
              <FiDownload className="mr-2 transition-transform duration-300 group-hover:translate-y-[1px]" />
              Als Excel exportieren
            </button>
            <button
              onClick={() => {
                setCurrentExpense(null);
                setShowForm(!showForm);
              }}
              className="btn btn-primary flex items-center transition-all duration-300 ease-in-out hover:shadow-md hover:scale-105 rounded-md px-4 py-2"
            >
              <FiPlus className="mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Neue Rechnung
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentExpense ? 'Rechnung bearbeiten' : 'Neue Rechnung erstellen'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    defaultValue={currentExpense?.date || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Betrag</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">€</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      defaultValue={currentExpense?.amount || ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200">
                    <option value="Druckmaterial">Druckmaterial</option>
                    <option value="Maschinenwartung">Maschinenwartung</option>
                    <option value="Büromiete">Büromiete</option>
                    <option value="Versicherungen">Versicherungen</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Fortbildung">Fortbildung</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieferant</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    defaultValue={currentExpense?.vendor || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rechnungsnummer</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    defaultValue={currentExpense?.receiptNumber || ''}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    defaultChecked={currentExpense?.taxDeductible || false}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Steuerlich absetzbar
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 h-32 resize-none"
                    defaultValue={currentExpense?.description || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rechnungsfoto</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        >
                          <span>Foto hochladen</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" />
                        </label>
                        <p className="pl-1">oder per Drag & Drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG bis 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausgaben Übersicht</h2>
          <FinancialEntriesTable
            entries={expenses}
            type="expense"
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ExpensesPage; 