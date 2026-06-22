/**
 * 本文件定义 CheckInRecordRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.CheckInRecord;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * CheckInRecordRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface CheckInRecordRepository extends JpaRepository<CheckInRecord, Long> {
    // 查询并返回 findByUserIdAndSpotId 对应的数据
    Optional<CheckInRecord> findByUserIdAndSpotId(Long userId, Long spotId);
    // 查询并返回 findByUserIdOrderByCheckedInAtDesc 对应的数据
    List<CheckInRecord> findByUserIdOrderByCheckedInAtDesc(Long userId);
    // 执行 countByUserId 方法对应的业务处理
    int countByUserId(Long userId);
}
