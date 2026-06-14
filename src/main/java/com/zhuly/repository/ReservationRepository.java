package com.zhuly.repository;

import com.zhuly.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countBySpotIdAndVisitDateAndStatus(Long spotId, LocalDate visitDate, String status);

    @Query("select coalesce(sum(r.people), 0) from Reservation r where r.spotId = :spotId and r.visitDate = :visitDate and r.status = :status")
    int sumPeopleBySpotIdAndVisitDateAndStatus(@Param("spotId") Long spotId,
                                               @Param("visitDate") LocalDate visitDate,
                                               @Param("status") String status);
}
