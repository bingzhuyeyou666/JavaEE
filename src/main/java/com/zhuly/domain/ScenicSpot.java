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
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class ScenicSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String openHours;
    private String phone;
    private BigDecimal price;
    private double rating;
    private int maxCapacity;
    @javax.persistence.Column(length = 1000)
    private String coverImage;

    @ElementCollection(fetch = FetchType.EAGER)
    @javax.persistence.Column(name = "gallery", length = 1000)
    private List<String> gallery = new ArrayList<>();

    private String videoUrl;

    @javax.persistence.Column(length = 2000)
    private String description;

    @javax.persistence.Column(length = 2000)
    private String guide;

    @javax.persistence.Column(length = 3000)
    private String history;

    @javax.persistence.Column(length = 2000)
    private String highlights;

    private String bestSeason;
    private String notice;
    private String tags;
    private String sourceName;
    private String sourceUrl;
    private boolean approved = true;
    private boolean homeFeatured = false;
    private int homeFeaturedSort = 0;
}
