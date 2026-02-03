import { Expense } from '../model/Expense';
import * as fs from 'fs';
import * as path from 'path';

// In-memory store for serverless environments (Vercel)
// Note: This resets on cold start. For production, use a database (PostgreSQL, MongoDB, etc.)
let inMemoryStore: Expense[] = [];

export class ExpenseRepository {
  private dataFilePath: string | null = null;
  private useFileSystem: boolean;

  constructor() {
    // Try to use file system if available (local development)
    // In Vercel serverless, file system is read-only except /tmp, but /tmp is ephemeral
    // So we use in-memory store for serverless
    this.useFileSystem = !process.env.VERCEL;
    
    if (this.useFileSystem) {
      try {
        const dataDir = path.join(process.cwd(), 'data');
        this.dataFilePath = path.join(dataDir, 'expenses.json');
        
        // Ensure data directory exists
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Initialize file if it doesn't exist
        if (!fs.existsSync(this.dataFilePath)) {
          fs.writeFileSync(this.dataFilePath, JSON.stringify([]), 'utf-8');
        }
      } catch (error) {
        // Fallback to in-memory if file system fails
        this.useFileSystem = false;
      }
    }
  }

  private readExpenses(): Expense[] {
    if (this.useFileSystem && this.dataFilePath) {
      try {
        const data = fs.readFileSync(this.dataFilePath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        return [];
      }
    } else {
      // Use in-memory store
      return [...inMemoryStore];
    }
  }

  private writeExpenses(expenses: Expense[]): void {
    if (this.useFileSystem && this.dataFilePath) {
      try {
        fs.writeFileSync(this.dataFilePath, JSON.stringify(expenses, null, 2), 'utf-8');
      } catch (error) {
        // Fallback to in-memory
        inMemoryStore = expenses;
      }
    } else {
      inMemoryStore = expenses;
    }
  }

  async save(expense: Expense): Promise<Expense> {
    const expenses = this.readExpenses();
    
    // Check for duplicate based on idempotency key (amount + category + description + date)
    const existing = expenses.find(
      e => e.amount === expense.amount &&
           e.category === expense.category &&
           e.description === expense.description &&
           e.date === expense.date &&
           Math.abs(new Date(e.created_at).getTime() - new Date(expense.created_at).getTime()) < 60000 // Within 1 minute
    );
    
    if (existing) {
      return existing; // Return existing expense for idempotency
    }
    
    expenses.push(expense);
    this.writeExpenses(expenses);
    return expense;
  }

  async findAll(): Promise<Expense[]> {
    return this.readExpenses();
  }

  async findById(id: string): Promise<Expense | null> {
    const expenses = this.readExpenses();
    return expenses.find(e => e.id === id) || null;
  }
}

