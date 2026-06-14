package com.zhuly.repository;

import com.zhuly.domain.FriendlyPointRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FriendlyPointRecordRepository extends JpaRepository<FriendlyPointRecord, Long> {
    List<FriendlyPointRecord> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndActionTypeAndRelatedId(Long userId, String actionType, Long relatedId);

    @Query("select coalesce(sum(r.amount), 0) from FriendlyPointRecord r where r.userId = :userId")
    int balanceByUserId(@Param("userId") Long userId);
}
