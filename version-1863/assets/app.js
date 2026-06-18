(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", nav.classList.contains("is-open"));
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        show(idx);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function searchableText(card) {
    return [
      card.getAttribute("data-title"),
      card.getAttribute("data-genre"),
      card.getAttribute("data-region"),
      card.getAttribute("data-year"),
      card.getAttribute("data-type"),
      card.getAttribute("data-category"),
      card.textContent
    ].join(" ").toLowerCase();
  }

  function setupSearch() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-search-panel]"));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var input = panel.querySelector("[data-search-input]");
      var filters = Array.prototype.slice.call(panel.querySelectorAll("[data-filter]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var empty = scope.querySelector("[data-empty-state]");
      if (!cards.length) {
        return;
      }

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var activeFilters = filters.map(function (select) {
          return {
            key: select.getAttribute("data-filter"),
            value: select.value
          };
        }).filter(function (item) {
          return item.value;
        });
        var visible = 0;
        cards.forEach(function (card) {
          var matchQuery = !q || searchableText(card).indexOf(q) !== -1;
          var matchFilters = activeFilters.every(function (item) {
            return card.getAttribute("data-" + item.key) === item.value;
          });
          var show = matchQuery && matchFilters;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      filters.forEach(function (select) {
        select.addEventListener("change", apply);
      });
      apply();
    });
  }

  window.MoviePlayer = {
    init: function (source) {
      var video = document.querySelector("[data-player-video]");
      var overlay = document.querySelector("[data-player-overlay]");
      if (!video || !source) {
        return;
      }
      var hls = null;
      var loaded = false;

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      function load() {
        if (loaded) {
          playVideo();
          return;
        }
        loaded = true;
        video.controls = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
          });
        } else {
          video.src = source;
          playVideo();
        }
      }

      if (overlay) {
        overlay.addEventListener("click", function () {
          overlay.classList.add("is-hidden");
          load();
        });
      }

      video.addEventListener("click", function () {
        if (!loaded) {
          if (overlay) {
            overlay.classList.add("is-hidden");
          }
          load();
        }
      });

      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    }
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
})();
