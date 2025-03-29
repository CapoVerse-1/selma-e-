import React from 'react';
import { Income, Expense } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface FinancialEntriesTableProps {
  entries: (Income | Expense)[];
  type: 'income' | 'expense';
  onEdit: (entry: Income | Expense) => void;
  onDelete: (id: string) => void;
}

const FinancialEntriesTable: React.FC<FinancialEntriesTableProps> = ({ 
  entries, 
  type, 
  onEdit, 
  onDelete 
}) => {
  const isIncome = type === 'income';

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy', { locale: de });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Betrag
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategorie
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isIncome ? 'Mandant' : 'Lieferant'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beschreibung
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isIncome ? 'Rechnungsnr.' : 'Belegnr.'}
            </th>
            {!isIncome && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Steuerlich absetzbar
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={isIncome ? 7 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                Keine Einträge vorhanden
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr 
                key={entry.id} 
                className="hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-default hover:shadow-inner"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 transition-colors duration-200">
                  {formatDate(entry.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium transition-colors duration-200">
                  {formatCurrency(entry.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 transition-colors duration-200">
                  {entry.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 transition-colors duration-200">
                  {isIncome ? (entry as Income).client : (entry as Expense).vendor}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate transition-colors duration-200">
                  {entry.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 transition-colors duration-200">
                  {isIncome 
                    ? (entry as Income).invoiceNumber || '-' 
                    : (entry as Expense).receiptNumber || '-'}
                </td>
                {!isIncome && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 transition-colors duration-200">
                    {(entry as Expense).taxDeductible ? 'Ja' : 'Nein'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(entry)}
                    className="text-primary hover:text-primary-700 mr-4 transition-all duration-300 ease-in-out hover:underline hover:scale-105 focus:outline-none"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-red-600 hover:text-red-800 transition-all duration-300 ease-in-out hover:underline hover:scale-105 focus:outline-none"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialEntriesTable; 