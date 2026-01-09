package com.example.taskmanager.service.impl;

import com.example.taskmanager.command.LoginCommand;
import com.example.taskmanager.dto.LoginResponse;
import com.example.taskmanager.dto.UserResponse;
import com.example.taskmanager.entity.Role;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.UnauthorizedException;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtTokenProvider;
import com.example.taskmanager.security.UserPrincipal;
import com.example.taskmanager.service.UserApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserApplicationServiceImpl(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginCommand command) {
        // Username and password validation is handled by Bean Validation at controller level
        String username = command.getUsername();
        String password = command.getPassword();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }
        
        // Generate JWT token
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String token = jwtTokenProvider.generateToken(userPrincipal);
        
        return new LoginResponse(user.getId(), user.getUsername(), user.getRole(), token);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getUsername(), user.getRole()))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void testUserCreate() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        
        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword(passwordEncoder.encode("password1"));
        user1.setRole(Role.USER);
        userRepository.save(user1);
        
        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword(passwordEncoder.encode("password2"));
        user2.setRole(Role.USER);
        userRepository.save(user2);
        
        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword(passwordEncoder.encode("password3"));
        user3.setRole(Role.USER);
        userRepository.save(user3);
    }
}

