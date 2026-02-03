# Personal Expense Tracker

A full-stack personal finance tool for recording and reviewing expenses. Built with Next.js, TypeScript, and following a layered architecture pattern similar to MCW (Mobile Cash Wallet) project.

## Features

### Core Functionality
- ✅ Create expense entries with amount, category, description, and date
- ✅ View list of all expenses
- ✅ Filter expenses by category
- ✅ Sort expenses by date (newest first)
- ✅ Display total amount of visible expenses
- ✅ Handle multiple form submissions (idempotency)
- ✅ Handle page refreshes gracefully
- ✅ Basic error and loading states

### Architecture

This project follows a **layered architecture pattern** similar to MCW:

```
┌─────────────────────────────────────┐
│   Controller Layer                  │
│   (API Routes - pages/api/)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Service Layer                      │
│   (Business Logic - src/service/)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Repository Layer                   │
│   (Data Access - src/repository/)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Model Layer                        │
│   (Data Models - src/model/)         │
└─────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes (Serverless Functions)
- **Persistence**: JSON file storage (in-memory for serverless, file-based for local)
- **Styling**: CSS (simple, clean design)

### Project Structure

```
expense-tracker/
├── pages/
│   ├── api/
│   │   └── expenses/
│   │       └── index.ts          # API endpoint handler
│   ├── _app.tsx                   # Next.js app wrapper
│   └── index.tsx                  # Main frontend page
├── src/
│   ├── controller/
│   │   └── ExpenseController.ts   # Request/Response handling
│   ├── service/
│   │   └── ExpenseService.ts      # Business logic
│   ├── repository/
│   │   └── ExpenseRepository.ts   # Data persistence
│   └── model/
│       └── Expense.ts              # Data models
├── styles/
│   └── globals.css                # Global styles
├── package.json
├── tsconfig.json
├── vercel.json                     # Vercel configuration
└── README.md
```

### Persistence Mechanism

**Choice: Hybrid Storage (File System + In-Memory)**

The application uses a hybrid approach for persistence:
- **Local Development**: Stores data in `data/expenses.json` file
- **Vercel Serverless**: Uses in-memory storage (resets on cold start)

**Rationale:**
- Simple and lightweight for a minimal expense tracker
- No external database dependencies required
- Suitable for single-user or small-scale usage
- Easy to migrate to a database later if needed
- Works immediately without additional setup

**Important Notes:**
- **For Vercel Production**: The in-memory store resets on serverless function cold starts. For persistent storage, consider:
  - Vercel KV (Redis) - Easy integration with Vercel
  - PostgreSQL via Vercel Postgres
  - MongoDB Atlas
  - Supabase
- **For Local Development**: Data persists in `data/expenses.json` file

**Migration Path**: The repository pattern makes it easy to swap the storage implementation. Simply replace `ExpenseRepository` with a database-backed implementation.

### API Endpoints

#### POST /api/expenses
Create a new expense.

**Request Body:**
```json
{
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

#### GET /api/expenses
Get list of expenses.

**Query Parameters:**
- `category` (optional): Filter by category
- `sort` (optional): `date_desc` for newest first

**Example:** `/api/expenses?category=Food&sort=date_desc`

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "amount": 100.50,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### Idempotency

The API handles duplicate requests gracefully:
- If the same expense (same amount, category, description, date) is submitted within 1 minute, it returns the existing expense instead of creating a duplicate
- This prevents duplicate entries from multiple form submissions or page refreshes

### Getting Started

#### Prerequisites
- Node.js 18+ 
- npm or yarn

#### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Build for Production

```bash
npm run build
npm start
```

### Deployment to Vercel

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

3. **Environment Variables**: None required for basic functionality.

### Development Notes

- The application is designed to handle real-world conditions:
  - Multiple form submissions (disabled button during submission)
  - Page refreshes (data persists)
  - Slow/failed API responses (error states shown)
  - Network retries (idempotent API)

- Styling is kept simple and clean, focusing on functionality and clarity.

### Future Enhancements (Nice to Have)

- [ ] Enhanced validation (negative amounts, required fields)
- [ ] Summary view (total per category)
- [ ] Automated tests (unit/integration)
- [ ] Enhanced error handling and retry logic
- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Export to CSV/PDF
- [ ] Date range filtering

### License

This project is created as an assignment submission.

