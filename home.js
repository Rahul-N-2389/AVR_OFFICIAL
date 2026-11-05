/**
 * AVR DABBA - Main JavaScript File (home.js)
 * Handles navbar scrolling and hero parallax.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Navbar Scroll Shadow Effect & Active Link Highlight
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('main-navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // 2. Subtle 3D Parallax Tilt Effect on Hero Background Image Layer
    // ----------------------------------------------------------------------
    const heroSection = document.querySelector('.hero-section');
    const heroBackgroundParallax = document.getElementById('hero-background-parallax');
    if (heroSection && heroBackgroundParallax) {
        heroSection.addEventListener('mousemove', (event) => {
            const rect = heroSection.getBoundingClientRect();
            const pointerOffsetX = event.clientX - rect.left - rect.width / 2;
            const pointerOffsetY = event.clientY - rect.top - rect.height / 2;

            // Subtle, gentle 3D micro-tilt movement on background image
            const rotationX = (pointerOffsetY / (rect.height / 2)) * -1.8;
            const rotationY = (pointerOffsetX / (rect.width / 2)) * 1.8;

            heroBackgroundParallax.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.02)`;
            heroBackgroundParallax.style.transition = 'transform 0.1s ease-out';
        });

        heroSection.addEventListener('mouseleave', () => {
            heroBackgroundParallax.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            heroBackgroundParallax.style.transition = 'transform 0.6s ease';
        });
    }

    // ----------------------------------------------------------------------
    // 3. Show the three highest-rated reviews from the Testimonials page
    // ----------------------------------------------------------------------
    const homeTestimonials = document.getElementById('home-testimonial-grid');
    if (homeTestimonials) {
        loadTopHomeTestimonials(homeTestimonials);
    }
});

async function loadTopHomeTestimonials(container) {
    let defaultReviews = [];
    try {
        const response = await fetch('testimonials/testimonials.json');
        if (response.ok) defaultReviews = await response.json();
    } catch {
        // Keep the existing home page cards as a fallback if the review file is unavailable.
    }

    let submittedReviews = [];
    try {
        const savedReviews = JSON.parse(localStorage.getItem('user_testimonials') || '[]');
        if (Array.isArray(savedReviews)) submittedReviews = savedReviews;
    } catch {
        // Ignore invalid saved review data and continue with the published reviews.
    }

    const topReviews = [...submittedReviews, ...defaultReviews]
        .filter(review => review && Number.isFinite(Number(review.rating)) && Number(review.rating) >= 1)
        .sort((first, second) => {
            const ratingDifference = Number(second.rating) - Number(first.rating);
            if (ratingDifference) return ratingDifference;
            return (Date.parse(second.date) || 0) - (Date.parse(first.date) || 0);
        })
        .slice(0, 3);

    if (!topReviews.length) return;

    const cards = topReviews.map(review => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';

        const stars = document.createElement('div');
        stars.className = 'stars';
        const rating = Math.min(5, Math.floor(Number(review.rating)));
        for (let index = 0; index < 5; index += 1) {
            const star = document.createElement('i');
            star.className = index < rating ? 'fa-solid fa-star' : 'fa-regular fa-star';
            stars.appendChild(star);
        }

        const text = document.createElement('p');
        text.className = 'review-text';
        text.textContent = `“${review.feedback || ''}”`;

        const userMeta = document.createElement('div');
        userMeta.className = 'user-meta';
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = String(review.name || 'P').trim().charAt(0).toUpperCase() || 'P';

        const userDetails = document.createElement('div');
        const name = document.createElement('h4');
        name.textContent = review.name || 'AVR DABBA Parent';
        const role = document.createElement('span');
        role.textContent = review.role || 'Valued Parent';
        userDetails.append(name, role);
        userMeta.append(avatar, userDetails);
        card.append(stars, text, userMeta);
        return card;
    });

    container.replaceChildren(...cards);
}
