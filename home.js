/**
 * AVR DABBA - Main JavaScript File (home.js)
 * Implements interactive navigation, modal management, FAQ accordion,
 * school coverage search, interactive savings calculator, and form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Drawer Navigation
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
    // 2. Navbar Scroll Shadow Effect & Active Link Highlight
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------------------------
    // 3. FAQ Accordion Interactivity
    // ----------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other open items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 4. Interactive School Coverage Search Filter
    // ----------------------------------------------------------------------
    const schoolSearchInput = document.getElementById('schoolSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const schoolChips = document.querySelectorAll('.school-chip');
    const searchResultMsg = document.getElementById('searchResultMsg');

    function filterSchools() {
        const query = schoolSearchInput.value.toLowerCase().trim();
        let matchCount = 0;

        schoolChips.forEach(chip => {
            const schoolData = chip.getAttribute('data-name').toLowerCase();
            if (query === '' || schoolData.includes(query)) {
                chip.style.display = 'inline-flex';
                matchCount++;
            } else {
                chip.style.display = 'none';
            }
        });

        if (query !== '') {
            if (matchCount > 0) {
                searchResultMsg.className = 'search-result-msg success';
                searchResultMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Great news! We serve schools matching <strong>"${query}"</strong>. Schedule your pickup now!`;
            } else {
                searchResultMsg.className = 'search-result-msg notice';
                searchResultMsg.innerHTML = `<i class="fa-solid fa-circle-info"></i> We are currently expanding near <strong>"${query}"</strong>. Contact us at <strong>8639213100</strong> for custom pickup arrangements!`;
            }
        } else {
            searchResultMsg.style.display = 'none';
        }
    }

    if (schoolSearchInput) {
        schoolSearchInput.addEventListener('input', filterSchools);
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', filterSchools);
    }

    // Click on chip pre-fills search input
    schoolChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const schoolName = chip.innerText.trim();
            schoolSearchInput.value = schoolName;
            filterSchools();
        });
    });

    // ----------------------------------------------------------------------
    // 5. Interactive Morning Stress & Time Saver Calculator
    // ----------------------------------------------------------------------
    let childCount = 1;
    let daysCount = 5;

    const childVal = document.getElementById('childVal');
    const childMinus = document.getElementById('childMinus');
    const childPlus = document.getElementById('childPlus');

    const dayVal = document.getElementById('dayVal');
    const dayMinus = document.getElementById('dayMinus');
    const dayPlus = document.getElementById('dayPlus');

    const hoursSavedEl = document.getElementById('hoursSaved');
    const estimatedCostEl = document.getElementById('estimatedCost');

    function updateCalculator() {
        childVal.innerText = childCount;
        dayVal.innerText = daysCount;

        // Approx 45 minutes saved per child per morning = 0.75 hrs * days/week * 4 weeks
        const hoursSaved = Math.round(childCount * 0.75 * daysCount * 4);
        hoursSavedEl.innerText = `${hoursSaved} Hours`;

        // Price calculation base: ₹899 per month for 5 days/week
        let monthlyCost = Math.round((daysCount / 5) * 899 * childCount);
        estimatedCostEl.innerText = `₹${monthlyCost}`;
    }

    if (childMinus && childPlus) {
        childMinus.addEventListener('click', () => {
            if (childCount > 1) {
                childCount--;
                updateCalculator();
            }
        });
        childPlus.addEventListener('click', () => {
            if (childCount < 5) {
                childCount++;
                updateCalculator();
            }
        });
    }

    if (dayMinus && dayPlus) {
        dayMinus.addEventListener('click', () => {
            if (daysCount > 1) {
                daysCount--;
                updateCalculator();
            }
        });
        dayPlus.addEventListener('click', () => {
            if (daysCount < 6) {
                daysCount++;
                updateCalculator();
            }
        });
    }

    // ----------------------------------------------------------------------
    // 6. Schedule Pickup Modal Popup & Form Submission
    // ----------------------------------------------------------------------
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const scheduleModal = document.getElementById('scheduleModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const planSelect = document.getElementById('planSelect');
    const scheduleForm = document.getElementById('scheduleForm');

    function openModal(planName) {
        if (planName && planSelect) {
            for (let i = 0; i < planSelect.options.length; i++) {
                if (planSelect.options[i].value.includes(planName) || planName.includes(planSelect.options[i].value)) {
                    planSelect.selectedIndex = i;
                    break;
                }
            }
        }
        scheduleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        scheduleModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            openModal(plan);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    scheduleModal.addEventListener('click', (e) => {
        if (e.target === scheduleModal) {
            closeModal();
        }
    });

    // Form Submission Handling
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const parentName = document.getElementById('parentName').value;
            const parentPhone = document.getElementById('parentPhone').value;
            const studentName = document.getElementById('studentName').value;
            const classSection = document.getElementById('classSection').value;
            const schoolName = document.getElementById('schoolName').value;
            const selectedPlan = planSelect.value;
            const pickupAddress = document.getElementById('pickupAddress').value;

            // Show Toast Success Notification
            showToast(`✅ Thank you ${parentName}! Pickup request for ${studentName} (${schoolName}) received. We will contact you at ${parentPhone}.`);

            // Option to trigger WhatsApp pre-filled message
            const waText = encodeURIComponent(
                `Hi AVR DABBA, I want to book lunch delivery!\n\nParent Name: ${parentName}\nPhone: ${parentPhone}\nChild Name: ${studentName}\nClass: ${classSection}\nSchool: ${schoolName}\nPlan: ${selectedPlan}\nAddress: ${pickupAddress}`
            );
            
            closeModal();
            scheduleForm.reset();

            setTimeout(() => {
                window.open(`https://wa.me/918639213100?text=${waText}`, '_blank');
            }, 1200);
        });
    }

    // ----------------------------------------------------------------------
    // 7. Toast Notification Helper
    // ----------------------------------------------------------------------
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> <span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    // ----------------------------------------------------------------------
    // 8. Subtle 3D Parallax Tilt Effect on Hero Background Image Layer
    // ----------------------------------------------------------------------
    const heroSection = document.querySelector('.hero-section');
    const heroBgParallax = document.getElementById('heroBgParallax');
    if (heroSection && heroBgParallax) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle, gentle 3D micro-tilt movement on background image
            const tiltX = (y / (rect.height / 2)) * -1.8;
            const tiltY = (x / (rect.width / 2)) * 1.8;

            heroBgParallax.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            heroBgParallax.style.transition = 'transform 0.1s ease-out';
        });

        heroSection.addEventListener('mouseleave', () => {
            heroBgParallax.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            heroBgParallax.style.transition = 'transform 0.6s ease';
        });
    }
});
