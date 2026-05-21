package com.zhuly.controller;

import com.zhuly.domain.Review;
import com.zhuly.domain.SquareComment;
import com.zhuly.domain.SquarePost;
import com.zhuly.domain.SpotSubmission;
import com.zhuly.dto.ReviewRequest;
import com.zhuly.dto.SquareCommentRequest;
import com.zhuly.dto.SquarePostRequest;
import com.zhuly.dto.SpotSubmissionRequest;
import com.zhuly.repository.ReviewRepository;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.repository.SquareCommentRepository;
import com.zhuly.repository.SquarePostRepository;
import com.zhuly.repository.SpotSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final ReviewRepository reviewRepository;
    private final ScenicSpotRepository spotRepository;
    private final SpotSubmissionRepository submissionRepository;
    private final SquarePostRepository squarePostRepository;
    private final SquareCommentRepository squareCommentRepository;

    @GetMapping("/spots/{spotId}/reviews")
    public List<Review> reviews(@PathVariable Long spotId) {
        return reviewRepository.findBySpotIdAndHiddenFalseOrderByCreatedAtDesc(spotId);
    }

    @PostMapping("/reviews")
    public Review review(@RequestParam(defaultValue = "1") Long userId,
                         @Valid @RequestBody ReviewRequest request) {
        spotRepository.findById(request.getSpotId())
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        Review review = new Review();
        review.setUserId(userId);
        review.setSpotId(request.getSpotId());
        review.setScore(request.getScore());
        review.setContent(request.getContent().trim());
        review.setParentId(request.getParentId());
        review.setSource("USER");
        review.setCreatedAt(LocalDateTime.now());
        if (request.getParentId() != null) {
            reviewRepository.findById(request.getParentId()).ifPresent(parent -> {
                if (!request.getSpotId().equals(parent.getSpotId())) {
                    throw new IllegalArgumentException("回复的评论不属于当前景点");
                }
                parent.setReplyCount(parent.getReplyCount() + 1);
                reviewRepository.save(parent);
            });
        }
        return reviewRepository.save(review);
    }

    @PostMapping("/reviews/{id}/like")
    public Review like(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("评论不存在"));
        if (review.getLikedUserIds().contains(userId)) {
            review.getLikedUserIds().remove(userId);
            review.setLikes(Math.max(0, review.getLikes() - 1));
        } else {
            review.getLikedUserIds().add(userId);
            review.setLikes(review.getLikes() + 1);
        }
        return reviewRepository.save(review);
    }

    @GetMapping("/users/{userId}/review-stats")
    public Map<String, Object> reviewStats(@PathVariable Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        int likeTotal = reviews.stream().mapToInt(Review::getLikes).sum();
        List<SquarePost> posts = squarePostRepository.findByUserIdOrderByCreatedAtDesc(userId);
        HashMap<String, Object> body = new HashMap<String, Object>();
        body.put("reviewTotal", reviews.size());
        body.put("likeTotal", likeTotal);
        body.put("postTotal", posts.size());
        return body;
    }

    @GetMapping("/square/posts")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> squarePosts(@RequestParam(required = false) String category) {
        List<SquarePost> posts;
        if (category != null && category.trim().length() > 0 && !"全部".equals(category.trim())) {
            posts = squarePostRepository.findByCategoryAndHiddenFalseOrderByCreatedAtDesc(category.trim());
        } else {
            posts = squarePostRepository.findByHiddenFalseOrderByCreatedAtDesc();
        }
        return posts.stream().map(this::squarePostBody).collect(Collectors.toList());
    }

    @PostMapping("/square/posts")
    public Map<String, Object> squarePost(@RequestParam(defaultValue = "1") Long userId,
                                          @Valid @RequestBody SquarePostRequest request) {
        SquarePost post = new SquarePost();
        post.setUserId(userId);
        post.setAuthorName("游客" + userId);
        post.setCategory(request.getCategory().trim());
        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setLocationName(trimToNull(request.getLocationName()));
        post.setTripDate(trimToNull(request.getTripDate()));
        post.setImageUrls(cleanUrls(request.getImageUrls()));
        post.setVideoUrls(cleanUrls(request.getVideoUrls()));
        post.setCreatedAt(LocalDateTime.now());
        return squarePostBody(squarePostRepository.save(post));
    }

    @PostMapping("/square/posts/{id}/like")
    @Transactional
    public Map<String, Object> likeSquarePost(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId) {
        SquarePost post = squarePostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在"));
        if (post.getLikedUserIds().contains(userId)) {
            post.getLikedUserIds().remove(userId);
            post.setLikes(Math.max(0, post.getLikes() - 1));
        } else {
            post.getLikedUserIds().add(userId);
            post.setLikes(post.getLikes() + 1);
        }
        return squarePostBody(squarePostRepository.save(post));
    }

    @GetMapping("/square/posts/{id}/comments")
    public List<SquareComment> squareComments(@PathVariable Long id) {
        return squareCommentRepository.findByPostIdOrderByCreatedAtAsc(id);
    }

    @PostMapping("/square/posts/{id}/comments")
    public SquareComment squareComment(@PathVariable Long id,
                                       @RequestParam(defaultValue = "1") Long userId,
                                       @Valid @RequestBody SquareCommentRequest request) {
        SquarePost post = squarePostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在"));
        SquareComment comment = new SquareComment();
        comment.setPostId(id);
        comment.setUserId(userId);
        comment.setAuthorName("游客" + userId);
        comment.setContent(request.getContent().trim());
        comment.setCreatedAt(LocalDateTime.now());
        SquareComment saved = squareCommentRepository.save(comment);
        post.setCommentCount(post.getCommentCount() + 1);
        squarePostRepository.save(post);
        return saved;
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

    private List<String> cleanUrls(List<String> urls) {
        if (urls == null) {
            return new ArrayList<String>();
        }
        return urls.stream()
                .filter(item -> item != null && item.trim().length() > 0)
                .map(String::trim)
                .collect(Collectors.toList());
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().length() == 0) {
            return null;
        }
        return value.trim();
    }

    private Map<String, Object> squarePostBody(SquarePost post) {
        Map<String, Object> body = new HashMap<String, Object>();
        body.put("id", post.getId());
        body.put("userId", post.getUserId());
        body.put("authorName", post.getAuthorName());
        body.put("category", post.getCategory());
        body.put("title", post.getTitle());
        body.put("content", post.getContent());
        body.put("imageUrls", new ArrayList<String>(post.getImageUrls()));
        body.put("videoUrls", new ArrayList<String>(post.getVideoUrls()));
        body.put("locationName", post.getLocationName());
        body.put("tripDate", post.getTripDate());
        body.put("likes", post.getLikes());
        body.put("likedUserIds", new ArrayList<Long>(post.getLikedUserIds()));
        body.put("commentCount", post.getCommentCount());
        body.put("createdAt", post.getCreatedAt());
        return body;
    }
}
