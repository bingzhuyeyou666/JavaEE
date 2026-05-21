package com.zhuly.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class SquarePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String authorName;
    private String category;
    private String title;

    @Column(length = 3000)
    private String content;

    @ElementCollection
    private List<String> imageUrls = new ArrayList<String>();

    @ElementCollection
    private List<String> videoUrls = new ArrayList<String>();

    private String locationName;
    private String tripDate;
    private int likes;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> likedUserIds = new HashSet<Long>();

    private int commentCount;
    private boolean hidden;
    private LocalDateTime createdAt;
}
