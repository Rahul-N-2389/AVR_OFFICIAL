/**
 * AVR DABBA - Plans Page JavaScript (plans.js)
 * Handles mini modal popup on "Select Plan" click, pamphlet image interactions, and mobile navigation drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Select Plan Calendar & Start Date Logic
    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // 1. Select Plan 2-Step Modal Logic (Calendar & Contact Popups)
    // ----------------------------------------------------------------------
    let currentCalDate = new Date();
    let selectedStartDate = null;
    let currentSelectedPlan = 'Subscription Plan';

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const selectModal = document.getElementById('selectPlanModal');
    const modalCloseBtn = document.getElementById('miniModalCloseBtn');
    const selectedPlanTitle = document.getElementById('selectedPlanTitle');
    const selectButtons = document.querySelectorAll('.btn-select-modal, .btn-card-select');
    
    const calMonthTitle = document.getElementById('calMonthTitle');
    const calPrevMonthBtn = document.getElementById('calPrevMonthBtn');
    const calNextMonthBtn = document.getElementById('calNextMonthBtn');
    const calendarDaysGrid = document.getElementById('calendarDaysGrid');
    const startDateOptionsList = document.getElementById('startDateOptionsList');

    // Step 2 Modal Elements
    const contactModal = document.getElementById('contactModal');
    const contactModalCloseBtn = document.getElementById('contactModalCloseBtn');
    const contactPlanTitle = document.getElementById('contactPlanTitle');
    const contactDateBadge = document.getElementById('contactDateBadge');
    const contactWhatsappBtn = document.getElementById('contactWhatsappBtn');
    const backToCalendarBtn = document.getElementById('backToCalendarBtn');

    function renderCalendar() {
        if (!calendarDaysGrid || !calMonthTitle) return;

        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();

        calMonthTitle.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        let gridHTML = '';

        for (let i = 0; i < firstDayOfMonth; i++) {
            gridHTML += `<span class="cal-day-cell empty"></span>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const isAllowedDay = (d === 1 || d === 10 || d === 20);
            
            let isPast = false;
            if (year < todayYear) {
                isPast = true;
            } else if (year === todayYear && month < todayMonth) {
                isPast = true;
            } else if (year === todayYear && month === todayMonth && d < todayDate) {
                isPast = true;
            }

            const isSelectable = isAllowedDay && !isPast;

            let isSelected = false;
            if (selectedStartDate && 
                selectedStartDate.getFullYear() === year && 
                selectedStartDate.getMonth() === month && 
                selectedStartDate.getDate() === d) {
                isSelected = true;
            }

            let cellClass = 'cal-day-cell';
            if (!isAllowedDay) {
                cellClass += ' disabled-date';
            } else if (isPast) {
                cellClass += ' past-date';
            } else {
                cellClass += ' valid-start-date';
            }

            if (isSelected) {
                cellClass += ' selected';
            }

            gridHTML += `<button type="button" class="${cellClass}" ${!isSelectable ? 'disabled' : ''} data-day="${d}">${d}</button>`;
        }

        calendarDaysGrid.innerHTML = gridHTML;

        const dayButtons = calendarDaysGrid.querySelectorAll('.valid-start-date');
        dayButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const dayNum = parseInt(btn.getAttribute('data-day'));
                selectDateAndOpenContactModal(new Date(year, month, dayNum));
            });
        });

        renderRightSideOptions(year, month, todayYear, todayMonth, todayDate);
    }

    function renderRightSideOptions(year, month, todayYear, todayMonth, todayDate) {
        if (!startDateOptionsList) return;

        const startDays = [1, 10, 20];
        let optionsHTML = '';

        startDays.forEach(day => {
            let isPast = false;

            if (year < todayYear) {
                isPast = true;
            } else if (year === todayYear && month < todayMonth) {
                isPast = true;
            } else if (year === todayYear && month === todayMonth && day < todayDate) {
                isPast = true;
            }

            let isSelected = selectedStartDate && 
                selectedStartDate.getFullYear() === year && 
                selectedStartDate.getMonth() === month && 
                selectedStartDate.getDate() === day;

            const daySuffix = day === 1 ? 'st' : 'th';
            const dateString = `${monthNames[month]} ${day}${daySuffix}`;

            optionsHTML += `
                <div class="start-date-row-item ${isPast ? 'disabled-item' : ''} ${isSelected ? 'selected-item' : ''}">
                    <div class="date-item-info">
                        <span class="date-item-title">${dateString}</span>
                        ${isPast ? '<span class="passed-badge">(Passed)</span>' : '<span class="available-badge">Available</span>'}
                    </div>
                    <button type="button" class="btn btn-sm btn-horizontal-select" ${isPast ? 'disabled' : ''} data-day="${day}">
                        Select
                    </button>
                </div>
            `;
        });

        startDateOptionsList.innerHTML = optionsHTML;

        const optionBtns = startDateOptionsList.querySelectorAll('.btn-horizontal-select');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dayNum = parseInt(btn.getAttribute('data-day'));
                selectDateAndOpenContactModal(new Date(year, month, dayNum));
            });
        });
    }

    function selectDateAndOpenContactModal(dateObj) {
        selectedStartDate = dateObj;

        // 1. Close Step 1 Modal
        closeMiniModal();

        // 2. Format Date Text & Update WhatsApp Link
        const day = dateObj.getDate();
        const daySuffix = day === 1 ? 'st' : 'th';
        const formattedDate = `${monthNames[dateObj.getMonth()]} ${day}${daySuffix}, ${dateObj.getFullYear()}`;

        if (contactPlanTitle) contactPlanTitle.textContent = currentSelectedPlan;
        if (contactDateBadge) contactDateBadge.textContent = `Start Date: ${formattedDate}`;

        if (contactWhatsappBtn) {
            const msg = `Hi AVR DABBA, I would like to book the ${currentSelectedPlan}. Preferred Start Date: ${formattedDate}.`;
            contactWhatsappBtn.href = `https://wa.me/919281271759?text=${encodeURIComponent(msg)}`;
        }

        // 3. Open Step 2 Contact Modal
        if (contactModal) {
            contactModal.classList.add('active');
            contactModal.setAttribute('aria-hidden', 'false');
        }
    }

    function openMiniModal(planName) {
        currentSelectedPlan = planName || 'Subscription Plan';
        if (selectedPlanTitle) {
            selectedPlanTitle.textContent = planName ? `Select Plan: ${planName}` : 'Select Plan';
        }

        const today = new Date();
        const tYear = today.getFullYear();
        const tMonth = today.getMonth();
        const tDate = today.getDate();

        // If all start dates (1st, 10th, 20th) in current month have passed, auto-advance to next month!
        if (tDate > 20) {
            currentCalDate = new Date(tYear, tMonth + 1, 1);
        } else {
            currentCalDate = new Date(tYear, tMonth, 1);
        }

        selectedStartDate = null;
        renderCalendar();

        if (selectModal) {
            selectModal.classList.add('active');
            selectModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeMiniModal() {
        if (selectModal) {
            selectModal.classList.remove('active');
            selectModal.setAttribute('aria-hidden', 'true');
        }
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('active');
            contactModal.setAttribute('aria-hidden', 'true');
        }
    }

    selectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const planName = btn.getAttribute('data-plan') || 'Selected Plan';
            openMiniModal(planName);
        });
    });

    if (calPrevMonthBtn) {
        calPrevMonthBtn.addEventListener('click', () => {
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (calNextMonthBtn) {
        calNextMonthBtn.addEventListener('click', () => {
            currentCalDate.setMonth(currentCalDate.getMonth() + 1);
            renderCalendar();
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMiniModal);
    if (contactModalCloseBtn) contactModalCloseBtn.addEventListener('click', closeContactModal);

    if (backToCalendarBtn) {
        backToCalendarBtn.addEventListener('click', () => {
            closeContactModal();
            if (selectModal) {
                selectModal.classList.add('active');
                selectModal.setAttribute('aria-hidden', 'false');
            }
        });
    }

    if (selectModal) {
        selectModal.addEventListener('click', (e) => {
            if (e.target === selectModal) closeMiniModal();
        });
    }

    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeContactModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMiniModal();
            closeContactModal();
        }
    });

    // ----------------------------------------------------------------------
    // 2. Mobile Navigation Drawer
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
    // 3. Scroll Reveal Animation
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }
});
