package com.secure.task.services;
import java.util.ArrayList;

import com.secure.task.entities.UserEntity;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.secure.task.repositories.UserRepository;

@Service
public class AppUserDetailsService implements UserDetailsService{
    
    private final UserRepository userRepository;
    public AppUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        UserEntity existingUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email does not exist : " + email));
        return new User(existingUser.getEmail(), existingUser.getPassword(), new ArrayList<>());
    }

} 
