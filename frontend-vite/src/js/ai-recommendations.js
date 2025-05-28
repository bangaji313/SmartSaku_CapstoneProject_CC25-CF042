// AI Recommendations Module
class AIRecommendations {
    constructor() {
        this.recommendations = [];
        this.init();
    }

    init() {
        this.loadRecommendations();
        this.startRealtimeUpdates();
    }

    loadRecommendations() {
        // Simulate AI recommendations
        this.recommendations = [
            {
                id: 1,
                type: 'savings',
                icon: 'fas fa-coffee',
                iconColor: 'yellow',
                title: 'Tips Hemat Coffee',
                description: 'Kurangi kopi kekinian 2x/minggu = hemat Rp80.000/bulan',
                potential: 'Rp80k',
                priority: 'high'
            },
            {
                id: 2,
                type: 'promo',
                icon: 'fas fa-motorcycle',
                iconColor: 'green',
                title: 'Promo Transport',
                description: 'Ada promo Gojek 50% untuk rute kampus-mall hari ini!',
                action: 'Hemat sekarang',
                priority: 'urgent'
            },
            {
                id: 3,
                type: 'prediction',
                icon: 'fas fa-chart-line',
                iconColor: 'blue',
                title: 'Prediksi Pengeluaran',
                description: 'Jika seperti ini terus, sisa uang akhir bulan: Rp350.000',
                action: 'Perlu perhatian',
                priority: 'medium'
            }
        ];

        this.renderRecommendations();
    }

    renderRecommendations() {
        const container = document.querySelector('.ai-recommendations-container');
        if (!container) return;

        const html = this.recommendations.map(rec => `
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 recommendation-item" data-id="${rec.id}">
                <div class="flex items-start space-x-3">
                    <div class="bg-${rec.iconColor}-100 p-2 rounded-lg flex-shrink-0">
                        <i class="${rec.icon} text-${rec.iconColor}-600"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">${rec.title}</h3>
                        <p class="text-sm text-gray-600 mb-2">${rec.description}</p>
                        ${rec.potential ? `<span class="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">Potensi hemat: ${rec.potential}</span>` : ''}
                        ${rec.action ? `<span class="bg-${rec.iconColor}-100 text-${rec.iconColor}-600 text-xs px-2 py-1 rounded-full">${rec.action}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    addRecommendation(recommendation) {
        this.recommendations.unshift(recommendation);
        if (this.recommendations.length > 5) {
            this.recommendations.pop(); // Keep only latest 5
        }
        this.renderRecommendations();
        this.showNotification('Rekomendasi baru tersedia!');
    }

    startRealtimeUpdates() {
        // Simulate real-time recommendations
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.generateRandomRecommendation();
            }
        }, 30000); // Check every 30 seconds
    }

    generateRandomRecommendation() {
        const randomRecs = [
            {
                id: Date.now(),
                type: 'alert',
                icon: 'fas fa-exclamation-triangle',
                iconColor: 'orange',
                title: 'Pengeluaran Tinggi Terdeteksi',
                description: 'Anda sudah menghabiskan 80% budget hari ini',
                action: 'Hati-hati',
                priority: 'high'
            },
            {
                id: Date.now() + 1,
                type: 'opportunity',
                icon: 'fas fa-percentage',
                iconColor: 'purple',
                title: 'Cashback Available',
                description: 'Dapatkan cashback 20% untuk pembelian di minimarket',
                action: 'Manfaatkan',
                priority: 'medium'
            }
        ];

        const randomRec = randomRecs[Math.floor(Math.random() * randomRecs.length)];
        this.addRecommendation(randomRec);
    }

    showNotification(message) {
        // Create notification toast
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getRecommendationsByType(type) {
        return this.recommendations.filter(rec => rec.type === type);
    }

    markAsRead(id) {
        const recommendation = this.recommendations.find(rec => rec.id === id);
        if (recommendation) {
            recommendation.read = true;
            this.renderRecommendations();
        }
    }
}

// Export for use in other modules
window.AIRecommendations = AIRecommendations;