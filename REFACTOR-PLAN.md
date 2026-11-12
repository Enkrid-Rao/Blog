# rxx 博客重构方案 v1

> 状态：待确认 · 本文件只是方案，不改任何站点代码 · 不参与构建

## 0. 结论

保留全部笔记内容，把站点从 **MkDocs Material** 迁到 **Astro（最新稳定版）+ 自建设计系统**，部署仍在 Vercel。

新站定位是「个人博客 + 结构化笔记库 + 实验室」，不是把现在的教材目录换个皮肤。液态玻璃只做**外壳**（导航、卡片、弹层、阅读工具栏），长文正文用**雾面纸**，否则动效和模糊会直接毁掉阅读。

预计 6–8 个工作日，分 6 期，旧站全程可回滚。

---

## 1. 现状盘点

| 项目 | 现状 | 判断 |
|---|---|---|
| 框架 | MkDocs + Material，`mkdocs.yml` 手写整棵 nav | 文档框架，不是博客框架 |
| 内容 | 27 个 md，共 66 KB；数论 4 章 13 篇；物理/编程各 1 页占位；其他分享 1 篇 | 体量很小，迁移成本低 |
| 首页 | 4 张学科卡 + 个人介绍 | 像教材封面，不像个人主页 |
| 视觉 | `extra.css` 519 行；6 套配色 × 3 种模式；霞鹜文楷；MathJax 3 | 有辨识度，但实现是硬编码矩阵 |
| 交互 | `theme-picker.js` 切色不持久化；`pageview.js` 依赖 CountAPI | 两个都不可靠 |
| 构建产物 | `site/` 65 个文件被 git 跟踪，3.2 MB | 仓库噪音，冲突源 |
| 遗留文件 | 根目录 `index.md` 是 VitePress 首页模板，与站点无关 | 应删除 |
| 部署 | Vercel + Python venv + pip + `mkdocs build` | 每次构建装一遍依赖，慢且脆 |
| 未提交 | 主工作树有 2 个新 md、2 个修改；当前工作树干净；**没找到「随笔」** | 迁移前必须做快照 |

当前真实未提交内容（`D:/Projects/Blog`）：

- `M .vscode/settings.json`
- `M docs/数学/数论/第四章_二次剩余/二次互反律.md`
- `?? docs/数学/数论/第四章_二次剩余/二次同余式的解.md`
- `?? docs/数学/离散数学/index.md`

---

## 2. 诊断：为什么是重构，不是换皮

1. **定位和导航打架。** 首页写的是「个人博客」，导航却是「数学 / 物理 / 编程」三本教材。随笔、CTF、项目记录没有位置。
2. **内容没有「文章」这个概念。** 所有 md 都只是页面，没有日期、摘要、标签、状态、阅读时长，所以做不出信息流、归档、相关推荐。
3. **三个死胡同。** 物理只有「待完善」，编程只有一句说明，「其他分享」是杂物间。用户点进去就无路可走。
4. **主题系统是硬编码矩阵。** 6 套配色 × 3 种模式，靠十几组 CSS 变量手写覆盖；新增一套主题要改很多处，切换还不持久化。
5. **玻璃和长文天然冲突。** 全屏模糊 + 流动背景放在文章正文后面，阅读会累，低端机会卡。必须分层：玻璃是壳，纸是内容。
6. **构建产物入库。** `site/` 被跟踪，每次构建都产生 diff，真正的内容改动被淹没。
7. **外部依赖不可控。** CountAPI 第三方、MathJax CDN、字体 CDN 全量加载；任意一个挂掉，页面就少一块。
8. **没有订阅和分享基础设施。** 没有 RSS、没有 OG 图、没有 sitemap 策略、没有 301 迁移方案。

### 为什么不是继续用 MkDocs

- Material 的 DOM 是 Jinja 模板固定好的，要做液态玻璃导航、共享元素转场、三栏阅读布局，等于和主题内部结构对抗。
- MkDocs 的 blog 插件能补文章流，但会把 URL、分页、标签锁进它的约定；后面加 CTF 模板和资源库会更别扭。
- 现在只有 27 个 md、66 KB，迁移窗口是最好的；等笔记翻倍再迁，成本高得多。

### 为什么不是 Next.js

这个站没有登录、没有实时数据、没有个性化，不需要 RSC 和一身 JS。Astro 默认零 JS，正好匹配「内容站 + 少量交互」。

---

## 3. 目标与非目标

### 目标

| 目标 | 可验收标准 |
|---|---|
| 定位升级 | 首页能在 5 秒内说清「我是谁、我在写什么、从哪开始读」 |
| 笔记保留 | 13 篇笔记 + 关于/指南/工具分享全部迁移；章节索引页由聚合替代；公式、内部链接、顺序零丢失 |
| 可扩展 | 新增一篇随笔/CTF/项目，只需加 md + frontmatter，不改路由 |
| 视觉记忆点 | 液态玻璃 + 光雾背景 + 流动转场，但正文对比度 ≥ 4.5:1 |
| 阅读体验 | 桌面三栏、移动端单栏；字号/行高/字体可调；公式不溢出 |
| 性能 | 移动端 Lighthouse Performance ≥ 90，LCP < 2.5s，CLS < 0.05 |
| 可维护 | 一套 OKLCH 令牌生成全部主题；不再手写 18 组配色 |
| 可回滚 | 旧站保留 tag + Vercel 历史部署，5 分钟内切回 |

### 本期不做

- CTF WP 的实际内容生产（只留模板和入口）
- 资源上传后端、对象存储、登录（只留 `/lab` 与 schema）
- 评论系统（文章底部留 Giscus 插槽，不接）
- 国际化、多作者、付费/会员
- 全站 WebGL 折射（只在首页 hero 用一次 SVG 折射）

---

## 4. 新信息架构

### 4.1 五个一级模块

