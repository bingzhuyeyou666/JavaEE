/**
 * 本文件定义 AdminController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.zhuly.domain.Facility;
import com.zhuly.domain.HeroSlide;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.domain.SpotSubmission;
import com.zhuly.repository.FacilityRepository;
import com.zhuly.repository.HeroSlideRepository;
import com.zhuly.repository.ReviewRepository;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.repository.SpotSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * AdminController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ScenicSpotRepository spotRepository;
    private final FacilityRepository facilityRepository;
    private final ReviewRepository reviewRepository;
    private final SpotSubmissionRepository submissionRepository;
    private final HeroSlideRepository heroSlideRepository;

    // 查询后台可管理的全部景点
    @GetMapping("/spots")
    public List<ScenicSpot> spots() {
        return spotRepository.findAll();
    }

    // 在后台新增一个景点
    @PostMapping("/spots")
    public ScenicSpot createSpot(@RequestBody ScenicSpot spot) {
        return spotRepository.save(spot);
    }

    // 更新指定景点的资料
    @PutMapping("/spots/{id}")
    public ScenicSpot updateSpot(@PathVariable Long id, @RequestBody ScenicSpot spot) {
        spot.setId(id);
        return spotRepository.save(spot);
    }

    // 删除指定景点
    @DeleteMapping("/spots/{id}")
    public void deleteSpot(@PathVariable Long id) {
        spotRepository.deleteById(id);
    }

    // 查询后台维护的全部周边设施
    @GetMapping("/facilities")
    public List<Facility> facilities() {
        return facilityRepository.findAll();
    }

    // 查询后台首页轮播配置
    @GetMapping("/home/hero")
    public List<HeroSlide> heroSlides() {
        return heroSlideRepository.findAllByOrderBySortOrderAsc();
    }

    // 批量保存首页轮播配置
    @PutMapping("/home/hero")
    public List<HeroSlide> updateHeroSlides(@RequestBody List<HeroSlide> slides) {
        heroSlideRepository.deleteAll();
        for (int i = 0; i < slides.size(); i++) {
            HeroSlide slide = slides.get(i);
            slide.setId(null);
            slide.setSortOrder(i + 1);
        }
        return heroSlideRepository.saveAll(slides);
    }

    // 上传首页轮播图片并返回可直接访问的本地地址
    @PostMapping("/home/hero/uploads")
    public Map<String, String> uploadHeroImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("请选择要上传的轮播图片");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("轮播图只支持图片文件");
        }
        if (file.getSize() > 15 * 1024 * 1024) {
            throw new IllegalArgumentException("单张轮播图片不能超过15MB");
        }
        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.lastIndexOf('.') >= 0
                ? originalName.substring(originalName.lastIndexOf('.')).toLowerCase()
                : ".jpg";
        if (!extension.matches("\\.(jpg|jpeg|png|webp)$")) {
            throw new IllegalArgumentException("轮播图仅支持 JPG、PNG 或 WebP 格式");
        }
        Path uploadRoot = Paths.get("data", "uploads", "hero").toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
        String filename = UUID.randomUUID().toString().replace("-", "") + extension;
        Path target = uploadRoot.resolve(filename).normalize();
        if (!target.startsWith(uploadRoot)) {
            throw new IllegalArgumentException("文件名不合法");
        }
        file.transferTo(target.toFile());
        return java.util.Collections.singletonMap("url", "/uploads/hero/" + filename);
    }

    // 查询首页精选景点编号列表
    @GetMapping("/home/featured")
    public List<Long> featuredSpotIds() {
        return spotRepository.findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc()
                .stream()
                .map(ScenicSpot::getId)
                .collect(Collectors.toList());
    }

    // 更新首页精选景点及其展示顺序
    @PutMapping("/home/featured")
    public List<Long> updateFeaturedSpotIds(@RequestBody Map<String, List<Long>> body) {
        List<Long> ids = body.get("spotIds");
        if (ids == null) {
            ids = java.util.Collections.emptyList();
        }
        List<ScenicSpot> spots = spotRepository.findAll();
        for (ScenicSpot spot : spots) {
            int index = ids.indexOf(spot.getId());
            spot.setHomeFeatured(index >= 0);
            spot.setHomeFeaturedSort(index >= 0 ? index + 1 : 0);
        }
        spotRepository.saveAll(spots);
        return ids;
    }

    // 查询用户提交的全部景点申报
    @GetMapping("/submissions")
    public List<SpotSubmission> submissions() {
        return submissionRepository.findAll();
    }

    // 审核通过景点申报并写入正式景点库
    @PostMapping("/submissions/{id}/approve")
    public SpotSubmission approve(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        SpotSubmission submission = submissionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("申请不存在"));
        if (!"APPROVED".equals(submission.getStatus())) {
            ScenicSpot spot = new ScenicSpot();
            spot.setName(submission.getName());
            spot.setType(submission.getType() == null || submission.getType().trim().isEmpty() ? "User submitted" : submission.getType());
            spot.setAddress(submission.getAddress());
            spot.setLatitude(submission.getLatitude());
            spot.setLongitude(submission.getLongitude());
            spot.setDescription(submission.getDescription());
            spot.setGuide(submission.getReason());
            spot.setHighlights(submission.getReason());
            spot.setGallery(submission.getPhotoUrls());
            if (submission.getPhotoUrls() != null && !submission.getPhotoUrls().isEmpty()) {
                spot.setCoverImage(submission.getPhotoUrls().get(0));
            }
            if (submission.getVideoUrls() != null && !submission.getVideoUrls().isEmpty()) {
                spot.setVideoUrl(submission.getVideoUrls().get(0));
            }
            spot.setOpenHours(hasText(submission.getOpenHours()) ? submission.getOpenHours().trim() : "以景点公告为准");
            spot.setPrice(submission.getPrice() == null ? BigDecimal.ZERO : submission.getPrice());
            spot.setBestSeason(submission.getBestSeason());
            spot.setPhone(submission.getPhone());
            spot.setRating(4.5);
            spot.setMaxCapacity(1000);
            spot.setApproved(true);
            spotRepository.save(spot);
        }
        submission.setStatus("APPROVED");
        if (body != null) {
            submission.setAuditRemark(body.get("auditRemark"));
        }
        return submissionRepository.save(submission);
    }

    // 驳回指定景点申报并记录审核备注
    @PostMapping("/submissions/{id}/reject")
    public SpotSubmission reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        SpotSubmission submission = submissionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("申报不存在"));
        submission.setStatus("REJECTED");
        if (body != null) {
            submission.setAuditRemark(body.get("auditRemark"));
        }
        return submissionRepository.save(submission);
    }

    // 隐藏指定游客评论，使其不再公开展示
    @PostMapping("/reviews/{id}/hide")
    public void hideReview(@PathVariable Long id) {
        reviewRepository.findById(id).ifPresent(review -> {
            review.setHidden(true);
            reviewRepository.save(review);
        });
    }

    // 校验 hasText 对应的条件并返回判断结果
    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
