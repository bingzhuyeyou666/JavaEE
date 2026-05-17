package com.zhuly.controller;

import com.zhuly.domain.Review;
import com.zhuly.domain.SpotSubmission;
import com.zhuly.dto.ReviewRequest;
import com.zhuly.dto.SpotSubmissionRequest;
import com.zhuly.repository.ReviewRepository;
import com.zhuly.repository.SpotSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final ReviewRepository reviewRepository;
    private final SpotSubmissionRepository submissionRepository;

    @GetMapping("/spots/{spotId}/reviews")
    public List<Review> reviews(@PathVariable Long spotId) {
        return reviewRepository.findBySpotIdAndHiddenFalseOrderByCreatedAtDesc(spotId);
    }

    @PostMapping("/reviews")
    public Review review(@RequestParam(defaultValue = "1") Long userId,
                         @Valid @RequestBody ReviewRequest request) {
        Review review = new Review();
        review.setUserId(userId);
        review.setSpotId(request.getSpotId());
        review.setScore(request.getScore());
        review.setContent(request.getContent());
        review.setParentId(request.getParentId());
        review.setCreatedAt(LocalDateTime.now());
        if (request.getParentId() != null) {
            reviewRepository.findById(request.getParentId()).ifPresent(parent -> {
                parent.setReplyCount(parent.getReplyCount() + 1);
                reviewRepository.save(parent);
            });
        }
        return reviewRepository.save(review);
    }

    @PostMapping("/reviews/{id}/like")
    public Review like(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("评论不存在"));
        review.setLikes(review.getLikes() + 1);
        return reviewRepository.save(review);
    }

    @GetMapping("/users/{userId}/review-stats")
    public Map<String, Object> reviewStats(@PathVariable Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        int likeTotal = reviews.stream().mapToInt(Review::getLikes).sum();
        HashMap<String, Object> body = new HashMap<String, Object>();
        body.put("reviewTotal", reviews.size());
        body.put("likeTotal", likeTotal);
        return body;
    }

    @PostMapping("/submissions")
    public SpotSubmission submit(@RequestParam(defaultValue = "1") Long userId,
                                 @Valid @RequestBody SpotSubmissionRequest request) {
        SpotSubmission submission = new SpotSubmission();
        submission.setUserId(userId);
        submission.setName(request.getName());
        submission.setType(request.getType());
        submission.setAddress(request.getAddress());
        submission.setLatitude(request.getLatitude());
        submission.setLongitude(request.getLongitude());
        submission.setDescription(request.getDescription());
        submission.setReason(request.getReason());
        if (request.getPhotoUrls() != null) {
            submission.setPhotoUrls(request.getPhotoUrls());
        }
        submission.setStatus("PENDING");
        submission.setCreatedAt(LocalDateTime.now());
        return submissionRepository.save(submission);
    }

    @GetMapping("/submissions/mine")
    public List<SpotSubmission> mine(@RequestParam(defaultValue = "1") Long userId) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