| 模块 | 回答的问题 | 内容形态 | 浏览方式 | 本期 |
|---|---|---|---|---|
| 首页 `/` | 这是谁？从哪开始？ | 身份、最新、精选、状态 | 单页 | 重做 |
| 笔记 `/notes` | 我系统学了什么？ | 课程 → 章节 → 笔记，结构化 | 树状 + 顺序阅读 | 迁移 |
| 日志 `/writing` | 我最近在想/做了什么？ | 时间流：随笔、CTF、项目 | 列表 + 标签 + 归档 | 框架 + 样例 |
| 实验室 `/lab` | 我做了什么/能给你什么？ | 项目卡、资源下载 | 项目详情 | 占位 |
| 关于 `/about` | 我是谁？ | 简介、Now、技术栈、联系方式 | 单页 | 重写 |

「笔记」和「日志」必须分开：笔记是**长期维护、可顺序读**的知识库；日志是**按时间发生**的写作流。混在一起，两边都会变差。

### 4.2 站点地图

```
/
├─ /notes                         笔记库
│  ├─ /notes/math                 数学
│  │  └─ /notes/math/number-theory            数论（课程页）
│  │     ├─ /02-congruence                    第二章 同余
│  │     ├─ /03-arithmetic-functions          第三章 数论函数
│  │     ├─ /04-quadratic-residues            第四章 二次剩余
│  │     └─ /05-primitive-roots               第五章 原根
│  ├─ /notes/physics              物理（筹备中）
│  └─ /notes/cs                   编程（筹备中）
├─ /writing                       日志（全部）
│  ├─ /writing/essay              随笔
│  ├─ /writing/ctf                CTF Writeups（预留）
│  └─ /writing/project            项目 / 工具分享
├─ /writing/[slug]                文章详情
├─ /lab                           实验室（预留）
│  ├─ /lab/diary                  diary 项目
│  └─ /lab/resources              资源库（预留，不实现）
├─ /tags/[tag]                    标签聚合
├─ /archive                       按年归档
├─ /about                         关于
├─ /guide                         使用说明（阅读/主题/公式）
├─ /search                        搜索页（同时有 ⌘K 弹层）
├─ /rss.xml
├─ /sitemap-index.xml
└─ /404
```

### 4.3 导航与 URL 原则

- 一级导航固定 5 个：**首页 / 笔记 / 日志 / 实验室 / 关于**。关于放最后，不抢注意力。
- 右侧只放 3 个工具：搜索（⌘K）、主题、GitHub。RSS 放页脚。
- 页面路径用英文 slug，标题用中文；标签可以用中文，URL 编码交给框架处理。
- 旧 URL 全部 301 到新 URL，至少保留一年。
- 空模块必须有「筹备中」落地页，不能是死链，也不能假装有内容。
- 移动端导航变成底部玻璃 dock（4 个主入口 + 搜索），不挤汉堡菜单。

### 4.4 内容流转

```
草稿（draft: true，不进构建）
   ↓
笔记 / 日志（加 frontmatter）
   ↓
标签 / 归档 / 搜索索引（自动生成）
   ↓
首页精选（featured: true）
```

CTF 和资源是这套流转的**新增类型**，不是新增一套系统：CTF 就是 `type: ctf` 的日志；资源就是 `projects` + 未来的 `resources` collection。

---

## 5. 页面结构

### 5.1 首页

```
┌──────────────────────────────────────────────────────┐
│  浮动玻璃导航：rxx · 首页 笔记 日志 实验室 关于   ⌘K ◐ │
├──────────────────────────────────────────────────────┤
│                                                      │
│   [光雾 + 一颗缓慢呼吸的玻璃球]                        │
│   rxx                                                │
│   笔记、实验，以及一些没想清楚的想法。                  │
│   现在：数论 / CTF 入门 / 前端折腾                     │
│   [ 读笔记 ]  [ 看日志 ]                              │
│                                                      │
├──────────────────────────────────────────────────────┤
│  最近写了什么                          全部 →          │
│  [ 大卡：最新一篇 ] [ 小卡 ] [ 小卡 ]                  │
├──────────────────────────────────────────────────────┤
│  笔记库                                               │
│  [ 数学 13 篇 · 4 章 ] [ 物理 筹备中 ] [ 编程 筹备中 ] │
├──────────────────────────────────────────────────────┤
│  实验室                                    进入 →      │
│  [ diary · 规划中 ]  [ 资源库 · 预留 ]                 │
├──────────────────────────────────────────────────────┤
│  页脚：RSS · GitHub · 邮箱 · 内容 CC BY-SA 4.0         │
└──────────────────────────────────────────────────────┘
```

首页只做 6 件事：身份、当前状态、最新写作、笔记入口、实验室预告、联系方式。不放技能条、不放时间线、不放臃肿的「关于我」。

### 5.2 笔记库 `/notes`

- 顶部：标题「笔记库」+ 一句说明 + 搜索框（点击打开 ⌘K）。
- 学科区：数学（进行中）、物理（筹备中）、编程（筹备中）。
- 数学下按课程列卡片：数论（4 章 13 篇，最后更新 2026-06）、离散数学（筹备中）。
- 每张课程卡显示：章节数、笔记数、最后更新、进度环（本地已读）。
- 空课程卡可点，进入后是「这门课还没开始」+ 已规划的章节骨架，不是 404。

### 5.3 课程页 `/notes/math/number-theory`

```
面包屑：笔记 / 数学 / 数论
┌─────────────────────────────────────┬────────────────┐
│ 数论                                 │ 课程信息（玻璃） │
│ 同余、数论函数、二次剩余、原根         │ 4 章 · 13 篇    │
│                                     │ 最后更新         │
│ 第二章 同余                   2 篇   │ 标签             │
│   2.1 同余的概念          8 min  →  │                │
│                                     │ 学习进度 38%     │
│ 第三章 数论函数               6 篇   │ ▓▓▓▓░░░░        │
│   3.1 数论函数 v_p(n)     12 min →  │                │
│   ...                               │                │
└─────────────────────────────────────┴────────────────┘
```

