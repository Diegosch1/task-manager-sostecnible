package com.sostecnible.taskmanager.application.port.in;

import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.domain.model.Priority;

import java.util.List;
import java.util.Optional;

public interface TaskUseCase {

    Task createTask(Task task);

    Task updateTask(Long id, Task task);

    void deleteTask(Long id);

    Optional<Task> findById(Long id);

    List<Task> findAll(TaskStatus status, String title, String sortBy, Priority priority);
}