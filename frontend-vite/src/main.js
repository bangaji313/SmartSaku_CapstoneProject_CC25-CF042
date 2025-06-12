// Import Tailwind CSS pertama (penting untuk urutan)
import './css/tailwind.css';

// Import CSS lainnya
import './css/custom.css';
import './css/dashboard.css';

// Import services yang sudah kita buat
import AuthService from './services/AuthService.js';
import TransaksiService from './services/TransaksiService.js';
import { NotifikasiUtil, ValidasiUtil, LoadingUtil } from './utils/helpers.js';

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Setup smooth scrolling untuk anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Setup global utilities
 */
function setupGlobalUtils() {
    // Export utilities ke global scope untuk akses mudah
    window.SmartSaku = {
        AuthService,
        TransaksiService,
        NotifikasiUtil,
        ValidasiUtil,
        LoadingUtil
    };
}

/**
 * Router sederhana untuk SPA
 */
function setupRouter() {
    const path = window.location.pathname;

    // Redirect jika sudah login dan mencoba akses login/register
    if ((path.includes('login') || path.includes('register')) && AuthService.sudahLogin()) {
        window.location.href = '/src/templates/dashboard.html';
        return;
    }

    // Redirect ke login jika belum login dan mencoba akses dashboard
    if (path.includes('dashboard') && !AuthService.sudahLogin()) {
        window.location.href = '/src/templates/login.html';
        return;
    }
}

/**
 * Initialize aplikasi SmartSaku
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('SmartSaku App Initialized');

    // Setup router
    setupRouter();

    // Setup mobile menu toggle
    setupMobileMenu();

    // Setup smooth scrolling
    setupSmoothScrolling();

    // Setup global utilities
    setupGlobalUtils();

    // Redirect ke home page jika di root
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        window.location.href = '/src/templates/home.html';
    }

    // Log untuk debugging
    console.log('Current path:', window.location.pathname);
    console.log('User logged in:', AuthService.sudahLogin());
});