章节和篇目由 frontmatter 自动聚合，不手写 nav。章节标题、顺序、篇目顺序都在内容里。

### 5.4 笔记详情页

```
┌────────────────────────────────────────────────────────────┐
│ 顶部细进度条 ─────────────────────────────────────────      │
│ 浮动玻璃条：← 数论    §3 欧拉函数    Aa  ◐  分享           │
├──────────────┬──────────────────────────────┬──────────────┤
│ 课程树（玻璃）│  雾面纸正文                   │ 本页目录      │
│ 第二章       │  §3 欧拉函数 φ(n)             │ 定义          │
│  2.1 ●      │  定义                         │ 性质          │
│ 第三章       │  φ(n) 表示 ...                │ 计算          │
│  3.1        │  [公式块]                     │ 例题          │
│  3.2        │  ...                          │              │
│  3.3 ●      │  [上一节]        [下一节]      │              │
├──────────────┴──────────────────────────────┴──────────────┤
│ 相关笔记 / 标签 / 评论区占位                                │
└────────────────────────────────────────────────────────────┘
```

关键约束：

- 正文容器最大 **72ch**，背景是 96% 不透明的 `--paper`，**不加 backdrop-filter**。
- 左树和右目录是玻璃；滚动时只滚正文，两侧 sticky。
- 玻璃条上的 `Aa` 打开阅读设置：字号 S/M/L、行高、楷体/黑体、专注模式。
- 公式块用浅色玻璃纸条，不悬浮、不弹跳；hover 只加深 1px 边框。
- 移动端：左树收进抽屉，右目录变成底部 sheet，玻璃条保留返回 + 进度 + Aa。

### 5.5 日志 `/writing`

- 顶部：一句编辑式导语，不写「最新文章」这种模板话。
- 过滤 chips：全部 / 随笔 / CTF / 项目。每个类型有独立静态路由，利于分享和 SEO。
- 结构：一篇 featured 大卡 + 按年分组的时间流。
- CTF 没有内容时显示一张 ghost 卡：「CTF Writeups 正在准备中」，不是空白。
- 每行：日期、标题、摘要、标签、阅读时长。hover 时整行轻微抬起，标题下划线从左侧展开。

### 5.6 日志详情 `/writing/[slug]`

- 编辑式排版：大标题、日期、标签、阅读时长；封面可选。
- 正文 72ch；支持 `tl;dr`、代码块、引用、图片。
- CTF 模板预留元信息表：赛事 / 题目 / 分类 / 难度 / 环境 / flag（flag 默认折叠）。
- 底部：上一篇/下一篇、相关文章、Giscus 占位。

### 5.7 实验室 `/lab`

- 项目卡：diary（规划中）、资源库（预留）。
- diary 详情页只写**范围与状态**：要解决什么、准备怎么做、现在到哪一步；不放假截图。
- 资源库只放一个「尚未开放」的玻璃面板，说明未来支持的文件类型和上传方式；不实现上传。

### 5.8 关于 / 使用说明 / 搜索 / 404

| 页面 | 内容 |
|---|---|
| `/about` | 一段自我介绍、Now、时间线、常用工具、联系方式、本站技术栈 |
| `/guide` | 主题怎么切、公式怎么复制、搜索快捷键、阅读设置；从页脚进入 |
| `/search` | 完整搜索结果页；⌘K 弹层复用同一套索引 |
| `/404` | 一句轻松的话 + 回首页/笔记/日志三个入口 |

---

## 6. 内容模型与迁移

