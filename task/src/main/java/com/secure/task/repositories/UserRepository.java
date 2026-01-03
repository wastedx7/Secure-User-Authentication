package com.secure.task.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.secure.task.entities.UserDetails;

@Repository
public interface UserRepository extends JpaRepository<UserDetails, Long>{
    // hopefully this will do the job
    Optional<UserDetails> findByEmail(String email);
    Optional<UserDetails> findByVerificationCode(String verificationCode);
    boolean existsByEmail(String email);
}
