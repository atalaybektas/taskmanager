package com.example.taskmanager.command;

import com.example.taskmanager.entity.TaskStatus;


public class GetAllTasksQuery {
    private TaskStatus status; 
    private Integer page;     
    
    private String sort;       
    
    
    public GetAllTasksQuery() {
    }
    
   
    
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

