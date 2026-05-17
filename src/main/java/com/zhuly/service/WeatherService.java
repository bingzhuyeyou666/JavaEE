package com.zhuly.service;

import com.zhuly.dto.WeatherForecast;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class WeatherService {

    public List<WeatherForecast> threeDays() {
        LocalDate today = LocalDate.now();
        return Arrays.asList(
                new WeatherForecast(today.toString(), "多云", "22-29℃", "10%", "东南风2级"),
                new WeatherForecast(today.plusDays(1).toString(), "小雨", "21-26℃", "45%", "北风3级"),
                new WeatherForecast(today.plusDays(2).toString(), "晴", "23-31℃", "5%", "南风2级")
        );
    }
}
