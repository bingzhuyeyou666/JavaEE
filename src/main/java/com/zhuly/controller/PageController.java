package com.zhuly.controller;

import com.zhuly.repository.ScenicSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Comparator;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class PageController {

    private final ScenicSpotRepository spotRepository;
    @Value("${travel.map.api-key:}")
    private String baiduMapAk;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("spots", spotRepository.findByApprovedTrue().stream()
                .sorted(Comparator.comparingDouble(spot -> -spot.getRating()))
                .limit(8)
                .collect(Collectors.toList()));
        return "index";
    }

    @GetMapping("/guide")
    public String guide(Model model) {
        model.addAttribute("spots", spotRepository.findByApprovedTrue());
        model.addAttribute("baiduMapAk", baiduMapAk);
        return "guide";
    }

    @GetMapping("/route")
    public String route(Model model) {
        model.addAttribute("spots", spotRepository.findByApprovedTrue());
        model.addAttribute("baiduMapAk", baiduMapAk);
        return "route";
    }

    @GetMapping("/spots/{id}")
    @Transactional(readOnly = true)
    public String spot(@PathVariable Long id, Model model) {
        model.addAttribute("spot", spotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("景点不存在")));
        model.addAttribute("baiduMapAk", baiduMapAk);
        return "spot-detail";
    }

    @GetMapping("/me")
    public String me(Model model) {
        model.addAttribute("baiduMapAk", baiduMapAk);
        return "profile";
    }

    @GetMapping("/submit-spot")
    public String submitSpot() {
        return "spot-submit";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/admin/login")
    public String adminLogin() {
        return "redirect:/login?role=admin";
    }
}
