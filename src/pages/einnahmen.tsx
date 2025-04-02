import React, { useState } from 'react';
import Layout from '@/components/Layout';
import FinancialEntryForm from '@/components/FinancialEntryForm';
import FinancialEntriesTable from '@/components/FinancialEntriesTable';
import { Income, Expense } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { exportIncomeToExcel } from '@/utils/excelExport';
import { FiPlus, FiDownload } from 'react-icons/fi';

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

const IncomePage = () => {
  const [income, setIncome] = useState<Income[]>(mockIncomeData);
  const [showForm, setShowForm] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);

  const handleAddIncome = (data: Partial<Income>) => {
    const now = new Date().toISOString();
    
    const newIncome: Income = {
      id: uuidv4(),
      date: data.date || now.split('T')[0],
      amount: data.amount || 0,
      category: data.category || '',
      description: data.description || '',
      client: data.client || '',
      invoiceNumber: data.invoiceNumber,
      createdAt: now,
      updatedAt: now,
    };
    
    setIncome([newIncome, ...income]);
    setShowForm(false);
  };

  const handleUpdateIncome = (data: Partial<Income>) => {
    if (!currentIncome) return;
    
    const updatedIncome = income.map((item: Income) => {
      if (item.id === currentIncome.id) {
        return {
          ...item,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    
    setIncome(updatedIncome);
    setCurrentIncome(null);
    setShowForm(false);
  };

  const handleEditIncome = (entry: Income | Expense) => {
    // We know this will always be Income in this context
    setCurrentIncome(entry as Income);
    setShowForm(true);
  };

  const handleDeleteIncome = (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?')) {
      setIncome(income.filter((item: Income) => item.id !== id));
    }
  };

  const handleExportToExcel = () => {
    exportIncomeToExcel(income, {
      fileName: `Einnahmen_${new Date().toISOString().split('T')[0]}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Druckaufträge & Einnahmen</h1>
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
                setCurrentIncome(null);
                setShowForm(!showForm);
              }}
              className="btn btn-primary flex items-center transition-all duration-300 ease-in-out hover:shadow-md hover:scale-105 rounded-md px-4 py-2"
            >
              <FiPlus className="mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Neuer Druckauftrag
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentIncome ? 'Druckauftrag bearbeiten' : 'Neuen Druckauftrag erstellen'}
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
                    defaultValue={currentIncome?.date || new Date().toISOString().split('T')[0]}
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
                      defaultValue={currentIncome?.amount || ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200">
                    <option value="Druckaufträge">Druckaufträge</option>
                    <option value="Digitaldruck">Digitaldruck</option>
                    <option value="Großformatdruck">Großformatdruck</option>
                    <option value="Buchdruck">Buchdruck</option>
                    <option value="Siebdruck">Siebdruck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    defaultValue={currentIncome?.client || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rechnungsnummer</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    defaultValue={currentIncome?.invoiceNumber || ''}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 h-32 resize-none"
                    defaultValue={currentIncome?.description || ''}
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Druckaufträge Übersicht</h2>
          <FinancialEntriesTable
            entries={income}
            type="income"
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
          />
        </div>
      </div>
    </Layout>
  );
};

export default IncomePage; 