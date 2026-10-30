document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navLinks');
    const toggle = document.querySelector('.navToggle');

    if (!nav || !toggle) {
        console.error("navLinks or navToggle element not found.");
        return;
    }

    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            collapse(nav);
        } else {
            expand(nav);
        }
    });

    function expand(element) {
        element.style.display = 'block';
        element.style.transition = 'none';
        element.style.height = 'auto';

        const height = element.scrollHeight + 'px';
        element.style.height = '0px';
        element.style.opacity = 0;

        requestAnimationFrame(() => {
            element.style.transition = 'height 0.8s ease, opacity 0.5s ease';
            element.style.height = height;
            element.style.opacity = 1;
            element.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
        });
    }

    function collapse(element) {
        element.style.transition = 'height 0.4s ease, opacity 0.4s ease';
        element.style.height = element.scrollHeight + 'px';
        element.style.opacity = 1;

        requestAnimationFrame(() => {
            element.style.height = '0px';
            element.style.opacity = 0;
        });

        element.addEventListener('transitionend', function handleTransitionEnd() {
            reset(element);
            element.removeEventListener('transitionend', handleTransitionEnd);
        });
    }

    // Hand control back to the stylesheet so the desktop layout isn't stuck with mobile inline styles
    function reset(element) {
        element.classList.remove('open');
        element.removeAttribute('style');
        toggle.setAttribute('aria-expanded', 'false');
    }

    window.matchMedia('(min-width: 768px)').addEventListener('change', () => reset(nav));
});

// Projects page: category filters and the "Show more" button
document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.project-list');

    if (!list) {
        return;
    }

    const cards = list.querySelectorAll('.project-card');
    const filters = document.querySelectorAll('.filter-btn');
    const showMore = document.querySelector('.show-more');
    let activeFilter = 'all';
    let expanded = false;

    function render() {
        const filtering = activeFilter !== 'all';
        list.classList.toggle('is-filtered', filtering);

        cards.forEach((card) => {
            const matches = !filtering || card.dataset.category.split(' ').includes(activeFilter);
            const collapsed = !filtering && !expanded && card.classList.contains('is-extra');
            card.hidden = !matches || collapsed;
        });

        if (showMore) {
            showMore.hidden = filtering || expanded;
        }
    }

    filters.forEach((button) => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
            render();
        });
    });

    if (showMore) {
        showMore.addEventListener('click', () => {
            expanded = true;
            render();

            // The button disappears once clicked, so move keyboard focus to the first revealed project
            const firstRevealed = list.querySelector('.is-extra a');
            if (firstRevealed) {
                firstRevealed.focus();
            }
        });
    }

    render();
});

// Contact page: ask for at least one way to reply (email or phone)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form.contact-right');

    if (!form) {
        return;
    }

    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const error = form.querySelector('#contact-error');

    if (!email || !phone || !error) {
        return;
    }

    function clearError() {
        error.textContent = '';
        error.hidden = true;
    }

    // The browser's own checks (required message, email format) run before this submit event
    form.addEventListener('submit', (event) => {
        if (email.value.trim() === '' && phone.value.trim() === '') {
            event.preventDefault();
            error.hidden = false;
            error.textContent = 'Please provide an email or a phone number so I can reply.';
            email.focus();
        }
    });

    email.addEventListener('input', clearError);
    phone.addEventListener('input', clearError);
});

// Experience page: image carousel with dots and autoplay
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');

    if (!carousel) {
        return;
    }

    const slides = carousel.querySelectorAll('.carousel-slide');
    const playToggle = carousel.querySelector('.carousel-toggle');
    const dotsWrap = document.querySelector('.carousel-dots');
    const INTERVAL = 4000;

    let current = Math.max(0, [...slides].findIndex((slide) => slide.classList.contains('active')));
    let userPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hovering = false;
    let keyboardFocus = false;
    let timer = null;

    const dots = [...slides].map((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Show slide ${i + 1}`);
        dot.addEventListener('click', () => {
            goTo(i);
            restart();
        });
        if (dotsWrap) {
            dotsWrap.appendChild(dot);
        }
        return dot;
    });

    function goTo(n) {
        slides[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    }

    function canPlay() {
        return !userPaused && !hovering && !keyboardFocus && document.visibilityState === 'visible' && slides.length > 1;
    }

    // Starting afresh each time also gives dot clicks a full 4 seconds on the new slide
    function restart() {
        clearInterval(timer);
        timer = canPlay() ? setInterval(() => goTo(current + 1), INTERVAL) : null;
    }

    function updateToggle() {
        if (!playToggle) {
            return;
        }
        playToggle.setAttribute('aria-pressed', String(userPaused));
        playToggle.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        playToggle.innerHTML = userPaused ? '&#9654;&#xFE0E;' : '&#10074;&#10074;';
    }

    function isInside(element) {
        return Boolean(element) && (carousel.contains(element) || (dotsWrap && dotsWrap.contains(element)));
    }

    if (playToggle) {
        playToggle.addEventListener('click', () => {
            userPaused = !userPaused;
            updateToggle();
            restart();
        });
    }

    carousel.addEventListener('mouseenter', () => {
        hovering = true;
        restart();
    });

    carousel.addEventListener('mouseleave', () => {
        hovering = false;
        restart();
    });

    // Only keyboard focus pauses; a mouse click on a button also focuses it but shouldn't stop the slideshow
    [carousel, dotsWrap].filter(Boolean).forEach((area) => {
        area.addEventListener('focusin', (event) => {
            keyboardFocus = event.target.matches(':focus-visible');
            restart();
        });
        area.addEventListener('focusout', (event) => {
            keyboardFocus = isInside(event.relatedTarget) && keyboardFocus;
            restart();
        });
    });

    document.addEventListener('visibilitychange', restart);

    goTo(current);
    updateToggle();
    restart();
});

// Blur-up images: show the tiny placeholder first, then swap in the full image once it has downloaded
function loadFullImage(img) {
    const full = new Image();
    full.onload = () => {
        img.src = full.src;
        img.classList.add('loaded');
    };
    full.src = img.dataset.src;
}

document.addEventListener('DOMContentLoaded', () => {
    // Lazy images wait until they are near the screen, so their full files still load on demand
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                loadFullImage(entry.target);
            }
        });
    }, { rootMargin: '200px' }) : null;

    document.querySelectorAll('img.blur-up[data-src]').forEach((img) => {
        if (observer && img.loading === 'lazy') {
            observer.observe(img);
        } else {
            loadFullImage(img);
        }
    });
});
