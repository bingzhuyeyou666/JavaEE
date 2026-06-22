/**
 * 本文件定义 UserProfile 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

/**
 * UserProfile 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private int points;
    private String avatarUrl;
    private String avatarPreset = "mountain";
    private String avatarFrame = "none";
}
