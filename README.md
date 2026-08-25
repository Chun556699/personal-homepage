# 个人主页 · 博客 · 后台管理

一个**高性能、极简设计**的个人主页网站：排版驱动的干净视觉、近乎全静态的渲染策略、优雅的内容降级。使用 Next.js 16 + Payload CMS + Tailwind CSS 4 构建。

## ✨ 特性

### 性能
- **静态优先** — 首页/博客/文章页全部预渲染（ISR 增量再生），TTFB 极低，CDN 直接命中
- **零重运行时** — 无 Chakra UI、无 framer-motion、无 Lenis；动效仅用 ~1KB 的 IntersectionObserver 渐显组件 + 纯 CSS
- **自托管字体** — Geist 字体经 `next/font` 自托管并含中文回退栈，零布局偏移
- **尊重系统偏好** — 深浅色主题跟随系统，支持"减弱动态效果"

### 设计
- 排版驱动的极简编辑风：单栏内容、细分隔线、克制的紫罗兰点缀色
- 首屏纯 CSS 背景（渐变光晕 + 点阵网格），零 canvas 开销
- 滚动渐显节奏感、悬停微交互，全部 CSS transition 实现

### 内容
- **双内容源** — 个人信息/项目/技能在 `src/lib/site.ts` 一处配置；博客文章由 Payload CMS 管理
- **优雅降级** — Vercel 上没有数据库时，站点照常完整渲染默认内容；博客显示引导空态
- **SEO 全套** — Open Graph / Twitter Card / JSON-LD / `sitemap.xml` / `robots.txt` / RSS (`/feed.xml`)

### 后台
- Payload CMS 管理面板（`/admin`）：可视化发布文章（Lexical 富文本）、标签、草稿/发布状态
- 本地 SQLite 零依赖起步，一条环境变量切换到 Turso 云数据库

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) + React 19 |
| 样式 | Tailwind CSS 4 + @tailwindcss/typography |
| 动效 | 自绘 IntersectionObserver Reveal 组件（~1KB） |
| CMS | Payload 3.88（Lexical 富文本） |
| 数据库 | SQLite（本地文件 / Docker 卷 / Turso 远程） |

## 🚀 快速开始

```bash
npm install
cp .env.example .env   # 本地开发保持默认即可
npm run dev            # http://localhost:3000
```

| 地址 | 说明 |
|------|------|
| `/` | 主页 |
| `/blog` | 博客列表 |
| `/blog/[slug]` | 文章详情 |
| `/admin` | 管理后台（首次访问创建管理员） |
| `/feed.xml` | RSS 订阅 |

## ✏️ 修改你的个人信息

所有前台展示的个人信息集中在 **`src/lib/site.ts`**：

- 姓名、头衔、简介、邮箱
- GitHub / X 链接
- 项目列表（名称、描述、标签、链接）
- 技术栈标签

改完 `git push` 即自动部署生效。

## ☁️ 部署到 GitHub Pages（免费静态托管）

> 适合纯展示型站点：无需任何服务器/数据库，push 即发布。
> 访问地址：`https://<用户名>.github.io/personal-homepage`

1. 仓库推送到 GitHub 后，进入 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**
2. 完成。`.github/workflows/deploy-pages.yml` 已配置好：每次 push 到 main 自动构建部署

### 静态模式下的博客内容

GitHub Pages 无法运行数据库，静态模式下文章读取自仓库内 `src/content/posts.json`。两种写作方式：

- **本地后台写作（推荐）**
  ```bash
  npm run dev            # 本地 /admin 写作、发布
  npm run export:posts   # 导出文章到 src/content/posts.json
  git add . && git commit -m "post: 新文章" && git push   # 自动重新部署
  ```
- **直接编辑 JSON**：仿照现有条目修改 `src/content/posts.json` 即可

相关命令：`npm run build:static` 可在本地验证静态导出产物（输出到 `out/`）。

### 绑定自己的域名

