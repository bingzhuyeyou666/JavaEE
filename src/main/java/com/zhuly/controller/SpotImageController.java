/**
 * 本文件定义 SpotImageController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SpotImageController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequiredArgsConstructor
public class SpotImageController {

    private final ScenicSpotRepository spotRepository;
    private final RestTemplate restTemplate = restTemplate();
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    // 查询景点网络图片，无法获取时返回本地生成的占位图
    @GetMapping("/api/images/spots/{name}")
    public ResponseEntity<?> spotImage(@PathVariable String name) {
        String imageUrl = cache.computeIfAbsent(name, this::resolveWikiImage);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            persistResolvedImage(name, imageUrl);
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.LOCATION, imageUrl);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
        return fallbackSvg(name);
    }

    // 上传或保存 persistResolvedImage 对应的文件和数据
    private void persistResolvedImage(String name, String imageUrl) {
        spotRepository.findFirstByName(name).ifPresent(spot -> {
            if (spot.getCoverImage() == null || spot.getCoverImage().startsWith("/api/images/spots/")) {
                spot.setCoverImage(imageUrl);
            }
            if (spot.getGallery() == null) {
                spot.setGallery(new java.util.ArrayList<>());
            }
            if (!spot.getGallery().contains(imageUrl)) {
                spot.getGallery().add(imageUrl);
            }
            spotRepository.save(spot);
        });
    }

    // 解析或获取 resolveWikiImage 对应的数据
    private String resolveWikiImage(String name) {
        String imageUrl = resolveWikipediaSummaryImage(name);
        if (!imageUrl.isEmpty()) {
            return imageUrl;
        }
        imageUrl = resolveCommonsImage(name);
        if (!imageUrl.isEmpty()) {
            return imageUrl;
        }
        return bingThumbnailImage(name);
    }

    // 执行 bingThumbnailImage 方法对应的业务处理
    private String bingThumbnailImage(String name) {
        String query = UriUtils.encodeQueryParam(name + " 四川 景区 实景", StandardCharsets.UTF_8);
        return "https://tse1.mm.bing.net/th?q=" + query + "&w=1200&h=675&c=7&rs=1&p=0&o=5&pid=1.7";
    }

    // 解析或获取 resolveWikipediaSummaryImage 对应的数据
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

    // 解析或获取 resolveCommonsImage 对应的数据
    private String resolveCommonsImage(String name) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://commons.wikimedia.org/w/api.php")
                    .queryParam("action", "query")
                    .queryParam("generator", "search")
                    .queryParam("gsrsearch", name + " 景区")
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
                return "";
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
        } catch (Exception ignored) {
            return "";
        }
        return "";
    }

    // 查询并返回 getJson 对应的数据
    private JsonNode getJson(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, "TravelCloudMap/1.0 (scenic spot image resolver)");
        return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class).getBody();
    }

    // 执行 restTemplate 方法对应的业务处理
    private RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(2000);
        factory.setReadTimeout(2000);
        return new RestTemplate(factory);
    }

    // 执行 fallbackSvg 方法对应的业务处理
    private ResponseEntity<String> fallbackSvg(String name) {
        ScenicSpot spot = spotRepository.findByApprovedTrue().stream()
                .filter(item -> name.equals(item.getName()))
                .findFirst()
                .orElse(null);
        String type = spot == null ? "景点" : spot.getType();
        String address = spot == null ? "全国精选景点" : spot.getAddress();
        String highlight = spot == null ? "专属景点封面" : spot.getHighlights();
        if (highlight == null || highlight.length() > 28) {
            highlight = spot == null ? "专属景点封面" : spot.getGuide();
        }
        if (highlight == null || highlight.length() > 28) {
            highlight = "专属景点封面";
        }
        int titleSize = name.length() > 12 ? 48 : 68;
        String color = "自然风光".equals(type) ? "#11866f" : "历史人文".equals(type) ? "#0b5fb3" : "#1769aa";
        String lightColor = "自然风光".equals(type) ? "#e0f7ef" : "历史人文".equals(type) ? "#e2efff" : "#e1f4ff";
        String safeName = escapeXml(name);
        String safeType = escapeXml(type);
        String safeAddress = escapeXml(address);
        String safeHighlight = escapeXml(highlight);
        String body = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"675\" viewBox=\"0 0 1200 675\">"
                + "<defs><linearGradient id=\"g\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"1\">"
                + "<stop offset=\"0\" stop-color=\"" + lightColor + "\"/><stop offset=\"1\" stop-color=\"#ffffff\"/>"
                + "</linearGradient></defs><rect width=\"1200\" height=\"675\" fill=\"url(#g)\"/>"
                + "<circle cx=\"980\" cy=\"126\" r=\"116\" fill=\"#ffffff\" opacity=\"0.56\"/>"
                + "<path d=\"M0 512 C165 430 280 474 424 392 C570 308 706 385 852 300 C982 225 1084 258 1200 190 L1200 675 L0 675 Z\" fill=\"" + color + "\" opacity=\"0.16\"/>"
                + "<path d=\"M0 570 C220 495 300 530 478 470 C640 415 780 472 942 404 C1050 358 1128 376 1200 330 L1200 675 L0 675 Z\" fill=\"" + color + "\" opacity=\"0.24\"/>"
                + "<rect x=\"72\" y=\"82\" width=\"168\" height=\"46\" rx=\"23\" fill=\"" + color + "\" opacity=\"0.92\"/>"
                + "<text x=\"156\" y=\"114\" text-anchor=\"middle\" font-family=\"Microsoft YaHei, Arial\" font-size=\"25\" font-weight=\"700\" fill=\"#ffffff\">" + safeType + "</text>"
                + "<text x=\"72\" y=\"284\" font-family=\"Microsoft YaHei, Arial\" font-size=\"" + titleSize + "\" font-weight=\"900\" fill=\"" + color + "\">" + safeName + "</text>"
                + "<text x=\"76\" y=\"356\" font-family=\"Microsoft YaHei, Arial\" font-size=\"30\" fill=\"#18364f\">" + safeAddress + "</text>"
                + "<text x=\"76\" y=\"412\" font-family=\"Microsoft YaHei, Arial\" font-size=\"28\" fill=\"#34516a\">" + safeHighlight + "</text>"
                + "<text x=\"76\" y=\"588\" font-family=\"Microsoft YaHei, Arial\" font-size=\"24\" fill=\"#526b81\">陌路寻阡景点图库 · 与当前景点绑定</text>"
                + "</svg>";
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("image/svg+xml;charset=UTF-8"))
                .body(body);
    }

    // 执行 escapeXml 方法对应的业务处理
    private String escapeXml(String value) {
        return value == null ? "" : value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
