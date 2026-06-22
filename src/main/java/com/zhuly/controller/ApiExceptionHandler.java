/**
 * 本文件定义 ApiExceptionHandler 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

/**
 * ApiExceptionHandler 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    // 执行 badRequest 方法对应的业务处理
    @ExceptionHandler({IllegalArgumentException.class, java.util.NoSuchElementException.class})
    public ResponseEntity<Map<String, String>> badRequest(Exception exception) {
        Map<String, String> body = new HashMap<>();
        body.put("message", exception.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    // 执行 validation 方法对应的业务处理
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + " " + error.getDefaultMessage())
                .orElse("参数校验失败");
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // 执行 responseStatus 方法对应的业务处理
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> responseStatus(ResponseStatusException exception) {
        Map<String, String> body = new HashMap<>();
        body.put("message", exception.getReason());
        return ResponseEntity.status(exception.getStatus()).body(body);
    }

    // 将参数类型转换失败统一转换为中文提示
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> typeMismatch(MethodArgumentTypeMismatchException exception) {
        String value = exception.getValue() == null ? "空值" : String.valueOf(exception.getValue());
        String requiredType = chineseTypeName(exception.getRequiredType());
        return badRequestMessage("参数类型转换失败：参数“" + exception.getName()
                + "”的值“" + value + "”不能转换为" + requiredType);
    }

    // 将缺少请求参数统一转换为中文提示
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> missingParameter(MissingServletRequestParameterException exception) {
        return badRequestMessage("缺少必要参数：" + exception.getParameterName());
    }

    // 将请求正文或 JSON 格式错误统一转换为中文提示
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> unreadableRequest(HttpMessageNotReadableException exception) {
        return badRequestMessage("请求数据解析失败：提交内容不是有效的数据格式");
    }

    // 将不支持的请求内容类型统一转换为中文提示
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, String>> unsupportedMediaType(HttpMediaTypeNotSupportedException exception) {
        String contentType = exception.getContentType() == null
                ? "未知格式"
                : exception.getContentType().toString();
        return badRequestMessage("请求格式不受支持：" + contentType);
    }

    // 兜底处理未预期异常并返回中文异常类型和具体原因
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> unexpected(Exception exception) {
        Map<String, String> body = new HashMap<>();
        body.put("message", chineseExceptionMessage(exception));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    // 组装统一的参数错误响应
    private ResponseEntity<Map<String, String>> badRequestMessage(String message) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.badRequest().body(body);
    }

    // 将 Java 参数类型名称转换为中文
    private String chineseTypeName(Class<?> type) {
        if (type == null) return "要求的类型";
        if (Long.class.equals(type) || long.class.equals(type)
                || Integer.class.equals(type) || int.class.equals(type)
                || Short.class.equals(type) || short.class.equals(type)) {
            return "整数";
        }
        if (Double.class.equals(type) || double.class.equals(type)
                || Float.class.equals(type) || float.class.equals(type)
                || java.math.BigDecimal.class.equals(type)) {
            return "数字";
        }
        if (Boolean.class.equals(type) || boolean.class.equals(type)) return "布尔值";
        if (java.time.LocalDate.class.equals(type)) return "日期";
        return "要求的类型";
    }

    // 根据异常类型生成中文具体原因
    private String chineseExceptionMessage(Exception exception) {
        Throwable cause = rootCause(exception);
        if (cause instanceof NumberFormatException) {
            return "数字格式错误：输入内容不能转换为有效数字";
        }
        if (cause instanceof java.io.IOException) {
            return "文件或网络读取失败：" + safeChineseMessage(cause.getMessage(), "读取过程中发生异常");
        }
        if (cause instanceof org.springframework.dao.DataAccessException) {
            return "数据库操作失败：" + safeChineseMessage(cause.getMessage(), "数据读写过程中发生异常");
        }
        if (cause instanceof NullPointerException) {
            return "数据为空异常：程序读取了不存在的数据";
        }
        return "系统处理异常：" + safeChineseMessage(cause.getMessage(), "发生未识别的处理错误");
    }

    // 获取异常链中最底层的真实原因
    private Throwable rootCause(Throwable throwable) {
        Throwable current = throwable;
        while (current.getCause() != null && current.getCause() != current) {
            current = current.getCause();
        }
        return current;
    }

    // 保留中文异常详情，英文详情则转换为中文说明
    private String safeChineseMessage(String message, String fallback) {
        if (message == null || message.trim().isEmpty()) return fallback;
        if (message.matches(".*[\\u4e00-\\u9fa5].*")) return message;
        return fallback;
    }
}
