package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpotRecommendationService {

    private final ScenicSpotRepository spotRepository;

    public List<ScenicSpot> recommend(ScenicSpot target, int limit) {
        return spotRepository.findByApprovedTrue().stream()
                .filter(candidate -> !candidate.getId().equals(target.getId()))
                .map(candidate -> new ScoredSpot(candidate, score(target, candidate)))
                .filter(item -> item.score > 0)
                .sorted(Comparator.comparingInt(ScoredSpot::getScore).reversed()
                        .thenComparing(item -> item.spot.getRating(), Comparator.reverseOrder()))
                .limit(Math.max(1, Math.min(limit, 12)))
                .map(item -> item.spot)
                .collect(Collectors.toList());
    }

    private int score(ScenicSpot source, ScenicSpot candidate) {
        Set<String> sourceTokens = tokens(source);
        Set<String> candidateTokens = tokens(candidate);
        Set<String> common = new HashSet<>(sourceTokens);
        common.retainAll(candidateTokens);
        int score = common.size() * 18;
        if (same(source.getType(), candidate.getType())) score += 45;
        if (sameProvince(source, candidate)) score += 5;
        score += semanticBoost(sourceTokens, candidateTokens);
        score += (int) Math.round(candidate.getRating() * 2);
        return score;
    }

    private int semanticBoost(Set<String> left, Set<String> right) {
        int score = 0;
        for (Set<String> group : semanticGroups()) {
            if (!disjoint(left, group) && !disjoint(right, group)) score += 35;
        }
        return score;
    }

    private List<Set<String>> semanticGroups() {
        return Arrays.asList(
                set("古城", "古镇", "古街", "街巷", "水乡", "驿道", "古村"),
                set("名山", "山岳", "雪山", "登山", "徒步", "云海", "佛教名山", "道教"),
                set("佛教", "古寺", "石窟", "石刻", "摩崖", "祠堂", "宗教"),
                set("博物馆", "考古", "遗址", "古蜀", "青铜器", "化石"),
                set("湖泊", "湿地", "海子", "瀑布", "峡谷", "森林"),
                set("红色文化", "长征", "纪念", "名人故里"),
                set("民族", "藏族", "羌族", "彝族", "摩梭文化", "村寨"),
                set("世界遗产", "自然遗产", "文化遗产")
        );
    }

    private Set<String> tokens(ScenicSpot spot) {
        String text = join(spot.getName(), spot.getType(), spot.getTags(), spot.getHighlights(),
                spot.getDescription(), spot.getHistory()).toLowerCase(Locale.ROOT);
        Set<String> result = new HashSet<>();
        for (String token : text.split("[|、，,。；;：:\\s]+")) {
            if (token.length() >= 2) result.add(token);
        }
        for (Set<String> group : semanticGroups()) {
            for (String keyword : group) {
                if (text.contains(keyword.toLowerCase(Locale.ROOT))) result.add(keyword);
            }
        }
        return result;
    }

    private boolean sameProvince(ScenicSpot left, ScenicSpot right) {
        return safe(left.getAddress()).contains("四川") == safe(right.getAddress()).contains("四川");
    }

    private boolean same(String left, String right) {
        return !safe(left).isEmpty() && safe(left).equals(safe(right));
    }

    private boolean disjoint(Set<String> left, Set<String> right) {
        for (String item : left) if (right.contains(item)) return false;
        return true;
    }

    private Set<String> set(String... value) {
        return new HashSet<>(Arrays.asList(value));
    }

    private String join(String... values) {
        return Arrays.stream(values).map(this::safe).collect(Collectors.joining(" "));
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private static class ScoredSpot {
        private final ScenicSpot spot;
        private final int score;
        private ScoredSpot(ScenicSpot spot, int score) {
            this.spot = spot;
            this.score = score;
        }
        private int getScore() { return score; }
    }
}
