/**
 * 本文件定义 SpotKnowledgeBase 服务，负责封装对应业务规则和数据处理流程
 */
package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * SpotKnowledgeBase 集中实现本模块的业务规则，并协调数据访问或第三方服务
 */
@Component
public class SpotKnowledgeBase {

    // 执行 documents 方法对应的业务处理
    public List<String> documents(ScenicSpot spot) {
        List<String> docs = new ArrayList<>();
        docs.add("景点名称：" + spot.getName());
        docs.add("景点类型：" + spot.getType());
        docs.add("位置地址：" + spot.getAddress());
        docs.add("开放时间：" + spot.getOpenHours());
        docs.add("联系电话：" + spot.getPhone());
        docs.add("门票价格：" + (spot.getPrice().signum() == 0 ? "免费" : spot.getPrice() + "元"));
        docs.add("景点评分：" + spot.getRating());
        docs.add("基本介绍：" + spot.getDescription());
        docs.add("成立与发展过程：" + spot.getHistory());
        docs.add("游玩亮点：" + spot.getHighlights());
        docs.add("旅游攻略：" + spot.getGuide());
        docs.add("最佳季节：" + spot.getBestSeason());
        docs.add("注意事项：" + spot.getNotice());
        docs.addAll(extraDocuments(spot.getName()));
        return docs;
    }

    // 查询并返回 search 对应的数据
    public List<String> search(ScenicSpot spot, String question) {
        String normalized = question.toLowerCase(Locale.ROOT);
        List<String> docs = documents(spot);
        List<String> hits = docs.stream()
                .filter(doc -> score(doc, normalized) > 0)
                .sorted((left, right) -> Integer.compare(score(right, normalized), score(left, normalized)))
                .limit(5)
                .collect(Collectors.toList());
        if (hits.isEmpty()) {
            return docs.stream().limit(5).collect(Collectors.toList());
        }
        return hits;
    }

    // 计算 score 对应的业务结果
    private int score(String doc, String question) {
        int score = 0;
        for (String token : tokens(question)) {
            if (token.length() > 1 && doc.toLowerCase(Locale.ROOT).contains(token)) {
                score += token.length();
            }
        }
        for (String keyword : Arrays.asList("历史", "发展", "成立", "怎么玩", "攻略", "季节", "门票", "开放", "交通", "注意", "亮点")) {
            if (question.contains(keyword) && doc.contains(keyword)) {
                score += 8;
            }
        }
        return score;
    }

    // 组装 tokens 所需的返回对象或业务数据
    private List<String> tokens(String question) {
        return Arrays.stream(question.replaceAll("[，。？！、；：,.!?;:]", " ").split("\\s+"))
                .filter(token -> !token.trim().isEmpty())
                .collect(Collectors.toList());
    }

    // 执行 extraDocuments 方法对应的业务处理
    private List<String> extraDocuments(String spotName) {
        if (spotName.contains("蜀南竹海")) {
            return Arrays.asList(
                    "补充资料：蜀南竹海以大面积竹林景观闻名，常见游线包括翡翠长廊、七彩飞瀑、忘忧谷、仙女湖等。",
                    "补充资料：景区适合避暑和摄影，雨后瀑布水量更大，但栈道湿滑，需要注意安全。"
            );
        }
        if (spotName.contains("李庄")) {
            return Arrays.asList(
                    "补充资料：李庄古镇在抗战时期接纳多所高校和研究机构，形成重要文化记忆。",
                    "补充资料：李庄白肉、古街夜景、营造学社旧址和宗祠建筑是常见体验重点。"
            );
        }
        if (spotName.contains("三江口")) {
            return Arrays.asList(
                    "补充资料：三江口位于金沙江、岷江汇流形成长江的城市景观区域，是宜宾重要城市名片。",
                    "补充资料：适合傍晚和夜间游览，可结合滨江步道、合江门、城市灯光进行短线游。"
            );
        }
        return new ArrayList<>();
    }
}
