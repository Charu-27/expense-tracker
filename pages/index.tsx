import { useState, useEffect } from 'react';
import { Expense } from '../src/model/Expense';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortByDate, setSortByDate] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    // Sort by date (newest first)
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
      const response = await fetch('/api/expenses?sort=date_desc');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create expense');
      }

      const newExpense = await response.json();
      setExpenses(prev => [newExpense, ...prev]);
      setSuccess('Expense added successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Add Expense Form */}
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Add New Expense</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter expense description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>

      {/* Controls */}
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

        {/* Total */}
        <div className="total-section">
          <h3>Total: ₹{calculateTotal().toFixed(2)}</h3>
          <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px' }}>
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} shown
          </p>
        </div>

        {/* Expense List */}
        {loading ? (
          <div className="loading">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found. Add your first expense above!</p>
          </div>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{new Date(expense.date).toLocaleDateString('en-IN')}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>
                    {expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

