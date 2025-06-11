/**
 * dashboard-module.js
 * Modul untuk mengelola fitur dashboard SmartSaku
 * Ini hanya UI tanpa implementasi backend
 */

// Setup untuk chart arus kas
export function setupCashFlowChart() {
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
    };    // Opsi chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: window.innerWidth < 768 ? 'bottom' : 'top',
                labels: {
                    boxWidth: window.innerWidth < 768 ? 12 : 40,
                    font: {
                        size: window.innerWidth < 768 ? 10 : 12
                    }
                }
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
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    } else {
        console.error('Chart.js tidak ditemukan!');
        // Fallback jika Chart.js tidak tersedia
        ctx.parentElement.innerHTML = `
      <div class="flex items-center justify-center h-80 bg-gray-100 rounded-lg">
        <p class="text-gray-500">Grafik tidak tersedia. Harap load Chart.js.</p>
      </div>
    `;
    }
}

// Setup untuk chart kategori
export function setupCategoryChart() {
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
    };    // Opsi chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: window.innerWidth < 480 ? 8 : 12,
                    font: {
                        size: window.innerWidth < 480 ? 9 : 11
                    },
                    padding: window.innerWidth < 480 ? 8 : 15
                },
                display: window.innerWidth > 350 // Hide legend on very small screens
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
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    } else {
        console.error('Chart.js tidak ditemukan!');
        // Fallback jika Chart.js tidak tersedia
        ctx.parentElement.innerHTML = `
      <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p class="text-gray-500">Grafik tidak tersedia. Harap load Chart.js.</p>
      </div>
    `;
    }
}

// Setup untuk AI chat
export function setupAIChat() {
    const chatToggleBtn = document.getElementById('chatToggle');
    const chatCloseBtn = document.getElementById('chatClose');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.querySelector('.chat-input');
    const chatSendBtn = document.querySelector('.chat-send');

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

    // Send message
    if (chatInput && chatSendBtn) {
        // Fungsi untuk mengirim pesan
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message === '') return;

            // Tambahkan pesan user
            const chatContainer = document.querySelector('#chatWindow .p-4');
            const userMessageEl = document.createElement('div');
            userMessageEl.className = 'bg-primary/10 rounded-lg p-3 ml-8';
            userMessageEl.innerHTML = `<p class="text-sm">${message}</p>`;
            chatContainer.appendChild(userMessageEl);

            // Reset input
            chatInput.value = '';

            // Scroll ke bawah
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Simulasi respon dari AI (tanpa backend)
            setTimeout(() => {
                const botMessageEl = document.createElement('div');
                botMessageEl.className = 'bg-gray-100 rounded-lg p-3';

                // Respon dummy berdasarkan kata kunci
                let response = 'Maaf, saya tidak mengerti pertanyaan tersebut. Coba tanyakan tentang tips finansial atau pengelolaan keuangan.';

                if (message.toLowerCase().includes('hemat') || message.toLowerCase().includes('tabung')) {
                    response = 'Berikut tips hemat yang efektif:<br>• Gunakan aturan 50/30/20<br>• Catat semua pengeluaran<br>• Belanja dengan daftar belanjaan<br>• Hindari pembelian impulsif';
                } else if (message.toLowerCase().includes('investasi')) {
                    response = 'Untuk investasi pemula, Anda bisa memulai dengan:<br>• Reksa Dana<br>• Obligasi Pemerintah<br>• Deposito<br>• Emas<br>Pilih sesuai profil risiko Anda.';
                } else if (message.toLowerCase().includes('cicilan') || message.toLowerCase().includes('utang')) {
                    response = 'Tips mengelola cicilan:<br>• Prioritaskan utang dengan bunga tertinggi<br>• Buat jadwal pembayaran<br>• Hindari menambah utang baru<br>• Negosiasi cicilan jika memungkinkan';
                }

                botMessageEl.innerHTML = `<p class="text-sm">${response}</p>`;
                chatContainer.appendChild(botMessageEl);

                // Scroll ke bawah
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 1000);
        };

        // Event listener untuk kirim pesan
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

// Setup untuk menangani responsif chart
export function setupResponsiveCharts() {
    let cashFlowChart = null;
    let categoryChart = null;

    // Fungsi untuk mendapatkan instance chart
    function getChartInstances() {
        const cashFlowCanvas = document.getElementById('cashFlowChart');
        const categoryCanvas = document.getElementById('categoryChart');

        if (cashFlowCanvas) {
            cashFlowChart = Chart.getChart(cashFlowCanvas);
        }

        if (categoryCanvas) {
            categoryChart = Chart.getChart(categoryCanvas);
        }
    }

    // Fungsi untuk memperbarui opsi chart berdasarkan ukuran layar
    function updateChartOptions() {
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 480;

        setTimeout(() => {
            getChartInstances();

            if (cashFlowChart) {
                cashFlowChart.options.plugins.legend.position = isMobile ? 'bottom' : 'top';
                cashFlowChart.options.plugins.legend.labels.boxWidth = isMobile ? 12 : 40;
                cashFlowChart.options.plugins.legend.labels.font = {
                    size: isMobile ? 10 : 12
                };
                cashFlowChart.update();
            }

            if (categoryChart) {
                categoryChart.options.plugins.legend.labels.boxWidth = isSmallMobile ? 8 : 12;
                categoryChart.options.plugins.legend.labels.font = {
                    size: isSmallMobile ? 9 : 11
                };
                categoryChart.options.plugins.legend.labels.padding = isSmallMobile ? 8 : 15;
                categoryChart.options.plugins.legend.display = window.innerWidth > 350;
                categoryChart.update();
            }
        }, 500); // Delay to ensure charts are initialized
    }

    // Menambahkan event listener untuk resize
    window.addEventListener('resize', updateChartOptions);

    // Initial call to set correct options
    updateChartOptions();
}

// Setup dashboard secara keseluruhan
export function setupDashboard() {
    console.log('Setting up dashboard...');

    // Pastikan Font Awesome tersedia
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
        console.log('Font Awesome ditambahkan');
    }    // Pastikan Chart.js tersedia
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            console.log('Chart.js loaded');
            setupCashFlowChart();
            setupCategoryChart();
            setupResponsiveCharts(); // Inisialisasi responsif charts
        };
        document.head.appendChild(script);
        console.log('Chart.js ditambahkan');
    } else {
        setupCashFlowChart();
        setupCategoryChart();
    }

    // Setup AI chat
    setupAIChat();
}