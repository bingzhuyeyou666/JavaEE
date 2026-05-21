package com.zhuly.repository;

import com.zhuly.domain.SquareComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SquareCommentRepository extends JpaRepository<SquareComment, Long> {
    List<SquareComment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
