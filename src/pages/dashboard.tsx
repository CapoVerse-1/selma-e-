import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income, Expense } from '@/types';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  ChartData
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

// Mock data - in a real app, this would come from API calls
const mockIncomeData: Income[] = [
  {
    id: '1',
    date: '2023-01-15',
    amount: 2500,
    client: 'Schmidt GmbH',
    category: 'Beratung',
    invoiceNumber: 'INV-2023-001',
    description: 'Rechtliche Beratung für Unternehmensumstrukturierung',
    paymentStatus: 'bezahlt',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    date: '2023-02-20',
    amount: 3800,
    client: 'Müller & Söhne',
    category: 'Vertragserstellung',
    invoiceNumber: 'INV-2023-002',
    description: 'Erstellung von AGB und Datenschutzerklärungen',
    paymentStatus: 'ausstehend',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    date: '2023-03-10',
    amount: 1500,
    client: 'Weber KG',
    category: 'Beratung',
    invoiceNumber: 'INV-2023-003',
    description: 'Arbeitsrechtliche Beratung',
    paymentStatus: 'bezahlt',
    createdAt: '2023-03-10T11:15:00Z',
    updatedAt: '2023-03-10T11:15:00Z',
  },
  {
    id: '4',
    date: '2023-04-05',
    amount: 4200,
    client: 'Schmidt GmbH',
    category: 'Prozessvertretung',
    invoiceNumber: 'INV-2023-004',
    description: 'Vertretung im Handelsrecht-Verfahren',
    paymentStatus: 'bezahlt',
    createdAt: '2023-04-05T09:45:00Z',
    updatedAt: '2023-04-05T09:45:00Z',
  },
  {
    id: '5',
    date: '2023-05-18',
    amount: 3000,
    client: 'Zimmermann AG',
    category: 'Vertragserstellung',
    invoiceNumber: 'INV-2023-005',
    description: 'Lizenzvertrag für Software',
    paymentStatus: 'ausstehend',
    createdAt: '2023-05-18T16:20:00Z',
    updatedAt: '2023-05-18T16:20:00Z',
  },
];

const mockExpenseData: Expense[] = [
  {
    id: '1',
    date: '2023-01-10',
    amount: 450.00,
    category: 'Büromiete',
    description: 'Monatsmiete Januar',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2023-01-10T08:00:00Z',
  },
  {
    id: '2',
    date: '2023-02-12',
    amount: 120.00,
    category: 'Büromaterial',
    description: 'Druckerpapier, Stifte, Ordner',
    vendor: 'Office Supply Store',
    receiptNumber: 'R-2023-001',
    taxDeductible: true,
    createdAt: '2023-02-12T11:45:00Z',
    updatedAt: '2023-02-12T11:45:00Z',
  },
  {
    id: '3',
    date: '2023-03-01',
    amount: 350.00,
    category: 'Software & Lizenzen',
    description: 'Buchhaltungssoftware Jahresabonnement',
    vendor: 'Software Solutions GmbH',
    receiptNumber: 'R-2023-002',
    taxDeductible: true,
    createdAt: '2023-03-01T15:20:00Z',
    updatedAt: '2023-03-01T15:20:00Z',
  },
  {
    id: '4',
    date: '2023-04-15',
    amount: 280.00,
    category: 'Fortbildung',
    description: 'Online-Seminar zu Steuerrecht-Updates',
    vendor: 'Juristische Fortbildung e.V.',
    receiptNumber: 'R-2023-003',
    taxDeductible: true,
    createdAt: '2023-04-15T09:30:00Z',
    updatedAt: '2023-04-15T09:30:00Z',
  },
  {
    id: '5',
    date: '2023-05-08',
    amount: 85.00,
    category: 'Fachliteratur',
    description: 'Fachbuch: Neues Datenschutzrecht',
    vendor: 'Juristische Fachbuchhandlung',
    receiptNumber: 'R-2023-004',
    taxDeductible: true,
    createdAt: '2023-05-08T14:10:00Z',
    updatedAt: '2023-05-08T14:10:00Z',
  },
];

type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
  profit: number;
};

type CategoryData = {
  category: string;
  amount: number;
};

