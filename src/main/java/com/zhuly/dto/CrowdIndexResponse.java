/**
 * 本文件定义 CrowdIndexResponse 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * CrowdIndexResponse 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@AllArgsConstructor
public class CrowdIndexResponse {
    private Long spotId;
    private int currentCount;
    private int maxCapacity;
    private double ratio;
    private String level;
    private String color;
}
