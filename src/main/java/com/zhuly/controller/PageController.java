package com.zhuly.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({
            "/",
            "/guide",
            "/guide/nearby",
            "/route",
            "/spots/{id}",
            "/me",
            "/submit-spot",
            "/login",
            "/admin",
            "/app",
            "/app/",
            "/app/guide",
            "/app/guide/nearby",
            "/app/route",
            "/app/spots/{id}",
            "/app/me",
            "/app/submit-spot",
            "/app/login",
            "/app/admin"
    })
    public String app() {
        return "forward:/app/index.html";
    }

    @GetMapping("/admin/login")
    public String adminLogin() {
        return "redirect:/login?role=admin";
    }
}
