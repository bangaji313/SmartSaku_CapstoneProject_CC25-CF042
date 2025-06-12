import tensorflow as tf
import pandas as pd
import numpy as np
import pickle
import random
import sys
import os
import h5py

# --- Muat semua artifak yang dibutuhkan (tidak ada perubahan di sini) ---
try:
    # Dapatkan path direktori di mana script ini berada
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Gabungkan path direktori dengan nama file-file artifak
    model_path = os.path.join(base_dir, 'model_rekomendasi.h5')
    preprocessor_path = os.path.join(base_dir, 'preprocessor_rekomendasi.pkl')
    label_encoder_path = os.path.join(base_dir, 'label_encoder_rekomendasi.pkl')

    model = tf.keras.models.load_model(model_path)
    with open(preprocessor_path, 'rb') as f:
        preprocessor = pickle.load(f)
    with open(label_encoder_path, 'rb') as f:
        label_encoder = pickle.load(f)
    print("Rekomendasi: Model dan artifak berhasil dimuat.")
except Exception as e:
    print(f"Error saat memuat model atau artifak rekomendasi: {e}", file=sys.stderr)
    model, preprocessor, label_encoder = None, None, None

def get_recommendation(data_paket):
    """
    Fungsi untuk mendapatkan rekomendasi hemat berdasarkan 'paket data' lengkap dari backend.
    - data_paket: sebuah dictionary Python yang berisi data untuk model dan data untuk analisis.
    """
    if not all([model, preprocessor, label_encoder]):
        return "Maaf, layanan rekomendasi sedang tidak tersedia karena masalah internal."

    try:
        # === LANGKAH 1: PANGGIL MODEL ML SEBAGAI PEMICU ===
        data_untuk_model = data_paket.get('data_untuk_model', {})
        input_df = pd.DataFrame([data_untuk_model])
        input_processed = preprocessor.transform(input_df)
        pred_proba = model.predict(input_processed)[0][0]
        predicted_label = label_encoder.inverse_transform([1 if pred_proba > 0.5 else 0])[0]

        # === LANGKAH 2: JALANKAN LOGIKA ATURAN CERDAS (RULE-BASED) ===
        data_untuk_analisis = data_paket.get('data_untuk_analisis', {})
        transaksi_harian = data_untuk_analisis.get('riwayat_transaksi_harian', [])

        if predicted_label == 'boros':
            # --- ATURAN 1: Cek pembelian item kecil yang berulang ---
            item_counters = {}
            item_spending = {}
            # Kata kunci untuk item 'guilty pleasure'
            keywords = ['kopi', 'rokok', 'snack', 'boba', 'es teh', 'jajan']

            for trx in transaksi_harian:
                for keyword in keywords:
                    if keyword in trx.get('deskripsi', '').lower():
                        item_counters[keyword] = item_counters.get(keyword, 0) + 1
                        item_spending[keyword] = item_spending.get(keyword, 0) + trx.get('jumlah', 0)
            
            for item, count in item_counters.items():
                if count > 1:
                    total_biaya = item_spending[item]
                    return f"Terdeteksi pembelian '{item}' sebanyak {count} kali hari ini. Coba dikurangi ya, totalnya sudah mencapai Rp{total_biaya:,}."

            # --- ATURAN 2: Cek pengeluaran per kategori yang tinggi ---
            category_spending = {}
            for trx in transaksi_harian:
                kategori = trx.get('kategori', 'lain-lain')
                category_spending[kategori] = category_spending.get(kategori, 0) + trx.get('jumlah', 0)
            
            if category_spending.get('hiburan', 0) > 50000:
                return "Budget hiburanmu hari ini sepertinya agak besar. Coba cari alternatif hiburan gratis besok, seperti olahraga atau baca buku di taman!"
            
            if category_spending.get('makanan', 0) > 100000 and item_counters.get('kopi', 0) == 0:
                return "Pengeluaran makanan hari ini cukup tinggi. Mungkin bisa coba kurangi makan di luar dan mulai masak sendiri? Pasti lebih hemat!"

            # --- ATURAN 3: Fallback (Jika tidak ada aturan spesifik yang cocok) ---
            saran_boros_umum = [
                "Terdeteksi pola pengeluaran yang kurang hemat hari ini. Yuk, cek lagi prioritas keuanganmu!",
                "Nafsu belanja sedang tinggi? Tahan dulu! Ingat ada target keuangan yang ingin kamu capai."
            ]
            return random.choice(saran_boros_umum)

        else: # Jika prediksi 'hemat'
            saran_hemat = [
                "Kerja bagus! Pengeluaranmu hari ini terkontrol dengan baik. Pertahankan!",
                "Kamu hebat! Terus lanjutkan kebiasaan baik ini ya, targetmu semakin dekat.",
                "Pola belanjamu sudah efisien. Mantap! Kamu bisa alokasikan sisa uangnya untuk menabung atau investasi."
            ]
            return random.choice(saran_hemat)
            
    except Exception as e:
        print(f"Error saat inferensi: {e}", file=sys.stderr)
        return "Maaf, terjadi kesalahan saat memproses data rekomendasi Anda."

# === CONTOH PENGGUNAAN (UNTUK DICOBA OLEH BACKEND) ===
if __name__ == '__main__':
    # Simulasi 'paket data' lengkap yang diterima dari request API
    contoh_paket_data = {
        'data_untuk_model': {
            'monthly_income': 3000000,
            'financial_aid': 500000,
            'total_essentials': 150000, # Diisi dari hasil kalkulasi di backend
            'total_non_essentials': 250000, # Diisi dari hasil kalkulasi di backend
            'gender': 'Female',
            'major': 'Computer Science'
        },
        'data_untuk_analisis': {
            'riwayat_transaksi_harian': [
                {'deskripsi': 'Nasi Ayam Geprek', 'kategori': 'makanan', 'jumlah': 25000},
                {'deskripsi': 'Beli Kopi Susu', 'kategori': 'makanan', 'jumlah': 22000},
                {'deskripsi': 'Top up GoPay', 'kategori': 'transport', 'jumlah': 50000},
                {'deskripsi': 'Es teh manis', 'kategori': 'makanan', 'jumlah': 5000},
                {'deskripsi': 'Beli Kopi lagi sore', 'kategori': 'makanan', 'jumlah': 22000}
            ]
        }
    }
    
    rekomendasi = get_recommendation(contoh_paket_data)
    print("="*50)
    print(f"Hasil Rekomendasi: {rekomendasi}")
    print("="*50)