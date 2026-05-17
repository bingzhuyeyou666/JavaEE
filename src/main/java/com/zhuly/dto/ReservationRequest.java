package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

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
