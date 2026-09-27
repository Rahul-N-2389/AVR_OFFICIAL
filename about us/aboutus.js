/**
 * AVR DABBA - About Us JavaScript (aboutus.js)
 * Controls navigation drawer, booking modal, image fallbacks, and interactive behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Navigation Drawer Controls
    // ----------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

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

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // ----------------------------------------------------------------------
    // 2. Header Scroll Effect
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // ----------------------------------------------------------------------
    // 3. Schedule / Booking Modal Handling
    // ----------------------------------------------------------------------
    const scheduleModal = document.getElementById('scheduleModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const scheduleForm = document.getElementById('scheduleForm');

    function openModal() {
        if (scheduleModal) {
            scheduleModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (scheduleModal) {
            scheduleModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    if (scheduleModal) {
        scheduleModal.addEventListener('click', (e) => {
            if (e.target === scheduleModal) {
                closeModal();
            }
        });
    }

    // Modal Form Submission to WhatsApp
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const parentName = document.getElementById('parentName')?.value || '';
            const parentPhone = document.getElementById('parentPhone')?.value || '';
            const studentName = document.getElementById('studentName')?.value || '';
            const classSection = document.getElementById('classSection')?.value || '';
            const schoolName = document.getElementById('schoolName')?.value || '';
            const planSelect = document.getElementById('planSelect')?.value || '';
            const pickupAddress = document.getElementById('pickupAddress')?.value || '';

            const waText = `Hi AVR DABBA! I would like to book a lunch pickup.%0A%0A` +
                `*Parent Name:* ${encodeURIComponent(parentName)}%0A` +
                `*Phone:* ${encodeURIComponent(parentPhone)}%0A` +
                `*Student Name:* ${encodeURIComponent(studentName)} (${encodeURIComponent(classSection)})%0A` +
                `*School:* ${encodeURIComponent(schoolName)}%0A` +
                `*Plan:* ${encodeURIComponent(planSelect)}%0A` +
                `*Address:* ${encodeURIComponent(pickupAddress)}`;

            window.open(`https://wa.me/919281271759?text=${waText}`, '_blank');
            closeModal();
            scheduleForm.reset();
        });
    }
});
