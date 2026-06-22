/**
 * 本文件定义 SquareCommentRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * SquareCommentRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class SquareCommentRequest {

    private Long parentId;

    @NotBlank(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论最多 1000 个字")
    private String content;
}
