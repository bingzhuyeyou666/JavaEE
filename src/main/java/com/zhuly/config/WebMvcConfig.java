/**
 * 本文件定义 WebMvcConfig 配置组件，负责应用启动、鉴权或框架配置
 */
package com.zhuly.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * WebMvcConfig 负责应用运行所需的框架配置或启动初始化
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final AdminAuthInterceptor adminAuthInterceptor;
    private final UserAuthInterceptor userAuthInterceptor;

    public WebMvcConfig(AdminAuthInterceptor adminAuthInterceptor, UserAuthInterceptor userAuthInterceptor) {
        this.adminAuthInterceptor = adminAuthInterceptor;
        this.userAuthInterceptor = userAuthInterceptor;
    }

    // 创建、写入或提交 addInterceptors 对应的业务数据
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminAuthInterceptor)
                .addPathPatterns("/admin", "/api/admin/**")
                .excludePathPatterns("/api/admin/auth/**");
        registry.addInterceptor(userAuthInterceptor)
                .addPathPatterns("/me", "/me/**", "/submit-spot");
    }

    // 创建、写入或提交 addResourceHandlers 对应的业务数据
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get("data", "uploads").toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath + "/");
    }
}
