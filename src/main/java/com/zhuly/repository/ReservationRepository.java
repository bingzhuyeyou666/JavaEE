/**
 * 本文件定义 ReservationRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * ReservationRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 查询并返回 findByUserIdOrderByCreatedAtDesc 对应的数据
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
    // 执行 countBySpotIdAndVisitDateAndStatus 方法对应的业务处理
    int countBySpotIdAndVisitDateAndStatus(Long spotId, LocalDate visitDate, String status);

    @Query("select coalesce(sum(r.people), 0) from Reservation r where r.spotId = :spotId and r.visitDate = :visitDate and r.status = :status")
    int sumPeopleBySpotIdAndVisitDateAndStatus(@Param("spotId") Long spotId,
                                               @Param("visitDate") LocalDate visitDate,
                                               @Param("status") String status);
}
