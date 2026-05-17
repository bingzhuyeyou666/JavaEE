package com.zhuly.repository;

import com.zhuly.domain.SpotSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpotSubmissionRepository extends JpaRepository<SpotSubmission, Long> {
    List<SpotSubmission> findByUserIdOrderByCreatedAtDesc(Long userId);
}
