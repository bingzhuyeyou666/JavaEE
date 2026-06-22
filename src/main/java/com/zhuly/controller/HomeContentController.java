/**
 * 本文件定义 HomeContentController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
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
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * HomeContentController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeContentController {

    private final HeroSlideRepository heroSlideRepository;
    private final ScenicSpotRepository spotRepository;
    private final CheckInService checkInService;

    // 查询首页启用的轮播内容，未配置时返回默认内容
    @GetMapping("/hero")
    public List<HeroSlide> heroSlides() {
        List<HeroSlide> slides = heroSlideRepository.findByEnabledTrueOrderBySortOrderAsc();
        List<HeroSlide> result = slides.isEmpty() ? defaultSlides() : replaceLegacyDefaultImages(slides);
        result.forEach(this::normalizeBrandName);
        return result;
    }

    // 查询首页精选景点，并计算距离和打卡状态
    @GetMapping("/featured-spots")
    public List<Map<String, Object>> featuredSpots(@RequestParam(required = false) BigDecimal lat,
                                                   @RequestParam(required = false) BigDecimal lng,
                                                   @RequestParam(required = false) Long userId) {
        List<ScenicSpot> spots = spotRepository.findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc();
        if (spots.isEmpty()) {
            spots = spotRepository.findByApprovedTrue().stream()
                    .sorted(Comparator.comparingDouble(spot -> -spot.getRating()))
                    .limit(8)
                    .collect(Collectors.toList());
        }
        Set<Long> checked = userId == null ? Collections.emptySet() : checkInService.checkedInIds(userId);
        return spots.stream()
                .map(spot -> toListItem(spot, lat, lng, checked.contains(spot.getId())))
                .collect(Collectors.toList());
    }

    // 组装 toListItem 所需的返回对象或业务数据
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

    // 执行 defaultSlides 方法对应的业务处理
    private List<HeroSlide> defaultSlides() {
        return java.util.Arrays.asList(
                slide(1, "/app/hero/hero-snow-lake.png", "山水漫游", "陌路寻阡", "热门景点、路线规划、预约热线、足迹打卡与智能导览的一站式体验。", "进入导览", "/guide"),
                slide(2, "/app/hero/hero-green-lake.png", "湖光远山", "发现身边的文化风景", "把游玩建议、实时天气、周边设施和评论攻略提前准备好。", "进入导览", "/guide"),
                slide(3, "/app/hero/hero-sunset-fields.png", "田野寻踪", "沿着风景，慢慢抵达", "从湖泊山川到梯田村落，收藏途中风景，留下自己的旅行足迹。", "发现景点", "/guide"),
                slide(4, "/app/hero/hero-mountain-lake.png", "轻松出行", "从收藏到路线，一键成行", "选择 2-5 个景点，系统自动给出合理游览顺序和分段路程。", "规划路线", "/route")
        );
    }

    // 将旧版默认网络轮播图替换为项目内置图片
    private List<HeroSlide> replaceLegacyDefaultImages(List<HeroSlide> slides) {
        String[] localImages = {
                "/app/hero/hero-snow-lake.png",
                "/app/hero/hero-green-lake.png",
                "/app/hero/hero-sunset-fields.png",
                "/app/hero/hero-mountain-lake.png"
        };
        boolean changed = false;
        for (int i = 0; i < slides.size(); i++) {
            HeroSlide slide = slides.get(i);
            if (slide.getImageUrl() != null && slide.getImageUrl().contains("images.unsplash.com")) {
                slide.setImageUrl(localImages[Math.min(i, localImages.length - 1)]);
                changed = true;
            }
        }
        if (changed && slides.size() == 3) {
            slides.add(slide(4, localImages[3], "轻松出行", "从收藏到路线，一键成行",
                    "选择 2-5 个景点，系统自动给出合理游览顺序和分段路程。", "规划路线", "/route"));
        }
        if (changed) {
            heroSlideRepository.saveAll(slides);
        }
        return slides;
    }

    // 组装 slide 所需的返回对象或业务数据
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

    // 更新并规范化 normalizeBrandName 对应的数据
    private void normalizeBrandName(HeroSlide slide) {
        if (slide.getTitle() != null) {
            slide.setTitle(normalizeBrandText(slide.getTitle()));
        }
        if (slide.getBody() != null) {
            slide.setBody(normalizeBrandText(slide.getBody()));
        }
    }

    // 更新并规范化 normalizeBrandText 对应的数据
    private String normalizeBrandText(String text) {
        return text.replace("\u65c5\u56fe\u4e91", "陌路寻阡")
                .replace("\u65c5\u9014\u4e91", "陌路寻阡")
                .replace("\u661f\u6d8c", "陌路寻阡")
                .replace("\u661f\u8e94", "陌路寻阡");
    }
}
