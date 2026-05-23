MathJax = {
  loader: {load: ['[tex]/cancel']},
  tex: {
    packages: {'[+]': ['cancel']}
  },
  chtml: {
    matchFontHeight: false
  }
};

document$.subscribe(function () {
  MathJax.typesetPromise();
});
