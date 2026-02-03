export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface CreateExpenseRequest {
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface ExpenseQueryParams {
  category?: string;
  sort?: string;
}

