/**
 * 本文件定义 SpotSubmission 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import javax.persistence.Entity;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OrderColumn;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * SpotSubmission 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
public class SpotSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String type;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String openHours;
    private BigDecimal price;
    private String bestSeason;
    private String phone;

    @javax.persistence.Column(length = 2000)
    private String description;

    @javax.persistence.Column(length = 2000)
    private String reason;

    @ElementCollection(fetch = FetchType.EAGER)
    @OrderColumn(name = "sort_order")
    private List<String> photoUrls = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @OrderColumn(name = "sort_order")
    private List<String> videoUrls = new ArrayList<>();

    private String status;
    private String auditRemark;
    private LocalDateTime createdAt;
}
