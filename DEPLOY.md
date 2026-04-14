# Moment — 部署指南

## 项目结构

```
moment-web/
├── index.html              # 入口 HTML
├── src/
│   ├── main.jsx            # React 入口
│   └── App.jsx             # 完整应用（所有页面）
├── vite.config.js          # Vite 构建配置
├── vercel.json             # Vercel 部署配置
├── netlify.toml            # Netlify 部署配置
├── package.json            # 依赖和脚本
└── dist/                   # 构建产物（已生成）
```

## 页面清单

| 路由 | 页面 | 说明 |
|------|------|------|
| `#/` | Home | 品牌首页，统计数据，精选场地，流程说明 |
| `#/venues` | Venues | 15 个场地列表，筛选 + 排序 |
| `#/venue/{id}` | Venue Detail | 每个场地的独立详情页（× 15） |
| `#/planners` | Planners | 10 家策划商家列表 |
| `#/planner/{id}` | Planner Detail | 每家策划商的独立详情页（× 10） |
| `#/consult` | Consultation | 咨询表单，支持从场地/策划商页面预填 |
| `#/about` | About | 品牌故事 + 服务介绍 |

---

## 方式一：Vercel 部署（推荐，最简单）

### 前提
- 一个 GitHub 账号
- 一个 Vercel 账号（vercel.com，用 GitHub 登录即可，免费）

### 步骤

1. **上传代码到 GitHub**
   ```bash
   cd moment-web
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/你的用户名/moment-web.git
   git push -u origin main
   ```

2. **在 Vercel 上导入**
   - 打开 vercel.com → New Project → Import Git Repository
   - 选择你刚才推送的 moment-web 仓库
   - Framework 选 Vite（会自动检测）
   - 点 Deploy

3. **完成**
   - Vercel 会自动构建并分配一个域名，比如 `moment-web.vercel.app`
   - 之后每次你推送代码到 GitHub，网站会自动更新

### 绑定自定义域名（可选）
   - Vercel 后台 → Settings → Domains → 输入你的域名
   - 按提示去域名服务商那里添加 DNS 记录

---

## 方式二：Netlify 部署

### 步骤

1. 代码推送到 GitHub（同上）
2. 打开 netlify.com → New site from Git → 选仓库
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 点 Deploy

---

## 本地开发

```bash
cd moment-web
npm install        # 安装依赖
npm run dev        # 启动开发服务器（localhost:5173）
npm run build      # 构建生产版本
npm run preview    # 预览生产版本
```

---

## 后续扩展

### 数据动态化
当前场地和策划商数据写在 App.jsx 里。后续可以：
- 抽成独立 JSON 文件（`src/data/venues.json`、`src/data/planners.json`）
- 接入后端 API（Supabase / Firebase / 自建）
- 用自动采集脚本定期更新 JSON

### 表单后端
当前咨询表单只有前端。要真正收到用户提交的信息，可以：
- 接入 Formspree.io（最简单，免费 50 条/月）
- 接入 Google Sheets API
- 自建后端

### 打包成手机 App
```bash
npm install @capacitor/core @capacitor/cli
npx cap init Moment com.moment.app
npx cap add ios
npx cap add android
npm run build
npx cap sync
npx cap open ios    # 在 Xcode 中打开
npx cap open android # 在 Android Studio 中打开
```

---

## 成本

| 项目 | 费用 |
|------|------|
| Vercel 托管 | 免费（个人项目） |
| 自定义域名 | ~$15/年（.com） |
| Formspree 表单 | 免费（50条/月） |
| Google Places API | ~$5/月（数据更新用） |
| Claude API（数据提取） | ~$0.50/次全量更新 |
| **总计** | **< $20/月** |
