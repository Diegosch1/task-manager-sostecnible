package com.sostecnible.taskmanager.domain.model;

import java.time.LocalDateTime;

public class Task {

    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private TaskStatus status;

    // Complete constructor
    public Task(Long id, String title, String description,
                Priority priority, LocalDateTime createdAt,
                LocalDateTime dueDate, TaskStatus status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.createdAt = createdAt;
        this.dueDate = dueDate;
        this.status = status;
    }

    // Constructor for creating a new task
    public Task(String title, String description,
                Priority priority, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.status = TaskStatus.PENDING;
        this.createdAt = LocalDateTime.now();        
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Priority getPriority() { return priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDueDate() { return dueDate; }
    public TaskStatus getStatus() { return status; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public void setStatus(TaskStatus status) { this.status = status; }
}