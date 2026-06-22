/**
 * 本文件定义 FriendlyPointController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.zhuly.domain.FriendlyPointRecord;
import com.zhuly.service.FriendlyPointService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * FriendlyPointController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/friendly-points")
@RequiredArgsConstructor
public class FriendlyPointController {

    private final FriendlyPointService friendlyPointService;

    // 查询指定用户的友好积分余额和积分记录
    @GetMapping("/profile")
    public Map<String, Object> profile(@RequestParam(defaultValue = "1") Long userId) {
        return friendlyPointService.profile(userId);
    }

    // 查询当前可兑换的友好积分奖励列表
    @GetMapping("/rewards")
    public List<Map<String, Object>> rewards() {
        return friendlyPointService.rewards();
    }

    // 使用用户友好积分兑换指定奖励
    @PostMapping("/redeem")
    public FriendlyPointRecord redeem(@RequestParam(defaultValue = "1") Long userId,
                                      @RequestParam String rewardId) {
        return friendlyPointService.redeem(userId, rewardId);
    }

    @PostMapping("/equip-frame")
    public Map<String, Object> equipFrame(@RequestParam(defaultValue = "1") Long userId,
                                          @RequestParam String frame) {
        return java.util.Collections.singletonMap("frame", friendlyPointService.equipFrame(userId, frame));
    }
}
