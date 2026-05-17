package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.SpotAssistantResponse;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotAssistantService {

    private final ScenicSpotRepository spotRepository;
    private final SpotKnowledgeBase knowledgeBase;

    public SpotAssistantResponse answer(Long spotId, String question) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        List<String> hits = knowledgeBase.search(spot, question);
        String answer = buildAnswer(spot, question, hits);
        return new SpotAssistantResponse(answer, hits, webSuggestions(spot, question));
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

    private List<String> webSuggestions(ScenicSpot spot, String question) {
        return Arrays.asList(
                "https://www.baidu.com/s?wd=" + spot.getName() + "%20" + question,
                "https://www.bing.com/search?q=" + spot.getName() + "%20" + question
        );
    }
}
