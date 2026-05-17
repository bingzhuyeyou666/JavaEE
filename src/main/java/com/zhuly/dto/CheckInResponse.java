package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CheckInResponse {
    private Long userId;
    private Long spotId;
    private boolean checkedIn;
    private int totalCheckedIn;
    private List<String> badges;
}
