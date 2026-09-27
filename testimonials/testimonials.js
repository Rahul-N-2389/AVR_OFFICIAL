/**
 * AVR DABBA - Testimonials JavaScript (testimonials.js)
 * Controls side-by-side reviews & feedback form, 120-character review truncation with Read More toggle,
 * dynamic average digital rating out of 5 calculation, and JSON/LocalStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const feedbackForm = document.getElementById('feedbackForm');
    const starContainer = document.getElementById('starRatingInput');
    const ratingValueInput = document.getElementById('ratingValue');
    let currentRating = 0;

    // ----------------------------------------------------------------------
    // 1. Interactive 5-Star Rating Control
    // ----------------------------------------------------------------------
    if (starContainer) {
        const stars = starContainer.querySelectorAll('.star-icon');

        function updateStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('bi-star');
                    star.classList.add('bi-star-fill', 'active');
                } else {
                    star.classList.remove('bi-star-fill', 'active');
                    star.classList.add('bi-star');
                }
            });
        }

        updateStars(0);

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.getAttribute('data-value'));
                updateStars(hoverRating);
            });

            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-value'));
                if (ratingValueInput) ratingValueInput.value = currentRating;
                updateStars(currentRating);
            });
        });

        starContainer.addEventListener('mouseleave', () => {
            updateStars(currentRating);
        });
    }

    // ----------------------------------------------------------------------
    // 2. Render Review Bar Card with 120-Char Truncation
    // ----------------------------------------------------------------------
    function renderReviewCard(review, isNew = false) {
        const card = document.createElement('div');
        card.className = `review-bar-card reveal-on-scroll ${isNew ? 'newly-added' : ''}`;

        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                starsHTML += '<i class="bi bi-star-fill me-1"></i>';
            } else {
                starsHTML += '<i class="bi bi-star me-1"></i>';
            }
        }

        const dateStr = review.date ? new Date(review.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Recently';

        const fullText = review.feedback || '';
        const limit = 120;
        const needsTruncation = fullText.length > limit;
        const truncatedText = needsTruncation ? fullText.substring(0, limit) + '...' : fullText;

        card.innerHTML = `
            <div class="card-bar-top">
                <div class="card-bar-author">
                    <span class="author-name">${escapeHTML(review.name)}</span>
                    <span class="author-role">${escapeHTML(review.role || 'Valued Parent')}</span>
                </div>
                <div class="card-bar-meta">
                    <div class="star-rating-display">${starsHTML}</div>
                    <span class="author-date">${dateStr}</span>
                </div>
            </div>
            <div class="card-bar-body">
                <p class="review-text" data-full="${escapeHTML(fullText)}" data-truncated="${escapeHTML(truncatedText)}">&ldquo;${escapeHTML(truncatedText)}&rdquo;</p>
                ${needsTruncation ? '<button type="button" class="btn-toggle-more">Read More <i class="bi bi-chevron-down"></i></button>' : ''}
            </div>
        `;

        if (needsTruncation) {
            const toggleBtn = card.querySelector('.btn-toggle-more');
            const reviewTextP = card.querySelector('.review-text');
            let isExpanded = false;

            toggleBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    reviewTextP.innerHTML = `&ldquo;${escapeHTML(fullText)}&rdquo;`;
                    toggleBtn.innerHTML = 'Show Less <i class="bi bi-chevron-up"></i>';
                } else {
                    reviewTextP.innerHTML = `&ldquo;${escapeHTML(truncatedText)}&rdquo;`;
                    toggleBtn.innerHTML = 'Read More <i class="bi bi-chevron-down"></i>';
                }
            });
        }

        return card;
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // ----------------------------------------------------------------------
    // 3. Update Digital Average Rating Badge
    // ----------------------------------------------------------------------
    function updateDigitalRatingBadge(allReviews) {
        const avgRatingValEl = document.getElementById('avgRatingValue');
        const avgRatingStarsEl = document.getElementById('avgRatingStars');
        const reviewsCountLabelEl = document.getElementById('reviewsCountLabel');

        if (!allReviews || allReviews.length === 0) {
            if (avgRatingValEl) avgRatingValEl.textContent = '5.0';
            if (reviewsCountLabelEl) reviewsCountLabelEl.textContent = '(0 reviews)';
            return;
        }

        const totalRatingSum = allReviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 5), 0);
        const avgRating = (totalRatingSum / allReviews.length).toFixed(1);

        if (avgRatingValEl) avgRatingValEl.textContent = avgRating;
        if (reviewsCountLabelEl) reviewsCountLabelEl.textContent = `(${allReviews.length} reviews)`;

        if (avgRatingStarsEl) {
            let starsHTML = '';
            const numAvg = Math.round(parseFloat(avgRating));
            for (let i = 1; i <= 5; i++) {
                if (i <= numAvg) {
                    starsHTML += '<i class="bi bi-star-fill"></i>';
                } else {
                    starsHTML += '<i class="bi bi-star"></i>';
                }
            }
            avgRatingStarsEl.innerHTML = starsHTML;
        }
    }

    // ----------------------------------------------------------------------
    // 4. Load & Render Testimonials from JSON & LocalStorage
    // ----------------------------------------------------------------------
    async function loadTestimonials() {
        let defaultReviews = [];
        try {
            const response = await fetch('testimonials.json');
            if (response.ok) {
                defaultReviews = await response.json();
            }
        } catch (e) {
            console.log('Using default static reviews');
        }

        let localReviews = [];
        try {
            const stored = localStorage.getItem('user_testimonials');
            if (stored) {
                localReviews = JSON.parse(stored);
            }
        } catch (e) {
            console.error(e);
        }

        const allReviews = [...localReviews, ...defaultReviews];

        if (reviewsContainer) {
            reviewsContainer.innerHTML = '';
            allReviews.forEach(review => {
                const card = renderReviewCard(review);
                reviewsContainer.appendChild(card);
            });
            initScrollReveal();
        }

        updateDigitalRatingBadge(allReviews);
    }

    // ----------------------------------------------------------------------
    // 5. Dynamic Form Submission (Add Review & Save to LocalStorage)
    // ----------------------------------------------------------------------
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (currentRating === 0) {
                alert('Please select a star rating (1 to 5 stars) before submitting your review.');
                return;
            }

            const nameInput = document.getElementById('userName').value.trim();
            const roleInput = document.getElementById('userRole').value.trim();
            const feedbackInput = document.getElementById('userFeedback').value.trim();

            if (!nameInput || !feedbackInput) return;

            const newReview = {
                id: Date.now(),
                name: nameInput,
                role: roleInput || 'Valued Parent',
                rating: currentRating,
                feedback: feedbackInput,
                date: new Date().toISOString().split('T')[0],
                verified: true
            };

            let localReviews = [];
            try {
                const stored = localStorage.getItem('user_testimonials');
                if (stored) localReviews = JSON.parse(stored);
            } catch (e) {}

            localReviews.unshift(newReview);
            localStorage.setItem('user_testimonials', JSON.stringify(localReviews));

            // Reload all reviews to update overall digital rating correctly
            await loadTestimonials();

            // Reset form
            feedbackForm.reset();
            currentRating = 0;
            if (ratingValueInput) ratingValueInput.value = 0;
            if (starContainer) {
                const stars = starContainer.querySelectorAll('.star-icon');
                stars.forEach(s => {
                    s.classList.remove('bi-star-fill', 'active');
                    s.classList.add('bi-star');
                });
            }

            reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            alert('Thank you! Your review has been added and saved.');
        });
    }

    // ----------------------------------------------------------------------
    // 6. Scroll Reveal Observer
    // ----------------------------------------------------------------------
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -20px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('visible'));
        }
    }

    // Initialize Page
    loadTestimonials();

    // Mobile Drawer Handlers
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
});
