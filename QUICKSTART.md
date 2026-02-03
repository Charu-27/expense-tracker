# Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Install Dependencies
```bash
cd expense-tracker
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:3000`

## Testing the Application

### Add an Expense
1. Fill in the form:
   - **Amount**: Enter a number (e.g., 500)
   - **Category**: Select from dropdown (e.g., Food)
   - **Description**: Enter text (e.g., "Lunch at restaurant")
   - **Date**: Select a date
2. Click "Add Expense"
3. The expense should appear in the list below

### Filter Expenses
- Use the "Filter by Category" dropdown to show only expenses from a specific category

### Sort Expenses
- Click the "Sort" button to toggle between newest first and oldest first

### View Total
- The total amount of visible expenses is displayed at the top of the expense list

## Testing API Endpoints

### Create Expense (POST)
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "category": "Food",
    "description": "Test expense",
    "date": "2024-01-15"
  }'
```

### Get Expenses (GET)
```bash
# Get all expenses
curl http://localhost:3000/api/expenses

# Filter by category
curl http://localhost:3000/api/expenses?category=Food

# Sort by date (newest first)
curl http://localhost:3000/api/expenses?sort=date_desc

# Both filter and sort
curl http://localhost:3000/api/expenses?category=Food&sort=date_desc
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick version:
```bash
npm i -g vercel
vercel
```

## Project Structure Overview

```
expense-tracker/
├── pages/
│   ├── api/expenses/     # API endpoint
│   └── index.tsx         # Main UI page
├── src/
│   ├── controller/       # Request handling
│   ├── service/          # Business logic
│   ├── repository/       # Data access
│   └── model/            # Data types
└── styles/               # CSS styles
```

## Common Issues

**Port 3000 already in use:**
```bash
# Use a different port
PORT=3001 npm run dev
```

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Check TypeScript version
npx tsc --version
# Should be 5.2.2 or compatible
```

## Next Steps

1. ✅ Test all features locally
2. ✅ Review the code structure
3. ✅ Deploy to Vercel
4. 📝 (Optional) Add database for persistent storage
5. 📝 (Optional) Add authentication
6. 📝 (Optional) Add tests

