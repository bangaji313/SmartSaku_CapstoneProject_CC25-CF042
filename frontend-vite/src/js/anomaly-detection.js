// Anomaly Detection Module
class AnomalyDetection {
    constructor() {
        this.anomalies = [];
        this.thresholds = {
            transport: 50000,
            food: 100000,
            shopping: 200000,
            consecutiveTransactions: 3,
            timeWindow: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
        };
        this.init();
    }

    init() {
        this.loadAnomalies();
        this.startMonitoring();
    }

    loadAnomalies() {
        // Load existing anomalies
        this.anomalies = [
            {
                id: 1,
                type: 'high_spending',
                category: 'transport',
                icon: 'fas fa-car',
                iconColor: 'orange',
                title: 'Pengeluaran Transport Tinggi',
                description: '200% lebih tinggi dari biasanya hari ini',
                amount: 100000,
                normalAmount: 30000,
                timestamp: Date.now() - 2 * 60 * 60 * 1000,
                severity: 'warning'
            },
            {
                id: 2,
                type: 'impulsive_buying',
                category: 'shopping',
                icon: 'fas fa-shopping-bag',
                iconColor: 'red',
                title: 'Pembelian Impulsif',
                description: '3 transaksi beruntun dalam 2 jam',
                transactions: 3,
                timespan: '2 jam',
                timestamp: Date.now() - 1 * 60 * 60 * 1000,
                severity: 'danger'
            }
        ];

        this.renderAnomalies();
    }

    renderAnomalies() {
        const container = document.querySelector('.anomaly-detection-container');
        if (!container) return;

        if (this.anomalies.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
                    <p class="text-gray-600">Tidak ada anomali terdeteksi</p>
                </div>
            `;
            return;
        }

        const html = this.anomalies.map(anomaly => `
            <div class="flex items-center p-3 bg-${anomaly.iconColor}-50 rounded-lg border border-${anomaly.iconColor}-200 anomaly-item" data-id="${anomaly.id}">
                <i class="${anomaly.icon} text-${anomaly.iconColor}-500 mr-3"></i>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${anomaly.title}</p>
                    <p class="text-xs text-gray-600">${anomaly.description}</p>
                    ${anomaly.amount ? `<p class="text-xs text-${anomaly.iconColor}-600 mt-1">Rp ${anomaly.amount.toLocaleString()} (normal: Rp ${anomaly.normalAmount.toLocaleString()})</p>` : ''}
                </div>
                <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="anomalyDetection.dismissAnomaly(${anomaly.id})">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    detectAnomaly(transaction) {
        const anomalies = [];

        // Check for high spending
        if (this.isHighSpending(transaction)) {
            anomalies.push(this.createHighSpendingAnomaly(transaction));
        }

        // Check for impulsive buying
        if (this.isImpulsiveBuying(transaction)) {
            anomalies.push(this.createImpulsiveBuyingAnomaly(transaction));
        }

        // Check for unusual time patterns
        if (this.isUnusualTime(transaction)) {
            anomalies.push(this.createUnusualTimeAnomaly(transaction));
        }

        // Add new anomalies
        anomalies.forEach(anomaly => this.addAnomaly(anomaly));

        return anomalies;
    }

    isHighSpending(transaction) {
        const threshold = this.thresholds[transaction.category] || 100000;
        return transaction.amount > threshold;
    }

    isImpulsiveBuying(transaction) {
        const recentTransactions = this.getRecentTransactions(this.thresholds.timeWindow);
        return recentTransactions.length >= this.thresholds.consecutiveTransactions;
    }

    isUnusualTime(transaction) {
        const hour = new Date(transaction.timestamp).getHours();
        return hour < 6 || hour > 23; // Late night or very early morning
    }

    createHighSpendingAnomaly(transaction) {
        return {
            id: Date.now(),
            type: 'high_spending',
            category: transaction.category,
            icon: 'fas fa-exclamation-triangle',
            iconColor: 'orange',
            title: 'Pengeluaran Tinggi Terdeteksi',
            description: `Pengeluaran ${transaction.category} melebihi batas normal`,
            amount: transaction.amount,
            normalAmount: this.thresholds[transaction.category],
            timestamp: transaction.timestamp,
            severity: 'warning'
        };
    }

    createImpulsiveBuyingAnomaly(transaction) {
        return {
            id: Date.now() + 1,
            type: 'impulsive_buying',
            category: transaction.category,
            icon: 'fas fa-shopping-bag',
            iconColor: 'red',
            title: 'Pola Pembelian Impulsif',
            description: 'Beberapa transaksi dalam waktu singkat',
            timestamp: transaction.timestamp,
            severity: 'danger'
        };
    }

    createUnusualTimeAnomaly(transaction) {
        return {
            id: Date.now() + 2,
            type: 'unusual_time',
            category: transaction.category,
            icon: 'fas fa-clock',
            iconColor: 'purple',
            title: 'Transaksi Waktu Tidak Biasa',
            description: 'Transaksi di luar jam normal',
            timestamp: transaction.timestamp,
            severity: 'info'
        };
    }

    addAnomaly(anomaly) {
        this.anomalies.unshift(anomaly);
        if (this.anomalies.length > 10) {
            this.anomalies.pop(); // Keep only latest 10
        }
        this.renderAnomalies();
        this.updateNotificationBadge();
        this.showAnomalyAlert(anomaly);
    }

    dismissAnomaly(id) {
        this.anomalies = this.anomalies.filter(anomaly => anomaly.id !== id);
        this.renderAnomalies();
        this.updateNotificationBadge();
    }

    getRecentTransactions(timeWindow) {
        const now = Date.now();
        // This would normally fetch from a real transaction history
        return []; // Placeholder
    }

    startMonitoring() {
        // Start real-time monitoring
        console.log('Anomaly detection monitoring started');

        // Simulate random anomalies for demo
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance
                this.simulateAnomaly();
            }
        }, 60000); // Check every minute
    }

    simulateAnomaly() {
        const mockTransaction = {
            id: Date.now(),
            amount: Math.random() * 200000 + 50000,
            category: ['transport', 'food', 'shopping'][Math.floor(Math.random() * 3)],
            timestamp: Date.now()
        };

        this.detectAnomaly(mockTransaction);
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const count = this.anomalies.filter(a => !a.dismissed).length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showAnomalyAlert(anomaly) {
        if (anomaly.severity === 'danger') {
            this.showAlert(`⚠️ ${anomaly.title}: ${anomaly.description}`, 'danger');
        } else if (anomaly.severity === 'warning') {
            this.showAlert(`⚠️ ${anomaly.title}: ${anomaly.description}`, 'warning');
        }
    }

    showAlert(message, type = 'info') {
        const alertColors = {
            danger: 'bg-red-500',
            warning: 'bg-orange-500',
            info: 'bg-blue-500'
        };

        const alert = document.createElement('div');
        alert.className = `fixed top-20 right-4 ${alertColors[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300`;
        alert.innerHTML = `
            <div class="flex items-center">
                <span class="flex-1">${message}</span>
                <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            alert.classList.add('translate-x-full');
            setTimeout(() => {
                if (alert.parentElement) {
                    document.body.removeChild(alert);
                }
            }, 300);
        }, 5000);
    }

    getAnomaliesByType(type) {
        return this.anomalies.filter(anomaly => anomaly.type === type);
    }

    getAnomaliesBySeverity(severity) {
        return this.anomalies.filter(anomaly => anomaly.severity === severity);
    }
}

// Export for use in other modules
window.AnomalyDetection = AnomalyDetection;