### 6.1 Collections

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(180),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    type: z.enum(['essay', 'ctf', 'project']).default('essay'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),                 // 纯文本，给 SEO / <title>
    displayTitle: z.string().optional(), // 可含 $...$，给页头
    description: z.string().max(180),
    subject: z.enum(['math', 'physics', 'cs']),
    course: z.string(),                // number-theory
    chapter: z.string(),               // 02-congruence
    chapterTitle: z.string(),          // 第二章 同余
    order: z.number(),                 // 章节内顺序
    chapterOrder: z.number(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['planned', 'building', 'live']).default('planned'),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    started: z.coerce.date().optional(),
    cover: z.string().optional(),
  }),
});
```

### 6.2 Frontmatter 示例

笔记：

```yaml
---
title: 欧拉函数
displayTitle: "$\\S 3$ 欧拉函数 $\\varphi(n)$"
description: 欧拉函数的定义、性质、计算公式与例题。
subject: math
course: number-theory
chapter: 03-arithmetic-functions
chapterTitle: 第三章 数论函数
chapterOrder: 3
order: 3
updated: 2026-06-08
tags: [数论, 数论函数, 欧拉函数]
---
```

日志：

```yaml
---
title: 第一篇
description: 为什么重新做这个站。
date: 2026-11-11
type: essay
tags: [随笔, 建站]
featured: true
draft: true
---
```

### 6.3 目录映射

| 旧 | 新 | 处理 |
|---|---|---|
| `docs/index.md` | `src/pages/index.astro` | 重写，不保留旧文案 |
| `docs/关于/index.md` | `src/content/pages/about.md` | 重写 |
| `docs/关于/阅读指南.md` | `src/content/pages/guide.md` | 更新功能说明 |
| `docs/数学/数论/第二章_同余/*.md` | `src/content/notes/math/number-theory/02-congruence/*.md` | 加 frontmatter，删首行 H1 |
| `docs/数学/数论/第三章_数论函数/*.md` | `src/content/notes/math/number-theory/03-arithmetic-functions/*.md` | 同上 |
| `docs/数学/数论/第四章_二次剩余/*.md` | `src/content/notes/math/number-theory/04-quadratic-residues/*.md` | 同上 |
| `docs/数学/数论/第五章_原根/*.md` | `src/content/notes/math/number-theory/05-primitive-roots/*.md` | 同上 |
| `docs/数学/数论/*/index.md` | 删除 | 章节页由聚合自动生成 |
| `docs/物理/index.md` | `src/data/taxonomy.ts` 标记 `planned` | 不生成空文章 |
| `docs/编程/数据结构与算法设计/index.md` | `src/data/taxonomy.ts` 标记 `planned` | 同上 |
| `docs/其他分享/刷课.md` | `src/content/posts/project/course-tools.md` | `type: project` |
| `docs/数学/离散数学/index.md`（未提交） | 迁移前快照到 `_inbox/` | 内容为空，确认后再迁 |

### 6.4 迁移脚本步骤

1. **快照**：把两个工作树里未提交的文件复制到 `_inbox/`，记录 sha256 与文件数。
2. **复制**：`docs/数学/数论/**/*.md` → `src/content/notes/math/number-theory/**`，不改原文。
3. **补 frontmatter**：从路径推导 `subject/course/chapter/chapterOrder/order`；从首行 H1 推导 `title/displayTitle`；`description` 先留空，人工补 27 条。
4. **去重 H1**：把首行 H1 从正文删掉，标题只由布局渲染。
5. **修链接**：把 `](欧拉函数.md)` 这类相对链接改成新 slug 的绝对路径；用脚本扫描 + 人工复核。
6. **公式归一化**：把 `$$ ... \begin{equation} ... \end{equation} ... $$` 改成 `$$ ... $$`；保留 `\tag{1}`。
7. **构建**：`npm run build`，确认 13 篇笔记 + 2 个页面 + 1 篇工具分享全部产出。
8. **链接检查**：内部链接 0 404；旧 URL 全部命中 301。
9. **视觉对照**：抽 10 个公式最密的页面，新旧截图并排比对基线、上下标、括号、中文 `\text{}`。

### 6.5 未来扩展（本期只留位置）

**CTF WP**：`type: ctf` + 可选字段

```yaml
event: 某 CTF 2026
category: web
difficulty: medium
environment: docker
flag: "flag{...}"   # 默认折叠，不直接渲染
```

**资源库**：`resources` collection（本期不实现）

```yaml
title: diary 源码包
file: https://...        # 未来接对象存储
size: 12.4 MB
type: zip
date: 2026-12-01
description: ...
```

**diary 项目**：`projects` collection + `/lab/diary` 详情页；未来可嵌 Web App 或下载入口。

---

## 7. 组件划分

```
src/
├─ layouts/
│  ├─ BaseLayout.astro           # html head / 背景 / 导航 / 页脚 / 转场
│  ├─ ArticleLayout.astro        # 日志详情
│  └─ NoteLayout.astro           # 笔记三栏
├─ components/
│  ├─ shell/
│  │  ├─ AmbientBackdrop.astro   # 光雾背景（3 个 blob + 噪点）
│  │  ├─ LiquidNav.astro         # 浮动玻璃导航 + 活动指示器
│  │  ├─ MobileDock.astro        # 移动端底部 dock
│  │  ├─ ThemeSwitcher.astro     # 模式 + 强调色
│  │  ├─ CommandPalette.astro    # ⌘K 搜索
│  │  ├─ SiteFooter.astro
│  │  └─ SkipLink.astro
│  ├─ primitives/
│  │  ├─ GlassPanel.astro        # 唯一玻璃原语，variant 控制形态
│  │  ├─ GlassButton.astro
│  │  ├─ TagChip.astro
│  │  ├─ StatusBadge.astro
│  │  ├─ SectionHeading.astro
│  │  ├─ Reveal.astro            # IntersectionObserver 入场上浮
│  │  └─ Specular.astro          # 指针高光（可选包裹）
│  ├─ content/
│  │  ├─ PostCard.astro
│  │  ├─ FeaturedPost.astro
│  │  ├─ SubjectCard.astro
│  │  ├─ CourseCard.astro
│  │  ├─ NoteRow.astro
│  │  ├─ MetaRow.astro
│  │  ├─ Breadcrumb.astro
│  │  ├─ Toc.astro
│  │  ├─ ReadingProgress.astro
│  │  ├─ ReadingToolbar.astro
│  │  ├─ PrevNext.astro
│  │  ├─ RelatedList.astro
│  │  └─ EmptyState.astro
│  └─ lab/
│     ├─ ProjectCard.astro
│     └─ ResourceRow.astro       # 预留，不渲染真实数据
├─ content/
│  ├─ notes/
│  ├─ posts/
│  ├─ projects/
│  └─ pages/
├─ data/
│  ├─ taxonomy.ts                # 学科/课程标题、描述、状态
│  └─ site.ts                    # 站名、作者、社交链接、Now
├─ styles/
│  ├─ tokens.css                 # OKLCH 令牌、字体、间距、圆角、动效
│  ├─ glass.css                  # 玻璃配方、光雾、高光
│  ├─ prose.css                  # 正文排版、公式、代码、表格、引用
│  ├─ motion.css                 # 转场、入场、hover、reduced-motion
│  └─ print.css
└─ pages/
   ├─ index.astro
   ├─ notes/index.astro
   ├─ notes/[subject].astro
   ├─ notes/[subject]/[course].astro
   ├─ notes/[...slug].astro
   ├─ writing/index.astro
   ├─ writing/[type].astro
   ├─ writing/[slug].astro
   ├─ tags/[tag].astro
   ├─ archive.astro
   ├─ lab/index.astro
   ├─ lab/[slug].astro
   ├─ about.astro
   ├─ guide.astro
   ├─ search.astro
   ├─ 404.astro
   ├─ rss.xml.ts
   └─ search-index.json.ts
```

### 关键组件契约

| 组件 | 职责 | 关键 props / 状态 |
|---|---|---|
| `GlassPanel` | 所有玻璃表面的唯一来源 | `variant: card/rail/pill/dialog/paper`、`blur: sm/md/lg`、`interactive`、`as` |
| `LiquidNav` | 一级导航 + 活动指示器 | `items`、`currentPath`、`scrolled` |
| `ThemeSwitcher` | 模式 + 强调色 | `theme`、`accent`、`open` |
| `CommandPalette` | 搜索 + 快捷跳转 | `open`、`query`、`results`、`activeIndex` |
| `ReadingToolbar` | 字号/行高/字体/专注 | `fontSize`、`lineHeight`、`fontFamily`、`focus` |
| `Toc` | 目录 + 当前位置 | `headings`、`activeId` |
| `PostCard` | 日志卡片 | `post`、`featured`、`index`（错峰入场） |

**不要再为「数学卡 / 物理卡 / 文章卡」各写一套卡片。** 一个 `GlassPanel` + 一层内容组件，形态靠 variant 和 slot 组合。

---

## 8. 液态玻璃视觉系统

### 8.1 四条原则

1. **玻璃是外壳，纸是内容。** 导航、卡片、弹层、工具栏用玻璃；正文用雾面纸，不加模糊。
2. **动在边缘，静在字里。** 背景光雾、导航指示器、卡片高光可以动；标题和正文不动。
3. **光随指针，呼吸随滚动。** 桌面端高光跟随鼠标；移动端只保留缓慢呼吸，避免陀螺仪抖动。
4. **一层景深就够。** 背景光雾 → 玻璃表面 → 纸面内容，三层。不要玻璃套玻璃套玻璃。

### 8.2 Design tokens

```css
@layer tokens {
  :root {
    --font-ui: "Inter", "Source Han Sans SC", "PingFang SC", system-ui, sans-serif;
    --font-read: "LXGW WenKai Screen", "Noto Serif SC", "Songti SC", serif;
    --font-mono: "JetBrains Mono", "SFMono-Regular", ui-monospace, monospace;

    --ease-liquid: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --dur-1: 160ms;
    --dur-2: 320ms;
    --dur-3: 640ms;

    --radius-1: 14px;
    --radius-2: 22px;
    --radius-3: 32px;

    --blur-1: 12px;
    --blur-2: 24px;
    --blur-3: 40px;

    --accent-h: 285;
    --accent: oklch(62% 0.19 var(--accent-h));
    --accent-soft: oklch(62% 0.19 var(--accent-h) / 0.16);
  }

  [data-theme="light"] {
    color-scheme: light;
    --bg: oklch(97.5% 0.006 250);
    --bg-2: oklch(94% 0.012 250);
    --fg: oklch(22% 0.02 250);
    --fg-muted: oklch(48% 0.02 250);
    --glass: oklch(100% 0 0 / 0.58);
    --glass-strong: oklch(100% 0 0 / 0.78);
    --glass-border: oklch(100% 0 0 / 0.72);
    --glass-hi: oklch(100% 0 0 / 0.90);
    --glass-shadow: oklch(30% 0.04 250 / 0.14);
    --paper: oklch(99.5% 0.004 90 / 0.96);
  }

  [data-theme="dark"] {
    color-scheme: dark;
    --bg: oklch(17% 0.015 260);
    --bg-2: oklch(22% 0.02 260);
    --fg: oklch(93% 0.01 250);
    --fg-muted: oklch(68% 0.015 250);
    --glass: oklch(28% 0.02 260 / 0.52);
    --glass-strong: oklch(24% 0.02 260 / 0.78);
    --glass-border: oklch(100% 0 0 / 0.12);
    --glass-hi: oklch(100% 0 0 / 0.16);
    --glass-shadow: oklch(0% 0 0 / 0.50);
    --paper: oklch(21% 0.012 260 / 0.96);
  }

  [data-theme="sepia"] {
    color-scheme: light;
    --bg: oklch(93% 0.025 80);
    --bg-2: oklch(89% 0.035 75);
    --fg: oklch(28% 0.03 60);
    --fg-muted: oklch(48% 0.04 60);
    --glass: oklch(98% 0.015 85 / 0.55);
    --glass-strong: oklch(98% 0.015 85 / 0.80);
    --glass-border: oklch(100% 0 0 / 0.55);
    --glass-hi: oklch(100% 0 0 / 0.85);
    --glass-shadow: oklch(30% 0.05 60 / 0.18);
    --paper: oklch(97% 0.018 85 / 0.97);
  }
}
```

### 8.3 玻璃配方

```css
.glass {
  position: relative;
  background: var(--glass);
  -webkit-backdrop-filter: blur(var(--blur-2)) saturate(180%);
  backdrop-filter: blur(var(--blur-2)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2);
  box-shadow:
    inset 0 1px 0 var(--glass-hi),
    inset 0 -1px 0 oklch(0% 0 0 / 0.04),
    0 18px 50px -20px var(--glass-shadow);
}

/* 指针高光：只加在可交互卡片上 */
.glass[data-interactive]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    420px circle at var(--mx, 50%) var(--my, 0%),
    oklch(100% 0 0 / 0.22),
    transparent 55%
  );
  opacity: 0;
  transition: opacity var(--dur-2) var(--ease-liquid);
  pointer-events: none;
}
.glass[data-interactive]:hover::before { opacity: 1; }

