package com.sostecnible.taskmanager.application.service;

import com.sostecnible.taskmanager.application.port.in.TaskUseCase;
import com.sostecnible.taskmanager.application.port.out.TaskRepositoryPort;
import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.domain.model.Priority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService implements TaskUseCase {

    private final TaskRepositoryPort taskRepositoryPort;

    public TaskService(TaskRepositoryPort taskRepositoryPort) {
        this.taskRepositoryPort = taskRepositoryPort;
    }

    @Override
    public Task createTask(Task task) {
        validateDescription(task.getDescription());
        return taskRepositoryPort.save(task);
    }

    @Override
    public Task updateTask(Long id, Task task) {
        if (!taskRepositoryPort.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        validateDescription(task.getDescription());
        task.setId(id);
        return taskRepositoryPort.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepositoryPort.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepositoryPort.deleteById(id);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return taskRepositoryPort.findById(id);
    }

    @Override
    public List<Task> findAll(TaskStatus status, String title, String sortBy, Priority priority) {
        return taskRepositoryPort.findAll(status, title, sortBy, priority);
    }

    // Lógica de negocio: validación de descripción
    private void validateDescription(String description) {
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description cannot be empty");
        }
    }
}