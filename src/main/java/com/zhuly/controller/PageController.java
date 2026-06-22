/**
 * 本文件定义 PageController 控制器，负责接收相关页面或接口请求并返回处理结果
 */
package com.zhuly.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * PageController 统一处理本模块的 HTTP 接口请求、参数校验和响应数据组织
 */
@Controller
public class PageController {

    // 将前端各业务路由统一转发到 React 应用首页
    @GetMapping({
            "/",
            "/guide",
            "/guide/locate",
            "/guide/nearby",
            "/route",
            "/square",
            "/square/posts/{id}",
            "/spots/{id}",
            "/me",
            "/submit-spot",
            "/login",
            "/admin",
            "/app",
            "/app/",
            "/app/guide",
            "/app/guide/locate",
            "/app/guide/nearby",
            "/app/route",
            "/app/square",
            "/app/square/posts/{id}",
            "/app/spots/{id}",
            "/app/me",
            "/app/submit-spot",
            "/app/login",
            "/app/admin"
    })
    // 执行 app 方法对应的业务处理
    public String app() {
        return "forward:/app/index.html";
    }

    // 将旧版管理员登录地址重定向到统一登录页面
    @GetMapping("/admin/login")
    public String adminLogin() {
        return "redirect:/login?role=admin";
    }
}
