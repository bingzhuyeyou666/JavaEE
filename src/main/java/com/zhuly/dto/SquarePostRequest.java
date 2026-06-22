/**
 * 本文件定义 SquarePostRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

/**
 * SquarePostRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class SquarePostRequest {

    @NotBlank(message = "帖子标题不能为空")
    @Size(max = 80, message = "标题最多 80 个字")
    private String title;

    @NotBlank(message = "帖子内容不能为空")
    @Size(max = 3000, message = "正文最多 3000 个字")
    private String content;

    @NotBlank(message = "请选择帖子类型")
    private String category;

    private String postType;
    private String locationName;
    private String tripDate;
    private List<String> imageUrls = new ArrayList<String>();
    private List<String> videoUrls = new ArrayList<String>();
    private List<String> tags = new ArrayList<String>();
}
