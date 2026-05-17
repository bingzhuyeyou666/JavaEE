package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

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

    @NotBlank
    private String description;

    @NotBlank
    private String reason;

    private List<String> photoUrls;
}
