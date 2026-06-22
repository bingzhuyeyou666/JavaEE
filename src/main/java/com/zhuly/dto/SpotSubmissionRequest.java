/**
 * 本文件定义 SpotSubmissionRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * SpotSubmissionRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class SpotSubmissionRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotBlank
    private String address;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;

    private String openHours;

    private BigDecimal price;

    private String bestSeason;

    private String phone;

    @NotBlank
    private String description;

    @NotBlank
    private String reason;

    private List<String> photoUrls;

    private List<String> videoUrls;
}
