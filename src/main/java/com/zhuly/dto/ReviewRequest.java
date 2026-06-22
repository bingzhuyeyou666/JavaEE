/**
 * 本文件定义 ReviewRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * ReviewRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class ReviewRequest {
    @NotNull
    private Long spotId;

    @Min(1)
    @Max(5)
    private int score;

    @NotBlank
    private String content;

    private Long parentId;
}
