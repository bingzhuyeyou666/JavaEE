/**
 * 本文件定义 SpotAssistantResponse 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * SpotAssistantResponse 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@AllArgsConstructor
public class SpotAssistantResponse {
    private String answer;
    private List<String> knowledgeHits;
    private List<String> webSearchSuggestions;
    private String source;
    private String model;
}
