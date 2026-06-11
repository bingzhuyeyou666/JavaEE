package com.zhuly.service;

import com.zhuly.domain.CulturalOrder;
import com.zhuly.domain.CulturalProduct;
import com.zhuly.dto.CulturalOrderRequest;
import com.zhuly.repository.CulturalOrderRepository;
import com.zhuly.repository.CulturalProductRepository;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CulturalShopService {

    private final CulturalProductRepository productRepository;
    private final CulturalOrderRepository orderRepository;
    private final ScenicSpotRepository spotRepository;

    public List<CulturalProduct> productsForSpot(Long spotId) {
        spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("Spot not found"));
        return productRepository.findBySpotIdOrderByIdAsc(spotId);
    }

    @Transactional
    public CulturalOrder createOrder(Long userId, CulturalOrderRequest request) {
        CulturalProduct product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Cultural product not found"));
        int quantity = request.getQuantity() == null ? 1 : request.getQuantity();
        if (product.getStock() == null || product.getStock() < quantity) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        CulturalOrder order = new CulturalOrder();
        order.setUserId(userId);
        order.setSpotId(product.getSpotId());
        order.setProductId(product.getId());
        order.setProductName(product.getName());
        order.setQuantity(quantity);
        order.setUnitPrice(product.getPrice());
        order.setTotalAmount(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PAID_MOCK");
        order.setOrderNo("WENCHUANG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<CulturalOrder> mine(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<CulturalProduct> recommend(Long spotId, String question) {
        List<CulturalProduct> products = productsForSpot(spotId);
        if (products.isEmpty()) {
            return products;
        }
        String normalized = question == null ? "" : question;
        if (normalized.contains("礼物") || normalized.contains("伴手礼") || normalized.contains("送")) {
            return products.subList(0, Math.min(2, products.size()));
        }
        if (normalized.contains("孩子") || normalized.contains("亲子") || normalized.contains("玩具")) {
            return products.stream()
                    .filter(product -> product.getTags() != null && product.getTags().contains("亲子"))
                    .findFirst()
                    .map(Collections::singletonList)
                    .orElse(products.subList(0, Math.min(1, products.size())));
        }
        if (normalized.contains("便宜") || normalized.contains("实惠") || normalized.contains("预算")) {
            return products.stream()
                    .sorted((left, right) -> safePrice(left).compareTo(safePrice(right)))
                    .limit(2)
                    .collect(Collectors.toList());
        }
        return products.subList(0, Math.min(3, products.size()));
    }

    private BigDecimal safePrice(CulturalProduct product) {
        return product.getPrice() == null ? BigDecimal.ZERO : product.getPrice();
    }
}
