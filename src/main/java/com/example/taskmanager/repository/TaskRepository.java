package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // SELECT * FROM tasks WHERE user_id = ? ORDER BY ... LIMIT ? OFFSET ?
    Page<Task> findByUserId(Long userId, Pageable pageable);
    
    // SELECT * FROM tasks WHERE user_id = ? AND status = ? ORDER BY ... LIMIT ? OFFSET ?
    Page<Task> findByUserIdAndStatus(Long userId, TaskStatus status, Pageable pageable);
    
    // SELECT * FROM tasks WHERE status = ? ORDER BY ... LIMIT ? OFFSET ?
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
}

