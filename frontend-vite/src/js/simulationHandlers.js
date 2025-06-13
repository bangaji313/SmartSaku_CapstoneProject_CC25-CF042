// Handlers for simulation features

export function setupSimulasiHandlers() {
    // Simulasi Tabungan
    const btnHitungTabungan = document.getElementById('hitungTabungan');
    if (btnHitungTabungan) {
        btnHitungTabungan.addEventListener('click', hitungSimulasiTabungan);
    }

    // Simulasi Investasi
    const btnHitungInvestasi = document.getElementById('hitungInvestasi');
    if (btnHitungInvestasi) {
        btnHitungInvestasi.addEventListener('click', hitungSimulasiInvestasi);
    }
}

// Menghitung dan menampilkan hasil simulasi tabungan
function hitungSimulasiTabungan() {
    try {
        const tabunganAwal = parseFloat(document.getElementById('tabunganAwal').value) || 0;
        const setoranBulanan = parseFloat(document.getElementById('setoranBulanan').value) || 0;
        const bungaTahunan = parseFloat(document.getElementById('bungaTahunan').value) || 0;
        const jangkaWaktu = parseFloat(document.getElementById('jangkaWaktu').value) || 0;
        const jangkaWaktuUnit = document.getElementById('jangkaWaktuUnit').value;

        // Konversi waktu ke bulan
        const jangkaWaktuBulan = jangkaWaktuUnit === 'tahun' ? jangkaWaktu * 12 : jangkaWaktu;

        let totalTabungan = tabunganAwal;
        const bungaBulanan = bungaTahunan / 12 / 100;

        // Hitung akumulasi tabungan dengan bunga majemuk bulanan
        for (let bulan = 1; bulan <= jangkaWaktuBulan; bulan++) {
            // Tambahkan setoran bulanan
            totalTabungan += setoranBulanan;

            // Tambahkan bunga bulanan
            totalTabungan += totalTabungan * bungaBulanan;
        }

        // Total setoran = tabungan awal + (setoran bulanan × jumlah bulan)
        const totalSetoran = tabunganAwal + (setoranBulanan * jangkaWaktuBulan);

        // Bunga diperoleh = total tabungan - total setoran
        const bungaDiperoleh = totalTabungan - totalSetoran;

        // Format hasil ke dalam format mata uang Rupiah
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        });

        // Update tampilan hasil simulasi
        const hasilSimulasi = document.getElementById('hasilSimulasiTabungan');
        if (hasilSimulasi) {
            hasilSimulasi.innerHTML = `
                <h4 class="font-semibold text-gray-700 mb-2">Hasil Simulasi</h4>
                <div class="grid grid-cols-2 gap-y-2 text-sm">
                    <div>Total Setoran:</div>
                    <div class="font-medium">${formatter.format(totalSetoran)}</div>
                    <div>Bunga Diperoleh:</div>
                    <div class="font-medium">${formatter.format(bungaDiperoleh)}</div>
                    <div>Total Akhir:</div>
                    <div class="font-semibold text-lg text-primary">${formatter.format(totalTabungan)}</div>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error menghitung simulasi tabungan:', error);
        alert('Terjadi kesalahan saat menghitung simulasi tabungan');
    }
}

// Menghitung dan menampilkan hasil simulasi investasi
function hitungSimulasiInvestasi() {
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
        alert('Terjadi kesalahan saat menghitung simulasi investasi');
    }
}
