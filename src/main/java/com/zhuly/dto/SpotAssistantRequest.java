/**
 * 本文件定义 SpotAssistantRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

/**
 * SpotAssistantRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class SpotAssistantRequest {
    @NotBlank
    private String question;
}
