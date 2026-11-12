# rxx — 个人索引

`rxx` 的个人博客：数学、代码与文字之间的一些记录。笔记长期维护，日志按时间走，实验室留给还没成型的东西。

在线访问：https://251890411.xyz

## 技术栈

- **框架**：Astro 6（静态输出）+ TypeScript + 原生 CSS（无 Tailwind）
- **数学渲染**：KaTeX（构建时 `remark-math` + `rehype-katex`）
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
├─ data/site.ts                 # 站点名 / 导航 / hero
├─ data/taxonomy.ts             # 学科 / 课程 / 章节元数据
├─ lib/notes.ts                 # 排序、阅读时长、日期
├─ layouts/                     # BaseLayout、NoteLayout
├─ components/                  # 导航、页脚、笔记树、目录等
├─ pages/                       # 首页、笔记、日志、实验室、关于、RSS、404
└─ styles/                      # tokens / glass / prose / note
```

## 字体说明

- **JetBrains Mono**：本地优先。`src/styles/global.css` 顶部用 `@font-face` 的 `local(...)` 先找本地安装的字体，找不到再回退到 `public/fonts/jetbrains-mono/*.woff2`。代码统一用 `var(--font-mono)`。
- **Noto Serif SC**：`public/fonts/noto-serif-sc-display.woff2` 是**仅含显示字符的子集**（Google Fonts `text=` 生成）。新增标题用到了新汉字后，需要重新生成子集，否则会回退到系统宋体。

## 部署到 Vercel + 子域名

1. 把仓库导入 Vercel，框架选「Other」，`buildCommand` 和 `outputDirectory` 已写在 `vercel.json`。
2. 在 Vercel 项目 → Settings → Domains 添加主域名 `251890411.xyz`，以及子域名（如 `blog.251890411.xyz`）。
3. 到域名服务商加 CNAME 记录指向 `cname.vercel-dns.com`，等 SSL 签发即可。
4. `vercel.json` 已配置：`www` / `blog` 子域名会 301 到主域名根路径。若想让子域名直接服务（不跳转），删掉对应的 `redirects` 条目即可。
5. 若部署到子域名作为 canonical，设置环境变量 `SITE_URL=https://blog.251890411.xyz`。

## 旧站迁移说明

旧的 MkDocs 站点（`docs/`、`mkdocs.yml`）暂保留作回滚。等新站稳定后，如需把主域名切到新站，需在 `vercel.json` 补旧 URL → 新 URL 的 301（旧中文路径 → `/notes/...`），映射见 `HANDOFF.md`。
