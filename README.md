# Personal Expense Tracker

A full-stack personal finance tool for recording and reviewing expenses. Built with **Spring Boot (Java)** backend and **React (TypeScript)** frontend, following a clean layered architecture pattern.

## Architecture Structure

This project follows a **layered architecture pattern** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│   Controller Layer                  │
│   (REST API - Spring Boot)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Service Layer                      │
│   (Business Logic)                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Repository Layer                   │
│   (Data Access)                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Model Layer                        │
│   (Data Models)                      │
└─────────────────────────────────────┘
```

### Project Structure

```
expense-tracker/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/expensetracker/
│   │   ├── ExpenseTrackerApplication.java
│   │   ├── controller/              # REST Controllers
│   │   ├── service/                 # Business Logic
│   │   ├── repository/              # Data Access
│   │   └── model/                   # Data Models
│   ├── src/main/resources/
│   │   └── application.properties   # Configuration
│   └── pom.xml                      # Maven Dependencies
│
└── frontend/                         # React Frontend
    ├── src/
    │   ├── components/              # React Components
    │   ├── styles/                  # CSS Styles
    │   ├── App.tsx                  # Main App Component
    │   └── main.tsx                 # Entry Point
    ├── package.json                 # NPM Dependencies
    └── vite.config.ts               # Vite Configuration
```

## System Interaction Flow

### Creating an Expense
```
User Input → React Frontend (ExpenseForm)
  → POST http://localhost:8080/api/expenses
    → Spring Boot Controller (ExpenseController)
      → Service (ExpenseService) [Validation & Business Logic]
        → Repository (ExpenseRepository) [Data Persistence]
          → Storage (In-Memory / File System)
      ← Return Expense
    ← HTTP 201 Response
  ← Update UI
```

### Fetching Expenses
```
Page Load → GET http://localhost:8080/api/expenses
  → Spring Boot Controller (ExpenseController)
    → Service (ExpenseService) [Filtering & Sorting]
      → Repository (ExpenseRepository) [Data Retrieval]
        → Storage (In-Memory / File System)
      ← Return Expenses
    ← HTTP 200 Response
  ← Display in UI
```

## Technology Stack

- **Backend**: Spring Boot 3.2.0, Java 17, Maven
- **Frontend**: React 18, TypeScript, Vite
- **Persistence**: In-Memory Storage (can be migrated to database)
- **Styling**: CSS

## Tradeoffs & Design Decisions

### Why Layered Architecture?
**Benefits:**
- Clear separation of concerns - each layer has a single responsibility
- Easy to test individual layers in isolation
- Simple to swap implementations (e.g., database vs in-memory storage)
- Maintainable and scalable codebase

**Tradeoff:** Slight overhead in code organization, but provides better long-term maintainability.

### Why Spring Boot?
**Benefits:**
- Industry-standard Java framework with extensive ecosystem
- Built-in dependency injection and inversion of control
- Auto-configuration reduces boilerplate code
- Excellent support for REST APIs
- Strong validation and error handling

**Tradeoff:** More setup compared to Node.js, but provides enterprise-grade features and scalability.

### Why React + Vite?
**Benefits:**
- React is the most popular frontend framework
- Vite provides fast development and build times
- TypeScript ensures type safety
- Component-based architecture for reusability
- Large ecosystem and community support

**Tradeoff:** Separate frontend/backend deployment, but provides better separation of concerns and scalability.

### Why In-Memory Storage?
**Benefits:**
- No external database dependencies - works immediately
- Simple and lightweight for single-user/small-scale usage
- Easy to migrate to database later using repository pattern

**Tradeoffs:**
- Data resets on application restart (acceptable for demo/personal use)
- Not suitable for multi-user or production at scale

**Why not database from start?**
- Avoids setup complexity and external dependencies
- Repository pattern allows easy migration when needed
- Sufficient for MVP and personal use cases

### Why TypeScript?
**Benefits:**
- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring

**Tradeoff:** Slight learning curve and setup overhead, but significantly improves code quality.

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Build and run:
```bash
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Running Both

1. Start backend first (Terminal 1):
```bash
cd backend && mvn spring-boot:run
```

2. Start frontend (Terminal 2):
```bash
cd frontend && npm run dev
```

3. Open browser: `http://localhost:5173`
