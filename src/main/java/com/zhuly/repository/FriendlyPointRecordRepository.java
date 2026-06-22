/**
 * 本文件定义 FriendlyPointRecordRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.FriendlyPointRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * FriendlyPointRecordRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface FriendlyPointRecordRepository extends JpaRepository<FriendlyPointRecord, Long> {
    // 查询并返回 findByUserIdOrderByCreatedAtDesc 对应的数据
    List<FriendlyPointRecord> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 执行 existsByUserIdAndActionTypeAndRelatedId 方法对应的业务处理
    boolean existsByUserIdAndActionTypeAndRelatedId(Long userId, String actionType, Long relatedId);
    boolean existsByUserIdAndActionType(Long userId, String actionType);

    @Query("select coalesce(sum(r.amount), 0) from FriendlyPointRecord r where r.userId = :userId")
    // 执行 balanceByUserId 方法对应的业务处理
    int balanceByUserId(@Param("userId") Long userId);
}
