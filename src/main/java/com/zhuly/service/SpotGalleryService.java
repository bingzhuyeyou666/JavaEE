package com.zhuly.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SpotGalleryService {

    private final ScenicSpotRepository spotRepository;
    private final RestTemplate restTemplate = restTemplate();
    private final Map<String, String> imageCache = new ConcurrentHashMap<>();
    private final Map<String, List<String>> galleryCache = new ConcurrentHashMap<>();

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void backfillGalleryAfterStartup() {
        List<ScenicSpot> spots = spotRepository.findByApprovedTrue();
        boolean changed = false;
        for (ScenicSpot spot : spots) {
            boolean alreadyReady = spot.getGallery() != null && spot.getGallery().size() >= 3
                    && isStrongImage(spot.getCoverImage()) && spot.getGallery().stream().allMatch(this::isStrongImage);
            if (alreadyReady) {
                continue;
            }
            List<String> gallery = ensureGallery(spot);
            if (!sameGallery(spot.getGallery(), gallery) || !isStrongImage(spot.getCoverImage())) {
                spot.setGallery(gallery);
                spot.setCoverImage(gallery.get(0));
                changed = true;
            }
        }
        if (changed) {
            spotRepository.saveAll(spots);
        }
    }

    public List<String> ensureGallery(ScenicSpot spot) {
        if (spot == null) {
            return new ArrayList<>();
        }
        if (spot.getGallery() != null && spot.getGallery().size() >= 3
                && isStrongImage(spot.getCoverImage()) && spot.getGallery().stream().allMatch(this::isStrongImage)) {
            return spot.getGallery();
        }
        String cacheKey = spot.getId() == null ? spot.getName() : spot.getId() + ":" + spot.getName();
        return galleryCache.computeIfAbsent(cacheKey, key -> buildGallery(spot));
    }

    public String resolvePrimaryImage(String name) {
        return imageCache.computeIfAbsent("primary:" + name, this::resolveWikiImage);
    }

    private List<String> buildGallery(ScenicSpot spot) {
        LinkedHashSet<String> urls = new LinkedHashSet<>();
        if (isStrongImage(spot.getCoverImage())) {
            addIfPresent(urls, spot.getCoverImage());
        }
        if (spot.getGallery() != null) {
            for (String image : spot.getGallery()) {
                if (isStrongImage(image)) {
                    addIfPresent(urls, image);
                }
            }
        }

        List<String> queries = new ArrayList<>();
        queries.add(spot.getName());
        queries.add(spot.getName() + " 景区");
        queries.add(spot.getName() + " 景点");
        queries.add(spot.getName() + " 风景");
        queries.add(spot.getName() + " 实拍");
        queries.add(spot.getName() + " 旅游");
        if (spot.getType() != null && !spot.getType().trim().isEmpty()) {
            queries.add(spot.getName() + " " + spot.getType());
        }

        for (String query : queries) {
            if (urls.size() >= 3) {
                break;
            }
            addIfPresent(urls, resolveForQuery(query));
        }

        while (urls.size() < 3) {
            addIfPresent(urls, bingThumbnailImage(spot.getName() + " 景区 " + urls.size()));
        }
        return new ArrayList<>(new ArrayList<>(urls).subList(0, Math.max(3, urls.size())));
    }

    private String resolveForQuery(String query) {
        String cacheKey = "query:" + query;
        return imageCache.computeIfAbsent(cacheKey, ignored -> resolveImage(query));
    }

    private String resolveImage(String query) {
        String imageUrl = resolveWikipediaSummaryImage(query);
        if (!imageUrl.isEmpty()) {
            return imageUrl;
        }
        imageUrl = resolveCommonsImage(query);
        if (!imageUrl.isEmpty()) {
            return imageUrl;
        }
        return bingThumbnailImage(query);
    }

    private String resolveWikiImage(String name) {
        return resolveImage(name);
    }

    private String bingThumbnailImage(String name) {
        String query = UriUtils.encodeQueryParam(name + " 景区图片", StandardCharsets.UTF_8);
        return "https://tse1.mm.bing.net/th?q=" + query + "&w=1200&h=675&c=7&rs=1&p=0&o=5&pid=1.7";
    }

    private String resolveWikipediaSummaryImage(String name) {
        try {
            String encoded = UriUtils.encodePathSegment(name, StandardCharsets.UTF_8);
            String url = "https://zh.wikipedia.org/api/rest_v1/page/summary/" + encoded;
            JsonNode root = getJson(url);
            JsonNode source = root == null ? null : root.at("/thumbnail/source");
            return source == null || source.isMissingNode() ? "" : source.asText("");
        } catch (Exception ignored) {
            return "";
        }
    }

    private String resolveCommonsImage(String name) {
        try {
            for (String query : new String[]{name, name + " 风景", name + " 景区", name + " 实拍"}) {
                String url = UriComponentsBuilder.fromHttpUrl("https://commons.wikimedia.org/w/api.php")
                        .queryParam("action", "query")
                        .queryParam("generator", "search")
                        .queryParam("gsrsearch", query)
                        .queryParam("gsrnamespace", "6")
                        .queryParam("gsrlimit", "6")
                        .queryParam("prop", "imageinfo")
                        .queryParam("iiprop", "url|mime")
                        .queryParam("iiurlwidth", "1200")
                        .queryParam("format", "json")
                        .build()
                        .encode(StandardCharsets.UTF_8)
                        .toUriString();
                JsonNode pages = getJson(url).at("/query/pages");
                if (pages == null || pages.isMissingNode()) {
                    continue;
                }
                for (JsonNode page : pages) {
                    JsonNode imageInfo = page.path("imageinfo").path(0);
                    String mime = imageInfo.path("mime").asText("");
                    if (!mime.startsWith("image/")) {
                        continue;
                    }
                    String thumbUrl = imageInfo.path("thumburl").asText("");
                    String originalUrl = imageInfo.path("url").asText("");
                    if (!thumbUrl.isEmpty()) {
                        return thumbUrl;
                    }
                    if (!originalUrl.isEmpty()) {
                        return originalUrl;
                    }
                }
            }
        } catch (Exception ignored) {
            return "";
        }
        return "";
    }

    private JsonNode getJson(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, "TravelCloudMap/1.0 (scenic spot gallery resolver)");
        return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class).getBody();
    }

    private RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(2000);
        factory.setReadTimeout(2000);
        return new RestTemplate(factory);
    }

    private void addIfPresent(LinkedHashSet<String> urls, String url) {
        if (url != null && !url.trim().isEmpty()) {
            urls.add(url);
        }
    }

    private boolean isStrongImage(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        String normalized = url.toLowerCase();
        return !normalized.contains("images.unsplash.com")
                && !normalized.contains("tse1.mm.bing.net")
                && !normalized.contains("/api/images/spots/")
                && !normalized.contains("query:");
    }

    private boolean sameGallery(List<String> existing, List<String> updated) {
        if (existing == null) {
            return false;
        }
        return existing.size() == updated.size() && existing.containsAll(updated) && updated.containsAll(existing);
    }
}
