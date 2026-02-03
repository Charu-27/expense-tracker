package com.expensetracker.service;

import com.expensetracker.model.CreateExpenseRequest;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense createExpense(CreateExpenseRequest request) {
        // Validation is handled by @Valid annotation in controller
        Expense expense = new Expense();
        expense.setId(UUID.randomUUID().toString());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setCreatedAt(LocalDateTime.now());

        return repository.save(expense);
    }

    public List<Expense> getExpenses(String category, String sort) {
        List<Expense> expenses = repository.findAll();

        // Filter by category if provided
        if (category != null && !category.isEmpty()) {
            expenses = expenses.stream()
                .filter(e -> e.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
        }

        // Sort by date
        if ("date_desc".equals(sort)) {
            expenses.sort(Comparator.comparing(Expense::getDate).reversed());
        } else {
            // Default: sort by created_at descending (newest first)
            expenses.sort(Comparator.comparing(Expense::getCreatedAt).reversed());
        }

        return expenses;
    }

    public Double calculateTotal(List<Expense> expenses) {
        return expenses.stream()
            .mapToDouble(Expense::getAmount)
            .sum();
    }
}

