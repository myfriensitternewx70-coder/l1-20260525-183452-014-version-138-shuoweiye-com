(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById('siteNav');
    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var active = 0;
        var showSlide = function (index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === active);
            });
        };
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector('[data-search-input]');
    var clearButton = document.querySelector('[data-search-clear]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var filterCards = function () {
        if (!searchInput) {
            return;
        }
        var value = searchInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            card.classList.toggle('is-filtered-out', value !== '' && text.indexOf(value) === -1);
        });
    };
    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }
    if (clearButton && searchInput) {
        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            filterCards();
            searchInput.focus();
        });
    }

    var video = document.querySelector('[data-player]');
    var playButton = document.querySelector('[data-play-button]');
    if (video && playButton) {
        var source = video.getAttribute('data-src');
        var hlsInstance = null;
        var beginPlay = function () {
            if (!source) {
                return;
            }
            playButton.classList.add('is-hidden');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                if (!video.src) {
                    video.src = source;
                }
                video.play().catch(function () {});
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsInstance) {
                    hlsInstance = new window.Hls({ enableWorker: true });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                }
                video.play().catch(function () {});
                return;
            }
            video.src = source;
            video.play().catch(function () {});
        };
        playButton.addEventListener('click', beginPlay);
        video.addEventListener('click', function () {
            if (video.paused) {
                beginPlay();
            }
        });
        video.addEventListener('play', function () {
            playButton.classList.add('is-hidden');
        });
    }
})();
