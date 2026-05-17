package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SpotAssistantResponse {
    private String answer;
    private List<String> knowledgeHits;
    private List<String> webSearchSuggestions;
}
