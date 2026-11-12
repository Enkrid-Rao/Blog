# HANDOFF — 站点重构进度交接（2026-11-12 10:31）

> 给下一次继续执行的会话看。先读这个，再按需读 `REFACTOR-PLAN.md`（原始方案）。

## 一句话状态

旧 MkDocs 站点已被 **Astro 6.4.8 + 原生 CSS** 的新站取代，**主体功能已全部完成并通过 QA**：首页、五个子页面、13 篇数论笔记（详情页 + 课程页）、RSS、README、三主题、响应式都已就绪，`npm run build` 21 个页面成功、`npx astro check` 0 error、360–1920 无横向溢出、内部链接 0 404。

**已提交，并已同步到 `D:\Projects\Blog` 的 `main` 分支。** 两个工作树内容一致（本目录是 WorkBuddy 的 git worktree，分支 `workbuddy/main-aef8e669`；`D:\Projects\Blog` 是主工作树，分支 `main`；两者共享同一个 `.git`，同一 commit）。旧 `docs/`、`mkdocs.yml`、`site/` 保留作回滚。

`D:\Projects\Blog` 里原有的 4 个未提交文件已备份到 `D:\Projects\Blog-backup-uncommitted-20261112\`（按原相对路径存放），同步后主工作树以新站内容为准。

## 可直接跑的命令

```bash
npm run dev -- --host 127.0.0.1 --port 4321   # 开发服务器（上次会话的已停，需重启）
npm run build                                   # 构建到 dist/
npx astro check                                 # 0 error
npm run preview                                 # 预览生产构建
```

## 已完成清单

- 技术栈、设计系统（三主题 obsidian/ivory/sepia + 液态玻璃 + 动效）。
- 首页 `/`、`/notes`、`/writing`（含 1 篇随笔）、`/lab`、`/about`、`/404`。
- 13 篇数论笔记迁入 `src/content/notes/**`，接 KaTeX（构建时渲染）。
- 笔记详情三栏（课程树/正文/目录）+ 移动端折叠面板；课程页 `/notes/math/number-theory`。
- **笔记标题支持 KaTeX 行内公式**：标题里直接写 `$...$`（如 `§3.3 欧拉函数 $\varphi(n)$`），由 `src/lib/math.ts` 的 `renderInlineMath` + `src/components/InlineMath.astro` 在构建时渲染成真数学；KaTeX CSS 已在 `BaseLayout` 全局引入。
- RSS `/rss.xml`（`@astrojs/rss`，从 `src/data/posts.ts` 生成）、README 重写、页脚加 RSS 链接。
- 字体：JetBrains Mono 本地优先 + woff2 回退；Noto Serif SC 显示子集；Inter/Instrument Serif 走 Fontsource。
- `vercel.json`：build 命令、`dist` 输出、`www`/`blog` 子域名 → apex 301、字体缓存头。

## 剩余（非阻塞，下次按需做）

1. **部署**：Vercel 导入项目 + 绑定域名 + DNS CNAME（`cname.vercel-dns.com`）。子域名用 `blog.` 还是别的、是「直接服务」还是「301 到主站」，等用户拍板。
2. **旧 URL 301**：等主域名真正切到新站时，再在 `vercel.json` 补旧中文路径 → `/notes/...` 的映射（现在旧站还在 apex 上，不需要）。
3. **清理（需用户确认再做）**：`git rm -r --cached site`（把旧构建产物移出版本控制）、删根目录 VitePress 遗留 `index.md`、`npm uninstall @fontsource/jetbrains-mono`（字体已复制到 `public/fonts/jetbrains-mono/`，运行时不再依赖）。
4. **仍待用户拍板的视觉问题**：移动菜单「底部对齐 + 上方留白」是否保留、Hero 文案「把复杂的事，写清楚。」是否定稿、三主题够不够（要不要回 6 套配色）。

## 关键约定与坑（务必遵守）

- **Astro 锁 6.4.8**：本机 Node 22.22.2，Astro 7 需要 `>=22.23.4` 会 EBADENGINE，**不要升 7**。nvm-windows 里有 24.13.1，但升级 Node/Astro 7 属于独立收尾任务，别在收尾期顺手做。
- **`overrides.vite = ^7.3.8`** 必须保留（防 vitefu 拉 Vite 8）。
- **markdown 数学**：`unified({...})`（`@astrojs/markdown-remark`），不是旧的 `markdown.remarkPlugins`。
- **zod**：`import { z } from 'astro/zod'`。
- **字体子集**：新增显示用汉字后要重新生成 `public/fonts/noto-serif-sc-display.woff2`（Google Fonts `text=`）。
- **Git 红线（用户长期要求）**：未经用户明确说「提交/push」，绝不 commit/push。提交署名已配置为用户身份 `Enkrid-Rao <xinxingrao@outlook.com>`，不会出现 WorkBuddy。

## 目录地图（新站）

```
src/
├─ content.config.ts, content/notes/...   # 内容集合 + 13 篇笔记
├─ data/site.ts, taxonomy.ts, posts.ts    # 站点/课程元数据/日志
├─ lib/notes.ts, math.ts                  # 排序/阅读时长/日期 + 标题行内公式
├─ layouts/BaseLayout.astro, NoteLayout.astro
├─ components/                            # Header/Footer/ThemeSwitcher/NoteTree/NoteToc/NoteRow/InlineMath/AmbientBackground
├─ pages/                                 # index/notes/writing/lab/about/404/rss.xml
└─ styles/global.css, home.css, pages.css, note.css
```

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
