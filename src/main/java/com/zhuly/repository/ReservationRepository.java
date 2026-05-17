package com.zhuly.repository;

import com.zhuly.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countBySpotIdAndVisitDateAndStatus(Long spotId, LocalDate visitDate, String status);
}
