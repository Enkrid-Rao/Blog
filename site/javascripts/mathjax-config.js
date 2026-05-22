// docs/javascripts/mathjax-config.js
// 官方推荐：instant navigation 下必须清除缓存后重新排版
document$.subscribe(() => {
  MathJax.startup.output.clearCache();
  MathJax.typesetClear();
  MathJax.texReset();
  MathJax.typesetPromise();
});