/**
 * 本文件定义 ScenicSpotController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.service.BaiduPlaceService;
import com.zhuly.service.CheckInService;
import com.zhuly.service.GeoUtils;
import com.zhuly.service.SpotRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

/**
 * ScenicSpotController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/spots")
@RequiredArgsConstructor
public class ScenicSpotController {

    private final ScenicSpotRepository spotRepository;
    private final CheckInService checkInService;
    private final BaiduPlaceService baiduPlaceService;
    private final SpotRecommendationService recommendationService;

    // 按关键字、类型和位置查询可展示的景点列表
    @GetMapping
    public List<Map<String, Object>> list(@RequestParam(required = false) String keyword,
                                          @RequestParam(required = false) String type,
                                          @RequestParam(required = false) BigDecimal lat,
                                          @RequestParam(required = false) BigDecimal lng,
                                          @RequestParam(required = false) Long userId) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        List<ScenicSpot> spots = normalizedKeyword.isEmpty()
                ? spotRepository.findByApprovedTrue()
                : spotRepository.searchApproved(normalizedKeyword);
        Set<Long> checked = userId == null ? Collections.emptySet() : checkInService.checkedInIds(userId);

        boolean searching = !normalizedKeyword.isEmpty();
        return spots.stream()
                .filter(spot -> !searching || matchesSearchIntent(spot, normalizedKeyword))
                .filter(spot -> type == null || type.trim().isEmpty() || spot.getType().equals(type))
                .filter(this::isGuideVisibleSpot)
                .map(spot -> toListItem(spot, lat, lng, checked.contains(spot.getId()), normalizedKeyword))
                .sorted(searching
                        ? Comparator
                                .<Map<String, Object>>comparingInt(item -> -((Number) item.getOrDefault("searchScore", 0)).intValue())
                                .thenComparingDouble(item -> ((Number) item.getOrDefault("distanceKm", 99999)).doubleValue())
                        : Comparator.comparingDouble(item -> ((Number) item.getOrDefault("distanceKm", 99999)).doubleValue()))
                .collect(Collectors.toList());
    }

    // 查询指定景点的完整详情和图集信息
    @GetMapping("/{id}")
    @Transactional
    public ScenicSpot detail(@PathVariable Long id) {
        ScenicSpot spot = spotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        if (spot.getGallery() == null) {
            spot.setGallery(new ArrayList<>());
        }
        if ((spot.getCoverImage() == null || spot.getCoverImage().trim().isEmpty()) && !spot.getGallery().isEmpty()) {
            spot.setCoverImage(spot.getGallery().get(0));
        }
        spot.setPhone(baiduPlaceService.phoneFor(spot));
        return spot;
    }

    // 根据景点特征查询相似景点推荐
    @GetMapping("/{id}/recommendations")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> recommendations(@PathVariable Long id,
                                                     @RequestParam(defaultValue = "6") int limit) {
        ScenicSpot target = spotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        return recommendationService.recommend(target, limit).stream()
                .map(spot -> toListItem(spot, target.getLatitude(), target.getLongitude(), false, ""))
                .collect(Collectors.toList());
    }

    // 校验 matchesSearchIntent 对应的条件并返回判断结果
    private boolean matchesSearchIntent(ScenicSpot spot, String keyword) {
        if (contains(spot.getName(), keyword)
                || contains(spot.getType(), keyword)
                || contains(spot.getDescription(), keyword)
                || contains(spot.getGuide(), keyword)
                || contains(spot.getHistory(), keyword)
                || contains(spot.getHighlights(), keyword)
                || contains(spot.getNotice(), keyword)
                || contains(spot.getBestSeason(), keyword)) {
            return true;
        }
        String normalizedAddress = safe(spot.getAddress()).toLowerCase();
        String normalizedKeyword = keyword.toLowerCase();
        return normalizedAddress.startsWith(normalizedKeyword)
                || normalizedAddress.contains(normalizedKeyword + "\u5e02")
                || normalizedAddress.contains(normalizedKeyword + "\u7701")
                || normalizedAddress.contains(normalizedKeyword + "\u81ea\u6cbb\u533a");
    }

    // 校验 isGuideVisibleSpot 对应的条件并返回判断结果
    private boolean isGuideVisibleSpot(ScenicSpot spot) {
        String type = safe(spot.getType()).trim();
        if (type.isEmpty()) {
            return true;
        }
        return !Set.of("学校", "大学", "校区", "医院", "停车场", "加油站", "超市", "餐馆", "酒店", "厕所", "卫生间")
                .contains(type);
    }

    // 校验 contains 对应的条件并返回判断结果
    private boolean contains(String value, String keyword) {
        return safe(value).toLowerCase().contains(keyword.toLowerCase());
    }

    // 执行 safe 方法对应的业务处理
    private String safe(String value) {
        return value == null ? "" : value;
    }

    // 查询并返回 searchScore 对应的数据
    private int searchScore(ScenicSpot spot, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return 0;
        int score = 0;
        if (contains(spot.getName(), keyword)) score += 80;
        if (safe(spot.getAddress()).startsWith(keyword) || contains(spot.getAddress(), keyword + "\u5e02")) score += 55;
        if (contains(spot.getType(), keyword)) score += 25;
        if (contains(spot.getDescription(), keyword)) score += 20;
        if (contains(spot.getHighlights(), keyword)) score += 18;
        if (contains(spot.getGuide(), keyword)) score += 14;
        if (contains(spot.getHistory(), keyword)) score += 12;
        if (contains(spot.getNotice(), keyword)) score += 8;
        if (contains(spot.getBestSeason(), keyword)) score += 6;
        return score;
    }

    // 组装 toListItem 所需的返回对象或业务数据
    private Map<String, Object> toListItem(ScenicSpot spot, BigDecimal lat, BigDecimal lng, boolean checkedIn, String keyword) {
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
        item.put("searchScore", searchScore(spot, keyword));
        return item;
    }
}
