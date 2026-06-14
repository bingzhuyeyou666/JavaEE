package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.RoutePlanResponse;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoutePlanService {

    private final ScenicSpotRepository spotRepository;

    public RoutePlanResponse plan(List<Long> spotIds) {
        return plan(spotIds, "driving");
    }

    public RoutePlanResponse plan(List<Long> spotIds, String mode) {
        List<ScenicSpot> spots = spotRepository.findAllById(spotIds);
        if (spots.size() < 2) {
            throw new IllegalArgumentException("至少选择2个景点");
        }
        double speedKmh = speedKmh(mode);
        List<ScenicSpot> ordered = nearestNeighbor(spots);
        List<RoutePlanResponse.RouteSegment> segments = new ArrayList<>();
        double totalDistance = 0;
        int totalMinutes = 0;
        for (int i = 0; i < ordered.size() - 1; i++) {
            ScenicSpot from = ordered.get(i);
            ScenicSpot to = ordered.get(i + 1);
            double distance = GeoUtils.distanceKm(from.getLatitude(), from.getLongitude(), to.getLatitude(), to.getLongitude());
            int minutes = Math.max(5, (int) Math.round(distance / speedKmh * 60));
            totalDistance += distance;
            totalMinutes += minutes;
            segments.add(new RoutePlanResponse.RouteSegment(from.getId(), to.getId(), round(distance), minutes));
        }
        List<RoutePlanResponse.RouteSpot> routeSpots = ordered.stream()
                .map(spot -> new RoutePlanResponse.RouteSpot(
                        spot.getId(),
                        spot.getName(),
                        spot.getLatitude().doubleValue(),
                        spot.getLongitude().doubleValue()))
                .collect(Collectors.toList());
        return new RoutePlanResponse(routeSpots, segments, round(totalDistance), totalMinutes);
    }

    private double speedKmh(String mode) {
        String normalized = mode == null ? "" : mode.trim().toLowerCase();
        if ("walking".equals(normalized) || "walk".equals(normalized)) {
            return 4.5;
        }
        if ("cycling".equals(normalized) || "bike".equals(normalized) || "biking".equals(normalized)) {
            return 14;
        }
        if ("transit".equals(normalized) || "bus".equals(normalized) || "public".equals(normalized)) {
            return 24;
        }
        return 35;
    }

    private List<ScenicSpot> nearestNeighbor(List<ScenicSpot> spots) {
        List<ScenicSpot> result = new ArrayList<>();
        Set<Long> used = new HashSet<>();
        ScenicSpot current = spots.stream().min(Comparator.comparing(ScenicSpot::getId))
                .orElseThrow(() -> new IllegalArgumentException("至少选择2个景点"));
        result.add(current);
        used.add(current.getId());
        while (result.size() < spots.size()) {
            ScenicSpot from = current;
            current = spots.stream()
                    .filter(spot -> !used.contains(spot.getId()))
                    .min(Comparator.comparingDouble(spot -> GeoUtils.distanceKm(
                            from.getLatitude(), from.getLongitude(), spot.getLatitude(), spot.getLongitude())))
                    .orElseThrow(() -> new IllegalArgumentException("路线规划失败"));
            result.add(current);
            used.add(current.getId());
        }
        return result;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
