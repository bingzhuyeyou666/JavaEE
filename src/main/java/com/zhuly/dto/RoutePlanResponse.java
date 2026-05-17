package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RoutePlanResponse {
    private List<RouteSpot> orderedSpots;
    private List<RouteSegment> segments;
    private double totalDistanceKm;
    private int totalMinutes;

    @Getter
    @AllArgsConstructor
    public static class RouteSpot {
        private Long id;
        private String name;
        private double latitude;
        private double longitude;
    }

    @Getter
    @AllArgsConstructor
    public static class RouteSegment {
        private Long fromSpotId;
        private Long toSpotId;
        private double distanceKm;
        private int minutes;
    }
}
