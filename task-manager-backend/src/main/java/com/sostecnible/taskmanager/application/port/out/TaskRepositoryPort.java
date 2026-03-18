package com.sostecnible.taskmanager.application.port.out;

import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;

import java.util.List;
import java.util.Optional;

public interface TaskRepositoryPort {

    Task save(Task task);

    void deleteById(Long id);

    Optional<Task> findById(Long id);

    List<Task> findAll(TaskStatus status, String title, String sortBy);

    boolean existsById(Long id);
}