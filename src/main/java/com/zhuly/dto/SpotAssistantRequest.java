package com.zhuly.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class SpotAssistantRequest {
    @NotBlank
    private String question;
}
