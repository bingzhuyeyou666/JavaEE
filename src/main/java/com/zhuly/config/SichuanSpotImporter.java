/**
 * 本文件定义 SichuanSpotImporter 配置组件，负责应用启动、鉴权或框架配置
 */
package com.zhuly.config;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriUtils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/**
 * SichuanSpotImporter 负责应用运行所需的框架配置或启动初始化
 */
@Component
@RequiredArgsConstructor
@Order(Ordered.LOWEST_PRECEDENCE)
public class SichuanSpotImporter implements ApplicationRunner {

    private static final String SOURCE_NAME = "四川省文化和旅游厅A级旅游景区名录及公开文旅资料";
    private static final String SOURCE_URL = "https://wlt.sc.gov.cn/scwlt/c100297/introduce.shtml";

    private final ScenicSpotRepository spotRepository;

    // 在应用启动阶段执行本组件的初始化任务
    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        ClassPathResource resource = new ClassPathResource("data/sichuan-spots.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] value = line.split(",", -1);
                if (value.length < 9) continue;
                upsert(value);
            }
        }
    }

    // 创建、写入或提交 upsert 对应的业务数据
    private void upsert(String[] value) {
        String name = value[0].trim();
        ScenicSpot spot = spotRepository.findFirstByName(name).orElseGet(ScenicSpot::new);
        spot.setName(name);
        spot.setType(value[1].trim());
        spot.setAddress(value[3].trim());
        spot.setLatitude(decimal(value[4]));
        spot.setLongitude(decimal(value[5]));
        spot.setRating(number(value[6], 4.6));
        spot.setTags(value[7].trim());
        spot.setHighlights(value[8].trim());
        if (blank(spot.getDescription())) {
            spot.setDescription(name + "位于" + value[3].trim() + "，以"
                    + value[8].trim() + "为主要特色，是四川代表性文旅目的地之一。");
        }
        if (blank(spot.getGuide())) {
            spot.setGuide("建议出行前查看景区官方开放与预约信息，结合天气、交通和体力安排半日至一日游览。");
        }
        if (blank(spot.getHistory())) {
            spot.setHistory("景区承载着四川地域自然、历史或民族文化记忆，适合观光、研学与深度文化体验。");
        }
        if (blank(spot.getOpenHours())) spot.setOpenHours("以景区当日公告为准");
        if (blank(spot.getPhone())) spot.setPhone("请查询景区官方服务电话");
        if (spot.getPrice() == null) spot.setPrice(BigDecimal.ZERO);
        if (blank(spot.getBestSeason())) spot.setBestSeason("四季皆宜");
        if (blank(spot.getNotice())) spot.setNotice("节假日客流较大，建议提前预约并错峰出行。");
        if (spot.getMaxCapacity() <= 0) spot.setMaxCapacity(30000);
        spot.setApproved(true);
        spot.setSourceName(SOURCE_NAME);
        spot.setSourceUrl(SOURCE_URL);
        java.util.List<String> images = scenicImages(name);
        String imageUrl = images.get(0);
        if (blank(spot.getCoverImage()) || spot.getCoverImage().startsWith("/api/images/spots/")) {
            spot.setCoverImage(imageUrl);
        }
        if (spot.getGallery() == null || spot.getGallery().size() < 3
                || spot.getGallery().stream().allMatch(url -> url.startsWith("/api/images/spots/"))) {
            java.util.LinkedHashSet<String> merged = new java.util.LinkedHashSet<>();
            if (spot.getGallery() != null) {
                spot.getGallery().stream()
                        .filter(url -> url != null && !url.startsWith("/api/images/spots/"))
                        .forEach(merged::add);
            }
            merged.addAll(images);
            spot.setGallery(new java.util.ArrayList<>(merged));
        }
        spotRepository.save(spot);
    }

    // 执行 scenicImages 方法对应的业务处理
    private java.util.List<String> scenicImages(String name) {
        return Arrays.asList(
                bingThumbnailImage(name, "四川 景区 全景 实景", 1),
                bingThumbnailImage(name, "四川 代表景观 风景照片", 2),
                bingThumbnailImage(name, "四川 游客实拍 旅游", 3)
        );
    }

    // 执行 bingThumbnailImage 方法对应的业务处理
    private String bingThumbnailImage(String name, String scene, int index) {
        String query = UriUtils.encodeQueryParam(name + " " + scene, StandardCharsets.UTF_8);
        return "https://tse1.mm.bing.net/th?q=" + query + "&w=1200&h=675&c=7&rs=1&p=0&o=5&pid=1.7";
    }

    // 计算 decimal 对应的业务结果
    private BigDecimal decimal(String value) {
        return new BigDecimal(value.trim());
    }

    // 计算 number 对应的业务结果
    private double number(String value, double fallback) {
        try {
            return Double.parseDouble(value.trim());
        } catch (Exception ignored) {
            return fallback;
        }
    }

    // 校验 blank 对应的条件并返回判断结果
    private boolean blank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
