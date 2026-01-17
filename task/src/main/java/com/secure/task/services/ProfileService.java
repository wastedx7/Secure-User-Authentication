package com.secure.task.services;

import com.secure.task.io.ProfileRequest;
import com.secure.task.io.ProfileResponse;

public interface ProfileService {
    
        ProfileResponse createProfile(ProfileRequest request);

        ProfileResponse getProfile(String email);

        void sendResetOTP(String email);

        void resetPassword(String email, String otp, String newPassword);

        void sendOtp(String email);

        void VerifyOtp(String email, String otp);

        String getLoggedInUserId(String email);
}
