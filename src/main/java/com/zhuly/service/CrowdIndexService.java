package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.CrowdIndexResponse;
import com.zhuly.repository.ReservationRepository;
import com.zhuly.repository.ScenicSpotRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CrowdIndexService {

    private final ScenicSpotRepository spotRepository;
    private final ReservationRepository reservationRepository;

    /**
     * Kept for older call sites. Crowd index is derived from persisted
     * reservations so restart/cancel/date changes do not pollute the result.
     */
    public void addPeople(Long spotId, int people) {
    }

    public CrowdIndexResponse getCrowdIndex(Long spotId) {
        return getCrowdIndex(spotId, LocalDate.now());
    }

    public CrowdIndexResponse getCrowdIndex(Long spotId, LocalDate visitDate) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        LocalDate targetDate = visitDate == null ? LocalDate.now() : visitDate;
        int current = reservationRepository.sumPeopleBySpotIdAndVisitDateAndStatus(spotId, targetDate, "RESERVED");
        int maxCapacity = Math.max(0, spot.getMaxCapacity());
        double ratio = maxCapacity == 0 ? 0 : (double) current / maxCapacity;
        if (ratio < 0.3) {
            return new CrowdIndexResponse(spotId, current, maxCapacity, ratio, "舒适", "green");
        }
        if (ratio <= 0.7) {
            return new CrowdIndexResponse(spotId, current, maxCapacity, ratio, "一般", "yellow");
        }
        return new CrowdIndexResponse(spotId, current, maxCapacity, ratio, "拥挤", "red");
    }
}
