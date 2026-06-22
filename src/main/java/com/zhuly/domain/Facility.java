/**
 * 本文件定义 Facility 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Facility 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private FacilityType type;

    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal price;
    private Integer availableSpaces;
    private Double hygieneScore;
    private String cuisine;
    private BigDecimal averageCost;
    private double rating;
}
