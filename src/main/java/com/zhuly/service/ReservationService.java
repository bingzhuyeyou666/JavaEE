package com.zhuly.service;

import com.zhuly.domain.Reservation;
import com.zhuly.dto.ReservationRequest;
import com.zhuly.repository.ReservationRepository;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ScenicSpotRepository scenicSpotRepository;

    public Reservation create(Long userId, ReservationRequest request) {
        scenicSpotRepository.findById(request.getSpotId()).orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        Reservation reservation = new Reservation();
        reservation.setUserId(userId);
        reservation.setSpotId(request.getSpotId());
        reservation.setVisitDate(request.getVisitDate());
        reservation.setTimeSlot(request.getTimeSlot());
        reservation.setPeople(request.getPeople());
        reservation.setStatus("RESERVED");
        reservation.setQrCode("ZHULY-" + UUID.randomUUID());
        reservation.setCreatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    public Reservation cancel(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("预约不存在"));
        if (!reservation.getUserId().equals(userId)) {
            throw new IllegalArgumentException("只能取消自己的预约");
        }
        reservation.setStatus("CANCELLED");
        return reservationRepository.save(reservation);
    }

    public List<Reservation> mine(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
