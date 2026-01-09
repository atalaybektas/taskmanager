package com.example.taskmanager.controller;

import com.example.taskmanager.command.LoginCommand;
import com.example.taskmanager.dto.LoginRequest;
import com.example.taskmanager.dto.LoginResponse;
import com.example.taskmanager.dto.UserResponse;
import com.example.taskmanager.service.UserApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserApplicationService userApplicationService;
    
    @Autowired
    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }
    
    /**
     * Login endpoint
     * POST /api/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginCommand command = new LoginCommand();
        command.setUsername(request.getUsername());
        command.setPassword(request.getPassword());
        
        LoginResponse response = userApplicationService.login(command);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Tüm kullanıcıları getirir
     * Admin paneli için kullanılır
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> responses = userApplicationService.getAllUsers();
        return ResponseEntity.ok(responses);
    }
}

