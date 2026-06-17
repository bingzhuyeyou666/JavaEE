package com.zhuly.controller;

import com.zhuly.dto.CheckInResponse;
import com.zhuly.dto.CrowdIndexResponse;
import com.zhuly.dto.RoutePlanRequest;
import com.zhuly.dto.RoutePlanResponse;
import com.zhuly.dto.SpotAssistantRequest;
import com.zhuly.dto.SpotAssistantResponse;
import com.zhuly.dto.TravelCopyResponse;
import com.zhuly.dto.WeatherForecast;
import com.zhuly.domain.CheckInRecord;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.FacilityRepository;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.service.CheckInService;
import com.zhuly.service.CrowdIndexService;
import com.zhuly.service.FriendlyPointService;
import com.zhuly.service.GeoUtils;
import com.zhuly.service.RoutePlanService;
import com.zhuly.service.SpotAssistantService;
import com.zhuly.service.TtsService;
import com.zhuly.service.WeatherService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TravelFeatureController {

    private final CheckInService checkInService;
    private final CrowdIndexService crowdIndexService;
    private final TtsService ttsService;
    private final WeatherService weatherService;
    private final RoutePlanService routePlanService;
    private final SpotAssistantService spotAssistantService;
    private final ScenicSpotRepository spotRepository;
    private final FacilityRepository facilityRepository;
    private final FriendlyPointService friendlyPointService;

    @Value("${travel.map.api-key:}")
    private String baiduMapAk;

    @Value("${travel.map.enabled:false}")
    private boolean baiduMapEnabled;

    @Value("${travel.admin.username:admin}")
    private String adminUsername;

    @GetMapping("/config")
    public Map<String, Object> config() {
        Map<String, Object> body = new HashMap<>();
        body.put("baiduMapAk", baiduMapAk);
        body.put("baiduMapEnabled", baiduMapEnabled);
        body.put("adminUsername", adminUsername);
        return body;
    }

    @PostMapping("/spots/{spotId}/check-ins")
    public CheckInResponse checkIn(@PathVariable Long spotId,
                                   @RequestParam(defaultValue = "1") Long userId,
                                   @RequestParam BigDecimal lat,
                                   @RequestParam BigDecimal lng,
                                   @RequestParam String imageUrl) {
        return checkInService.checkIn(userId, spotId, lat, lng, imageUrl);
    }

    @PostMapping(value = "/check-ins/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> uploadCheckInImage(@RequestParam("files") MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("请选择要上传的打卡图片");
        }
        Path uploadRoot = Paths.get("data", "uploads", "check-ins", "image").toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            validateCheckInImage(file);
            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID().toString().replace("-", "") + (extension == null ? "" : "." + extension.toLowerCase());
            Path target = uploadRoot.resolve(filename).normalize();
            if (!target.startsWith(uploadRoot)) {
                throw new IllegalArgumentException("文件名不合法");
            }
            file.transferTo(target.toFile());
            urls.add("/uploads/check-ins/image/" + filename);
        }
        return Collections.singletonMap("urls", urls);
    }

    @GetMapping("/users/{userId}/footprints")
    public Map<String, Object> footprints(@PathVariable Long userId) {
        CheckInResponse profile = checkInService.profile(userId, null);
        List<CheckInRecord> records = checkInService.records(userId);
        Map<Long, ScenicSpot> spotsById = spotRepository.findAllById(checkInService.checkedInIds(userId)).stream()
                .collect(Collectors.toMap(ScenicSpot::getId, spot -> spot));
        List<Map<String, Object>> checkedInSpots = records.stream()
                .map(record -> spotsById.get(record.getSpotId()))
                .filter(spot -> spot != null)
                .map(spot -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", spot.getId());
                    item.put("name", spot.getName());
                    item.put("type", spot.getType());
                    item.put("address", spot.getAddress());
                    item.put("latitude", spot.getLatitude());
                    item.put("longitude", spot.getLongitude());
                    item.put("coverImage", spot.getCoverImage());
                    return item;
                })
                .collect(Collectors.toList());
        List<Map<String, Object>> travelPhotos = records.stream()
                .map(record -> {
                    ScenicSpot spot = spotsById.get(record.getSpotId());
                    List<String> images = checkInService.images(record);
                    if (spot == null || images.isEmpty()) {
                        return null;
                    }
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", record.getId());
                    item.put("spotId", record.getSpotId());
                    item.put("spotName", spot.getName());
                    item.put("spotType", spot.getType());
                    item.put("address", spot.getAddress());
                    item.put("imageUrl", images.get(0));
                    item.put("imageUrls", images);
                    item.put("photoCount", images.size());
                    item.put("checkedInAt", record.getCheckedInAt());
                    return item;
                })
                .filter(item -> item != null)
                .collect(Collectors.toList());
        Map<String, Object> body = new HashMap<>();
        body.put("checkedInSpotIds", checkInService.checkedInIds(userId));
        body.put("checkedInSpots", checkedInSpots);
        body.put("travelPhotos", travelPhotos);
        body.put("total", profile.getTotalCheckedIn());
        body.put("badges", profile.getBadges());
        return body;
    }

    @GetMapping("/users/{userId}/travel-galleries/{spotId}")
    public Map<String, Object> travelGallery(@PathVariable Long userId, @PathVariable Long spotId) {
        CheckInRecord record = checkInService.gallery(userId, spotId);
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        return galleryBody(record, spot);
    }

    @PostMapping("/users/{userId}/travel-galleries/{spotId}/images")
    public Map<String, Object> addTravelGalleryImages(@PathVariable Long userId,
                                                      @PathVariable Long spotId,
                                                      @RequestBody Map<String, Object> body) {
        Object value = body.get("imageUrls");
        List<String> imageUrls = new ArrayList<>();
        if (value instanceof List) {
            for (Object item : (List<?>) value) {
                if (item != null && StringUtils.hasText(item.toString())) {
                    imageUrls.add(item.toString());
                }
            }
        }
        CheckInRecord record = checkInService.addGalleryImages(userId, spotId, imageUrls);
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        return galleryBody(record, spot);
    }

    @DeleteMapping("/users/{userId}/travel-galleries/{spotId}/images")
    public Map<String, Object> deleteTravelGalleryImage(@PathVariable Long userId,
                                                        @PathVariable Long spotId,
                                                        @RequestParam String imageUrl) {
        CheckInRecord record = checkInService.deleteGalleryImage(userId, spotId, imageUrl);
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        return galleryBody(record, spot);
    }

    @GetMapping("/facilities")
    public List<Map<String, Object>> facilities(@RequestParam(required = false) BigDecimal lat,
                                                @RequestParam(required = false) BigDecimal lng,
                                                @RequestParam(defaultValue = "8") double radiusKm) {
        return facilityRepository.findAll().stream()
                .map(facility -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", facility.getId());
                    item.put("type", facility.getType());
                    item.put("name", facility.getName());
                    item.put("address", facility.getAddress());
                    item.put("latitude", facility.getLatitude());
                    item.put("longitude", facility.getLongitude());
                    item.put("rating", facility.getRating());
                    item.put("price", facility.getPrice());
                    item.put("availableSpaces", facility.getAvailableSpaces());
                    item.put("hygieneScore", facility.getHygieneScore());
                    item.put("cuisine", facility.getCuisine());
                    item.put("averageCost", facility.getAverageCost());
                    item.put("distanceKm", lat == null || lng == null ? null
                            : Math.round(GeoUtils.distanceKm(lat, lng, facility.getLatitude(), facility.getLongitude()) * 10.0) / 10.0);
                    return item;
                })
                .filter(item -> item.get("distanceKm") == null || ((Number) item.get("distanceKm")).doubleValue() <= radiusKm)
                .collect(Collectors.toList());
    }

    @GetMapping("/spots/{spotId}/crowd-index")
    public CrowdIndexResponse crowd(@PathVariable Long spotId,
                                    @RequestParam(required = false) LocalDate visitDate) {
        return crowdIndexService.getCrowdIndex(spotId, visitDate);
    }

    @GetMapping("/spots/{spotId}/tts")
    public Map<String, String> tts(@PathVariable Long spotId) {
        Map<String, String> body = new HashMap<>();
        body.put("audioUrl", ttsService.audioUrl(spotId));
        return body;
    }

    @GetMapping("/spots/{spotId}/weather")
    public List<WeatherForecast> weather(@PathVariable Long spotId) {
        return spotRepository.findById(spotId)
                .map(spot -> weatherService.threeDays(spot.getLatitude(), spot.getLongitude()))
                .orElseGet(() -> weatherService.threeDays(null, null));
    }

    @PostMapping("/routes/plan")
    public RoutePlanResponse planRoute(@Valid @RequestBody RoutePlanRequest request,
                                       @RequestParam(defaultValue = "1") Long userId) {
        RoutePlanResponse response = routePlanService.plan(request.getSpotIds(), request.getMode());
        friendlyPointService.awardRoute(userId, request.getMode(), response.getTotalDistanceKm());
        return response;
    }

    @PostMapping("/spots/{spotId}/assistant")
    public SpotAssistantResponse assistant(@PathVariable Long spotId,
                                           @Valid @RequestBody SpotAssistantRequest request) {
        return spotAssistantService.answer(spotId, request.getQuestion());
    }

    @PostMapping("/assistant")
    public SpotAssistantResponse generalAssistant(@Valid @RequestBody SpotAssistantRequest request) {
        return spotAssistantService.answerGeneral(request.getQuestion());
    }

    @PostMapping(value = "/ai/travel-copy", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TravelCopyResponse travelCopy(@RequestParam(required = false) String locationName,
                                         @RequestParam(required = false) String tripDate,
                                         @RequestParam(required = false) String companions,
                                         @RequestParam(required = false) String style,
                                         @RequestParam(required = false) String length,
                                         @RequestParam(required = false) String notes,
                                         @RequestParam("images") MultipartFile[] images) throws java.io.IOException {
        return spotAssistantService.generateTravelCopy(locationName, tripDate, companions, style, length, notes, images);
    }

    private void validateCheckInImage(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("打卡凭证只支持图片文件");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("单张打卡图片不能超过10MB");
        }
    }

    private Map<String, Object> galleryBody(CheckInRecord record, ScenicSpot spot) {
        List<String> images = checkInService.images(record);
        Map<String, Object> body = new HashMap<>();
        body.put("id", record.getId());
        body.put("spotId", spot.getId());
        body.put("spotName", spot.getName());
        body.put("spotType", spot.getType());
        body.put("address", spot.getAddress());
        body.put("checkedInAt", record.getCheckedInAt());
        body.put("imageUrl", images.isEmpty() ? "" : images.get(0));
        body.put("imageUrls", images);
        body.put("photoCount", images.size());
        return body;
    }

    @GetMapping(value = "/audio/mock/{name}", produces = MediaType.TEXT_PLAIN_VALUE)
    public String mockAudio(@PathVariable String name) {
        return "学生项目演示接口：此处可替换为阿里云或腾讯云TTS生成的MP3对象存储地址。" + name;
    }
}
