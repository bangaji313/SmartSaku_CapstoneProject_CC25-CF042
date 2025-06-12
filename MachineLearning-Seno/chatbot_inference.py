import pickle
import random
import sys
import os

def load_resources():
    """
    Fungsi untuk memuat model dan vectorizer dari file .pkl.
    Menggunakan path absolut agar tidak error saat dipanggil dari direktori lain.
    """
    try:
        # Dapatkan path direktori di mana script ini berada
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Gabungkan path direktori dengan nama file model
        model_path = os.path.join(base_dir, 'model_chatbot.pkl')
        vectorizer_path = os.path.join(base_dir, 'vectorizer.pkl')

        with open(model_path, 'rb') as model_file:
            model = pickle.load(model_file)
        with open(vectorizer_path, 'rb') as vectorizer_file:
            vectorizer = pickle.load(vectorizer_file)
        
        print("Chatbot: Model dan vectorizer berhasil dimuat.")
        return model, vectorizer
    except FileNotFoundError:
        print("Error: File model_chatbot.pkl atau vectorizer.pkl tidak ditemukan.", file=sys.stderr)
        sys.exit(1)

def get_response(user_text, model, vectorizer):
    """
    Fungsi untuk memproses teks input pengguna dan mengembalikan respons dari chatbot.
    """
    # Menyiapkan template jawaban untuk setiap intent
    responses = {
        'sapaan': [
            "Halo! Ada yang bisa SmartSaku bantu seputar keuanganmu?", 
            "Hai! Selamat datang di SmartSaku. Mau tanya apa hari ini?"
        ],
        'tanya_tabungan': [
            "Cara paling mudah untuk mulai menabung adalah dengan menyisihkan 10-20% dari pemasukanmu di awal, bukan di akhir. Coba fitur 'Target' di aplikasi untuk membantumu!",
            "Untuk menabung, coba buat alokasi budget bulanan. Pisahkan mana kebutuhan dan keinginan. SmartSaku bisa bantu catat lho!"
        ],
        'tips_hemat': [
            "Tips hemat paling ampuh: catat semua pengeluaranmu! Dengan begitu kamu sadar ke mana uangmu pergi. Coba juga kurangi jajan kopi 1-2 kali seminggu, lumayan lho hasilnya!",
            "Coba manfaatkan promo atau diskon untuk mahasiswa. Sebelum membeli sesuatu, tanya dirimu: 'Apakah aku benar-benar butuh ini?'. Itu membantu banget!"
        ],
        'info_pengeluaran': [
            "Untuk melihat detail pengeluaranmu, silakan cek menu 'Riwayat Transaksi' atau lihat ringkasannya di Dashboard ya!",
            "Kamu bisa melihat rincian pengeluaran di Dashboard. Nanti akan terlihat kategori mana yang paling banyak menghabiskan uangmu."
        ],
        'tanya_fitur': [
            "SmartSaku bisa bantu kamu mencatat pemasukan dan pengeluaran, kasih rekomendasi hemat harian, prediksi pengeluaran bulanan, sampai deteksi anomali finansial. Lengkap kan?",
            "Fitur utama kami adalah Dashboard keuangan, Rekomendasi AI, Prediksi Pengeluaran, Gamifikasi, dan Manajemen Target. Jelajahi saja menunya!"
        ],
        'keluhan_boros': [
            "Tenang, itu masalah umum kok. Kunci utamanya adalah kesadaran. Coba mulai catat semua pengeluaranmu di SmartSaku, nanti kita cari tahu bareng-bareng di mana 'bocor'-nya.",
            "Jangan khawatir, semua orang pernah merasa boros. Yuk, mulai perbaiki dengan membuat target tabungan di aplikasi. Sedikit-sedikit lama-lama jadi bukit!"
        ],
        'bingung_mulai': [
            "Tidak perlu bingung! Langkah pertama yang paling mudah adalah mulai mencatat setiap transaksi, sekecil apapun. Klik tombol '+' di dashboard untuk memulai.",
            "Awal yang baik! Kamu bisa mulai dengan menetapkan 'Target' keuangan pertamamu di aplikasi, misalnya 'Dana Darurat Rp 500.000'. SmartSaku akan bantu pantau progresnya."
        ],
        'terima_kasih': [
            "Sama-sama! Senang bisa membantu.",
            "Dengan senang hati! Jangan ragu bertanya lagi ya."
        ],
        
        'tanya_investasi_pemula': [
            "Investasi untuk mahasiswa bisa dimulai dari yang risikonya rendah, seperti Reksadana Pasar Uang (RDPU). Modalnya kecil, mulai dari Rp10.000-Rp100.000 saja sudah bisa!",
            "Pilihan bagus! Sebagai pemula, coba pelajari dulu Reksadana atau Emas. Hindari ikut-ikutan teman tanpa riset ya. Gunakan uang dingin untuk berinvestasi."
        ],
        'dana_darurat': [
            "Sangat penting! Dana darurat itu jaring pengamanmu saat ada kebutuhan mendadak & tak terduga. Untuk mahasiswa, idealnya punya 3x pengeluaran bulanan.",
            "Dana darurat itu wajib. Mulai kumpulkan sedikit-sedikit, pisahkan di rekening yang berbeda agar tidak terpakai. Tujuannya untuk hal darurat seperti sakit atau barang penting rusak."
        ],
        'atur_pemasukan_tidak_tetap': [
            "Kuncinya adalah buat budget berdasarkan pemasukan rata-rata terendahmu. Saat dapat pemasukan besar, jangan langsung dihabiskan. Alokasikan ke tabungan, dana darurat, dan investasi.",
            "Saat pemasukan tidak tetap, buat persentase. Misalnya 50% untuk kebutuhan, 30% tabungan/investasi, 20% keinginan. Jadi berapapun pemasukanmu, alokasinya tetap sama."
        ],
        'cicilan_hutang': [
            "Prioritaskan bayar cicilan/hutang yang bunganya paling tinggi. Buat daftar hutangmu dan atur rencana pelunasan. Mengurangi jajan bisa mempercepat pelunasan lho.",
            "Jika ada hutang konsumtif, sebaiknya fokus lunasi itu dulu sebelum mulai investasi besar. Kebebasan finansial dimulai dari bebas hutang."
        ],
        'bedakan_kebutuhan_keinginan': [
            "Kebutuhan itu sesuatu yang harus kamu penuhi untuk bertahan hidup (makan, tempat tinggal, transport). Keinginan itu sesuatu yang membuat hidup lebih nyaman tapi tidak wajib (nongkrong, gadget baru, fashion).",
            "Cara mudahnya: tanyakan pada diri sendiri 'Apa yang terjadi kalau aku tidak membeli ini?'. Kalau jawabannya 'tidak apa-apa', berarti itu hanya keinginan."
        ],
        'penghasilan_tambahan': [
            "Banyak cara! Kamu bisa coba jadi freelancer (penulis, desainer grafis), jualan online, jadi admin media sosial, atau ikut proyek dosen. Manfaatkan skill yang kamu punya!",
            "Cari 'side hustle' yang tidak mengganggu kuliah. Misalnya mengajar les privat, menjadi barista part-time, atau menjual catatan kuliahmu. Kuncinya adalah manajemen waktu."
        ],
        'minta_motivasi': [
            "Mengatur keuangan itu maraton, bukan sprint. Nikmati prosesnya, setiap seribu rupiah yang kamu hemat hari ini adalah investasi untuk kebebasanmu di masa depan. Semangat!",
            "Ingat tujuanmu! Bayangkan nikmatnya bisa membeli barang impian dengan hasil jerih payah sendiri. Kamu pasti bisa, konsisten adalah kuncinya!"
        ],
        
        'default': [
            "Maaf, aku belum mengerti pertanyaanmu. Coba tanyakan dengan kalimat lain ya.",
            "Hmm, aku masih belajar nih. Bisa coba tanya yang lain terkait tips keuangan mahasiswa?"
        ]
    }
    
    # Proses inferensi
    user_text_vectorized = vectorizer.transform([user_text])
    predicted_intent = model.predict(user_text_vectorized)[0]
    confidence = model.predict_proba(user_text_vectorized).max()
    
    if confidence < 0.6:
        return random.choice(responses['default'])
    else:
        # responses.get() akan aman bahkan jika intent tidak ditemukan, ia akan kembali ke default
        return random.choice(responses.get(predicted_intent, responses['default']))

# Bagian ini hanya akan berjalan jika file ini dieksekusi langsung
if __name__ == "__main__":
    # Memeriksa apakah ada argumen yang diberikan dari command line
    if len(sys.argv) > 1:
        # Mengambil input teks dari argumen pertama
        input_text = sys.argv[1]
        
        # Memuat model dan vectorizer
        model, vectorizer = load_resources()
        
        # Mendapatkan jawaban
        response = get_response(input_text, model, vectorizer)
        
        # Mencetak jawaban agar bisa ditangkap oleh proses Node.js
        print(response)
    else:
        print("Error: Tidak ada input teks. Gunakan: python chatbot_inference.py \"Teks pertanyaan Anda\"")