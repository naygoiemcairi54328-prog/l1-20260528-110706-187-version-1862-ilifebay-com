
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initHeader() {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  function initFilters() {
    const input = document.querySelector('[data-filter-input]');
    const chips = document.querySelectorAll('[data-filter-chip]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const empty = document.querySelector('[data-empty-state]');
    const list = document.querySelector('[data-card-list]');
    if (!input && !chips.length) return;

    const apply = (value) => {
      const keyword = (value || '').trim().toLowerCase();
      const activeChip = document.querySelector('[data-filter-chip].is-active');
      const chipValue = activeChip ? activeChip.getAttribute('data-filter-chip') : 'all';
      let shown = 0;
      cards.forEach((card) => {
        const text = (card.getAttribute('data-search-text') || '').toLowerCase();
        const okKeyword = !keyword || text.includes(keyword);
        const okChip = chipValue === 'all' || text.includes(chipValue.toLowerCase());
        const visible = okKeyword && okChip;
        card.classList.toggle('hidden', !visible);
        if (visible) shown += 1;
      });
      if (empty) empty.classList.toggle('hidden', shown !== 0);
      if (list) list.dataset.count = String(shown);
    };

    if (input) {
      input.addEventListener('input', (e) => apply(e.target.value));
    }
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        apply(input ? input.value : '');
      });
    });
    apply(input ? input.value : '');
  }

  function initPlayers() {
    const shells = document.querySelectorAll('[data-video-shell]');
    shells.forEach((shell) => {
      const video = shell.querySelector('video');
      const buttons = Array.from(shell.querySelectorAll('[data-source-btn]'));
      let hls = null;

      function loadSource(src) {
        if (!video || !src) return;
        if (hls) {
          try { hls.destroy(); } catch (err) {}
          hls = null;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            maxBufferLength: 30,
            backBufferLength: 60,
            enableWorker: true,
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else {
          video.src = src;
        }
        buttons.forEach((btn) => {
          btn.classList.toggle('is-active', btn.getAttribute('data-src') === src);
        });
      }

      buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => loadSource(btn.getAttribute('data-src')));
        if (index === 0) {
          loadSource(btn.getAttribute('data-src'));
        }
      });
    });
  }

  function initBackTop() {
    const btn = document.querySelector('[data-backtop]');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('hidden', window.scrollY < 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initToolbars() {
    const sortSelects = document.querySelectorAll('[data-sort-select]');
    sortSelects.forEach((select) => {
      select.addEventListener('change', () => {
        const container = document.querySelector(select.getAttribute('data-sort-target'));
        if (!container) return;
        const cards = Array.from(container.querySelectorAll('[data-card]'));
        const mode = select.value;
        cards.sort((a, b) => {
          const ta = (a.getAttribute('data-search-text') || '').toLowerCase();
          const tb = (b.getAttribute('data-search-text') || '').toLowerCase();
          const ya = parseInt((ta.match(/(19|20)\d{2}/) || ['0'])[0], 10) || 0;
          const yb = parseInt((tb.match(/(19|20)\d{2}/) || ['0'])[0], 10) || 0;
          if (mode === 'year-asc') return ya - yb;
          if (mode === 'title-asc') return ta.localeCompare(tb, 'zh-Hans-CN');
          if (mode === 'title-desc') return tb.localeCompare(ta, 'zh-Hans-CN');
          return yb - ya;
        });
        cards.forEach((card) => container.appendChild(card));
      });
    });
  }

  ready(() => {
    initHeader();
    initFilters();
    initPlayers();
    initBackTop();
    initToolbars();
  });
})();
