package com.zhuly.domain;

import javax.persistence.Entity;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @javax.persistence.Column(length = 2000)
    private String description;

    @javax.persistence.Column(length = 2000)
    private String reason;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> photoUrls = new ArrayList<>();

    private String status;
    private String auditRemark;
    private LocalDateTime createdAt;
}
