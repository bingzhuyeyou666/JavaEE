package com.zhuly.repository;

import com.zhuly.domain.SquarePost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SquarePostRepository extends JpaRepository<SquarePost, Long> {
    List<SquarePost> findByHiddenFalseOrderByCreatedAtDesc();
    List<SquarePost> findByCategoryAndHiddenFalseOrderByCreatedAtDesc(String category);
    List<SquarePost> findByUserIdOrderByCreatedAtDesc(Long userId);
}
