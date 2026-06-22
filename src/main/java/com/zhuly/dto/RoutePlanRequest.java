/**
 * 本文件定义 RoutePlanRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * RoutePlanRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class RoutePlanRequest {
    @NotNull(message = "请选择要规划的景点")
    @Size(min = 2, max = 5, message = "路线规划需要选择 2 至 5 个景点")
    private List<Long> spotIds;
    private String mode;
}
