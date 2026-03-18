package com.sostecnible.taskmanager.infrastructure.web.dto;

import com.sostecnible.taskmanager.domain.model.Priority;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private TaskStatus status;
}