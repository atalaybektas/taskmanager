package com.example.taskmanager.command;

import com.example.taskmanager.entity.TaskStatus;

/**
 * Update Task use case command
 * currentUserId is obtained from SecurityContext in service layer
 */
public class UpdateTaskCommand {
    private Long taskId;
    private Long targetUserId; // For ADMIN: can change task owner (optional)
    private String title;
    private String description;
    private TaskStatus status;
    
    // Constructors
    public UpdateTaskCommand() {
    }
    
    // Getters and Setters
    public Long getTaskId() {
        return taskId;
    }
    
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
    
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

