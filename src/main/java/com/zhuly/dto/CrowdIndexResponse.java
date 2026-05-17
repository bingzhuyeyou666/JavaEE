package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CrowdIndexResponse {
    private Long spotId;
    private int currentCount;
    private int maxCapacity;
    private double ratio;
    private String level;
    private String color;
}
