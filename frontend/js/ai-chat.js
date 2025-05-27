// AI Chat Assistant Module
class AIChatAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = this.loadResponses();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWelcomeMessage();
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.querySelector('.chat-input');
        const sendButton = document.querySelector('.chat-send');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
    }

    loadWelcomeMessage() {
        this.messages = [
            {
                type: 'ai',
                content: 'Halo! Saya AI Assistant SmartSaku. Ada yang bisa saya bantu tentang keuangan Anda?',
                timestamp: Date.now()
            }
        ];
        this.renderMessages();
    }

    loadResponses() {
        return {
            'nabung': {
                keywords: ['nabung', 'menabung', 'tabungan', 'saving'],
                response: `Berikut tips menabung untuk mahasiswa:
                • Gunakan metode 50-30-20 (kebutuhan-keinginan-tabungan)
                • Buat target tabungan yang realistis
                • Sisihkan uang di awal bulan (pay yourself first)
                • Manfaatkan aplikasi tabungan otomatis
                • Cari penghasilan tambahan seperti freelance`
            },
            'cicilan': {
                keywords: ['cicilan', 'kredit', 'hutang', 'bayar'],
                response: `Tips mengelola cicilan:
                • Prioritaskan cicilan dengan bunga tertinggi
                • Buat jadwal pembayaran yang konsisten
                • Hindari menambah cicilan baru
                • Sisihkan dana darurat 3-6 bulan pengeluaran
                • Pertimbangkan pelunasan dipercepat jika mampu`
            },
            'hemat': {
                keywords: ['hemat', 'irit', 'menghemat', 'boros'],
                response: `Cara berhemat untuk mahasiswa:
                • Masak sendiri daripada beli makanan jadi
                • Gunakan transportasi umum atau sepeda
                • Manfaatkan diskon dan promo
                • Beli barang second yang masih bagus
                • Batasi pengeluaran hiburan maksimal 10% dari pendapatan`
            },
            'budget': {
                keywords: ['budget', 'anggaran', 'rencana keuangan'],
                response: `Membuat budget yang efektif:
                • Catat semua pemasukan dan pengeluaran
                • Kategorikan pengeluaran (wajib vs opsional)
                • Gunakan aplikasi pencatat keuangan
                • Review budget setiap minggu
                • Sesuaikan budget berdasarkan kebutuhan aktual`
            },
            'investasi': {
                keywords: ['investasi', 'invest', 'saham', 'reksadana'],
                response: `Investasi untuk pemula:
                • Mulai dari investasi rendah risiko seperti reksa dana pasar uang
                • Pelajari dasar-dasar investasi dulu
                • Diversifikasi portfolio
                • Investasi jangka panjang minimal 5 tahun
                • Sisihkan maksimal 10% pendapatan untuk investasi`
            },
            'uang saku': {
                keywords: ['uang saku', 'allowance', 'pocket money'],
                response: `Mengelola uang saku dengan bijak:
                • Bagi uang saku menjadi pos-pos pengeluaran
                • Gunakan envelope method (amplop digital)
                • Catat setiap pengeluaran sekecil apapun
                • Sisihkan 20% untuk tabungan
                • Evaluasi pengeluaran setiap minggu`
            },
            'default': {
                keywords: [],
                response: `Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang:
                • Tips menabung dan menghemat
                • Cara membuat budget
                • Mengelola cicilan dan hutang
                • Investasi untuk pemula
                • Manajemen uang saku

                Atau ketik pertanyaan Anda dengan lebih spesifik! 😊`
            }
        };
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.remove('hidden');
            this.isOpen = true;
            this.scrollToBottom();
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.add('hidden');
            this.isOpen = false;
        }
    }

    sendMessage() {
        const input = document.querySelector('.chat-input');
        if (!input || !input.value.trim()) return;

        const userMessage = input.value.trim();

        // Add user message
        this.addMessage('user', userMessage);

        // Clear input
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Generate AI response after delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(userMessage);
            this.addMessage('ai', response);
        }, 1000 + Math.random() * 2000); // 1-3 seconds delay
    }

    addMessage(type, content) {
        const message = {
            type: type,
            content: content,
            timestamp: Date.now()
        };

        this.messages.push(message);
        this.renderMessages();
        this.scrollToBottom();
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Find matching response based on keywords
        for (const [key, responseData] of Object.entries(this.responses)) {
            if (key === 'default') continue;

            if (responseData.keywords.some(keyword => message.includes(keyword))) {
                return responseData.response;
            }
        }

        // Return default response if no match found
        return this.responses.default.response;
    }

    showTyping() {
        const container = document.querySelector('.chat-content');
        if (!container) return;

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator bg-gray-100 rounded-lg p-3';
        typingIndicator.innerHTML = `
            <div class="flex items-center space-x-1">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-sm text-gray-500 ml-2">AI sedang mengetik...</span>
            </div>
        `;

        container.appendChild(typingIndicator);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    renderMessages() {
        const container = document.querySelector('.chat-content');
        if (!container) return;

        const messagesHtml = this.messages.map(message => {
            const isAI = message.type === 'ai';
            const timeStr = new Date(message.timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="chat-message ${isAI ? 'ai' : 'user'} ${isAI ? 'bg-gray-100' : 'bg-primary/10 ml-8'} rounded-lg p-3">
                    <div class="flex items-start space-x-2">
                        ${isAI ? '<i class="fas fa-robot text-primary mt-1"></i>' : '<i class="fas fa-user text-gray-600 mt-1"></i>'}
                        <div class="flex-1">
                            <p class="text-sm whitespace-pre-line">${message.content}</p>
                            <span class="text-xs text-gray-500 mt-1 block">${timeStr}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = messagesHtml;
    }

    scrollToBottom() {
        const container = document.querySelector('.chat-content');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }

    addQuickReply(question) {
        this.addMessage('user', question);
        setTimeout(() => {
            const response = this.generateResponse(question);
            this.addMessage('ai', response);
        }, 1000);
    }

    exportChatHistory() {
        const history = this.messages.map(msg => ({
            type: msg.type,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toISOString()
        }));

        const blob = new Blob([JSON.stringify(history, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearChat() {
        this.messages = [];
        this.loadWelcomeMessage();
    }
}

// Export for use in other modules
window.AIChatAssistant = AIChatAssistant;