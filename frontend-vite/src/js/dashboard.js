// Controller untuk halaman dashboard
import AuthService from '../services/AuthService.js';
import TransaksiService from '../services/TransaksiService.js';
import { NotifikasiUtil, ValidasiUtil, LoadingUtil } from '../utils/helpers.js';

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
        this.showWelcomeMessage();

        // Muat data
        await this.muatSemuaData();
        this.updateDashboardStats();
        this.initCharts();
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

    initEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });        // Sidebar toggle untuk mobile
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

    showSection(sectionName) {
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            transaksi: 'Transaksi',
            laporan: 'Laporan'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';

        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        document.getElementById(`${sectionName}Section`).classList.remove('hidden');        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'bg-primary', 'text-white');
            link.classList.add('text-gray-700');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'bg-primary', 'text-white');
            activeLink.classList.remove('text-gray-700');
        }

        // Close sidebar on mobile when section changes
        if (window.innerWidth < 1024) {
            this.closeSidebar();
        }

        // Load data untuk section tertentu
        if (sectionName === 'transaksi') {
            this.muatDaftarTransaksi();
        }
    } toggleSidebar() {
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

        } catch (error) {
            console.error('Error memuat data:', error);
            NotifikasiUtil.tampilkanError('Gagal memuat data transaksi');
        }
    }

    updateDashboardStats() {
        const totalPemasukan = this.dataTransaksi.pemasukan.reduce((sum, item) => sum + item.nominal, 0);
        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);
        const totalSaldo = totalPemasukan - totalPengeluaran;
        const totalTransaksi = this.dataTransaksi.pemasukan.length + this.dataTransaksi.pengeluaran.length;

        document.getElementById('totalSaldo').textContent = TransaksiService.formatRupiah(totalSaldo);
        document.getElementById('totalPemasukan').textContent = TransaksiService.formatRupiah(totalPemasukan);
        document.getElementById('totalPengeluaran').textContent = TransaksiService.formatRupiah(totalPengeluaran);
        document.getElementById('totalTransaksi').textContent = totalTransaksi;

        this.tampilkanTransaksiTerbaru();
    }

    tampilkanTransaksiTerbaru() {
        const container = document.getElementById('transaksiTerbaru');
        const semuaTransaksi = [
            ...this.dataTransaksi.pemasukan.map(t => ({ ...t, jenis: 'pemasukan' })),
            ...this.dataTransaksi.pengeluaran.map(t => ({ ...t, jenis: 'pengeluaran' }))
        ];

        // Sort by date descending dan ambil 5 teratas
        const transaksiTerbaru = semuaTransaksi
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (transaksiTerbaru.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">Belum ada transaksi</p>';
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
      </div>
    `).join('');
    } initCharts() {
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

        const totalPemasukan = this.dataTransaksi.pemasukan.reduce((sum, item) => sum + item.nominal, 0);
        const totalPengeluaran = this.dataTransaksi.pengeluaran.reduce((sum, item) => sum + item.nominal, 0);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pemasukan', 'Pengeluaran'],
                datasets: [{
                    data: [totalPemasukan, totalPengeluaran],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initKategoriPengeluaranChart() {
        const ctx = document.getElementById('chartKategoriPengeluaran').getContext('2d');

        // Kelompokkan pengeluaran berdasarkan kategori
        const kategoriMap = {};
        this.dataTransaksi.pengeluaran.forEach(transaksi => {
            if (kategoriMap[transaksi.kategori]) {
                kategoriMap[transaksi.kategori] += transaksi.nominal;
            } else {
                kategoriMap[transaksi.kategori] = transaksi.nominal;
            }
        });

        const labels = Object.keys(kategoriMap);
        const data = Object.values(kategoriMap);
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
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
            }
        }
    }
}

// Inisialisasi controller dan buat instance global
let dashboardController;
document.addEventListener('DOMContentLoaded', () => {
    dashboardController = new DashboardController();
    window.dashboardController = dashboardController; // Untuk akses dari HTML
});