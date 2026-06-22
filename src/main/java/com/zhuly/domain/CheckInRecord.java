/**
 * 本文件定义 CheckInRecord 领域实体，用于保存对应业务数据及其数据库映射
 */
package com.zhuly.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * CheckInRecord 表示本模块的持久化业务实体及其字段结构
 */
@Getter
@Setter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "spotId"}))
public class CheckInRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long spotId;
    private String imageUrl;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "check_in_record_images", joinColumns = @JoinColumn(name = "check_in_record_id"))
    private List<String> imageUrls = new ArrayList<>();
    private LocalDateTime checkedInAt;
}
