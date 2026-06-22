/**
 * 本文件定义 ReviewRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * ReviewRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 查询并返回 findBySpotIdAndHiddenFalseOrderByCreatedAtDesc 对应的数据
    List<Review> findBySpotIdAndHiddenFalseOrderByCreatedAtDesc(Long spotId);
    // 查询并返回 findByUserIdOrderByCreatedAtDesc 对应的数据
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    // 执行 countByUserId 方法对应的业务处理
    int countByUserId(Long userId);
    // 查询并返回 findByUserIdAndHiddenFalse 对应的数据
    List<Review> findByUserIdAndHiddenFalse(Long userId);
}
