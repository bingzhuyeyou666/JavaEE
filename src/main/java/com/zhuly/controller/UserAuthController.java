package com.zhuly.controller;

import com.zhuly.config.UserAuthInterceptor;
import com.zhuly.domain.UserProfile;
import com.zhuly.repository.UserProfileRepository;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserProfileRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpSession session) {
        UserProfile user = userRepository.findByUsername(clean(request.getUsername()))
                .orElseThrow(() -> new IllegalArgumentException("用户账号或密码错误"));
        if (!clean(request.getPassword()).equals(user.getPassword())) {
            throw new IllegalArgumentException("用户账号或密码错误");
        }
        saveSession(session, user);
        return body(true, user);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody LoginRequest request, HttpSession session) {
        String username = clean(request.getUsername());
        String email = clean(request.getEmail());
        String password = clean(request.getPassword());
        if (username.length() < 2) {
            throw new IllegalArgumentException("用户名至少需要 2 个字符");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("密码至少需要 6 位");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("用户名已被注册");
        }
        if (!email.isEmpty() && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("邮箱已被注册");
        }
        UserProfile user = new UserProfile();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setPoints(0);
        UserProfile saved = userRepository.save(user);
        saveSession(session, saved);
        return body(true, saved);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.removeAttribute(UserAuthInterceptor.USER_SESSION_KEY);
        session.removeAttribute(UserAuthInterceptor.USER_ID_KEY);
        session.removeAttribute(UserAuthInterceptor.USER_NAME_KEY);
        return body(false, null);
    }

    @GetMapping("/status")
    public Map<String, Object> status(HttpSession session) {
        boolean loggedIn = Boolean.TRUE.equals(session.getAttribute(UserAuthInterceptor.USER_SESSION_KEY));
        Object currentUserId = session.getAttribute(UserAuthInterceptor.USER_ID_KEY);
        if (loggedIn && currentUserId instanceof Long) {
            return userRepository.findById((Long) currentUserId)
                    .map(user -> body(true, user))
                    .orElseGet(() -> body(false, null));
        }
        return body(false, null);
    }

    private void saveSession(HttpSession session, UserProfile user) {
        session.setAttribute(UserAuthInterceptor.USER_SESSION_KEY, true);
        session.setAttribute(UserAuthInterceptor.USER_ID_KEY, user.getId());
        session.setAttribute(UserAuthInterceptor.USER_NAME_KEY, user.getUsername());
    }

    private Map<String, Object> body(boolean loggedIn, UserProfile user) {
        Map<String, Object> body = new HashMap<>();
        body.put("loggedIn", loggedIn);
        body.put("userId", user != null ? user.getId() : null);
        body.put("username", user != null ? user.getUsername() : null);
        body.put("email", user != null ? user.getEmail() : null);
        return body;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    public static class LoginRequest {
        private String username;
        private String email;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
