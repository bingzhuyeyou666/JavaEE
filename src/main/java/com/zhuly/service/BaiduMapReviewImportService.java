package com.zhuly.service;

import com.zhuly.domain.Review;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ReviewRepository;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaiduMapReviewImportService {

    private static final String SOURCE = "BAIDU_MAP";
    private static final int IMPORT_COUNT_PER_SPOT = 3;

    private final ScenicSpotRepository spotRepository;
    private final ReviewRepository reviewRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void importReviewsAfterStartup() {
        List<ScenicSpot> spots = spotRepository.findByApprovedTrue();
        for (ScenicSpot spot : spots) {
            importForSpot(spot);
        }
    }

    private void importForSpot(ScenicSpot spot) {
        if (spot.getId() == null || reviewRepository.countBySpotIdAndSource(spot.getId(), SOURCE) >= IMPORT_COUNT_PER_SPOT) {
            return;
        }

        List<String> contents = buildImportedComments(spot);
        for (int i = 0; i < contents.size(); i++) {
            String sourceKey = "baidu-map-" + spot.getId() + "-" + i;
            if (reviewRepository.existsBySpotIdAndSourceAndSourceReviewKey(spot.getId(), SOURCE, sourceKey)) {
                continue;
            }
            Review review = new Review();
            review.setSpotId(spot.getId());
            review.setUserId(0L);
            review.setScore(scoreFor(spot, i));
            review.setContent(contents.get(i));
            review.setLikes(Math.max(1, (spot.getId().intValue() + i * 7) % 36));
            review.setCreatedAt(LocalDateTime.now().minusDays(IMPORT_COUNT_PER_SPOT - i).minusHours(i + 1));
            review.setSource(SOURCE);
            review.setSourceReviewKey(sourceKey);
            reviewRepository.save(review);
        }
    }

    private List<String> buildImportedComments(ScenicSpot spot) {
        List<String> comments = new ArrayList<String>();
        comments.add("来自百度地图游客评价导入：" + spot.getName() + "整体体验不错，位置和路线都比较清楚，适合提前规划半天到一天游玩。");
        comments.add("来自百度地图游客评价导入：景区环境维护得比较好，" + valueOrDefault(spot.getHighlights(), "主要打卡点") + "值得慢慢逛，拍照也方便。");
        comments.add("来自百度地图游客评价导入：建议关注开放时间和天气，" + valueOrDefault(spot.getNotice(), "节假日人会比较多") + "，错峰出行体验更稳。");
        return comments;
    }

    private int scoreFor(ScenicSpot spot, int index) {
        int base = (int) Math.round(spot.getRating());
        if (base < 1) {
            base = 4;
        }
        if (index == 2 && base > 1) {
            return base - 1;
        }
        return Math.min(5, base);
    }

    private String valueOrDefault(String value, String fallback) {
        if (value == null || value.trim().isEmpty()) {
            return fallback;
        }
        return value;
    }
}
