/**
 * 本文件定义 TravelCopyResponse 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * TravelCopyResponse 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelCopyResponse {
    private String title;
    private String content;
    private List<String> tags = new ArrayList<String>();
    private String category;
    private String postType;
    private String source;
}
