package com.zhuly.service;

import com.zhuly.domain.CheckInRecord;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.CheckInResponse;
import com.zhuly.repository.CheckInRecordRepository;
import com.zhuly.repository.ScenicSpotRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private static final double CHECK_IN_RADIUS_KM = 0.5;

    private final ScenicSpotRepository spotRepository;
    private final CheckInRecordRepository checkInRecordRepository;

    @Transactional
    public CheckInResponse checkIn(Long userId, Long spotId, BigDecimal latitude, BigDecimal longitude) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        double distance = GeoUtils.distanceKm(latitude, longitude, spot.getLatitude(), spot.getLongitude());
        if (distance > CHECK_IN_RADIUS_KM) {
            throw new IllegalArgumentException("当前位置距离景点超过500米，暂不能打卡");
        }
        checkInRecordRepository.findByUserIdAndSpotId(userId, spotId).orElseGet(() -> {
            CheckInRecord record = new CheckInRecord();
            record.setUserId(userId);
            record.setSpotId(spotId);
            record.setCheckedInAt(LocalDateTime.now());
            return checkInRecordRepository.save(record);
        });
        return profile(userId, spotId);
    }

    public CheckInResponse profile(Long userId, Long spotId) {
        Set<Long> ids = checkedInIds(userId);
        return new CheckInResponse(userId, spotId, spotId != null && ids.contains(spotId), ids.size(), badges(ids.size()));
    }

    public Set<Long> checkedInIds(Long userId) {
        return checkInRecordRepository.findByUserIdOrderByCheckedInAtDesc(userId).stream()
                .map(CheckInRecord::getSpotId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public List<String> badges(int total) {
        List<String> badges = new ArrayList<>();
        if (total >= 1) {
            badges.add("初遇·1景");
        }
        if (total >= 3) {
            badges.add("初探·3景");
        }
        if (total >= 10) {
            badges.add("行侠·10景");
        }
        if (total >= 20) {
            badges.add("城市漫游家·20景");
        }
        if (total >= 50) {
            badges.add("远行者·50景");
        }
        return badges;
    }
}
