package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
public class RoutePlanRequest {
    @Size(min = 2, max = 5)
    private List<Long> spotIds;
    private String mode;
}
