package com.example.taskmanager.config;

import com.example.taskmanager.service.UserApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {
    
    private final UserApplicationService userApplicationService;
    
    @Autowired
    public DataInitializer(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }
    
    @Override
    public void run(String... args) {
        userApplicationService.testUserCreate();
    }
}

