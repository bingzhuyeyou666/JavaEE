package com.zhuly.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.zhuly.domain.ScenicSpot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class BaiduPlaceService {

    private final RestTemplateBuilder restTemplateBuilder;
    private final Map<Long, String> phoneCache = new ConcurrentHashMap<>();

    @Value("${travel.map.api-key:}")
    private String baiduMapAk;

    public String phoneFor(ScenicSpot spot) {
        String known = knownPhone(spot.getName());
        if (StringUtils.hasText(known)) {
            return known;
        }
        if (!StringUtils.hasText(baiduMapAk)) {
            return spot.getPhone();
        }
        return phoneCache.computeIfAbsent(spot.getId(), id -> findBaiduPhone(spot));
    }

    private String findBaiduPhone(ScenicSpot spot) {
        try {
            RestTemplate restTemplate = restTemplateBuilder
                    .setConnectTimeout(Duration.ofSeconds(4))
                    .setReadTimeout(Duration.ofSeconds(6))
                    .build();
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://api.map.baidu.com/place/v2/search")
                    .queryParam("query", spot.getName())
                    .queryParam("location", spot.getLatitude() + "," + spot.getLongitude())
                    .queryParam("radius", 20000)
                    .queryParam("scope", 2)
                    .queryParam("output", "json")
                    .queryParam("ak", baiduMapAk)
                    .build()
                    .encode()
                    .toUriString();
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            JsonNode first = root == null ? null : root.at("/results/0");
            String phone = text(first, "telephone");
            if (!StringUtils.hasText(phone) && first != null) {
                phone = text(first.get("detail_info"), "telephone");
            }
            return StringUtils.hasText(phone) ? phone : spot.getPhone();
        } catch (Exception ex) {
            log.warn("Baidu place phone lookup failed for {}: {}", spot.getName(), ex.getMessage());
            return spot.getPhone();
        }
    }

    private String text(JsonNode node, String field) {
        if (node == null || node.get(field) == null || node.get(field).isNull()) {
            return "";
        }
        return node.get(field).asText("");
    }

    private String knownPhone(String spotName) {
        Map<String, String> phones = new HashMap<>();
        phones.put("李庄古镇", "0831-7897357");
        phones.put("蜀南竹海", "0831-4980000");
        phones.put("三江口滨江公园", "0831-8222215");
        return phones.entrySet().stream()
                .filter(entry -> spotName != null && spotName.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse("");
    }
}
