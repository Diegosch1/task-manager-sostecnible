package com.sostecnible.taskmanager.infrastructure.web.controller;

import com.sostecnible.taskmanager.application.port.in.TaskUseCase;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.domain.model.Priority;
import com.sostecnible.taskmanager.infrastructure.web.dto.TaskRequestDto;
import com.sostecnible.taskmanager.infrastructure.web.dto.TaskResponseDto;
import com.sostecnible.taskmanager.infrastructure.web.mapper.TaskDtoMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskUseCase taskUseCase;
    private final TaskDtoMapper taskDtoMapper;

    public TaskController(TaskUseCase taskUseCase, TaskDtoMapper taskDtoMapper) {
        this.taskUseCase = taskUseCase;
        this.taskDtoMapper = taskDtoMapper;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> create(@Valid @RequestBody TaskRequestDto dto) {
        TaskResponseDto response = taskDtoMapper.toDto(
            taskUseCase.createTask(taskDtoMapper.toDomain(dto))
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDto dto) {
        TaskResponseDto response = taskDtoMapper.toDto(
            taskUseCase.updateTask(id, taskDtoMapper.toDomain(dto))
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskUseCase.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> findById(@PathVariable Long id) {
        return taskUseCase.findById(id)
            .map(task -> ResponseEntity.ok(taskDtoMapper.toDto(task)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> findAll(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Priority priority) {
        List<TaskResponseDto> tasks = taskUseCase.findAll(status, title, sortBy, priority)
            .stream()
            .map(taskDtoMapper::toDto)
            .toList();
        return ResponseEntity.ok(tasks);
    }
}