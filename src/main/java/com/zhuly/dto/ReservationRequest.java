/**
 * 本文件定义 ReservationRequest 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * ReservationRequest 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
public class ReservationRequest {
    @NotNull
    private Long spotId;

    @NotNull
    @FutureOrPresent
    private LocalDate visitDate;

    @NotBlank
    private String timeSlot;

    @Min(1)
    @Max(10)
    private int people;
}
