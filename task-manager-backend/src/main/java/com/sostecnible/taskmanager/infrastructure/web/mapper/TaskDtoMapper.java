package com.sostecnible.taskmanager.infrastructure.web.mapper;

import com.sostecnible.taskmanager.domain.model.Task;
// import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.infrastructure.web.dto.TaskRequestDto;
import com.sostecnible.taskmanager.infrastructure.web.dto.TaskResponseDto;
import org.springframework.stereotype.Component;

@Component
public class TaskDtoMapper {

    public Task toDomain(TaskRequestDto dto) {
        Task task = new Task(
            dto.getTitle(),
            dto.getDescription(),
            dto.getPriority(),
            dto.getDueDate()
        );
        if (dto.getStatus() != null) {
            task.setStatus(dto.getStatus());
        }
        return task;
    }

    public TaskResponseDto toDto(Task domain) {
        return new TaskResponseDto(
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