1. **域名服务商 DNS 设置**（二选一或都配，生效需几分钟～48小时）：

   | 记录类型 | 主机记录 | 记录值 |
   |---------|---------|--------|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `chun556699.github.io` |

2. **仓库配置变量**：Settings → Secrets and variables → Actions → Variables 标签页，添加：

   | 变量名 | 值（示例） |
   |-------|-----------|
   | `CUSTOM_DOMAIN` | `www.yourdomain.com` |
   | `SITE_URL` | `https://www.yourdomain.com` |

   > 不设 `PAGES_BASE_PATH` 即按根路径部署（自定义域名下站点位于 `/` 而非子路径）。

3. 手动触发重新部署：Actions → Deploy to GitHub Pages → Run workflow；或随便 push 一次
4. DNS 生效后到 Settings → Pages 勾选 **Enforce HTTPS**

## ☁️ 部署到 Vercel

### 方式一：纯静态内容（推荐起步，零配置）

1. 仓库推送到 GitHub
2. [vercel.com/new](https://vercel.com/new) 导入仓库，框架自动识别 Next.js
3. 设置环境变量：
   - `PAYLOAD_SECRET` = 任意随机长字符串
   - `NEXT_PUBLIC_SERVER_URL` = 你的正式域名（如 `https://yourname.vercel.app`）
4. Deploy

> 此模式下站点以静态内容运行（性能最佳）。博客区显示空态提示，`/admin` 无法登录（没有数据库）。

### 方式二：启用云端后台（Turso，免费）

让博客在 Vercel 上真正可写：

```bash
# 1. 安装 Turso CLI 并创建数据库（免费）
turso db create homepage
turso db show homepage --url          # 得到 libsql://... 地址
turso db tokens create homepage       # 得到 auth token

# 2. 本地生成并向远程库推送表结构（一次性）
DATABASE_URL=libsql://<url> DATABASE_AUTH_TOKEN=<token> npx payload migrate:create init
DATABASE_URL=libsql://<url> DATABASE_AUTH_TOKEN=<token> npx payload migrate

# 3. 在 Vercel 项目设置中添加环境变量
#    DATABASE_URL = libsql://...
#    DATABASE_AUTH_TOKEN = ...
#    PAYLOAD_SECRET = ...
#    NEXT_PUBLIC_SERVER_URL = https://your-domain

# 4. 重新部署后访问 /admin 创建管理员，即可在线发文
```

> ⚠️ 注意：Serverless 平台的图片上传（Media 集合）不持久化。文章配图建议使用外链图床，或接入 `@payloadcms/plugin-cloud-storage` 等 S3 兼容存储。

### Docker 自托管（备选）

```bash
docker compose up -d --build
```

SQLite 与上传图片通过 volume 持久化，后台功能完整可用。

## 📁 项目结构

```
src/
├── app/
│   ├── (frontend)/           # 前台路由组（全静态/ISR）
│   │   ├── layout.tsx        # 根布局：字体、元数据、主题
│   │   ├── page.tsx          # 主页
│   │   ├── blog/             # 博客列表 + 详情
│   │   ├── not-found.tsx     # 404
│   │   ├── feed.xml/route.ts # RSS 订阅
│   │   └── globals.css       # 设计令牌 + 基础样式
│   ├── robots.ts / sitemap.ts
│   └── (payload)/            # Payload 后台路由组
├── collections/              # Users / Media / Posts / Projects
├── components/site/          # header / footer / reveal / theme-provider
├── lib/
│   ├── site.ts               # ⭐ 个人信息与项目配置（SSOT）
│   └── posts.ts              # 文章数据访问（带优雅降级）
└── payload.config.ts         # CMS 配置（SQLite/Turso 通吃）
```

## 📝 常用命令

```bash
npm run dev              # 开发服务器
npm run build            # 生产构建
npm run start            # 生产模式启动
npm run lint             # ESLint
npm run payload:types    # 重新生成 Payload 类型
```
