package com.zhuly.repository;

import com.zhuly.domain.ScenicSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScenicSpotRepository extends JpaRepository<ScenicSpot, Long> {
    List<ScenicSpot> findByApprovedTrue();
    @Query("select s from ScenicSpot s "
            + "where s.approved = true and ("
            + "lower(coalesce(s.name, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.type, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.address, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.description, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.guide, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.history, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.highlights, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.notice, '')) like lower(concat('%', :keyword, '%')) "
            + "or lower(coalesce(s.bestSeason, '')) like lower(concat('%', :keyword, '%'))"
            + ")")
    List<ScenicSpot> searchApproved(@Param("keyword") String keyword);
    List<ScenicSpot> findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc();
}
