package com.zhuly.repository;

import com.zhuly.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySpotIdAndHiddenFalseOrderByCreatedAtDesc(Long spotId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countByUserId(Long userId);
    List<Review> findByUserIdAndHiddenFalse(Long userId);
    boolean existsBySpotIdAndSourceAndSourceReviewKey(Long spotId, String source, String sourceReviewKey);
    long countBySpotIdAndSource(Long spotId, String source);
}
