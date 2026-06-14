package com.zhuly.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zhuly.dto.WeatherForecast;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class WeatherService {

    private static final String DEFAULT_ICON = "sun";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${travel.weather.api-key:}")
    private String baiduWeatherAk;

    public List<WeatherForecast> threeDays(BigDecimal latitude, BigDecimal longitude) {
        if (baiduWeatherAk != null && !baiduWeatherAk.trim().isEmpty() && latitude != null && longitude != null) {
            try {
                List<WeatherForecast> baiduWeather = baiduWeather(latitude, longitude);
                if (!baiduWeather.isEmpty()) {
                    return baiduWeather;
                }
            } catch (Exception ignored) {
                return mockThreeDays();
            }
        }
        return mockThreeDays();
    }

    public List<WeatherForecast> threeDaysByDistrictId(String districtId) {
        if (baiduWeatherAk != null && !baiduWeatherAk.trim().isEmpty() && districtId != null && !districtId.trim().isEmpty()) {
            try {
                List<WeatherForecast> baiduWeather = baiduWeatherByDistrictId(districtId.trim());
                if (!baiduWeather.isEmpty()) {
                    return baiduWeather;
                }
            } catch (Exception ignored) {
                return mockThreeDays();
            }
        }
        return mockThreeDays();
    }

    private List<WeatherForecast> baiduWeather(BigDecimal latitude, BigDecimal longitude) throws Exception {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.map.baidu.com/weather/v1/")
                .queryParam("location", longitude + "," + latitude)
                .queryParam("data_type", "all")
                .queryParam("ak", baiduWeatherAk)
                .build()
                .toUriString();
        return baiduWeatherFromUrl(url);
    }

    private List<WeatherForecast> baiduWeatherByDistrictId(String districtId) throws Exception {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.map.baidu.com/weather/v1/")
                .queryParam("district_id", districtId)
                .queryParam("data_type", "all")
                .queryParam("ak", baiduWeatherAk)
                .build()
                .toUriString();
        return baiduWeatherFromUrl(url);
    }

    private List<WeatherForecast> baiduWeatherFromUrl(String url) throws Exception {
        String body = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(body);
        if (root.path("status").asInt(-1) != 0) {
            throw new IllegalStateException(root.path("message").asText("Baidu weather request failed"));
        }
        JsonNode result = root.path("result");
        List<WeatherForecast> forecasts = new ArrayList<>();
        JsonNode now = result.path("now");
        if (!now.isMissingNode()) {
            forecasts.add(new WeatherForecast(
                    LocalDate.now().toString(),
                    now.path("text").asText("实时天气"),
                    now.path("temp").asText("--") + "℃",
                    "未来1小时降水 " + now.path("prec_1h").asText("0") + "mm",
                    now.path("wind_dir").asText("") + now.path("wind_class").asText(""),
                    "now",
                    now.path("rh").asText("--") + "%",
                    now.path("feels_like").asText("--") + "℃",
                    now.path("vis").asText("--") + "km",
                    "实时",
                    DEFAULT_ICON,
                    buildAdvice(now.path("text").asText(""), now.path("temp").asText(""), now.path("prec_1h").asText("0"))
            ));
        }
        JsonNode forecastArray = result.path("forecasts");
        if (forecastArray.isArray()) {
            for (JsonNode item : forecastArray) {
                if (forecasts.size() >= 4) {
                    break;
                }
                String low = item.path("low").asText("--");
                String high = item.path("high").asText("--");
                String condition = item.path("text_day").asText("--") + " / " + item.path("text_night").asText("--");
                forecasts.add(new WeatherForecast(
                        item.path("date").asText("--"),
                        condition,
                        low + "-" + high + "℃",
                        item.path("week").asText(""),
                        item.path("wd_day").asText("") + item.path("wc_day").asText(""),
                        item.path("week").asText(""),
                        item.path("text_day").asText("--"),
                        low,
                        high,
                        item.path("text_night").asText("--"),
                        resolveWeatherIcon(item.path("text_day").asText("")),
                        buildAdvice(condition, high, item.path("wc_day").asText(""))
                ));
            }
        }
        return forecasts;
    }

    private List<WeatherForecast> mockThreeDays() {
        LocalDate today = LocalDate.now();
        return Arrays.asList(
                new WeatherForecast(today.toString(), "多云", "22-29℃", "10%", "东南风2级", "实时", "湿度 58%", "体感 28℃", "能见度 12km", "实时", "cloud", "适合出行，建议备一件薄外套。"),
                new WeatherForecast(today.plusDays(1).toString(), "小雨", "21-26℃", "45%", "北风3级", "周二", "白天小雨", "21℃", "26℃", "夜间阵雨", "rain", "记得带伞，山地路段建议放慢节奏。"),
                new WeatherForecast(today.plusDays(2).toString(), "晴", "23-31℃", "5%", "南风2级", "周三", "晴间多云", "23℃", "31℃", "晴", "sun", "天气较好，适合安排观景和拍照。")
        );
    }

    private String resolveWeatherIcon(String condition) {
        String text = condition == null ? "" : condition;
        if (text.contains("雨") || text.contains("雪")) {
            return "rain";
        }
        if (text.contains("云") || text.contains("阴")) {
            return "cloud";
        }
        if (text.contains("雾") || text.contains("霾")) {
            return "mist";
        }
        return "sun";
    }

    private String buildAdvice(String condition, String temperature, String rainfall) {
        StringBuilder advice = new StringBuilder();
        if (condition != null && (condition.contains("雨") || "0".equals(rainfall))) {
            advice.append(condition.contains("雨") ? "带伞，" : "");
        }
        if (temperature != null && temperature.contains("--")) {
            return "天气数据更新中，先按当前体感准备行程。";
        }
        if (temperature != null) {
            try {
                String clean = temperature.replace("℃", "").trim();
                String[] parts = clean.split("-");
                int max = Integer.parseInt(parts[parts.length - 1]);
                if (max >= 30) {
                    advice.append("注意防晒和补水。");
                } else if (max <= 10) {
                    advice.append("注意保暖。");
                } else {
                    advice.append("体感舒适，适合轻装出行。");
                }
            } catch (Exception ex) {
                advice.append("体感舒适，适合轻装出行。");
            }
        }
        if (advice.length() == 0) {
            advice.append("适合安排半日游。");
        }
        return advice.toString();
    }
}
