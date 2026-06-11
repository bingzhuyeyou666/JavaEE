# 陌路寻景

陌路寻景是一个智慧文旅综合服务平台，面向游客、内容贡献者和平台运营者，提供景点发现、智能导览、附近推荐、路线规划、预约票务、足迹打卡、旅行广场和后台管理等功能。

项目采用前后端一体部署：后端为 Spring Boot，前端为 React + Vite，生产构建后会同步到 Spring Boot 的静态资源目录。

## 技术栈

- Java 8
- Spring Boot 2.7.x
- Spring MVC / Spring Data JPA / Bean Validation
- H2 文件数据库
- React 19 / Vite 7
- GSAP / lucide-react
- 百度地图与天气接口
- 阿里云百炼 OpenAI 兼容接口，可选

## 项目结构

```text
.
├── frontend/                         React + Vite 前端
├── src/main/java/com/zhuly/           Spring Boot 后端
├── src/main/resources/static/app/     前端生产构建产物
├── src/main/resources/application.yml 应用配置
├── data/                              H2 文件数据库目录
├── run.bat                            一键构建并启动
└── 启动陌路寻景.bat                   启动脚本
```

## 快速启动

确保本机已安装：

- JDK 8 或更高版本
- Maven
- Node.js / npm

最简单的方式是双击：

```text
启动陌路寻景.bat
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

## 主要功能

- 首页：Hero 轮播、精选景点、平台能力展示
- 景点发现：景点列表、搜索筛选、评分和距离信息
- 景点详情：图文介绍、开放时间、票价、天气、路线入口、AI 导览
- 附近推荐：定位后扫描周边景点信号
- 路线规划：支持选择 2-5 个景点生成游览顺序
- 预约票务：创建预约、查看预约、取消预约、核销码展示
- 足迹打卡：基于距离的景点打卡与徽章解锁
- 旅行广场：发布内容、评论互动、查看动态详情
- 景点申报：用户提交新景点，后台审核入库
- 个人中心：资料、足迹、徽章、预约、申报记录
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
GET  /api/spots/{spotId}/assistant
POST /api/reservations
GET  /api/community/posts
POST /api/submissions
```

## 注意事项

- `application.yml` 中已有百度地图和天气配置，可按需替换为自己的 Key。
- 前端代码修改后，如果要让 Spring Boot 直接提供最新页面，需要重新执行 `cd frontend && npm run build`。
- 项目根目录的 `data/` 是本地运行数据，删除后会重新初始化数据库。
- 英文工程标识仍保留为 `travel-cloud-map`，用于 Maven 构建、JAR 文件名和部分本地存储键名。
