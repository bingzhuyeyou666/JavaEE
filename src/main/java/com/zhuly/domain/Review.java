package com.zhuly.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long spotId;
    private Long userId;
    private int score;

    @javax.persistence.Column(length = 1000)
    private String content;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> images = new ArrayList<String>();

    private Long parentId;
    private int likes;
    private boolean hidden;
    private LocalDateTime createdAt;
    private int replyCount;
}
