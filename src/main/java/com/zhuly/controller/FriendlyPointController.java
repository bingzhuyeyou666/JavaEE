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

@RestController
@RequestMapping("/api/friendly-points")
@RequiredArgsConstructor
public class FriendlyPointController {

    private final FriendlyPointService friendlyPointService;

    @GetMapping("/profile")
    public Map<String, Object> profile(@RequestParam(defaultValue = "1") Long userId) {
        return friendlyPointService.profile(userId);
    }

    @GetMapping("/rewards")
    public List<Map<String, Object>> rewards() {
        return friendlyPointService.rewards();
    }

    @PostMapping("/redeem")
    public FriendlyPointRecord redeem(@RequestParam(defaultValue = "1") Long userId,
                                      @RequestParam String rewardId) {
        return friendlyPointService.redeem(userId, rewardId);
    }
}
