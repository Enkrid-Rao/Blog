# rxx — 个人索引

`rxx` 的个人博客：数学、代码与文字之间的一些记录。笔记长期维护，日志按时间走，实验室留给还没成型的东西。

在线访问：https://www.251890411.xyz（`251890411.xyz` 会跳到 www）

## 技术栈

- **框架**：Astro 6（静态输出）+ TypeScript + 原生 CSS（无 Tailwind）
- **数学渲染**：KaTeX（构建时 `remark-math` + `rehype-katex`）
- **搜索**：构建时生成 `search-index.json`，浏览器内匹配，⌘K / Ctrl+K 打开，无第三方搜索库
- **字体**：JetBrains Mono（本地优先）、Noto Serif SC（显示子集）、Inter、Instrument Serif
- **部署**：Vercel 静态（`outputDirectory: dist`）
- **许可证**：内容 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，代码 MIT

## 本地开发

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器（热重载），默认 http://localhost:4321
npm run build        # 构建到 dist/
npm run preview      # 预览生产构建
npx astro check      # 类型检查
```

## 目录结构

```
src/
├─ content.config.ts            # 内容集合 schema
├─ content/notes/**/*.md        # 13 篇数论笔记
├─ data/
│  ├─ site.ts                   # 站点名 / 导航 / hero
│  ├─ taxonomy.ts               # 学科 / 课程 / 章节元数据
│  ├─ posts.ts                  # 日志与类型路由
│  └─ projects.ts               # 实验室项目
├─ lib/
│  ├─ notes.ts                  # 排序、阅读时长、日期
│  ├─ math.ts                   # 标题行内公式
│  ├─ tags.ts                   # 标签聚合
│  └─ search.ts                 # 搜索匹配
├─ layouts/                     # BaseLayout、NoteLayout
├─ components/                  # 导航、页脚、笔记树、目录、⌘K 搜索等
├─ pages/                       # 首页 / 笔记（学科·课程·详情）/ 日志（类型·详情）
│                               # 实验室（详情·资源）/ 标签 / 归档 / 使用说明
│                               # 搜索 / RSS / search-index.json / 404
└─ styles/                      # global / home / pages / note / search
```

## 页面与交互

- 笔记：`/notes` → `/notes/[subject]` → `/notes/[subject]/[course]` → `/notes/[...slug]`；桌面三栏、移动端折叠目录。
- 日志：`/writing` 与 `/writing/[type]`（随笔 / CTF / 项目），详情页 `/writing/[slug]`。
- 实验室：`/lab`、`/lab/diary`、`/lab/resources`（预留，不实现上传）。
- 索引：`/tags`、`/tags/[tag]`、`/archive`、`/guide`。
- 搜索：页头按钮或 ⌘K / Ctrl+K 打开面板，`/search` 为完整结果页；索引按需加载，不预取。

## 字体说明

- **JetBrains Mono**：本地优先。`src/styles/global.css` 顶部用 `@font-face` 的 `local(...)` 先找本地安装的字体，找不到再回退到 `public/fonts/jetbrains-mono/*.woff2`。代码统一用 `var(--font-mono)`。
- **Noto Serif SC**：`public/fonts/noto-serif-sc-display.woff2` 是**仅含显示字符的子集**（Google Fonts `text=` 生成，当前 272 字）。新增标题用到了新汉字后，需要重新生成子集，否则会回退到系统宋体。

## 部署到 Vercel

1. 仓库已与 Vercel 项目 `blog` 关联（`.vercel/project.json`），`buildCommand` 和 `outputDirectory` 已写在 `vercel.json`。
2. Vercel 项目的主域名是 `www.251890411.xyz`，apex 会 307 到 www；`vercel.json` 只保留 `blog` → www 的 301，**不要再加 www → apex**，否则两边会互相跳转。
3. 若以后想让 `blog.251890411.xyz` 直接服务：在 Spaceship 加 CNAME 指向 `cname.vercel-dns.com`，在 Vercel 绑定域名，删掉 `vercel.json` 里的 blog 301，并设置环境变量 `SITE_URL=https://blog.251890411.xyz`。

## 旧站迁移说明

旧的 MkDocs 内容保留在 `docs/` 与 `mkdocs.yml`，本地 `site/` 保留但已不再跟踪。旧站的 26 条中文路径已在 `vercel.json` 中 301 到新站对应页面（首页不跳）。需要回滚时，用 `docs/` 重新构建 MkDocs 即可。
