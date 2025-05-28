/**
 * dashboard-charts.js
 * Modul yang berisi konfigurasi dan inisialisasi Chart.js untuk dashboard
 */

let cashFlowChart;
let categoryChart;

// Inisialisasi chart arus kas
export function initCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart');

    if (!ctx) return;

    cashFlowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [
                {
                    label: 'Pemasukan',
                    data: [1200000, 950000, 1350000, 1100000, 1400000, 1250000],
                    backgroundColor: 'rgba(8, 218, 255, 0.5)',
                    borderColor: 'rgba(8, 218, 255, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    barPercentage: 0.5,
                },
                {
                    label: 'Pengeluaran',
                    data: [800000, 850000, 900000, 950000, 850000, 900000],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    barPercentage: 0.5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return formatCurrency(value, 0);
                        }
                    }
                }
            }
        },
    });
}

// Inisialisasi chart kategori pengeluaran
export function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');

    if (!ctx) return;

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Makanan', 'Transport', 'Pendidikan', 'Lainnya'],
            datasets: [
                {
                    data: [280000, 200000, 160000, 160000],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                    borderRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.raw);
                            const percentage = Math.round((context.raw / 800000) * 100) + '%';
                            return `${label}: ${value} (${percentage})`;
                        }
                    }
                }
            },
        },
    });
}

// Format angka menjadi currency format
function formatCurrency(value, minimumFractionDigits = 0) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: minimumFractionDigits
    }).format(value);
}

// Ekspor fungsi untuk pembaruan chart
export function updateCashFlowChart(data) {
    if (!cashFlowChart) return;

    cashFlowChart.data.datasets[0].data = data.income;
    cashFlowChart.data.datasets[1].data = data.expense;
    cashFlowChart.update();
}

export function updateCategoryChart(data) {
    if (!categoryChart) return;

    categoryChart.data.labels = data.labels;
    categoryChart.data.datasets[0].data = data.values;
    categoryChart.data.datasets[0].backgroundColor = data.colors.background;
    categoryChart.data.datasets[0].borderColor = data.colors.border;
    categoryChart.update();
}