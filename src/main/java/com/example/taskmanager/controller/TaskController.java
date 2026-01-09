package com.example.taskmanager.controller;

import com.example.taskmanager.command.*;
import com.example.taskmanager.dto.*;
import com.example.taskmanager.service.TaskApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * task controller - görev CRUD işlemleri için REST API
 * HTTP request'i alır, Command/Query'ye map eder, service'e gönderir
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    private final TaskApplicationService taskApplicationService;
    
    @Autowired
    public TaskController(TaskApplicationService taskApplicationService) {
        this.taskApplicationService = taskApplicationService;
    }
    
    // görevleri pagination ile getirir (role-based: admin tümü, user sadece kendi)
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @ModelAttribute GetAllTasksRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String sort) {
        
        GetAllTasksQuery query = new GetAllTasksQuery();
        query.setStatus(request.getStatus());
        query.setPage(page);
        query.setSort(sort);
        
        Page<TaskResponse> tasks = taskApplicationService.getAllTasks(query);
        return ResponseEntity.ok(tasks);
    }
    
    // yeni görev oluşturur (admin: herhangi bir kullanıcıya, user: sadece kendine)
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        CreateTaskCommand command = new CreateTaskCommand();
        command.setTargetUserId(request.getTargetUserId());
        command.setTitle(request.getTitle());
        command.setDescription(request.getDescription());
        command.setStatus(request.getStatus());
        
        TaskResponse task = taskApplicationService.createTask(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }
    
    // görev günceller (admin: herkesin, user: sadece kendi)
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request) {
        UpdateTaskCommand command = new UpdateTaskCommand();
        command.setTaskId(id);
        command.setTargetUserId(request.getTargetUserId());
        command.setTitle(request.getTitle());
        command.setDescription(request.getDescription());
        command.setStatus(request.getStatus());
        
        TaskResponse task = taskApplicationService.updateTask(command);
        return ResponseEntity.ok(task);
    }
    
    // görev siler (admin: herkesin, user: sadece kendi)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        DeleteTaskCommand command = new DeleteTaskCommand();
        command.setTaskId(id);
        
        taskApplicationService.deleteTask(command);
        return ResponseEntity.noContent().build();
    }
}

