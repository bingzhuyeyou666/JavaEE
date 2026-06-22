/**
 * 本文件定义 SquarePostRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.SquarePost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * SquarePostRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface SquarePostRepository extends JpaRepository<SquarePost, Long> {
    // 查询并返回 findByHiddenFalseOrderByCreatedAtDesc 对应的数据
    List<SquarePost> findByHiddenFalseOrderByCreatedAtDesc();
    // 查询并返回 findByCategoryAndHiddenFalseOrderByCreatedAtDesc 对应的数据
    List<SquarePost> findByCategoryAndHiddenFalseOrderByCreatedAtDesc(String category);
    // 查询并返回 findByUserIdOrderByCreatedAtDesc 对应的数据
    List<SquarePost> findByUserIdOrderByCreatedAtDesc(Long userId);
}
