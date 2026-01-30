/* ============================================
   RELENTLESS PAC - Main JavaScript
   Animations, counters, and interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initNavigation();
    initCounters();
    initScrollAnimations();
    initSmoothScroll();
});

/* Navigation */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Scroll detection for nav background
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

/* Animated Counters */
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const isDecimal = element.dataset.decimal === 'true';
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        let currentValue = target * easeOut;

        if (isDecimal) {
            currentValue = currentValue.toFixed(1);
        } else {
            currentValue = Math.floor(currentValue);
            // Add comma formatting for large numbers
            currentValue = currentValue.toLocaleString();
        }

        element.textContent = prefix + currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/* Scroll Animations */
function initScrollAnimations() {
    // Add animation class to elements
    const animatableElements = document.querySelectorAll(
        '.problem-card, .step, .impact-card, .efficiency-stat, .state-tag, .methodology-note'
    );

    animatableElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for elements in the same section
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatableElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

/* Smooth Scroll */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.querySelector('.nav-links')?.classList.remove('active');
                document.querySelector('.mobile-menu-btn')?.classList.remove('active');
            }
        });
    });
}

/* Parallax Effect for Hero Background */
window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const scrolled = window.pageYOffset;
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

/* Add glow effect on mouse move (optional - subtle) */
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.impact-card, .problem-card, .step');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
