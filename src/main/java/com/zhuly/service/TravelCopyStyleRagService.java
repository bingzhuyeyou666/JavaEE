package com.zhuly.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelCopyStyleRagService {

    private static final Path CACHE_DIR = Paths.get("data", "travel-copy-rag");
    private static final Duration CACHE_TTL = Duration.ofDays(7);
    private static final Pattern HREF_PATTERN = Pattern.compile("href=\"(https?://[^\"]+)\"", Pattern.CASE_INSENSITIVE);
    private static final Pattern BING_REDIRECT_PATTERN = Pattern.compile("[?&]u=([^&]+)");
    private static final Pattern TAG_PATTERN = Pattern.compile("<[^>]+>");

    private final RestTemplateBuilder restTemplateBuilder;
    private final Map<String, List<String>> memoryCache = new LinkedHashMap<String, List<String>>();

    public List<String> retrieve(String requestedStyle, String place, String notes, int limit) {
        String style = normalizeStyle(requestedStyle);
        List<String> corpus = corpusForStyle(style);
        List<String> ranked = rank(corpus, place + " " + notes);
        return ranked.stream().limit(Math.max(1, limit)).collect(Collectors.toList());
    }

    public String buildPromptBlock(String requestedStyle, String place, String notes) {
        String style = normalizeStyle(requestedStyle);
        List<String> samples = retrieve(style, place, notes, 4);
        StringBuilder builder = new StringBuilder();
        builder.append("风格 RAG 参考语料（来自公开网页抓取和本地种子语料，仅学习表达结构，不要照抄原文）：\n");
        for (int i = 0; i < samples.size(); i++) {
            builder.append(i + 1).append(". ").append(samples.get(i)).append("\n");
        }
        builder.append("请强制贴近“").append(styleLabel(style)).append("”的句式、节奏、段落结构和标题方式，同时改写为用户自己的这次旅行。");
        return builder.toString();
    }

    private List<String> corpusForStyle(String style) {
        if (memoryCache.containsKey(style)) {
            return memoryCache.get(style);
        }
        List<String> corpus = readFreshCache(style);
        if (corpus.isEmpty()) {
            corpus = crawlStyle(style);
            writeCache(style, corpus);
        }
        if (corpus.isEmpty()) {
            corpus = seedCorpus(style);
        }
        memoryCache.put(style, corpus);
        return corpus;
    }

    private List<String> crawlStyle(String style) {
        List<String> result = new ArrayList<String>();
        RestTemplate restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(4))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
        for (String query : queriesForStyle(style)) {
            try {
                String searchUrl = "https://www.bing.com/search?q=" + java.net.URLEncoder.encode(query, "UTF-8");
                String html = restTemplate.getForObject(URI.create(searchUrl), String.class);
                for (String url : extractSearchUrls(html)) {
                    if (result.size() >= 20) {
                        break;
                    }
                    result.addAll(extractParagraphs(fetchPage(restTemplate, url)));
                }
            } catch (Exception ex) {
                log.debug("Travel copy RAG crawl failed for style {} query {}: {}", style, query, ex.getMessage());
            }
            if (result.size() >= 20) {
                break;
            }
        }
        List<String> cleaned = dedupe(result);
        if (cleaned.size() < 6) {
            cleaned.addAll(seedCorpus(style));
        }
        return dedupe(cleaned).stream().limit(40).collect(Collectors.toList());
    }

    private String fetchPage(RestTemplate restTemplate, String url) {
        try {
            return restTemplate.getForObject(URI.create(url), String.class);
        } catch (Exception ex) {
            return "";
        }
    }

    private List<String> extractSearchUrls(String html) {
        if (!StringUtils.hasText(html)) {
            return Collections.emptyList();
        }
        Set<String> urls = new LinkedHashSet<String>();
        Matcher matcher = HREF_PATTERN.matcher(html);
        while (matcher.find() && urls.size() < 8) {
            String url = decodeHtml(matcher.group(1));
            Matcher redirect = BING_REDIRECT_PATTERN.matcher(url);
            if (redirect.find()) {
                try {
                    url = new String(java.util.Base64.getUrlDecoder().decode(redirect.group(1)), StandardCharsets.UTF_8);
                } catch (Exception ignored) {
                    try {
                        url = URLDecoder.decode(redirect.group(1), "UTF-8");
                    } catch (Exception decodeEx) {
                        continue;
                    }
                }
            }
            if (isContentUrl(url)) {
                urls.add(url);
            }
        }
        return new ArrayList<String>(urls);
    }

    private boolean isContentUrl(String url) {
        String lower = url.toLowerCase(Locale.ROOT);
        return lower.startsWith("http")
                && !lower.contains("bing.com")
                && !lower.contains("microsoft.com")
                && !lower.contains("baidu.com")
                && !lower.endsWith(".jpg")
                && !lower.endsWith(".png")
                && !lower.endsWith(".gif");
    }

    private List<String> extractParagraphs(String html) {
        if (!StringUtils.hasText(html)) {
            return Collections.emptyList();
        }
        String text = html
                .replaceAll("(?is)<script.*?</script>", " ")
                .replaceAll("(?is)<style.*?</style>", " ")
                .replaceAll("(?is)<br\\s*/?>", "\n")
                .replaceAll("(?is)</p>|</div>|</li>|</h[1-6]>", "\n");
        text = TAG_PATTERN.matcher(text).replaceAll(" ");
        text = decodeHtml(text).replaceAll("[\\t\\x0B\\f\\r ]+", " ");
        List<String> paragraphs = new ArrayList<String>();
        for (String part : text.split("\\n+")) {
            String item = sanitize(part);
            if (isUsefulSample(item)) {
                paragraphs.add(item);
            }
        }
        return paragraphs;
    }

    private boolean isUsefulSample(String value) {
        if (!StringUtils.hasText(value)) {
            return false;
        }
        int length = value.length();
        if (length < 35 || length > 260) {
            return false;
        }
        if (!value.matches(".*[\\u4e00-\\u9fa5].*")) {
            return false;
        }
        String lower = value.toLowerCase(Locale.ROOT);
        return !lower.contains("javascript")
                && !lower.contains("cookie")
                && !value.contains("登录")
                && !value.contains("注册")
                && !value.contains("版权")
                && !value.contains("免责声明");
    }

    private List<String> rank(List<String> corpus, String query) {
        String normalizedQuery = sanitize(query);
        List<String> terms = Arrays.stream(normalizedQuery.split("[\\s,，。！？、]+"))
                .filter(StringUtils::hasText)
                .collect(Collectors.toList());
        return corpus.stream()
                .sorted((left, right) -> Integer.compare(score(right, terms), score(left, terms)))
                .collect(Collectors.toList());
    }

    private int score(String sample, List<String> terms) {
        int score = Math.min(80, sample.length() / 4);
        for (String term : terms) {
            if (term.length() >= 2 && sample.contains(term)) {
                score += 30;
            }
        }
        if (sample.contains("#")) {
            score += 12;
        }
        if (sample.matches(".*[。！？]\\s*[\\u4e00-\\u9fa5]{2,12}[。！？].*")) {
            score += 8;
        }
        return score;
    }

    private List<String> readFreshCache(String style) {
        Path file = cacheFile(style);
        try {
            if (!Files.exists(file) || Files.getLastModifiedTime(file).toInstant().isBefore(Instant.now().minus(CACHE_TTL))) {
                return Collections.emptyList();
            }
            return Files.readAllLines(file, StandardCharsets.UTF_8).stream()
                    .map(this::sanitize)
                    .filter(this::isUsefulSample)
                    .collect(Collectors.toList());
        } catch (IOException ex) {
            return Collections.emptyList();
        }
    }

    private void writeCache(String style, List<String> corpus) {
        try {
            Files.createDirectories(CACHE_DIR);
            Files.write(cacheFile(style), dedupe(corpus), StandardCharsets.UTF_8);
        } catch (IOException ex) {
            log.debug("Unable to write travel copy RAG cache: {}", ex.getMessage());
        }
    }

    private Path cacheFile(String style) {
        return CACHE_DIR.resolve(style + ".txt");
    }

    private List<String> dedupe(List<String> values) {
        LinkedHashSet<String> set = new LinkedHashSet<String>();
        for (String value : values) {
            String item = sanitize(value);
            if (isUsefulSample(item)) {
                set.add(item);
            }
        }
        return new ArrayList<String>(set);
    }

    private String sanitize(String value) {
        if (value == null) {
            return "";
        }
        return decodeHtml(value)
                .replaceAll("\\s+", " ")
                .replaceAll("[|_]{2,}", " ")
                .trim();
    }

    private String decodeHtml(String value) {
        return value == null ? "" : value
                .replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&quot;", "\"")
                .replace("&#39;", "'")
                .replace("&lt;", "<")
                .replace("&gt;", ">");
    }

    private List<String> queriesForStyle(String style) {
        if ("xiaohongshu".equals(style)) {
            return Arrays.asList("小红书 旅行 文案 种草 攻略", "小红书 城市漫步 文案 拍照 打卡", "小红书 古镇 夜景 旅行 文案");
        }
        if ("moments".equals(style)) {
            return Arrays.asList("朋友圈 旅行 随笔 文案", "朋友圈 出游 日常 文案", "旅行碎片 朋友圈 文案");
        }
        if ("poetic".equals(style)) {
            return Arrays.asList("诗意 旅行 散文 文案", "文艺 旅行 随笔 城市", "旅行 文学 随笔 风景");
        }
        return Arrays.asList("真实 游记 旅行 记录", "旅行攻略 游记 体验 记录", "城市漫步 游记 记录");
    }

    private List<String> seedCorpus(String style) {
        if ("xiaohongshu".equals(style)) {
            return Arrays.asList(
                    "救命，这个地方真的太适合慢慢逛了。路线不用排得很满，边走边拍反而更出片，傍晚亮灯后氛围直接拉满。",
                    "今天这趟属于越走越上头的那种。小巷、灯光、店铺和人声都刚刚好，随手停一下都像给旅行加了滤镜。",
                    "来之前没抱太大期待，结果现场比想象中更有层次。建议穿舒服的鞋，留够时间，别只冲一个打卡点。",
                    "适合喜欢城市漫步的人，节奏轻松，不需要做太复杂攻略。拍照点很多，但最好看的还是路上突然遇见的小细节。#旅行攻略 #周末去哪儿 #城市漫步"
            );
        }
        if ("moments".equals(style)) {
            return Arrays.asList(
                    "今天没有安排太多事情，就在这里慢慢走了一圈。风吹过来的时候，突然觉得这一趟出来得很值得。",
                    "本来只是想随便看看，结果待到天色暗下来才离开。有些地方不用多热闹，安安静静就很好。",
                    "走着走着心情就松了下来。没有特别宏大的瞬间，但路上的光、声音和一点点烟火气都让人舒服。",
                    "这次出门最喜欢的部分，反而是那些没有提前计划的小停留。慢一点，也挺好。"
            );
        }
        if ("poetic".equals(style)) {
            return Arrays.asList(
                    "风从街巷深处走来，把傍晚的光吹得很轻。行人、屋檐与远处的灯火，在同一刻慢慢安静下来。",
                    "我在这里停留，像停在一段被放慢的时间里。旧墙有旧墙的沉默，水声有水声的去处。",
                    "夜色一点点落下，城市把白日的喧哗收拢，只留下温柔的轮廓和脚步经过后的回声。",
                    "那些光影并不急着抵达哪里，只在转角、树梢和人的眼底短暂停靠。"
            );
        }
        return Arrays.asList(
                "这次行程没有安排得太紧，实际走下来节奏比较舒服。沿路能看到不少细节，适合边走边观察。",
                "到达后先沿主路走了一段，人流不算拥挤。光线、建筑和周边环境都比较有层次，停下来看看会更有意思。",
                "整体体验比预期安静一些。真正留下印象的不是单个打卡点，而是行走过程中不断出现的小景和生活气息。",
                "如果时间充裕，建议不要只看最热门的位置，可以往旁边的巷子或步道多走一段，感受会更完整。"
        );
    }

    private String normalizeStyle(String style) {
        String text = StringUtils.hasText(style) ? style.trim().toLowerCase(Locale.ROOT) : "";
        if (text.contains("小红书") || text.contains("xiaohongshu")) {
            return "xiaohongshu";
        }
        if (text.contains("朋友圈") || text.contains("moments")) {
            return "moments";
        }
        if (text.contains("诗意") || text.contains("文艺") || text.contains("poetic")) {
            return "poetic";
        }
        return "real";
    }

    private String styleLabel(String style) {
        if ("xiaohongshu".equals(style)) {
            return "小红书风格";
        }
        if ("moments".equals(style)) {
            return "朋友圈随笔";
        }
        if ("poetic".equals(style)) {
            return "诗意文艺";
        }
        return "真实游记";
    }
}
