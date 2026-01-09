package com.example.taskmanager.repository;

import com.example.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // SELECT * FROM users WHERE username = ?
    Optional<User> findByUsername(String username);
    
    // SELECT COUNT(*) > 0 FROM users WHERE username = ?
    boolean existsByUsername(String username);
}

