/**
 * AVR DABBA - Shared Navigation Component (navbar.js)
 * Single Source of Truth for Header, Brand Logo, Links, Actions & Mobile Drawer.
 */

(function () {
    function initNavbar() {
        const container = document.getElementById('navbar-component');
        if (!container) return;

        // Get prefix directly from data-prefix attribute or compute reliably
        let prefix = container.getAttribute('data-prefix');
        if (prefix === null || prefix === undefined) {
            const path = decodeURIComponent(window.location.pathname).toLowerCase();
            if (path.includes('/about us/') || path.includes('/services/') || path.includes('/plans/') || path.includes('/testimonials/')) {
                prefix = '../';
            } else if (path.includes('aboutus.html') || path.includes('services.html') || path.includes('plans.html') || path.includes('testimonials.html')) {
                // Check if current file is in a subfolder
                prefix = '../';
            } else {
                prefix = '';
            }
        }

        // Determine active link
        const path = decodeURIComponent(window.location.pathname).toLowerCase();
        let activePage = 'home';
        if (path.includes('aboutus.html') || path.includes('about us')) {
            activePage = 'aboutus';
        } else if (path.includes('services.html') || path.includes('services')) {
            activePage = 'services';
        } else if (path.includes('plans.html') || path.includes('plans')) {
            activePage = 'plans';
        } else if (path.includes('testimonials.html') || path.includes('testimonials')) {
            activePage = 'testimonials';
        }

        const homeUrl = prefix + 'index.html';
        const aboutUrl = prefix + 'about us/aboutus.html';
        const servicesUrl = prefix + 'Services/Services.html';
        const plansUrl = prefix + 'plans/plans.html';
        const testimonialsUrl = prefix + 'testimonials/testimonials.html';
        const logoImg = prefix + 'images/dabba-hero.png';

        const navbarHTML = `
        <header class="main-header" id="main-navbar">
            <div class="container nav-container">
                <!-- Left: Highlighted AVR DABBA Logo -->
                <a href="${homeUrl}" class="brand-logo logo-highlighted" aria-label="AVR DABBA Homepage">
                    <div class="logo-icon-wrap">
                        <img src="${logoImg}" alt="AVR DABBA logo" class="brand-img" onerror="this.onerror=null; this.src='${prefix}images/logo.png';">
                    </div>
                    <div class="brand-text">
                        <span class="brand-name">AVR <span class="highlight-gold">DABBA</span></span>
                        <span class="brand-tagline">You cook with love &bull; We deliver with care</span>
                    </div>
                </a>

                <!-- Center: Desktop Navigation Links -->
                <nav class="desktop-nav" aria-label="Primary navigation">
                    <ul class="nav-links">
                        <li><a href="${homeUrl}" class="nav-link ${activePage === 'home' ? 'active' : ''}">HOME</a></li>
                        <li class="nav-item has-dropdown">
                            <a href="${aboutUrl}" class="nav-link ${activePage === 'aboutus' ? 'active' : ''}" aria-haspopup="true">ABOUT US</a>
                            <ul class="nav-dropdown">
                                <li><a href="${aboutUrl}#service-story">AVR Service Story</a></li>
                                <li><a href="${aboutUrl}#founders">Founders of AVR DABBA</a></li>
                            </ul>
                        </li>
                        <li class="nav-item has-dropdown">
                            <a href="${servicesUrl}" class="nav-link ${activePage === 'services' ? 'active' : ''}" aria-haspopup="true">SERVICES</a>
                            <ul class="nav-dropdown">
                                <li><a href="${servicesUrl}#about-service">About Service</a></li>
                                <li><a href="${servicesUrl}#services-to">AVR Services To</a></li>
                                <li><a href="${servicesUrl}#what-is-our-service">What Is Our Service?</a></li>
                                <li><a href="${servicesUrl}#how-it-works">How It Works</a></li>
                                <li><a href="${servicesUrl}#all-weather-service">All-Weather Reliable Service</a></li>
                                <li><a href="${servicesUrl}#what-we-provide">What We Provide</a></li>
                            </ul>
                        </li>
                        <li class="nav-item has-dropdown">
                            <a href="${plansUrl}" class="nav-link ${activePage === 'plans' ? 'active' : ''}" aria-haspopup="true">PLANS</a>
                            <ul class="nav-dropdown">
                                <li><a href="${plansUrl}#plan-prices">Plan Prices</a></li>
                                <li><a href="${plansUrl}#plan-start-dates">Plan Start Dates</a></li>
                                <li><a href="${plansUrl}#subscription-plans">Subscription Plans</a></li>
                                <li><a href="${plansUrl}#service-pamphlets">Our Service Pamphlets</a></li>
                            </ul>
                        </li>
                        <li class="nav-item has-dropdown">
                            <a href="${testimonialsUrl}" class="nav-link ${activePage === 'testimonials' ? 'active' : ''}" aria-haspopup="true">TESTIMONIALS</a>
                            <ul class="nav-dropdown">
                                <li><a href="${testimonialsUrl}#parent-reviews">Parent Reviews &amp; Feedback</a></li>
                                <li><a href="${testimonialsUrl}#give-feedback">Give Your Feedback</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                <!-- Right: Contact & Booking Actions -->
                <div class="nav-actions">
                    <a href="tel:9281271759" class="btn btn-outline-call">
                        <i class="bi bi-telephone-fill me-2"></i>
                        <div class="btn-call-text">
                            <span class="call-title">Contact us</span>
                        </div>
                    </a>
                    <a href="https://wa.me/919281271759?text=Hi%20AVR%20DABBA%2C%20I%20would%20like%20to%20book%20a%20dabba." class="btn btn-primary nav-cta" target="_blank" rel="noopener">
                        <i class="bi bi-whatsapp me-2"></i> Book a Dabba
                    </a>
                    <button class="mobile-toggle" id="mobile-menu-button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-navigation-drawer">
                        <i class="bi bi-list fs-3"></i>
                    </button>
                </div>
            </div>
        </header>
        `;

        container.innerHTML = navbarHTML + `
        <div class="drawer-overlay" id="navigation-drawer-overlay" aria-hidden="true"></div>
        <aside class="mobile-drawer" id="mobile-navigation-drawer" aria-label="Mobile navigation" aria-hidden="true">
            <div class="drawer-header"><span class="drawer-title">AVR DABBA</span><button type="button" class="drawer-close" id="drawer-close-button" aria-label="Close navigation menu">&times;</button></div>
            <nav aria-label="Mobile navigation links">
                <a class="drawer-link" href="${homeUrl}">HOME</a>
                <a class="drawer-link" href="${aboutUrl}">ABOUT US</a>
                <a class="drawer-link" href="${servicesUrl}">SERVICES</a>
                <a class="drawer-link" href="${plansUrl}">PLANS</a>
                <a class="drawer-link" href="${testimonialsUrl}">TESTIMONIALS</a>
            </nav>
            <div class="drawer-actions" aria-label="Contact options">
                <a href="tel:9281271759" class="btn btn-outline-call"><i class="bi bi-telephone-fill" aria-hidden="true"></i> Contact us</a>
                <a href="https://wa.me/919281271759?text=Hi%20AVR%20DABBA%2C%20I%20would%20like%20to%20book%20a%20dabba." class="btn nav-cta" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i> Book a Dabba</a>
            </div>
        </aside>`;

        const menuButton = container.querySelector('#mobile-menu-button');
        const drawer = container.querySelector('#mobile-navigation-drawer');
        const overlay = container.querySelector('#navigation-drawer-overlay');
        const closeButton = container.querySelector('#drawer-close-button');
        const closeDrawer = () => {
            drawer.classList.remove('open'); overlay.classList.remove('active');
            menuButton.focus();
            drawer.setAttribute('aria-hidden', 'true'); overlay.setAttribute('aria-hidden', 'true');
            menuButton.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
        };
        const openDrawer = () => {
            drawer.classList.add('open'); overlay.classList.add('active');
            drawer.setAttribute('aria-hidden', 'false'); overlay.setAttribute('aria-hidden', 'false');
            menuButton.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden';
        };
        menuButton.addEventListener('click', openDrawer);
        closeButton.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);
        drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDrawer));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();
