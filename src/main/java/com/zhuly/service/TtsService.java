package com.zhuly.service;

import com.zhuly.domain.ScenicSpot;
import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TtsService {

    private final ScenicSpotRepository spotRepository;

    public String audioUrl(Long spotId) {
        ScenicSpot spot = spotRepository.findById(spotId).orElseThrow(() -> new IllegalArgumentException("景点不存在"));
        String textHash = Integer.toHexString(spot.getDescription().hashCode());
        return "/api/audio/mock/" + spotId + "-" + textHash + ".mp3";
    }
}
