package com.example.taskmanager.command;

/**
 * Delete Task use case command
 * currentUserId is obtained from SecurityContext in service layer
 */
public class DeleteTaskCommand {
    private Long taskId;
    
    // Constructors
    public DeleteTaskCommand() {
    }
    
    // Getters and Setters
    public Long getTaskId() {
        return taskId;
    }
    
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
}

