# 陌路寻阡

陌路寻阡是一个智慧文旅综合服务平台，面向游客、内容贡献者和平台运营者，提供景点发现、智能导览、附近推荐、路线规划、景点预约热线查询、足迹打卡、旅行广场和后台管理等功能。项目不提供在线预约、预约签到或核销服务。

项目采用前后端一体部署：后端为 Spring Boot，前端为 React + Vite，生产构建后会同步到 Spring Boot 的静态资源目录。

## 技术栈

- Java 8
- Spring Boot 2.7.x
- Spring MVC / Spring Data JPA / Bean Validation
- H2 文件数据库
- React 19 / Vite 7
- GSAP / lucide-react
- 百度地图与天气接口，可选
- 阿里云百炼 OpenAI 兼容接口，可选

## 项目结构

```text
.
├── frontend/                         React + Vite 前端
├── src/main/java/com/zhuly/           Spring Boot 后端
├── src/test/java/com/zhuly/            后端自动化测试
├── src/main/resources/static/app/     前端生产构建产物
├── src/main/resources/application.yml 应用配置
├── docs/                              使用说明和项目文档
├── data/                              H2 文件数据库目录
├── PRODUCT.md                         产品定位与界面设计原则
├── run.bat                            一键构建并启动
└── 启动陌路寻阡.bat                   启动脚本
```

## 快速启动

确保本机已安装：

- JDK 8 或更高版本
- Maven
- Node.js / npm

最简单的方式是双击：

```text
启动陌路寻阡.bat
```

或在命令行运行：

```powershell
.\run.bat
```

脚本会自动完成这些步骤：

1. 检查 Java、Maven、npm 环境
2. 停止当前项目里旧的 Spring Boot 进程
3. 安装前端依赖，如果 `node_modules` 不存在
4. 执行 `npm run build`
5. 执行 `mvn -q -DskipTests clean package`
6. 启动应用并打开浏览器

默认访问地址：

```text
http://localhost:8080/app/
```

## 开发模式

先启动后端：

```powershell
mvn spring-boot:run
```

再启动前端开发服务器：

```powershell
cd frontend
npm install
npm run dev
```

Vite 会把 `/api` 请求代理到 `http://localhost:8080`。开发时可以使用 Vite 输出的本地地址访问前端。

## 生产构建

前端构建：

```powershell
cd frontend
npm run build
```

构建产物会写入：

```text
src/main/resources/static/app/
```

后端打包：

```powershell
mvn -q -DskipTests package
```

打包后的 JAR：

```text
target/travel-cloud-map-0.0.1-SNAPSHOT.jar
```

## 测试

后端包含基础冒烟测试，用于检查应用上下文、首页转发、景点初始化数据和公开配置接口：

```powershell
mvn test
```

提交或发布前建议依次执行：

```powershell
cd frontend
npm run build
cd ..
mvn test
mvn package
```

## 默认账号

用户端：

```text
用户名：demo
密码：demo123
```

管理后台：

```text
用户名：admin
密码：admin123
```

管理后台地址：

```text
http://localhost:8080/app/admin
```

## 数据库

项目使用 H2 文件数据库，默认数据文件位于：

```text
data/zhuly
```

H2 控制台：

```text
http://localhost:8080/h2-console
```

连接信息：

```text
JDBC URL: jdbc:h2:file:./data/zhuly
User Name: sa
Password: 留空
```

## 地图与天气配置

百度地图和天气服务默认关闭或使用本地备用结果，项目中不保存真实 API Key。需要使用第三方服务时，在启动前设置：

```powershell
$env:BAIDU_MAP_ENABLED="true"
$env:BAIDU_MAP_API_KEY="你的百度地图 API Key"
$env:BAIDU_WEATHER_API_KEY="你的百度天气 API Key"
mvn spring-boot:run
```

不要把真实密钥直接写入 `application.yml` 或提交到版本库。

## AI 助手配置

景点 AI 导览助手支持阿里云百炼 OpenAI 兼容接口。启动前可设置环境变量：

```powershell
$env:DASHSCOPE_API_KEY="你的百炼 API Key"
mvn spring-boot:run
```

也可以使用：

```powershell
$env:BAILIAN_API_KEY="你的百炼 API Key"
```

默认模型为 `qwen-plus`。未配置密钥或远程请求失败时，系统会回退到本地景点知识库回答。

## 账号配置

默认账号只用于本地演示。正式部署前应通过环境变量修改：

```powershell
$env:APP_DEMO_USERNAME="自定义用户账号"
$env:APP_DEMO_PASSWORD="自定义用户密码"
$env:APP_ADMIN_USERNAME="自定义管理员账号"
$env:APP_ADMIN_PASSWORD="高强度管理员密码"
```

## 主要功能

- 首页：Hero 轮播、精选景点、平台能力展示
- 景点发现：景点列表、搜索筛选、评分和距离信息
- 景点详情：图文介绍、开放时间、票价、天气、路线入口、AI 导览
- 附近推荐：定位后扫描周边景点信号
- 路线规划：支持选择 2-5 个景点生成游览顺序
- 预约咨询：在景点详情页展示该景点的官方预约热线，由用户自行致电咨询
- 足迹打卡：基于距离的景点打卡与徽章解锁
- 旅行广场：发布内容、评论互动、查看动态详情
- 景点申报：用户提交新景点，后台审核入库
- 个人中心：资料、足迹、徽章、友好积分、申报记录
- 管理后台：景点管理、首页内容管理、申报审核

## 常用接口入口

```text
GET  /api/home/hero
GET  /api/home/featured-spots
GET  /api/spots
GET  /api/spots/{id}
POST /api/routes/plan
POST /api/spots/{spotId}/check-ins
GET  /api/spots/{spotId}/crowd-index
POST /api/spots/{spotId}/assistant
GET  /api/community/square/posts
POST /api/community/submissions
```

## 项目文档

- `docs/软件使用说明书.md`：按照当前可运行版本编写的安装与操作说明。
- `docs/软著申报核验清单.md`：用于检查源码、说明书、截图和申请信息是否一致。
- `docs/product-design-prd.md`：产品需求与界面设计记录。
- `PRODUCT.md`：简短的产品定位和视觉设计原则，供开发过程中统一界面风格使用，不参与程序构建和运行。

## 注意事项

- 百度地图、天气和 AI 服务均依赖第三方网络、账号配额与密钥，不能保证离线环境下提供实时结果。
- 路线规划结果依据景点坐标计算，用于行程参考，不等同于实时道路导航。
- 前端代码修改后，如果要让 Spring Boot 直接提供最新页面，需要重新执行 `cd frontend && npm run build`。
- 项目根目录的 `data/` 是本地运行数据，删除后会重新初始化数据库。
- 英文工程标识仍保留为 `travel-cloud-map`，用于 Maven 构建、JAR 文件名和部分本地存储键名。
