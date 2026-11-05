/* Shared viewport reveals for page content. The Home hero uses its own one-shot animation. */
(() => {
    const revealSelector = [
        'main h1:not(.hero-bounce-text)',
        'main h2',
        'main h3',
        'main p',
        'main li',
        'main img',
        'main [class*="card"]',
        'main [class*="box"]',
        'main [class*="tile"]',
        'main .founder-block',
        'main [class*="prose"]',
        'main [class*="description"]'
    ].join(',');

    function initScrollReveals() {
        const main = document.querySelector('main');
        if (!main) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const siblingCounts = new WeakMap();
        const observer = !reduceMotion && 'IntersectionObserver' in window
            ? new IntersectionObserver((entries, currentObserver) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const element = entry.target;
                    element.classList.add('visible');
                    currentObserver.unobserve(element);
                    const delay = parseFloat(element.style.getPropertyValue('--scroll-reveal-delay')) || 0;
                    window.setTimeout(() => element.style.removeProperty('--scroll-reveal-delay'), 760 + delay);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
            : null;

        function revealWithin(scope) {
            const candidates = [];
            if (scope.nodeType === Node.ELEMENT_NODE && scope.matches(revealSelector)) candidates.push(scope);
            if (scope.querySelectorAll) candidates.push(...scope.querySelectorAll(revealSelector));

            candidates.forEach(element => {
                if (element.closest('.hero-section') || element.classList.contains('hero-bounce-text')) return;
                const revealParent = element.parentElement && element.parentElement.closest('.scroll-reveal, .reveal-on-scroll');
                if (revealParent && main.contains(revealParent)) return;
                if (element.classList.contains('scroll-reveal')) return;

                element.classList.add('scroll-reveal');
                const parent = element.parentElement;
                const siblingIndex = parent ? (siblingCounts.get(parent) || 0) : 0;
                if (parent) siblingCounts.set(parent, siblingIndex + 1);
                const delay = Math.min(siblingIndex * 110, 440);
                if (delay) element.style.setProperty('--scroll-reveal-delay', `${delay}ms`);

                if (observer) observer.observe(element);
                else element.classList.add('visible');
            });
        }

        revealWithin(main);
        if ('MutationObserver' in window) {
            const contentObserver = new MutationObserver(records => {
                records.forEach(record => record.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && main.contains(node)) revealWithin(node);
                }));
            });
            contentObserver.observe(main, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveals, { once: true });
    } else {
        initScrollReveals();
    }
})();