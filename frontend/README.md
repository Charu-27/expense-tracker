# Expense Tracker Frontend

React TypeScript frontend for the Personal Expense Tracker application.

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ExpenseForm.tsx        # Expense creation form
│   │   └── ExpenseList.tsx        # Expense list display
│   ├── styles/
│   │   ├── index.css             # Global styles
│   │   └── App.css                # Component styles
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
└── tsconfig.json                  # TypeScript configuration
```

## Features

- ✅ Create expense entries
- ✅ View list of expenses
- ✅ Filter by category
- ✅ Sort by date
- ✅ Calculate total expenses
- ✅ Error and loading states
- ✅ Responsive design

## Running the Application

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## API Integration

The frontend communicates with the Spring Boot backend running on `http://localhost:8080`. Make sure the backend is running before starting the frontend.

API endpoints:
- `POST http://localhost:8080/api/expenses` - Create expense
- `GET http://localhost:8080/api/expenses` - Get all expenses

## Configuration

The API base URL is configured in `vite.config.ts` with a proxy setup. For production, update the API URLs in the components to point to your production backend.

