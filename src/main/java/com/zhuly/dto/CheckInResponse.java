/**
 * 本文件定义 CheckInResponse 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * CheckInResponse 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@AllArgsConstructor
public class CheckInResponse {
    private Long userId;
    private Long spotId;
    private boolean checkedIn;
    private int totalCheckedIn;
    private List<String> badges;
}
