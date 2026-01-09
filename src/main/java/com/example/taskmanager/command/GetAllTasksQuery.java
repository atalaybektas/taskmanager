package com.example.taskmanager.command;

import com.example.taskmanager.entity.TaskStatus;

/**
 * Get All Tasks use case query
 * currentUserId is obtained from SecurityContext in service layer
 */
public class GetAllTasksQuery {
    private TaskStatus status; // Optional filter
    private Integer page;      // Page number (0-indexed)
    // Size kaldırıldı: Her zaman 10 görev gösterilir (backend'de sabit)
    private String sort;       // Sort field and direction (e.g., "createdDate,desc")
    
    // Constructors
    public GetAllTasksQuery() {
    }
    
    // Getters and Setters
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public Integer getPage() {
        return page;
    }
    
    public void setPage(Integer page) {
        this.page = page;
    }
    
    public String getSort() {
        return sort;
    }
    
    public void setSort(String sort) {
        this.sort = sort;
    }
}

