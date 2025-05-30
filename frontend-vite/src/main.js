// Import Tailwind CSS pertama (penting untuk urutan)
import './css/tailwind.css';

// Import CSS lainnya
import './css/custom.css';
// import './css/style.css'; // Uncomment jika diperlukan
import './css/dashboard.css';

// Import JavaScript modules dari versi modular yang kita buat
import { setupMobileMenu, setupLoginForm, setupRegisterForm, setupSmoothScrolling } from './js/main-module.js';
import { setupDashboard } from './js/dashboard-module.js';
import { setupDashboardComplete } from './js/dashboard-complete.js';
import { initSidebar } from './js/sidebar.js';
import './js/mobile-menu.js'; // Import handler menu mobile
import { loadHeaderAndSidebar, highlightActiveMenu } from './js/components-loader.js';

/**
 * Initialize page with charts
 * @param {string} pageType - Type of page ('report', 'simulasi', 'profil')
 */
function initPageWithCharts(pageType) {
    console.log(`Initializing ${pageType} page with charts`);
    // Initialize sidebar
    initSidebar();

    // Initialize charts if needed
    setTimeout(() => {
        // Check if Chart.js is available
        if (window.Chart) {
            console.log(`Charts initialized for ${pageType} page`);
        } else {
            console.warn('Chart.js is not available. Loading from CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = function () {
                console.log(`Charts library loaded for ${pageType} page`);
            };
            document.head.appendChild(script);
        }
    }, 100);
}

/**
 * Initialize page with sidebar only (no charts)
 * @param {string} pageType - Type of page ('notifikasi')
 */
function initPageWithSidebar(pageType) {
    console.log(`Initializing ${pageType} page`);
    // Initialize sidebar
    initSidebar();
}

/**
 * Initialize app
 * Aplikasi SmartSaku dengan bundling menggunakan Vite
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('SmartSaku app initialized with Vite!');

    try {
        // Pastikan header dan sidebar tersedia di semua halaman
        await loadHeaderAndSidebar();

        const path = window.location.pathname;
        let templatePath = '/src/templates/home.html';// Routing sederhana
        if (path === '/login' || path.includes('login.html')) {
            templatePath = '/src/templates/login.html';
        } else if (path === '/register' || path.includes('register.html')) {
            templatePath = '/src/templates/register.html';
        } else if (path === '/dashboard' || path.includes('dashboard.html')) {
            templatePath = '/src/templates/dashboard.html';
        } else if (path === '/report' || path.includes('report.html')) {
            templatePath = '/src/templates/report.html';
        } else if (path === '/notifikasi' || path.includes('notifikasi.html')) {
            templatePath = '/src/templates/notifikasi.html';
        } else if (path === '/simulasi' || path.includes('simulasi.html')) {
            templatePath = '/src/templates/simulasi.html';
        } else if (path === '/profil' || path.includes('profil.html')) {
            templatePath = '/src/templates/profil.html';
        }

        // Mengambil template HTML menggunakan fetch API
        const response = await fetch(templatePath);
        const html = await response.text();        // Menampilkan konten HTML
        document.getElementById('app').innerHTML = html;

        // Memastikan header mobile dan sidebar ditampilkan setelah konten dimuat
        await loadHeaderAndSidebar();
        highlightActiveMenu();

        // Menjalankan setup functions setelah HTML dimuat
        setupMobileMenu();
        setupSmoothScrolling();// Setup form dan fungsionalitas berdasarkan halaman
        if (path === '/login' || path.includes('login.html')) {
            setupLoginForm();
        } else if (path === '/register' || path.includes('register.html')) {
            setupRegisterForm();
        } else if (path === '/dashboard' || path.includes('dashboard.html')) {
            setupDashboardComplete(); // Inisialisasi dashboard dengan modal
        } else if (path === '/report' || path.includes('report.html')) {
            // Inisialisasi fungsionalitas report page
            initPageWithCharts('report');
        } else if (path === '/notifikasi' || path.includes('notifikasi.html')) {
            // Inisialisasi fungsionalitas notifikasi page
            initPageWithSidebar('notifikasi');
        } else if (path === '/simulasi' || path.includes('simulasi.html')) {
            // Inisialisasi fungsionalitas simulasi page
            initPageWithCharts('simulasi');
        } else if (path === '/profil' || path.includes('profil.html')) {
            // Inisialisasi fungsionalitas profil page
            initPageWithCharts('profil');
        }
    } catch (error) {
        console.error(`Failed to load template: ${error}`);
        document.getElementById('app').innerHTML = '<div class="p-8 text-center"><h1 class="text-3xl text-gradient">SmartSaku</h1><p class="mt-4">Error loading content. Please try again later.</p></div>';
    }
});
