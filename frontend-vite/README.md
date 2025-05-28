# SmartSaku - Frontend dengan Vite

Proyek ini merupakan implementasi frontend untuk aplikasi SmartSaku menggunakan Vite sebagai module bundler.

## Tentang SmartSaku

SmartSaku adalah aplikasi pengelolaan keuangan berbasis AI yang membantu pengguna untuk:

- Memantau pengeluaran dan pendapatan
- Mendapatkan rekomendasi penghematan
- Mendeteksi anomali transaksi
- Mengatur target keuangan

## Teknologi yang Digunakan

- **Vite** - Module bundler yang cepat untuk pengembangan frontend
- **Tailwind CSS** (via CDN) - Framework CSS utility-first
- **Vanilla JavaScript** - JavaScript murni dengan pendekatan modular

## Struktur Folder

```
frontend-vite/
├── index.html            # Entry point HTML
├── package.json          # Konfigurasi npm dan dependencies
├── vite.config.js        # Konfigurasi Vite
└── src/                  # Source code
    ├── main.js           # JavaScript entry point
    ├── css/              # File CSS
    ├── images/           # Gambar dan assets
    ├── js/               # Module JavaScript
    └── templates/        # Template HTML
```

## Cara Menjalankan

1. Install dependencies:

   ```
   npm install
   ```

2. Menjalankan server pengembangan:

   ```
   npm run dev
   ```

3. Build untuk production:

   ```
   npm run build
   ```

4. Preview hasil build:
   ```
   npm run preview
   ```

## Kelebihan Menggunakan Vite

1. **Hot Module Replacement (HMR)** - Update instan tanpa refresh halaman
2. **Kecepatan** - Server dev yang sangat cepat berkat ES modules
3. **Optimasi Build** - Build yang cepat dan hasil yang teroptimasi
4. **Framework Agnostic** - Mendukung berbagai framework atau vanilla JS
5. **TypeScript Support** - Dukungan TypeScript built-in
6. **Plugin Ecosystem** - Ekosistem plugin yang kaya

## Poin Implementasi Module Bundler

Proyek ini menggunakan Vite sebagai module bundler dengan fitur-fitur:

1. **Code Splitting Otomatis** - Memecah kode menjadi chunk-chunk yang lebih kecil
2. **Lazy Loading** - Memuat kode hanya ketika dibutuhkan
3. **Tree Shaking** - Menghilangkan kode yang tidak digunakan
4. **Asset Handling** - Penanganan asset seperti CSS, gambar, dan font
5. **Development Server** - Server pengembangan yang cepat dengan HMR

## Kontributor

SmartSaku Team @ 2025
