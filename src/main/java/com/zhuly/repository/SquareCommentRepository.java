/**
 * 本文件定义 SquareCommentRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.SquareComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * SquareCommentRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface SquareCommentRepository extends JpaRepository<SquareComment, Long> {
    // 查询并返回 findByPostIdOrderByCreatedAtAsc 对应的数据
    List<SquareComment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
