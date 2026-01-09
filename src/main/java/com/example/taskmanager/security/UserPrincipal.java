package com.example.taskmanager.security;

import com.example.taskmanager.entity.Role;
import com.example.taskmanager.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security UserDetails implementation
 */
public class UserPrincipal implements UserDetails {
    
    private final Long id;
    private final String username;
    private final String password;
    private final Role role;
    private final Collection<? extends GrantedAuthority> authorities;
    
    public UserPrincipal(Long id, String username, String password, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    public static UserPrincipal create(User user) {
        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            user.getRole()
        );
    }
    
    public Long getId() {
        return id;
    }
    
    public Role getRole() {
        return role;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    // Spring Security UserDetails contract - zorunlu metodlar
   
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
}

