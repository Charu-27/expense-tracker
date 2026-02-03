# Expense Tracker Backend

Spring Boot REST API backend for the Personal Expense Tracker application.

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Build Tool**: Maven
- **Storage**: In-Memory (can be migrated to database)

## Project Structure

```
backend/
├── src/main/java/com/expensetracker/
│   ├── ExpenseTrackerApplication.java    # Main Spring Boot Application
│   ├── controller/
│   │   └── ExpenseController.java       # REST API Endpoints
│   ├── service/
│   │   └── ExpenseService.java          # Business Logic
│   ├── repository/
│   │   └── ExpenseRepository.java        # Data Access Layer
│   └── model/
│       ├── Expense.java                  # Expense Entity
│       └── CreateExpenseRequest.java     # Request DTO
└── src/main/resources/
    └── application.properties            # Application Configuration
```

## API Endpoints

### POST /api/expenses
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
  "createdAt": "2024-01-15T10:30:00"
}
```

### GET /api/expenses
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
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

## Running the Application

### Prerequisites
- Java 17+
- Maven 3.6+

### Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (React dev server). To change this, update `application.properties`:

```properties
spring.web.cors.allowed-origins=http://localhost:5173
```

## Architecture

The backend follows a layered architecture:

1. **Controller Layer**: Handles HTTP requests/responses
2. **Service Layer**: Contains business logic and validation
3. **Repository Layer**: Manages data persistence
4. **Model Layer**: Defines data structures

This separation allows for easy testing and future enhancements (e.g., database migration).

