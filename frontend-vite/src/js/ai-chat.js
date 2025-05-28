/**
 * ai-chat.js
 * Modul untuk menangani interaksi dengan AI chat assistant
 */

// Predefined responses untuk simulasi AI Chat
const predefinedResponses = {
    "default": "Maaf, saya tidak mengerti pertanyaan Anda. Coba tanyakan tentang keuangan, tabungan, atau investasi.",
    "halo": "Halo! Saya adalah SmartSaku AI Assistant. Ada yang bisa saya bantu terkait keuangan Anda?",
    "tabungan": "Untuk menabung secara efektif, coba terapkan aturan 50/30/20: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan. Konsistensi adalah kunci!",
    "investasi": "Ada beberapa opsi investasi yang bisa Anda pertimbangkan: Deposito (rendah risiko), Reksa Dana (menengah), Saham (tinggi risiko tinggi return). Pilih sesuai profil risiko Anda.",
    "utang": "Strategi melunasi utang: Prioritaskan utang dengan bunga tertinggi terlebih dahulu, atau lunasi utang terkecil untuk motivasi. Jangan lupa siapkan dana darurat dulu.",
    "budget": "Untuk membuat anggaran yang baik: Catat semua pengeluaran, kategorikan, analisa pola, dan tetapkan batas per kategori. Review secara rutin untuk penyesuaian.",
    "cicilan": "Tips mengelola cicilan: Pastikan total cicilan maksimal 30% dari pendapatan. Prioritaskan cicilan dengan bunga tinggi. Pertimbangkan untuk refinancing jika bunga turun.",
    "bisnis": "Untuk memulai bisnis, lakukan: Riset pasar, buat business plan, hitung modal, tentukan pricing, dan mulailah dengan skala kecil. Tracking cash flow adalah kunci."
};

// Setup chat functionality
export function setupAIChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    const chatContainer = document.querySelector('#chatWindow .p-4');

    if (!chatToggle || !chatWindow) return;

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    // Close chat window
    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        const userMessage = document.createElement('div');
        userMessage.className = 'bg-primary/10 rounded-lg p-3 ml-8';
        userMessage.innerHTML = `<p class="text-sm">${escapeHTML(message)}</p>`;
        chatContainer.appendChild(userMessage);

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Clear input
        chatInput.value = '';

        // Simulate AI response (in real app, this would be an API call)
        setTimeout(() => {
            const response = getAIResponse(message);

            // Add AI message
            const aiMessage = document.createElement('div');
            aiMessage.className = 'bg-gray-100 rounded-lg p-3';
            aiMessage.innerHTML = `<p class="text-sm">${response}</p>`;
            chatContainer.appendChild(aiMessage);

            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 500 + Math.random() * 1000); // Random delay for realism
    }

    // Listen for send button click
    chatSend.addEventListener('click', sendMessage);

    // Listen for Enter key
    chatInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Get AI response based on user input
function getAIResponse(message) {
    message = message.toLowerCase();

    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
        if (keyword !== 'default' && message.includes(keyword)) {
            return response;
        }
    }

    // If no keyword matches, return default response
    return predefinedResponses.default;
}

// Sanitize user input to prevent XSS
function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}