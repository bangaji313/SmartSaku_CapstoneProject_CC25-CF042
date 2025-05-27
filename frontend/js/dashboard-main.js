// Main Dashboard Controller
class Dashboard {
    constructor() {
        this.modules = {};
        this.init();
    }

    async init() {
        try {
            // Initialize all modules
            await this.initializeModules();

            // Setup event listeners
            this.setupEventListeners();

            // Start real-time updates
            this.startRealtimeUpdates();

            console.log('Dashboard initialized successfully');
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
        }
    }

    async initializeModules() {
        // Initialize Charts Module
        if (window.DashboardCharts) {
            this.modules.charts = new window.DashboardCharts();
        }

        // Initialize AI Recommendations Module
        if (window.AIRecommendations) {
            this.modules.aiRecommendations = new window.AIRecommendations();
        }

        // Initialize Anomaly Detection Module
        if (window.AnomalyDetection) {
            this.modules.anomalyDetection = new window.AnomalyDetection();
        }

        // Initialize Financial Goals Module
        if (window.FinancialGoals) {
            this.modules.financialGoals = new window.FinancialGoals();
        }

        // Initialize AI Chat Assistant Module
        if (window.AIChatAssistant) {
            this.modules.aiChat = new window.AIChatAssistant();
        }

        // Initialize Stats Module
        this.modules.stats = new StatsModule();

        // Initialize Transactions Module
        this.modules.transactions = new TransactionsModule();
    }

    setupEventListeners() {
        // Navigation active state
        this.setupNavigation();

        // Refresh button
        const refreshBtn = document.querySelector('.refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }

        // Export button
        const exportBtn = document.querySelector('.export-dashboard');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDashboard());
        }

