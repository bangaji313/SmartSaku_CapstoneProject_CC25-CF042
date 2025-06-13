// Konfigurasi API untuk SmartSaku
const API_BASE_URL = 'http://202.10.35.227/api';
const CHAT_API_URL = 'http://202.10.35.227';
const API_ENDPOINTS = {
    // User endpoints
    LOGIN: `${API_BASE_URL}/user/login`,
    REGISTER: `${API_BASE_URL}/user/register`,

    // Transaction endpoints
    PEMASUKAN: (userId) => `${API_BASE_URL}/users/${userId}/incomes`,
    PENGELUARAN: (userId) => `${API_BASE_URL}/users/${userId}/expenses`,
    PEMASUKAN_BY_ID: (userId, transactionId) => `${API_BASE_URL}/users/${userId}/incomes/${transactionId}`,
    PENGELUARAN_BY_ID: (userId, transactionId) => `${API_BASE_URL}/users/${userId}/expenses/${transactionId}`,

    // AI endpoints
    CHAT: `${CHAT_API_URL}/chat`, // Menggunakan endpoint chat produksi di http://202.10.35.227/chat
    RECOMMENDATION: `${CHAT_API_URL}/recommendation`,
    PREDICTION: `${CHAT_API_URL}/prediction`
};

export { API_BASE_URL, API_ENDPOINTS };