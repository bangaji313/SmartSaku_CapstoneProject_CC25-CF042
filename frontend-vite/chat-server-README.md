# SmartSaku Chat Server

Server sederhana untuk menangani API chat SmartSaku.

## Endpoint

- **URL**: `http://localhost:3000/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Request Format

```json
{
  "message": "gimana cara nabung?"
}
```

## Response Format

```json
{
  "reply": "Hmm, aku masih belajar nih. Bisa coba tanya yang lain terkait tips keuangan mahasiswa?"
}
```

## Cara Menjalankan Server

1. Install dependensi:

   ```bash
   npm install --prefix . -f chat-server-package.json
   ```

2. Jalankan server:

   ```bash
   node chat-server.js
   ```

3. Server berjalan di `http://localhost:3000`

## Penggunaan

Setelah server berjalan, Anda dapat mengirim permintaan ke endpoint chat:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "gimana cara nabung?"}'
```

Atau menggunakan aplikasi SmartSaku yang sudah terhubung dengan API ini.
