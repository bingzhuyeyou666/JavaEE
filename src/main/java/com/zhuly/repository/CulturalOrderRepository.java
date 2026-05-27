package com.zhuly.repository;

import com.zhuly.domain.CulturalOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CulturalOrderRepository extends JpaRepository<CulturalOrder, Long> {
    List<CulturalOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
}
