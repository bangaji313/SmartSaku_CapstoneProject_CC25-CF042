// Konfigurasi API untuk SmartSaku
// Menggunakan proxy dari vite.config.js untuk menghindari CORS
const API_BASE_URL = '/api';

const API_ENDPOINTS = {
    // User endpoints
    LOGIN: `${API_BASE_URL}/user/login`,
    REGISTER: `${API_BASE_URL}/user/register`,

    // Transaction endpoints
    PEMASUKAN: (userId) => `${API_BASE_URL}/users/${userId}/incomes`,
    PENGELUARAN: (userId) => `${API_BASE_URL}/users/${userId}/expenses`,
    PEMASUKAN_BY_ID: (userId, transactionId) => `${API_BASE_URL}/users/${userId}/incomes/${transactionId}`,
    PENGELUARAN_BY_ID: (userId, transactionId) => `${API_BASE_URL}/users/${userId}/expenses/${transactionId}`
};

export { API_BASE_URL, API_ENDPOINTS };