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

    @Override
    public void resetPassword(String email, String otp, String newPassword){
        UserEntity existingUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found "+ email));

        if(existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(existingUser.getResetOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepository.save(existingUser);

    }

    @Override
    public void sendOtp(String email){
        UserEntity user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found " + email));

        if(user.isAccountVerified() == true && user.isAccountVerified()){
            return;
        }
        //generate otp for verification
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //set expiration for otp
        // 24 hours
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        //set otp and expiry time
        user.setVerifyOtp(otp);
        user.setVerifyOtpExpireAt(expiryTime);

        //save into the database
        userRepository.save(user);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch(Exception ex){
            throw new RuntimeException("unable to send verification otp");
        }
    }

    @Override
    public void VerifyOtp(String email, String otp){
        UserEntity verifiedUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found " + email));

        if(verifiedUser.getVerifyOtp() == null || !verifiedUser.getVerifyOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(verifiedUser.getVerifyOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP expiried");
        }

        verifiedUser.setVerifyOtp(null);
        verifiedUser.setAccountVerified(true);
        verifiedUser.setVerifyOtpExpireAt(0L);

        userRepository.save(verifiedUser);
    }

    @Override
    public String getLoggedInUserId(String email){
        UserEntity userEntity = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found "+ email));

        return userEntity.getUserId();
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
    