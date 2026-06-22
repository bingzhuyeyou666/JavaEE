/**
 * 本文件定义 Reservation 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Reservation 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long spotId;
    private LocalDate visitDate;
    private String timeSlot;
    private int people;
    private String status;
    private String qrCode;
    private LocalDateTime createdAt;
}
