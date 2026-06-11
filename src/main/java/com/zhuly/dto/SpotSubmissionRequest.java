package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SpotSubmissionRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotBlank
    private String address;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;

    private String openHours;

    private BigDecimal price;

    private String bestSeason;

    private String phone;

    @NotBlank
    private String description;

    @NotBlank
    private String reason;

    private List<String> photoUrls;

    private List<String> videoUrls;

    private List<Map<String, Object>> culturalProducts = new ArrayList<>();
}
