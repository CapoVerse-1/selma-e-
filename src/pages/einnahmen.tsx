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
          <h1 className="text-2xl font-semibold text-gray-800">Einnahmen</h1>
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
              Neue Einnahme
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentIncome ? 'Einnahme bearbeiten' : 'Neue Einnahme hinzufügen'}
            </h2>
            <FinancialEntryForm
              type="income"
              onSubmit={currentIncome ? handleUpdateIncome : handleAddIncome}
              initialData={currentIncome || {}}
            />
          </div>
        )}

        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Einnahmenübersicht</h2>
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