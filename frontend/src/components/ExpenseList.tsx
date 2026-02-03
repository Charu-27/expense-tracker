import { Expense } from '../App';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
}

export default function ExpenseList({ expenses, loading }: ExpenseListProps) {
  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses found. Add your first expense above!</p>
      </div>
    );
  }

  return (
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
        {expenses.map(expense => (
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
  );
}