const DashboardPage = () => {
  const [incomeData, setIncomeData] = useState<Income[]>(mockIncomeData);
  const [expenseData, setExpenseData] = useState<Expense[]>(mockExpenseData);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<CategoryData[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Calculate total income, expenses, and profit
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalProfit = totalIncome - totalExpenses;

  // Process data for charts when our data changes
  useEffect(() => {
    processMonthlyData();
    processIncomeByCategory();
    processExpensesByCategory();
  }, [incomeData, expenseData, year]);

  // Prepare monthly financial data for the chart
  const processMonthlyData = () => {
    const months: { [key: string]: MonthlyData } = {
      '01': { month: 'Jan', income: 0, expenses: 0, profit: 0 },
      '02': { month: 'Feb', income: 0, expenses: 0, profit: 0 },
      '03': { month: 'Mär', income: 0, expenses: 0, profit: 0 },
      '04': { month: 'Apr', income: 0, expenses: 0, profit: 0 },
      '05': { month: 'Mai', income: 0, expenses: 0, profit: 0 },
      '06': { month: 'Jun', income: 0, expenses: 0, profit: 0 },
      '07': { month: 'Jul', income: 0, expenses: 0, profit: 0 },
      '08': { month: 'Aug', income: 0, expenses: 0, profit: 0 },
      '09': { month: 'Sep', income: 0, expenses: 0, profit: 0 },
      '10': { month: 'Okt', income: 0, expenses: 0, profit: 0 },
      '11': { month: 'Nov', income: 0, expenses: 0, profit: 0 },
      '12': { month: 'Dez', income: 0, expenses: 0, profit: 0 },
    };

    // Filter data by selected year
    const selectedYearIncome = incomeData.filter((item) => {
      return item.date.split('-')[0] === year.toString();
    });

    const selectedYearExpenses = expenseData.filter((item) => {
      return item.date.split('-')[0] === year.toString();
    });

    // Process income data by month
    selectedYearIncome.forEach((item: Income) => {
      const monthKey = item.date.split('-')[1];
      if (months[monthKey]) {
        months[monthKey].income += item.amount;
      }
    });

    // Process expense data by month
    selectedYearExpenses.forEach((item: Expense) => {
      const monthKey = item.date.split('-')[1];
      if (months[monthKey]) {
        months[monthKey].expenses += item.amount;
      }
    });

    // Calculate profit for each month
    Object.keys(months).forEach((key) => {
      months[key].profit = months[key].income - months[key].expenses;
    });

    // Convert the object into an array
    const monthsArray = Object.values(months);
    setMonthlyData(monthsArray);
  };

  // Prepare income data grouped by category
  const processIncomeByCategory = () => {
    const categories: { [key: string]: number } = {};

    incomeData.forEach((item: Income) => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.amount;
    });

    const categoryData = Object.keys(categories).map((category) => ({
      category,
      amount: categories[category],
    }));

    setIncomeByCategory(categoryData);
  };

  // Prepare expense data grouped by category
  const processExpensesByCategory = () => {
    const categories: { [key: string]: number } = {};

    expenseData.forEach((item: Expense) => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.amount;
    });

    const categoryData = Object.keys(categories).map((category) => ({
      category,
      amount: categories[category],
    }));

    setExpensesByCategory(categoryData);
  };

  // Prepare data for the monthly financial overview chart
  const monthlyChartData: ChartData<'bar'> = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: 'Einnahmen',
        data: monthlyData.map((item) => item.income),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Ausgaben',
        data: monthlyData.map((item) => item.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the profit line chart
  const profitChartData: ChartData<'line'> = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: 'Gewinn/Verlust',
        data: monthlyData.map((item) => item.profit),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Prepare data for the income by category pie chart
  const incomeByCategoryChartData: ChartData<'pie'> = {
    labels: incomeByCategory.map((item) => item.category),
    datasets: [
      {
        data: incomeByCategory.map((item) => item.amount),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(45, 212, 191, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the expenses by category pie chart
  const expensesByCategoryChartData: ChartData<'pie'> = {
    labels: expensesByCategory.map((item) => item.category),
    datasets: [
      {
        data: expensesByCategory.map((item) => item.amount),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(217, 119, 6, 0.8)',
          'rgba(180, 83, 9, 0.8)',
          'rgba(146, 64, 14, 0.8)',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="select-container">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="select select-bordered"
            >
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                Einnahmen
                <FiArrowUp className="text-success" />
              </h2>
              <p className="text-2xl font-bold">{totalIncome.toFixed(2)} €</p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                Ausgaben
                <FiArrowDown className="text-error" />
              </h2>
              <p className="text-2xl font-bold">{totalExpenses.toFixed(2)} €</p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Gewinn</h2>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-success' : 'text-error'}`}>
                {totalProfit.toFixed(2)} €
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income vs Expenses */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Monatliche Übersicht: Einnahmen vs. Ausgaben</h2>
              <div className="h-96">
                <Bar data={monthlyChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Monthly Profit/Loss */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Monatlicher Gewinn/Verlust</h2>
              <div className="h-96">
                <Line data={profitChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Income by Category */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Einnahmen nach Kategorie</h2>
              <div className="h-80">
                <Pie data={incomeByCategoryChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Ausgaben nach Kategorie</h2>
              <div className="h-80">
                <Pie data={expensesByCategoryChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 