package com.zhuly.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.SpotAssistantResponse;
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

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpotAssistantService {

    private final ScenicSpotRepository spotRepository;
    private final SpotKnowledgeBase knowledgeBase;
    private final CulturalShopService culturalShopService;
    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${travel.ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${travel.ai.api-key:}")
    private String apiKey;

    @Value("${travel.ai.base-url:https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions}")
    private String baseUrl;

    @Value("${travel.ai.model:qwen-plus}")
    private String model;

    @Value("${travel.ai.timeout-seconds:20}")
    private int timeoutSeconds;

    public SpotAssistantResponse answer(Long spotId, String question) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        List<String> hits = knowledgeBase.search(spot, question);
        String source = "local-knowledge-base";
        String answer = buildAnswer(spot, question, hits);
        if (aiEnabled && StringUtils.hasText(apiKey)) {
            try {
                answer = askBailian(spot, question, hits);
                source = "aliyun-bailian";
            } catch (Exception ex) {
                log.warn("Aliyun Bailian assistant call failed, falling back to local answer: {}", ex.getMessage());
            }
        }
        return new SpotAssistantResponse(answer, hits, webSuggestions(spot, question),
                culturalShopService.recommend(spotId, question), source, "aliyun-bailian".equals(source) ? model : "local");
    }

    private String askBailian(ScenicSpot spot, String question, List<String> hits) {
        RestTemplate restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(Math.max(3, timeoutSeconds)))
                .setReadTimeout(Duration.ofSeconds(Math.max(5, timeoutSeconds)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("temperature", 0.4);
        body.put("max_tokens", 900);
        body.put("messages", Arrays.asList(
                message("system", "你是陌路寻景的景点 AI 助手。请用中文回答，语气自然、实用、简洁。必须优先依据给定景点资料和知识库片段，不确定的信息要说明。涉及游玩、季节、门票、注意事项时给出可执行建议。"),
                message("user", buildPrompt(spot, question, hits))
        ));

        ResponseEntity<JsonNode> response = restTemplate.postForEntity(baseUrl, new HttpEntity<>(body, headers), JsonNode.class);
        JsonNode content = response.getBody() == null ? null : response.getBody().at("/choices/0/message/content");
        if (content == null || content.isMissingNode() || !StringUtils.hasText(content.asText())) {
            throw new IllegalStateException("百炼未返回有效回答");
        }
        return content.asText().trim();
    }

    private Map<String, String> message(String role, String content) {
        Map<String, String> message = new HashMap<>();
        message.put("role", role);
        message.put("content", content);
        return message;
    }

    private String buildPrompt(ScenicSpot spot, String question, List<String> hits) {
        StringBuilder builder = new StringBuilder();
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

    private String buildAnswer(ScenicSpot spot, String question, List<String> hits) {
        StringBuilder builder = new StringBuilder();
        builder.append("关于“").append(spot.getName()).append("”，我结合当前景点知识库为你整理如下：\n\n");
        if (isShopQuestion(question)) {
            builder.append("这个景点适合购买带有本地文化符号的纪念品。你可以优先看轻便好带的冰箱贴、明信片套装，也可以选择帆布袋或亲子拼图作为礼物。\n\n");
        } else if (question.contains("历史") || question.contains("发展") || question.contains("成立")) {
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

    private boolean isShopQuestion(String question) {
        return question.contains("文创")
                || question.contains("商品")
                || question.contains("购买")
                || question.contains("买")
                || question.contains("伴手礼")
                || question.contains("纪念品")
                || question.contains("礼物");
    }

    private List<String> webSuggestions(ScenicSpot spot, String question) {
        return Arrays.asList(
                "https://www.baidu.com/s?wd=" + spot.getName() + "%20" + question,
                "https://www.bing.com/search?q=" + spot.getName() + "%20" + question
        );
    }
}
