import React, { useState } from 'react';
import { Income, Expense } from '@/types';

type FormType = 'income' | 'expense';

interface FinancialEntryFormProps {
  type: FormType;
  onSubmit: (data: Partial<Income | Expense>) => void;
  initialData?: Partial<Income | Expense>;
}

const FinancialEntryForm: React.FC<FinancialEntryFormProps> = ({
  type,
  onSubmit,
  initialData = {},
}) => {
  const isIncome = type === 'income';

  const [formData, setFormData] = useState<Partial<Income | Expense>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: '',
    description: '',
    ...(isIncome
      ? { client: '' }
      : { vendor: '', taxDeductible: false }),
    ...initialData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData((prev: Partial<Income | Expense>) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form after submission
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: '',
      description: '',
      ...(isIncome ? { client: '' } : { vendor: '', taxDeductible: false }),
    });
  };

  const incomeCategories = [
    'Mandatsgebühren',
    'Beratungsgebühren',
    'Sonderleistungen',
    'Erstattungen',
    'Sonstiges',
  ];

  const expenseCategories = [
    'Büromiete',
    'Personalkosten',
    'Versicherungen',
    'Büromaterial',
    'Software & Lizenzen',
    'Fachliteratur',
    'Fortbildung',
    'Reisekosten',
    'Marketing',
    'Telekommunikation',
    'Sonstiges',
  ];

  const categories = isIncome ? incomeCategories : expenseCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="transition-all duration-300 ease-in-out">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Datum
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date as string}
            onChange={handleChange}
            className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
            required
          />
        </div>
        
        <div className="transition-all duration-300 ease-in-out">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Betrag (€)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
            required
          />
        </div>
        
        <div className="transition-all duration-300 ease-in-out">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Kategorie
          </label>
          <select
            id="category"
            name="category"
            value={formData.category as string}
            onChange={handleChange}
            className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
            required
          >
            <option value="">Kategorie auswählen</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {isIncome ? (
          <div className="transition-all duration-300 ease-in-out">
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
              Mandant
            </label>
            <input
              type="text"
              id="client"
              name="client"
              value={(formData as Partial<Income>).client || ''}
              onChange={handleChange}
              className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
              required
            />
          </div>
        ) : (
          <div className="transition-all duration-300 ease-in-out">
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
              Lieferant
            </label>
            <input
              type="text"
              id="vendor"
              name="vendor"
              value={(formData as Partial<Expense>).vendor || ''}
              onChange={handleChange}
              className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
              required
            />
          </div>
        )}
        
        {isIncome ? (
          <div className="transition-all duration-300 ease-in-out">
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Rechnungsnummer
            </label>
            <input
              type="text"
              id="invoiceNumber"
              name="invoiceNumber"
              value={(formData as Partial<Income>).invoiceNumber || ''}
              onChange={handleChange}
              className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
            />
          </div>
        ) : (
          <div className="transition-all duration-300 ease-in-out">
            <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Belegnummer
            </label>
            <input
              type="text"
              id="receiptNumber"
              name="receiptNumber"
              value={(formData as Partial<Expense>).receiptNumber || ''}
              onChange={handleChange}
              className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
            />
          </div>
        )}
        
        <div className="md:col-span-2 transition-all duration-300 ease-in-out">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description as string}
            onChange={handleChange}
            rows={3}
            className="input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-300 ease-in-out hover:border-primary transform hover:scale-[1.01]"
            required
          />
        </div>
        
        {!isIncome && (
          <div className="md:col-span-2 flex items-center transition-all duration-300 ease-in-out">
            <input
              type="checkbox"
              id="taxDeductible"
              name="taxDeductible"
              checked={(formData as Partial<Expense>).taxDeductible || false}
              onChange={handleChange}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-0 transition-colors duration-300 ease-in-out cursor-pointer"
            />
            <label htmlFor="taxDeductible" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Steuerlich absetzbar
            </label>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary px-6 py-2 rounded-md shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {initialData.id ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
};

export default FinancialEntryForm; 