/**
 * 本文件定义 HeroSlideRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.HeroSlide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * HeroSlideRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {
    // 查询并返回 findAllByOrderBySortOrderAsc 对应的数据
    List<HeroSlide> findAllByOrderBySortOrderAsc();
    // 查询并返回 findByEnabledTrueOrderBySortOrderAsc 对应的数据
    List<HeroSlide> findByEnabledTrueOrderBySortOrderAsc();
}
