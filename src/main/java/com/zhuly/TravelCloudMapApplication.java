/**
 * 本文件定义 TravelCloudMapApplication 应用入口，负责启动陌路寻阡后端服务
 */
package com.zhuly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * TravelCloudMapApplication 是陌路寻阡后端应用的启动入口
 */
@EnableScheduling
@SpringBootApplication
public class TravelCloudMapApplication {

    // 执行 main 方法对应的业务处理
    public static void main(String[] args) {
        SpringApplication.run(TravelCloudMapApplication.class, args);
    }
}
