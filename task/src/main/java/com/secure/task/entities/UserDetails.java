package com.secure.task.entities;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "userdetails")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetails {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String userId;
    @Column(nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String verifyOtp;
    private boolean isAccountVerified;
    private Long verifyOtpExpireAt;
    private String resetOtp;    
    private Long resetOtpExpireAt;

    @CreationTimestamp
    @Column(updatable=false)
    private Timestamp createdAt;
    @UpdateTimestamp
    private Timestamp updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getVerifyOtp() { return verifyOtp; }
    public void setVerifyOtp(String verifyOtp) { this.verifyOtp = verifyOtp; }

    public boolean isAccountVerified() { return isAccountVerified; }
    public void setAccountVerified(boolean isAccountVerified) { this.isAccountVerified = isAccountVerified; }

    public Long getVerifyOtpExpireAt() { return verifyOtpExpireAt; }
    public void setVerifyOtpExpireAt(Long verifyOtpExpireAt) { this.verifyOtpExpireAt = verifyOtpExpireAt; }

    public String getResetOtp() { return resetOtp; }
    public void setResetOtp(String resetOtp) { this.resetOtp = resetOtp; }

    public Long getResetOtpExpireAt() { return resetOtpExpireAt; }
    public void setResetOtpExpireAt(Long resetOtpExpireAt) { this.resetOtpExpireAt = resetOtpExpireAt; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

}
