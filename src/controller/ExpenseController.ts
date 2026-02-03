import { NextApiRequest, NextApiResponse } from 'next';
import { ExpenseService } from '../service/ExpenseService';
import { CreateExpenseRequest, ExpenseQueryParams } from '../model/Expense';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor() {
    this.expenseService = new ExpenseService();
  }

  async createExpense(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const request: CreateExpenseRequest = req.body;
      const expense = await this.expenseService.createExpense(request);
      res.status(201).json(expense);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create expense' });
    }
  }

  async getExpenses(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const queryParams: ExpenseQueryParams = {
        category: req.query.category as string,
        sort: req.query.sort as string
      };
      
      const expenses = await this.expenseService.getExpenses(queryParams);
      res.status(200).json(expenses);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch expenses' });
    }
  }
}

