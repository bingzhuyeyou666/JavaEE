package com.zhuly.repository;

import com.zhuly.domain.ScenicSpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenicSpotRepository extends JpaRepository<ScenicSpot, Long> {
    List<ScenicSpot> findByApprovedTrue();
    List<ScenicSpot> findByNameContainingIgnoreCaseAndApprovedTrue(String keyword);
    List<ScenicSpot> findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc();
}
