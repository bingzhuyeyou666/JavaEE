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
}
