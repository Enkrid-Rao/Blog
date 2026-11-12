type Theme = 'obsidian' | 'ivory' | 'sepia';

const THEME_KEY = 'rxx-theme';
const THEME_COLORS: Record<Theme, string> = {
  obsidian: '#08090b',
  ivory: '#f1eee7',
  sepia: '#e8dfcf',
};

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'ivory' || stored === 'sepia' || stored === 'obsidian') {
      return stored;
    }
  } catch (_) {}
  return 'obsidian';
}

function syncThemeUI(theme: Theme) {
  document.querySelectorAll<HTMLElement>('[data-theme-option]').forEach((el) => {
    const active = el.dataset.themeOption === theme;
    if (el.getAttribute('role') === 'menuitemradio') {
      el.setAttribute('aria-checked', String(active));
    } else {
      el.setAttribute('aria-pressed', String(active));
    }
  });
}

function applyTheme(theme: Theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
  document
    .querySelector('meta[data-theme-color]')
    ?.setAttribute('content', THEME_COLORS[theme]);
  syncThemeUI(theme);
}

function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  const startViewTransition = (
    document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
      };
    }
  ).startViewTransition;

  if (reduceMotion || typeof startViewTransition !== 'function') {
    applyTheme(theme);
    return;
  }

  const transition = startViewTransition.call(document, () => applyTheme(theme));
  transition.ready
    .then(() => {
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 620,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {});
}

syncThemeUI(readTheme());

/* ── Theme popover ─────────────────────────────────────── */

const themeWrap = document.querySelector<HTMLElement>('[data-theme-wrap]');
const themeTrigger = document.querySelector<HTMLButtonElement>('[data-theme-trigger]');
const themePopover = document.querySelector<HTMLElement>('[data-theme-popover]');

function closeThemePopover() {
  if (!themePopover || !themeTrigger) return;
  themePopover.hidden = true;
  themeTrigger.setAttribute('aria-expanded', 'false');
}

function openThemePopover() {
  if (!themePopover || !themeTrigger) return;
  themePopover.hidden = false;
  themeTrigger.setAttribute('aria-expanded', 'true');
  themePopover.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
}

themeTrigger?.addEventListener('click', (event) => {
  event.stopPropagation();
  if (themePopover?.hidden) openThemePopover();
  else closeThemePopover();
});

document.addEventListener('click', (event) => {
  if (!themeWrap || !themePopover || themePopover.hidden) return;
  if (!themeWrap.contains(event.target as Node)) closeThemePopover();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeThemePopover();
});

document.querySelectorAll<HTMLElement>('[data-theme-option]').forEach((option) => {
  option.addEventListener('click', (event) => {
    const theme = option.dataset.themeOption as Theme | undefined;
    if (!theme) return;

    // Keyboard activation reports clientX/Y as 0; use the button centre instead.
    let origin = { x: event.clientX, y: event.clientY };
    if (event.detail === 0) {
      const rect = option.getBoundingClientRect();
      origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    setTheme(theme, origin);
    closeThemePopover();
  });
});

/* ── Header state & scroll progress ────────────────────── */

const header = document.querySelector<HTMLElement>('[data-header]');
const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
const tocLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')
);
const tocHeadings = Array.from(
  document.querySelectorAll<HTMLElement>('.note-prose h2[id], .note-prose h3[id]')
);
let scrollQueued = false;

function updateToc() {
  if (!tocLinks.length || !tocHeadings.length) return;

  let activeId = '';
  for (const heading of tocHeadings) {
    if (heading.getBoundingClientRect().top <= 150) activeId = heading.id;
    else break;
  }

  tocLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
  });
}

function onScroll() {
  scrollQueued = false;
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 14);

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(y / max, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  }

  updateToc();
}

function queueScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(onScroll);
}

window.addEventListener('scroll', queueScroll, { passive: true });
window.addEventListener('resize', queueScroll, { passive: true });
onScroll();

/* ── Mobile menu ───────────────────────────────────────── */

const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
const menuOpen = document.querySelector<HTMLButtonElement>('[data-menu-open]');
let lastFocused: HTMLElement | null = null;

function focusableInMenu(): HTMLElement[] {
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null);
}

function openMenu() {
  if (!menu || !menuOpen) return;
  lastFocused = document.activeElement as HTMLElement;
  menu.classList.add('is-open');
  menu.setAttribute('aria-hidden', 'false');
  menuOpen.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  window.setTimeout(() => focusableInMenu()[0]?.focus({ preventScroll: true }), 60);
}

function closeMenu() {
  if (!menu || !menuOpen) return;
  menu.classList.remove('is-open');
  menu.setAttribute('aria-hidden', 'true');
  menuOpen.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  lastFocused?.focus({ preventScroll: true });
}

menuOpen?.addEventListener('click', () => {
  if (menu?.classList.contains('is-open')) closeMenu();
  else openMenu();
});

menu?.querySelectorAll('[data-menu-link]').forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

document.addEventListener('keydown', (event) => {
  if (!menu?.classList.contains('is-open')) return;

  if (event.key === 'Escape') {
    closeMenu();
    return;
  }

  if (event.key !== 'Tab') return;
  const items = focusableInMenu();
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
});

/* ── Reveal on scroll ──────────────────────────────────── */

const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* ── Specular highlight & card tilt ────────────────────── */

let tiltFrame = 0;

if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-specular]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const reset = () => {
      cancelAnimationFrame(tiltFrame);
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '8%');
    };

    card.addEventListener('pointermove', (event) => {
      cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
        card.style.setProperty('--my', `${(py + 0.5) * 100}%`);
      });
    });

    card.addEventListener('pointerleave', reset);
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });

  const hero = document.querySelector<HTMLElement>('.hero');
  const glow = document.querySelector<HTMLElement>('.hero-glow');
  if (hero && glow) {
    let glowFrame = 0;
    hero.addEventListener('pointermove', (event) => {
      cancelAnimationFrame(glowFrame);
      glowFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        glow.style.left = `${event.clientX - rect.left}px`;
        glow.style.top = `${event.clientY - rect.top}px`;
      });
    });
  }
}

/* ── Live clock (Asia/Shanghai) ────────────────────────── */

const clock = document.querySelector<HTMLElement>('[data-clock]');
if (clock) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const tick = () => {
    clock.textContent = `${formatter.format(new Date())} CST`;
  };
  tick();
  window.setInterval(tick, 1000);
}

/* ── Back to top ───────────────────────────────────────── */

document.querySelectorAll<HTMLElement>('[data-back-to-top]').forEach((button) => {
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});
