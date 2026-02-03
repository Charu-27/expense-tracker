import type { NextApiRequest, NextApiResponse } from 'next';
import { ExpenseController } from '../../../src/controller/ExpenseController';

const expenseController = new ExpenseController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    await expenseController.createExpense(req, res);
  } else if (req.method === 'GET') {
    await expenseController.getExpenses(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

