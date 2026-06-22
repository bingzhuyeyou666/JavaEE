/**
 * 本文件定义 ReservationController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.zhuly.domain.Reservation;
import com.zhuly.dto.ReservationRequest;
import com.zhuly.service.ReservationService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * ReservationController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 为当前用户创建景点预约记录
    @PostMapping
    public Reservation create(@RequestParam(defaultValue = "1") Long userId,
                              @Valid @RequestBody ReservationRequest request) {
        return reservationService.create(userId, request);
    }

    // 查询当前用户的全部预约记录
    @GetMapping("/mine")
    public List<Reservation> mine(@RequestParam(defaultValue = "1") Long userId) {
        return reservationService.mine(userId);
    }

    // 取消当前用户名下的指定预约
    @PostMapping("/{id}/cancel")
    public Reservation cancel(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId) {
        return reservationService.cancel(userId, id);
    }
}
