package com.zhuly.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zhuly.domain.Facility;
import com.zhuly.domain.FacilityType;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.SpotAssistantResponse;
import com.zhuly.dto.TravelCopyResponse;
import com.zhuly.dto.WeatherForecast;
import com.zhuly.repository.FacilityRepository;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpotAssistantService {

    private final ScenicSpotRepository spotRepository;
    private final FacilityRepository facilityRepository;
    private final SpotKnowledgeBase knowledgeBase;
    private final WeatherService weatherService;
    private final TravelCopyStyleRagService travelCopyStyleRagService;
    private final RestTemplateBuilder restTemplateBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${travel.ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${travel.ai.api-key:}")
    private String apiKey;

    @Value("${travel.ai.base-url:https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions}")
    private String baseUrl;

    @Value("${travel.ai.model:qwen-plus}")
    private String model;

    @Value("${travel.ai.vision-model:qwen-vl-plus}")
    private String visionModel;

    @Value("${travel.ai.timeout-seconds:20}")
    private int timeoutSeconds;

    @Value("${travel.map.api-key:}")
    private String baiduMapAk;

    private static final String FEIBI_SYSTEM_PROMPT = String.join("\n",
            "你是智能生活助手“菲比”，性格友好、耐心、自然亲切。",
            "你能处理日常聊天，也能根据用户的位置和需求，协助附近场所搜索、路线规划、美食推荐、天气查询、路况查询和用户偏好记录。",
            "",
            "核心规则：",
            "1. 日常聊天直接自然回答，不主动索要位置，也不假装调用工具。回答要短一点，像真实助手在接话，不要背能力清单。",
            "2. 用户需要真实数据时，例如附近景点/餐馆/停车场/加油站、路线、美食推荐、天气、路况，必须先判断参数是否齐全。",
            "3. 必填参数齐全时，立即输出工具调用。不要为了可选参数继续追问；不要在 JSON 前后加解释、寒暄或 Markdown。",
            "4. 参数不齐时，用亲切口吻追问缺失信息，例如位置、类别、起点、终点、出行方式或日期。",
            "5. 参数齐全且问题需要真实数据时，不要编造地点、距离、评分、价格、营业时间、路况或天气。请输出单行 JSON 工具调用指令，格式为 {\"tool\":\"工具名\",\"params\":{...}}。",
            "6. 工具必填参数：search_places 需要 location/category；plan_route 需要 origin/destination；recommend_food 需要 location；get_weather 需要 location；get_traffic 需要 location；save_favorite 需要 type/value。",
            "7. 场所类别映射：景点 attraction，餐馆 restaurant，停车场 parking，加油站 gas_station，超市 supermarket，医院 hospital，酒店 hotel。",
            "8. 工具参数必须严格使用以下字段：",
            "search_places params: location, category, radius, keyword, limit。",
            "plan_route params: origin, destination, mode, departure_time。",
            "recommend_food params: location, cuisine, price_range, atmosphere, rating_min, limit。注意不要给 recommend_food 使用 category 字段。",
            "get_weather params: location, days。",
            "get_traffic params: location, time。",
            "save_favorite params: type, value。",
            "9. 用户明确表达偏好时，不要转成推荐请求，不要追问位置，必须只输出 save_favorite 调用。删除偏好时也使用 save_favorite，并在 value 中清楚标记删除意图。例如“我喜欢吃辣”输出 {\"tool\":\"save_favorite\",\"params\":{\"type\":\"cuisine\",\"value\":\"喜欢吃辣\"}}。",
            "10. 如果当前系统暂时不能执行某类工具，仍要先遵守不编造真实数据的规则；能用常识回答的部分可以说明边界后给出建议。",
            "11. 工具返回结果后，要把数据整理成口语化中文，可用简短列表，并在结尾自然询问是否需要下一步帮助。",
            "12. 不提供医疗、法律、金融建议；不讨论政治、色情、暴力。",
            "",
            "表达风格：",
            "像一个真的生活助手在聊天，少说套话；先接住用户已经给出的信息，再给出下一步。不要反复说“我在呢、随时准备、我可以帮你找地方查天气规划路线”。",
            "语气温柔、清楚、不过度热情。不要使用 emoji 或表情包符号，例如笑脸、餐具、汽车、太阳、雨伞、爱心、火焰等彩色符号。",
            "颜文字只在特别适合时少量使用，不要每句话都用。可用例如 (＾▽＾)、(｡･ω･｡)、(￣▽￣)。",
            "不要说“根据系统规则”“作为AI模型”这类生硬表述。");

    public TravelCopyResponse generateTravelCopy(String locationName,
                                                 String tripDate,
                                                 String companions,
                                                 String style,
                                                 String length,
                                                 String notes,
                                                 MultipartFile[] images) throws java.io.IOException {
        if (!aiEnabled || !StringUtils.hasText(apiKey)) {
            throw new IllegalStateException("AI vision service is not configured");
        }
        String prompt = buildTravelCopyPrompt(locationName, tripDate, companions, style, length, notes);
        String raw = askVisionModel(prompt, images);
        TravelCopyResponse response = parseTravelCopy(raw);
        response.setSource("aliyun-bailian-vision");
        return response;
    }

    private String buildTravelCopyPrompt(String locationName,
                                         String tripDate,
                                         String companions,
                                         String style,
                                         String length,
                                         String notes) {
        String place = StringUtils.hasText(locationName) ? locationName.trim() : "这次旅行地";
        String styleText = safePromptText(style, "真实游记");
        String styleRagBlock = travelCopyStyleRagService.buildPromptBlock(styleText, place, notes);
        return String.join("\n",
                "任务：根据用户上传的旅行照片理解他去过的地方和现场景色，写一篇可以直接发布的中文旅行文案。",
                "地点：" + place,
                "出行日期：" + safePromptText(tripDate, "未填写"),
                "同行人：" + safePromptText(companions, "未填写"),
                "文案风格：" + styleText,
                "长度：" + safePromptText(length, "标准"),
                "用户补充：" + safePromptText(notes, "无"),
                "",
                styleRagBlock,
                "",
                "必须遵守：",
                "1. 照片只用于识别景色、环境、氛围和旅行现场，正文写的是这次旅行，不是写照片。",
                "2. 正文绝对不要出现“图片、照片、画面、镜头、上传、AI、模型、生成、标签”这些词。",
                "3. 不要写字段说明，不要解释创作过程，不要出现“以下是文案”之类提示语。",
                "4. 默认使用第一人称写法，像真实旅行者自己发出的内容，要有到达、行走、停留和感受。",
                "5. 如果同行人是自己、一个人、独自、单人，要理解为独自出行，不要写“适合自己一起走”。",
                "6. 不要编造精确门票、营业时间、交通班次、价格、距离；用户补充了才可以写。",
                "7. 必须综合所有上传图片理解旅行现场，多张图分别代表不同景色或场景时，正文要自然覆盖这些景色，不能只写第一张。",
                "8. 风格差异必须非常明显，不能只是换几个词。",
                "9. 如果风格是“真实游记”：语气平实、客观、细节感强，像真实出行记录。可以写环境、声音、光线、路感和停留时的观察，不要浮夸。",
                "10. 如果风格是“小红书风格”：标题要更抓眼；正文必须使用短句、分段明显、至少4个自然融入的emoji；要有明显情绪种草感和轻互动语气；结尾必须带3到5个#话题标签；整体像可直接发布的小红书文案，不要写成长篇散文。",
                "11. 如果风格是“朋友圈随笔”：口语化、私人感受、短段落，像随手发的动态，不要太营销，不要太工整。",
                "12. 如果风格是“诗意文艺”：意象化、抒情、节奏舒缓，要有留白感和文学感，但不要堆砌生僻词。",
                "13. 必须显式拉开不同风格的结构差异：真实游记像记录，朋友圈像随手动态，小红书像种草笔记，诗意文艺像短散文。",
                "14. 返回严格 JSON：{\"title\":\"标题\",\"content\":\"正文自然分段\",\"tags\":[\"标签1\",\"标签2\"],\"category\":\"景点影像\",\"postType\":\"NOTE\"}");
    }

    private String askVisionModel(String userPrompt, MultipartFile[] images) throws java.io.IOException {
        RestTemplate restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(Math.max(3, timeoutSeconds)))
                .setReadTimeout(Duration.ofSeconds(Math.max(8, timeoutSeconds)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        List<Map<String, Object>> content = new ArrayList<Map<String, Object>>();
        Map<String, Object> textPart = new LinkedHashMap<String, Object>();
        textPart.put("type", "text");
        textPart.put("text", userPrompt);
        content.add(textPart);
        if (images != null) {
            int count = 0;
            for (MultipartFile image : images) {
                if (image == null || image.isEmpty() || count >= 4) {
                    continue;
                }
                String contentType = StringUtils.hasText(image.getContentType()) ? image.getContentType() : "image/jpeg";
                if (!contentType.startsWith("image/")) {
                    continue;
                }
                Map<String, Object> imageUrl = new LinkedHashMap<String, Object>();
                imageUrl.put("url", "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(image.getBytes()));
                Map<String, Object> imagePart = new LinkedHashMap<String, Object>();
                imagePart.put("type", "image_url");
                imagePart.put("image_url", imageUrl);
                content.add(imagePart);
                count++;
            }
        }

        Map<String, Object> system = new LinkedHashMap<String, Object>();
        system.put("role", "system");
        system.put("content", "你是中文旅行内容编辑。只返回严格 JSON，不要 Markdown。");
        Map<String, Object> user = new LinkedHashMap<String, Object>();
        user.put("role", "user");
        user.put("content", content);

        Map<String, Object> body = new HashMap<String, Object>();
        body.put("model", StringUtils.hasText(visionModel) ? visionModel : model);
        body.put("temperature", 0.78);
        body.put("max_tokens", 1200);
        body.put("messages", Arrays.asList(system, user));

        ResponseEntity<JsonNode> response = restTemplate.postForEntity(baseUrl, new HttpEntity<Map<String, Object>>(body, headers), JsonNode.class);
        JsonNode contentNode = response.getBody() == null ? null : response.getBody().at("/choices/0/message/content");
        if (contentNode == null || contentNode.isMissingNode() || !StringUtils.hasText(contentNode.asText())) {
            throw new IllegalStateException("Vision model returned empty content");
        }
        return contentNode.asText().trim();
    }

    private TravelCopyResponse parseTravelCopy(String raw) throws java.io.IOException {
        String json = raw == null ? "" : raw.trim();
        if (json.startsWith("```")) {
            json = json.replaceAll("^```[a-zA-Z]*\\s*", "").replaceAll("\\s*```$", "").trim();
        }
        int start = json.indexOf('{');
        int end = json.lastIndexOf('}');
        if (start >= 0 && end > start) {
            json = json.substring(start, end + 1);
        }
        JsonNode root = objectMapper.readTree(json);
        TravelCopyResponse response = new TravelCopyResponse();
        response.setTitle(cleanGeneratedCopy(root.path("title").asText("旅行记录")));
        response.setContent(cleanGeneratedCopy(root.path("content").asText("")));
        List<String> tags = new ArrayList<String>();
        JsonNode tagNode = root.path("tags");
        if (tagNode.isArray()) {
            for (JsonNode item : tagNode) {
                String tag = cleanGeneratedCopy(item.asText(""));
                if (StringUtils.hasText(tag)) {
                    tags.add(tag);
                }
            }
        }
        response.setTags(tags);
        response.setCategory(StringUtils.hasText(root.path("category").asText("")) ? root.path("category").asText() : "景点影像");
        response.setPostType(StringUtils.hasText(root.path("postType").asText("")) ? root.path("postType").asText() : "NOTE");
        return response;
    }

    private String cleanGeneratedCopy(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("图片", "")
                .replace("照片", "")
                .replace("画面", "风景")
                .replace("镜头", "眼前")
                .replace("AI", "")
                .replace("标签：", "")
                .replace("标签:", "")
                .trim();
    }

    private String safePromptText(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim() : fallback;
    }

    public SpotAssistantResponse answer(Long spotId, String question) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        List<String> hits = knowledgeBase.search(spot, question);
        String source = "local-knowledge-base";
        String answer = buildAnswer(spot, question, hits);
        if (aiEnabled && StringUtils.hasText(apiKey)) {
            try {
                answer = askBailian(FEIBI_SYSTEM_PROMPT, buildSpotPrompt(spot, question, hits));
                source = "aliyun-bailian";
            } catch (Exception ex) {
                log.warn("Aliyun Bailian assistant call failed, falling back to local answer: {}", ex.getMessage());
            }
        }
        return new SpotAssistantResponse(answer, hits, webSuggestions(spot, question),
                source, "aliyun-bailian".equals(source) ? model : "local");
    }

    public SpotAssistantResponse answerGeneral(String question) {
        String source = "local-assistant";
        String answer = buildGeneralFallback(question);
        String localAnswer = answerFromLocalIntent(question);
        if (StringUtils.hasText(localAnswer)) {
            return new SpotAssistantResponse(localAnswer, Arrays.asList(), Arrays.asList(), source, "local");
        }
        if (aiEnabled && StringUtils.hasText(apiKey)) {
            try {
                answer = askBailian(FEIBI_SYSTEM_PROMPT, buildGeneralPrompt(question));
                answer = executeSupportedTool(answer);
                source = "aliyun-bailian";
            } catch (Exception ex) {
                log.warn("Aliyun Bailian general assistant call failed, falling back to local answer: {}", ex.getMessage());
            }
        }
        return new SpotAssistantResponse(answer, Arrays.asList(), Arrays.asList(),
                source, "aliyun-bailian".equals(source) ? model : "local");
    }

    private String askBailian(String systemPrompt, String userPrompt) {
        RestTemplate restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(Math.max(3, timeoutSeconds)))
                .setReadTimeout(Duration.ofSeconds(Math.max(5, timeoutSeconds)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("temperature", 0.2);
        body.put("max_tokens", 900);
        body.put("messages", Arrays.asList(
                message("system", systemPrompt),
                message("user", userPrompt)
        ));

        ResponseEntity<JsonNode> response = restTemplate.postForEntity(baseUrl, new HttpEntity<>(body, headers), JsonNode.class);
        JsonNode content = response.getBody() == null ? null : response.getBody().at("/choices/0/message/content");
        if (content == null || content.isMissingNode() || !StringUtils.hasText(content.asText())) {
            throw new IllegalStateException("百炼未返回有效回答");
        }
        return sanitizeAssistantText(content.asText().trim());
    }

    private Map<String, String> message(String role, String content) {
        Map<String, String> message = new HashMap<>();
        message.put("role", role);
        message.put("content", content);
        return message;
    }

    private String buildSpotPrompt(ScenicSpot spot, String question, List<String> hits) {
        StringBuilder builder = new StringBuilder();
        builder.append("当前场景：用户正在陌路寻阡的景点详情页咨询菲比。\n");
        builder.append("如果问题只涉及下列景点资料，请直接自然回答；如果用户询问附近搜索、实时天气、实时路况、外部餐厅或跨地点路线等真实数据，请按工具规则输出 JSON 或追问缺失参数。\n\n");
        builder.append("景点资料：\n");
        builder.append("名称：").append(spot.getName()).append("\n");
        builder.append("类型：").append(spot.getType()).append("\n");
        builder.append("地址：").append(spot.getAddress()).append("\n");
        builder.append("开放时间：").append(spot.getOpenHours()).append("\n");
        builder.append("门票：").append(spot.getPrice().signum() == 0 ? "免费" : spot.getPrice() + "元").append("\n");
        builder.append("评分：").append(spot.getRating()).append("\n");
        builder.append("介绍：").append(spot.getDescription()).append("\n");
        builder.append("攻略：").append(spot.getGuide()).append("\n");
        builder.append("历史：").append(spot.getHistory()).append("\n");
        builder.append("亮点：").append(spot.getHighlights()).append("\n");
        builder.append("最佳季节：").append(spot.getBestSeason()).append("\n");
        builder.append("注意事项：").append(spot.getNotice()).append("\n\n");
        builder.append("知识库命中片段：\n");
        for (int i = 0; i < hits.size(); i++) {
            builder.append(i + 1).append(". ").append(hits.get(i)).append("\n");
        }
        builder.append("\n用户问题：").append(question);
        return builder.toString();
    }

    private String buildGeneralPrompt(String question) {
        return "当前场景：用户正在陌路寻阡应用内和菲比对话。\n"
                + "请根据菲比角色规则判断：闲聊直接回答；需要真实数据且参数齐全时输出单行 JSON 工具调用；参数不足时自然追问；不能编造真实地点、距离、评分、天气或路况。\n\n"
                + "如果用户问题里包含“当前定位：纬度,经度”，附近搜索、美食推荐、停车场等周边请求必须直接使用这组坐标作为 location，不要再追问位置。\n\n"
                + "注意区分意图：用户只是说“我想去某地”“想看看某地”时，只确认地点并询问是否需要规划；只有用户明确说“规划路线”“导航”“怎么走”“怎么去”“带我去”时，才可以使用 plan_route。\n\n"
                + "用户问题：" + question;
    }

    private String buildAnswer(ScenicSpot spot, String question, List<String> hits) {
        StringBuilder builder = new StringBuilder();
        builder.append("关于“").append(spot.getName()).append("”，我结合当前景点知识库为你整理如下：\n\n");
        if (question.contains("历史") || question.contains("发展") || question.contains("成立")) {
            builder.append("它的发展脉络可以重点看这段：").append(spot.getHistory()).append("\n\n");
        } else if (question.contains("怎么玩") || question.contains("攻略") || question.contains("路线")) {
            builder.append("推荐玩法：").append(spot.getGuide()).append(" 重点体验：").append(spot.getHighlights()).append("\n\n");
        } else if (question.contains("季节") || question.contains("什么时候")) {
            builder.append("比较推荐的季节是：").append(spot.getBestSeason()).append("。").append(spot.getNotice()).append("\n\n");
        } else {
            builder.append(spot.getDescription()).append("\n\n");
        }
        builder.append("知识库命中要点：\n");
        for (int i = 0; i < hits.size(); i++) {
            builder.append(i + 1).append(". ").append(hits.get(i)).append("\n");
        }
        builder.append("\n如果接入真实大模型，可以把这些知识库片段作为上下文，再让模型生成更自然的回答。");
        return builder.toString();
    }

    private String answerFromLocalIntent(String question) {
        String currentInput = extractCurrentInput(question);
        if (!StringUtils.hasText(currentInput)) {
            return "";
        }
        if (isSimpleGreeting(currentInput)) {
            return "你好，我在。你直接说想去哪儿，或者想查什么就行。";
        }
        String foodAnswer = answerFoodIntentWithContext(question, currentInput);
        if (StringUtils.hasText(foodAnswer)) {
            return foodAnswer;
        }
        if (isDirectDestinationIntent(currentInput)) {
            PlaceTarget target = findPlaceTarget(currentInput);
            if (target != null) {
                LocationPoint origin = extractCurrentLocation(question);
                return destinationAnswer(target, origin, isRoutePlanningIntent(currentInput));
            }
        }
        return "";
    }

    private String answerFoodIntentWithContext(String question, String currentInput) {
        String foodKeyword = extractFoodKeyword(currentInput);
        List<String> recentUserInputs = extractRecentUserInputs(question);
        if (!StringUtils.hasText(foodKeyword) && isLocationSupplement(currentInput)) {
            for (int i = recentUserInputs.size() - 1; i >= 0; i--) {
                String previousFoodKeyword = extractFoodKeyword(recentUserInputs.get(i));
                if (StringUtils.hasText(previousFoodKeyword)) {
                    foodKeyword = previousFoodKeyword;
                    break;
                }
            }
        }
        if (!StringUtils.hasText(foodKeyword)) {
            return "";
        }

        LocationPoint point = extractCurrentLocation(question);
        List<Facility> restaurants = nearbyFacilities(point, FacilityType.RESTAURANT, foodKeyword, 3);
        if (restaurants.isEmpty() && "李庄白肉".equals(foodKeyword)) {
            restaurants = nearbyFacilities(point, FacilityType.RESTAURANT, "白肉", 3);
        }
        if (restaurants.isEmpty()) {
            return "我接住了，你想吃“" + foodKeyword + "”。不过项目数据里暂时没找到对应餐馆。你可以换个菜名，或者告诉我更具体的位置，我再帮你缩小范围。";
        }

        String title = "懂了，你想吃“" + foodKeyword + "”。我按这个给你找：";
        String answer = facilitiesAnswer(restaurants, point, title, "我暂时没在项目数据里找到合适餐馆。");
        if (point == null) {
            answer += "\n如果要我直接打开导航，需要先拿到你的当前位置。";
        }
        return answer;
    }

    private List<String> extractRecentUserInputs(String question) {
        List<String> inputs = new ArrayList<>();
        if (!StringUtils.hasText(question)) {
            return inputs;
        }
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("用户：([^\\n]+)")
                .matcher(question);
        while (matcher.find()) {
            String text = matcher.group(1).trim();
            if (StringUtils.hasText(text)) {
                inputs.add(text);
            }
        }
        return inputs;
    }

    private boolean isLocationSupplement(String text) {
        if (!StringUtils.hasText(text)) {
            return false;
        }
        String normalized = text.replace(" ", "").trim();
        return normalized.matches(".*(我在|我就在|就在|本地|当地|宜宾|成都|重庆|北京|上海|广州|深圳|杭州|南京|武汉|西安|长沙|苏州).*");
    }

    private String extractFoodKeyword(String text) {
        if (!StringUtils.hasText(text)) {
            return "";
        }
        String normalized = text.replace(" ", "").trim();
        List<String> knownFoods = Arrays.asList(
                "李庄白肉", "白肉", "火锅", "川菜", "小吃", "烧烤", "串串", "面", "米线", "粤菜", "日料", "湘菜", "杭帮菜"
        );
        for (String food : knownFoods) {
            if (normalized.contains(food)) {
                return "白肉".equals(food) ? "李庄白肉" : food;
            }
        }
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("(?:想吃|想尝尝|想找|吃点|吃些)([^，。！？?\\n]{1,12})")
                .matcher(normalized);
        if (!matcher.find()) {
            return "";
        }
        String keyword = matcher.group(1)
                .replace("附近", "")
                .replace("本地", "")
                .replace("当地", "")
                .replace("一点", "")
                .replace("一些", "")
                .replace("的", "")
                .trim();
        return StringUtils.hasText(keyword) ? keyword : "";
    }

    private String extractCurrentInput(String question) {
        if (!StringUtils.hasText(question)) {
            return "";
        }
        String marker = "用户当前输入：";
        int markerIndex = question.lastIndexOf(marker);
        if (markerIndex >= 0) {
            return question.substring(markerIndex + marker.length()).trim();
        }
        return question.trim();
    }

    private boolean isSimpleGreeting(String text) {
        String normalized = text.trim().toLowerCase();
        return normalized.matches("^(你好|您好|嗨|hi|hello|在吗|菲比)$");
    }

    private boolean isDirectDestinationIntent(String text) {
        return text.contains("我想去")
                || text.contains("想去")
                || text.contains("规划路线")
                || text.contains("带我去")
                || text.contains("导航到")
                || text.contains("去一下")
                || text.contains("怎么去")
                || text.contains("怎么走");
    }

    private boolean isRoutePlanningIntent(String text) {
        return text.contains("规划路线")
                || text.contains("帮我规划")
                || text.contains("路线")
                || text.contains("导航")
                || text.contains("怎么去")
                || text.contains("怎么走")
                || text.contains("带我去");
    }

    private LocationPoint extractCurrentLocation(String question) {
        if (!StringUtils.hasText(question)) {
            return null;
        }
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("当前定位：\\s*(-?\\d+(?:\\.\\d+)?),\\s*(-?\\d+(?:\\.\\d+)?)")
                .matcher(question);
        if (!matcher.find()) {
            return null;
        }
        try {
            return new LocationPoint(new BigDecimal(matcher.group(1)), new BigDecimal(matcher.group(2)));
        } catch (Exception ex) {
            return null;
        }
    }

    private String destinationAnswer(PlaceTarget target, LocationPoint origin, boolean shouldOpenRoute) {
        StringBuilder builder = new StringBuilder();
        builder.append("李庄古镇".equals(target.name) ? "李庄古镇我找到了。" : "我找到了“" + target.name + "”。");
        if (StringUtils.hasText(target.address)) {
            builder.append(" 地址：").append(target.address).append("。");
        }
        if (!shouldOpenRoute) {
            builder.append("\n你要是确定过去，就跟我说“帮我规划路线”，我再帮你打开百度地图。");
            return builder.toString();
        }
        if (origin != null && target.lat != null && target.lng != null) {
            double distance = GeoUtils.distanceKm(origin.lat, origin.lng, target.lat, target.lng);
            builder.append("\n从你当前位置过去，直线距离约").append(Math.round(distance * 10.0) / 10.0).append("公里。");
            String navUrl = baiduDirectionUrl(origin, target, "drive");
            if (StringUtils.hasText(navUrl)) {
                builder.append("\n我先帮你打开百度地图导航：").append(navUrl);
            }
        } else {
            builder.append("\n要我帮你导航过去的话，需要先拿到你的当前位置。");
        }
        return builder.toString();
    }

    private String buildGeneralFallback(String question) {
        if (question == null || !StringUtils.hasText(question.trim())) {
            return "我在呢。你可以直接告诉我想去哪儿、想吃什么，或者只是随便聊两句也可以 (＾▽＾)";
        }
        String normalized = question.trim();
        if (needsLocationData(normalized)) {
            return "这个需要实时数据才靠谱。我不想随便编地点或距离，你把位置说具体一点，比如“我在成都宽窄巷子，附近想吃火锅”，我就能继续帮你查。";
        }
        if (mentionsPreference(normalized)) {
            return "我记下这个偏好啦。之后给你推荐时，我会尽量按这个方向来。";
        }
        return "收到，我在。你可以再多说一点你的场景，比如现在的位置、想去的地方、预算或口味，我会帮你把下一步理清楚。";
    }

    private String sanitizeAssistantText(String answer) {
        if (!StringUtils.hasText(answer)) {
            return answer;
        }
        return answer
                .replaceAll("[\\x{1F300}-\\x{1FAFF}\\x{2600}-\\x{27BF}]+", "(＾▽＾)")
                .replaceAll("(\\(＾▽＾\\)\\s*){2,}", "(＾▽＾) ")
                .trim();
    }

    private String executeSupportedTool(String answer) {
        if (!StringUtils.hasText(answer)) {
            return answer;
        }
        try {
            String json = extractToolJson(answer);
            if (!StringUtils.hasText(json)) {
                return answer;
            }
            JsonNode root = objectMapper.readTree(json);
            String tool = root.path("tool").asText("");
            JsonNode params = root.path("params");
            if ("get_weather".equals(tool)) {
                return getWeatherAnswer(params);
            }
            if ("search_places".equals(tool)) {
                return searchPlacesAnswer(params);
            }
            if ("recommend_food".equals(tool)) {
                return recommendFoodAnswer(params);
            }
            if ("plan_route".equals(tool)) {
                return planRouteAnswer(params);
            }
            if ("save_favorite".equals(tool)) {
                return "我记下啦。后面给你推荐时，我会尽量按这个偏好来。";
            }
            if ("get_traffic".equals(tool)) {
                return "实时路况这个能力我这边暂时还没接到可用的数据源。你可以告诉我道路名或区域，我先帮你整理出行建议；如果要实时拥堵情况，建议同时打开地图导航确认。";
            }
            return "这个查询需要外部实时数据，但当前项目还没有接上对应工具。我不会随便编结果；你可以换成查天气、附近景点、附近餐馆或路线规划，我可以继续帮你处理。";
        } catch (Exception ex) {
            return "这个请求需要实时数据，但刚刚解析时出了点问题。我不会把内部指令直接展示给你；你可以换个更具体的说法，我再帮你查。";
        }
    }

    private String extractToolJson(String answer) {
        String text = answer.trim();
        int toolIndex = text.indexOf("\"tool\"");
        if (toolIndex < 0) {
            return "";
        }
        int start = text.lastIndexOf('{', toolIndex);
        if (start < 0) {
            return "";
        }
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;
        for (int i = start; i < text.length(); i++) {
            char ch = text.charAt(i);
            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch == '\\') {
                escaped = true;
                continue;
            }
            if (ch == '"') {
                inString = !inString;
                continue;
            }
            if (inString) {
                continue;
            }
            if (ch == '{') {
                depth++;
            } else if (ch == '}') {
                depth--;
                if (depth == 0) {
                    return text.substring(start, i + 1);
                }
            }
        }
        return "";
    }

    private String searchPlacesAnswer(JsonNode params) {
        String location = params.path("location").asText("");
        String category = params.path("category").asText("");
        int limit = Math.max(1, Math.min(8, params.path("limit").asInt(5)));
        LocationPoint point = parseLocationPoint(location);
        if ("attraction".equals(category)) {
            List<ScenicSpot> spots = spotRepository.findByApprovedTrue().stream()
                    .sorted(Comparator.comparingDouble(spot -> distanceOrLarge(point, spot.getLatitude(), spot.getLongitude())))
                    .limit(limit)
                    .collect(Collectors.toList());
            if (!spots.isEmpty()) {
                StringBuilder builder = new StringBuilder();
                builder.append("我帮你找了附近比较适合去的景点：\n");
                for (int i = 0; i < spots.size(); i++) {
                    ScenicSpot spot = spots.get(i);
                    builder.append(i + 1).append(". ").append(spot.getName());
                    appendDistance(builder, point, spot.getLatitude(), spot.getLongitude());
                    builder.append("，").append(safeText(spot.getType(), "景点"));
                    if (StringUtils.hasText(spot.getAddress())) {
                        builder.append("，地址：").append(spot.getAddress());
                    }
                    builder.append("\n");
                }
                builder.append("想去其中哪一个？我可以继续帮你看路线。");
                return builder.toString().trim();
            }
        }
        FacilityType type = facilityTypeForCategory(category);
        if (type != null) {
            List<Facility> facilities = nearbyFacilities(point, type, "", limit);
            return facilitiesAnswer(facilities, point, "附近这些地方可以看看：", "暂时没在项目数据里找到匹配地点。你可以换个关键词，或者告诉我更具体的位置。");
        }
        return "这个类别我暂时没法直接查到。你可以换成景点、餐馆、停车场这类我能识别的地点。";
    }

    private String recommendFoodAnswer(JsonNode params) {
        String location = params.path("location").asText("");
        String cuisine = params.path("cuisine").asText("");
        int limit = Math.max(1, Math.min(8, params.path("limit").asInt(5)));
        LocationPoint point = parseLocationPoint(location);
        List<Facility> restaurants = nearbyFacilities(point, FacilityType.RESTAURANT, cuisine, limit);
        if (!restaurants.isEmpty()) {
            return facilitiesAnswer(restaurants, point, "我帮你筛了几家附近能吃饭的地方：", "暂时没在项目数据里找到合适餐馆。");
        }
        return "我暂时没在项目数据里找到合适的餐馆。你可以告诉我更具体的位置或口味，我再换个方式帮你找。";
    }

    private String planRouteAnswer(JsonNode params) {
        String origin = params.path("origin").asText("");
        String destination = params.path("destination").asText("");
        String mode = params.path("mode").asText("drive");
        LocationPoint originPoint = parseLocationPoint(origin);
        PlaceTarget target = findPlaceTarget(destination);
        if (target == null) {
            return "我还没锁定你要去的具体地点。你可以直接告诉我店名或景点名，我再帮你规划过去。";
        }
        StringBuilder builder = new StringBuilder();
        builder.append("可以，我先帮你整理到“").append(target.name).append("”的出行信息：\n");
        if (originPoint != null && target.lat != null && target.lng != null) {
            double distance = GeoUtils.distanceKm(originPoint.lat, originPoint.lng, target.lat, target.lng);
            builder.append("距离：直线约").append(Math.round(distance * 10.0) / 10.0).append("公里\n");
        }
        if (StringUtils.hasText(target.address)) {
            builder.append("地址：").append(target.address).append("\n");
        }
        String navUrl = baiduDirectionUrl(originPoint, target, mode);
        if (StringUtils.hasText(navUrl)) {
            builder.append("你可以打开百度导航：").append(navUrl).append("\n");
        }
        builder.append("如果你想，我也可以继续帮你换成步行、驾车或骑行方案。");
        return builder.toString().trim();
    }

    private List<Facility> nearbyFacilities(LocationPoint point, FacilityType type, String cuisine, int limit) {
        return facilityRepository.findAll().stream()
                .filter(facility -> facility.getType() == type)
                .filter(facility -> !StringUtils.hasText(cuisine)
                        || containsText(facility.getCuisine(), cuisine)
                        || containsText(facility.getName(), cuisine))
                .sorted(Comparator
                        .comparingDouble((Facility facility) -> distanceOrLarge(point, facility.getLatitude(), facility.getLongitude()))
                        .thenComparing(Comparator.comparingDouble(Facility::getRating).reversed()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private String facilitiesAnswer(List<Facility> facilities, LocationPoint point, String title, String emptyText) {
        if (facilities.isEmpty()) {
            return emptyText;
        }
        StringBuilder builder = new StringBuilder(title).append("\n");
        for (int i = 0; i < facilities.size(); i++) {
            Facility facility = facilities.get(i);
            builder.append(i + 1).append(". ").append(facility.getName());
            appendDistance(builder, point, facility.getLatitude(), facility.getLongitude());
            if (StringUtils.hasText(facility.getCuisine())) {
                builder.append("，").append(facility.getCuisine());
            }
            if (facility.getAverageCost() != null) {
                builder.append("，人均约").append(facility.getAverageCost()).append("元");
            }
            if (StringUtils.hasText(facility.getAddress())) {
                builder.append("，地址：").append(facility.getAddress());
            }
            builder.append("\n");
        }
        builder.append("要不要我继续帮你规划到其中一家？");
        return builder.toString().trim();
    }

    private FacilityType facilityTypeForCategory(String category) {
        if ("restaurant".equals(category)) {
            return FacilityType.RESTAURANT;
        }
        if ("parking".equals(category)) {
            return FacilityType.PARKING;
        }
        return null;
    }

    private PlaceTarget findPlaceTarget(String destination) {
        if (!StringUtils.hasText(destination)) {
            return null;
        }
        String normalized = normalizePlaceName(destination);
        List<Facility> facilities = facilityRepository.findAll();
        for (Facility facility : facilities) {
            if (placeNameMatches(normalized, facility.getName())) {
                return new PlaceTarget(facility.getName(), facility.getAddress(), facility.getLatitude(), facility.getLongitude());
            }
        }
        List<ScenicSpot> spots = spotRepository.findByApprovedTrue();
        for (ScenicSpot spot : spots) {
            if (placeNameMatches(normalized, spot.getName())) {
                return new PlaceTarget(spot.getName(), spot.getAddress(), spot.getLatitude(), spot.getLongitude());
            }
        }
        return null;
    }

    private boolean placeNameMatches(String query, String name) {
        if (!StringUtils.hasText(query) || !StringUtils.hasText(name)) {
            return false;
        }
        String normalizedName = normalizePlaceName(name);
        return query.contains(normalizedName) || normalizedName.contains(query);
    }

    private String normalizePlaceName(String value) {
        return value == null ? "" : value
                .replace("帮我规划路线到", "")
                .replace("规划路线到", "")
                .replace("帮我规划", "")
                .replace("规划路线", "")
                .replace("路线到", "")
                .replace("导航到", "")
                .replace("带我去", "")
                .replace("我想去", "")
                .replace("想去", "")
                .replace("怎么去", "")
                .replace("怎么走", "")
                .replace("附近", "")
                .replace("这里", "")
                .replace("那边", "")
                .replace("去", "")
                .replaceAll("\\s+", "")
                .trim();
    }

    private String baiduDirectionUrl(LocationPoint origin, PlaceTarget target, String mode) {
        if (origin == null || target == null || target.lat == null || target.lng == null) {
            return "";
        }
        String baiduMode = "walk".equals(mode) ? "walking" : "bike".equals(mode) ? "riding" : "transit".equals(mode) ? "transit" : "driving";
        return "https://api.map.baidu.com/direction?origin="
                + origin.lat + "," + origin.lng
                + "&destination=" + target.lat + "," + target.lng
                + "&mode=" + baiduMode
                + "&region=全国&output=html";
    }

    private String getWeatherAnswer(JsonNode params) {
        String location = params.path("location").asText("");
        int days = Math.max(0, Math.min(3, params.path("days").asInt(0)));
        if (!StringUtils.hasText(location)) {
            return "你想查哪里的天气呀？告诉我城市或具体地点，我就帮你看。";
        }
        try {
            String districtId = districtIdForWeather(location);
            List<WeatherForecast> forecasts;
            if (StringUtils.hasText(districtId)) {
                forecasts = weatherService.threeDaysByDistrictId(districtId);
            } else {
                BigDecimal[] point = geocode(location);
                forecasts = weatherService.threeDays(point[0], point[1]);
            }
            if (forecasts.isEmpty()) {
                return "我暂时没查到“" + location + "”的天气。你可以换成更具体的城市名或区县名再试试。";
            }
            WeatherForecast item = pickWeatherForecast(forecasts, days);
            String dayLabel = days == 0 ? "今天" : days == 1 ? "明天" : days + "天后";
            StringBuilder builder = new StringBuilder();
            builder.append("我帮你查到").append(location).append(dayLabel).append("的天气啦：\n");
            builder.append("天气：").append(safeText(item.getCondition(), "--")).append("\n");
            builder.append("温度：").append(safeText(item.getTemperature(), "--")).append("\n");
            builder.append("风力：").append(safeText(item.getWind(), "--")).append("\n");
            if (StringUtils.hasText(item.getRainfall()) && isRainfallText(item.getRainfall())) {
                builder.append("降水：").append(item.getRainfall()).append("\n");
            }
            if (StringUtils.hasText(item.getAdvice())) {
                builder.append("小建议：").append(item.getAdvice()).append("\n");
            }
            builder.append("还需要我顺手帮你看看路线或附近安排吗？");
            return sanitizeAssistantText(builder.toString());
        } catch (Exception ex) {
            log.warn("Weather tool failed for {}: {}", location, ex.getMessage());
            return "我刚刚没查到“" + location + "”的天气，可能是地点不够具体或天气服务开了小差。你可以试试输入城市名，比如“宜宾市”或“四川宜宾”。";
        }
    }

    private WeatherForecast pickWeatherForecast(List<WeatherForecast> forecasts, int days) {
        String targetDate = LocalDate.now().plusDays(days).toString();
        return forecasts.stream()
                .filter(item -> targetDate.equals(item.getDate()))
                .findFirst()
                .orElseGet(() -> forecasts.get(Math.min(days == 0 ? 0 : days + 1, forecasts.size() - 1)));
    }

    private boolean isRainfallText(String rainfall) {
        return rainfall.contains("降水")
                || rainfall.contains("mm")
                || rainfall.contains("%")
                || rainfall.contains("雨量");
    }

    private String districtIdForWeather(String location) {
        String text = location == null ? "" : location
                .replace("四川省", "四川")
                .replace("宜宾市", "宜宾")
                .replace("市", "")
                .replace(" ", "")
                .trim();
        Map<String, String> cityCodes = new HashMap<>();
        cityCodes.put("北京", "110000");
        cityCodes.put("上海", "310000");
        cityCodes.put("天津", "120000");
        cityCodes.put("重庆", "500000");
        cityCodes.put("成都", "510100");
        cityCodes.put("四川成都", "510100");
        cityCodes.put("自贡", "510300");
        cityCodes.put("攀枝花", "510400");
        cityCodes.put("泸州", "510500");
        cityCodes.put("德阳", "510600");
        cityCodes.put("绵阳", "510700");
        cityCodes.put("广元", "510800");
        cityCodes.put("遂宁", "510900");
        cityCodes.put("内江", "511000");
        cityCodes.put("乐山", "511100");
        cityCodes.put("南充", "511300");
        cityCodes.put("眉山", "511400");
        cityCodes.put("宜宾", "511500");
        cityCodes.put("四川宜宾", "511500");
        cityCodes.put("广安", "511600");
        cityCodes.put("达州", "511700");
        cityCodes.put("雅安", "511800");
        cityCodes.put("巴中", "511900");
        cityCodes.put("资阳", "512000");
        cityCodes.put("阿坝", "513200");
        cityCodes.put("甘孜", "513300");
        cityCodes.put("凉山", "513400");
        return cityCodes.entrySet().stream()
                .filter(entry -> text.equals(entry.getKey()) || text.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse("");
    }

    private BigDecimal[] geocode(String location) {
        if (!StringUtils.hasText(baiduMapAk)) {
            throw new IllegalStateException("Baidu map api key is not configured");
        }
        RestTemplate restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(4))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.map.baidu.com/geocoding/v3/")
                .queryParam("address", location)
                .queryParam("output", "json")
                .queryParam("ak", baiduMapAk)
                .build()
                .encode()
                .toUriString();
        JsonNode root = restTemplate.getForObject(url, JsonNode.class);
        if (root == null || root.path("status").asInt(-1) != 0) {
            throw new IllegalStateException(root == null ? "empty geocode response" : root.path("message").asText("geocode failed"));
        }
        JsonNode locationNode = root.path("result").path("location");
        return new BigDecimal[]{
                BigDecimal.valueOf(locationNode.path("lat").asDouble()),
                BigDecimal.valueOf(locationNode.path("lng").asDouble())
        };
    }

    private String safeText(String value, String fallback) {
        return StringUtils.hasText(value) ? value : fallback;
    }

    private boolean containsText(String value, String keyword) {
        return StringUtils.hasText(value)
                && StringUtils.hasText(keyword)
                && value.toLowerCase().contains(keyword.toLowerCase());
    }

    private void appendDistance(StringBuilder builder, LocationPoint point, BigDecimal lat, BigDecimal lng) {
        double distance = distanceOrLarge(point, lat, lng);
        if (distance < 9999) {
            builder.append("，距离约").append(Math.round(distance * 10.0) / 10.0).append("公里");
        }
    }

    private double distanceOrLarge(LocationPoint point, BigDecimal lat, BigDecimal lng) {
        if (point == null || lat == null || lng == null) {
            return 99999;
        }
        return GeoUtils.distanceKm(point.lat, point.lng, lat, lng);
    }

    private LocationPoint parseLocationPoint(String location) {
        if (!StringUtils.hasText(location)) {
            return null;
        }
        String[] parts = location.trim().split("\\s*,\\s*");
        if (parts.length < 2) {
            return null;
        }
        try {
            return new LocationPoint(new BigDecimal(parts[0]), new BigDecimal(parts[1]));
        } catch (Exception ex) {
            return null;
        }
    }

    private static class LocationPoint {
        private final BigDecimal lat;
        private final BigDecimal lng;

        private LocationPoint(BigDecimal lat, BigDecimal lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    private static class PlaceTarget {
        private final String name;
        private final String address;
        private final BigDecimal lat;
        private final BigDecimal lng;

        private PlaceTarget(String name, String address, BigDecimal lat, BigDecimal lng) {
            this.name = name;
            this.address = address;
            this.lat = lat;
            this.lng = lng;
        }
    }

    private boolean needsLocationData(String question) {
        return question.contains("附近")
                || question.contains("路线")
                || question.contains("怎么走")
                || question.contains("导航")
                || question.contains("天气")
                || question.contains("路况")
                || question.contains("堵")
                || question.contains("餐厅")
                || question.contains("好吃")
                || question.contains("停车")
                || question.contains("加油站")
                || question.contains("酒店")
                || question.contains("医院");
    }

    private boolean mentionsPreference(String question) {
        return question.contains("我喜欢")
                || question.contains("我爱吃")
                || question.contains("不喜欢")
                || question.contains("不要")
                || question.contains("避雷")
                || question.contains("常去");
    }

    private List<String> webSuggestions(ScenicSpot spot, String question) {
        return Arrays.asList(
                "https://www.baidu.com/s?wd=" + spot.getName() + "%20" + question,
                "https://www.bing.com/search?q=" + spot.getName() + "%20" + question
        );
    }
}
