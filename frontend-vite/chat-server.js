/**
 * SmartSaku Chat API Server
 * 
 * Server sederhana untuk menangani API chat SmartSaku
 * Endpoint: POST http://localhost:3000/chat
 */

// Import modul yang diperlukan
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inisialisasi Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS untuk semua origin
app.use(bodyParser.json()); // Parse JSON request body

// Endpoint untuk chat (POST /chat)
app.post('/chat', (req, res) => {
    const { message } = req.body;

    console.log('Received message:', message);

    // Contoh respons sederhana sesuai permintaan
    // Dalam implementasi nyata, Anda akan menghubungkan ini ke model AI
    let reply = 'Hmm, aku masih belajar nih. Bisa coba tanya yang lain terkait tips keuangan mahasiswa?';

    // Beberapa respons contoh
    if (message.toLowerCase().includes('nabung')) {
        reply = 'Untuk nabung, kamu bisa mulai dengan menyisihkan setidaknya 10% dari pendapatan bulanan. Coba juga metode 50-30-20 (50% kebutuhan, 30% keinginan, 20% tabungan).';
    } else if (message.toLowerCase().includes('investasi')) {
        reply = 'Investasi bisa dimulai dari nominal kecil. Kamu bisa coba reksa dana, emas, atau P2P lending. Pastikan selalu riset sebelum investasi ya!';
    } else if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('anggaran')) {
        reply = 'Buat anggaran dengan mencatat semua pemasukan dan pengeluaran. Prioritaskan kebutuhan dasar, lalu sisihkan untuk tabungan, baru sisanya untuk keinginan.';
    }

    // Kirim respons
    res.json({ reply });
});

// Start server
app.listen(PORT, () => {
    console.log(`SmartSaku Chat Server berjalan di http://localhost:${PORT}`);
    console.log('Endpoint chat tersedia di: http://localhost:3000/chat');
});

/**
 * Contoh penggunaan API:
 * 
 * POST http://localhost:3000/chat
 * Headers: {"Content-Type": "application/json"}
 * Body: {"message": "gimana cara nabung?"}
 * 
 * Response: {"reply": "Hmm, aku masih belajar nih. Bisa coba tanya yang lain terkait tips keuangan mahasiswa?"}
 */
