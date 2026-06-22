package com.zhuly;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:copyright-check;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "travel.map.enabled=false",
        "travel.map.api-key=",
        "travel.weather.api-key=",
        "travel.ai.enabled=false"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApplicationSmokeTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void applicationPageCanBeOpened() throws Exception {
        mockMvc.perform(get("/app/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/app/index.html"));
    }

    @Test
    void scenicSpotListContainsInitializedData() throws Exception {
        mockMvc.perform(get("/api/spots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(org.hamcrest.Matchers.greaterThan(0))));
    }

    @Test
    void publicConfigurationDoesNotExposeSecretKeys() throws Exception {
        mockMvc.perform(get("/api/config"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.not(
                        org.hamcrest.Matchers.containsString("api-key"))));
    }

    @Test
    void unavailableTtsIsReportedHonestly() throws Exception {
        mockMvc.perform(get("/api/spots/1/tts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void administratorCanUploadHeroImage() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "file", "hero.png", "image/png", new byte[]{1, 2, 3, 4});
        mockMvc.perform(multipart("/api/admin/home/hero/uploads")
                        .file(image)
                        .sessionAttr("ADMIN_AUTHENTICATED", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value(
                        org.hamcrest.Matchers.startsWith("/uploads/hero/")));
    }

    @Test
    void invalidRouteParameterReturnsChineseMessage() throws Exception {
        mockMvc.perform(post("/api/routes/plan?userId=null")
                        .contentType("application/json")
                        .content("{\"spotIds\":[1,2],\"mode\":\"driving\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(
                        "参数类型转换失败：参数“userId”的值“null”不能转换为整数"));
    }

    @Test
    void invalidJsonReturnsChineseMessage() throws Exception {
        mockMvc.perform(post("/api/routes/plan")
                        .contentType("application/json")
                        .content("{invalid-json}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(
                        "请求数据解析失败：提交内容不是有效的数据格式"));
    }
}
