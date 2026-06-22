/**
 * 本文件定义 ReservationService 服务，负责封装对应业务规则和数据处理流程
 */
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

/**
 * ReservationService 集中实现本模块的业务规则，并协调数据访问或第三方服务
 */
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ScenicSpotRepository scenicSpotRepository;

    // 创建、写入或提交 create 对应的业务数据
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

    // 删除、取消或停用 cancel 对应的数据
    public Reservation cancel(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("预约不存在"));
        if (!reservation.getUserId().equals(userId)) {
            throw new IllegalArgumentException("只能取消自己的预约");
        }
        reservation.setStatus("CANCELLED");
        return reservationRepository.save(reservation);
    }

    // 查询并返回 mine 对应的数据
    public List<Reservation> mine(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
