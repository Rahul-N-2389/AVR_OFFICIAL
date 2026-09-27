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

        const homeUrl = prefix + 'home.html';
        const aboutUrl = prefix + 'about us/aboutus.html';
        const servicesUrl = prefix + 'Services/Services.html';
        const plansUrl = prefix + 'plans/plans.html';
        const testimonialsUrl = prefix + 'testimonials/testimonials.html';
        const logoImg = prefix + 'images/dabba-hero.png';

        const navbarHTML = `
        <header class="main-header" id="navbar">
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
                        <li><a href="${aboutUrl}" class="nav-link ${activePage === 'aboutus' ? 'active' : ''}">ABOUT US</a></li>
                        <li><a href="${servicesUrl}" class="nav-link ${activePage === 'services' ? 'active' : ''}">SERVICES</a></li>
                        <li><a href="${plansUrl}" class="nav-link ${activePage === 'plans' ? 'active' : ''}">PLANS</a></li>
                        <li><a href="${testimonialsUrl}" class="nav-link ${activePage === 'testimonials' ? 'active' : ''}">TESTIMONIALS</a></li>
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
                    <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileDrawer">
                        <i class="bi bi-list fs-3"></i>
                    </button>
                </div>
            </div>
        </header>
        `;

        container.innerHTML = navbarHTML;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();
