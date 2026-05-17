package com.zhuly.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class UserAuthInterceptor implements HandlerInterceptor {

    public static final String USER_SESSION_KEY = "USER_AUTHENTICATED";
    public static final String USER_NAME_KEY = "USER_NAME";

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
