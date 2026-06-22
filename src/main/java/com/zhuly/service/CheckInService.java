/**
 * 本文件定义 CheckInService 服务，负责封装对应业务规则和数据处理流程
 */
package com.zhuly.service;

import com.zhuly.domain.CheckInRecord;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.CheckInResponse;
import com.zhuly.repository.CheckInRecordRepository;
import com.zhuly.repository.ScenicSpotRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CheckInService 集中实现本模块的业务规则，并协调数据访问或第三方服务
 */
@Service
@RequiredArgsConstructor
public class CheckInService {

    private static final double CHECK_IN_RADIUS_KM = 0.5;

    private final ScenicSpotRepository spotRepository;
    private final CheckInRecordRepository checkInRecordRepository;
    private final CrowdIndexService crowdIndexService;
    private final FriendlyPointService friendlyPointService;

    // 创建、写入或提交 checkIn 对应的业务数据
    @Transactional
    public CheckInResponse checkIn(Long userId, Long spotId, BigDecimal latitude, BigDecimal longitude, String imageUrl) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("请先上传打卡图片");
        }
        double distance = GeoUtils.distanceKm(latitude, longitude, spot.getLatitude(), spot.getLongitude());
        if (distance > CHECK_IN_RADIUS_KM) {
            throw new IllegalArgumentException("当前位置距离景点超过500米，暂不能打卡");
        }
        boolean firstCheckIn = !checkInRecordRepository.findByUserIdAndSpotId(userId, spotId).isPresent();
        CheckInRecord record = checkInRecordRepository.findByUserIdAndSpotId(userId, spotId).orElseGet(() -> {
            CheckInRecord nextRecord = new CheckInRecord();
            nextRecord.setUserId(userId);
            nextRecord.setSpotId(spotId);
            nextRecord.setCheckedInAt(LocalDateTime.now());
            return checkInRecordRepository.save(nextRecord);
        });
        addImageToRecord(record, imageUrl.trim());
        record.setCheckedInAt(LocalDateTime.now());
        checkInRecordRepository.save(record);
        if (firstCheckIn) {
            friendlyPointService.award(userId, 10, "CHECK_IN", "完成景点打卡", "用真实足迹点亮城市探索", spotId);
            if ("green".equals(crowdIndexService.getCrowdIndex(spotId).getColor())) {
                friendlyPointService.award(userId, 8, "OFF_PEAK_CHECK_IN", "低拥堵错峰打卡", "选择舒适时段，为景区分流贡献一份力量", spotId);
            }
        }
        return profile(userId, spotId);
    }

    // 查询并返回 profile 对应的数据
    public CheckInResponse profile(Long userId, Long spotId) {
        Set<Long> ids = checkedInIds(userId);
        return new CheckInResponse(userId, spotId, spotId != null && ids.contains(spotId), ids.size(), badges(ids.size()));
    }

    // 校验 checkedInIds 对应的条件并返回判断结果
    public Set<Long> checkedInIds(Long userId) {
        return checkInRecordRepository.findByUserIdOrderByCheckedInAtDesc(userId).stream()
                .map(CheckInRecord::getSpotId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // 执行 records 方法对应的业务处理
    public List<CheckInRecord> records(Long userId) {
        return checkInRecordRepository.findByUserIdOrderByCheckedInAtDesc(userId);
    }

    // 创建、写入或提交 addGalleryImages 对应的业务数据
    @Transactional
    public CheckInRecord addGalleryImages(Long userId, Long spotId, List<String> imageUrls) {
        CheckInRecord record = checkInRecordRepository.findByUserIdAndSpotId(userId, spotId)
                .orElseThrow(() -> new IllegalArgumentException("请先完成该景点打卡，再维护游记图库"));
        if (imageUrls == null || imageUrls.isEmpty()) {
            throw new IllegalArgumentException("请选择要添加的图片");
        }
        for (String imageUrl : imageUrls) {
            addImageToRecord(record, imageUrl);
        }
        return checkInRecordRepository.save(record);
    }

    // 删除、取消或停用 deleteGalleryImage 对应的数据
    @Transactional
    public CheckInRecord deleteGalleryImage(Long userId, Long spotId, String imageUrl) {
        CheckInRecord record = checkInRecordRepository.findByUserIdAndSpotId(userId, spotId)
                .orElseThrow(() -> new IllegalArgumentException("图库不存在"));
        String target = imageUrl == null ? "" : imageUrl.trim();
        if (target.isEmpty()) {
            throw new IllegalArgumentException("请选择要删除的图片");
        }
        syncLegacyImage(record);
        record.getImageUrls().removeIf(item -> target.equals(item));
        record.setImageUrl(record.getImageUrls().isEmpty() ? "" : record.getImageUrls().get(0));
        return checkInRecordRepository.save(record);
    }

    // 执行 gallery 方法对应的业务处理
    public CheckInRecord gallery(Long userId, Long spotId) {
        CheckInRecord record = checkInRecordRepository.findByUserIdAndSpotId(userId, spotId)
                .orElseThrow(() -> new IllegalArgumentException("图库不存在"));
        syncLegacyImage(record);
        return record;
    }

    // 执行 images 方法对应的业务处理
    public List<String> images(CheckInRecord record) {
        syncLegacyImage(record);
        List<String> result = new ArrayList<>(record.getImageUrls());
        if (result.isEmpty() && record.getImageUrl() != null && !record.getImageUrl().trim().isEmpty()) {
            result.add(record.getImageUrl().trim());
        }
        return result;
    }

    // 创建、写入或提交 addImageToRecord 对应的业务数据
    private void addImageToRecord(CheckInRecord record, String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return;
        }
        syncLegacyImage(record);
        String normalized = imageUrl.trim();
        if (!record.getImageUrls().contains(normalized)) {
            record.getImageUrls().add(normalized);
        }
        if (record.getImageUrl() == null || record.getImageUrl().trim().isEmpty()) {
            record.setImageUrl(normalized);
        }
    }

    // 更新并规范化 syncLegacyImage 对应的数据
    private void syncLegacyImage(CheckInRecord record) {
        if (record.getImageUrls() == null) {
            record.setImageUrls(new ArrayList<>());
        }
        if (record.getImageUrl() != null && !record.getImageUrl().trim().isEmpty()
                && !record.getImageUrls().contains(record.getImageUrl().trim())) {
            record.getImageUrls().add(0, record.getImageUrl().trim());
        }
    }

    // 执行 badges 方法对应的业务处理
    public List<String> badges(int total) {
        List<String> badges = new ArrayList<>();
        if (total >= 1) {
            badges.add("初遇·1景");
        }
        if (total >= 3) {
            badges.add("初探·3景");
        }
        if (total >= 10) {
            badges.add("行侠·10景");
        }
        if (total >= 20) {
            badges.add("城市漫游家·20景");
        }
        if (total >= 50) {
            badges.add("远行者·50景");
        }
        return badges;
    }
}
