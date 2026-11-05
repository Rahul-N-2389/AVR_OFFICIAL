/**
 * AVR DABBA - Testimonials JavaScript (testimonials.js)
 * Controls side-by-side reviews & feedback form, 120-character review truncation with Read More toggle,
 * dynamic average digital rating out of 5 calculation, and JSON/LocalStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const feedbackForm = document.getElementById('feedback-form');
    const starContainer = document.getElementById('star-rating-input');
    const ratingValueInput = document.getElementById('rating-value');
    let currentRating = 0;

    // ----------------------------------------------------------------------
    // 1. Interactive 5-Star Rating Control
    // ----------------------------------------------------------------------
    if (starContainer) {
        const ratingStars = starContainer.querySelectorAll('.star-icon');

        function updateStars(rating) {
            ratingStars.forEach((star, starIndex) => {
                if (starIndex < rating) {
                    star.classList.remove('bi-star');
                    star.classList.add('bi-star-fill', 'active');
                } else {
                    star.classList.remove('bi-star-fill', 'active');
                    star.classList.add('bi-star');
                }
            });
        }

        updateStars(0);

        ratingStars.forEach(star => {
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
    function renderReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-bar-card reveal-on-scroll';

        let starsHTML = '';
        for (let starNumber = 1; starNumber <= 5; starNumber++) {
            if (starNumber <= review.rating) {
                starsHTML += '<i class="bi bi-star-fill me-1"></i>';
            } else {
                starsHTML += '<i class="bi bi-star me-1"></i>';
            }
        }

        const formattedReviewDate = review.date ? new Date(review.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'Recently';

        const fullText = review.feedback || '';
        const maximumReviewLength = 120;
        const needsTruncation = fullText.length > maximumReviewLength;
        const truncatedText = needsTruncation ? fullText.substring(0, maximumReviewLength) + '...' : fullText;

        card.innerHTML = `
            <div class="card-bar-top">
                <div class="card-bar-author">
                    <span class="author-name">${escapeHTML(review.name)}</span>
                    <span class="author-role">${escapeHTML(review.role || 'Valued Parent')}</span>
                </div>
                <div class="card-bar-meta">
                    <div class="star-rating-display">${starsHTML}</div>
                    <span class="author-date">${formattedReviewDate}</span>
                </div>
            </div>
            <div class="card-bar-body">
                <p class="review-text" data-full="${escapeHTML(fullText)}" data-truncated="${escapeHTML(truncatedText)}">&ldquo;${escapeHTML(truncatedText)}&rdquo;</p>
                ${needsTruncation ? '<button type="button" class="btn-toggle-more">Read More <i class="bi bi-chevron-down"></i></button>' : ''}
            </div>
        `;

        if (needsTruncation) {
            const toggleButton = card.querySelector('.btn-toggle-more');
            const reviewText = card.querySelector('.review-text');
            let isExpanded = false;

            toggleButton.addEventListener('click', () => {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    reviewText.innerHTML = `&ldquo;${escapeHTML(fullText)}&rdquo;`;
                    toggleButton.innerHTML = 'Show Less <i class="bi bi-chevron-up"></i>';
                } else {
                    reviewText.innerHTML = `&ldquo;${escapeHTML(truncatedText)}&rdquo;`;
                    toggleButton.innerHTML = 'Read More <i class="bi bi-chevron-down"></i>';
                }
            });
        }

        return card;
    }

    function escapeHTML(text) {
        if (!text) return '';
        return text.replace(/[&<>'"]/g,
            character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character)
        );
    }

    // ----------------------------------------------------------------------
    // 3. Update Digital Average Rating Badge
    // ----------------------------------------------------------------------
    function updateDigitalRatingBadge(allReviews) {
        const averageRatingValueElement = document.getElementById('average-rating-value');
        const averageRatingStarsElement = document.getElementById('average-rating-stars');
        const reviewCountLabelElement = document.getElementById('reviews-count-label');

        if (!allReviews || allReviews.length === 0) {
            if (averageRatingValueElement) averageRatingValueElement.textContent = '5.0';
            if (reviewCountLabelElement) reviewCountLabelElement.textContent = '(0 reviews)';
            return;
        }

        const totalRating = allReviews.reduce((ratingSum, review) => ratingSum + (parseFloat(review.rating) || 5), 0);
        const averageRating = (totalRating / allReviews.length).toFixed(1);

        if (averageRatingValueElement) averageRatingValueElement.textContent = averageRating;
        if (reviewCountLabelElement) reviewCountLabelElement.textContent = `(${allReviews.length} reviews)`;

        if (averageRatingStarsElement) {
            let starsHTML = '';
            const roundedAverageRating = Math.round(parseFloat(averageRating));
            for (let starNumber = 1; starNumber <= 5; starNumber++) {
                if (starNumber <= roundedAverageRating) {
                    starsHTML += '<i class="bi bi-star-fill"></i>';
                } else {
                    starsHTML += '<i class="bi bi-star"></i>';
                }
            }
            averageRatingStarsElement.innerHTML = starsHTML;
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
        } catch (error) {
            console.error('Failed to load testimonials.', error);
        }

        let localReviews = [];
        try {
            const stored = localStorage.getItem('user_testimonials');
            if (stored) {
                localReviews = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to read saved testimonials.', error);
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
        feedbackForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (currentRating === 0) {
                alert('Please select a star rating (1 to 5 stars) before submitting your review.');
                return;
            }

            const nameInput = document.getElementById('user-name').value.trim();
            const roleInput = document.getElementById('user-role').value.trim();
            const feedbackInput = document.getElementById('user-feedback').value.trim();

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
            } catch (error) {
                console.error('Failed to read saved testimonials before submission.', error);
            }

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
                stars.forEach(star => {
                    star.classList.remove('bi-star-fill', 'active');
                    star.classList.add('bi-star');
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
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -20px 0px'
            });

            revealElements.forEach(element => observer.observe(element));
        } else {
            revealElements.forEach(element => element.classList.add('visible'));
        }
    }

    // Initialize Page
    loadTestimonials();

});