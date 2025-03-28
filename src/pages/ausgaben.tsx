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
          <h1 className="text-2xl font-semibold text-gray-800">Ausgaben</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleExportToExcel}
              className="btn btn-outline flex items-center"
            >
              <FiDownload className="mr-2" />
              Als Excel exportieren
            </button>
            <button
              onClick={() => {
                setCurrentExpense(null);
                setShowForm(!showForm);
              }}
              className="btn btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Neue Ausgabe
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentExpense ? 'Ausgabe bearbeiten' : 'Neue Ausgabe hinzufügen'}
            </h2>
            <FinancialEntryForm
              type="expense"
              onSubmit={currentExpense ? handleUpdateExpense : handleAddExpense}
              initialData={currentExpense || {}}
            />
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausgabenübersicht</h2>
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