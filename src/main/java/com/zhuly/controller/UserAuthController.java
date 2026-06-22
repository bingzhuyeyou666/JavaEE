/**
 * 本文件定义 UserAuthController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import com.zhuly.config.UserAuthInterceptor;
import com.zhuly.domain.UserProfile;
import com.zhuly.repository.UserProfileRepository;
import java.util.HashMap;
import java.util.Map;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.UUID;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

/**
 * UserAuthController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserProfileRepository userRepository;

    // 校验普通用户账号密码并建立登录会话
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

    // 注册新用户并在注册成功后自动登录
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

    // 退出普通用户账号并清除登录会话
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.removeAttribute(UserAuthInterceptor.USER_SESSION_KEY);
        session.removeAttribute(UserAuthInterceptor.USER_ID_KEY);
        session.removeAttribute(UserAuthInterceptor.USER_NAME_KEY);
        return body(false, null);
    }

    // 查询当前普通用户的登录状态和基本资料
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

    @PutMapping("/profile")
    public Map<String, Object> updateProfile(@RequestBody ProfileRequest request, HttpSession session) {
        UserProfile user = currentUser(session);
        String preset = clean(request.getAvatarPreset());
        if (!Arrays.asList("mountain", "river", "lantern", "cloud").contains(preset)) {
            throw new IllegalArgumentException("默认头像不存在");
        }
        user.setAvatarPreset(preset);
        user.setAvatarUrl("");
        return body(true, userRepository.save(user));
    }

    @PostMapping(value = "/profile/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> uploadAvatar(@RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        UserProfile user = currentUser(session);
        if (file == null || file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("请选择图片文件");
        }
        if (file.getSize() > 5L * 1024 * 1024) {
            throw new IllegalArgumentException("头像图片不能超过 5MB");
        }
        Path root = Paths.get("data", "uploads", "avatars").toAbsolutePath().normalize();
        Files.createDirectories(root);
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString().replace("-", "") + (extension == null ? ".jpg" : "." + extension.toLowerCase());
        Path target = root.resolve(filename).normalize();
        file.transferTo(target.toFile());
        user.setAvatarUrl("/uploads/avatars/" + filename);
        return body(true, userRepository.save(user));
    }

    private UserProfile currentUser(HttpSession session) {
        Object id = session.getAttribute(UserAuthInterceptor.USER_ID_KEY);
        if (!(id instanceof Long)) {
            throw new IllegalArgumentException("请先登录");
        }
        return userRepository.findById((Long) id).orElseThrow(() -> new IllegalArgumentException("用户不存在"));
    }

    // 创建、写入或提交 saveSession 对应的业务数据
    private void saveSession(HttpSession session, UserProfile user) {
        session.setAttribute(UserAuthInterceptor.USER_SESSION_KEY, true);
        session.setAttribute(UserAuthInterceptor.USER_ID_KEY, user.getId());
        session.setAttribute(UserAuthInterceptor.USER_NAME_KEY, user.getUsername());
    }

    // 组装 body 所需的返回对象或业务数据
    private Map<String, Object> body(boolean loggedIn, UserProfile user) {
        Map<String, Object> body = new HashMap<>();
        body.put("loggedIn", loggedIn);
        body.put("userId", user != null ? user.getId() : null);
        body.put("username", user != null ? user.getUsername() : null);
        body.put("email", user != null ? user.getEmail() : null);
        body.put("avatarUrl", user != null ? user.getAvatarUrl() : null);
        body.put("avatarPreset", user != null && user.getAvatarPreset() != null ? user.getAvatarPreset() : "mountain");
        body.put("avatarFrame", user != null && user.getAvatarFrame() != null ? user.getAvatarFrame() : "none");
        return body;
    }

    // 更新并规范化 clean 对应的数据
    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    public static class LoginRequest {
        private String username;
        private String email;
        private String password;

        // 查询并返回 getUsername 对应的数据
        public String getUsername() {
            return username;
        }

        // 更新并规范化 setUsername 对应的数据
        public void setUsername(String username) {
            this.username = username;
        }

        // 查询并返回 getEmail 对应的数据
        public String getEmail() {
            return email;
        }

        // 更新并规范化 setEmail 对应的数据
        public void setEmail(String email) {
            this.email = email;
        }

        // 查询并返回 getPassword 对应的数据
        public String getPassword() {
            return password;
        }

        // 更新并规范化 setPassword 对应的数据
        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class ProfileRequest {
        private String avatarPreset;
        public String getAvatarPreset() { return avatarPreset; }
        public void setAvatarPreset(String avatarPreset) { this.avatarPreset = avatarPreset; }
    }
}
