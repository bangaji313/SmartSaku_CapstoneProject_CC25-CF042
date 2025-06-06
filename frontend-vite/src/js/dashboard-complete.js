/**
 * dashboard-complete.js
 * File ini menangani semua fitur dan fungsi UI dashboard SmartSaku
 */

import { setupResponsiveCharts } from './dashboard-module.js';

/**
 * Mengatur semua fungsionalitas dashboard
 */
export function setupDashboardComplete() {
    console.log('Setting up dashboard complete functionality...');

    // Setup charts
    setupAllCharts();

    // Setup toggle functionality untuk AI chat
    setupAIChat();

    // Setup modal windows
    setupModals();

    // Setup dashboard tabs
    setupTabNavigation();

    // Setup gamification features
    setupGamification();
}

/**
 * Mengatur semua charts di dashboard
 */
function setupAllCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Setup Cash Flow Chart
    setupCashFlowChart();

    // Setup Category Chart
    setupCategoryChart();    // Setup charts untuk laporan
    if (document.getElementById('trendChart')) {
        setupTrendChart();
    }

    if (document.getElementById('distributionChart')) {
        setupDistributionChart();
    }

    // Setup responsive charts
    setupResponsiveCharts();

    // Setup charts untuk simulasi
    if (document.getElementById('weeklyTrendChart')) {
        setupWeeklyTrendChart();
    }

    if (document.getElementById('savingsChart')) {
        setupSavingsChart();
    }

    if (document.getElementById('goalChart')) {
        setupGoalChart();
    }

    // Setup charts untuk profil
    if (document.getElementById('lifestyleChart')) {
        setupLifestyleChart();
    }

    if (document.getElementById('comparisonChart')) {
        setupComparisonChart();
    }
}

/**
 * Setup untuk chart arus kas
 */
function setupCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart');

    if (!ctx) return;

    // Data dummy untuk chart
    const data = {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'],
        datasets: [
            {
                label: 'Pemasukan',
                data: [1200000, 1150000, 1300000, 1250000, 1400000, 1250000],
                borderColor: '#08daff',
                backgroundColor: 'rgba(8, 218, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Pengeluaran',
                data: [950000, 850000, 1000000, 850000, 950000, 850000],
                borderColor: '#ff4c6a',
                backgroundColor: 'rgba(255, 76, 106, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // Opsi chart
    const options = {
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
                            label += new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(context.parsed.y);
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
                        if (value >= 1000000) {
                            return 'Rp' + value / 1000000 + ' Jt';
                        } else if (value >= 1000) {
                            return 'Rp' + value / 1000 + ' Rb';
                        }
                        return 'Rp' + value;
                    }
                }
            }
        }
    };

    // Buat chart
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Setup untuk chart kategori pengeluaran
 */
