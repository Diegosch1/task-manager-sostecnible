package com.sostecnible.taskmanager.infrastructure.web.dto;

import com.sostecnible.taskmanager.domain.model.Priority;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private LocalDateTime dueDate;

    private TaskStatus status;
}