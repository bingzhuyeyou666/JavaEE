package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeatherForecast {
    private String date;
    private String condition;
    private String temperature;
    private String rainfall;
    private String wind;
    private String period;
    private String dayCondition;
    private String low;
    private String high;
    private String nightCondition;
    private String icon;
    private String advice;
}
