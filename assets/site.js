
(function () {
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function initMobileMenu() {
    const btn = qs('[data-mobile-toggle]');
    const panel = qs('[data-mobile-panel]');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initHeroCarousel() {
    const slides = qsa('[data-hero-slide]');
    if (!slides.length) return;
    let current = 0;
    const setActive = (idx) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === idx));
      const dots = qsa('[data-hero-dot]');
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
      current = idx;
    };
    const next = () => setActive((current + 1) % slides.length);
    const timer = setInterval(next, 5200);
    qsa('[data-hero-dot]').forEach((dot, idx) => {
      dot.addEventListener('click', () => setActive(idx));
    });
    const shell = qs('[data-hero-shell]');
    if (shell) {
      shell.addEventListener('mouseenter', () => clearInterval(timer), { once: true });
    }
    setActive(0);
  }

  function initFilters() {
    const input = qs('[data-filter-input]');
    if (!input) return;
    const cards = qsa('[data-filter-card]');
    const emptyState = qs('[data-filter-empty]');
    const count = qs('[data-filter-count]');
    const run = () => {
      const key = input.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const hay = (card.dataset.filterText || '').toLowerCase();
        const match = !key || hay.includes(key);
        card.classList.toggle('hidden', !match);
        if (match) visible += 1;
      });
      if (count) count.textContent = visible;
      if (emptyState) emptyState.classList.toggle('hidden', visible !== 0);
    };
    input.addEventListener('input', run);
    run();
  }

  function initSmoothAnchor() {
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  initMobileMenu();
  initHeroCarousel();
  initFilters();
  initSmoothAnchor();
})();
