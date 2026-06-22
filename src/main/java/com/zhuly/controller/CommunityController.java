/**
 * 本文件定义 CommunityController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zhuly.config.UserAuthInterceptor;
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
import com.zhuly.service.FriendlyPointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * CommunityController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private static final List<String> IMAGE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final List<String> VIDEO_TYPES = Arrays.asList("video/mp4", "video/webm", "video/quicktime");

    private final ReviewRepository reviewRepository;
    private final ScenicSpotRepository spotRepository;
    private final SpotSubmissionRepository submissionRepository;
    private final SquarePostRepository squarePostRepository;
    private final SquareCommentRepository squareCommentRepository;
    private final ObjectMapper objectMapper;
    private final FriendlyPointService friendlyPointService;

    // 查询指定景点下未隐藏的游客评论
    @GetMapping("/spots/{spotId}/reviews")
    public List<Review> reviews(@PathVariable Long spotId) {
        return reviewRepository.findBySpotIdAndHiddenFalseOrderByCreatedAtDesc(spotId);
    }

    // 发布景点评论或对已有评论进行回复
    @PostMapping("/reviews")
    public Review review(@RequestParam(defaultValue = "1") Long userId,
                         HttpSession session,
                         @Valid @RequestBody ReviewRequest request) {
        Long currentUserId = requireUserId(session);
        spotRepository.findById(request.getSpotId())
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        Review review = new Review();
        review.setUserId(currentUserId);
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
        Review saved = reviewRepository.save(review);
        friendlyPointService.award(currentUserId, 3, "SPOT_REVIEW", "发表景点评论", "分享真实体验，帮助其他旅行者", saved.getId());
        return saved;
    }

    // 点赞或取消点赞指定景点评论
    @PostMapping("/reviews/{id}/like")
    public Review like(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId, HttpSession session) {
        Long currentUserId = requireUserId(session);
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("评论不存在"));
        if (review.getLikedUserIds().contains(currentUserId)) {
            review.getLikedUserIds().remove(currentUserId);
            review.setLikes(Math.max(0, review.getLikes() - 1));
        } else {
            review.getLikedUserIds().add(currentUserId);
            review.setLikes(review.getLikes() + 1);
        }
        return reviewRepository.save(review);
    }

    // 查询指定用户的评论数量和获赞统计
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

    // 按分类查询旅行广场帖子列表
    @GetMapping("/square/posts")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> squarePosts(@RequestParam(required = false) String category) {
        List<SquarePost> posts;
        if (category != null && category.trim().length() > 0 && !isAllCategory(category)) {
            posts = squarePostRepository.findByCategoryAndHiddenFalseOrderByCreatedAtDesc(category.trim());
        } else {
            posts = squarePostRepository.findByHiddenFalseOrderByCreatedAtDesc();
        }
        return posts.stream().map(this::squarePostBody).collect(Collectors.toList());
    }

    // 查询指定旅行广场帖子的完整内容
    @GetMapping("/square/posts/{id}")
    @Transactional(readOnly = true)
    public Map<String, Object> squarePostDetail(@PathVariable Long id) {
        SquarePost post = squarePostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在"));
        if (post.isHidden()) {
            throw new IllegalArgumentException("帖子不存在");
        }
        return squarePostBody(post);
    }

    // 登录用户发布新的旅行广场帖子
    @PostMapping("/square/posts")
    @Transactional
    public Map<String, Object> squarePost(@RequestParam(defaultValue = "1") Long userId,
                                          HttpSession session,
                                          @Valid @RequestBody SquarePostRequest request) {
        Long currentUserId = requireUserId(session);
        SquarePost post = new SquarePost();
        post.setUserId(currentUserId);
        post.setAuthorName(currentUserName(session, currentUserId));
        post.setPostType(trimToDefault(request.getPostType(), "NOTE"));
        post.setCategory(request.getCategory().trim());
        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setLocationName(trimToNull(request.getLocationName()));
        post.setTripDate(trimToNull(request.getTripDate()));
        post.setImageUrls(cleanUrls(request.getImageUrls()));
        post.setVideoUrls(cleanUrls(request.getVideoUrls()));
        post.setTags(cleanUrls(request.getTags()));
        post.setCreatedAt(LocalDateTime.now());
        SquarePost saved = squarePostRepository.save(post);
        friendlyPointService.award(currentUserId, 10, "SQUARE_POST", "发布旅行帖子", "记录旅途，也为他人提供灵感", saved.getId());
        return squarePostBody(saved);
    }

    // 上传旅行广场帖子使用的图片或视频
    @PostMapping("/square/uploads")
    public Map<String, Object> uploadSquareMedia(@RequestParam(defaultValue = "image") String type,
                                                 HttpSession session,
                                                 @RequestParam("files") MultipartFile[] files) throws IOException {
        requireUserId(session);
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("请选择要上传的文件");
        }
        String mediaType = "video".equalsIgnoreCase(type) ? "video" : "image";
        Path uploadRoot = Paths.get("data", "uploads", "square", mediaType).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
        List<String> urls = new ArrayList<String>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            validateMediaFile(mediaType, file);
            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID().toString().replace("-", "") + (extension == null ? "" : "." + extension.toLowerCase());
            Path target = uploadRoot.resolve(filename).normalize();
            if (!target.startsWith(uploadRoot)) {
                throw new IllegalArgumentException("文件名不合法");
            }
            file.transferTo(target.toFile());
            urls.add("/uploads/square/" + mediaType + "/" + filename);
        }
        return Collections.singletonMap("urls", urls);
    }

    // 上传景点申报使用的图片或视频资料
    @PostMapping("/submissions/uploads")
    public Map<String, Object> uploadSubmissionMedia(@RequestParam(defaultValue = "image") String type,
                                                     HttpSession session,
                                                     @RequestParam("files") MultipartFile[] files) throws IOException {
        requireUserId(session);
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("请选择要上传的文件");
        }
        String mediaType = "video".equalsIgnoreCase(type) ? "video" : "image";
        Path uploadRoot = Paths.get("data", "uploads", "submissions", mediaType).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
        List<String> urls = new ArrayList<String>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            validateMediaFile(mediaType, file);
            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID().toString().replace("-", "") + (extension == null ? "" : "." + extension.toLowerCase());
            Path target = uploadRoot.resolve(filename).normalize();
            if (!target.startsWith(uploadRoot)) {
                throw new IllegalArgumentException("文件名不合法");
            }
            file.transferTo(target.toFile());
            urls.add("/uploads/submissions/" + mediaType + "/" + filename);
        }
        return Collections.singletonMap("urls", urls);
    }

    // 点赞或取消点赞指定旅行广场帖子
    @PostMapping("/square/posts/{id}/like")
    @Transactional
    public Map<String, Object> likeSquarePost(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId, HttpSession session) {
        Long currentUserId = requireUserId(session);
        SquarePost post = squarePostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在"));
        if (post.getLikedUserIds().contains(currentUserId)) {
            post.getLikedUserIds().remove(currentUserId);
            post.setLikes(Math.max(0, post.getLikes() - 1));
        } else {
            post.getLikedUserIds().add(currentUserId);
            post.setLikes(post.getLikes() + 1);
        }
        return squarePostBody(squarePostRepository.save(post));
    }

    // 查询指定旅行广场帖子的评论列表
    @GetMapping("/square/posts/{id}/comments")
    public List<SquareComment> squareComments(@PathVariable Long id) {
        return squareCommentRepository.findByPostIdOrderByCreatedAtAsc(id);
    }

    // 为指定旅行广场帖子发布评论或追评
    @PostMapping("/square/posts/{id}/comments")
    @Transactional
    public SquareComment squareComment(@PathVariable Long id,
                                       @RequestParam(defaultValue = "1") Long userId,
                                       HttpSession session,
                                       @Valid @RequestBody SquareCommentRequest request) {
        Long currentUserId = requireUserId(session);
        SquarePost post = squarePostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在"));
        SquareComment comment = new SquareComment();
        comment.setPostId(id);
        comment.setParentId(request.getParentId());
        comment.setUserId(currentUserId);
        comment.setAuthorName(currentUserName(session, currentUserId));
        comment.setContent(request.getContent().trim());
        comment.setCreatedAt(LocalDateTime.now());
        if (request.getParentId() != null) {
            SquareComment parent = squareCommentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("评论不存在"));
            if (!id.equals(parent.getPostId())) {
                throw new IllegalArgumentException("追评不属于当前帖子");
            }
            parent.setReplyCount(safeInt(parent.getReplyCount()) + 1);
            squareCommentRepository.save(parent);
        }
        SquareComment saved = squareCommentRepository.save(comment);
        post.setCommentCount(post.getCommentCount() + 1);
        squarePostRepository.save(post);
        friendlyPointService.award(currentUserId, 3, "SQUARE_COMMENT", "参与旅行讨论", "友善评论让旅行广场更有温度", saved.getId());
        return saved;
    }

    // 点赞或取消点赞指定旅行广场评论
    @PostMapping("/square/comments/{id}/like")
    @Transactional
    public SquareComment likeSquareComment(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId, HttpSession session) {
        Long currentUserId = requireUserId(session);
        SquareComment comment = squareCommentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("评论不存在"));
        if (comment.getLikedUserIds().contains(currentUserId)) {
            comment.getLikedUserIds().remove(currentUserId);
            comment.setLikes(Math.max(0, safeInt(comment.getLikes()) - 1));
        } else {
            comment.getLikedUserIds().add(currentUserId);
            comment.setLikes(safeInt(comment.getLikes()) + 1);
        }
        return squareCommentRepository.save(comment);
    }

    // 登录用户提交新的景点申报
    @PostMapping("/submissions")
    public SpotSubmission submit(@RequestParam(defaultValue = "1") Long userId,
                                 HttpSession session,
                                 @Valid @RequestBody SpotSubmissionRequest request) {
        Long currentUserId = requireUserId(session);
        SpotSubmission submission = new SpotSubmission();
        submission.setUserId(currentUserId);
        submission.setName(request.getName());
        submission.setType(request.getType());
        submission.setAddress(request.getAddress());
        submission.setLatitude(request.getLatitude());
        submission.setLongitude(request.getLongitude());
        submission.setOpenHours(trimToNull(request.getOpenHours()));
        submission.setPrice(request.getPrice());
        submission.setBestSeason(trimToNull(request.getBestSeason()));
        submission.setPhone(trimToNull(request.getPhone()));
        submission.setDescription(request.getDescription());
        submission.setReason(request.getReason());
        if (request.getPhotoUrls() != null) {
            submission.setPhotoUrls(request.getPhotoUrls());
        }
        if (request.getVideoUrls() != null) {
            submission.setVideoUrls(request.getVideoUrls());
        }
        submission.setStatus("PENDING");
        submission.setCreatedAt(LocalDateTime.now());
        return submissionRepository.save(submission);
    }

    // 查询当前登录用户提交的景点申报记录
    @GetMapping("/submissions/mine")
    public List<SpotSubmission> mine(@RequestParam(defaultValue = "1") Long userId, HttpSession session) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(requireUserId(session));
    }

    // 更新并规范化 cleanUrls 对应的数据
    private List<String> cleanUrls(List<String> urls) {
        if (urls == null) {
            return new ArrayList<String>();
        }
        return urls.stream()
                .filter(item -> item != null && item.trim().length() > 0)
                .map(String::trim)
                .collect(Collectors.toList());
    }

    // 执行 trimToNull 方法对应的业务处理
    private String trimToNull(String value) {
        if (value == null || value.trim().length() == 0) {
            return null;
        }
        return value.trim();
    }

    // 执行 squarePostBody 方法对应的业务处理
    private Map<String, Object> squarePostBody(SquarePost post) {
        Map<String, Object> body = new HashMap<String, Object>();
        body.put("id", post.getId());
        body.put("userId", post.getUserId());
        body.put("authorName", post.getAuthorName());
        body.put("postType", post.getPostType());
        body.put("category", post.getCategory());
        body.put("title", post.getTitle());
        body.put("content", post.getContent());
        body.put("imageUrls", new ArrayList<String>(post.getImageUrls()));
        body.put("videoUrls", new ArrayList<String>(post.getVideoUrls()));
        body.put("tags", new ArrayList<String>(post.getTags()));
        body.put("locationName", post.getLocationName());
        body.put("tripDate", post.getTripDate());
        body.put("likes", post.getLikes());
        body.put("likedUserIds", new ArrayList<Long>(post.getLikedUserIds()));
        body.put("commentCount", post.getCommentCount());
        body.put("createdAt", post.getCreatedAt());
        return body;
    }

    // 执行 trimToDefault 方法对应的业务处理
    private String trimToDefault(String value, String defaultValue) {
        String trimmed = trimToNull(value);
        return trimmed == null ? defaultValue : trimmed;
    }

    // 校验 requireUserId 对应的条件并返回判断结果
    private Long requireUserId(HttpSession session) {
        if (session == null || !Boolean.TRUE.equals(session.getAttribute(UserAuthInterceptor.USER_SESSION_KEY))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
        }
        Object userId = session.getAttribute(UserAuthInterceptor.USER_ID_KEY);
        if (userId instanceof Long) {
            return (Long) userId;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
    }

    // 执行 currentUserName 方法对应的业务处理
    private String currentUserName(HttpSession session, Long userId) {
        Object username = session.getAttribute(UserAuthInterceptor.USER_NAME_KEY);
        String name = username == null ? "" : username.toString().trim();
        return name.length() > 0 ? name : "游客" + userId;
    }

    // 计算 safeInt 对应的业务结果
    private int safeInt(Integer value) {
        return value == null ? 0 : value;
    }

    // 校验 isAllCategory 对应的条件并返回判断结果
    private boolean isAllCategory(String category) {
        String trimmed = category == null ? "" : category.trim();
        return "ALL".equalsIgnoreCase(trimmed) || "\u5168\u90e8".equals(trimmed);
    }

    // 校验 validateMediaFile 对应的条件并返回判断结果
    private void validateMediaFile(String type, MultipartFile file) {
        String contentType = file.getContentType();
        boolean valid = "video".equals(type) ? VIDEO_TYPES.contains(contentType) : IMAGE_TYPES.contains(contentType);
        if (!valid) {
            throw new IllegalArgumentException("不支持的文件类型");
        }
        long maxSize = "video".equals(type) ? 80L * 1024L * 1024L : 10L * 1024L * 1024L;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("文件过大");
        }
    }
}
