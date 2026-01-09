package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Role;

public class UserResponse {
    private Long id;
    private String username;
    private Role role;
    
    public UserResponse(Long id, String username, Role role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public Role getRole() {
        return role;
    }
}

