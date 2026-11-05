/**
 * AVR DABBA - Plans Page JavaScript (plans.js)
 * Handles plan selection, start-date selection, and WhatsApp contact details.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Select Plan Calendar & Contact Modal Logic
    // ----------------------------------------------------------------------
    let currentCalendarDate = new Date();
    let selectedStartDate = null;
    let currentSelectedPlan = 'Subscription Plan';

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const planSelectionModal = document.getElementById('plan-selection-modal');
    const planModalCloseButton = document.getElementById('close-plan-modal-button');
    const selectedPlanTitle = document.getElementById('selected-plan-title');
    const planSelectionButtons = document.querySelectorAll('.btn-select-modal, .btn-card-select');
    
    const calendarMonthTitle = document.getElementById('calendar-month-title');
    const previousCalendarMonthButton = document.getElementById('previous-calendar-month-button');
    const nextCalendarMonthButton = document.getElementById('next-calendar-month-button');
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const startDateOptionsList = document.getElementById('start-date-options-list');

    // Step 2 Modal Elements
    const contactModal = document.getElementById('contact-modal');
    const contactModalCloseButton = document.getElementById('close-contact-modal-button');
    const contactPlanTitle = document.getElementById('contact-plan-title');
    const contactDateBadge = document.getElementById('contact-date-badge');
    const contactWhatsAppButton = document.getElementById('contact-whatsapp-button');
    const backToCalendarButton = document.getElementById('back-to-calendar-button');

    function renderCalendar() {
        if (!calendarDaysGrid || !calendarMonthTitle) return;

        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();

        calendarMonthTitle.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        let gridHTML = '';

        for (let emptyCellIndex = 0; emptyCellIndex < firstDayOfMonth; emptyCellIndex++) {
            gridHTML += `<span class="cal-day-cell empty"></span>`;
        }

        for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
            const isAllowedDay = (dayOfMonth === 1 || dayOfMonth === 10 || dayOfMonth === 20);
            
            let isPast = false;
            if (year < todayYear) {
                isPast = true;
            } else if (year === todayYear && month < todayMonth) {
                isPast = true;
            } else if (year === todayYear && month === todayMonth && dayOfMonth < todayDate) {
                isPast = true;
            }

            const isSelectable = isAllowedDay && !isPast;

            let isSelected = false;
            if (selectedStartDate && 
                selectedStartDate.getFullYear() === year && 
                selectedStartDate.getMonth() === month && 
                selectedStartDate.getDate() === dayOfMonth) {
                isSelected = true;
            }

            let calendarDayClass = 'cal-day-cell';
            if (!isAllowedDay) {
                calendarDayClass += ' disabled-date';
            } else if (isPast) {
                calendarDayClass += ' past-date';
            } else {
                calendarDayClass += ' valid-start-date';
            }

            if (isSelected) {
                calendarDayClass += ' selected';
            }

            gridHTML += `<button type="button" class="${calendarDayClass}" ${!isSelectable ? 'disabled' : ''} data-day="${dayOfMonth}">${dayOfMonth}</button>`;
        }

        calendarDaysGrid.innerHTML = gridHTML;

        const dayButtons = calendarDaysGrid.querySelectorAll('.valid-start-date');
        dayButtons.forEach(dateButton => {
            dateButton.addEventListener('click', () => {
                const selectedDay = parseInt(dateButton.getAttribute('data-day'));
                selectDateAndOpenContactModal(new Date(year, month, selectedDay));
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
        optionBtns.forEach(optionButton => {
            optionButton.addEventListener('click', () => {
                const selectedDay = parseInt(optionButton.getAttribute('data-day'));
                selectDateAndOpenContactModal(new Date(year, month, selectedDay));
            });
        });
    }

    function selectDateAndOpenContactModal(chosenStartDate) {
        selectedStartDate = chosenStartDate;

        // 1. Close Step 1 Modal
        closeMiniModal();

        // 2. Format Date Text & Update WhatsApp Link
        const startDay = chosenStartDate.getDate();
        const daySuffix = startDay === 1 ? 'st' : 'th';
        const formattedDate = `${monthNames[chosenStartDate.getMonth()]} ${startDay}${daySuffix}, ${chosenStartDate.getFullYear()}`;

        if (contactPlanTitle) contactPlanTitle.textContent = currentSelectedPlan;
        if (contactDateBadge) contactDateBadge.textContent = `Start Date: ${formattedDate}`;

        if (contactWhatsAppButton) {
            const whatsappMessage = `Hi AVR DABBA, I would like to book the ${currentSelectedPlan}. Preferred Start Date: ${formattedDate}.`;
            contactWhatsAppButton.href = `https://wa.me/919281271759?text=${encodeURIComponent(whatsappMessage)}`;
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
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        // If all start dates (1st, 10th, 20th) in current month have passed, auto-advance to next month!
        if (todayDate > 20) {
            currentCalendarDate = new Date(todayYear, todayMonth + 1, 1);
        } else {
            currentCalendarDate = new Date(todayYear, todayMonth, 1);
        }

        selectedStartDate = null;
        renderCalendar();

        if (planSelectionModal) {
            planSelectionModal.classList.add('active');
            planSelectionModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeMiniModal() {
        if (planSelectionModal) {
            planSelectionModal.classList.remove('active');
            planSelectionModal.setAttribute('aria-hidden', 'true');
        }
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('active');
            contactModal.setAttribute('aria-hidden', 'true');
        }
    }

    planSelectionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const planName = button.getAttribute('data-plan') || 'Selected Plan';
            openMiniModal(planName);
        });
    });

    if (previousCalendarMonthButton) {
        previousCalendarMonthButton.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextCalendarMonthButton) {
        nextCalendarMonthButton.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        });
    }

    if (planModalCloseButton) planModalCloseButton.addEventListener('click', closeMiniModal);
    if (contactModalCloseButton) contactModalCloseButton.addEventListener('click', closeContactModal);

    if (backToCalendarButton) {
        backToCalendarButton.addEventListener('click', () => {
            closeContactModal();
            if (planSelectionModal) {
                planSelectionModal.classList.add('active');
                planSelectionModal.setAttribute('aria-hidden', 'false');
            }
        });
    }

    if (planSelectionModal) {
        planSelectionModal.addEventListener('click', (event) => {
            if (event.target === planSelectionModal) closeMiniModal();
        });
    }

    if (contactModal) {
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) closeContactModal();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMiniModal();
            closeContactModal();
        }
    });

});