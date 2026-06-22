/**
 * 本文件定义 SpotSubmissionRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.SpotSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * SpotSubmissionRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface SpotSubmissionRepository extends JpaRepository<SpotSubmission, Long> {
    // 查询并返回 findByUserIdOrderByCreatedAtDesc 对应的数据
    List<SpotSubmission> findByUserIdOrderByCreatedAtDesc(Long userId);
}
