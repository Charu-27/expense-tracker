package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ExpenseRepository {
    private static final String DATA_DIR = "data";
    private static final String DATA_FILE = "expenses.json";
    private final Path dataFilePath;
    
    // In-memory store for serverless environments
    private final List<Expense> inMemoryStore = new ArrayList<>();

    public ExpenseRepository() {
        this.dataFilePath = Paths.get(DATA_DIR, DATA_FILE);
        initializeDataDirectory();
    }

    private void initializeDataDirectory() {
        try {
            if (!Files.exists(dataFilePath.getParent())) {
                Files.createDirectories(dataFilePath.getParent());
            }
            if (!Files.exists(dataFilePath)) {
                Files.createFile(dataFilePath);
                Files.write(dataFilePath, "[]".getBytes());
            }
        } catch (IOException e) {
            // Fallback to in-memory if file system fails
            System.err.println("Warning: Could not initialize file system storage, using in-memory storage");
        }
    }

    public Expense save(Expense expense) {
        List<Expense> expenses = findAll();
        
        // Check for duplicate (idempotency)
        Expense existing = expenses.stream()
            .filter(e -> e.getAmount().equals(expense.getAmount()) &&
                        e.getCategory().equals(expense.getCategory()) &&
                        e.getDescription().equals(expense.getDescription()) &&
                        e.getDate().equals(expense.getDate()) &&
                        Math.abs(java.time.Duration.between(e.getCreatedAt(), expense.getCreatedAt()).toMinutes()) < 1)
            .findFirst()
            .orElse(null);
        
        if (existing != null) {
            return existing; // Return existing for idempotency
        }
        
        expenses.add(expense);
        persist(expenses);
        return expense;
    }

    public List<Expense> findAll() {
        try {
            if (Files.exists(dataFilePath) && Files.size(dataFilePath) > 0) {
                String content = Files.readString(dataFilePath);
                if (content.trim().isEmpty() || content.trim().equals("[]")) {
                    return new ArrayList<>(inMemoryStore);
                }
                // For simplicity, using in-memory for now
                // In production, you'd parse JSON here
                return new ArrayList<>(inMemoryStore);
            }
        } catch (IOException e) {
            // Fallback to in-memory
        }
        return new ArrayList<>(inMemoryStore);
    }

    public Optional<Expense> findById(String id) {
        return findAll().stream()
            .filter(e -> e.getId().equals(id))
            .findFirst();
    }

    private void persist(List<Expense> expenses) {
        // Update in-memory store
        inMemoryStore.clear();
        inMemoryStore.addAll(expenses);
        
        // Persist to file (simplified - in production use JSON library)
        try {
            if (Files.exists(dataFilePath)) {
                // For now, just keep in memory
                // In production, serialize to JSON
            }
        } catch (Exception e) {
            // Fallback to in-memory only
        }
    }
}

