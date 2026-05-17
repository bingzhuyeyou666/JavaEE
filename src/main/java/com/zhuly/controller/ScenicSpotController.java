package com.zhuly.controller;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.service.CheckInService;
import com.zhuly.service.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/spots")
@RequiredArgsConstructor
public class ScenicSpotController {

    private final ScenicSpotRepository spotRepository;
    private final CheckInService checkInService;

    @GetMapping
    public List<Map<String, Object>> list(@RequestParam(required = false) String keyword,
                                          @RequestParam(required = false) String type,
                                          @RequestParam(required = false) BigDecimal lat,
                                          @RequestParam(required = false) BigDecimal lng,
                                          @RequestParam(defaultValue = "1") Long userId) {
        List<ScenicSpot> spots = keyword == null || keyword.trim().isEmpty()
                ? spotRepository.findByApprovedTrue()
                : spotRepository.findByNameContainingIgnoreCaseAndApprovedTrue(keyword);
        Set<Long> checked = checkInService.checkedInIds(userId);

        return spots.stream()
                .filter(spot -> type == null || type.trim().isEmpty() || spot.getType().equals(type))
                .map(spot -> toListItem(spot, lat, lng, checked.contains(spot.getId())))
                .sorted(Comparator.comparingDouble(item -> ((Number) item.getOrDefault("distanceKm", 99999)).doubleValue()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ScenicSpot detail(@PathVariable Long id) {
        return spotRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("景点不存在"));
    }

    private Map<String, Object> toListItem(ScenicSpot spot, BigDecimal lat, BigDecimal lng, boolean checkedIn) {
        Double distance = null;
        if (lat != null && lng != null) {
            distance = Math.round(GeoUtils.distanceKm(lat, lng, spot.getLatitude(), spot.getLongitude()) * 10.0) / 10.0;
        }
        Map<String, Object> item = new HashMap<>();
        item.put("id", spot.getId());
        item.put("name", spot.getName());
        item.put("type", spot.getType());
        item.put("address", spot.getAddress());
        item.put("latitude", spot.getLatitude());
        item.put("longitude", spot.getLongitude());
        item.put("price", spot.getPrice());
        item.put("rating", spot.getRating());
        item.put("coverImage", spot.getCoverImage());
        item.put("checkedIn", checkedIn);
        item.put("distanceKm", distance == null ? 99999 : distance);
        return item;
    }
}
