/**
 * 本文件定义 FriendlyPointRecord 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

/**
 * FriendlyPointRecord 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
public class FriendlyPointRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private int amount;
    private String actionType;
    private String title;
    private String description;
    private Long relatedId;
    private LocalDateTime createdAt;
}
