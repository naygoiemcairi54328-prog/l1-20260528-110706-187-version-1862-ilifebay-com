
(function () {
  const d = document;
  const header = d.querySelector('.site-header');
  const menuBtn = d.querySelector('.menu-toggle');
  const nav = d.querySelector('.site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  }

  const hero = d.querySelector('[data-hero-carousel]');
  if (hero) {
    const slides = Array.from(hero.children);
    let index = 0;
    const show = (next) => {
      slides.forEach((slide, i) => {
        slide.style.display = i === next ? 'grid' : 'none';
      });
      index = next;
    };
    slides.forEach((slide, i) => slide.style.display = i === 0 ? 'grid' : 'none');
    if (slides.length > 1) {
      setInterval(() => show((index + 1) % slides.length), 6000);
    }
  }

  const scopes = Array.from(d.querySelectorAll('[data-search-scope]'));
  const searchInput = d.querySelector('[data-search-input]');
  const searchClear = d.querySelector('[data-search-clear]');
  const chips = Array.from(d.querySelectorAll('[data-filter]'));
  let activeFilter = 'all';

  function filterCards() {
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    scopes.forEach(scope => {
      const cards = Array.from(scope.querySelectorAll('.movie-card'));
      cards.forEach(card => {
        const text = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.type,
          card.dataset.region,
          card.dataset.year,
          card.dataset.tags,
          card.dataset.category,
          card.textContent
        ].join(' ').toLowerCase();
        const matchesQuery = !q || text.includes(q);
        const matchesFilter = activeFilter === 'all' || text.includes(activeFilter.toLowerCase());
        card.classList.toggle('hidden-card', !(matchesQuery && matchesFilter));
      });
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      activeFilter = 'all';
      chips.forEach(chip => chip.classList.toggle('active', chip.dataset.filter === 'all'));
      filterCards();
    });
  }
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter || 'all';
      chips.forEach(c => c.classList.toggle('active', c === chip));
      filterCards();
    });
  });
  filterCards();

  const shells = Array.from(d.querySelectorAll('.player-shell'));
  shells.forEach(shell => {
    const video = shell.querySelector('video');
    const overlay = shell.querySelector('.player-overlay');
    const src = shell.dataset.stream;
    let hls = null;

    const start = async () => {
      if (overlay) overlay.classList.add('hidden');
      if (window.Hls && Hls.isSupported()) {
        if (!hls) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.src) video.src = src;
      } else {
        video.src = src;
      }
      try {
        await video.play();
      } catch (err) {}
    };

    if (overlay) overlay.addEventListener('click', start);
    if (video) {
      video.addEventListener('click', start);
      video.addEventListener('play', () => overlay && overlay.classList.add('hidden'));
    }
  });
})();
