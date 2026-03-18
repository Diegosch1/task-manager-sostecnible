package com.sostecnible.taskmanager.infrastructure.persistence.repository;

import com.sostecnible.taskmanager.infrastructure.persistence.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpaTaskRepository extends 
    JpaRepository<TaskEntity, Long>,
    JpaSpecificationExecutor<TaskEntity> {
}