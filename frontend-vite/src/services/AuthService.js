// Service untuk mengelola autentikasi user
import { API_ENDPOINTS } from '../config/api.js';

class AuthService {
    /**
     * Login user ke sistem
     * @param {Object} kredensial - Email dan password user
     * @returns {Promise<Object>} Response dari API
     */
    static async login(kredensial) {
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(kredensial)
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan token dan data user di localStorage
                this.simpanDataUser(data.token, data.user);
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Login gagal' };
            }
        } catch (error) {
            console.error('Error saat login:', error);

            // Jika error CORS atau network, coba dengan direct URL
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                return await this.loginFallback(kredensial);
            }

            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Fallback login jika proxy tidak bekerja
     * @param {Object} kredensial - Email dan password user
     * @returns {Promise<Object>} Response dari API
     */
    static async loginFallback(kredensial) {
        try {
            const response = await fetch('http://202.10.35.227/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                mode: 'cors',
                body: JSON.stringify(kredensial)
            });

            const data = await response.json();

            if (response.ok) {
                this.simpanDataUser(data.token, data.user);
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Login gagal' };
            }
        } catch (error) {
            console.error('Fallback login error:', error);
            return { berhasil: false, pesan: 'Backend API tidak dapat diakses. Pastikan server berjalan di localhost:3000' };
        }
    }

    /**
     * Register user baru
     * @param {Object} dataUser - Data user baru (name, email, password)
     * @returns {Promise<Object>} Response dari API
     */
    static async register(dataUser) {
        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataUser)
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Registrasi gagal' };
            }
        } catch (error) {
            console.error('Error saat registrasi:', error);

            // Jika error CORS atau network, coba dengan direct URL
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                return await this.registerFallback(dataUser);
            }

            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Fallback register jika proxy tidak bekerja
     * @param {Object} dataUser - Data user baru
     * @returns {Promise<Object>} Response dari API
     */
    static async registerFallback(dataUser) {
        try {
            // Alternatif CORS proxy yang berbeda
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const url = encodeURIComponent('http://202.10.35.227/api/user/register');
            const response = await fetch(corsProxy + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                mode: 'cors',
                body: JSON.stringify(dataUser)
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Registrasi gagal' };
            }
        } catch (error) {
            console.error('Fallback register error:', error);
            return { berhasil: false, pesan: 'Backend API tidak dapat diakses. Pastikan server berjalan di localhost:3000' };
        }
    }

    /**
     * Logout user dari sistem
     */
    static logout() {
        localStorage.removeItem('smartsaku_token');
        localStorage.removeItem('smartsaku_user');
        window.location.href = '/';
    }

    /**
     * Simpan data user ke localStorage
     * @param {string} token - JWT token
     * @param {Object} user - Data user
     */
    static simpanDataUser(token, user) {
        localStorage.setItem('smartsaku_token', token);
        localStorage.setItem('smartsaku_user', JSON.stringify(user));
    }

    /**
     * Ambil token dari localStorage
     * @returns {string|null} JWT token
     */
    static getToken() {
        return localStorage.getItem('smartsaku_token');
    }

    /**
     * Ambil data user dari localStorage
     * @returns {Object|null} Data user
     */
    static getUser() {
        const userData = localStorage.getItem('smartsaku_user');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Cek apakah user sudah login
     * @returns {boolean} Status login
     */
    static sudahLogin() {
        return this.getToken() !== null;
    }
}

export default AuthService;