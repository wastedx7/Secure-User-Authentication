package com.secure.task.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProfileRequest {
    
    @NotBlank(message = "name cannot be empty")
    private String name;
    @Email(message = "enter a valid email: eg;- someone@gmail.com")
    @NotNull(message = "email cannot be empty")
    private String email;
    @Size(min = 6, message = "password must be atleast 6 characters")
    private String password;

    public ProfileRequest(){}

    public ProfileRequest(
        String name,
        String email,
        String password
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
