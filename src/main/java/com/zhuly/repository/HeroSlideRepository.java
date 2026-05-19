package com.zhuly.repository;

import com.zhuly.domain.HeroSlide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {
    List<HeroSlide> findAllByOrderBySortOrderAsc();
    List<HeroSlide> findByEnabledTrueOrderBySortOrderAsc();
}
