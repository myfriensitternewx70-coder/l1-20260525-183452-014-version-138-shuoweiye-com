(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var forms = document.querySelectorAll("[data-site-search]");
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input");
                var keyword = input ? input.value.trim() : "";
                var target = "search.html";
                if (keyword) {
                    target += "?q=" + encodeURIComponent(keyword);
                }
                window.location.href = target;
            });
        });

        var slides = document.querySelectorAll("[data-hero-slide]");
        var dots = document.querySelectorAll("[data-hero-dot]");
        var active = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === active);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === active);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
            });
        });

        if (slides.length > 1) {
            showSlide(0);
            window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }

        var filterRoot = document.querySelector("[data-filter-root]");

        if (filterRoot) {
            var keywordInput = filterRoot.querySelector("[data-filter-keyword]");
            var yearSelect = filterRoot.querySelector("[data-filter-year]");
            var typeSelect = filterRoot.querySelector("[data-filter-type]");
            var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-movie-card]"));
            var empty = filterRoot.querySelector("[data-empty-state]");
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");

            if (q && keywordInput) {
                keywordInput.value = q;
            }

            function filterCards() {
                var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = (card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-region")).toLowerCase();
                    var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var okYear = !year || card.getAttribute("data-year") === year;
                    var okType = !type || card.getAttribute("data-type") === type;

                    if (okKeyword && okYear && okType) {
                        card.style.display = "";
                        visible += 1;
                    } else {
                        card.style.display = "none";
                    }
                });

                if (empty) {
                    empty.style.display = visible ? "none" : "";
                }
            }

            [keywordInput, yearSelect, typeSelect].forEach(function (el) {
                if (el) {
                    el.addEventListener("input", filterCards);
                    el.addEventListener("change", filterCards);
                }
            });

            filterCards();
        }
    });
})();
