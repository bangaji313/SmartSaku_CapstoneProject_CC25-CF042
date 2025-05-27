// Dashboard Charts Module
class DashboardCharts {
    constructor() {
        this.initCharts();
    }

    initCharts() {
        this.initCashFlowChart();
        this.initCategoryChart();
    } initCashFlowChart() {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                datasets: [{
                    label: 'Pemasukan',
                    data: [1500000, 1800000, 2200000, 2000000, 2500000, 2800000],
                    borderColor: '#08daff',
                    backgroundColor: 'rgba(8, 218, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#08daff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#08daff',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }, {
                    label: 'Pengeluaran',
                    data: [1200000, 1500000, 1800000, 1600000, 1900000, 2100000],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#ef4444',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }, {
                    label: 'Tabungan',
                    data: [300000, 300000, 400000, 400000, 600000, 700000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#10b981',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 14,
                                weight: '600'
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#374151',
                        bodyColor: '#374151',
                        borderColor: '#08daff',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        displayColors: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: function (context) {
                                return 'Bulan ' + context[0].label;
                            },
                            label: function (context) {
                                return context.dataset.label + ': Rp ' + context.parsed.y.toLocaleString('id-ID');
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            callback: function (value) {
                                return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }
        });
    }

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Makanan', 'Transport', 'Pendidikan', 'Lainnya'],
                datasets: [{
                    data: [280000, 200000, 160000, 160000],
                    backgroundColor: [
                        '#ef4444',
                        '#3b82f6',
                        '#10b981',
                        '#8b5cf6'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    cutout: '70%',
                    hoverOffset: 8,
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#374151',
                        bodyColor: '#374151',
                        borderColor: '#08daff',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            title: function (context) {
                                return context[0].label;
                            },
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(0);
                                return `${label}: Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderRadius: 4
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    updateChartData(chartId, newData) {
        const chart = Chart.getChart(chartId);
        if (chart) {
            chart.data.datasets[0].data = newData;
            chart.update('active');
        }
    }

    // Add method to update cash flow chart with animation
    updateCashFlowChart(newData) {
        const chart = Chart.getChart('cashFlowChart');
        if (chart && newData) {
            if (newData.pemasukan) {
                chart.data.datasets[0].data = newData.pemasukan;
            }
            if (newData.pengeluaran) {
                chart.data.datasets[1].data = newData.pengeluaran;
            }
            if (newData.tabungan) {
                chart.data.datasets[2].data = newData.tabungan;
            }
            chart.update('active');
        }
    }

    // Add method to update category chart with animation
    updateCategoryChart(newData) {
        const chart = Chart.getChart('categoryChart');
        if (chart && newData) {
            chart.data.datasets[0].data = newData;
            chart.update('active');
        }
    }

    // Method to refresh all charts
    refreshAllCharts() {
        const cashFlowChart = Chart.getChart('cashFlowChart');
        const categoryChart = Chart.getChart('categoryChart');

        if (cashFlowChart) {
            cashFlowChart.update('active');
        }
        if (categoryChart) {
            categoryChart.update('active');
        }
    }

    // Method to destroy charts (for cleanup)
    destroyCharts() {
        const cashFlowChart = Chart.getChart('cashFlowChart');
        const categoryChart = Chart.getChart('categoryChart');

        if (cashFlowChart) {
            cashFlowChart.destroy();
        }
        if (categoryChart) {
            categoryChart.destroy();
        }
    }
}

// Export for use in other modules
window.DashboardCharts = DashboardCharts;