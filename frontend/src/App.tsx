import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './styles/App.css';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortByDate, setSortByDate] = useState<boolean>(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (sortByDate) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }

    setFilteredExpenses(filtered);
  }, [expenses, selectedCategory, sortByDate]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/expenses?sort=date_desc');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
    setSuccess('Expense added successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const calculateTotal = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getUniqueCategories = () => {
    const unique = Array.from(new Set(expenses.map(e => e.category)));
    return unique.sort();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Personal Expense Tracker</h1>
        <p>Record and review your expenses to understand where your money goes</p>
      </div>

      <ExpenseForm 
        onExpenseAdded={handleExpenseAdded}
        error={error}
        success={success}
        onError={setError}
        onSuccess={setSuccess}
      />

      <div className="card">
        <div className="controls">
          <div style={{ flex: 1 }}>
            <label htmlFor="filter-category" style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Filter by Category:
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', minWidth: '200px' }}
            >
              <option value="">All Categories</option>
              {getUniqueCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Sort:
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSortByDate(!sortByDate)}
            >
              {sortByDate ? 'Newest First ✓' : 'Oldest First'}
            </button>
          </div>
        </div>

        <div className="total-section">
          <h3>Total: ₹{calculateTotal().toFixed(2)}</h3>
          <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px' }}>
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} shown
          </p>
        </div>

        <ExpenseList 
          expenses={filteredExpenses}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;

