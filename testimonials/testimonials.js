/**
 * Testimonials page: review loading, rendering, rating and local feedback.
 * Reviews are read from the static JSON file and browser storage; no backend is required.
 */
document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const feedbackForm = document.getElementById('feedback-form');
    const starContainer = document.getElementById('star-rating-input');
    const ratingValueInput = document.getElementById('rating-value');
    const ux = window.AvrSiteUX;
    let currentRating = 0;
    let defaultReviews = [];
    let defaultsLoaded = false;
    let isSubmitting = false;

    function readLocalReviews() {
        try {
            const stored = localStorage.getItem('user_testimonials');
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed.filter(review => review && typeof review === 'object') : [];
        } catch {
            return [];
        }
    }

    function escapeHTML(value) {
        return String(value || '').replace(/[&<>\'"]/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[character]));
    }

    function renderReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-bar-card reveal-on-scroll';
        const rating = Math.max(0, Math.min(5, Math.floor(Number(review.rating) || 0)));
        const starsHTML = Array.from({ length: 5 }, (_, index) =>
            `<i class="bi ${index < rating ? 'bi-star-fill' : 'bi-star'} me-1" aria-hidden="true"></i>`
        ).join('');
        const formattedDate = review.date
            ? new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
            : 'Recently';
        const fullText = String(review.feedback || '');
        const truncatedText = fullText.length > 120 ? `${fullText.substring(0, 120)}...` : fullText;

        card.innerHTML = `
            <div class="card-bar-top">
                <div class="card-bar-author">
                    <span class="author-name">${escapeHTML(review.name || 'AVR DABBA Parent')}</span>
                    <span class="author-role">${escapeHTML(review.role || 'Valued Parent')}</span>
                </div>
                <div class="card-bar-meta">
                    <div class="star-rating-display" aria-label="${rating} out of 5 stars">${starsHTML}</div>
                    <span class="author-date">${escapeHTML(formattedDate)}</span>
                </div>
            </div>
            <div class="card-bar-body">
                <p class="review-text">&ldquo;${escapeHTML(truncatedText)}&rdquo;</p>
                ${fullText.length > 120 ? '<button type="button" class="btn-toggle-more" aria-expanded="false">Read More <i class="bi bi-chevron-down" aria-hidden="true"></i></button>' : ''}
            </div>`;

        if (fullText.length > 120) {
            const toggle = card.querySelector('.btn-toggle-more');
            const text = card.querySelector('.review-text');
            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') !== 'true';
                toggle.setAttribute('aria-expanded', String(expanded));
                text.innerHTML = `&ldquo;${escapeHTML(expanded ? fullText : truncatedText)}&rdquo;`;
                toggle.innerHTML = expanded
                    ? 'Show Less <i class="bi bi-chevron-up" aria-hidden="true"></i>'
                    : 'Read More <i class="bi bi-chevron-down" aria-hidden="true"></i>';
            });
        }
        return card;
    }

    function updateDigitalRatingBadge(reviews) {
        const value = document.getElementById('average-rating-value');
        const stars = document.getElementById('average-rating-stars');
        const count = document.getElementById('reviews-count-label');
        if (!reviews.length) {
            if (value) value.textContent = '5.0';
            if (count) count.textContent = '(0 reviews)';
            return;
        }
        const average = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length;
        const rounded = Math.round(average);
        if (value) value.textContent = average.toFixed(1);
        if (count) count.textContent = `(${reviews.length} reviews)`;
        if (stars) stars.innerHTML = Array.from({ length: 5 }, (_, index) =>
            `<i class="bi ${index < rounded ? 'bi-star-fill' : 'bi-star'}" aria-hidden="true"></i>`
        ).join('');
    }

    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal-on-scroll:not(.visible)');
        if (!('IntersectionObserver' in window)) {
            elements.forEach(element => element.classList.add('visible'));
            return;
        }
        const observer = new IntersectionObserver((entries, activeObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    activeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
        elements.forEach(element => observer.observe(element));
    }

    function renderReviews({ showError = false } = {}) {
        const localReviews = readLocalReviews();
        const allReviews = [...localReviews, ...defaultReviews].filter(review => Number(review.rating) >= 1);
        if (reviewsContainer) {
            const cards = allReviews.map(renderReviewCard);
            reviewsContainer.replaceChildren(...cards);
            reviewsContainer.setAttribute('aria-busy', 'false');
            if (showError && ux) {
                ux.showRetry(reviewsContainer,
                    allReviews.length
                        ? 'Some published reviews could not be loaded. Showing saved reviews for now.'
                        : 'Reviews could not be loaded right now. Please try again.',
                    () => loadTestimonials({ retry: true }), { append: true });
            }
            initScrollReveal();
        }
        updateDigitalRatingBadge(allReviews);
    }

    async function loadTestimonials({ retry = false } = {}) {
        if (!reviewsContainer) return;
        if (!retry && !defaultsLoaded && !readLocalReviews().length && ux) {
            ux.showSkeletons(reviewsContainer, { count: 3, type: 'review' });
        }
        try {
            defaultReviews = ux
                ? await ux.fetchJSON('testimonials.json')
                : await fetch('testimonials.json').then(response => {
                    if (!response.ok) throw new Error('Request failed');
                    return response.json();
                });
            if (!Array.isArray(defaultReviews)) defaultReviews = [];
            defaultsLoaded = true;
            renderReviews();
        } catch {
            renderReviews({ showError: true });
        }
    }

    if (starContainer) {
        const stars = [...starContainer.querySelectorAll('.star-icon')];
        const paintStars = rating => stars.forEach((star, index) => {
            const active = index < rating;
            star.classList.toggle('bi-star-fill', active);
            star.classList.toggle('active', active);
            star.classList.toggle('bi-star', !active);
        });
        paintStars(0);
        stars.forEach((star, index) => {
            star.setAttribute('role', 'button');
            star.setAttribute('tabindex', '0');
            star.setAttribute('aria-label', `${index + 1} star${index ? 's' : ''}`);
            const select = () => {
                currentRating = index + 1;
                if (ratingValueInput) ratingValueInput.value = String(currentRating);
                paintStars(currentRating);
            };
            star.addEventListener('mouseenter', () => paintStars(index + 1));
            star.addEventListener('click', select);
            star.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    select();
                }
            });
        });
        starContainer.addEventListener('mouseleave', () => paintStars(currentRating));
        starContainer.addEventListener('focusout', () => paintStars(currentRating));
    }

    if (feedbackForm) {
        const status = ux ? ux.createStatus(feedbackForm, 'site-form-status') : null;
        const submitButton = feedbackForm.querySelector('[type="submit"]');
        const announce = (message, kind) => {
            if (!status) return;
            status.textContent = message;
            status.classList.remove('is-error', 'is-success');
            if (kind) status.classList.add(`is-${kind}`);
        };

        feedbackForm.addEventListener('submit', async event => {
            event.preventDefault();
            if (isSubmitting) return;
            if (!currentRating) {
                announce('Please select a star rating (1 to 5 stars) before submitting your review.', 'error');
                starContainer?.querySelector('.star-icon')?.focus();
                return;
            }
            const name = document.getElementById('user-name')?.value.trim() || '';
            const role = document.getElementById('user-role')?.value.trim() || '';
            const feedback = document.getElementById('user-feedback')?.value.trim() || '';
            if (!name || !feedback) {
                announce('Please enter your name and review before submitting.', 'error');
                return;
            }

            const review = {
                id: Date.now(), name, role: role || 'Valued Parent', rating: currentRating,
                feedback, date: new Date().toISOString().slice(0, 10), verified: true
            };
            isSubmitting = true;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.setAttribute('aria-busy', 'true');
            }
            announce('Saving your review…', '');
            try {
                const updated = [review, ...readLocalReviews()];
                localStorage.setItem('user_testimonials', JSON.stringify(updated));
                announce('Thank you! Your review has been saved on this device.', 'success');
                feedbackForm.reset();
                currentRating = 0;
                if (ratingValueInput) ratingValueInput.value = '0';
                starContainer?.querySelectorAll('.star-icon').forEach(star => {
                    star.classList.remove('bi-star-fill', 'active');
                    star.classList.add('bi-star');
                });
                renderReviews({ showError: !defaultsLoaded });
                reviewsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch {
                announce('Your review could not be saved in this browser. Please check available storage and try again.', 'error');
            } finally {
                isSubmitting = false;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.removeAttribute('aria-busy');
                }
            }
        });
    }

    loadTestimonials();
});