@media (hover: none), (pointer: coarse) {
  .glass[data-interactive]::before { display: none; }
}
```

真正的「折射」只在首页 hero 玻璃球上做一次：`feTurbulence + feDisplacementMap`，8 秒极慢位移，静态兜底。全站卡片不做位移映射，成本太高。

### 8.4 背景光雾

- 3 个 radial-gradient 光斑：主色、辅色、暖色；`filter: blur(90px)`；`transform` 缓慢漂移。
- 周期分别 28s / 36s / 44s，避免同步，才有「活」的感觉。
- 上面盖一层 3% 的 SVG 噪点，防止渐变出现色带。
- 文章页把光雾透明度降到 15%，并暂停漂移（`[data-reading="true"]`），保证阅读。
- 移动端只保留 2 个光斑，blur 降到 60px。

```css
@keyframes drift-a {
  0%, 100% { transform: translate3d(-6%, -4%, 0) scale(1); }
  50%      { transform: translate3d(6%, 8%, 0) scale(1.12); }
}
.aurora__a {
  animation: drift-a 28s var(--ease-liquid) infinite;
  will-change: transform;
}
```

### 8.5 主题系统

- **3 种模式**：晨雾（light）/ 深海（dark）/ 暖纸（sepia）。
- **5 种强调色**：鸢尾 285°、海蓝 245°、苔绿 155°、琥珀 65°、石墨 250°（低饱和）。
- 旧 6 套配色的映射：靛蓝→鸢尾，蓝色→海蓝，护眼绿→苔绿，护眼暖黄/暖纸→琥珀 + 暖纸模式，墨灰→石墨。
- 所有颜色由 `--accent-h` 和 `oklch()` 派生，不再为每个组合写一套变量。
- `localStorage` 存 `theme` / `accent`；`<head>` 里放阻塞式内联脚本，首帧前写入 `data-theme`，避免闪白。
- 切换时用 View Transition 做圆形扩散（从按钮位置），520ms；`prefers-reduced-motion` 时直接切。
- 主题选择器本身是玻璃弹层：上排 3 个模式，下排 5 个色球；色球有 1px 内高光，不是纯色圆点。

### 8.6 动效规范

| 场景 | 触发 | 属性 | 时长 / 曲线 | 降级 |
|---|---|---|---|---|
| 页面切换 | 导航 | 淡出 + 8px 模糊，标题共享元素 | 320ms / liquid | 直接切 |
| 导航指示器 | 切换路由 | FLIP 位移 + 宽度 | 420ms / spring | 直接跳 |
| 卡片 hover | 指针进入 | translateY(-4px) + scale(1.01) + 高光 | 320ms / liquid | 只变边框 |
| 列表入场 | 滚动进入 | translateY(12px) + opacity + blur(4px→0) | 520ms / liquid，错峰 60ms | 直接显示 |
| 背景光雾 | 常驻 | transform 漂移 | 28–44s / linear | 静态 |
| 呼吸 | 常驻 | opacity .85↔1 + scale 1↔1.03 | 8s / ease-in-out | 关闭 |
| 阅读进度 | 滚动 | scaleX | 跟手 | 保留 |
| 主题切换 | 点击 | clip-path 圆形扩散 | 520ms / liquid | 直接切 |

只动 `transform` / `opacity` / `clip-path`；不动 `width` / `height` / `backdrop-filter`。滚动监听用 `requestAnimationFrame` 节流。

### 8.7 排版与阅读

- UI 用无衬线（Inter / 思源黑体），正文用霞鹜文楷。标题用无衬线粗体，和正文形成对比，不再全站楷体。
- 正文 17–18px / 1.85，最大 72ch；段落间距 1.1em。
- 公式用 KaTeX 构建时渲染；行间公式放在浅色玻璃纸条里，左边 2px 强调色，hover 只加深边框。
- 代码块深色底、圆角 12px、右上角复制按钮；行内代码用 accent-soft 底。
- 引用是「页边注」风格：小一号、低对比、左侧细线，不套大引用块。
- 表格圆角 + 横向滚动；移动端字号降到 0.9rem。
- 阅读设置存 `localStorage`，跨页保持。

### 8.8 性能与无障碍红线

- 全页 `backdrop-filter` 元素不超过 **6 个**：导航、3 张卡、弹层、阅读工具栏。
- 正文纸面**禁止** `backdrop-filter`；否则滚动掉帧。
- 模糊半径移动端 ≤ 16px，桌面 ≤ 24px；hero 的 40px 只用于静态球体。
- 所有玻璃面板下面必须有足够的底色对比；正文对比度 ≥ 4.5:1，次要文字 ≥ 3:1。
- `prefers-reduced-motion: reduce`：关闭漂移、呼吸、入场、圆形扩散；保留即时状态变化。
- `prefers-reduced-transparency: reduce`（Safari）：玻璃变不透明底色。
- 键盘：跳转链接、导航、⌘K、目录、主题弹层全部可 Tab；焦点环 2px 强调色，不能用 `outline: none`。
- 移动端 360px 宽无横向滚动；公式超宽时容器内横向滚动，不撑破页面。

---

## 9. 技术实现要点

### 9.1 技术栈

| 层 | 选择 | 原因 |
|---|---|---|
| 框架 | Astro 5+（最新稳定版） | 内容集合、零 JS 默认、View Transitions、部署简单 |
| 样式 | 原生 CSS + 设计令牌 + Astro scoped style | 玻璃需要精细控制，Tailwind 会变成一堆 `[...]` |
| 交互 | 原生 TS / 少量 island | 主题、搜索、目录、阅读设置都不需要框架 |
| 数学 | KaTeX（构建时） | 无客户端 JS、无重排、速度快 |
| 搜索 | MiniSearch + `Intl.Segmenter` | 全站内容构建时索引；中文按词切分，不依赖第三方 |
| 内容 | Markdown + content collections | 现有 md 几乎原样迁移 |
| 搜索 UI | 自建 ⌘K 弹层 | 玻璃样式统一，不引第三方主题 |
| 部署 | Vercel 静态 | 现有域名和平台不变，零迁移成本 |
| 统计 | Vercel Web Analytics | 替代 CountAPI，隐私友好 |

### 9.2 Astro 配置

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://251890411.xyz',
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
```

