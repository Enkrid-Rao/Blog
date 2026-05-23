document$.subscribe(function () {
  // ── MathJax re-typeset after navigation ──
  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise();
  }

  // ── Color theme picker ──
  const themes = [
    { primary: 'indigo', accent: 'indigo',      name: '靛蓝',     hex: '#4051b5' },
    { primary: 'blue',   accent: 'light-blue',   name: '蓝色',     hex: '#2094f3' },
    { primary: 'teal',   accent: 'green',         name: '护眼绿',   hex: '#009485' },
    { primary: 'amber',       accent: 'deep-orange',   name: '护眼暖黄', hex: '#ffa000' },
    { primary: 'brown',       accent: 'orange',         name: '暖纸',     hex: '#795548' },
    { primary: 'slate-gray',  accent: 'blue-grey',      name: '墨灰',     hex: '#546e7a' },
  ];

  const currentPrimary = document.body.getAttribute('data-md-color-primary') || 'slate-gray';

  // Build dropdown
  const wrapper = document.createElement('div');
  wrapper.className = 'md-theme-picker';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'md-theme-trigger';
  trigger.title = '切换配色';
  trigger.innerHTML =
    '<img src="/figures/palette.svg" width="22" height="22" alt="调色盘" style="display:block">';

  const menu = document.createElement('div');
  menu.className = 'md-theme-menu';

  themes.forEach(function (t) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'md-theme-item';
    if (t.primary === currentPrimary) item.classList.add('active');

    const dot = document.createElement('span');
    dot.className = 'md-theme-dot';
    dot.style.backgroundColor = t.hex;

    const label = document.createElement('span');
    label.textContent = t.name;

    item.appendChild(dot);
    item.appendChild(label);

    item.addEventListener('click', function () {
      document.body.setAttribute('data-md-color-primary', t.primary);
      document.body.setAttribute('data-md-color-accent', t.accent);
      menu.querySelectorAll('.md-theme-item').forEach(function (el) {
        el.classList.remove('active');
      });
      item.classList.add('active');
      menu.classList.remove('open');
    });

    menu.appendChild(item);
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(menu);

  // Toggle on click
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', function () {
    menu.classList.remove('open');
  });

  // Insert into header
  const headerInner = document.querySelector('.md-header__inner');
  if (!headerInner) return;
  const paletteLabel = document.querySelector('label[for="__palette"]');
  if (paletteLabel) {
    paletteLabel.insertAdjacentElement('beforebegin', wrapper);
  } else {
    headerInner.appendChild(wrapper);
  }
});
