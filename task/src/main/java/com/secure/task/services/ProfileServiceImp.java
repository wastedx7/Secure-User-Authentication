package com.secure.task.services;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.secure.task.entities.UserEntity;
import com.secure.task.io.ProfileRequest;
import com.secure.task.io.ProfileResponse;
import com.secure.task.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImp implements ProfileService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request){
        UserEntity newProfile = convertToUserEntity(request);
        if(!userRepository.existsByEmail(request.getEmail())){
            newProfile = userRepository.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    @Override
    public ProfileResponse getProfile(String email){
        UserEntity existingUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found for email : " + email));
        return convertToProfileResponse(existingUser);
    }

    @Override
    public void sendResetOTP(String email){
        UserEntity existingEntity = userRepository.findByEmail(email)       //load the user
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // generate a four digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(1000, 10000));

        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);

        //update the profile of the user
        existingEntity.setResetOtp(otp);
        existingEntity.setResetOtpExpireAt(expiryTime);

        // save everything
        userRepository.save(existingEntity);

        try {
            // send reset otp
            emailService.sendResetOTPEmail(existingEntity.getEmail(), otp);
        } catch(Exception ex) {
            throw new RuntimeException("unable to send reset otp");
        }
    }

    private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
        return ProfileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.isAccountVerified())
                .build();
    }

    private UserEntity convertToUserEntity(ProfileRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID().toString())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }
}
    