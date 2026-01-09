package com.secure.task.io;

import lombok.Builder;
import lombok.Data;


@Builder
public class ProfileResponse {
    
    private String userId;
    private String name;
    private String email;
    private boolean isAccountVerified;

    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isAccountVerified() { return isAccountVerified; }
}