### 9.3 数学迁移

- 现有内容用到 `\text{}`、`\operatorname`、`\dfrac`、`\binom`、`\substack`、`aligned`、`gathered`、`cases`、`pmatrix`、`\boxed`、`\tag`，KaTeX 全部支持。
- 没有 `\label` / `\eqref` / `\ref`，不需要公式编号系统。
- 有 4 处 `$$ ... \begin{equation} ... \end{equation} ... $$` 的嵌套写法，MathJax 能容忍，KaTeX 可能报错；迁移脚本先剥离内层 `equation`。
- 有大量中文 `\text{}`，KaTeX 会走系统字体回退；抽 10 页做截图对照，重点看中文基线。
- 如果个别公式仍失败，降级方案是 `rehype-mathjax`（构建时输出 SVG），不回到客户端 MathJax。

### 9.4 搜索

- 构建时生成 `search-index.json`：`title / description / tags / type / url / headings / plainText`。
- 客户端打开 ⌘K 时才 `fetch` 索引，用 MiniSearch 建索引。
- 中文用 `Intl.Segmenter('zh', { granularity: 'word' })` 切词；英文按空格和标点。
- 结果按类型分组：笔记 / 日志 / 页面；键盘上下选择，Enter 跳转。
- 全站索引预计 < 80 KB，gzip 后 < 25 KB；不需要服务端搜索。

