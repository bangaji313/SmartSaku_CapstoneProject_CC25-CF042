// Dashboard Configuration
const DashboardConfig = {
    // API Endpoints
    api: {
        baseUrl: '/api/v1',
        endpoints: {
            transactions: '/transactions',
            goals: '/financial-goals',
            recommendations: '/ai-recommendations',
            anomalies: '/anomaly-detection',
            stats: '/dashboard-stats'
        }
    },

    // Chart Configuration
    charts: {
        cashFlow: {
            type: 'line',
            height: 300,
            colors: {
                income: '#08daff',
                expense: '#ef4444',
                savings: '#10b981'
            }
        },
        categories: {
            type: 'doughnut',
            colors: ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']
        }
    },

    // Update Intervals (in milliseconds)
    updateIntervals: {
        stats: 60000,          // 1 minute
        charts: 300000,        // 5 minutes
        recommendations: 180000, // 3 minutes
        anomalies: 30000       // 30 seconds
    },

    // Anomaly Detection Thresholds
    anomalyThresholds: {
        transport: 50000,
        food: 100000,
        shopping: 200000,
        consecutiveTransactions: 3,
        timeWindow: 2 * 60 * 60 * 1000, // 2 hours
        unusualHours: {
            start: 23, // 11 PM
            end: 6     // 6 AM
        }
    },

    // AI Chat Responses
    chatKeywords: {
        savings: ['nabung', 'menabung', 'tabungan', 'saving'],
        budget: ['budget', 'anggaran', 'rencana keuangan'],
        investment: ['investasi', 'invest', 'saham', 'reksadana'],
        debt: ['cicilan', 'kredit', 'hutang', 'bayar'],
        expense: ['hemat', 'irit', 'menghemat', 'boros']
    },

    // Notification Settings
    notifications: {
        position: 'top-right',
        duration: 3000,
        types: {
            success: { color: 'green', icon: 'check-circle' },
            error: { color: 'red', icon: 'times-circle' },
            warning: { color: 'orange', icon: 'exclamation-triangle' },
            info: { color: 'blue', icon: 'info-circle' }
        }
    },

    // Currency Formatting
    currency: {
        locale: 'id-ID',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    },

    // Dashboard Layout
    layout: {
        sidebar: {
            width: '280px',
            collapsible: true
        },
        grid: {
            columns: {
                mobile: 1,
                tablet: 2,
                desktop: 3
            }
        }
    },

    // Feature Flags
    features: {
        darkMode: true,
        exportData: true,
        realTimeUpdates: true,
        voiceNotifications: false,
        biometricAuth: false
    },

    // Performance Settings
    performance: {
        lazyLoadCharts: true,
        virtualScrolling: true,
        debounceSearch: 300,
        maxTransactionsDisplay: 50
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardConfig;
} else {
    window.DashboardConfig = DashboardConfig;
}