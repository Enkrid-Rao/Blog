// docs/javascripts/mathjax-config.js
document$.subscribe(function() {
  if (window.MathJax) {
    MathJax.startup.output.clearCache(); // 清除渲染缓存
    MathJax.typesetClear(); // 清除已排版记录
    MathJax.texReset(); // 重置公式编号
    MathJax.typesetPromise(); // 重新排版，包含侧边栏区域
  }
});