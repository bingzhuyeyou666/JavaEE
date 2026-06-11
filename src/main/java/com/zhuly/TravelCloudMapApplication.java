package com.zhuly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TravelCloudMapApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelCloudMapApplication.class, args);
    }
}
