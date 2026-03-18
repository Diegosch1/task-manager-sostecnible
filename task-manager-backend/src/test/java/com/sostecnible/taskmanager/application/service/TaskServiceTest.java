package com.sostecnible.taskmanager.application.service;

import com.sostecnible.taskmanager.application.port.out.TaskRepositoryPort;
import com.sostecnible.taskmanager.domain.model.Priority;
import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepositoryPort taskRepositoryPort;

    @InjectMocks
    private TaskService taskService;

    private Task validTask;

    @BeforeEach
    void setUp() {
        validTask = new Task(
            1L,
            "Implement authentication",
            "Set up JWT-based authentication for the API",
            Priority.HIGH,
            LocalDateTime.now(),
            LocalDateTime.now().plusDays(7),
            TaskStatus.PENDING
        );
    }

    // -------------------------------------------------------------------------
    // createTask
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Should create task successfully when all fields are valid")
    void createTask_withValidData_shouldReturnCreatedTask() {
        when(taskRepositoryPort.save(any(Task.class))).thenReturn(validTask);

        Task result = taskService.createTask(validTask);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Implement authentication");
        assertThat(result.getStatus()).isEqualTo(TaskStatus.PENDING);
        verify(taskRepositoryPort, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Should throw exception when description is null on create")
    void createTask_withNullDescription_shouldThrowIllegalArgumentException() {
        validTask.setDescription(null);

        assertThatThrownBy(() -> taskService.createTask(validTask))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Description cannot be empty");

        verify(taskRepositoryPort, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when description is blank on create")
    void createTask_withBlankDescription_shouldThrowIllegalArgumentException() {
        validTask.setDescription("   ");

        assertThatThrownBy(() -> taskService.createTask(validTask))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Description cannot be empty");

        verify(taskRepositoryPort, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when description is empty string on create")
    void createTask_withEmptyDescription_shouldThrowIllegalArgumentException() {
        validTask.setDescription("");

        assertThatThrownBy(() -> taskService.createTask(validTask))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Description cannot be empty");

        verify(taskRepositoryPort, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // updateTask
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Should update task successfully when task exists and data is valid")
    void updateTask_withValidData_shouldReturnUpdatedTask() {
        when(taskRepositoryPort.existsById(1L)).thenReturn(true);
        when(taskRepositoryPort.save(any(Task.class))).thenReturn(validTask);

        Task result = taskService.updateTask(1L, validTask);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(taskRepositoryPort, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Should throw exception when updating a non-existent task")
    void updateTask_withNonExistentId_shouldThrowRuntimeException() {
        when(taskRepositoryPort.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.updateTask(99L, validTask))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Task not found with id: 99");

        verify(taskRepositoryPort, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when description is blank on update")
    void updateTask_withBlankDescription_shouldThrowIllegalArgumentException() {
        when(taskRepositoryPort.existsById(1L)).thenReturn(true);
        validTask.setDescription("  ");

        assertThatThrownBy(() -> taskService.updateTask(1L, validTask))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Description cannot be empty");

        verify(taskRepositoryPort, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // deleteTask
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Should delete task successfully when task exists")
    void deleteTask_withExistingId_shouldCallRepository() {
        when(taskRepositoryPort.existsById(1L)).thenReturn(true);

        taskService.deleteTask(1L);

        verify(taskRepositoryPort, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting a non-existent task")
    void deleteTask_withNonExistentId_shouldThrowRuntimeException() {
        when(taskRepositoryPort.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(99L))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Task not found with id: 99");

        verify(taskRepositoryPort, never()).deleteById(any());
    }

    // -------------------------------------------------------------------------
    // findById
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Should return task when it exists")
    void findById_withExistingId_shouldReturnTask() {
        when(taskRepositoryPort.findById(1L)).thenReturn(Optional.of(validTask));

        Optional<Task> result = taskService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should return empty Optional when task does not exist")
    void findById_withNonExistentId_shouldReturnEmptyOptional() {
        when(taskRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.findById(99L);

        assertThat(result).isEmpty();
    }

    // -------------------------------------------------------------------------
    // findAll
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Should return all tasks without filters")
    void findAll_withNoFilters_shouldReturnAllTasks() {
        when(taskRepositoryPort.findAll(null, null, null))
            .thenReturn(List.of(validTask));

        List<Task> result = taskService.findAll(null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Implement authentication");
    }

    @Test
    @DisplayName("Should return filtered tasks by status")
    void findAll_withStatusFilter_shouldReturnFilteredTasks() {
        when(taskRepositoryPort.findAll(TaskStatus.PENDING, null, null))
            .thenReturn(List.of(validTask));

        List<Task> result = taskService.findAll(TaskStatus.PENDING, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(TaskStatus.PENDING);
    }

    @Test
    @DisplayName("Should return empty list when no tasks match the filter")
    void findAll_withStatusFilter_shouldReturnEmptyListWhenNoMatch() {
        when(taskRepositoryPort.findAll(TaskStatus.COMPLETED, null, null))
            .thenReturn(List.of());

        List<Task> result = taskService.findAll(TaskStatus.COMPLETED, null, null);

        assertThat(result).isEmpty();
    }
}