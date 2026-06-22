/**
 * 本文件定义 ScenicSpotRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.ScenicSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * ScenicSpotRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface ScenicSpotRepository extends JpaRepository<ScenicSpot, Long> {
    // 查询并返回 findByApprovedTrue 对应的数据
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
    // 查询并返回 searchApproved 对应的数据
    List<ScenicSpot> searchApproved(@Param("keyword") String keyword);
    // 查询并返回 findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc 对应的数据
    List<ScenicSpot> findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc();
    // 查询并返回 findFirstByName 对应的数据
    Optional<ScenicSpot> findFirstByName(String name);
}
