// docs/javascripts/katex-config.js
// 直接从 .arithmatex 元素中提取 LaTeX 源码渲染，避免 auto-render 与 arithmatex 的冲突
document$.subscribe(() => {
  document.querySelectorAll(".arithmatex:not([data-katex-done])").forEach(el => {
    let tex = el.textContent;
    const display = el.tagName === "DIV";
    // 去掉 arithmatex generic 模式添加的 \[...\] / \(...\) 壳
    if (tex.startsWith("\\[") && tex.endsWith("\\]")) {
      tex = tex.slice(2, -2);
    } else if (tex.startsWith("\\(") && tex.endsWith("\\)")) {
      tex = tex.slice(2, -2);
    }
    el.setAttribute("data-katex-done", "true");
    katex.render(tex.trim(), el, { displayMode: display, throwOnError: false });
  });
});
