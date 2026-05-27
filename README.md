# 旅图云

智慧文旅综合服务平台，基于 Spring Boot 全栈实现。当前版本适合课程设计/毕业设计演示：使用 H2 内存数据库、Thymeleaf 页面、REST API 和内存缓存模拟 Redis。

## 技术栈

- Spring Boot 2.7.x
- Java 8
- Spring MVC / Spring Data JPA / Bean Validation
- H2 数据库
- Thymeleaf + 原生 JavaScript
- 百度地图 JS API：定位、导航、路线绘制

## 运行方式

本机需要安装 Maven 和 JDK 8 或更高版本。你也可以直接双击 `run.bat`，脚本会使用 `D:\JDK18` 作为 JDK。

```bash
mvn spring-boot:run
```

AI 助手已接入阿里云百炼 OpenAI 兼容接口。启动前先在本机设置环境变量，避免把密钥写进代码：

```powershell
$env:DASHSCOPE_API_KEY="你的百炼API Key"
mvn spring-boot:run
```

默认模型是 `qwen-plus`，可通过 `travel.ai.model` 或环境配置调整。未配置密钥或百炼请求失败时，系统会自动回退到本地景点知识库回答。

启动后访问：

- 用户端首页：http://localhost:8080/
- 个人中心：http://localhost:8080/me
- 管理后台：http://localhost:8080/admin
- H2 控制台：http://localhost:8080/h2-console

H2 JDBC URL：

```text
jdbc:h2:mem:zhuly
```

## 已实现功能

- 首页导览：景点列表、搜索、类型筛选、距离/评分/价格排序、公告展示
- 景点详情：基本信息、图文介绍、旅游攻略、天气趋势、百度地图一键导航
- 周边设施：停车场、厕所、饭店数据模型和后台 API
- 预约票务：创建预约、我的预约、取消预约、核销码
- 社区交互：评论评分、点赞、景点上报、我的申请
- 个人中心：足迹、勋章、预约、上报记录
- 管理后台：景点 CRUD、设施列表、评论隐藏、申请审核 API

## 四个创意功能

1. 旅游足迹地图
   - `POST /api/spots/{spotId}/check-ins`
   - 500 米内允许打卡，内存集合模拟 Redis Set。
   - 按 3/10/20 个景点解锁勋章。

2. 语音导览
   - `GET /api/spots/{spotId}/tts`
   - 当前返回模拟音频缓存 URL。
   - 后续可在 `TtsService` 中替换为阿里云/腾讯云 TTS 调用，并把 MP3 上传 OSS。

3. 拥堵指数
   - `GET /api/spots/{spotId}/crowd-index`
   - 基于当天预约人数/最大承载量计算舒适、一般、拥挤。
   - 每天凌晨通过定时任务清空计数。

4. 线路规划
   - `POST /api/routes/plan`
   - 支持 2-5 个景点，使用最近邻算法给出合理顺序。
   - 前端接入百度地图驾车路线绘制，后端保留最近邻排序和兜底距离估算。

## 默认演示账号

当前前端固定使用 `userId=1` 的 demo 用户，便于快速演示。接入登录后，把前端 `currentUserId` 替换为登录用户 ID 即可。
## React + Vite frontend

The React frontend is in `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

Dev URL: `http://localhost:5173/app/`

The Vite dev server proxies `/api` to `http://localhost:8080`, so keep Spring Boot running with:

```bash
mvn spring-boot:run
```

Production build output is written to `src/main/resources/static/app/`:

```bash
cd frontend
npm run build
```
