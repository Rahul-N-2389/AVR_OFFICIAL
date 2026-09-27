/**
 * AVR DABBA - Services JavaScript (Services.js)
 * Controls scroll reveal animations, mobile menu drawer navigation,
 * and booking modal handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Scroll Reveal Animation Observer
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
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('visible'));
        }
    }

    initScrollReveal();

    // ----------------------------------------------------------------------
    // 2. Mobile Navigation Drawer Controls
    // ----------------------------------------------------------------------
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

    // ----------------------------------------------------------------------
    // 3. Schedule Booking Modal Handlers
    // ----------------------------------------------------------------------
    const scheduleModal = document.getElementById('scheduleModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const scheduleForm = document.getElementById('scheduleForm');

    function openModal() {
        if (scheduleModal) scheduleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (scheduleModal) scheduleModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    if (scheduleModal) {
        scheduleModal.addEventListener('click', (e) => {
            if (e.target === scheduleModal) closeModal();
        });
    }

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const parentName = document.getElementById('parentName').value;
            const parentPhone = document.getElementById('parentPhone').value;
            const studentName = document.getElementById('studentName').value;
            const schoolName = document.getElementById('schoolName').value;
            const planSelect = document.getElementById('planSelect').value;

            const msg = `Hi AVR DABBA! I would like to book lunch pickup.%0A%0A*Parent Name:* ${encodeURIComponent(parentName)}%0A*Phone:* ${encodeURIComponent(parentPhone)}%0A*Student Name:* ${encodeURIComponent(studentName)}%0A*School:* ${encodeURIComponent(schoolName)}%0A*Selected Plan:* ${encodeURIComponent(planSelect)}`;
            
            window.open(`https://wa.me/919281271759?text=${msg}`, '_blank');
            closeModal();
            scheduleForm.reset();
        });
    }

    // ----------------------------------------------------------------------
    // 4. 3D Coverflow Carousel for All-Weather Reliable Service
    // ----------------------------------------------------------------------
    const coverflowCards = document.querySelectorAll('.coverflow-card');
    const coverflowDots = document.querySelectorAll('.coverflow-dot');
    let currentCoverflowIndex = 0;
    const totalCoverflow = coverflowCards.length;

    function updateCoverflow() {
        coverflowCards.forEach((card, i) => {
            card.classList.remove('active', 'prev-1', 'next-1', 'far');
            
            let diff = i - currentCoverflowIndex;
            if (diff < -2) diff += totalCoverflow;
            if (diff > 2) diff -= totalCoverflow;

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
