import { Expense, CreateExpenseRequest, ExpenseQueryParams } from '../model/Expense';
import { ExpenseRepository } from '../repository/ExpenseRepository';
import { v4 as uuidv4 } from 'uuid';

export class ExpenseService {
  private repository: ExpenseRepository;

  constructor() {
    this.repository = new ExpenseRepository();
  }

  async createExpense(request: CreateExpenseRequest): Promise<Expense> {
    // Basic validation
    if (request.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    if (!request.category || !request.description || !request.date) {
      throw new Error('Category, description, and date are required');
    }

    const expense: Expense = {
      id: uuidv4(),
      amount: request.amount,
      category: request.category,
      description: request.description,
      date: request.date,
      created_at: new Date().toISOString()
    };

    return await this.repository.save(expense);
  }

  async getExpenses(queryParams: ExpenseQueryParams = {}): Promise<Expense[]> {
    let expenses = await this.repository.findAll();

    // Filter by category if provided
    if (queryParams.category) {
      expenses = expenses.filter(e => 
        e.category.toLowerCase() === queryParams.category!.toLowerCase()
      );
    }

    // Sort by date (newest first) if sort=date_desc
    if (queryParams.sort === 'date_desc') {
      expenses.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order
      });
    } else {
      // Default: sort by created_at descending (newest first)
      expenses.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    }

    return expenses;
  }

  calculateTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}

