package com.example.taskmanager.command;

import com.example.taskmanager.entity.TaskStatus;

/**
 * Create Task use case command
 * currentUserId is obtained from SecurityContext in service layer
 */
public class CreateTaskCommand {
    private Long targetUserId; // For ADMIN: can create tasks for other users (optional)
    private String title;
    private String description;
    private TaskStatus status;
    
    // Constructors
    public CreateTaskCommand() {
    }
    
    // Getters and Setters
    
    public Long getTargetUserId() {
        return targetUserId;
    }
    
    public void setTargetUserId(Long targetUserId) {
        this.targetUserId = targetUserId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}

