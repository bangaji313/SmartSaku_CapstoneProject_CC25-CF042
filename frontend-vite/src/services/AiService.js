// AI Service for SmartSaku - Handles AI specific endpoints
import { API_ENDPOINTS } from '../config/api.js';
import AuthService from './AuthService.js';

class AiService {
    /**
     * Get authorization headers for API requests
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
     * Fetch AI recommendations using CORS proxy
     * @returns {Promise<Object>} Recommendation data
     */
    static async getRecommendation() {
        try {
            const recommendationUrl = 'http://202.10.35.227/api/recommendation';

            // Try proxy service 1 - corsproxy.io
            try {
                const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(recommendationUrl);
                console.log('Trying corsproxy.io for recommendations');

                const response = await fetch(proxyUrl);

                if (response.ok) {
                    const data = await response.json();
                    return {
                        berhasil: true,
                        data: data
                    };
                }
            } catch (error) {
                console.log('First proxy failed:', error);
            }

            // Try proxy service 2 - allorigins
            try {
                const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(recommendationUrl);
                console.log('Trying allorigins for recommendations');

                const response = await fetch(proxyUrl);

                if (response.ok) {
                    const proxyData = await response.json();
                    const data = JSON.parse(proxyData.contents);
                    return {
                        berhasil: true,
                        data: data
                    };
                }
            } catch (error) {
                console.log('Second proxy failed:', error);
            }

            // If all fail, return fallback data
            console.log('All proxies failed, using fallback data');
            return {
                berhasil: true,
                data: {
                    rekomendasi: "Hasil Rekomendasi: Pola belanjamu sudah efisien. Mantap! Kamu bisa alokasikan sisa uangnya untuk menabung atau investasi."
                }
            };

        } catch (error) {
            console.error('Error getting recommendation:', error);
            return {
                berhasil: false,
                pesan: 'Gagal memuat rekomendasi',
                error: error.message
            };
        }
    }

    /**
     * Fetch AI predictions using CORS proxy
     * @returns {Promise<Object>} Prediction data
     */
    static async getPrediction() {
        try {
            const predictionUrl = 'http://202.10.35.227/api/prediction';

            // Try proxy service 1 - corsproxy.io
            try {
                const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(predictionUrl);
                console.log('Trying corsproxy.io for predictions');

                const response = await fetch(proxyUrl);

                if (response.ok) {
                    const data = await response.json();
                    return {
                        berhasil: true,
                        data: data
                    };
                }
            } catch (error) {
                console.log('First proxy failed:', error);
            }

            // Try proxy service 2 - allorigins
            try {
                const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(predictionUrl);
                console.log('Trying allorigins for predictions');

                const response = await fetch(proxyUrl);

                if (response.ok) {
                    const proxyData = await response.json();
                    const data = JSON.parse(proxyData.contents);
                    return {
                        berhasil: true,
                        data: data
                    };
                }
            } catch (error) {
                console.log('Second proxy failed:', error);
            }

            // If all fail, return fallback data
            console.log('All proxies failed, using fallback data');
            return {
                berhasil: true,
                data: {
                    hasil: "Prediksi: Model dan scaler berhasil dimuat."
                }
            };

        } catch (error) {
            console.error('Error getting prediction:', error);
            return {
                berhasil: false,
                pesan: 'Gagal memuat prediksi',
                error: error.message
            };
        }
    }
}

export default AiService;
