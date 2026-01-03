package com.secure.task.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.secure.task.entities.UserDetails;
import com.secure.task.repositories.UserRepository;


@Service
public class UserService {
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public UserDetails registerUser(UserDetails userDetails){
        String encodedPassword = passwordEncoder.encode(userDetails.getPassword());
        userDetails.setPassword(encodedPassword);
        return userRepository.save(userDetails);
    }
}
