package com.example.taskmanager.service;

import com.example.taskmanager.command.*;
import com.example.taskmanager.dto.TaskResponse;
import org.springframework.data.domain.Page;


 //role-based access control (admin: tümü, user: sadece kendi)
 
public interface TaskApplicationService {
    
    // görevleri pagination ile getirir (admin: tümü user sadece kendi)
    Page<TaskResponse> getAllTasks(GetAllTasksQuery query);
    
    // yeni görev oluşturur (admin: herhangi bir kullanıcıya user sadece kendine)
    TaskResponse createTask(CreateTaskCommand command);
    
    // görev günceller (admin: herkesin user sadece kendi)
    TaskResponse updateTask(UpdateTaskCommand command);
    
    // görev siler (admin: herkesin user sadece kendi)
    void deleteTask(DeleteTaskCommand command);
}

