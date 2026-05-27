package com.zhuly.repository;

import com.zhuly.domain.CulturalProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CulturalProductRepository extends JpaRepository<CulturalProduct, Long> {
    List<CulturalProduct> findBySpotIdOrderByIdAsc(Long spotId);
}
