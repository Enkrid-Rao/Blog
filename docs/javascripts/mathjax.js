window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
  },
  startup: {
    ready: function () {
      MathJax.startup.defaultReady();
      // 渲染侧边栏和标题中的公式
      MathJax.startup.promise.then(function () {
        var navItems = document.querySelectorAll(".md-nav__link, .md-nav__title, h1, h2, h3");
        navItems.forEach(function (item) {
          MathJax.typesetPromise([item]);
        });
      });
    },
  },
};
