package com.example.taskmanager.service.impl;

import com.example.taskmanager.command.*;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.entity.Role;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.exception.UnauthorizedException;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.SecurityUtils;
import com.example.taskmanager.service.TaskApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TaskApplicationServiceImpl implements TaskApplicationService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    
    public TaskApplicationServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(GetAllTasksQuery query) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Pagination parametrelerini al (default değerler)
        int page = query.getPage() != null && query.getPage() >= 0 ? query.getPage() : 0;
        int size = 10; // Sabit: Her zaman 10 görev gösterilir 
        
        // gelen sort parametresini al (parse et)
        Sort sort = parseSort(query.getSort());
        Pageable pageable = PageRequest.of(page, size, sort);
        
        TaskStatus status = query.getStatus();
        Page<Task> taskPage;
        
        // filtreleme işlemi status a gore admin user kontroluyle
        boolean isAdmin = Role.ADMIN.equals(currentUser.getRole());
        
        if (status != null) {
            if (isAdmin) {
                // Admin: Tüm status filtrelenmiş görevler
                taskPage = taskRepository.findByStatus(status, pageable);
            } else {
                // User: Sadece kendi status filtrelenmiş görevleri
                taskPage = taskRepository.findByUserIdAndStatus(currentUserId, status, pageable);
            }
        } else {
            // Status filtresi yoksa
            if (isAdmin) {
                // Admin: Tüm görevler
                taskPage = taskRepository.findAll(pageable);
            } else {
                // User: Sadece kendi görevleri
                taskPage = taskRepository.findByUserId(currentUserId, pageable);
            }
        }
        
        // Entity'den DTO'ya dönüşüm (Page mapping)
        return taskPage.map(task -> new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getCreatedDate(),
            task.getUser().getId(),
            task.getUser().getUsername()
        ));
    }
    
    
    // String formatındaki sort bilgisini Spring Sort objesine çevirir
    // paremetre yoksa default date e gore descending yap
    private Sort parseSort(String sortString) {
        if (sortString == null || sortString.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "createdDate");
        }
        
        String[] parts = sortString.split(",");
        if (parts.length != 2) {
            return Sort.by(Sort.Direction.DESC, "createdDate");
        }
        
        String field = parts[0].trim();
        String direction = parts[1].trim().toLowerCase();
        
        Sort.Direction sortDirection = "asc".equals(direction) 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        
        return Sort.by(sortDirection, field);
    }
    
    @Override
    @Transactional
    public TaskResponse createTask(CreateTaskCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        
        // Title validation controller da Bean Validation ile yapılır
        String title = command.getTitle();
        Long targetUserId = command.getTargetUserId() != null ? command.getTargetUserId() : currentUserId;
        
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        
        // Authorization - admin kontrolu yapılır
        boolean isAdmin = Role.ADMIN.equals(currentUser.getRole());
        if (!isAdmin && !currentUserId.equals(targetUserId)) {
            throw new UnauthorizedException("You can only create tasks for yourself");
        }
        
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));
        
        // entity oluştur constructorıyla
        Task task = new Task();
        task.setTitle(title.trim());
        task.setDescription(command.getDescription());

        // Frontend'den gelen status'u kullan, yoksa default olarak NEW atanır
        task.setStatus(command.getStatus() != null ? command.getStatus() : TaskStatus.NEW);
        task.setUser(targetUser);
        task.setCreatedDate(LocalDateTime.now());
        
        Task savedTask = taskRepository.save(task);
        
        return new TaskResponse(
            savedTask.getId(),
            savedTask.getTitle(),
            savedTask.getDescription(),
            savedTask.getStatus(),
            savedTask.getCreatedDate(),
            savedTask.getUser().getId(),
            savedTask.getUser().getUsername()
        );
    }
    
    @Override
    @Transactional
    public TaskResponse updateTask(UpdateTaskCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        
        // Title validation controller da Bean Validation ile yapılır
        String title = command.getTitle();
        
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        
        Task task = taskRepository.findById(command.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        // Authorization 
        boolean isAdmin = Role.ADMIN.equals(currentUser.getRole());
        if (!isAdmin && !task.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only update your own tasks");
        }
        
        // Güncelle 
        task.setTitle(title.trim());
        task.setDescription(command.getDescription());
        task.setStatus(command.getStatus());
        
        // sadece admin görevin sahibini değiştirebilir
        Long targetUserId = command.getTargetUserId();
        if (isAdmin && targetUserId != null && !targetUserId.equals(task.getUser().getId())) {
            User targetUser = userRepository.findById(targetUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));
            task.setUser(targetUser);
        }
        
        Task savedTask = taskRepository.save(task);
        
        return new TaskResponse(
            savedTask.getId(),
            savedTask.getTitle(),
            savedTask.getDescription(),
            savedTask.getStatus(),
            savedTask.getCreatedDate(),
            savedTask.getUser().getId(),
            savedTask.getUser().getUsername()
        );
    }
    
    @Override
    @Transactional
    public void deleteTask(DeleteTaskCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        
        Task task = taskRepository.findById(command.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        // Authorization - Service katmanında
        boolean isAdmin = Role.ADMIN.equals(currentUser.getRole());
        if (!isAdmin && !task.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only delete your own tasks");
        }
        
        taskRepository.delete(task);
    }
}

