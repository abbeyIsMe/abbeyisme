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
