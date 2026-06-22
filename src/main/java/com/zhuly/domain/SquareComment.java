/**
 * 本文件定义 SquareComment 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * SquareComment 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
public class SquareComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long postId;
    private Long parentId;
    private Long userId;
    private String authorName;

    @Column(length = 1000)
    private String content;

    private Integer likes;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> likedUserIds = new HashSet<Long>();

    private Integer replyCount;
    private LocalDateTime createdAt;
}