function setupCategoryChart() {
    const ctx = document.getElementById('categoryChart');

    if (!ctx) return;

    // Data dummy untuk chart
    const data = {
        labels: ['Makanan', 'Transport', 'Pendidikan', 'Lainnya'],
        datasets: [
            {
                data: [280000, 200000, 160000, 160000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Opsi chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        cutout: '70%'
    };

    // Buat chart
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

/**
 * Setup untuk trend chart
 */
function setupTrendChart() {
    const ctx = document.getElementById('trendChart');

    if (!ctx) return;

    const data = {
        labels: ['April', 'Mei', 'Juni'],
        datasets: [
            {
                label: 'Pemasukan',
                data: [2100000, 2250000, 2300000],
                borderColor: '#08daff',
                backgroundColor: 'rgba(8, 218, 255, 0.1)',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Pengeluaran',
                data: [850000, 900000, 850000],
                borderColor: '#ff4c6a',
                backgroundColor: 'rgba(255, 76, 106, 0.1)',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Tabungan',
                data: [250000, 300000, 350000],
                borderColor: '#34c759',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                fill: false,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        if (value >= 1000000) {
                            return 'Rp' + value / 1000000 + ' Jt';
                        } else if (value >= 1000) {
                            return 'Rp' + value / 1000 + ' Rb';
                        }
                        return 'Rp' + value;
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Setup untuk distribution chart
 */
function setupDistributionChart() {
    const ctx = document.getElementById('distributionChart');

    if (!ctx) return;

    const data = {
        labels: ['Makanan', 'Transport', 'Pendidikan', 'Hiburan', 'Lainnya'],
        datasets: [
            {
                label: 'Distribusi Pengeluaran',
                data: [280000, 200000, 160000, 110000, 100000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

/**
 * Setup untuk weekly trend chart
 */
function setupWeeklyTrendChart() {
    const ctx = document.getElementById('weeklyTrendChart');

    if (!ctx) return;

    const data = {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [
            {
                label: 'Pengeluaran Aktual',
                data: [220000, 185000, 275000, 170000],
                borderColor: '#ff4c6a',
                backgroundColor: 'rgba(255, 76, 106, 0.1)',
                fill: false
            },
            {
                label: 'Prediksi',
                data: [220000, 185000, 275000, 250000],
                borderColor: '#a3a3a3',
                backgroundColor: 'rgba(163, 163, 163, 0.1)',
                borderDash: [5, 5],
                fill: false
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Setup untuk savings chart
 */
function setupSavingsChart() {
    const ctx = document.getElementById('savingsChart');

    if (!ctx) return;

    const months = [];
    for (let i = 1; i <= 24; i++) {
        months.push('Bulan ' + i);
    }

    // Simulasi data tabungan bulanan dengan bunga
    const savings = [];
    let total = 0;
    for (let i = 0; i < 24; i++) {
        if (i % 12 === 0 && i > 0) {
            // Add yearly interest
            total = total * 1.03;
        }
        total += 400000;
        savings.push(total);
    }

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Total Tabungan',
                data: savings,
                borderColor: '#08daff',
                backgroundColor: 'rgba(8, 218, 255, 0.1)',
                fill: true
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return 'Rp ' + (value / 1000000).toFixed(1) + ' Jt';
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Setup untuk goal chart
 */
function setupGoalChart() {
    const ctx = document.getElementById('goalChart');

    if (!ctx) return;

    const months = [];
    for (let i = 1; i <= 16; i++) {
        months.push('Bulan ' + i);
    }

    // Simulasi tabungan target
    const savings = [];
    let total = 2000000; // Initial
    for (let i = 0; i < 16; i++) {
        total += 500000;
        savings.push(total);
    }

    const goalAmount = Array(16).fill(10000000);

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Tabungan',
                data: savings,
                borderColor: '#08daff',
                backgroundColor: 'rgba(8, 218, 255, 0.1)',
                fill: true
            },
            {
                label: 'Target',
                data: goalAmount,
                borderColor: '#ff4c6a',
                backgroundColor: 'rgba(255, 76, 106, 0)',
                borderDash: [5, 5],
                fill: false
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 12000000,
                ticks: {
                    callback: function (value) {
                        return 'Rp ' + (value / 1000000).toFixed(0) + ' Jt';
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Setup untuk lifestyle chart
 */
function setupLifestyleChart() {
    const ctx = document.getElementById('lifestyleChart');

    if (!ctx) return;

    const data = {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [
            {
                label: 'Makanan',
                data: [25000, 35000, 27000, 40000, 60000, 45000, 38000],
                borderColor: '#ff4c6a',
                backgroundColor: 'rgba(255, 76, 106, 0.1)',
                fill: false
            },
            {
                label: 'Transport',
                data: [15000, 18000, 12000, 15000, 20000, 5000, 8000],
                borderColor: '#08daff',
                backgroundColor: 'rgba(8, 218, 255, 0.1)',
                fill: false
            },
            {
                label: 'Hiburan',
                data: [0, 0, 15000, 0, 30000, 70000, 45000],
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: false
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Setup untuk comparison chart
 */
function setupComparisonChart() {
    const ctx = document.getElementById('comparisonChart');

    if (!ctx) return;

    const data = {
        labels: ['Makanan', 'Transport', 'Pendidikan', 'Hiburan', 'Tabungan'],
        datasets: [
            {
                label: 'Anda',
                data: [35, 12, 20, 13, 20],
                backgroundColor: 'rgba(8, 218, 255, 0.6)'
            },
            {
                label: 'Rata-rata Mahasiswa',
                data: [42, 15, 18, 20, 5],
                backgroundColor: 'rgba(151, 151, 151, 0.6)'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 50,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

/**
 * Setup untuk AI Chat
 */
function setupAIChat() {
    const chatToggleBtn = document.getElementById('chatToggle');
    const chatCloseBtn = document.getElementById('chatClose');
    const chatWindow = document.getElementById('chatWindow');

    if (!chatToggleBtn || !chatWindow) return;

    // Toggle chat window
    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    // Close chat window
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }

    // Send message functionality
    const chatInput = document.querySelector('.chat-input');
    const chatSendBtn = document.querySelector('.chat-send');

    if (chatInput && chatSendBtn) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message === '') return;

            // Add user message
            const chatContainer = document.querySelector('#chatWindow .p-4');
            const userMessageEl = document.createElement('div');
            userMessageEl.className = 'bg-primary/10 rounded-lg p-3 ml-8 chat-message';
            userMessageEl.innerHTML = `<p class="text-sm">${message}</p>`;
            chatContainer.appendChild(userMessageEl);

            // Reset input
            chatInput.value = '';

            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Simulate AI response (without backend)
            setTimeout(() => {
                const botMessageEl = document.createElement('div');
                botMessageEl.className = 'bg-gray-100 rounded-lg p-3 chat-message';

                // Sample responses based on keywords
                let response = 'Maaf, saya tidak mengerti pertanyaan tersebut. Coba tanyakan tentang tips finansial atau pengelolaan keuangan.';

                if (message.toLowerCase().includes('hemat') || message.toLowerCase().includes('tabung')) {
                    response = 'Berikut tips hemat yang efektif:<br>• Gunakan aturan 50/30/20<br>• Catat semua pengeluaran<br>• Belanja dengan daftar belanjaan<br>• Hindari pembelian impulsif';
                } else if (message.toLowerCase().includes('investasi')) {
                    response = 'Untuk investasi pemula, Anda bisa memulai dengan:<br>• Reksa Dana<br>• Obligasi Pemerintah<br>• Deposito<br>• Emas<br>Pilih sesuai profil risiko Anda.';
                } else if (message.toLowerCase().includes('cicilan') || message.toLowerCase().includes('utang')) {
                    response = 'Tips mengelola cicilan:<br>• Prioritaskan utang dengan bunga tertinggi<br>• Buat jadwal pembayaran<br>• Hindari menambah utang baru<br>• Negosiasi cicilan jika memungkinkan';
                } else if (message.toLowerCase().includes('puasa') || message.toLowerCase().includes('ramadan')) {
                    response = 'Tips hemat saat bulan puasa:<br>• Buat menu buka dan sahur sendiri<br>• Batasi takjil di luar<br>• Belanja bahan makanan mingguan<br>• Hindari belanja online impulsif saat begadang';
                }

                botMessageEl.innerHTML = `<p class="text-sm">${response}</p>`;
                chatContainer.appendChild(botMessageEl);

                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 1000);
        };

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

/**
 * Setup untuk modal windows
 */
function setupModals() {
    // Profile Modal - tombol di welcome section dan sidebar
    setupModalToggle('profileBtn', 'profileModal', 'closeProfileModal');
    setupModalToggle('sidebarProfileBtn', 'profileModal', 'closeProfileModal');

    // Report Modal - tombol di welcome section dan sidebar
    setupModalToggle('reportBtn', 'reportModal', 'closeReportModal');
    setupModalToggle('sidebarReportBtn', 'reportModal', 'closeReportModal');

    // Simulation Modal - tombol di welcome section dan sidebar
    setupModalToggle('simulationBtn', 'simulationModal', 'closeSimulationModal');
    setupModalToggle('sidebarSimulationBtn', 'simulationModal', 'closeSimulationModal');

    // Add Goal Modal (jika ada)
    setupModalToggle('addGoalBtn', 'addGoalModal', 'closeAddGoalModal');
}

/**
 * Helper untuk setup modal toggle
 */
function setupModalToggle(openBtnId, modalId, closeBtnId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);

    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

/**
 * Setup untuk tab navigation
 */
function setupTabNavigation() {
    // Profile tabs
    setupTabSwitching('profile-tab-btn', 'profile-tab-content', 'tab-');

    // Simulation tabs
    setupTabSwitching('simulation-tab-btn', 'simulation-tab-content', 'tab-');

    // Report tabs
    setupTabSwitching('report-tab-btn', 'report-tab-content', 'tab-');
}

/**
 * Helper untuk tab switching
 */
function setupTabSwitching(tabBtnClass, tabContentClass, tabIdPrefix) {
    const tabButtons = document.querySelectorAll('.' + tabBtnClass);
    const tabContents = document.querySelectorAll('.' + tabContentClass);

    if (tabButtons.length === 0 || tabContents.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary');
                btn.classList.add('border-transparent', 'text-gray-500');
            });

            // Add active state to clicked button
            button.classList.remove('border-transparent', 'text-gray-500');
            button.classList.add('border-primary', 'text-primary');

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabIdPrefix + tabId).classList.remove('hidden');
        });
    });
}

/**
 * Setup untuk gamification features
 */
function setupGamification() {
    // Setup progress animations (if any)
    const progressBars = document.querySelectorAll('.progress-bar');

    if (progressBars.length > 0) {
        progressBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent') || 0;
            const progressInner = bar.querySelector('.progress-inner');

            if (progressInner) {
                progressInner.style.width = `${percent}%`;
            }
        });
    }

    // Setup achievement badges click handlers (if any)
    const badges = document.querySelectorAll('.achievement-badge');

    if (badges.length > 0) {
        badges.forEach(badge => {
            badge.addEventListener('click', () => {
                alert('Badge: ' + badge.getAttribute('data-title') + '\n' + badge.getAttribute('data-description'));
            });
        });
    }
}