/**
 * main-module.js
 * File ini berisi fungsi-fungsi yang digunakan di seluruh aplikasi SmartSaku
 * dalam format moduler untuk memenuhi poin penggunaan module bundler
 */

// Fungsi untuk setup menu mobile
export function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
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

/**
 * Setup Login Form
 * @returns {void}
 */
export function setupLoginForm() {
    console.log('Setting up login form...');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Periksa apakah elemen form dan input ditemukan
    if (!loginForm) {
        console.error("Form login tidak ditemukan!");
        return;
    }
    
    if (!emailInput || !passwordInput) {
        console.error("Input form login tidak lengkap:", {
            emailFound: !!emailInput,
            passwordFound: !!passwordInput
        });
        return;
    }
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Login form submitted");
        
        try {
            // Tampilkan loading state pada button
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton ? submitButton.innerText : 'Masuk';
            if (submitButton) {
                submitButton.innerText = 'Memproses...';
                submitButton.disabled = true;
            }
              console.log("Mengirim request login ke server...");
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });
            
            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }
            
            // Simpan token dan data user di localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect ke dashboard
            console.log("Login berhasil, redirect ke dashboard");
            window.location.href = '/dashboard.html';
            
        } catch (error) {
            console.error("Error saat login:", error);
            // Tampilkan pesan error
            alert(`Error: ${error.message}`);
        } finally {
            // Kembalikan button ke state semula
            const submitButton = loginForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerText = 'Masuk';
                submitButton.disabled = false;
            }
        }
    });
}

/**
 * Setup Register Form
 * @returns {void}
 */
export function setupRegisterForm() {
    console.log('Setting up register form...');
    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');
    
    // Periksa apakah elemen form dan input ditemukan
    if (!registerForm) {
        console.error("Form register tidak ditemukan!");
        return;
    }
    
    if (!emailInput || !passwordInput || !termsCheckbox) {
        console.error("Input form tidak lengkap:", {
            emailFound: !!emailInput,
            passwordFound: !!passwordInput,
            termsFound: !!termsCheckbox
        });
        return;
    }
    
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Form submit event captured");
        
        if (!termsCheckbox.checked) {
            alert('Anda harus menyetujui Syarat dan Ketentuan serta Kebijakan Privasi');
            return;
        }
        
        try {
            // Tampilkan loading state pada button
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerText;
            submitButton.innerText = 'Memproses...';
            submitButton.disabled = true;
              console.log("Mengirim request register ke server...");
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: emailInput.value.split('@')[0], // Menggunakan bagian depan email sebagai nama
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });
            
            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }
            
            // Tampilkan pesan sukses
            alert('Registrasi berhasil! Silakan login dengan akun baru Anda.');
            
            console.log("Mencoba redirect ke login.html");
            // Redirect ke halaman login
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error("Error saat registrasi:", error);
            // Tampilkan pesan error
            alert(`Error: ${error.message}`);
        } finally {
            console.log("Eksekusi finally block");
            // Kembalikan button ke state semula
            const submitButton = registerForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerText = 'Daftar';
                submitButton.disabled = false;
            }
        }
    });
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
