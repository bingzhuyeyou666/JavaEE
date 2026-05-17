package com.zhuly.config;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    public static final String ADMIN_SESSION_KEY = "ADMIN_AUTHENTICATED";
    public static final String ADMIN_NAME_KEY = "ADMIN_NAME";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object authenticated = request.getSession().getAttribute(ADMIN_SESSION_KEY);
        if (Boolean.TRUE.equals(authenticated)) {
            return true;
        }

        if (request.getRequestURI().startsWith("/api/")) {
            writeUnauthorized(response);
            return false;
        }

        response.sendRedirect("/login?role=admin");
        return false;
    }

    private void writeUnauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"请先登录管理员账号\"}");
    }
}
