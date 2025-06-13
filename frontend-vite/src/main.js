// Import Tailwind CSS pertama (penting untuk urutan)
import './css/tailwind.css';

// Import CSS lainnya
import './css/custom.css';
import './css/dashboard.css';

// Import Chat CSS - penting untuk chat assistant
import './css/chat.css';

// Import services yang sudah kita buat
import AuthService from './services/AuthService.js';
import TransaksiService from './services/TransaksiService.js';
import { NotifikasiUtil, ValidasiUtil, LoadingUtil } from './utils/helpers.js';
import ChatAssistant from './js/chatAssistant.js';

// Import handlers for notifications and simulations
import { setupNotifikasiHandlers } from './js/notificationHandlers.js';
import { setupSimulasiHandlers } from './js/simulationHandlers.js';

// Import export functionality
import { createExportUI, initExportUI } from './js/exportUI.js';

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
 * Setup Chat Assistant
 */
function setupChatAssistant() {
    console.log('Setting up SmartSaku Chat Assistant...');

    try {
        // Initialize chat assistant on all pages
        window.chatAssistant = new ChatAssistant();
        console.log('Chat Assistant successfully initialized');
    } catch (error) {
        console.error('Error initializing Chat Assistant:', error);
    }
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

    // Setup chat assistant
    setupChatAssistant();

    // Redirect ke home page jika di root
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        window.location.href = '/src/templates/home.html';
    }

    // Log untuk debugging
    console.log('Current path:', window.location.pathname);
    console.log('User logged in:', AuthService.sudahLogin());

    // Setup event listener for the laporan section to initialize export UI
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === 'laporan') {
                link.addEventListener('click', function () {
                    // Create the export UI when the laporan section is shown
                    setTimeout(() => {
                        createExportUI();

                        // Initialize the export UI with the controller if available
                        if (window.dashboardController) {
                            initExportUI(window.dashboardController);
                        }
                    }, 100);
                });
            }
        });
    }
});
