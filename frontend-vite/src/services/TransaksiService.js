// Service untuk mengelola transaksi keuangan
import { API_ENDPOINTS } from '../config/api.js';
import AuthService from './AuthService.js';

class TransaksiService {    /**
     * Ambil header dengan authorization token
     * @returns {Object} Headers untuk request API
     */
    static getHeaders() {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };
    }

    /**
     * Helper untuk fetch dengan fallback CORS
     * @param {string} url - URL endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Response>} Response dari API
     */    static async fetchWithFallback(url, options = {}) {
        try {
            console.log('Trying direct request to:', url);
            return await fetch(url, options);
        } catch (error) {
            console.log('Direct request failed, trying CORS proxy');

            // Check if the URL is already absolute (starts with http:// or https://)
            const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
            const fullUrl = isAbsoluteUrl ? url : `http://202.10.35.227${url}`;

            // Jika langsung gagal, gunakan proxy CORS
            try {
                // Opsi 1: cors-anywhere
                const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
                const proxyUrl = corsProxyUrl + fullUrl;
                console.log('Trying cors-anywhere proxy:', proxyUrl);

                return await fetch(proxyUrl, options);
            } catch (proxyError) {
                // Opsi 2: allOrigins
                try {
                    const allOriginsUrl = 'https://api.allorigins.win/raw?url=';
                    const proxyUrl2 = allOriginsUrl + encodeURIComponent(fullUrl);
                    console.log('Trying allOrigins proxy:', proxyUrl2);

                    return await fetch(proxyUrl2, options);
                } catch (finalError) {
                    console.error('All fallbacks failed:', finalError);
                    throw error;
                }
            }
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
     * @returns {Promise<Object>}
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
     */    static async tambahPengeluaran(userId, dataTransaksi) {
        try {
            const response = await this.fetchWithFallback(API_ENDPOINTS.PENGELUARAN(userId), {
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
     */    static async hapusPemasukan(userId, transaksiId) {
        try {
            const response = await this.fetchWithFallback(API_ENDPOINTS.PEMASUKAN_BY_ID(userId, transaksiId), {
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
     */    static async hapusPengeluaran(userId, transaksiId) {
        try {
            const response = await this.fetchWithFallback(API_ENDPOINTS.PENGELUARAN_BY_ID(userId, transaksiId), {
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
    }    /**
     * Ambil rekomendasi dari API dengan CORS handling khusus
     * @returns {Promise<Object>} Response dari API
     */
    static async ambilRekomendasi() {
        try {
            // Use a more reliable CORS proxy specifically for recommendations
            const recommendationUrl = 'http://202.10.35.227/api/recommendation';
            let response;
            let data; try {
                // First try: Direct fetch with no-cors mode
                console.log('Trying direct fetch with no-cors for recommendations');
                response = await fetch(recommendationUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    mode: 'no-cors'
                });
            } catch (directError) {
                console.log('Direct fetch failed, trying JSONP approach');

                // Second try: Use a more reliable CORS proxy
                try {
                    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(recommendationUrl);
                    response = await fetch(proxyUrl);

                    if (!response.ok) {
                        throw new Error(`HTTP Error via proxy: ${response.status}`);
                    }

                    const proxyData = await response.json();
                    // Parse the content from the proxy response
                    data = JSON.parse(proxyData.contents);

                    return {
                        berhasil: true,
                        data: data
                    };
                } catch (proxyError) {
                    // Third try: Fallback to our standard method
                    console.log('Proxy approach failed, trying standard fetchWithFallback');
                    response = await this.fetchWithFallback(API_ENDPOINTS.RECOMMENDATION, {
                        method: 'GET',
                        headers: this.getHeaders()
                    });
                }
            }

            if (!data) {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                data = await response.json();
            }

            return {
                berhasil: true,
                data: data
            };
        } catch (error) {
            console.error('Error ambil rekomendasi:', error);
            return {
                berhasil: false,
                pesan: 'Gagal memuat rekomendasi',
                error: error.message
            };
        }
    }

    /**
     * Ambil prediksi dari API dengan CORS handling khusus
     * @returns {Promise<Object>} Response dari API
     */
    static async ambilPrediksi() {
        try {
            // Use a more reliable CORS proxy specifically for predictions
            const predictionUrl = 'http://202.10.35.227/api/prediction';
            let response;
            let data;

            try {
                // First try: Direct fetch with CORS mode
                console.log('Trying direct fetch for predictions');
                response = await fetch(predictionUrl, {
                    method: 'GET',
                    headers: this.getHeaders(),
                    mode: 'cors'
                });
            } catch (directError) {
                console.log('Direct fetch for prediction failed, trying proxy approach');

                // Second try: Use a reliable CORS proxy
                try {
                    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(predictionUrl);
                    response = await fetch(proxyUrl);

                    if (!response.ok) {
                        throw new Error(`HTTP Error via proxy: ${response.status}`);
                    }

                    const proxyData = await response.json();
                    // Parse the content from the proxy response
                    data = JSON.parse(proxyData.contents);

                    return {
                        berhasil: true,
                        data: data
                    };
                } catch (proxyError) {
                    // Third try: Fallback to standard method
                    console.log('Proxy approach for prediction failed, trying standard fetchWithFallback');
                    response = await this.fetchWithFallback(API_ENDPOINTS.PREDICTION, {
                        method: 'GET',
                        headers: this.getHeaders()
                    });
                }
            }

            if (!data) {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                data = await response.json();
            }

            return {
                berhasil: true,
                data: data
            };
        } catch (error) {
            console.error('Error ambil prediksi:', error);
            return {
                berhasil: false,
                pesan: 'Gagal memuat prediksi',
                error: error.message
            };
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

    /**
     * Tes koneksi ke server API
     * @returns {Promise<Object>} Status koneksi server
     */
    static async testConnection() {
        try {
            console.log('Testing API connection to server');
            const response = await fetch('http://202.10.35.227/api/user/login', {
                method: 'OPTIONS',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            return {
                berhasil: response.ok,
                status: response.status,
                statusText: response.statusText
            };
        } catch (error) {
            console.error('API connection test failed:', error);
            return {
                berhasil: false,
                pesan: error.message,
                error: error
            };
        }
    }
}

export default TransaksiService;