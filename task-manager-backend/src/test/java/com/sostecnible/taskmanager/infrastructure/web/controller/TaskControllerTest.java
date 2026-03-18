package com.sostecnible.taskmanager.infrastructure.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sostecnible.taskmanager.application.port.in.TaskUseCase;
import com.sostecnible.taskmanager.domain.model.Priority;
import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.infrastructure.web.dto.TaskRequestDto;
import com.sostecnible.taskmanager.infrastructure.web.mapper.TaskDtoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock
    private TaskUseCase taskUseCase;

    @Mock
    private TaskDtoMapper taskDtoMapper;

    @InjectMocks
    private TaskController taskController;

    private Task sampleTask;
    private TaskRequestDto sampleRequest;

    @BeforeEach
    void setUp() {
        sampleTask = new Task(
            1L,
            "Write unit tests",
            "Cover all critical business logic with unit tests",
            Priority.MEDIUM,
            LocalDateTime.now(),
            LocalDateTime.now().plusDays(3),
            TaskStatus.PENDING
        );

        sampleRequest = new TaskRequestDto();
        sampleRequest.setTitle("Write unit tests");
        sampleRequest.setDescription("Cover all critical business logic with unit tests");
        sampleRequest.setPriority(Priority.MEDIUM);
        sampleRequest.setStatus(TaskStatus.PENDING);
    }

    // -------------------------------------------------------------------------
    // createTask
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("POST /api/tasks — should return 201 when task is created successfully")
    void createTask_withValidData_shouldReturn201() {
        when(taskDtoMapper.toDomain(any(TaskRequestDto.class))).thenReturn(sampleTask);
        when(taskUseCase.createTask(any(Task.class))).thenReturn(sampleTask);
        when(taskDtoMapper.toDto(any(Task.class))).thenReturn(null);

        ResponseEntity<?> response = taskController.create(sampleRequest);

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        verify(taskUseCase, times(1)).createTask(any(Task.class));
    }

    @Test
    @DisplayName("POST /api/tasks — should call use case once when creating a task")
    void createTask_shouldDelegateToUseCase() {
        when(taskDtoMapper.toDomain(any(TaskRequestDto.class))).thenReturn(sampleTask);
        when(taskUseCase.createTask(any(Task.class))).thenReturn(sampleTask);
        when(taskDtoMapper.toDto(any(Task.class))).thenReturn(null);

        taskController.create(sampleRequest);

        verify(taskUseCase, times(1)).createTask(any(Task.class));
    }

    // -------------------------------------------------------------------------
    // findAll
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("GET /api/tasks — should return 200 with list of tasks")
    void findAll_shouldReturn200WithTaskList() {
        when(taskUseCase.findAll(null, null, null)).thenReturn(List.of(sampleTask));
        when(taskDtoMapper.toDto(any(Task.class))).thenReturn(null);

        ResponseEntity<?> response = taskController.findAll(null, null, null);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
    }

    @Test
    @DisplayName("GET /api/tasks — should return empty list when no tasks exist")
    void findAll_withNoTasks_shouldReturnEmptyList() {
        when(taskUseCase.findAll(null, null, null)).thenReturn(List.of());

        ResponseEntity<?> response = taskController.findAll(null, null, null);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat((List<?>) response.getBody()).isEmpty();
    }

    // -------------------------------------------------------------------------
    // findById
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("GET /api/tasks/{id} — should return 200 when task exists")
    void findById_withExistingId_shouldReturn200() {
        when(taskUseCase.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskDtoMapper.toDto(any(Task.class))).thenReturn(null);

        ResponseEntity<?> response = taskController.findById(1L);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
    }

    @Test
    @DisplayName("GET /api/tasks/{id} — should return 404 when task does not exist")
    void findById_withNonExistentId_shouldReturn404() {
        when(taskUseCase.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = taskController.findById(99L);

        assertThat(response.getStatusCode().value()).isEqualTo(404);
    }

    // -------------------------------------------------------------------------
    // updateTask
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("PUT /api/tasks/{id} — should return 200 when task is updated successfully")
    void updateTask_withValidData_shouldReturn200() {
        when(taskDtoMapper.toDomain(any(TaskRequestDto.class))).thenReturn(sampleTask);
        when(taskUseCase.updateTask(eq(1L), any(Task.class))).thenReturn(sampleTask);
        when(taskDtoMapper.toDto(any(Task.class))).thenReturn(null);

        ResponseEntity<?> response = taskController.update(1L, sampleRequest);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
    }

    @Test
    @DisplayName("PUT /api/tasks/{id} — should delegate update to use case with correct id")
    void updateTask_shouldDelegateToUseCaseWithCorrectId() {
        when(taskDtoMapper.toDomain(any(TaskRequestDto.class))).thenReturn(sampleTask);
        when(taskUseCase.updateTask(eq(1L), any(Task.class))).thenReturn(sampleTask);
        when(taskDtoMapper.toDto(any(Task.class))).thenReturn(null);

        taskController.update(1L, sampleRequest);

        verify(taskUseCase, times(1)).updateTask(eq(1L), any(Task.class));
    }

    // -------------------------------------------------------------------------
    // deleteTask
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("DELETE /api/tasks/{id} — should return 204 when task is deleted")
    void deleteTask_withExistingId_shouldReturn204() {
        ResponseEntity<?> response = taskController.delete(1L);

        assertThat(response.getStatusCode().value()).isEqualTo(204);
        verify(taskUseCase, times(1)).deleteTask(1L);
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id} — should delegate deletion to use case")
    void deleteTask_shouldDelegateToUseCase() {
        taskController.delete(1L);

        verify(taskUseCase, times(1)).deleteTask(1L);
    }
}