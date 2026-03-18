package com.sostecnible.taskmanager.infrastructure.persistence.repository;

import com.sostecnible.taskmanager.application.port.out.TaskRepositoryPort;
import com.sostecnible.taskmanager.domain.model.Priority;
import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.infrastructure.persistence.entity.TaskEntity;
import com.sostecnible.taskmanager.infrastructure.persistence.mapper.TaskMapper;
import com.sostecnible.taskmanager.infrastructure.persistence.specification.TaskSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TaskRepositoryAdapter implements TaskRepositoryPort {

    private final JpaTaskRepository jpaTaskRepository;
    private final TaskMapper taskMapper;

    public TaskRepositoryAdapter(JpaTaskRepository jpaTaskRepository, TaskMapper taskMapper) {
        this.jpaTaskRepository = jpaTaskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = taskMapper.toEntity(task);
        return taskMapper.toDomain(jpaTaskRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpaTaskRepository.deleteById(id);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return jpaTaskRepository.findById(id).map(taskMapper::toDomain);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaTaskRepository.existsById(id);
    }

    @Override
    public List<Task> findAll(TaskStatus status, String title, String sortBy, Priority priority) {
        // Build dynamic filter specification
        Specification<TaskEntity> spec = Specification
            .where(TaskSpecification.hasStatus(status))
            .and(TaskSpecification.titleContains(title))
            .and(TaskSpecification.hasPriority(priority));

        // Fetch from DB without sort — we sort in memory for priority
        List<Task> tasks = jpaTaskRepository.findAll(spec)
            .stream()
            .map(taskMapper::toDomain)
            .collect(Collectors.toList());

        // Apply sort in memory so priority follows logical order HIGH → MEDIUM → LOW
        if ("priority".equalsIgnoreCase(sortBy)) {
            tasks.sort(Comparator.comparingInt(task -> priorityOrder(task.getPriority())));
        } else {
            // Default: most recently created first
            tasks.sort(Comparator.comparing(Task::getCreatedAt, Comparator.reverseOrder()));
        }

        return tasks;
    }

    // Maps priority to a sortable integer: HIGH=0, MEDIUM=1, LOW=2
    private int priorityOrder(Priority priority) {
        return switch (priority) {
            case HIGH   -> 0;
            case MEDIUM -> 1;
            case LOW    -> 2;
        };
    }
}