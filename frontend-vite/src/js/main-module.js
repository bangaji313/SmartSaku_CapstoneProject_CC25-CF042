/**
 * main-module.js
 * File ini berisi fungsi-fungsi yang digunakan di seluruh aplikasi SmartSaku
 * dalam format moduler untuk memenuhi poin penggunaan module bundler
 */

// Fungsi untuk setup menu mobile
export function setupMobileMenu() {
    console.log('Setting up mobile menu...');

    // Cek apakah halaman saat ini merupakan login, register, atau home
    const currentPath = window.location.pathname;
    const publicPages = ['/', '/login', '/register', '/index.html', '/login.html', '/register.html'];
    const isPublicPage = publicPages.some(page =>
        currentPath === page ||
        currentPath.endsWith(page)
    );

    // Jika halaman adalah login, register, atau home, jangan aktifkan menu mobile
    if (isPublicPage) {
        console.log('Halaman publik terdeteksi, tidak mengaktifkan menu mobile:', currentPath);
        return;
    }

    // Pastikan fungsi global tersedia
    if (typeof window.showSidebar !== 'function') {
        window.showSidebar = function () {
            console.log('Show sidebar from setupMobileMenu');
            const sidebar = document.querySelector('aside#sidebar');
            const overlay = document.querySelector('.mobile-overlay');

            if (sidebar && overlay) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    if (typeof window.hideSidebar !== 'function') {
        window.hideSidebar = function () {
            console.log('Hide sidebar from setupMobileMenu');
            const sidebar = document.querySelector('aside#sidebar');
            const overlay = document.querySelector('.mobile-overlay');

            if (sidebar && overlay) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        };
    }

    // Tambahkan event listeners
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function () {
            console.log('Hamburger menu clicked from setupMobileMenu');
            window.showSidebar();
        });
    }

    const closeMenu = document.querySelector('.close-menu button');
    if (closeMenu) {
        closeMenu.addEventListener('click', function () {
            console.log('Close button clicked from setupMobileMenu');
            window.hideSidebar();
        });
    }

    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.addEventListener('click', function () {
            console.log('Overlay clicked from setupMobileMenu');
            window.hideSidebar();
        });
    }
}

// Fungsi untuk smooth scrolling
export function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fungsi untuk setup login form
export function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Memproses...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                console.log('Login attempt:', { email, password });
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showSuccess('Login berhasil! Mengalihkan ke dashboard...');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }, 1500);
        });
    }
}

// Fungsi untuk setup register form
export function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validation
            if (password !== confirmPassword) {
                showError('Kata sandi tidak cocok!');
                return;
            }

            if (password.length < 8) {
                showError('Kata sandi minimal 8 karakter!');
                return;
            }

            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mendaftar...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                console.log('Registration attempt:', { name, email, password });
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showSuccess('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }, 1500);
        });
    }
}

// Helper function untuk menampilkan pesan error
export function showError(message) {
    showToast(message, 'error');
}

// Helper function untuk menampilkan pesan sukses
export function showSuccess(message) {
    showToast(message, 'success');
}

// Helper function untuk toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');

    // Set style based on type
    let bgColor = 'bg-blue-500';
    if (type === 'error') bgColor = 'bg-red-500';
    if (type === 'success') bgColor = 'bg-green-500';

    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    toast.textContent = message;

    // Add to DOM
    document.body.appendChild(toast);

    // Animation: slide in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    // Animation: slide out and remove
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Eksport fungsi-fungsi utility lainnya yang mungkin diperlukan
export const utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },
    validateEmail: (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }
};
