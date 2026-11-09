'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const header = document.querySelector('.site-header');
    const toTop = document.getElementById('to-top');
    const links = navLinks ? [...navLinks.querySelectorAll('a')] : [];

    const closeMenu = () => {
    if (!toggle || !navLinks) return;

    navLinks.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
};

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
           const open = navLinks.classList.toggle('active');
toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
        });

        links.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeMenu();
        });
    }

    const sections = [...document.querySelectorAll('main section[id]')];

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                links.forEach(link => {
                    const active = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', active);

                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-42% 0px -52% 0px' });

        sections.forEach(section => spy.observe(section));

        const revealer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach(item => revealer.observe(item));
    } else {
        document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));
    }

    const updateScrollUI = () => {
        if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();

    toTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const image = document.getElementById('profile-img');
    const frame = image?.closest('.image-frame');

    if (image && frame) {
        const showFallback = () => frame.classList.add('no-photo');
        image.addEventListener('error', showFallback);

        if (image.complete && image.naturalWidth === 0) showFallback();
    }

    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form && status) {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const name = form.elements.namedItem('name').value.trim();
            const email = form.elements.namedItem('email').value.trim();
            const message = form.elements.namedItem('message').value.trim();

            status.classList.remove('ok');

            if (!name || !email || !message) {
                status.textContent = 'Please fill in all fields.';
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                status.textContent = 'Please enter a valid email address.';
                return;
            }

            const subject = encodeURIComponent(`Portfolio message from ${name}`);
            const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);

            status.textContent = 'Opening your email app...';
            status.classList.add('ok');

            window.location.href =
                `mailto:SerranoSteven026@gmail.com?subject=${subject}&body=${body}`;
        });
    }
});