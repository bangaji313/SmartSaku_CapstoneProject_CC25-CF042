/**
 * Mobile Menu Handler untuk SmartSaku
 * Mengelola interaksi hamburger menu dan sidebar di tampilan mobile
 */

// Cek apakah halaman saat ini merupakan login, register, atau home
const currentPath = window.location.pathname;
const publicPages = ['/', '/login', '/register', '/index.html', '/login.html', '/register.html'];
const isPublicPage = publicPages.some(page =>
    currentPath === page ||
    currentPath.endsWith(page)
);

// Jika bukan halaman publik, maka definisikan fungsi global
if (!isPublicPage) {
    // Definisikan fungsi global agar dapat diakses dari HTML
    window.showSidebar = function () {
        console.log('Show sidebar called from global');
        const sidebar = document.querySelector('aside#sidebar');
        const mobileOverlay = document.querySelector('.mobile-overlay');

        if (sidebar && mobileOverlay) {
            sidebar.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Mencegah scrolling
        } else {
            console.error('Sidebar or overlay not found:', { sidebar, mobileOverlay });
        }
    }
}

// Jika bukan halaman publik, definisikan fungsi hideSidebar juga
if (!isPublicPage) {
    window.hideSidebar = function () {
        console.log('Hide sidebar called from global');
        const sidebar = document.querySelector('aside#sidebar');
        const mobileOverlay = document.querySelector('.mobile-overlay');

        if (sidebar && mobileOverlay) {
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Mengaktifkan scrolling kembali
        } else {
            console.error('Sidebar or overlay not found:', { sidebar, mobileOverlay });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Mobile menu script loaded');

    // Elemen-elemen yang dibutuhkan
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileHeader = document.querySelector('.mobile-header');

    // Log untuk debugging
    console.log('Hamburger menu element:', hamburgerMenu);

    // Fungsi untuk menampilkan menu sidebar
    function showSidebar() {
        console.log('Show sidebar called');
        sidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Mencegah scrolling
    }

    // Fungsi untuk menyembunyikan sidebar
    function hideSidebar() {
        console.log('Hide sidebar called');
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Mengaktifkan scrolling kembali
    }

    // Event listeners - menggunakan event delegation untuk memastikan elemen tertangkap
    document.body.addEventListener('click', function (e) {
        // Menangani klik pada hamburger menu
        if (e.target.closest('.hamburger-menu')) {
            console.log('Hamburger menu clicked');
            showSidebar();
        }

        // Menangani klik pada close menu
        if (e.target.closest('.close-menu')) {
            console.log('Close menu clicked');
            hideSidebar();
        }

        // Menangani klik pada overlay
        if (e.target.classList.contains('mobile-overlay') && e.target.classList.contains('active')) {
            console.log('Overlay clicked');
            hideSidebar();
        }
    });    // Cek ukuran layar dan tampilkan/sembunyikan elemen mobile
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            // Pastikan elemen ada sebelum memanipulasi classList
            if (mobileHeader) {
                mobileHeader.classList.remove('hidden');
            }
            if (closeMenu) {
                closeMenu.classList.remove('hidden');
            }
        } else {
            if (mobileHeader) {
                mobileHeader.classList.add('hidden');
            }
            if (closeMenu) {
                closeMenu.classList.add('hidden');
            }
            // Reset mobile view state jika layar diperbesar
            if (sidebar && mobileOverlay) {
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
            }
        }
    }

    // Jalankan saat halaman dimuat hanya jika elemen diperlukan ada
    if (mobileHeader || closeMenu || sidebar || mobileOverlay) {
        checkScreenSize();
    }

    // Jalankan ketika ukuran layar berubah
    window.addEventListener('resize', checkScreenSize);
});