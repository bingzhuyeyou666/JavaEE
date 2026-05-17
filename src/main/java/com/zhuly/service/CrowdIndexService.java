package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.CrowdIndexResponse;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CrowdIndexService {

    private final ScenicSpotRepository spotRepository;
    private final Map<Long, Integer> todayCounts = new HashMap<>();

    public void addPeople(Long spotId, int people) {
        todayCounts.merge(spotId, people, Integer::sum);
    }

    public CrowdIndexResponse getCrowdIndex(Long spotId) {
        ScenicSpot spot = spotRepository.findById(spotId).orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        int current = todayCounts.getOrDefault(spotId, 0);
        double ratio = spot.getMaxCapacity() == 0 ? 0 : (double) current / spot.getMaxCapacity();
        if (ratio < 0.3) {
            return new CrowdIndexResponse(spotId, current, spot.getMaxCapacity(), ratio, "舒适", "green");
        }
        if (ratio <= 0.7) {
            return new CrowdIndexResponse(spotId, current, spot.getMaxCapacity(), ratio, "一般", "yellow");
        }
        return new CrowdIndexResponse(spotId, current, spot.getMaxCapacity(), ratio, "拥挤", "red");
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyCount() {
        todayCounts.clear();
    }
}
