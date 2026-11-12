# HANDOFF — 站点重构进度交接（2026-11-12 14:00）

> 给下一次继续执行的会话看。先读这个，再按需读 `REFACTOR-PLAN.md`（原始方案）。

## 一句话状态

旧 MkDocs 站点已被 **Astro 6.4.8 + 原生 CSS** 的新站取代。主体功能、页面补齐与仓库清理都已完成：**42 个页面**构建成功，`npx astro check` 0 error，360 / 768 / 1440 无横向溢出，内部链接 0 404（抽查 56 条），三主题与 ⌘K 搜索可用。

**本轮改动已提交并推送。** 提交见 `git log`；`main` 与 `workbuddy/main-aef8e669` 都指向新 commit。

部署走 **www `www.251890411.xyz`**：Vercel 项目的主域名是 www，apex 会 307 到 www；`vercel.json` 只保留 `blog` → www 的 301，**不要再加 www → apex**，否则会形成循环。旧站 26 条中文路径已在 `vercel.json` 里补 301。Vercel CLI 的本地 token 已失效，无法从命令行手动发布；push 后是否自动构建取决于项目的 Git 集成，需看线上确认。

> 2026-11-12 14:05 修正：早先的 `vercel.json` 写的是 `www → apex`，与 Vercel 的 apex → www 冲突，线上出现 307/308 循环；已移除该条并把 canonical 切到 www。

上一轮已提交的内容见 `8a35168`（首页、五个子页面、13 篇笔记、RSS、三主题、响应式）。

## 本轮（2026-11-12 下午）补了什么

- **学科页** `/notes/[subject]`：数学（课程卡）/ 物理、编程（筹备中）。
- **课程占位**：`/notes/math/discrete-math`、`/notes/cs/data-structures` 现在有「还没开始」落地页，不是 404。
- **日志类型页** `/writing/[type]`：随笔 / CTF / 项目；`/writing` 的筛选 chip 由静态文字改为真实链接。
- **实验室详情** `/lab/diary`；**资源库说明** `/lab/resources`（明确未开放，不实现上传）。
- **标签** `/tags`、`/tags/[tag]`（7 个标签，中文 URL 编码）；归档 `/archive`；使用说明 `/guide`；搜索 `/search`。
- **⌘K 搜索**：`CommandPalette.astro` + `pages/search-index.json.ts` + `lib/search.ts` + `scripts/search.ts`。原生实现，未引入 MiniSearch；索引只在首次打开时 fetch。
- **页头搜索按钮**、**页脚新增入口**（归档 / 标签 / 使用说明 / 搜索）、**笔记页脚标签可点**。
- **JSON-LD**：`BaseLayout` 支持 `jsonLd` prop；首页 `WebSite`、笔记 `TechArticle`、随笔 `BlogPosting`。
- **样式**：新增集中在 `src/styles/pages.css` 与 `src/styles/search.css`；未改三主题令牌和既有页面结构。
- **字体子集**：重新生成 `public/fonts/noto-serif-sc-display.woff2`，覆盖 272 个显示字符（新增标签/归档/使用说明/搜索等标题用字 + 数字标点）。
- **清理**：`site/` 已 `git rm -r --cached`（本地文件保留，`.gitignore` 加了 `site/`）；删除根目录 VitePress 遗留 `index.md`；卸载未使用的 `@fontsource/jetbrains-mono`。
- **旧链接 301**：`vercel.json` 增加 26 条旧中文路径映射，覆盖旧站 27 个页面（首页不跳）。

## 可直接跑的命令

```bash
npm run dev -- --host 127.0.0.1 --port 4321   # 开发服务器
npm run build                                   # 构建到 dist/
npx astro check                                 # 0 error
npm run preview                                 # 预览生产构建
```

## 当前路由（42 页）

```
/                         首页
/notes                    笔记库（学科条 + 数论章节）
/notes/[subject]          math / physics / cs
/notes/[subject]/[course] number-theory / discrete-math / data-structures
/notes/[...slug]          13 篇笔记
/writing                  日志总览
/writing/[type]           essay / ctf / project
/writing/[slug]           rebuilding-this-site
/lab                      /lab/diary      /lab/resources
/tags                     /tags/[tag]（数论、数论函数、二次剩余、原根、同余、随笔、建站）
/archive                  /guide          /search
/about                    /404
/rss.xml                  /search-index.json
/sitemap-index.xml
```

## 已完成清单

- 技术栈、设计系统（三主题 obsidian/ivory/sepia + 液态玻璃 + 动效）。
- 首页、笔记库、课程页、13 篇笔记详情、日志、实验室、关于、404。
- 笔记详情三栏（课程树 / 正文 / 目录）+ 移动端折叠面板；桌面端目录滚动高亮。
- 笔记标题 KaTeX 行内公式（`src/lib/math.ts` + `InlineMath.astro`）。
- RSS、sitemap、canonical / OG 基础标签、JSON-LD（笔记 / 首页 / 随笔）。
- 字体：JetBrains Mono 本地优先 + woff2 回退；Noto Serif SC 显示子集；Inter / Instrument Serif 走 Fontsource。
- `vercel.json`：build、`dist`、`www`/`blog` 子域名 301、26 条旧路径 301、字体缓存头。
- 站内搜索：构建时索引、原生 JS 匹配、⌘K / Ctrl+K、`/search` 结果页。
- 仓库清理：`site/` 不再跟踪（本地保留）、VitePress `index.md` 删除、`@fontsource/jetbrains-mono` 移除。

