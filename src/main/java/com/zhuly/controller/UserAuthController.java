package com.zhuly.controller;

import com.zhuly.config.UserAuthInterceptor;
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
@RequestMapping("/api/auth")
public class UserAuthController {

    @Value("${travel.user.username:demo}")
    private String username;

    @Value("${travel.user.password:demo123}")
    private String password;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpSession session) {
        if (!username.equals(request.getUsername()) || !password.equals(request.getPassword())) {
            throw new IllegalArgumentException("用户账号或密码错误");
        }
        session.setAttribute(UserAuthInterceptor.USER_SESSION_KEY, true);
        session.setAttribute(UserAuthInterceptor.USER_NAME_KEY, username);
        return body(true, username);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.removeAttribute(UserAuthInterceptor.USER_SESSION_KEY);
        session.removeAttribute(UserAuthInterceptor.USER_NAME_KEY);
        return body(false, null);
    }

    @GetMapping("/status")
    public Map<String, Object> status(HttpSession session) {
        boolean loggedIn = Boolean.TRUE.equals(session.getAttribute(UserAuthInterceptor.USER_SESSION_KEY));
        Object currentUsername = session.getAttribute(UserAuthInterceptor.USER_NAME_KEY);
        return body(loggedIn, loggedIn && currentUsername != null ? currentUsername.toString() : null);
    }

    private Map<String, Object> body(boolean loggedIn, String username) {
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
