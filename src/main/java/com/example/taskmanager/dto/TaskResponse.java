package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDateTime createdDate;
    private UserInfo user;
    
    public static class UserInfo {
        private Long id;
        private String username;
        
        public UserInfo(Long id, String username) {
            this.id = id;
            this.username = username;
        }
        
        public Long getId() {
            return id;
        }
        
        public String getUsername() {
            return username;
        }
    }
    
    public TaskResponse(Long id, String title, String description, TaskStatus status, LocalDateTime createdDate, Long userId, String username) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdDate = createdDate;
        this.user = new UserInfo(userId, username);
    }
    
    public Long getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public UserInfo getUser() {
        return user;
    }
}

