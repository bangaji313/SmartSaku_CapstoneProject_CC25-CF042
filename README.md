# **SmartSaku: Manajemen Keuangan Pintar untuk Mahasiswa**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-develop-red.svg)

## **Deskripsi Proyek**

**SmartSaku** adalah aplikasi web berbasis kecerdasan buatan yang dirancang khusus untuk membantu mahasiswa dalam mengelola keuangan pribadi secara cerdas, praktis, dan efisien. Proyek ini dikembangkan sebagai bagian dari Capstone Project di program Coding Camp DBS Foundation 2025. SmartSaku menghadirkan fitur utama seperti pencatatan keuangan harian, prediksi pengeluaran bulanan, rekomendasi penghematan berbasis kebiasaan, serta gamifikasi keuangan untuk mendorong perilaku finansial yang sehat. Dengan dukungan teknologi Machine Learning dan NLP, SmartSaku bertujuan menjadi solusi manajemen keuangan yang ringan namun berdampak besar bagi generasi mahasiswa masa kini.

## **Fitur Utama**

-   📊 **Dashboard Keuangan Interaktif:** Visualisasi arus kas, alokasi pengeluaran per kategori, dan progres tabungan secara *real-time*.
-   💡 **Rekomendasi Hemat Harian (AI):** Sistem cerdas yang menganalisis pola belanja 'boros' dan memberikan saran penghematan yang personal dan kontekstual.
-   📈 **Prediksi Pengeluaran Bulanan (AI):** Model *time-series* yang memproyeksikan total pengeluaran hingga akhir bulan, membantu pengguna mengantisipasi sisa dana.
-   🤖 **AI Chat Assistant:** Asisten virtual yang siap menjawab pertanyaan umum seputar manajemen keuangan mahasiswa.
-   🎯 **Manajemen Target Finansial:** Fitur untuk membuat, melacak, dan mencapai tujuan keuangan pribadi.

## **Arsitektur & Teknologi**

Aplikasi ini dibangun dengan arsitektur modern yang memisahkan antara klien (*frontend*), server (*backend*), dan layanan *machine learning*.

![Arsitektur Sistem](https://github.com/bangaji313/SmartSaku_CapstoneProject_CC25-CF042/blob/main/images/Arsitektur%20Sistem%20SmartSaku.jpg)

**Tech Stack yang Digunakan:**

* **Frontend:** Vite, Vanilla JavaScript (untuk membangun SPA dari dasar).
* **Backend:** Node.js, Hapi.js, Bcrypt, Dotenv.
* **Machine Learning:** Python, TensorFlow, Keras, Scikit-learn, Pandas, NumPy.
* **Database:** MongoDB (via Mongoose ODM).
* **Deployment:** Cloud VPS.
* **Tools:** Git, GitHub, Postman, Figma.

## **Panduan Instalasi & Setup**

Berikut adalah langkah-langkah untuk menjalankan proyek ini di lingkungan lokal.

**Prasyarat:**
-   [Node.js](https://nodejs.org/) (Versi LTS direkomendasikan)
-   [Python](https://www.python.org/) (Versi 3.9+) dan `pip`
-   [Git](https://git-scm.com/)

**Langkah-langkah:**

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/bangaji313/SmartSaku_CapstoneProject_CC25-CF042.git](https://github.com/bangaji313/SmartSaku_CapstoneProject_CC25-CF042.git)
    cd SmartSaku_CapstoneProject_CC25-CF042
    ```

2.  **Setup Backend:**
    ```bash
    # Masuk ke folder backend
    cd backend

    # Install semua dependency
    npm install

    # Kembali ke direktori utama
    cd ..
    ```
    *Catatan: Pastikan Anda membuat file `.env` di dalam folder `backend/` untuk menyimpan variabel lingkungan seperti koneksi database dan *secret key*.*

3.  **Setup Frontend:**
    ```bash
    # Masuk ke folder frontend
    cd frontend

    # Install semua dependency
    npm install

    # Kembali ke direktori utama
    cd ..
    ```

4.  **Setup Environment Python:**
    Sangat disarankan untuk membuat *virtual environment*.
    ```bash
    # Buat virtual environment
    python -m venv venv

    # Aktifkan (contoh untuk Windows)
    .\venv\Scripts\activate

    # Install semua library Python yang dibutuhkan
    pip install -r requirements.txt
    ```

## **Menjalankan Aplikasi**

Anda perlu membuka dua terminal untuk menjalankan backend dan frontend secara bersamaan.

1.  **Jalankan Backend Server:**
    ```bash
    # Dari direktori utama
    cd backend
    npm start
    ```
    *Server akan berjalan di port yang ditentukan (misal: 5000).*

2.  **Jalankan Frontend App:**
    ```bash
    # Buka terminal BARU, dari direktori utama
    cd frontend
    npm start
    ```
    *Aplikasi akan otomatis terbuka di browser Anda (misal: http://localhost:5173).*

## **Tim Pengembang (CC25-CF042)**

| Nama                           | ID           | Universitas                         | Peran                       |
| :----------------------------- | :----------- | :---------------------------------- | :-------------------------- |
| Maulana Seno Aji Yudhantara    | MC117D5Y1789 | Institut Teknologi Nasional Bandung | Project Manager & ML Engineer |
| Yulia Khoirunnisa              | MC224D5X0960 | UIN Syarif Hidayatullah Jakarta     | Machine Learning Engineer   |
| Naia Az - Zahra                | MC132D5X1884 | Politeknik Negeri Padang            | Machine Learning Engineer   |
| Muhamad Mabruri                | FC013D5Y0567 | Universitas Terbuka Jember          | Back-End Developer          |
| Andhika Fajar Prayoga          | FC117D5Y0600 | Institut Teknologi Nasional Bandung | Front-End Developer         |

---

### **Berkontribusi**
Kami sangat terbuka untuk kontribusi. Silakan baca [CONTRIBUTING.md](./CONTRIBUTING.md) untuk detail lebih lanjut.

### **Lisensi**
Proyek ini dilisensikan di bawah [Lisensi MIT](./LICENSE).
