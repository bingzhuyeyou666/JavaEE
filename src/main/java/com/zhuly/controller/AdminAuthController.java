package com.zhuly.controller;

import com.zhuly.config.AdminAuthInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @Value("${travel.admin.username:admin}")
    private String adminUsername;

    @Value("${travel.admin.password:admin123}")
    private String adminPassword;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpSession session) {
        if (!adminUsername.equals(request.getUsername()) || !adminPassword.equals(request.getPassword())) {
            throw new IllegalArgumentException("管理员账号或密码错误");
        }
        session.setAttribute(AdminAuthInterceptor.ADMIN_SESSION_KEY, true);
        session.setAttribute(AdminAuthInterceptor.ADMIN_NAME_KEY, adminUsername);
        return statusBody(true, adminUsername);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return statusBody(false, null);
    }

    @GetMapping("/status")
    public Map<String, Object> status(HttpSession session) {
        boolean loggedIn = Boolean.TRUE.equals(session.getAttribute(AdminAuthInterceptor.ADMIN_SESSION_KEY));
        Object username = session.getAttribute(AdminAuthInterceptor.ADMIN_NAME_KEY);
        return statusBody(loggedIn, loggedIn && username != null ? username.toString() : null);
    }

    private Map<String, Object> statusBody(boolean loggedIn, String username) {
        Map<String, Object> body = new HashMap<>();
        body.put("loggedIn", loggedIn);
        body.put("username", username);
        return body;
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
