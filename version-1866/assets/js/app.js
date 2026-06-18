(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var current = 0;
            var timer = null;
            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }
            function start() {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    show(current + 1);
                }, 5200);
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });
            if (slides.length > 1) {
                show(0);
                start();
            }
        }

        var filterBox = document.querySelector("[data-filter-box]");
        if (filterBox) {
            var search = filterBox.querySelector("[data-filter-search]");
            var genre = filterBox.querySelector("[data-filter-genre]");
            var region = filterBox.querySelector("[data-filter-region]");
            var year = filterBox.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
            var empty = document.querySelector("[data-no-results]");
            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }
            function apply() {
                var term = normalize(search && search.value);
                var genreValue = normalize(genre && genre.value);
                var regionValue = normalize(region && region.value);
                var yearValue = normalize(year && year.value);
                var shown = 0;
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-genre") + " " + card.getAttribute("data-region") + " " + card.getAttribute("data-year") + " " + card.getAttribute("data-tags"));
                    var ok = true;
                    if (term && haystack.indexOf(term) === -1) {
                        ok = false;
                    }
                    if (genreValue && normalize(card.getAttribute("data-genre")).indexOf(genreValue) === -1) {
                        ok = false;
                    }
                    if (regionValue && normalize(card.getAttribute("data-region")).indexOf(regionValue) === -1) {
                        ok = false;
                    }
                    if (yearValue && normalize(card.getAttribute("data-year")) !== yearValue) {
                        ok = false;
                    }
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.style.display = shown ? "none" : "block";
                }
            }
            [search, genre, region, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        }
    });
})();
