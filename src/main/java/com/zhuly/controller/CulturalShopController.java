package com.zhuly.controller;

import com.zhuly.config.UserAuthInterceptor;
import com.zhuly.domain.CulturalOrder;
import com.zhuly.domain.CulturalProduct;
import com.zhuly.dto.CulturalOrderRequest;
import com.zhuly.service.CulturalShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CulturalShopController {

    private final CulturalShopService culturalShopService;

    @GetMapping("/spots/{spotId}/products")
    public List<CulturalProduct> products(@PathVariable Long spotId) {
        return culturalShopService.productsForSpot(spotId);
    }

    @PostMapping("/cultural-orders")
    public CulturalOrder create(@RequestParam(defaultValue = "1") Long userId,
                                @Valid @RequestBody CulturalOrderRequest request,
                                HttpSession session) {
        requireLogin(session);
        return culturalShopService.createOrder(userId, request);
    }

    @GetMapping("/cultural-orders/mine")
    public List<CulturalOrder> mine(@RequestParam(defaultValue = "1") Long userId,
                                    HttpSession session) {
        requireLogin(session);
        return culturalShopService.mine(userId);
    }

    private void requireLogin(HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute(UserAuthInterceptor.USER_SESSION_KEY))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录后再购买文创商品");
        }
    }
}
