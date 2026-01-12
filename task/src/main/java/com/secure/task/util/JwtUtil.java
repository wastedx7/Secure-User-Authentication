package com.secure.task.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtil {
    
    @Value("${jwt.secret-key}")
    private String SECRET_KEY;
    
    // this takes userDetails simply for its email 
    public String generateToken(UserDetails userDetails){
        // claims is the three parts of jwt token 
        Map<String, Object> claims = new HashMap();
        // create token will return a token for the username as in the claims format
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String username){
        Jwts.builder()              
            .setClaims(claims)          // set claims
            .setSubject(username)       // for username
            .setIssuedAt(new Date(System.currentTimeMillis()))      // issue date = now
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))  // 24 hours 
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)     // idk about this, some algorithm used for the token
            .compact();         // this will concatinate all three parts of the final token
    }
}
