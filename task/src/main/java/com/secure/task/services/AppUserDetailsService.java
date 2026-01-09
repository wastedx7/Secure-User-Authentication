package com.secure.task.services;
import com.secure.task.entities.UserEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.secure.task.repositories.UserRepository;

@Service
public class AppUserDetailsService implements UserDetails{
    
    private final UserRepository userRepository;
    public AppUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        
    }

}