## 剩余（按需，涉及用户决策或外部操作）

1. **确认线上部署**：push 后看 Vercel 是否自动构建；若没有，在本机 `vercel login` 后执行 `vercel --prod`。项目已链接（`.vercel/project.json`），无需重新导入。
2. **子域名**：当前方案是 www 直接服务、apex 307 到 www、`blog` 301 到 www，不需要新增 DNS；若以后想让 `blog` 直接服务，需在 Spaceship 加 CNAME（`cname.vercel-dns.com`）并在 Vercel 绑定域名，同时删掉 `vercel.json` 里的 blog 301、把 `SITE_URL` 设为 blog。
3. **仍待用户拍板的视觉问题**：移动菜单「底部对齐 + 上方留白」是否保留、Hero 文案「把复杂的事，写清楚。」是否定稿、三主题够不够。
4. **本轮未做（方案里可选，不阻塞）**：阅读工具栏 Aa / 字号 / 专注模式、OG 分享图、`/writing` 按年分组。

## 关键约定与坑（务必遵守）

- **Astro 锁 6.4.8**：本机 Node 22.22.2，Astro 7 需要 `>=22.23.4` 会 EBADENGINE，**不要升 7**。
- **`overrides.vite = ^7.3.8`** 必须保留（防 vitefu 拉 Vite 8）。
- **markdown 数学**：`unified({...})`（`@astrojs/markdown-remark`），不是旧的 `markdown.remarkPlugins`。
- **zod**：`import { z } from 'astro/zod'`。
- **字体子集**：新增显示用汉字后要重新生成 `public/fonts/noto-serif-sc-display.woff2`（Google Fonts `text=`，`wght@400..600`）。本轮用实际渲染元素（`font-family` 含 `Noto Serif SC Display`）提取字符，272 字。
- **中文标签路由**：`getStaticPaths` 传原始中文，链接用 `encodeURIComponent`；构建产物是 `dist/tags/数论/index.html`，`/tags/%E6%95%B0%E8%AE%BA/` 可访问。
- **旧 URL 301**：`vercel.json` 的 source 不带尾斜杠；`trailingSlash: false` 会先把带斜杠的请求归一化，再匹配。旧站 27 页 = 首页（不跳）+ 26 条映射。
- **`site/` 与 `docs/`**：`site/` 已取消跟踪但本地保留；`docs/`、`mkdocs.yml` 仍跟踪，作为回滚材料。不要再把 `site/` 加回 git。
- **搜索索引不要预取**：`CommandPalette` 只在 open 时 `loadSearchIndex()`；此前若在初始化时调用，会让每页多一次 30KB 请求。
- **`note.body` 可用**（Astro 6 glob loader）；空文件（如 `02-congruence/01-congruence.md`）没有正文，索引里 text 为空是正常的。
- **Git 红线（用户长期要求）**：未经用户明确说「提交/push」，绝不 commit/push。提交署名已配置为用户身份 `Enkrid-Rao <xinxingrao@outlook.com>`。

## 目录地图（新站）

```
src/
├─ content.config.ts, content/notes/...   # 内容集合 + 13 篇笔记
├─ data/site.ts, taxonomy.ts, posts.ts, projects.ts
├─ lib/notes.ts, math.ts, tags.ts, search.ts
├─ layouts/BaseLayout.astro, NoteLayout.astro
├─ components/                            # Header/Footer/ThemeSwitcher/NoteTree/NoteToc/
│                                         # NoteRow/InlineMath/AmbientBackground/CommandPalette
├─ pages/                                 # index, notes/**, writing/**
│                                         # lab/**, tags/**, archive, guide, search, about, 404
│                                         # rss.xml.ts, search-index.json.ts
├─ scripts/main.ts, search.ts
└─ styles/global.css, home.css, pages.css, note.css, search.css
```

## 验证记录（本轮）

- `npx astro check`：0 error / 0 warning / 0 hint（47 文件）。
- `npm run build`：42 page(s) built，sitemap 生成成功。
- Playwright + 系统 Edge：23 条路由 × 360/768/1440，控制台 0 error，无横向溢出。
- 内部链接 56 条全部 200；中文标签 URL 200。
- ⌘K：Ctrl+K 打开、输入「欧拉」出结果、方向键 + Enter 跳转、Esc 关闭；移动端面板 366×675（390×844 视口）。
- `/search?q=二次剩余`：5 条结果。
- 搜索索引按需加载：首屏 0 次请求，打开面板后 1 次。
- 三主题截图检查：obsidian / ivory / sepia 下学科页与使用说明页对比度正常。

## 截图工具（无需装 Chromium）

`playwright-core` 已装；用系统 Edge headless：

```js
import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
});
```

临时截图目录：`C:/Users/raoxi/AppData/Local/Temp/rxx-shots`（非交付物）。
