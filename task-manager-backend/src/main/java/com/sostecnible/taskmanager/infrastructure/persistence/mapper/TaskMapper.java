package com.sostecnible.taskmanager.infrastructure.persistence.mapper;

import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.infrastructure.persistence.entity.TaskEntity;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toDomain(TaskEntity entity) {
        return new Task(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getPriority(),
            entity.getCreatedAt(),
            entity.getDueDate(),
            entity.getStatus()
        );
    }

    public TaskEntity toEntity(Task domain) {
        return new TaskEntity(
            domain.getId(),
            domain.getTitle(),
            domain.getDescription(),
            domain.getPriority(),
            domain.getCreatedAt(),
            domain.getDueDate(),
            domain.getStatus()
        );
    }
}