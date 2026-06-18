(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupHero() {
        const hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        if (slides.length < 2) {
            return;
        }
        let current = 0;
        let timer = null;

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
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function reset(index) {
            if (timer) {
                window.clearInterval(timer);
            }
            show(index);
            start();
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                reset(index);
            });
        });
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupFilters() {
        const input = document.getElementById("movieSearch");
        const cards = Array.from(document.querySelectorAll("[data-card]"));
        if (!input || cards.length === 0) {
            return;
        }
        const regionFilter = document.getElementById("regionFilter");
        const typeFilter = document.getElementById("typeFilter");
        const yearFilter = document.getElementById("yearFilter");
        const resultCount = document.getElementById("resultCount");
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";
        if (query) {
            input.value = query;
        }

        function matches(card) {
            const keyword = normalize(input.value);
            const region = regionFilter ? regionFilter.value : "";
            const type = typeFilter ? typeFilter.value : "";
            const year = yearFilter ? yearFilter.value : "";
            const haystack = normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year,
                card.dataset.tags
            ].join(" "));
            const keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
            const regionOk = !region || card.dataset.region === region;
            const typeOk = !type || card.dataset.type === type;
            const yearOk = !year || card.dataset.year === year;
            return keywordOk && regionOk && typeOk && yearOk;
        }

        function apply() {
            let visible = 0;
            cards.forEach(function (card) {
                const isMatch = matches(card);
                card.classList.toggle("is-hidden", !isMatch);
                if (isMatch) {
                    visible += 1;
                }
            });
            if (resultCount) {
                resultCount.textContent = "当前显示 " + visible + " 部";
            }
        }

        input.addEventListener("input", apply);
        if (regionFilter) {
            regionFilter.addEventListener("change", apply);
        }
        if (typeFilter) {
            typeFilter.addEventListener("change", apply);
        }
        if (yearFilter) {
            yearFilter.addEventListener("change", apply);
        }
        apply();
    }

    ready(function () {
        setupHero();
        setupFilters();
    });
}());
