/**
 * 本文件定义 FacilityRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * FacilityRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
