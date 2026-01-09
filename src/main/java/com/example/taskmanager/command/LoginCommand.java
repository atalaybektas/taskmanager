package com.example.taskmanager.command;

/**
 * Login use case command
 */
public class LoginCommand {
    private String username;
    private String password;
    
    // Constructors
    public LoginCommand() {
    }
    
    // Getters and Setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

