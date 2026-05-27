package com.zhuly.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class CulturalProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long spotId;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private String tags;

    @Column(length = 1200)
    private String description;

    private LocalDateTime createdAt;
}
