package com.zhuly.repository;

import com.zhuly.domain.UserProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUsername(String username);
    Optional<UserProfile> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