### 9.5 转场

- `BaseLayout` 引入 `<ClientRouter />`。
- 卡片封面和标题设 `transition:name`，进入文章时共享元素放大。
- 页面根节点用 `transition:animate="fade"`，时长 320ms。
- 主题切换用 `document.startViewTransition` + `::view-transition-new(root)` 的 `clip-path` 动画。
- 所有转场在 `prefers-reduced-motion` 下退化为即时切换。

### 9.6 主题持久化

```html
<script is:inline>
  (() => {
    const t = localStorage.getItem('theme');
    const a = localStorage.getItem('accent');
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = t || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.accent = a || 'iris';
  })();
</script>
```

这段必须放在 `<head>` 里、阻塞执行，否则首帧会闪。`color-scheme` 跟着 `data-theme` 走。

### 9.7 SEO / RSS / OG

- `@astrojs/sitemap` 生成 sitemap；`@astrojs/rss` 生成 `/rss.xml`（日志流）。
- 每篇文章：canonical、`og:title`、`og:description`、`og:type`、发布日期、标签。
- OG 图：先用一张统一模板（站名 + 标题 + 光雾背景），后续可换 `satori` 动态生成。
- JSON-LD：`BlogPosting` / `WebSite`；笔记用 `TechArticle`。
- 旧 URL 301：用脚本生成完整映射，写进 `vercel.json` 的 `redirects`。
- 404 页面返回真正的 404 状态，不做软跳转。

### 9.8 统计

- 移除 CountAPI 和 `pageview.js`。
- 用 Vercel Web Analytics 看 PV/来源；不公开每页计数。
- 如果一定要保留「本页浏览」展示，第二期接 Umami Cloud + 一个只读 API，不把第三方脚本直接塞进页面。

### 9.9 部署与仓库

`vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "redirects": [
    {
      "source": "/数学/数论/第二章_同余/同余的概念",
      "destination": "/notes/math/number-theory/02-congruence/01-concept",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

仓库清理（执行前单独确认）：

- `.gitignore` 增加 `node_modules/`、`dist/`、`.astro/`、`_inbox/`、`.vercel/`。
- `git rm -r --cached site`，把构建产物移出版本控制（不删本地文件）。
- 删除根目录 VitePress 遗留 `index.md`。
- 迁移完成后，`docs/` 归档到 `content-archive/` 或直接删除（git 历史仍在）。

### 9.10 质量门禁

| 检查 | 标准 |
|---|---|
| `astro check` | 0 error |
| `npm run build` | 成功，< 60s |
| 内部链接 | 0 404 |
| 旧 URL | 27/27 命中 301（含已删除的章节索引页） |
| 公式对照 | 10 页无基线/括号/中文错位 |
| Lighthouse 移动端 | Perf ≥ 90，A11y ≥ 95，LCP < 2.5s，CLS < 0.05 |
| 响应式 | 360 / 768 / 1440 无横向滚动 |
| 键盘 | Tab 走完全站，焦点可见 |
| 主题 | 刷新不闪、不丢；reduced-motion 生效 |
| 玻璃预算 | 单页 backdrop-filter ≤ 6 个 |

---

## 10. 执行计划

| 阶段 | 产出 | 预估 | 验收 |
|---|---|---|---|
| **P0 冻结与备份** | tag `pre-refactor-2026-11`；`_inbox/` 快照；未提交文件 sha256 清单；确认「随笔」位置 | 0.5d | 任何文件都能找回 |
| **P1 地基与设计系统** | Astro 脚手架；tokens/glass/prose/motion；BaseLayout；导航；主题切换；首页骨架 | 1d | 3 种模式 × 5 强调色可切、不闪 |
| **P2 笔记迁移** | 13 篇笔记 + 2 页面 + 1 分享迁入；frontmatter；公式归一化；课程页/详情页；旧 URL 301 | 1.5d | 13/13 笔记可访问，公式对照通过 |
| **P3 页面补齐** | 首页完整；日志列表/详情 + 1 篇样例；关于/指南；实验室占位；404 | 1.5d | 所有路由有内容，无死链 |
| **P4 动效与细节** | 转场、共享元素、卡片高光、滚动入场、阅读工具栏、移动 dock | 1d | reduced-motion 下可用 |
| **P5 质量与上线** | 搜索、RSS、sitemap、OG、Lighthouse、链接检查、Vercel 预览、切域名 | 1d | 质量门禁全绿，可回滚 |

合计约 **6.5 个工作日**，加缓冲按 **8 天** 排。

### 每期的具体动作

**P0**
- `git tag pre-refactor-2026-11`
- 把未提交的 2 个新 md 和 2 个修改复制到 `_inbox/`，记录 `sha256sum`
- 确认「随笔」到底在哪；没有就先不处理
- 不动 `docs/`，不 commit

**P1**
- `npm create astro@latest`，TypeScript，最小模板
- 写 `tokens.css` / `glass.css` / `prose.css` / `motion.css`
- `GlassPanel` 先做 5 个 variant，首页放 3 张卡验证
- 主题切换 + 内联脚本 + View Transition 圆形扩散
- 浮动导航 + 移动 dock 骨架

**P2**
- 迁移脚本：复制、补 frontmatter、去 H1、修链接、归一化公式
- 课程聚合：从 collection 生成章节/篇目，不手写 nav
- 三栏笔记布局 + 目录 + 上下篇
- 生成 301 映射表，逐条验证

**P3**
- 首页 6 个 band
- 日志列表 + 类型过滤 + 归档
- 关于 / 指南 / 实验室占位 / 404
- 写 1 篇样例随笔（可以是占位，但必须是真内容）

**P4**
- `ClientRouter` + 共享元素
- 卡片高光（rAF 节流）
- 滚动入场（IntersectionObserver，错峰）
- 阅读工具栏 + 本地存储
- 移动端模糊降级

**P5**
- 搜索索引 + ⌘K
- RSS / sitemap / OG / JSON-LD
- Lighthouse + 链接检查 + 360/768/1440 截图
- Vercel preview 验收，再切生产
- 旧站保留至少 2 周

---

## 11. 风险与回滚

| 风险 | 影响 | 对策 |
|---|---|---|
| `backdrop-filter` 在低端安卓掉帧 | 滚动卡顿 | 限制层数；移动端降 blur；`@supports` 不支持的浏览器用不透明底色 |
| 霞鹜文楷体积大 | 首屏慢、CLS | 只在文章页加载；`font-display: swap`；系统宋体兜底；后续做子集化 |
| KaTeX 与 MathJax 渲染差异 | 公式错位 | 10 页截图对照；`throwOnError: false`；失败页降级 `rehype-mathjax` |
| 旧 URL 失效 | 收藏/搜索引擎掉流量 | 27 条 301；上线前逐条 curl 验证 |
| 迁移丢文件 | 内容损失 | `_inbox/` 快照 + sha256 + 迁移前后文件数对比 |
| 范围蔓延 | 拖成一个月 | 本期明确不做上传/评论/CTF 内容；实验室只做占位 |
| 新站上线翻车 | 无法访问 | Vercel 保留旧部署；tag + 分支；5 分钟切回 |

**回滚步骤**：Vercel 控制台 → Deployments → 选上一个生产部署 → Promote to Production。代码侧 `git checkout pre-refactor-2026-11`。

---

## 12. 未提交内容处理

### 现状

我在两个工作树里都没有找到名为「随笔」的文件：

- `C:/Users/raoxi/WorkBuddy/Worktrees/Blog/main-aef8e669`：`git status` 干净。
- `D:/Projects/Blog`：只有 `二次同余式的解.md`、`离散数学/index.md` 两个新文件，以及 `二次互反律.md`、`.vscode/settings.json` 两个修改。
- 文件名含「随笔」的记录在 git 历史里也没有。

所以它很可能还没保存，或不在这个仓库里。**请给我具体路径**，我再处理。

### 三个处理方案

| 方案 | 做法 | 适合 |
|---|---|---|
| **A. 草稿迁入（推荐）** | 放到 `src/content/posts/_inbox/`，`draft: true`，构建时过滤；想发时改 `draft: false` | 内容还有价值，只是没写完 |
| **B. 站外暂存** | 放到根目录 `_inbox/`（gitignore），不参与构建；重写后再迁入 | 不确定要不要发 |
| **C. 回收站** | 移到系统回收站，不做硬删除 | 确认不要了 |

默认走 **B**：不删、不发布、不阻塞重构。只有你明确给出路径并说「删」时，才会执行 C；不会硬删除。

另外，主工作树那两个未提交的数学文件是**真实内容**，迁移前会先复制到 `_inbox/` 并校验，不会因为换目录而丢。

---

## 13. 待确认的 5 件事

1. **技术栈**：确认走 Astro 迁移？还是先留在 MkDocs 上做一版视觉？
2. **站名/品牌**：继续用 `rxx's notes`，还是改成 `rxx` / 别的名字？域名是否仍用 `251890411.xyz`？
3. **导航命名**：`首页 / 笔记 / 日志 / 实验室 / 关于` 是否合适？「日志」也可以换成「文章 / 写作 / 随记」。
4. **主题范围**：3 模式 × 5 强调色（推荐），还是保留原来的 6 套配色？
5. **随笔路径**：它到底在哪？给我路径，或者确认「先不管」。

确认后我先出 **3 张关键页面的视觉稿**（首页 / 笔记详情 / 日志列表），再进 P1 写代码。

---

## 附录 A：旧 URL → 新 URL（示例）

| 旧 | 新 |
|---|---|
| `/数学/数论/第二章_同余/同余的概念/` | `/notes/math/number-theory/02-congruence/01-concept/` |
| `/数学/数论/第三章_数论函数/欧拉函数/` | `/notes/math/number-theory/03-arithmetic-functions/03-euler-function/` |
| `/数学/数论/第四章_二次剩余/勒让德符号/` | `/notes/math/number-theory/04-quadratic-residues/02-legendre-symbol/` |
| `/其他分享/刷课/` | `/writing/project/course-tools/` |
| `/关于/阅读指南/` | `/guide/` |

完整 27 条由迁移脚本生成，不手写。

## 附录 B：资源库预留 schema（不实现）

```ts
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    file: z.string().url(),      // 未来对象存储 URL
    size: z.number(),            // bytes
    mime: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

未来上传走对象存储（R2 / Supabase Storage），站点只存元数据，不把二进制放进 git。
