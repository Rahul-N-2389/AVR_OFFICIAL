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
    let currentCoverflowIndex = 0;
    const totalCoverflow = coverflowCards.length;

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
                currentCoverflowIndex = i;
                updateCoverflow();
            });
        });

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