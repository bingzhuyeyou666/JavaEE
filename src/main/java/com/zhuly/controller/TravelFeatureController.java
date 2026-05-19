package com.zhuly.controller;

import com.zhuly.dto.CheckInResponse;
import com.zhuly.dto.CrowdIndexResponse;
import com.zhuly.dto.RoutePlanRequest;
import com.zhuly.dto.RoutePlanResponse;
import com.zhuly.dto.SpotAssistantRequest;
import com.zhuly.dto.SpotAssistantResponse;
import com.zhuly.dto.WeatherForecast;
import com.zhuly.repository.FacilityRepository;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.service.CheckInService;
import com.zhuly.service.CrowdIndexService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @Value("${travel.map.api-key:}")
    private String baiduMapAk;

    @Value("${travel.map.enabled:false}")
    private boolean baiduMapEnabled;

    @GetMapping("/config")
    public Map<String, Object> config() {
        Map<String, Object> body = new HashMap<>();
        body.put("baiduMapAk", baiduMapAk);
        body.put("baiduMapEnabled", baiduMapEnabled);
        return body;
    }

    @PostMapping("/spots/{spotId}/check-ins")
    public CheckInResponse checkIn(@PathVariable Long spotId,
                                   @RequestParam(defaultValue = "1") Long userId,
                                   @RequestParam BigDecimal lat,
                                   @RequestParam BigDecimal lng) {
        return checkInService.checkIn(userId, spotId, lat, lng);
    }

    @GetMapping("/users/{userId}/footprints")
    public Map<String, Object> footprints(@PathVariable Long userId) {
        CheckInResponse profile = checkInService.profile(userId, null);
        List<Map<String, Object>> checkedInSpots = spotRepository.findAllById(checkInService.checkedInIds(userId)).stream()
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
        Map<String, Object> body = new HashMap<>();
        body.put("checkedInSpotIds", checkInService.checkedInIds(userId));
        body.put("checkedInSpots", checkedInSpots);
        body.put("total", profile.getTotalCheckedIn());
        body.put("badges", profile.getBadges());
        return body;
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
    public CrowdIndexResponse crowd(@PathVariable Long spotId) {
        return crowdIndexService.getCrowdIndex(spotId);
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
    public RoutePlanResponse planRoute(@Valid @RequestBody RoutePlanRequest request) {
        return routePlanService.plan(request.getSpotIds());
    }

    @PostMapping("/spots/{spotId}/assistant")
    public SpotAssistantResponse assistant(@PathVariable Long spotId,
                                           @Valid @RequestBody SpotAssistantRequest request) {
        return spotAssistantService.answer(spotId, request.getQuestion());
    }

    @GetMapping(value = "/audio/mock/{name}", produces = MediaType.TEXT_PLAIN_VALUE)
    public String mockAudio(@PathVariable String name) {
        return "学生项目演示接口：此处可替换为阿里云或腾讯云TTS生成的MP3对象存储地址。" + name;
    }
}
