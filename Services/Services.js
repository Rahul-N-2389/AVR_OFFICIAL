/**
 * AVR DABBA - Services JavaScript (Services.js)
 * Controls the all-weather coverflow carousel.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. 3D Coverflow Carousel for All-Weather Reliable Service
    // ----------------------------------------------------------------------
    const coverflowCards = document.querySelectorAll('.coverflow-card');
    const coverflowDots = document.querySelectorAll('.coverflow-dot');
    const coverflowContainer = document.querySelector('.coverflow-carousel-container');
    let currentCoverflowIndex = 0;
    const totalCoverflow = coverflowCards.length;
    let touchStartX = null;
    let swipeHandled = false;

    function updateCoverflow() {
        coverflowCards.forEach((card, i) => {
            card.classList.remove('active', 'prev-1', 'next-1', 'far');
            
            if (i === currentCoverflowIndex) {
                card.classList.add('active');
            } else if (i === (currentCoverflowIndex - 1 + totalCoverflow) % totalCoverflow) {
                card.classList.add('prev-1');
            } else if (i === (currentCoverflowIndex + 1) % totalCoverflow) {
                card.classList.add('next-1');
            } else {
                card.classList.add('far');
            }
        });

        coverflowDots.forEach((dot, i) => {
            if (i === currentCoverflowIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (coverflowCards.length > 0) {
        updateCoverflow();

        coverflowCards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (swipeHandled) return;
                currentCoverflowIndex = i;
                updateCoverflow();
            });
        });

        if (coverflowContainer) {
            coverflowContainer.addEventListener('pointerdown', event => {
                if (event.pointerType !== 'mouse') touchStartX = event.clientX;
            });

            coverflowContainer.addEventListener('pointerup', event => {
                if (touchStartX === null) return;
                const horizontalTravel = event.clientX - touchStartX;
                touchStartX = null;
                if (Math.abs(horizontalTravel) < 44) return;

                currentCoverflowIndex = (currentCoverflowIndex + (horizontalTravel < 0 ? 1 : -1) + totalCoverflow) % totalCoverflow;
                updateCoverflow();
                swipeHandled = true;
                window.setTimeout(() => { swipeHandled = false; }, 350);
            });

            coverflowContainer.addEventListener('pointercancel', () => {
                touchStartX = null;
            });
        }

        coverflowDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentCoverflowIndex = i;
                updateCoverflow();
            });
        });

        // Continuous automatic loop without glitch
        setInterval(() => {
            currentCoverflowIndex = (currentCoverflowIndex + 1) % totalCoverflow;
            updateCoverflow();
        }, 3200);
    }
});
