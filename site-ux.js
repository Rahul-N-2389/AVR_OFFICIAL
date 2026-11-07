/* Shared, lightweight loading, connectivity, and error helpers for AVR DABBA. */
(() => {
    const ux = {};
    let activeRequests = 0;
    let loadingTimer = null;
    let onlineTimer = null;
    let loadingLine;
    let connectionNotice;

    function ensureFeedbackUI() {
        if (!document.body) return;

        if (!loadingLine) {
            loadingLine = document.createElement('div');
            loadingLine.className = 'site-ux-loading-line';
            loadingLine.setAttribute('role', 'progressbar');
            loadingLine.setAttribute('aria-label', 'Loading content');
            loadingLine.setAttribute('aria-valuetext', 'Loading');
            loadingLine.hidden = true;
            document.body.appendChild(loadingLine);
        }

        if (!connectionNotice) {
            connectionNotice = document.createElement('div');
            connectionNotice.className = 'site-connectivity-notice';
            connectionNotice.setAttribute('role', 'status');
            connectionNotice.setAttribute('aria-live', 'polite');
            connectionNotice.hidden = true;
            document.body.appendChild(connectionNotice);
        }
    }

    function syncConnectionNotice() {
        ensureFeedbackUI();
        if (!connectionNotice) return;

        window.clearTimeout(onlineTimer);
        if (!navigator.onLine) {
            connectionNotice.textContent = 'You are currently offline. Please check your internet connection.';
            connectionNotice.classList.add('is-offline');
            connectionNotice.hidden = false;
            return;
        }

        if (connectionNotice.classList.contains('is-offline')) {
            connectionNotice.textContent = 'Connection restored.';
            connectionNotice.classList.remove('is-offline');
            connectionNotice.hidden = false;
            onlineTimer = window.setTimeout(() => {
                if (connectionNotice) connectionNotice.hidden = true;
            }, 3200);
        }
    }

    function syncConnectionQuality() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlow = Boolean(connection && /^(slow-2g|2g|3g)$/.test(connection.effectiveType || ''));
        document.documentElement.classList.toggle('site-slow-network', isSlow);
    }

    function beginTrackedRequest() {
        activeRequests += 1;
        if (activeRequests === 1) {
            window.clearTimeout(loadingTimer);
            loadingTimer = window.setTimeout(() => {
                if (activeRequests && loadingLine) loadingLine.hidden = false;
            }, 450);
        }
    }

    function endTrackedRequest() {
        activeRequests = Math.max(0, activeRequests - 1);
        if (activeRequests === 0) {
            window.clearTimeout(loadingTimer);
            if (loadingLine) loadingLine.hidden = true;
        }
    }

    ux.fetchJSON = async function fetchJSON(url, { timeoutMs = 10000, signal } = {}) {
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeout = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;
        let timedOut = false;
        beginTrackedRequest();

        try {
            if (signal && controller) {
                if (signal.aborted) controller.abort();
                else signal.addEventListener('abort', () => controller.abort(), { once: true });
            }

            const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
            if (!response.ok) {
                const error = new Error('Request failed');
                error.code = 'http';
                error.status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            timedOut = Boolean(controller && controller.signal.aborted && navigator.onLine);
            const safeError = new Error('Unable to load content. Please check your internet connection.');
            safeError.code = !navigator.onLine ? 'offline' : (timedOut ? 'timeout' : (error.code || 'network'));
            throw safeError;
        } finally {
            if (timeout !== null) window.clearTimeout(timeout);
            endTrackedRequest();
        }
    };

    ux.showSkeletons = function showSkeletons(container, { count = 3, type = 'review' } = {}) {
        if (!container) return;
        const items = Array.from({ length: count }, () => {
            const skeleton = document.createElement('div');
            skeleton.className = `site-skeleton site-${type}-skeleton`;
            skeleton.setAttribute('aria-hidden', 'true');
            return skeleton;
        });
        container.setAttribute('aria-busy', 'true');
        container.replaceChildren(...items);
    };

    ux.showRetry = function showRetry(container, message, onRetry, { append = false } = {}) {
        if (!container) return null;
        if (!append) container.querySelectorAll(':scope > .site-inline-message').forEach(item => item.remove());

        const panel = document.createElement('div');
        panel.className = 'site-inline-message';
        panel.setAttribute('role', 'alert');

        const text = document.createElement('p');
        text.textContent = message || 'Unable to load content. Please check your internet connection.';
        panel.appendChild(text);

        if (typeof onRetry === 'function') {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'site-retry-button';
            button.textContent = 'Retry';
            button.addEventListener('click', async () => {
                button.disabled = true;
                button.setAttribute('aria-busy', 'true');
                try {
                    await onRetry();
                } finally {
                    button.removeAttribute('aria-busy');
                    if (button.isConnected) button.disabled = false;
                }
            });
            panel.appendChild(button);
        }

        container.appendChild(panel);
        return panel;
    };

    ux.createStatus = function createStatus(afterElement, className = 'site-form-status') {
        if (!afterElement || !afterElement.parentNode) return null;
        let status = afterElement.parentNode.querySelector(`:scope > .${className}`);
        if (!status) {
            status = document.createElement('p');
            status.className = className;
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            afterElement.insertAdjacentElement('afterend', status);
        }
        return status;
    };

    function monitorImages(root = document) {
        root.querySelectorAll('img').forEach(image => {
            if (image.dataset.siteImageObserved) return;
            image.dataset.siteImageObserved = 'true';

            const markLoaded = () => {
                image.hidden = false;
                image.classList.remove('site-image-loading', 'site-image-error');
                image.dataset.siteImageState = 'loaded';
                const fallback = image.nextElementSibling;
                if (fallback && fallback.classList.contains('site-image-fallback')) fallback.remove();
            };

            const markFailed = () => {
                if (image.dataset.fallback && !image.dataset.siteFallbackUsed) {
                    image.dataset.siteFallbackUsed = 'true';
                    image.src = image.dataset.fallback;
                    return;
                }
                image.classList.remove('site-image-loading');
                image.classList.add('site-image-error');
                image.dataset.siteImageState = 'error';

                // Existing per-image fallback behavior takes precedence.
                if (image.hasAttribute('onerror') || image.dataset.siteFallbackShown) return;
                image.dataset.siteFallbackShown = 'true';
                image.hidden = true;
                const fallback = document.createElement('div');
                fallback.className = 'site-image-fallback';
                fallback.setAttribute('role', 'group');
                fallback.setAttribute('aria-label', image.alt ? `Image unavailable: ${image.alt}` : 'Image unavailable');

                const message = document.createElement('span');
                message.textContent = image.alt ? `Image unavailable: ${image.alt}` : 'Image unavailable';
                fallback.appendChild(message);

                const retry = document.createElement('button');
                retry.type = 'button';
                retry.className = 'site-retry-button';
                retry.textContent = 'Retry image';
                retry.addEventListener('click', () => {
                    retry.disabled = true;
                    image.dataset.siteFallbackShown = '';
                    image.hidden = false;
                    image.classList.remove('site-image-error');
                    image.classList.add('site-image-loading');
                    const originalURL = image.dataset.originalSrc || image.src;
                    image.dataset.originalSrc = originalURL;
                    try {
                        const retryURL = new URL(originalURL, document.baseURI);
                        retryURL.searchParams.set('_avr_retry', String(Date.now()));
                        image.src = retryURL.href;
                    } catch {
                        image.src = originalURL;
                    }
                    fallback.remove();
                });
                fallback.appendChild(retry);
                image.insertAdjacentElement('afterend', fallback);
            };

            image.addEventListener('load', markLoaded, { once: true });
            image.addEventListener('error', markFailed);

            if (image.complete) {
                if (image.naturalWidth > 0) markLoaded();
                else markFailed();
            } else {
                image.classList.add('site-image-loading');
                image.dataset.siteImageState = 'loading';
            }
        });
    }

    document.addEventListener('error', event => {
        if (event.target instanceof HTMLImageElement) {
            const image = event.target;
            if (!image.dataset.siteImageObserved) monitorImages(image.parentElement || document);
        }
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ensureFeedbackUI();
            syncConnectionNotice();
            syncConnectionQuality();
            monitorImages();
        }, { once: true });
    } else {
        ensureFeedbackUI();
        syncConnectionNotice();
        syncConnectionQuality();
        monitorImages();
    }

    window.addEventListener('offline', syncConnectionNotice);
    window.addEventListener('online', syncConnectionNotice);
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', syncConnectionQuality);
    }

    window.AvrSiteUX = ux;
})();
