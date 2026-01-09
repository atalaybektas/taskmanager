package com.example.taskmanager.service;

import com.example.taskmanager.command.LoginCommand;
import com.example.taskmanager.dto.LoginResponse;
import com.example.taskmanager.dto.UserResponse;

import java.util.List;


 //login, kullanıcı listesi ve test kullanıcı oluşturma başlangıçta
 
public interface UserApplicationService {
    
    // kullanıcı girişi yapar, jwt token döner
    LoginResponse login(LoginCommand command);
    
    // tüm kullanıcıları getirir (admin paneli için)
    List<UserResponse> getAllUsers();
    
    // test kullanıcıları oluşturur (development için)
    void testUserCreate();
}

