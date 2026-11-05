/**
 * AVR DABBA - About Us JavaScript (aboutus.js)
 * Handles the About page header scroll state.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Header Scroll Effect
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

});