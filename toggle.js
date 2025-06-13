document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navLinks');
    const toggle = document.querySelector('.navToggle');

    if (!nav || !toggle) {
        console.error("navLinks or navToggle element not found.");
        return;
    }

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
            element.style.transition = 'height 0.4s ease, opacity 0.5s ease';
            element.style.height = height;
            element.style.opacity = 1;
            element.classList.add('open');
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
            element.classList.remove('open');
            element.style.display = 'none';
            element.removeEventListener('transitionend', handleTransitionEnd);
        });
    }
});