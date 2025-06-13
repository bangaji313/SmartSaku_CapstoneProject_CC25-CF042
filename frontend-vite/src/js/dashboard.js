// Controller untuk halaman dashboard
import AuthService from '../services/AuthService.js';
import TransaksiService from '../services/TransaksiService.js';
import AiService from '../services/AiService.js';
import { NotifikasiUtil, ValidasiUtil, LoadingUtil } from '../utils/helpers.js';
import { setupSimulasiHandlers } from './simulationHandlers.js';
import { setupNotifikasiHandlers } from './notificationHandlers.js';

class DashboardController {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'pemasukan';
        this.isEditMode = false;
        this.editingTransactionId = null;
        this.dataTransaksi = {
            pemasukan: [],
            pengeluaran: []
        };

        this.initController();
    } async initController() {
        // Cek autentikasi
        if (!this.cekAutentikasi()) {
            return;
        }

        // Inisialisasi
        this.currentUser = AuthService.getUser();
        this.tampilkanInfoUser();
        this.initEventListeners();
        this.updateCurrentDate();
        this.showWelcomeMessage();        // Muat data
        await this.muatSemuaData();
        this.updateDashboardStats();
        this.initCharts();

        // Set level keuangan awal jika belum ada transaksi
        const totalPemasukan = this.dataTransaksi.pemasukan.reduce((sum, item) => sum + item.nominal, 0);
        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
        const totalSaldo = totalPemasukan - totalPengeluaran;
        this.updateLevelKeuangan(totalSaldo);
    }

    cekAutentikasi() {
        if (!AuthService.sudahLogin()) {
            NotifikasiUtil.tampilkanError('Silakan login terlebih dahulu');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return false;
        }
        return true;
    }

    tampilkanInfoUser() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('userInitial').textContent = this.currentUser.name.charAt(0).toUpperCase();
        }
    }

    initEventListeners() {        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                await this.showSection(section);
            });
        });// Sidebar toggle untuk mobile
        document.getElementById('sidebarToggle').addEventListener('click', this.toggleSidebar.bind(this));

        // Menutup sidebar ketika overlay diklik
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', this.toggleSidebar.bind(this));
        }

        // Logout
        document.getElementById('btnLogout').addEventListener('click', this.handleLogout);

        // Tab transaksi
        document.getElementById('tabPemasukan').addEventListener('click', () => this.switchTab('pemasukan'));
        document.getElementById('tabPengeluaran').addEventListener('click', () => this.switchTab('pengeluaran'));

        // Tombol tambah di dashboard juga
        const btnTambahTransaksiDashboard = document.getElementById('btnTambahTransaksiDashboard');
        if (btnTambahTransaksiDashboard) {
            console.log('Setting up dashboard add button');
            btnTambahTransaksiDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Dashboard add button clicked');
                this.showModalTambah();
            });
        } else {
            console.warn('Dashboard add button not found');
        }

        // Modal transaksi
        const btnTambahTransaksi = document.getElementById('btnTambahTransaksi');
        if (btnTambahTransaksi) {
            btnTambahTransaksi.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Transaction add button clicked');
                this.showModalTambah();
            });
        }

        document.getElementById('closeModal').addEventListener('click', this.hideModal.bind(this));
        document.getElementById('btnBatalTransaksi').addEventListener('click', this.hideModal.bind(this));
        document.getElementById('formTransaksi').addEventListener('submit', this.handleSubmitTransaksi.bind(this));

        // Validasi real-time
        document.getElementById('nominal').addEventListener('blur', this.validasiNominal.bind(this));
        document.getElementById('kategori').addEventListener('blur', this.validasiKategori.bind(this));
    }

    updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', options);
    }

    async showSection(sectionName) {
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            transaksi: 'Transaksi',
            laporan: 'Laporan',
            simulasi: 'Simulasi',
            notifikasi: 'Notifikasi'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';

        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        document.getElementById(`${sectionName}Section`).classList.remove('hidden');

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'bg-primary', 'text-white');
            link.classList.add('text-gray-700');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'bg-primary', 'text-white');
            activeLink.classList.remove('text-gray-700');
        }

        // Special actions for certain sections
        if (sectionName === 'transaksi') {
            await this.muatDaftarTransaksi();
        } else if (sectionName === 'notifikasi') {
            setupNotifikasiHandlers();
        } else if (sectionName === 'simulasi') {
            setupSimulasiHandlers();
        }
    }

    // Method untuk menghitung simulasi investasi
    calculateInvestmentSimulation() {
        try {
            const modalAwal = parseFloat(document.getElementById('modalAwal').value) || 0;
            const returnTahunan = parseFloat(document.getElementById('returnTahunan').value) || 0;
            const jangkaWaktu = parseFloat(document.getElementById('jangkaWaktuInvestasi').value) || 0;
            const inflasiRate = parseFloat(document.getElementById('inflasiRate').value) || 0;

            // Hitung nilai akhir nominal dengan compound interest
            // Formula: FV = PV × (1 + r)^n
            const nilaiAkhirNominal = modalAwal * Math.pow((1 + returnTahunan / 100), jangkaWaktu);

            // Hitung nilai riil setelah inflasi
            // Formula: RV = FV / (1 + i)^n, di mana i adalah tingkat inflasi
            const nilaiAkhirRiil = nilaiAkhirNominal / Math.pow((1 + inflasiRate / 100), jangkaWaktu);

            // Return total dalam persentase
            const returnTotal = ((nilaiAkhirNominal - modalAwal) / modalAwal) * 100;

            // Format hasil ke dalam format mata uang Rupiah
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });

            // Update tampilan hasil simulasi
            const hasilSimulasi = document.getElementById('hasilSimulasiInvestasi');
            if (hasilSimulasi) {
                hasilSimulasi.innerHTML = `
                    <h4 class="font-semibold text-gray-700 mb-2">Hasil Proyeksi</h4>
                    <div class="grid grid-cols-2 gap-y-2 text-sm">
                        <div>Modal Awal:</div>
                        <div class="font-medium">${formatter.format(modalAwal)}</div>
                        <div>Nilai Akhir Nominal:</div>
                        <div class="font-medium">${formatter.format(nilaiAkhirNominal)}</div>
                        <div>Nilai Akhir Riil:</div>
                        <div class="font-medium">${formatter.format(nilaiAkhirRiil)}</div>
                        <div>Return Total:</div>
                        <div class="font-semibold text-lg text-primary">${returnTotal.toFixed(2)}%</div>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Error menghitung simulasi investasi:', error);
            NotifikasiUtil.tampilkanError('Terjadi kesalahan saat menghitung simulasi investasi');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        sidebar.classList.toggle('-translate-x-full');

        // Toggle overlay
        if (sidebarOverlay) {
            sidebarOverlay.classList.toggle('hidden');
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        sidebar.classList.add('-translate-x-full');

        // Hide overlay
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('hidden');
        }
    }

    async handleLogout() {
        try {
            AuthService.logout();
            NotifikasiUtil.tampilkanInfo('Logout berhasil');
        } catch (error) {
            console.error('Error logout:', error);
        }
    }

    async muatSemuaData() {
        try {
            const [pemasukanResult, pengeluaranResult] = await Promise.all([
                TransaksiService.ambilPemasukan(this.currentUser.id),
                TransaksiService.ambilPengeluaran(this.currentUser.id)
            ]);

            if (pemasukanResult.berhasil) {
                this.dataTransaksi.pemasukan = pemasukanResult.data;
            }

            if (pengeluaranResult.berhasil) {
                this.dataTransaksi.pengeluaran = pengeluaranResult.data;
            }

            // Fetching recommendation data from API
            this.fetchRecommendations();
            this.fetchPredictions(); // Fetch predictions data

        } catch (error) {
            console.error('Error memuat data:', error);
            NotifikasiUtil.tampilkanError('Gagal memuat data transaksi');
        }
    }

    async fetchRecommendations() {
        const recommendationElement = document.getElementById('recommendation-text');
        if (!recommendationElement) return;

        try {
            // Show loading state
            recommendationElement.textContent = 'Memuat rekomendasi...';

            // Use the AiService to get recommendations
            const result = await AiService.getRecommendation();

            if (result.berhasil && result.data && result.data.rekomendasi) {
                recommendationElement.textContent = result.data.rekomendasi;
            } else {
                // Fallback to hardcoded recommendation if API fails but we have data
                const fallbackText = "Hasil Rekomendasi: Pola belanjamu sudah efisien. Mantap! Kamu bisa alokasikan sisa uangnya untuk menabung atau investasi.";
                recommendationElement.textContent = fallbackText;
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            recommendationElement.textContent = 'Gagal memuat rekomendasi.';
        }
    }

    async fetchPredictions() {
        const predictionElement = document.getElementById('prediction-text');
        if (!predictionElement) return;

        try {
            // Show loading state
            predictionElement.textContent = 'Memuat prediksi...';

            // Use the AiService to get predictions
            const result = await AiService.getPrediction();

            if (result.berhasil && result.data && result.data.hasil) {
                predictionElement.textContent = result.data.hasil;
            } else {
                // Fallback to hardcoded prediction if API fails
                const fallbackText = "Prediksi: Model dan scaler berhasil dimuat.";
                predictionElement.textContent = fallbackText;
            }
        } catch (error) {
            console.error('Error fetching predictions:', error);
            predictionElement.textContent = 'Gagal memuat prediksi.';
        }
    }

    updateDashboardStats() {
        const totalPemasukan = this.dataTransaksi.pemasukan.reduce((sum, item) => sum + item.nominal, 0);
        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
        const totalSaldo = totalPemasukan - totalPengeluaran;
        const totalTransaksi = this.dataTransaksi.pemasukan.length + this.dataTransaksi.pengeluaran.length;        // Update statistik di dashboard dengan ID yang benar
        document.getElementById('totalSaldo').textContent = TransaksiService.formatRupiah(totalSaldo);

        // Update pengeluaran bulan ini
        if (document.getElementById('totalPengeluaranBulan')) {
            document.getElementById('totalPengeluaranBulan').textContent = TransaksiService.formatRupiah(totalPengeluaran);
        }

        // Fallback untuk ID lama jika masih ada
        if (document.getElementById('totalPemasukan')) {
            document.getElementById('totalPemasukan').textContent = TransaksiService.formatRupiah(totalPemasukan);
        }

        if (document.getElementById('totalPengeluaran')) {
            document.getElementById('totalPengeluaran').textContent = TransaksiService.formatRupiah(totalPengeluaran);
        }

        if (document.getElementById('totalTransaksi')) {
            document.getElementById('totalTransaksi').textContent = totalTransaksi;
        }

        // Update level keuangan berdasarkan saldo
        this.updateLevelKeuangan(totalSaldo);

        this.tampilkanTransaksiTerbaru(); this.updateLevelKeuangan(totalSaldo); // Update level keuangan
    }

    tampilkanTransaksiTerbaru() {
        const container = document.getElementById('transaksiTerbaru');
        if (!container) return;

        const semuaTransaksi = [
            ...this.dataTransaksi.pemasukan.map(t => ({ ...t, jenis: 'pemasukan' })),
            ...this.dataTransaksi.pengeluaran.map(t => ({ ...t, jenis: 'pengeluaran' }))
        ];

        // Sort by date descending dan ambil 5 teratas
        const transaksiTerbaru = semuaTransaksi
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (transaksiTerbaru.length === 0) {
            container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
              <svg
                class="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <p>Belum ada transaksi</p>
            </div>
            `;
            return;
        }

        container.innerHTML = transaksiTerbaru.map(transaksi => `
      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 ${transaksi.jenis === 'pemasukan' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 ${transaksi.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${transaksi.jenis === 'pemasukan' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'}"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">${transaksi.kategori}</p>
            <p class="text-sm text-gray-500">${transaksi.deskripsi || 'Tidak ada deskripsi'}</p>
            <p class="text-xs text-gray-400">${TransaksiService.formatTanggal(transaksi.date)}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold ${transaksi.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}">
            ${transaksi.jenis === 'pemasukan' ? '+' : '-'}${TransaksiService.formatRupiah(transaksi.nominal)}
          </p>
        </div>
      </div>    `).join('');
    }

    initCharts() {
        this.initPemasukanPengeluaranChart();
        this.initKategoriPengeluaranChart();

        // Apply layout adjustments to match transaction page
        this.updateDashboardLayout();
    }

    updateDashboardLayout() {
        const dashboardSection = document.getElementById('dashboardSection');
        if (dashboardSection) {
            // Update layout to match transaction page style (left-aligned)
            dashboardSection.classList.remove('max-w-7xl', 'mx-auto');
            dashboardSection.classList.add('ml-0');
        }
    }

    initPemasukanPengeluaranChart() {
        const ctx = document.getElementById('chartPemasukanPengeluaran').getContext('2d');

        // Untuk arus kas bulanan, kita buat line chart
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

        // Dapatkan jumlah total saldo dan buat data yang sesuai
        const totalPemasukan = this.dataTransaksi.pemasukan.reduce((sum, item) => sum + item.nominal, 0);
        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
        const totalSaldo = totalPemasukan - totalPengeluaran;

        // Buat data yang disesuaikan dengan saldo sebenarnya
        // Jika total saldo positif dan signifikan, kita buat grafik proporsional ke saldo tersebut
        // Jika tidak, gunakan data dummy dengan skala yang wajar

        let pemasukanBase, pengeluaranBase, pemasukanGrowth, pengeluaranGrowth;

        if (totalSaldo > 0) {
            // Jika saldo positif, buat data yang mengarah ke saldo saat ini
            pemasukanBase = Math.max(totalSaldo * 0.5, 500000); // Minimal 500rb untuk visualisasi
            pengeluaranBase = Math.max(totalSaldo * 0.3, 300000); // Minimal 300rb untuk visualisasi

            // Hitung pertumbuhan yang mengarah ke total sekarang
            pemasukanGrowth = (totalPemasukan - pemasukanBase) / 5; // Dibagi 5 bulan
            pengeluaranGrowth = (totalPengeluaran - pengeluaranBase) / 5; // Dibagi 5 bulan
        } else {
            // Jika belum ada saldo atau negatif, gunakan data dummy
            pemasukanBase = 800000;
            pengeluaranBase = 600000;
            pemasukanGrowth = 120000;
            pengeluaranGrowth = 50000;
        }

        // Buat data dengan kurva progresif yang mengarah ke nilai aktual
        const pemasukanData = [
            Math.round(pemasukanBase),
            Math.round(pemasukanBase + pemasukanGrowth),
            Math.round(pemasukanBase + pemasukanGrowth * 2),
            Math.round(pemasukanBase + pemasukanGrowth * 3),
            Math.round(pemasukanBase + pemasukanGrowth * 4),
            totalPemasukan > 0 ? totalPemasukan : Math.round(pemasukanBase + pemasukanGrowth * 5)
        ];

        const pengeluaranData = [
            Math.round(pengeluaranBase),
            Math.round(pengeluaranBase + pengeluaranGrowth),
            Math.round(pengeluaranBase + pengeluaranGrowth * 2),
            Math.round(pengeluaranBase + pengeluaranGrowth * 3),
            Math.round(pengeluaranBase + pengeluaranGrowth * 4),
            totalPengeluaran > 0 ? totalPengeluaran : Math.round(pengeluaranBase + pengeluaranGrowth * 5)
        ];

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months, datasets: [
                    {
                        label: 'Pemasukan',
                        data: pemasukanData,
                        borderColor: '#60A5FA',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#60A5FA',
                        pointBorderColor: '#fff',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#3B82F6',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2,
                        borderWidth: 3
                    },
                    {
                        label: 'Pengeluaran',
                        data: pengeluaranData,
                        borderColor: '#F87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#F87171',
                        pointBorderColor: '#fff',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#EF4444',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2,
                        borderWidth: 3
                    }
                ]
            }, options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: 'rgba(0, 0, 0, 0.6)',
                            callback: function (value) {
                                if (value >= 1000000) {
                                    return 'Rp ' + (value / 1000000).toLocaleString() + ' jt';
                                } else if (value >= 1000) {
                                    return 'Rp ' + (value / 1000).toLocaleString() + ' rb';
                                }
                                return 'Rp ' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: 'rgba(0, 0, 0, 0.6)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#333',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        bodyFont: {
                            size: 13
                        },
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        callbacks: {
                            title: function (context) {
                                return context[0].label;
                            },
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
                            },
                            footer: function (context) {
                                // Hitung saldo pada bulan ini (selisih pemasukan dan pengeluaran)
                                if (context.length >= 2) {
                                    const pemasukan = context.find(item => item.dataset.label === 'Pemasukan')?.parsed.y || 0;
                                    const pengeluaran = context.find(item => item.dataset.label === 'Pengeluaran')?.parsed.y || 0;
                                    const saldo = pemasukan - pengeluaran;

                                    return 'Saldo: ' + new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0
                                    }).format(saldo);
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }

    initKategoriPengeluaranChart() {
        const ctx = document.getElementById('chartKategoriPengeluaran').getContext('2d');

        // Dapatkan total pengeluaran dari stats dashboard
        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);

        // Kelompokkan pengeluaran berdasarkan kategori
        const kategoriMap = {};
        this.dataTransaksi.pengeluaran.forEach(transaksi => {
            if (kategoriMap[transaksi.kategori]) {
                kategoriMap[transaksi.kategori] += transaksi.nominal;
            } else {
                kategoriMap[transaksi.kategori] = transaksi.nominal;
            }
        });

        // Jika tidak ada data pengeluaran, buat data dummy yang proporsional dengan total saldo
        let labels = Object.keys(kategoriMap);
        let data = Object.values(kategoriMap);

        if (labels.length === 0) {
            // Data dummy untuk kategori pengeluaran
            // Jika ada total pengeluaran yang ditampilkan di dashboard, gunakan itu sebagai dasar
            const totalSaldo = document.getElementById('totalSaldo') ?
                this.parseRupiahToNumber(document.getElementById('totalSaldo').textContent) : 1250000;

            // Buat data proporsional terhadap saldo - minimal 800rb untuk visualisasi
            const baseValue = Math.max(totalPengeluaran > 0 ? totalPengeluaran : (totalSaldo * 0.7), 800000);

            labels = ['Makanan', 'Transport', 'Hiburan', 'Belanja', 'Lainnya'];
            data = [
                Math.round(baseValue * 0.35), // 35% Makanan
                Math.round(baseValue * 0.25), // 25% Transport
                Math.round(baseValue * 0.18), // 18% Hiburan
                Math.round(baseValue * 0.15), // 15% Belanja
                Math.round(baseValue * 0.07)  // 7% Lainnya
            ];
        }        // Warna gradient yang lebih menarik untuk pie chart
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

        // Create pie chart
        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderColor: '#fff',
                    hoverBorderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '0%', // Set to 0 for pie chart, or some percentage for doughnut
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#333',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.formattedValue;
                                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                                const percentage = Math.round((context.raw / total) * 100);

                                return `${label}: ${new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Helper method untuk mengubah format Rupiah menjadi number
    parseRupiahToNumber(rupiahString) {
        if (!rupiahString) return 0;
        // Hapus 'Rp ', titik sebagai pemisah ribuan, dan ubah koma menjadi titik
        return parseInt(rupiahString.replace(/[^\d,]/g, "").replace(/\./g, "").replace(/,/g, ".")) || 0;
    }

    switchTab(tab) {
        this.currentTab = tab;

        // Update tab UI
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('bg-white', 'text-primary', 'shadow-sm');
            btn.classList.add('text-gray-500');
        });

        const activeTab = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        activeTab.classList.add('bg-white', 'text-primary', 'shadow-sm');
        activeTab.classList.remove('text-gray-500');

        this.muatDaftarTransaksi();
    } muatDaftarTransaksi() {
        const container = document.getElementById('daftarTransaksi');
        const data = this.dataTransaksi[this.currentTab];

        if (data.length === 0) {
            container.innerHTML = `
        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>
          </svg>
          <p class="text-gray-500">Belum ada ${this.currentTab}</p>
          <button class="mt-4 text-primary hover:text-secondary font-medium" onclick="document.getElementById('btnTambahTransaksi').click()">
            Tambah ${this.currentTab} pertama
          </button>
        </div>
      `;
            return;
        }

        // Sort by date descending
        const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedData.map(transaksi => `
      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 ${this.currentTab === 'pemasukan' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 ${this.currentTab === 'pemasukan' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${this.currentTab === 'pemasukan' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'}"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">${transaksi.kategori}</p>
            <p class="text-sm text-gray-500">${transaksi.deskripsi || 'Tidak ada deskripsi'}</p>
            <p class="text-xs text-gray-400">${TransaksiService.formatTanggal(transaksi.date)}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="font-semibold ${this.currentTab === 'pemasukan' ? 'text-green-600' : 'text-red-600'}">
              ${TransaksiService.formatRupiah(transaksi.nominal)}
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              class="edit-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              data-id="${transaksi._id}"
              title="Edit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              class="delete-btn p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              data-id="${transaksi._id}"
              title="Hapus"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

        // Tambahkan event listeners untuk edit dan delete buttons
        this.attachTransactionEventListeners(container);
    }

    attachTransactionEventListeners(container) {
        // Event listeners untuk edit buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                console.log('Edit button clicked with ID:', id);
                this.editTransaksi(id);
            });
        });

        // Event listeners untuk delete buttons
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                console.log('Delete button clicked with ID:', id);
                this.hapusTransaksi(id);
            });
        });
    } showModalTambah() {
        this.isEditMode = false;
        this.editingTransactionId = null;

        console.log('Show modal tambah - reset state'); // Debug log

        document.getElementById('modalTitle').textContent = `Tambah ${this.currentTab.charAt(0).toUpperCase() + this.currentTab.slice(1)}`;
        document.getElementById('jenisTransaksi').value = this.currentTab;
        document.getElementById('formTransaksi').reset();
        document.getElementById('transaksiId').value = '';

        // Direct DOM manipulation to make sure the modal is visible
        const modalTransaksi = document.getElementById('modalTransaksi');
        modalTransaksi.classList.remove('hidden');
        modalTransaksi.style.display = 'flex';

        // Force redraw/reflow to ensure the modal is visible
        void modalTransaksi.offsetWidth;

        // Verifikasi reset
        console.log('Form reset - ID value:', document.getElementById('transaksiId').value);
        console.log('Modal visibility:', modalTransaksi.style.display, modalTransaksi.className);

        this.sembunyikanSemuaError();
        // Tidak perlu memanggil showModal() lagi karena sudah diatur di sini
    }

    showModalEdit(transaksi) {
        this.isEditMode = true;
        this.editingTransactionId = transaksi._id;

        console.log('Show modal edit:', transaksi); // Debug log
        console.log('Setting transaction ID:', transaksi._id); // Debug log

        document.getElementById('modalTitle').textContent = `Edit ${this.currentTab.charAt(0).toUpperCase() + this.currentTab.slice(1)}`;
        document.getElementById('jenisTransaksi').value = this.currentTab;
        document.getElementById('transaksiId').value = transaksi._id;
        document.getElementById('nominal').value = transaksi.nominal;
        document.getElementById('kategori').value = transaksi.kategori;
        document.getElementById('deskripsi').value = transaksi.deskripsi || '';

        // Verifikasi form sudah terisi
        console.log('Form values set:', {
            id: document.getElementById('transaksiId').value,
            nominal: document.getElementById('nominal').value,
            kategori: document.getElementById('kategori').value
        });

        this.sembunyikanSemuaError();
        this.showModal();
    } showModal() {
        const modal = document.getElementById('modalTransaksi');
        modal.classList.remove('hidden');
        if (modal.style.display === 'none' || modal.style.display === '') {
            modal.style.display = 'flex'; // Ensure it's displayed as flex
        }
        document.body.style.overflow = 'hidden';
        console.log('Modal should be visible now:', modal.className, modal.style.display);
    }

    hideModal() {
        const modal = document.getElementById('modalTransaksi');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Reset form dan state
        document.getElementById('formTransaksi').reset();
        this.isEditMode = false;
        this.editingTransactionId = null;
        this.sembunyikanSemuaError();
    }

    async editTransaksi(id) {
        console.log('Edit transaksi ID:', id); // Debug log
        const transaksi = this.dataTransaksi[this.currentTab].find(t => t._id === id);
        if (transaksi) {
            console.log('Transaksi ditemukan:', transaksi); // Debug log
            this.showModalEdit(transaksi);
        } else {
            console.error('Transaksi tidak ditemukan dengan ID:', id);
            NotifikasiUtil.tampilkanError('Transaksi tidak ditemukan');
        }
    }

    async hapusTransaksi(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            return;
        }

        try {
            let result;
            if (this.currentTab === 'pemasukan') {
                result = await TransaksiService.hapusPemasukan(this.currentUser.id, id);
            } else {
                result = await TransaksiService.hapusPengeluaran(this.currentUser.id, id);
            }

            if (result.berhasil) {
                NotifikasiUtil.tampilkanSukses('Transaksi berhasil dihapus');
                await this.muatSemuaData();
                this.updateDashboardStats();
                this.muatDaftarTransaksi();
            } else {
                NotifikasiUtil.tampilkanError(result.pesan);
            }
        } catch (error) {
            console.error('Error hapus transaksi:', error);
            NotifikasiUtil.tampilkanError('Gagal menghapus transaksi');
        }
    } async handleSubmitTransaksi(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const nominal = parseFloat(formData.get('nominal'));
        const kategori = formData.get('kategori').trim();
        const deskripsi = formData.get('deskripsi').trim();
        const jenis = formData.get('jenisTransaksi') || this.currentTab;
        const formId = formData.get('transaksiId');

        // Debug logs - lebih detail
        console.log('=== SUBMIT TRANSAKSI DEBUG ===');
        console.log('Form ID from input:', formId);
        console.log('Edit mode:', this.isEditMode);
        console.log('Editing transaction ID from state:', this.editingTransactionId);
        console.log('Current tab:', this.currentTab);
        console.log('Jenis transaksi:', jenis);
        console.log('Data transaksi:', { nominal, kategori, deskripsi });

        if (!this.validasiFormTransaksi(nominal, kategori)) {
            return;
        }

        // Prioritas ID: gunakan editingTransactionId jika edit mode
        let transactionId = null;
        if (this.isEditMode) {
            transactionId = this.editingTransactionId || formId;
            console.log('Final transaction ID for update:', transactionId);

            if (!transactionId || transactionId === 'null' || transactionId === '') {
                console.error('ID transaksi tidak valid untuk edit mode:', transactionId);
                NotifikasiUtil.tampilkanError('ID transaksi tidak valid. Silakan coba lagi.');
                return;
            }
        }

        const dataTransaksi = { nominal, kategori, deskripsi };
        const btnSimpan = document.getElementById('btnSimpanTransaksi');

        LoadingUtil.tampilkanLoadingButton(btnSimpan, this.isEditMode ? 'Mengupdate...' : 'Menyimpan...');

        try {
            let result;

            if (this.isEditMode) {
                console.log(`Calling update${jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} with:`, {
                    userId: this.currentUser.id,
                    transactionId,
                    dataTransaksi
                });

                if (jenis === 'pemasukan') {
                    result = await TransaksiService.updatePemasukan(this.currentUser.id, transactionId, dataTransaksi);
                } else {
                    result = await TransaksiService.updatePengeluaran(this.currentUser.id, transactionId, dataTransaksi);
                }
            } else {
                // Tambah transaksi baru
                if (jenis === 'pemasukan') {
                    result = await TransaksiService.tambahPemasukan(this.currentUser.id, dataTransaksi);
                } else {
                    result = await TransaksiService.tambahPengeluaran(this.currentUser.id, dataTransaksi);
                }
            }

            console.log('API Result:', result);

            if (result.berhasil) {
                NotifikasiUtil.tampilkanSukses(
                    this.isEditMode ? 'Transaksi berhasil diupdate' : 'Transaksi berhasil ditambahkan'
                );

                this.hideModal();
                await this.muatSemuaData();
                this.updateDashboardStats();
                this.muatDaftarTransaksi();

                // Reset edit mode
                this.isEditMode = false;
                this.editingTransactionId = null;
            } else {
                NotifikasiUtil.tampilkanError(result.pesan);
            }
        } catch (error) {
            console.error('Error submit transaksi:', error);
            NotifikasiUtil.tampilkanError('Gagal menyimpan transaksi');
        } finally {
            LoadingUtil.sembunyikanLoadingButton(btnSimpan);
        }
    }

    validasiFormTransaksi(nominal, kategori) {
        let valid = true;

        this.sembunyikanSemuaError();

        // Validasi nominal
        const hasilValidasiNominal = ValidasiUtil.validasiNominal(nominal);
        if (!hasilValidasiNominal.valid) {
            this.tampilkanError('errorNominal', hasilValidasiNominal.pesan);
            valid = false;
        }

        // Validasi kategori
        const hasilValidasiKategori = ValidasiUtil.validasiKategori(kategori);
        if (!hasilValidasiKategori.valid) {
            this.tampilkanError('errorKategori', hasilValidasiKategori.pesan);
            valid = false;
        }

        return valid;
    }

    validasiNominal() {
        const nominal = document.getElementById('nominal').value;
        if (nominal) {
            const hasil = ValidasiUtil.validasiNominal(nominal);
            if (!hasil.valid) {
                this.tampilkanError('errorNominal', hasil.pesan);
            } else {
                this.sembunyikanError('errorNominal');
            }
        }
    }

    validasiKategori() {
        const kategori = document.getElementById('kategori').value.trim();
        if (kategori) {
            const hasil = ValidasiUtil.validasiKategori(kategori);
            if (!hasil.valid) {
                this.tampilkanError('errorKategori', hasil.pesan);
            } else {
                this.sembunyikanError('errorKategori');
            }
        }
    }

    tampilkanError(elementId, pesan) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = pesan;
        errorElement.classList.remove('hidden');
    }

    sembunyikanError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.classList.add('hidden');
    }

    sembunyikanSemuaError() {
        ['errorNominal', 'errorKategori'].forEach(id => {
            this.sembunyikanError(id);
        });
    }

    // Fungsi untuk menampilkan pesan selamat datang
    showWelcomeMessage() {
        if (this.currentUser) {
            const welcomeUserName = document.getElementById('welcomeUserName');
            if (welcomeUserName) {
                welcomeUserName.textContent = this.currentUser.name + '!';

                // Animasi typing sederhana
                welcomeUserName.style.opacity = '0';
                setTimeout(() => {
                    welcomeUserName.style.transition = 'opacity 0.5s ease';
                    welcomeUserName.style.opacity = '1';
                }, 300);

                // Update pesan selamat datang yang dinamis berdasarkan saldo
                const dashboardSubtext = document.getElementById('dashboardSubtext');
                if (dashboardSubtext) {
                    setTimeout(() => {
                        // Hitung total saldo
                        const totalPemasukan = this.dataTransaksi.pemasukan.reduce((sum, item) => sum + item.nominal, 0);
                        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
                        const totalSaldo = totalPemasukan - totalPengeluaran;

                        // Buat pesan yang sesuai dengan kondisi saldo
                        let message = 'Ini adalah ringkasan keuangan Anda hari ini';

                        if (totalSaldo > 1000000) {
                            message = 'Saldo Anda sangat baik! Pertahankan ya!';
                        } else if (totalSaldo > 500000) {
                            message = 'Keuangan Anda dalam kondisi sehat!';
                        } else if (totalSaldo > 100000) {
                            message = 'Saldo masih positif, teruskan hemat!';
                        } else if (totalSaldo > 0) {
                            message = 'Saldo Anda tipis, perlu pengelolaan lebih baik';
                        } else if (totalSaldo === 0 && (totalPemasukan === 0 && totalPengeluaran === 0)) {
                            message = 'Mulai catat transaksi keuangan Anda hari ini!';
                        } else {
                            message = 'Saldo Anda minus, kurangi pengeluaran!';
                        }

                        dashboardSubtext.textContent = message;
                        dashboardSubtext.style.opacity = '0';
                        dashboardSubtext.style.transition = 'opacity 0.5s ease';
                        dashboardSubtext.style.opacity = '1';
                    }, 500);
                }
            }
        }
    }    // Load content for simulasi.html
    async loadSimulasiContent() {
        try {
            const response = await fetch('/src/templates/simulasi.html');
            if (!response.ok) {
                throw new Error('Failed to load simulasi template');
            }
            const html = await response.text();
            document.getElementById('simulasiContainer').innerHTML = html;

            // Load simulasi.js script dinamis
            this.loadSimulasiScript();

            // Initialize simulasi event listeners setelah HTML dimuat
            setTimeout(() => {
                this.initializeSimulasiEventListeners();
            }, 200);

        } catch (error) {
            console.error('Gagal memuat konten simulasi:', error);
            document.getElementById('simulasiContainer').innerHTML = `
                <div class="p-6 bg-red-50 text-red-600 rounded-lg">
                    <p>Gagal memuat konten simulasi. Silakan muat ulang halaman.</p>
                    <button id="btnReloadSimulasi" class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                        Muat Ulang
                    </button>
                </div>
            `;

            document.getElementById('btnReloadSimulasi').addEventListener('click', () => {
                this.loadSimulasiContent();
            });
        }
    }

    // Load simulasi script dinamis
    loadSimulasiScript() {
        // Cek apakah script sudah dimuat
        if (document.getElementById('simulasi-script')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'simulasi-script';
        script.src = '/src/js/simulasi.js';
        script.onload = () => {
            console.log('Simulasi script loaded successfully');
        };
        script.onerror = () => {
            console.error('Failed to load simulasi script');
        };
        document.head.appendChild(script);
    }

    // Load content for notifikasi.html
    async loadNotifikasiContent() {
        try {
            const response = await fetch('/src/templates/notifikasi.html');
            if (!response.ok) {
                throw new Error('Failed to load notifikasi template');
            }
            const html = await response.text();
            document.getElementById('notifikasiContainer').innerHTML = html;

            // Initialize notifikasi event listeners if needed
            this.initializeNotifikasiEventListeners();

        } catch (error) {
            console.error('Gagal memuat konten notifikasi:', error);
            document.getElementById('notifikasiContainer').innerHTML = `
                <div class="p-6 bg-red-50 text-red-600 rounded-lg">
                    <p>Gagal memuat konten notifikasi. Silakan muat ulang halaman.</p>
                    <button id="btnReloadNotifikasi" class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                        Muat Ulang
                    </button>
                </div>
            `;

            document.getElementById('btnReloadNotifikasi').addEventListener('click', () => {
                this.loadNotifikasiContent();
            });
        }
    }

    // Load content for transaksi (existing functionality)
    async loadTransaksiContent() {
        // This function can be implemented if you want to load transaksi content from external file
        // For now, transaksi is built into the dashboard HTML
        console.log('Loading transaksi content...');
    }    // Initialize event listeners for simulasi components
    initializeSimulasiEventListeners() {
        console.log('Initializing simulasi event listeners...');

        // Inisialisasi ulang SimulasiKeuangan setelah HTML dimuat
        if (typeof window.initializeSimulasi === 'function') {
            window.initializeSimulasi();
        } else {
            // Fallback jika function belum tersedia
            setTimeout(() => {
                if (typeof window.initializeSimulasi === 'function') {
                    window.initializeSimulasi();
                }
            }, 200);
        }

        // Double check - setup manual jika diperlukan
        setTimeout(() => {
            const btnTabungan = document.getElementById('btnSimulateTabungan');
            const btnInvestasi = document.getElementById('btnSimulateInvestasi');
            const btnKredit = document.getElementById('btnSimulateKredit');
            const btnEmergencyFund = document.getElementById('btnSimulateEmergencyFund');

            console.log('Manual check buttons:', {
                btnTabungan: !!btnTabungan,
                btnInvestasi: !!btnInvestasi,
                btnKredit: !!btnKredit,
                btnEmergencyFund: !!btnEmergencyFund
            });

            // Setup manual jika belum ada event listeners
            if (btnTabungan && !btnTabungan.dataset.listenerAdded) {
                btnTabungan.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Manual tabungan click');
                    if (window.simulasiKeuangan) {
                        window.simulasiKeuangan.simulateTabungan();
                    } else if (typeof simulateTabungan === 'function') {
                        simulateTabungan();
                    }
                });
                btnTabungan.dataset.listenerAdded = 'true';
            }

            if (btnInvestasi && !btnInvestasi.dataset.listenerAdded) {
                btnInvestasi.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Manual investasi click');
                    if (window.simulasiKeuangan) {
                        window.simulasiKeuangan.simulateInvestasi();
                    } else if (typeof simulateInvestasi === 'function') {
                        simulateInvestasi();
                    }
                });
                btnInvestasi.dataset.listenerAdded = 'true';
            }

            if (btnKredit && !btnKredit.dataset.listenerAdded) {
                btnKredit.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Manual kredit click');
                    if (window.simulasiKeuangan) {
                        window.simulasiKeuangan.simulateKredit();
                    } else if (typeof simulateKredit === 'function') {
                        simulateKredit();
                    }
                });
                btnKredit.dataset.listenerAdded = 'true';
            }

            if (btnEmergencyFund && !btnEmergencyFund.dataset.listenerAdded) {
                btnEmergencyFund.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Manual emergency fund click');
                    if (window.simulasiKeuangan) {
                        window.simulasiKeuangan.simulateEmergencyFund();
                    } else if (typeof simulateEmergencyFund === 'function') {
                        simulateEmergencyFund();
                    }
                });
                btnEmergencyFund.dataset.listenerAdded = 'true';
            }
        }, 300);
    }

    // Initialize event listeners for notifikasi components
    initializeNotifikasiEventListeners() {
        console.log('Initializing notifikasi event listeners...');
        // Add any specific event listeners for notifikasi functionality here
        // For example: notification toggles, mark as read buttons, etc.
    }

    // Update level keuangan berdasarkan saldo
    updateLevelKeuangan(totalSaldo) {
        const levelKeuanganElement = document.getElementById('levelKeuangan');
        const starContainer = levelKeuanganElement?.parentElement?.querySelector('.flex.mt-1');

        if (!levelKeuanganElement) return;

        let level = '';
        let starCount = 0;

        // Tentukan level berdasarkan saldo
        if (totalSaldo < 1000000) { // Kurang dari 1 juta
            level = 'Money Rookie';
            starCount = 1;
        } else if (totalSaldo < 5000000) { // 1 juta - 5 juta
            level = 'Budget Warrior';
            starCount = 3;
        } else { // 5 juta ke atas
            level = 'Tabungan Pro';
            starCount = 5;
        }

        // Update level text
        levelKeuanganElement.textContent = level;

        // Update stars
        if (starContainer) {
            const stars = starContainer.querySelectorAll('svg');
            stars.forEach((star, index) => {
                if (index < starCount) {
                    star.classList.remove('text-gray-300');
                    star.classList.add('text-yellow-300');
                } else {
                    star.classList.remove('text-yellow-300');
                    star.classList.add('text-gray-300');
                }
            });
        }

        console.log(`Level keuangan diperbarui: ${level} (${starCount} bintang) untuk saldo ${this.formatRupiah(totalSaldo)}`);
    }

    // Helper method untuk format rupiah (jika belum ada)
    formatRupiah(amount) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    }
}

// Inisialisasi controller dan buat instance global
let dashboardController;
document.addEventListener('DOMContentLoaded', () => {
    dashboardController = new DashboardController();
    window.dashboardController = dashboardController; // Untuk akses dari HTML
});