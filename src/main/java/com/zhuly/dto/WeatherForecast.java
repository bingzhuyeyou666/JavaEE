/**
 * 本文件定义 WeatherForecast 数据传输对象，用于接口请求或响应的数据封装
 */
package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * WeatherForecast 用于在接口层和业务层之间传递结构化数据
 */
@Getter
@Setter
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
    private String source;
    private String updatedAt;

    public WeatherForecast(String date, String condition, String temperature, String rainfall,
                           String wind, String period, String dayCondition, String low, String high,
                           String nightCondition, String icon, String advice) {
        this(date, condition, temperature, rainfall, wind, period, dayCondition, low, high,
                nightCondition, icon, advice, "", "");
    }
}
