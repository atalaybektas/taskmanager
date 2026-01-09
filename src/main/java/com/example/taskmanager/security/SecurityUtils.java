package com.example.taskmanager.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


 // SecurityContext den mevcut kullanıcının userId'sini almak için kullanılır
 
public class SecurityUtils {
    
    /**
     * Get current authenticated user ID from SecurityContext
     * @return Current user ID
     * @throws IllegalStateException if user is not authenticated
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || 
            !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new IllegalStateException("User is not authenticated");
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userPrincipal.getId();
    }
}

