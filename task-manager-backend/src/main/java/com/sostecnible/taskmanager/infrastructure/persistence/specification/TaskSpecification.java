package com.sostecnible.taskmanager.infrastructure.persistence.specification;

import com.sostecnible.taskmanager.domain.model.TaskStatus;
import com.sostecnible.taskmanager.infrastructure.persistence.entity.TaskEntity;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {

    public static Specification<TaskEntity> hasStatus(TaskStatus status) {
        return (root, query, cb) ->
            status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<TaskEntity> titleContains(String title) {
        return (root, query, cb) ->
            (title == null || title.isBlank()) ? null :
            cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
}