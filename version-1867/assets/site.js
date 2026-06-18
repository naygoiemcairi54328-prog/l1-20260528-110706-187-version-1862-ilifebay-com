(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  });

  document.querySelectorAll('[data-filter-root]').forEach(function (panel) {
    const scope = panel.closest('.movie-list-scope') || document;
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
    const input = panel.querySelector('[data-search-input]');
    const regionSelect = panel.querySelector('[data-region-filter]');
    const yearSelect = panel.querySelector('[data-year-filter]');
    const countEl = panel.querySelector('[data-filter-count]');

    const regions = Array.from(new Set(cards.map(function (card) {
      return card.getAttribute('data-region') || '';
    }).filter(Boolean))).sort();

    const years = Array.from(new Set(cards.map(function (card) {
      return card.getAttribute('data-year') || '';
    }).filter(Boolean))).sort().reverse();

    regions.forEach(function (region) {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionSelect.appendChild(option);
    });

    years.forEach(function (year) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    function applyFilters() {
      const keyword = (input.value || '').trim().toLowerCase();
      const region = regionSelect.value;
      const year = yearSelect.value;
      let visible = 0;

      cards.forEach(function (card) {
        const text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();

        const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchedRegion = !region || card.getAttribute('data-region') === region;
        const matchedYear = !year || card.getAttribute('data-year') === year;
        const matched = matchedKeyword && matchedRegion && matchedYear;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (countEl) {
        countEl.textContent = visible + ' 部';
      }
    }

    [input, regionSelect, yearSelect].forEach(function (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    });

    applyFilters();
  });
}());
