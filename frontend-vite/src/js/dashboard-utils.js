// Dashboard Utilities
class DashboardUtils {
    // Currency formatting
    static formatCurrency(amount, options = {}) {
        const defaultOptions = {
            locale: DashboardConfig?.currency?.locale || 'id-ID',
            currency: DashboardConfig?.currency?.currency || 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            ...options
        };

        return new Intl.NumberFormat(defaultOptions.locale, {
            style: 'currency',
            currency: defaultOptions.currency,
            minimumFractionDigits: defaultOptions.minimumFractionDigits,
            maximumFractionDigits: defaultOptions.maximumFractionDigits
        }).format(amount);
    }

    // Simplified number formatting for Indonesian
    static formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(0) + 'k';
        }
        return number.toLocaleString('id-ID');
    }

    // Date formatting
    static formatDate(date, format = 'long') {
        const dateObj = new Date(date);
        const options = {
            long: {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            },
            medium: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        };

        return dateObj.toLocaleDateString('id-ID', options[format] || options.short);
    }

    // Time ago formatting
    static getTimeAgo(timestamp) {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - timestamp) / 1000);

        if (diffInSeconds < 60) {
            return 'Baru saja';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} menit yang lalu`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} jam yang lalu`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} hari yang lalu`;
        } else {
            return this.formatDate(timestamp, 'short');
        }
    }

    // Progress calculation
    static calculateProgress(current, target) {
        if (target <= 0) return 0;
        return Math.min(Math.round((current / target) * 100), 100);
    }

    // Progress color based on percentage
    static getProgressColor(percentage) {
        if (percentage >= 100) return 'from-green-400 to-green-500';
        if (percentage >= 75) return 'from-blue-400 to-blue-500';
        if (percentage >= 50) return 'from-yellow-400 to-yellow-500';
        if (percentage >= 25) return 'from-orange-400 to-orange-500';
        return 'from-red-400 to-red-500';
    }

    // Category icon mapping
    static getCategoryIcon(category) {
        const icons = {
            food: 'fas fa-utensils',
            transport: 'fas fa-car',
            education: 'fas fa-graduation-cap',
            entertainment: 'fas fa-gamepad',
            shopping: 'fas fa-shopping-bag',
            health: 'fas fa-heart',
            bills: 'fas fa-file-invoice',
            income: 'fas fa-plus-circle',
            savings: 'fas fa-piggy-bank',
            investment: 'fas fa-chart-line',
            other: 'fas fa-ellipsis-h'
        };
        return icons[category] || icons.other;
    }

    // Category color mapping
    static getCategoryColor(category) {
        const colors = {
            food: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
            transport: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
            education: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
            entertainment: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
            shopping: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
            health: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
            bills: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
            income: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
            savings: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
            investment: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
            other: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
        };
        return colors[category] || colors.other;
    }

    // Local storage helpers
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(`smartsaku_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`smartsaku_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }

    static removeFromStorage(key) {
        try {
            localStorage.removeItem(`smartsaku_${key}`);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    }

    // Toast notifications
    static showToast(message, type = 'success', duration = 3000) {
        const config = DashboardConfig?.notifications || {};
        const typeConfig = config.types?.[type] || { color: 'green', icon: 'check-circle' };

        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 bg-${typeConfig.color}-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300`;

        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${typeConfig.icon}"></i>
                <span class="flex-1">${message}</span>
                <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('translate-x-full');
                setTimeout(() => {
                    if (toast.parentElement) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);

        return toast;
    }

    // Shorthand toast methods
    static showSuccessToast(message, duration) {
        return this.showToast(message, 'success', duration);
    }

    static showErrorToast(message, duration) {
        return this.showToast(message, 'error', duration);
    }

    static showWarningToast(message, duration) {
        return this.showToast(message, 'warning', duration);
    }

    static showInfoToast(message, duration) {
        return this.showToast(message, 'info', duration);
    }

    // Generate random ID
    static generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Validate email
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate Indonesian phone number
    static isValidPhone(phone) {
        const re = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    // Generate chart colors
    static generateChartColors(count) {
        const baseColors = [
            '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
            '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
        ];

        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    }

    // Create loading spinner
    static createLoadingSpinner(size = 'md') {
        const sizes = {
            sm: 'h-4 w-4',
            md: 'h-6 w-6',
            lg: 'h-8 w-8'
        };

        const spinner = document.createElement('div');
        spinner.className = `animate-spin rounded-full ${sizes[size]} border-b-2 border-primary`;
        return spinner;
    }

    // Modal helper
    static createModal(title, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

        const maxWidth = options.maxWidth || 'max-w-md';
        const showCloseButton = options.showCloseButton !== false;

        modal.innerHTML = `
            <div class="bg-white rounded-2xl ${maxWidth} w-full mx-4 max-h-screen overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold text-gray-900">${title}</h2>
                        ${showCloseButton ? '<button class="text-gray-400 hover:text-gray-600 modal-close"><i class="fas fa-times"></i></button>' : ''}
                    </div>
                    <div class="modal-content">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        // Close modal handlers
        if (showCloseButton) {
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
        return modal;
    }

    // Error logging
    static logError(error, context = '') {
        const errorData = {
            message: error.message,
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error('Dashboard Error:', errorData);

        // In production, send to error tracking service
        if (DashboardConfig?.debug) {
            console.table(errorData);
        }
    }

    // Performance monitoring
    static measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();

        console.log(`Performance: ${name} took ${(end - start).toFixed(2)} milliseconds`);
        return result;
    }

    // Event emitter
    static createEventEmitter() {
        const events = {};

        return {
            on(event, callback) {
                if (!events[event]) {
                    events[event] = [];
                }
                events[event].push(callback);
            },

            off(event, callback) {
                if (events[event]) {
                    events[event] = events[event].filter(cb => cb !== callback);
                }
            },

            emit(event, data) {
                if (events[event]) {
                    events[event].forEach(callback => callback(data));
                }
            }
        };
    }

    // Copy to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccessToast('Berhasil disalin ke clipboard');
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showErrorToast('Gagal menyalin ke clipboard');
            return false;
        }
    }

    // Download file
    static downloadFile(data, filename, type = 'application/json') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Device detection
    static getDeviceInfo() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android.*?(?!.*Mobile)/i.test(navigator.userAgent);
        const isDesktop = !isMobile && !isTablet;

        return {
            isMobile,
            isTablet,
            isDesktop,
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardUtils;
} else {
    window.DashboardUtils = DashboardUtils;
}