package com.zhuly.service;

import com.zhuly.domain.FriendlyPointRecord;
import com.zhuly.repository.FriendlyPointRecordRepository;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class FriendlyPointService {

    private final FriendlyPointRecordRepository recordRepository;

    public Map<String, Object> profile(Long userId) {
        List<FriendlyPointRecord> records = recordRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Map<String, Object> body = new HashMap<>();
        body.put("balance", balance(userId));
        body.put("records", records);
        body.put("rewards", rewards());
        return body;
    }

    public int balance(Long userId) {
        return recordRepository.balanceByUserId(userId);
    }

    @Transactional
    public FriendlyPointRecord award(Long userId, int amount, String actionType, String title, String description, Long relatedId) {
        if (amount <= 0) {
            throw new IllegalArgumentException("积分必须大于 0");
        }
        if (relatedId != null && recordRepository.existsByUserIdAndActionTypeAndRelatedId(userId, actionType, relatedId)) {
            return null;
        }
        return save(userId, amount, actionType, title, description, relatedId);
    }

    @Transactional
    public FriendlyPointRecord awardRoute(Long userId, String mode, double distanceKm) {
        String normalized = StringUtils.hasText(mode) ? mode.trim().toLowerCase() : "driving";
        int amount;
        String title;
        if (Arrays.asList("walk", "walking").contains(normalized)) {
            amount = 20;
            title = "步行低碳路线";
        } else if (Arrays.asList("bike", "biking", "cycling").contains(normalized)) {
            amount = 16;
            title = "骑行友好路线";
        } else if (Arrays.asList("bus", "transit", "public").contains(normalized)) {
            amount = 12;
            title = "公交绿色路线";
        } else {
            return null;
        }
        String description = "规划约 " + Math.round(distanceKm * 10.0) / 10.0 + " km 的绿色出行路线";
        return award(userId, amount, "GREEN_ROUTE_" + normalized.toUpperCase(), title, description, null);
    }

    @Transactional
    public FriendlyPointRecord redeem(Long userId, String rewardId) {
        Map<String, Object> reward = rewards().stream()
                .filter(item -> rewardId.equals(item.get("id")))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("兑换项不存在"));
        int cost = ((Number) reward.get("cost")).intValue();
        if (balance(userId) < cost) {
            throw new IllegalArgumentException("友好积分不足");
        }
        return save(userId, -cost, "REDEEM", "兑换：" + reward.get("name"), String.valueOf(reward.get("description")), null);
    }

    public List<Map<String, Object>> rewards() {
        return Arrays.asList(
                reward("coupon-cultural-5", "文创 5 元券", 80, "可用于线下文创消费演示兑换"),
                reward("badge-green-walker", "低碳漫游徽章", 120, "展示在个人主页的绿色出行荣誉")
        );
    }

    private FriendlyPointRecord save(Long userId, int amount, String actionType, String title, String description, Long relatedId) {
        FriendlyPointRecord record = new FriendlyPointRecord();
        record.setUserId(userId);
        record.setAmount(amount);
        record.setActionType(actionType);
        record.setTitle(title);
        record.setDescription(description);
        record.setRelatedId(relatedId);
        record.setCreatedAt(LocalDateTime.now());
        return recordRepository.save(record);
    }

    private Map<String, Object> reward(String id, String name, int cost, String description) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("cost", cost);
        item.put("description", description);
        return item;
    }
}
