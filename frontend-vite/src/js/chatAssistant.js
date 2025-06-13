/**
 * SmartSaku AI Chat Component
 * This module handles the chat UI and interactions with the AI assistant
 */

import { API_BASE_URL, API_ENDPOINTS } from '../config/api.js';

class ChatAssistant {
    constructor() {
        this.isOpen = false;
        this.isOnline = true; // Default to online, will check status
        this.container = null;
        this.button = null;
        this.messages = [];

        // Delay initialization to ensure DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing SmartSaku Chat Assistant');

        // Create chat button
        this.createChatButton();

        // Create chat container (initially hidden)
        this.createChatContainer();

        // Add event listeners
        this.addEventListeners();

        // Check AI service status
        this.checkAIStatus();
    }
    createChatButton() {
        // Remove existing chat button if any (to prevent duplicates)
        const existingButton = document.querySelector('.chat-button');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.className = 'chat-button';
        button.id = 'smartsaku-chat-button';
        button.setAttribute('aria-label', 'Chat dengan SmartSaku AI Assistant');
        button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="ai-badge">AI</span>
    `;

        // Ensure button is placed in the bottom right corner
        document.body.appendChild(button);
        this.button = button;

        // Log for debugging
        console.log('Chat button created and appended to body');
    }

    createChatContainer() {
        const container = document.createElement('div');
        container.className = 'chat-container';
        container.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div>
            SmartSaku AI
            <span class="status-indicator ${this.isOnline ? 'status-online' : 'status-offline'}"></span>
            <span class="status-text">${this.isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <button class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="chat-body">
        <div class="message ai">
          <p>Halo! Saya SmartSaku AI Assistant. Silakan tanya seputar keuangan! <span>💰</span></p>
        </div>
      </div>
      <div class="chat-footer">
        <div class="chat-input-container">
          <input type="text" class="chat-input" placeholder="Tanya tentang keuangan...">
          <button class="send-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="suggestion-chips">
          <div class="suggestion-chip">👍 Tips nabung</div>
          <div class="suggestion-chip">📊 Investasi</div>
          <div class="suggestion-chip">💼 Budget</div>
        </div>
      </div>
    `;

        document.body.appendChild(container);
        this.container = container;

        // Get references to elements
        this.chatBody = container.querySelector('.chat-body');
        this.chatInput = container.querySelector('.chat-input');
        this.sendButton = container.querySelector('.send-button');
        this.closeButton = container.querySelector('.close-button');
        this.statusIndicator = container.querySelector('.status-indicator');
        this.statusText = container.querySelector('.status-text');
        this.suggestionChips = container.querySelectorAll('.suggestion-chip');
    }

    addEventListeners() {
        // Toggle chat on button click
        this.button.addEventListener('click', () => this.toggleChat());

        // Close chat on close button click
        this.closeButton.addEventListener('click', () => this.closeChat());

        // Handle send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Handle enter key press in input
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Handle suggestion chips
        this.suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.chatInput.value = chip.textContent;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('active', this.isOpen);

        if (this.isOpen) {
            this.chatInput.focus();
        }
    }

    openChat() {
        this.isOpen = true;
        this.container.classList.add('active');
        this.chatInput.focus();
    }

    closeChat() {
        this.isOpen = false;
        this.container.classList.remove('active');
    } async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input
        this.chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();
        console.log('Sending message to chat API:', message);

        try {
            // Send message to API (http://202.10.35.227/chat)
            const response = await fetch(API_ENDPOINTS.CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            console.log('Response received from chat API');

            const data = await response.json();
            console.log('Chat API response:', data);

            // Remove typing indicator
            this.removeTypingIndicator();

            // Add AI response to chat
            if (data.reply) {
                this.addMessage(data.reply, 'ai');
            } else {
                this.addMessage('Maaf, saya tidak bisa memproses pesan Anda saat ini. Silakan coba lagi nanti.', 'ai');
            }
        } catch (error) {
            console.error('Error sending message:', error);

            // Remove typing indicator
            this.removeTypingIndicator();

            // Show error message
            this.addMessage('Maaf, ada masalah saat menghubungi layanan AI. Silakan coba lagi nanti.', 'ai');

            // Update status to offline
            this.updateStatus(false);
        }
    }

    addMessage(content, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}`;
        messageEl.innerHTML = `<p>${content}</p>`;

        this.chatBody.appendChild(messageEl);

        // Scroll to bottom
        this.chatBody.scrollTop = this.chatBody.scrollHeight;

        // Store message
        this.messages.push({ content, sender });
    }

    showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai typing-indicator';
        typingIndicator.innerHTML = '<p>...</p>';

        this.chatBody.appendChild(typingIndicator);
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = this.chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    } async checkAIStatus() {
        console.log('Checking AI service status...');
        try {
            // Ping the API to check if AI service is available
            const response = await fetch(API_ENDPOINTS.CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'ping' })
            });

            const online = response.ok;
            console.log('AI service status:', online ? 'online' : 'offline');
            this.updateStatus(online);
        } catch (error) {
            console.error('Error checking AI service status:', error);
            this.updateStatus(false);
        }
    }

    updateStatus(online) {
        this.isOnline = online;

        // Update status indicator
        if (this.statusIndicator) {
            this.statusIndicator.className = `status-indicator ${online ? 'status-online' : 'status-offline'}`;
        }

        // Update status text
        if (this.statusText) {
            this.statusText.textContent = online ? 'Online' : 'Offline';
        }
    }
}

// Export the ChatAssistant class
export default ChatAssistant;
