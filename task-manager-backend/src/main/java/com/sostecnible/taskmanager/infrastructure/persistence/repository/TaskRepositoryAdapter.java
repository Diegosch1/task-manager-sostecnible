package com.sostecnible.taskmanager.infrastructure.persistence.repository;

import com.sostecnible.taskmanager.application.port.out.TaskRepositoryPort;
import com.sostecnible.taskmanager.domain.model.Task;
import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.infrastructure.persistence.entity.TaskEntity;
import com.sostecnible.taskmanager.infrastructure.persistence.mapper.TaskMapper;
import com.sostecnible.taskmanager.infrastructure.persistence.specification.TaskSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

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
    public List<Task> findAll(TaskStatus status, String title, String sortBy) {
        Specification<TaskEntity> spec = Specification
            .where(TaskSpecification.hasStatus(status))
            .and(TaskSpecification.titleContains(title));

        Sort sort = resolveSort(sortBy);

        return jpaTaskRepository.findAll(spec, sort)
            .stream()
            .map(taskMapper::toDomain)
            .toList();
    }

    private Sort resolveSort(String sortBy) {
        if ("priority".equalsIgnoreCase(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "priority");
        }
        return Sort.by(Sort.Direction.DESC, "createdAt");
    }
}