/**
 * 本文件定义 GeoUtils 服务，负责封装对应业务规则和数据处理流程
 */
package com.zhuly.service;

import java.math.BigDecimal;

public final class GeoUtils {

    private GeoUtils() {
    }

    // 计算 distanceKm 对应的业务结果
    public static double distanceKm(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        double earthRadius = 6371.0088;
        double dLat = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double dLon = Math.toRadians(lon2.doubleValue() - lon1.doubleValue());
        double startLat = Math.toRadians(lat1.doubleValue());
        double endLat = Math.toRadians(lat2.doubleValue());
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
