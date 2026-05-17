package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class ReviewRequest {
    @NotNull
    private Long spotId;

    @Min(1)
    @Max(5)
    private int score;

    @NotBlank
    private String content;

    private Long parentId;
}
