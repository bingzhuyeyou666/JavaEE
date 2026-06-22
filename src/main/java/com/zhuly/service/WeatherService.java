/**
 * 本文件定义 WeatherService 服务，负责封装对应业务规则和数据处理流程
 */
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * WeatherService 集中实现本模块的业务规则，并协调数据访问或第三方服务
 */
@Service
public class WeatherService {

    private static final String DEFAULT_ICON = "sun";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${travel.weather.api-key:}")
    private String baiduWeatherAk;

    // 执行 threeDays 方法对应的业务处理
    public List<WeatherForecast> threeDays(BigDecimal latitude, BigDecimal longitude) {
        if (baiduWeatherAk != null && !baiduWeatherAk.trim().isEmpty() && latitude != null && longitude != null) {
            try {
                List<WeatherForecast> baiduWeather = baiduWeather(latitude, longitude);
                if (!baiduWeather.isEmpty()) {
                    return markSource(baiduWeather, "百度天气");
                }
            } catch (Exception ignored) {
                // Continue with the public fallback below
            }
        }
        return openMeteoWeather(latitude, longitude);
    }

    // 执行 threeDaysByDistrictId 方法对应的业务处理
    public List<WeatherForecast> threeDaysByDistrictId(String districtId) {
        if (baiduWeatherAk != null && !baiduWeatherAk.trim().isEmpty() && districtId != null && !districtId.trim().isEmpty()) {
            try {
                List<WeatherForecast> baiduWeather = baiduWeatherByDistrictId(districtId.trim());
                if (!baiduWeather.isEmpty()) {
                    return baiduWeather;
                }
            } catch (Exception ignored) {
                return new ArrayList<>();
            }
        }
        return new ArrayList<>();
    }

    // 执行 baiduWeather 方法对应的业务处理
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

    // 执行 baiduWeatherByDistrictId 方法对应的业务处理
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

    // 执行 baiduWeatherFromUrl 方法对应的业务处理
    private List<WeatherForecast> baiduWeatherFromUrl(String url) throws Exception {
        String body = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(body);
        if (root.path("status").asInt(-1) != 0) {
            throw new IllegalStateException("百度天气服务请求失败：" + root.path("message").asText("未返回失败原因"));
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

    // 执行 openMeteoWeather 方法对应的业务处理
    private List<WeatherForecast> openMeteoWeather(BigDecimal latitude, BigDecimal longitude) {
        if (latitude == null || longitude == null) {
            return new ArrayList<>();
        }
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://api.open-meteo.com/v1/forecast")
                    .queryParam("latitude", latitude)
                    .queryParam("longitude", longitude)
                    .queryParam("current", "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m")
                    .queryParam("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max")
                    .queryParam("timezone", "auto")
                    .queryParam("forecast_days", 4)
                    .build()
                    .toUriString();
            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode current = root.path("current");
            JsonNode daily = root.path("daily");
            List<WeatherForecast> result = new ArrayList<>();
            int currentCode = current.path("weather_code").asInt(-1);
            String currentCondition = weatherCodeText(currentCode);
            String currentTemp = numberText(current.path("temperature_2m")) + "℃";
            result.add(new WeatherForecast(
                    current.path("time").asText(LocalDate.now().toString()),
                    currentCondition,
                    currentTemp,
                    numberText(current.path("precipitation")) + " mm",
                    numberText(current.path("wind_speed_10m")) + " km/h",
                    "实时",
                    "湿度 " + numberText(current.path("relative_humidity_2m")) + "%",
                    currentTemp,
                    "体感 " + numberText(current.path("apparent_temperature")) + "℃",
                    currentCondition,
                    weatherCodeIcon(currentCode),
                    weatherAdvice(currentCode, current.path("temperature_2m").asDouble(20))
            ));
            JsonNode dates = daily.path("time");
            for (int i = 1; i < Math.min(4, dates.size()); i++) {
                int code = daily.path("weather_code").path(i).asInt(-1);
                String condition = weatherCodeText(code);
                String low = numberText(daily.path("temperature_2m_min").path(i));
                String high = numberText(daily.path("temperature_2m_max").path(i));
                result.add(new WeatherForecast(
                        dates.path(i).asText(),
                        condition,
                        low + "-" + high + "℃",
                        numberText(daily.path("precipitation_probability_max").path(i)) + "%",
                        numberText(daily.path("wind_speed_10m_max").path(i)) + " km/h",
                        dates.path(i).asText(),
                        condition,
                        low + "℃",
                        high + "℃",
                        condition,
                        weatherCodeIcon(code),
                        weatherAdvice(code, daily.path("temperature_2m_max").path(i).asDouble(20))
                ));
            }
            return markSource(result, "Open-Meteo 实时天气");
        } catch (Exception ignored) {
            return new ArrayList<>();
        }
    }

    // 执行 markSource 方法对应的业务处理
    private List<WeatherForecast> markSource(List<WeatherForecast> forecasts, String source) {
        String updatedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        forecasts.forEach(item -> {
            item.setSource(source);
            item.setUpdatedAt(updatedAt);
        });
        return forecasts;
    }

    // 计算 numberText 对应的业务结果
    private String numberText(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) return "--";
        double value = node.asDouble();
        return Math.abs(value - Math.rint(value)) < 0.05
                ? String.valueOf((int) Math.rint(value))
                : String.format(java.util.Locale.ROOT, "%.1f", value);
    }

    // 查询并返回 weatherCodeText 对应的数据
    private String weatherCodeText(int code) {
        if (code == 0) return "晴";
        if (code <= 3) return "多云";
        if (code == 45 || code == 48) return "雾";
        if (code >= 51 && code <= 67) return "有雨";
        if (code >= 71 && code <= 77) return "有雪";
        if (code >= 80 && code <= 82) return "阵雨";
        if (code >= 85 && code <= 86) return "阵雪";
        if (code >= 95) return "雷雨";
        return "天气平稳";
    }

    // 查询并返回 weatherCodeIcon 对应的数据
    private String weatherCodeIcon(int code) {
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return "rain";
        if (code == 45 || code == 48) return "mist";
        if (code >= 1 && code <= 3) return "cloud";
        return "sun";
    }

    // 查询并返回 weatherAdvice 对应的数据
    private String weatherAdvice(int code, double temperature) {
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) {
            return "可能有降水，建议携带雨具并注意路面湿滑。";
        }
        if (temperature >= 30) return "气温较高，注意防晒和补水。";
        if (temperature <= 10) return "气温偏低，建议注意保暖。";
        return "天气条件较平稳，适合合理安排游览。";
    }

    // 解析或获取 resolveWeatherIcon 对应的数据
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

    // 组装 buildAdvice 所需的返回对象或业务数据
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
