/**
 * 本文件定义 RoutePlanResponse 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * RoutePlanResponse 用于在接口层和业务层之间传递结构化数据
 */
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
