// Service untuk mengelola transaksi keuangan
import { API_ENDPOINTS } from '../config/api.js';
import AuthService from './AuthService.js';

class TransaksiService {
    /**
     * Ambil header dengan authorization token
     * @returns {Object} Headers untuk request API
     */
    static getHeaders() {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
        };
    }

    /**
     * Helper untuk fetch dengan fallback CORS
     * @param {string} url - URL endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Response>} Response dari API
     */
    static async fetchWithFallback(url, options = {}) {
        try {
            // Coba dengan proxy terlebih dahulu
            return await fetch(url, options);
        } catch (error) {
            // Jika gagal, coba dengan direct URL
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                const directUrl = url.replace('/api', 'http://localhost:3000/api');
                return await fetch(directUrl, {
                    ...options,
                    mode: 'cors'
                });
            }
            throw error;
        }
    }

    /**
     * Ambil semua transaksi pemasukan
     * @param {string} userId - ID user
     * @returns {Promise<Object>} Daftar transaksi pemasukan
     */
    static async ambilPemasukan(userId) {
        try {
            const response = await this.fetchWithFallback(API_ENDPOINTS.PEMASUKAN(userId), {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: 'Gagal mengambil data pemasukan' };
            }
        } catch (error) {
            console.error('Error saat mengambil pemasukan:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Ambil semua transaksi pengeluaran
     * @param {string} userId - ID user
     * @returns {Promise<Object>} Daftar transaksi pengeluaran
     */
    static async ambilPengeluaran(userId) {
        try {
            const response = await this.fetchWithFallback(API_ENDPOINTS.PENGELUARAN(userId), {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: 'Gagal mengambil data pengeluaran' };
            }
        } catch (error) {
            console.error('Error saat mengambil pengeluaran:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Tambah transaksi pemasukan baru
     * @param {string} userId - ID user
     * @param {Object} dataTransaksi - Data transaksi (nominal, kategori, deskripsi)
     * @returns {Promise<Object>} Response dari API
     */
    static async tambahPemasukan(userId, dataTransaksi) {
        try {
            const response = await this.fetchWithFallback(API_ENDPOINTS.PEMASUKAN(userId), {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(dataTransaksi)
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Gagal menambah pemasukan' };
            }
        } catch (error) {
            console.error('Error saat menambah pemasukan:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Tambah transaksi pengeluaran baru
     * @param {string} userId - ID user
     * @param {Object} dataTransaksi - Data transaksi (nominal, kategori, deskripsi)
     * @returns {Promise<Object>} Response dari API
     */
    static async tambahPengeluaran(userId, dataTransaksi) {
        try {
            const response = await fetch(API_ENDPOINTS.PENGELUARAN(userId), {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(dataTransaksi)
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Gagal menambah pengeluaran' };
            }
        } catch (error) {
            console.error('Error saat menambah pengeluaran:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Update transaksi pemasukan
     * @param {string} userId - ID user
     * @param {string} transaksiId - ID transaksi
     * @param {Object} dataUpdate - Data yang akan diupdate
     * @returns {Promise<Object>} Response dari API
     */
    static async updatePemasukan(userId, transaksiId, dataUpdate) {
        try {
            console.log('Update pemasukan:', { userId, transaksiId, dataUpdate }); // Debug log

            if (!transaksiId || transaksiId === 'null') {
                return { berhasil: false, pesan: 'ID transaksi tidak valid' };
            }

            const response = await this.fetchWithFallback(API_ENDPOINTS.PEMASUKAN_BY_ID(userId, transaksiId), {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(dataUpdate)
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Gagal mengupdate pemasukan' };
            }
        } catch (error) {
            console.error('Error saat mengupdate pemasukan:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Update transaksi pengeluaran
     * @param {string} userId - ID user
     * @param {string} transaksiId - ID transaksi
     * @param {Object} dataUpdate - Data yang akan diupdate
     * @returns {Promise<Object>} Response dari API
     */
    static async updatePengeluaran(userId, transaksiId, dataUpdate) {
        try {
            console.log('Update pengeluaran:', { userId, transaksiId, dataUpdate }); // Debug log

            if (!transaksiId || transaksiId === 'null') {
                return { berhasil: false, pesan: 'ID transaksi tidak valid' };
            }

            const response = await this.fetchWithFallback(API_ENDPOINTS.PENGELUARAN_BY_ID(userId, transaksiId), {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(dataUpdate)
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Gagal mengupdate pengeluaran' };
            }
        } catch (error) {
            console.error('Error saat mengupdate pengeluaran:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Hapus transaksi pemasukan
     * @param {string} userId - ID user
     * @param {string} transaksiId - ID transaksi
     * @returns {Promise<Object>} Response dari API
     */
    static async hapusPemasukan(userId, transaksiId) {
        try {
            const response = await fetch(API_ENDPOINTS.PEMASUKAN_BY_ID(userId, transaksiId), {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Gagal menghapus pemasukan' };
            }
        } catch (error) {
            console.error('Error saat menghapus pemasukan:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Hapus transaksi pengeluaran
     * @param {string} userId - ID user
     * @param {string} transaksiId - ID transaksi
     * @returns {Promise<Object>} Response dari API
     */
    static async hapusPengeluaran(userId, transaksiId) {
        try {
            const response = await fetch(API_ENDPOINTS.PENGELUARAN_BY_ID(userId, transaksiId), {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { berhasil: true, data };
            } else {
                return { berhasil: false, pesan: data.message || 'Gagal menghapus pengeluaran' };
            }
        } catch (error) {
            console.error('Error saat menghapus pengeluaran:', error);
            return { berhasil: false, pesan: 'Terjadi kesalahan koneksi' };
        }
    }

    /**
     * Format nominal ke format rupiah
     * @param {number} nominal - Jumlah uang
     * @returns {string} Format rupiah
     */
    static formatRupiah(nominal) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(nominal);
    }

    /**
     * Format tanggal ke format lokal Indonesia
     * @param {string} tanggal - Tanggal dalam format ISO
     * @returns {string} Format tanggal lokal
     */
    static formatTanggal(tanggal) {
        return new Date(tanggal).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

export default TransaksiService;