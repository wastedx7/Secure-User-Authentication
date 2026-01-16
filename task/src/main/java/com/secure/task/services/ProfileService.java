package com.secure.task.services;

import com.secure.task.io.ProfileRequest;
import com.secure.task.io.ProfileResponse;

public interface ProfileService {
    
        ProfileResponse createProfile(ProfileRequest request);

        ProfileResponse getProfile(String email);
}
