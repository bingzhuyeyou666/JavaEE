package com.zhuly.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class HeroSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int sortOrder;
    private boolean enabled = true;

    @Column(length = 1000)
    private String imageUrl;

    private String eyebrow;
    private String title;

    @Column(length = 1000)
    private String body;

    private String actionText;
    private String actionHref;
}
