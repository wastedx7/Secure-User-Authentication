package com.secure.task.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.secure.task.entities.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{
    // hopefully this will do the job
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
