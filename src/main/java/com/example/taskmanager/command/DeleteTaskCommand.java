package com.example.taskmanager.command;


public class DeleteTaskCommand {
    private Long taskId;
    
    
    public DeleteTaskCommand() {
    }
    
    
    public Long getTaskId() {
        return taskId;
    }
    
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
}

