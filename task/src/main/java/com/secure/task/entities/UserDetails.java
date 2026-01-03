package com.secure.task.entities;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "userdetails")
@Getter
@Setter
public class UserDetails {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String role;
    private boolean enabled;
    @Column(name = "verification_code")
    private String verificationCode;
    @Column(name = "verification_expiration")
    private LocalDateTime verificationCodeExpiresAt;
    
    public UserDetails(){}

    public UserDetails(Long id, String name, String email, String password, String role){
        this.id = id;
        this.name = name;
        this.email = email; 
        this.password = password;
        this.role = role;
    }

    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of();
    }

    public boolean isAccountExpired(){
        return false;
    }

    public boolean isAccountLocked(){
        return false;
    }

    public boolean isCredentialsExpired(){
        return false;
    }

    public boolean isEnabled(){
        return enabled;
    }

}
