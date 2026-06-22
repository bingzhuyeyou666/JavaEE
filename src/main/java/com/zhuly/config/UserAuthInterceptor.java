/**
 * 本文件定义 UserAuthInterceptor 配置组件，负责应用启动、鉴权或框架配置
 */
package com.zhuly.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * UserAuthInterceptor 负责应用运行所需的框架配置或启动初始化
 */
@Component
public class UserAuthInterceptor implements HandlerInterceptor {

    public static final String USER_SESSION_KEY = "USER_AUTHENTICATED";
    public static final String USER_NAME_KEY = "USER_NAME";
    public static final String USER_ID_KEY = "USER_ID";

    // 执行 preHandle 方法对应的业务处理
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object authenticated = request.getSession().getAttribute(USER_SESSION_KEY);
        if (Boolean.TRUE.equals(authenticated)) {
            return true;
        }
        response.sendRedirect("/login?role=user");
        return false;
    }
}
