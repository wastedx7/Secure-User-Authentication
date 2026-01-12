package com.secure.task.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secure.task.services.ProfileService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.secure.task.io.ProfileRequest;
import com.secure.task.io.ProfileResponse;


@RestController
@RequestMapping("/api")
public class ProfileController {
    
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService){
        this.profileService = profileService;
    }

    @PostMapping("/register")
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createProfile(request);
        // TODO : send email
        return response;
    }
    
}