        // Settings button
        const settingsBtn = document.querySelector('.dashboard-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('text-primary', 'font-semibold', 'border-b-2', 'border-primary', 'pb-1'));

                // Add active class to clicked link
                e.target.classList.add('text-primary', 'font-semibold', 'border-b-2', 'border-primary', 'pb-1');
            });
        });
    }

    startRealtimeUpdates() {
        // Update stats every minute
        setInterval(() => {
            this.updateStats();
        }, 60000);

        // Update charts every 5 minutes
        setInterval(() => {
            this.updateCharts();
        }, 300000);

        // Check for anomalies every 30 seconds
        setInterval(() => {
            this.checkAnomalies();
        }, 30000);
    }

    updateStats() {
        if (this.modules.stats) {
            this.modules.stats.updateRealtime();
        }
    }

    updateCharts() {
        if (this.modules.charts) {
            // Simulate new data
            const newData = this.generateRandomChartData();
            this.modules.charts.updateChartData('cashFlowChart', newData);
        }
    }

    checkAnomalies() {
        if (this.modules.anomalyDetection) {
            // Simulate transaction for anomaly detection
            const mockTransaction = {
                id: Date.now(),
                amount: Math.random() * 100000 + 10000,
                category: ['food', 'transport', 'shopping', 'entertainment'][Math.floor(Math.random() * 4)],
                timestamp: Date.now()
            };

            // Only check occasionally to avoid spam
            if (Math.random() < 0.1) {
                this.modules.anomalyDetection.detectAnomaly(mockTransaction);
            }
        }
    }

    generateRandomChartData() {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 2000000 + 500000));
    }

    refreshDashboard() {
        // Show loading indicator
        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            // Refresh all modules
            Object.values(this.modules).forEach(module => {
                if (module.refresh) {
                    module.refresh();
                }
            });

            this.hideLoading();
            this.showNotification('Dashboard berhasil diperbarui!');
        }, 2000);
    }

    exportDashboard() {
        const dashboardData = {
            stats: this.modules.stats?.getStats(),
            goals: this.modules.financialGoals?.goals,
            anomalies: this.modules.anomalyDetection?.anomalies,
            recommendations: this.modules.aiRecommendations?.recommendations,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(dashboardData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartsaku-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Data dashboard berhasil diexport!');
    }

    showSettings() {
        const modal = this.createModal('Pengaturan Dashboard', `
            <div class="space-y-4">
                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="autoRefresh" class="rounded border-gray-300">
                        <span class="text-sm">Auto refresh setiap 5 menit</span>
                    </label>
                </div>
                
                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="soundNotification" class="rounded border-gray-300">
                        <span class="text-sm">Notifikasi suara</span>
                    </label>
                </div>
                
                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="darkMode" class="rounded border-gray-300">
                        <span class="text-sm">Mode gelap</span>
                    </label>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mata uang</label>
                    <select id="currency" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="IDR">Rupiah (IDR)</option>
                        <option value="USD">US Dollar (USD)</option>
                    </select>
                </div>
                
                <div class="flex space-x-3 pt-4">
                    <button onclick="dashboard.saveSettings()" class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors">
                        Simpan
                    </button>
                    <button onclick="this.closest('.modal-overlay').remove()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                        Batal
                    </button>
                </div>
            </div>
        `);
    }

    saveSettings() {
        const settings = {
            autoRefresh: document.getElementById('autoRefresh')?.checked || false,
            soundNotification: document.getElementById('soundNotification')?.checked || false,
            darkMode: document.getElementById('darkMode')?.checked || false,
            currency: document.getElementById('currency')?.value || 'IDR'
        };

        localStorage.setItem('smartsaku_settings', JSON.stringify(settings));
        this.applySettings(settings);

        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();

        this.showNotification('Pengaturan berhasil disimpan!');
    }

    loadSettings() {
        const saved = localStorage.getItem('smartsaku_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.applySettings(settings);
        }
    }

    applySettings(settings) {
        if (settings.darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        if (settings.autoRefresh) {
            this.startAutoRefresh();
        }

        // Apply other settings...
    }

    startAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        this.autoRefreshInterval = setInterval(() => {
            this.refreshDashboard();
        }, 300000); // 5 minutes
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.id = 'dashboard-loading';
        loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loading.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span class="text-gray-700">Memperbarui dashboard...</span>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('dashboard-loading');
        if (loading) {
            document.body.removeChild(loading);
        }
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
                <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">${title}</h2>
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    showNotification(message, type = 'success') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-orange-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Getter methods for accessing modules
    getCharts() { return this.modules.charts; }
    getAIRecommendations() { return this.modules.aiRecommendations; }
    getAnomalyDetection() { return this.modules.anomalyDetection; }
    getFinancialGoals() { return this.modules.financialGoals; }
    getAIChat() { return this.modules.aiChat; }
    getStats() { return this.modules.stats; }
    getTransactions() { return this.modules.transactions; }
}

// Simple Stats Module
class StatsModule {
    constructor() {
        this.stats = {
            balance: 1250000,
            monthlyExpense: 850000,
            savingsTarget: 400000,
            level: 'Budget Warrior'
        };
    }

    updateRealtime() {
        // Simulate small changes
        this.stats.balance += Math.floor(Math.random() * 10000) - 5000;
        this.updateDisplay();
    }

    updateDisplay() {
        // Update balance display
        const balanceEl = document.querySelector('[data-stat="balance"]');
        if (balanceEl) {
            balanceEl.textContent = `Rp ${this.stats.balance.toLocaleString()}`;
        }
    }

    getStats() {
        return { ...this.stats };
    }
}

// Simple Transactions Module  
class TransactionsModule {
    constructor() {
        this.transactions = [];
        this.loadRecentTransactions();
    }

    loadRecentTransactions() {
        // Mock recent transactions
        this.transactions = [
            {
                id: 1,
                merchant: 'Starbucks',
                category: 'food',
                amount: -45000,
                timestamp: Date.now() - 2 * 60 * 60 * 1000
            },
            {
                id: 2,
                merchant: 'TransJakarta',
                category: 'transport',
                amount: -3500,
                timestamp: Date.now() - 4 * 60 * 60 * 1000
            },
            {
                id: 3,
                merchant: 'Uang Saku Mama',
                category: 'income',
                amount: 500000,
                timestamp: Date.now() - 24 * 60 * 60 * 1000
            }
        ];
    }

    getRecentTransactions(limit = 10) {
        return this.transactions.slice(0, limit);
    }
}

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.dashboard = new Dashboard();
});

// Global access to dashboard
window.Dashboard = Dashboard;