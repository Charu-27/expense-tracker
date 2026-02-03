# Architecture Documentation

## High-Level Architecture (HLD)

This project follows a **layered architecture pattern** designed for a Next.js full-stack application.

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                    (React/Next.js Pages)                     │
│  - Expense Form Component                                    │
│  - Expense List Component                                    │
│  - Filter & Sort Controls                                    │
│  - Total Display                                            │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP Requests
                        │ (REST API)
┌───────────────────────▼─────────────────────────────────────┐
│                    API Layer (Controller)                    │
│              (Next.js API Routes - pages/api/)              │
│  - ExpenseController                                         │
│  - Request/Response Handling                                 │
│  - HTTP Status Codes                                         │
│  - Error Handling                                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      Service Layer                           │
│                  (Business Logic Layer)                      │
│              (src/service/ExpenseService.ts)                │
│  - createExpense()                                           │
│  - getExpenses()                                             │
│  - calculateTotal()                                          │
│  - Validation Logic                                          │
│  - Filtering & Sorting Logic                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Repository Layer                          │
│                  (Data Access Layer)                         │
│            (src/repository/ExpenseRepository.ts)             │
│  - save()                                                    │
│  - findAll()                                                 │
│  - findById()                                                │
│  - Data Persistence Abstraction                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      Model Layer                             │
│                    (Data Models)                             │
│                  (src/model/Expense.ts)                      │
│  - Expense Interface                                         │
│  - CreateExpenseRequest                                      │
│  - ExpenseQueryParams                                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  Persistence Layer                           │
│  - Local: File System (data/expenses.json)                  │
│  - Vercel: In-Memory Store (can be replaced with DB)        │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Frontend Layer (Presentation)
- **Responsibility**: User interface and user interactions
- **Technologies**: React, Next.js, TypeScript, CSS
- **Components**:
  - Expense form for creating new expenses
  - Expense list/table for displaying expenses
  - Filter and sort controls
  - Total calculation display
  - Error and loading states

### 2. Controller Layer (API)
- **Responsibility**: HTTP request/response handling
- **Location**: `pages/api/expenses/index.ts`
- **Responsibilities**:
  - Route HTTP methods (GET, POST)
  - Parse request bodies and query parameters
  - Call service layer
  - Return appropriate HTTP responses
  - Handle CORS
  - Error handling and status codes

### 3. Service Layer (Business Logic)
- **Responsibility**: Business rules and orchestration
- **Location**: `src/service/ExpenseService.ts`
- **Responsibilities**:
  - Validate expense data
  - Apply business rules (e.g., amount > 0)
  - Orchestrate data operations
  - Filter and sort expenses
  - Calculate totals
  - Handle idempotency logic

### 4. Repository Layer (Data Access)
- **Responsibility**: Data persistence abstraction
- **Location**: `src/repository/ExpenseRepository.ts`
- **Responsibilities**:
  - Abstract data storage implementation
  - CRUD operations
  - Handle storage mechanism (file system or in-memory)
  - Idempotency checks
  - Data serialization/deserialization

### 5. Model Layer (Data Structure)
- **Responsibility**: Define data structures
- **Location**: `src/model/Expense.ts`
- **Responsibilities**:
  - TypeScript interfaces/types
  - Data validation schemas
  - Request/Response DTOs

## Design Patterns Used

### 1. Layered Architecture Pattern
- Clear separation of concerns
- Each layer has a single responsibility
- Dependencies flow downward (Frontend → Controller → Service → Repository)

### 2. Repository Pattern
- Abstracts data access logic
- Makes it easy to swap storage implementations
- Provides a consistent interface for data operations

### 3. Service Layer Pattern
- Encapsulates business logic
- Separates business rules from data access
- Makes business logic testable

### 4. Dependency Injection (Implicit)
- Service depends on Repository
- Controller depends on Service
- Dependencies are created in constructors

### 5. Idempotency Pattern
- POST requests can be safely retried
- Duplicate detection based on expense attributes
- Returns existing expense if duplicate detected

## Data Flow

### Creating an Expense
```
User Input → Frontend Form → POST /api/expenses
  → ExpenseController.createExpense()
    → ExpenseService.createExpense()
      → Validation
      → ExpenseRepository.save()
        → Persistence (File/Memory)
      → Return Expense
    → Return Expense
  → HTTP 201 Response
→ Update UI
```

### Fetching Expenses
```
Page Load → GET /api/expenses?category=Food&sort=date_desc
  → ExpenseController.getExpenses()
    → ExpenseService.getExpenses()
      → ExpenseRepository.findAll()
        → Read from Persistence
      → Filter by category
      → Sort by date
      → Return Expenses
    → Return Expenses
  → HTTP 200 Response
→ Display in UI
```

## Architecture Benefits

### Why Layered Architecture?
- ✅ Clear separation of concerns
- ✅ Easy to test individual layers
- ✅ Simple to swap implementations (e.g., database vs file storage)
- ✅ Maintainable and scalable codebase
- ✅ Follows industry best practices

### Technology Choices
- **Framework**: Next.js with API routes (serverless functions)
- **Language**: TypeScript for type safety
- **Storage**: File system / In-memory (easily replaceable with database)
- **Deployment**: Vercel serverless platform

## Scalability Considerations

### Current Implementation
- Suitable for single-user or small-scale usage
- In-memory storage on Vercel (resets on cold start)
- File-based storage for local development

### Production Enhancements
1. **Database Integration**: Replace repository with database-backed implementation
   - PostgreSQL (via Vercel Postgres)
   - MongoDB Atlas
   - Vercel KV (Redis)
   - Supabase

2. **Caching**: Add caching layer for frequently accessed data

3. **Authentication**: Add user authentication for multi-user support

4. **API Rate Limiting**: Prevent abuse

5. **Monitoring**: Add logging and error tracking (e.g., Sentry)

## Security Considerations

- Input validation in service layer
- Type safety with TypeScript
- CORS handling in API routes
- No SQL injection (using file system, but pattern supports safe DB queries)
- XSS protection (React's built-in escaping)

## Testing Strategy (Future)

- **Unit Tests**: Service layer and repository layer
- **Integration Tests**: API endpoints
- **E2E Tests**: Full user flows
- **Test Framework**: Jest + React Testing Library

