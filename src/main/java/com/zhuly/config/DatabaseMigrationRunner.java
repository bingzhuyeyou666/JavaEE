/**
 * 本文件定义 DatabaseMigrationRunner 配置组件，负责应用启动、鉴权或框架配置
 */
package com.zhuly.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * DatabaseMigrationRunner 负责应用运行所需的框架配置或启动初始化
 */
@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    // 在应用启动阶段执行本组件的初始化任务
    @Override
    public void run(ApplicationArguments args) {
        jdbcTemplate.execute("ALTER TABLE scenic_spot ALTER COLUMN cover_image VARCHAR(1000)");
        jdbcTemplate.execute("ALTER TABLE scenic_spot_gallery ALTER COLUMN gallery VARCHAR(1000)");
        jdbcTemplate.execute("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(1000)");
        jdbcTemplate.execute("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS avatar_preset VARCHAR(50) DEFAULT 'mountain'");
        jdbcTemplate.execute("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS avatar_frame VARCHAR(50) DEFAULT 'none'");
    }
}
