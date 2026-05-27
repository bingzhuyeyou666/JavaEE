package com.zhuly.service;

import com.zhuly.domain.CulturalOrder;
import com.zhuly.domain.CulturalProduct;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.dto.CulturalOrderRequest;
import com.zhuly.repository.CulturalOrderRepository;
import com.zhuly.repository.CulturalProductRepository;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriUtils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CulturalShopService {

    private final CulturalProductRepository productRepository;
    private final CulturalOrderRepository orderRepository;
    private final ScenicSpotRepository spotRepository;

    @Transactional
    public List<CulturalProduct> productsForSpot(Long spotId) {
        ScenicSpot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        List<CulturalProduct> products = productRepository.findBySpotIdOrderByIdAsc(spotId);
        if (products.isEmpty()) {
            productRepository.saveAll(seedProducts(spot));
            products = productRepository.findBySpotIdOrderByIdAsc(spotId);
        }
        return products;
    }

    @Transactional
    public CulturalOrder createOrder(Long userId, CulturalOrderRequest request) {
        CulturalProduct product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("文创商品不存在"));
        int quantity = request.getQuantity() == null ? 1 : request.getQuantity();
        if (product.getStock() == null || product.getStock() < quantity) {
            throw new IllegalArgumentException("库存不足，请减少购买数量");
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
        String normalized = question == null ? "" : question;
        if (normalized.contains("礼物") || normalized.contains("伴手礼") || normalized.contains("送")) {
            return products.subList(0, Math.min(2, products.size()));
        }
        if (normalized.contains("孩子") || normalized.contains("亲子") || normalized.contains("玩具")) {
            return products.stream()
                    .filter(product -> product.getTags() != null && product.getTags().contains("亲子"))
                    .findFirst()
                    .map(Arrays::asList)
                    .orElse(products.subList(0, Math.min(1, products.size())));
        }
        if (normalized.contains("便宜") || normalized.contains("实惠") || normalized.contains("预算")) {
            return products.stream()
                    .sorted((left, right) -> left.getPrice().compareTo(right.getPrice()))
                    .limit(2)
                    .collect(java.util.stream.Collectors.toList());
        }
        return products.subList(0, Math.min(3, products.size()));
    }

    private List<CulturalProduct> seedProducts(ScenicSpot spot) {
        return Arrays.asList(
                product(spot, spot.getName() + "纪念冰箱贴", "纪念品", "把景点轮廓和代表色做成小尺寸磁贴，适合旅行留念和伴手礼。", "伴手礼,轻便", "29.90", 120),
                product(spot, spot.getName() + "手账明信片套装", "纸品", "包含景点故事卡、路线印章页和空白手账贴纸，适合盖章收藏。", "学生,实惠", "39.00", 80),
                product(spot, spot.getName() + "主题帆布袋", "日用", "融合景点文化符号和城市旅行地图，容量适合一日游随身携带。", "礼物,日用", "69.00", 60),
                product(spot, spot.getName() + "亲子拼图", "玩具", "用插画方式还原景点核心看点，适合亲子旅行后继续认识地方文化。", "亲子,玩具", "59.00", 50)
        );
    }

    private CulturalProduct product(ScenicSpot spot, String name, String category, String description,
                                    String tags, String price, Integer stock) {
        CulturalProduct product = new CulturalProduct();
        product.setSpotId(spot.getId());
        product.setName(name);
        product.setCategory(category);
        product.setDescription(description);
        product.setTags(tags);
        product.setPrice(new BigDecimal(price));
        product.setStock(stock);
        product.setImageUrl(productImage(spot.getName(), category));
        product.setCreatedAt(LocalDateTime.now());
        return product;
    }

    private String productImage(String spotName, String category) {
        String query = UriUtils.encodeQueryParam(spotName + " 文创 " + category, StandardCharsets.UTF_8);
        return "https://tse1.mm.bing.net/th?q=" + query + "&w=720&h=540&c=7&rs=1&p=0&o=5&pid=1.7";
    }
}
