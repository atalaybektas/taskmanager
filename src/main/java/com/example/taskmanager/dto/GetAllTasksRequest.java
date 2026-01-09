package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;

public class GetAllTasksRequest {
    private TaskStatus status;
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}

