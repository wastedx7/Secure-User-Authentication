package com.secure.task.services;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.secure.task.entities.UserDetails;
import com.secure.task.io.ProfileRequest;
import com.secure.task.io.ProfileResponse;
import com.secure.task.repositories.UserRepository;

@Service
public class ProfileServiceImp implements ProfileService {
    
    private final UserRepository userRepository;
    public ProfileServiceImp(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public ProfileResponse createProfile(ProfileRequest request){
        UserDetails newProfile = convertToUserEntity(request);
        if(!userRepository.existsByEmail(request.getEmail())){
            newProfile = userRepository.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    private ProfileResponse convertToProfileResponse(UserDetails newProfile) {
        return ProfileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.isAccountVerified())
                .build();
    }

    private UserDetails convertToUserEntity(ProfileRequest request) {
        return UserDetails.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID().toString())
                .name(request.getName())
                .password(request.getPassword())
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }
}
    