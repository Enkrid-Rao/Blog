(function () {
  var NAMESPACE = 'rxx-notes';
  var API_BASE = 'https://countapi.mileshilliard.com/api/v1';
  var inited = false;

  function getPageKey() {
    var path = window.location.pathname;
    var key = path.replace(/\/$/, '').replace(/\//g, ':') || 'home';
    return key;
  }

  async function getCount(key, doHit) {
    try {
      var action = doHit ? 'hit' : 'get';
      var resp = await fetch(API_BASE + '/' + action + '/' + NAMESPACE + '/' + key);
      if (!resp.ok) throw new Error('API error: ' + resp.status);
      var data = await resp.json();
      return data.value;
    } catch (e) {
      console.warn('Pageview counter error:', e);
      return null;
    }
  }

  async function updateCounts() {
    var pageEl = document.getElementById('pv-page-count');
    var totalEl = document.getElementById('pv-total-count');

    if (pageEl) {
      var pageCount = await getCount(getPageKey(), true);
      if (pageCount !== null) pageEl.textContent = pageCount;
    }
    if (totalEl) {
      var totalCount = await getCount('site_total', true);
      if (totalCount !== null) totalEl.textContent = totalCount;
    }
  }

  function setup() {
    if (inited) return;
    var copyright = document.querySelector('.md-copyright');
    if (!copyright) return;
    inited = true;

    var wrap = document.createElement('span');
    wrap.style.marginLeft = '8px';
    wrap.innerHTML =
      '<span> · 本页浏览 <span id="pv-page-count">-</span></span>' +
      '<span> · 总计 <span id="pv-total-count">-</span></span>';
    copyright.appendChild(wrap);

    updateCounts();

    var _pushState = history.pushState;
    history.pushState = function () {
      _pushState.apply(this, arguments);
      updateCounts();
    };
    var _replaceState = history.replaceState;
    history.replaceState = function () {
      _replaceState.apply(this, arguments);
      updateCounts();
    };
    window.addEventListener('popstate', updateCounts);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
