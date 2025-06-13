// Utility untuk menampilkan notifikasi
class NotifikasiUtil {
    /**
     * Tampilkan notifikasi sukses
     * @param {string} pesan - Pesan yang akan ditampilkan
     */
    static tampilkanSukses(pesan) {
        this.buatNotifikasi(pesan, 'sukses');
    }

    /**
     * Tampilkan notifikasi error
     * @param {string} pesan - Pesan error yang akan ditampilkan
     */
    static tampilkanError(pesan) {
        this.buatNotifikasi(pesan, 'error');
    }

    /**
     * Tampilkan notifikasi info
     * @param {string} pesan - Pesan info yang akan ditampilkan
     */
    static tampilkanInfo(pesan) {
        this.buatNotifikasi(pesan, 'info');
    }

    /**
     * Buat elemen notifikasi dan tampilkan
     * @param {string} pesan - Pesan notifikasi
     * @param {string} tipe - Tipe notifikasi (sukses, error, info)
     */
    static buatNotifikasi(pesan, tipe) {
        // Hapus notifikasi sebelumnya jika ada
        const notifikasiLama = document.querySelector('.notifikasi-smartsaku');
        if (notifikasiLama) {
            notifikasiLama.remove();
        }

        // Buat elemen notifikasi baru
        const notifikasi = document.createElement('div');
        notifikasi.className = `notifikasi-smartsaku fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full opacity-0`;

        // Tentukan warna berdasarkan tipe
        let warnaKelas = '';
        let ikon = '';

        switch (tipe) {
            case 'sukses':
                warnaKelas = 'bg-green-500 text-white';
                ikon = '✅';
                break;
            case 'error':
                warnaKelas = 'bg-red-500 text-white';
                ikon = '❌';
                break;
            case 'info':
                warnaKelas = 'bg-blue-500 text-white';
                ikon = 'ℹ️';
                break;
            default:
                warnaKelas = 'bg-gray-500 text-white';
                ikon = '📢';
        }

        notifikasi.classList.add(...warnaKelas.split(' '));

        notifikasi.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-lg">${ikon}</span>
        <p class="font-medium">${pesan}</p>
        <button class="ml-auto text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

        // Tambahkan ke body
        document.body.appendChild(notifikasi);

        // Animasi masuk
        setTimeout(() => {
            notifikasi.classList.remove('translate-x-full', 'opacity-0');
            notifikasi.classList.add('translate-x-0', 'opacity-100');
        }, 100);

        // Auto hide setelah 5 detik
        setTimeout(() => {
            if (notifikasi.parentElement) {
                notifikasi.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => {
                    if (notifikasi.parentElement) {
                        notifikasi.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Utility untuk validasi form
class ValidasiUtil {
    /**
     * Validasi email
     * @param {string} email - Email yang akan divalidasi
     * @returns {boolean} Status validasi
     */
    static validasiEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validasi password
     * @param {string} password - Password yang akan divalidasi
     * @returns {Object} Status dan pesan validasi
     */
    static validasiPassword(password) {
        if (password.length < 6) {
            return { valid: false, pesan: 'Password minimal 6 karakter' };
        }
        return { valid: true };
    }

    /**
     * Validasi nominal transaksi
     * @param {string|number} nominal - Nominal yang akan divalidasi
     * @returns {Object} Status dan pesan validasi
     */
    static validasiNominal(nominal) {
        const nominalNumber = parseFloat(nominal);

        if (isNaN(nominalNumber) || nominalNumber <= 0) {
            return { valid: false, pesan: 'Nominal harus berupa angka positif' };
        }

        if (nominalNumber > 999999999) {
            return { valid: false, pesan: 'Nominal terlalu besar' };
        }

        return { valid: true };
    }

    /**
     * Validasi kategori transaksi
     * @param {string} kategori - Kategori yang akan divalidasi
     * @returns {Object} Status dan pesan validasi
     */
    static validasiKategori(kategori) {
        if (!kategori || kategori.trim().length === 0) {
            return { valid: false, pesan: 'Kategori tidak boleh kosong' };
        }

        if (kategori.length > 50) {
            return { valid: false, pesan: 'Kategori maksimal 50 karakter' };
        }

        return { valid: true };
    }
}

// Utility untuk loading state
class LoadingUtil {
    /**
     * Tampilkan loading pada button
     * @param {HTMLElement} button - Element button
     * @param {string} teksLoading - Teks saat loading
     */
    static tampilkanLoadingButton(button, teksLoading = 'Memproses...') {
        if (button) {
            button.disabled = true;
            button.setAttribute('data-original-text', button.textContent);
            button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${teksLoading}
      `;
        }
    }

    /**
     * Sembunyikan loading pada button
     * @param {HTMLElement} button - Element button
     */
    static sembunyikanLoadingButton(button) {
        if (button) {
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    }

    /**
     * Tampilkan loading indicator
     * @param {string} pesan - Pesan loading yang akan ditampilkan
     */
    static tampilkan(pesan = 'Loading...') {
        // Hapus loading sebelumnya jika ada
        this.sembunyikan();

        // Buat elemen loading baru
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'bg-white p-6 rounded-lg shadow-xl flex flex-col items-center';

        const spinner = document.createElement('div');
        spinner.className = 'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4';

        const pesanElement = document.createElement('div');
        pesanElement.textContent = pesan;
        pesanElement.className = 'text-gray-800';

        loadingSpinner.appendChild(spinner);
        loadingSpinner.appendChild(pesanElement);
        loadingOverlay.appendChild(loadingSpinner);

        document.body.appendChild(loadingOverlay);
    }

    /**
     * Sembunyikan loading indicator
     */
    static sembunyikan() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
}

export { NotifikasiUtil, ValidasiUtil, LoadingUtil };