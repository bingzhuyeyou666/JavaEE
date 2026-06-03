package com.zhuly.repository;

import com.zhuly.domain.CheckInRecord;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInRecordRepository extends JpaRepository<CheckInRecord, Long> {
    Optional<CheckInRecord> findByUserIdAndSpotId(Long userId, Long spotId);
    List<CheckInRecord> findByUserIdOrderByCheckedInAtDesc(Long userId);
    int countByUserId(Long userId);
}
