
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