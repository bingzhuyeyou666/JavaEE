/**
 * 本文件定义 FriendlyPointService 服务，负责封装对应业务规则和数据处理流程
 */
package com.zhuly.service;

import com.zhuly.domain.FriendlyPointRecord;
import com.zhuly.repository.FriendlyPointRecordRepository;
import com.zhuly.repository.UserProfileRepository;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * FriendlyPointService 集中实现本模块的业务规则，并协调数据访问或第三方服务
 */
@Service
@RequiredArgsConstructor
public class FriendlyPointService {

    private final FriendlyPointRecordRepository recordRepository;
    private final UserProfileRepository userProfileRepository;

    // 查询并返回 profile 对应的数据
    public Map<String, Object> profile(Long userId) {
        List<FriendlyPointRecord> records = recordRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Map<String, Object> body = new HashMap<>();
        body.put("balance", balance(userId));
        body.put("records", records);
        body.put("rewards", rewards());
        body.put("ownedFrames", ownedFrames(userId));
        body.put("equippedFrame", userProfileRepository.findById(userId).map(user -> user.getAvatarFrame()).orElse("none"));
        return body;
    }

    // 执行 balance 方法对应的业务处理
    public int balance(Long userId) {
        return recordRepository.balanceByUserId(userId);
    }

    // 创建、写入或提交 award 对应的业务数据
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

    // 创建、写入或提交 awardRoute 对应的业务数据
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

    // 创建、写入或提交 redeem 对应的业务数据
    @Transactional
    public FriendlyPointRecord redeem(Long userId, String rewardId) {
        Map<String, Object> reward = rewards().stream()
                .filter(item -> rewardId.equals(item.get("id")))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("兑换项不存在"));
        int cost = ((Number) reward.get("cost")).intValue();
        String actionType = "REDEEM_" + rewardId.toUpperCase().replace('-', '_');
        if (recordRepository.existsByUserIdAndActionType(userId, actionType)) {
            throw new IllegalArgumentException("该头像框已经兑换");
        }
        if (balance(userId) < cost) {
            throw new IllegalArgumentException("友好积分不足");
        }
        String frame = String.valueOf(reward.get("frame"));
        userProfileRepository.findById(userId).ifPresent(user -> {
            user.setAvatarFrame(frame);
            userProfileRepository.save(user);
        });
        return save(userId, -cost, actionType, "兑换：" + reward.get("name"), String.valueOf(reward.get("description")), null);
    }

    @Transactional
    public String equipFrame(Long userId, String frame) {
        if (!"none".equals(frame) && !ownedFrames(userId).contains(frame)) {
            throw new IllegalArgumentException("请先兑换该头像框");
        }
        userProfileRepository.findById(userId).ifPresent(user -> {
            user.setAvatarFrame(frame);
            userProfileRepository.save(user);
        });
        return frame;
    }

    public List<String> ownedFrames(Long userId) {
        return rewards().stream()
                .filter(reward -> recordRepository.existsByUserIdAndActionType(
                        userId, "REDEEM_" + String.valueOf(reward.get("id")).toUpperCase().replace('-', '_')))
                .map(reward -> String.valueOf(reward.get("frame")))
                .collect(Collectors.toList());
    }

    // 查询并返回 rewards 对应的数据
    public List<Map<String, Object>> rewards() {
        return Arrays.asList(
                reward("frame-bamboo", "青竹行旅头像框", 80, "青竹与山风主题，兑换后立即佩戴", "bamboo"),
                reward("frame-sunset", "赤霞远山头像框", 140, "晚霞与层峦主题，兑换后立即佩戴", "sunset"),
                reward("frame-starlight", "星河寻阡头像框", 220, "星夜旅途主题，兑换后立即佩戴", "starlight")
        );
    }

    // 创建、写入或提交 save 对应的业务数据
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

    // 组装 reward 所需的返回对象或业务数据
    private Map<String, Object> reward(String id, String name, int cost, String description, String frame) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("cost", cost);
        item.put("description", description);
        item.put("frame", frame);
        return item;
    }
}
