package com.zhuly.controller;

import com.zhuly.domain.HeroSlide;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.HeroSlideRepository;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.service.CheckInService;
import com.zhuly.service.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeContentController {

    private final HeroSlideRepository heroSlideRepository;
    private final ScenicSpotRepository spotRepository;
    private final CheckInService checkInService;

    @GetMapping("/hero")
    public List<HeroSlide> heroSlides() {
        List<HeroSlide> slides = heroSlideRepository.findByEnabledTrueOrderBySortOrderAsc();
        List<HeroSlide> result = slides.isEmpty() ? defaultSlides() : slides;
        result.forEach(this::normalizeBrandName);
        return result;
    }

    @GetMapping("/featured-spots")
    public List<Map<String, Object>> featuredSpots(@RequestParam(required = false) BigDecimal lat,
                                                   @RequestParam(required = false) BigDecimal lng,
                                                   @RequestParam(defaultValue = "1") Long userId) {
        List<ScenicSpot> spots = spotRepository.findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc();
        if (spots.isEmpty()) {
            spots = spotRepository.findByApprovedTrue().stream()
                    .sorted(Comparator.comparingDouble(spot -> -spot.getRating()))
                    .limit(8)
                    .collect(Collectors.toList());
        }
        Set<Long> checked = checkInService.checkedInIds(userId);
        return spots.stream()
                .map(spot -> toListItem(spot, lat, lng, checked.contains(spot.getId())))
                .collect(Collectors.toList());
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

    private List<HeroSlide> defaultSlides() {
        return java.util.Arrays.asList(
                slide(1, "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=95", "山水漫游", "陌路寻景", "热门景点、路线规划、预约票务、足迹打卡与智能导览的一站式体验。", "进入导览", "/guide"),
                slide(2, "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=2400&q=95", "湖光远山", "发现身边的文化风景", "把游玩建议、实时天气、周边设施和评论攻略提前准备好。", "进入导览", "/guide"),
                slide(3, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=95", "轻松出行", "从收藏到路线，一键成行", "选择 2-5 个景点，系统自动给出合理游览顺序和分段路程。", "规划路线", "/route")
        );
    }

    private HeroSlide slide(int sortOrder, String imageUrl, String eyebrow, String title, String body, String actionText, String actionHref) {
        HeroSlide slide = new HeroSlide();
        slide.setSortOrder(sortOrder);
        slide.setEnabled(true);
        slide.setImageUrl(imageUrl);
        slide.setEyebrow(eyebrow);
        slide.setTitle(title);
        slide.setBody(body);
        slide.setActionText(actionText);
        slide.setActionHref(actionHref);
        return slide;
    }

    private void normalizeBrandName(HeroSlide slide) {
        if (slide.getTitle() != null) {
            slide.setTitle(normalizeBrandText(slide.getTitle()));
        }
        if (slide.getBody() != null) {
            slide.setBody(normalizeBrandText(slide.getBody()));
        }
    }

    private String normalizeBrandText(String text) {
        return text.replace("\u65c5\u56fe\u4e91", "陌路寻景")
                .replace("\u65c5\u9014\u4e91", "陌路寻景")
                .replace("\u661f\u6d8c", "陌路寻景")
                .replace("\u661f\u8e94", "陌路寻景");
    }
}
