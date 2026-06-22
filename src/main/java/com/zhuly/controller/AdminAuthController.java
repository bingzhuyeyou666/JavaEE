/**
 * 本文件定义 AdminAuthController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
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

/**
 * AdminAuthController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @Value("${travel.admin.username:admin}")
    private String adminUsername;

    @Value("${travel.admin.password:admin123}")
    private String adminPassword;

    // 校验管理员账号密码并建立后台登录会话
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpSession session) {
        if (!adminUsername.equals(request.getUsername()) || !adminPassword.equals(request.getPassword())) {
            throw new IllegalArgumentException("管理员账号或密码错误");
        }
        session.setAttribute(AdminAuthInterceptor.ADMIN_SESSION_KEY, true);
        session.setAttribute(AdminAuthInterceptor.ADMIN_NAME_KEY, adminUsername);
        return statusBody(true, adminUsername);
    }

    // 退出管理后台并清除当前管理员会话
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return statusBody(false, null);
    }

    // 查询当前管理员的登录状态和账号信息
    @GetMapping("/status")
    public Map<String, Object> status(HttpSession session) {
        boolean loggedIn = Boolean.TRUE.equals(session.getAttribute(AdminAuthInterceptor.ADMIN_SESSION_KEY));
        Object username = session.getAttribute(AdminAuthInterceptor.ADMIN_NAME_KEY);
        return statusBody(loggedIn, loggedIn && username != null ? username.toString() : null);
    }

    // 查询并返回 statusBody 对应的数据
    private Map<String, Object> statusBody(boolean loggedIn, String username) {
        Map<String, Object> body = new HashMap<>();
        body.put("loggedIn", loggedIn);
        body.put("username", username);
        return body;
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // 查询并返回 getUsername 对应的数据
        public String getUsername() {
            return username;
        }

        // 更新并规范化 setUsername 对应的数据
        public void setUsername(String username) {
            this.username = username;
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
}
