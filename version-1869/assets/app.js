(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var active = 0;
    var timer = null;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
        slide.setAttribute("aria-hidden", i === active ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        play();
      });
    });
    show(0);
    play();
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function setupFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll("[data-filter-grid]"));
    grids.forEach(function (grid) {
      var scope = grid.closest("[data-filter-scope]") || document;
      var queryInput = scope.querySelector("[data-filter-query]");
      var genreSelect = scope.querySelector("[data-filter-genre]");
      var yearSelect = scope.querySelector("[data-filter-year]");
      var empty = scope.querySelector("[data-no-results]");
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
      function apply() {
        var query = normalize(queryInput && queryInput.value);
        var genre = normalize(genreSelect && genreSelect.value);
        var year = normalize(yearSelect && yearSelect.value);
        var shown = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-text"));
          var cardGenre = normalize(card.getAttribute("data-genre"));
          var cardYear = normalize(card.getAttribute("data-year"));
          var ok = true;
          if (query && text.indexOf(query) === -1) {
            ok = false;
          }
          if (genre && cardGenre.indexOf(genre) === -1) {
            ok = false;
          }
          if (year && cardYear !== year) {
            ok = false;
          }
          card.style.display = ok ? "block" : "none";
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.style.display = shown ? "none" : "block";
        }
      }
      [queryInput, genreSelect, yearSelect].forEach(function (el) {
        if (el) {
          el.addEventListener("input", apply);
          el.addEventListener("change", apply);
        }
      });
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || params.get("search") || "";
      if (q && queryInput) {
        queryInput.value = q;
      }
      apply();
    });
  }

  function setupSearchForms() {
    Array.prototype.slice.call(document.querySelectorAll("form[data-site-search]")).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[type='search'], input[type='text']");
        var value = input ? input.value.trim() : "";
        window.location.href = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
      });
    });
  }

  window.initMoviePlayer = function (videoId, source) {
    var video = document.getElementById(videoId);
    if (!video || !source) {
      return;
    }
    var shell = video.closest(".player-shell");
    var overlay = shell ? shell.querySelector(".play-overlay") : null;
    var prepared = false;
    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        video._hlsInstance = hls;
      } else {
        video.src = source;
      }
    }
    function start() {
      prepare();
      if (shell) {
        shell.classList.add("is-playing");
      }
      if (overlay) {
        overlay.style.display = "none";
      }
      var playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {
          if (overlay) {
            overlay.style.display = "flex";
          }
        });
      }
    }
    prepare();
    if (overlay) {
      overlay.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("is-playing");
      }
      if (overlay) {
        overlay.style.display = "none";
      }
    });
    video.addEventListener("pause", function () {
      if (shell && !video.ended) {
        shell.classList.remove("is-playing");
      }
    });
  };

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupSearchForms();
  });
})();
