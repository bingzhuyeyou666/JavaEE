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
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ScenicSpotRepository spotRepository;
    private final FacilityRepository facilityRepository;
    private final ReviewRepository reviewRepository;
    private final SpotSubmissionRepository submissionRepository;
    private final HeroSlideRepository heroSlideRepository;

    @GetMapping("/spots")
    public List<ScenicSpot> spots() {
        return spotRepository.findAll();
    }

    @PostMapping("/spots")
    public ScenicSpot createSpot(@RequestBody ScenicSpot spot) {
        return spotRepository.save(spot);
    }

    @PutMapping("/spots/{id}")
    public ScenicSpot updateSpot(@PathVariable Long id, @RequestBody ScenicSpot spot) {
        spot.setId(id);
        return spotRepository.save(spot);
    }

    @DeleteMapping("/spots/{id}")
    public void deleteSpot(@PathVariable Long id) {
        spotRepository.deleteById(id);
    }

    @GetMapping("/facilities")
    public List<Facility> facilities() {
        return facilityRepository.findAll();
    }

    @GetMapping("/home/hero")
    public List<HeroSlide> heroSlides() {
        return heroSlideRepository.findAllByOrderBySortOrderAsc();
    }

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

    @GetMapping("/home/featured")
    public List<Long> featuredSpotIds() {
        return spotRepository.findByApprovedTrueAndHomeFeaturedTrueOrderByHomeFeaturedSortAsc()
                .stream()
                .map(ScenicSpot::getId)
                .collect(Collectors.toList());
    }

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

    @GetMapping("/submissions")
    public List<SpotSubmission> submissions() {
        return submissionRepository.findAll();
    }

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
            spot.setOpenHours(hasText(submission.getOpenHours()) ? submission.getOpenHours().trim() : "TBD");
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

    @PostMapping("/submissions/{id}/reject")
    public SpotSubmission reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        SpotSubmission submission = submissionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("申报不存在"));
        submission.setStatus("REJECTED");
        if (body != null) {
            submission.setAuditRemark(body.get("auditRemark"));
        }
        return submissionRepository.save(submission);
    }

    @PostMapping("/reviews/{id}/hide")
    public void hideReview(@PathVariable Long id) {
        reviewRepository.findById(id).ifPresent(review -> {
            review.setHidden(true);
            reviewRepository.save(review);
        });
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
