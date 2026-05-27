package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CulturalOrderRequest {

    @NotNull
    private Long productId;

    @Min(1)
    @Max(20)
    private Integer quantity = 1;

    @NotBlank
    private String receiverName;

    @NotBlank
    private String receiverPhone;

    @NotBlank
    private String shippingAddress;
}
