package com.zhuly.dto;

import com.zhuly.domain.CulturalProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SpotAssistantResponse {
    private String answer;
    private List<String> knowledgeHits;
    private List<String> webSearchSuggestions;
    private List<CulturalProduct> productRecommendations;
    private String source;
    private String model;
}
