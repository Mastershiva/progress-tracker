/**
 * ===== CHATBOT.JS =====
 * AI Chatbot functionality
 * 
 * Handles:
 * - Send chat messages
 * - Display chat history
 * - Quick suggestion buttons
 */

document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
    setupChatbot();
    loadChatHistory();
});

/**
 * Setup chatbot
 */
function setupChatbot() {
    const chatForm = document.getElementById("chatForm");
    if (chatForm) {
        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const chatInput = document.getElementById("chatInput");
            const message = chatInput.value.trim();
            
            if (!message) return;
            
            // Display user message
            displayUserMessage(message);
            chatInput.value = "";
            
            try {
                const token = getToken();
                const response = await sendChatMessage(message, token);
                
                if (response.success && response.data) {
                    displayBotMessage(response.data.botResponse);
                }
            } catch (error) {
                displayBotMessage("Sorry, I encountered an error. Please try again.");
                console.error("Chat error:", error);
            }
        });
    }
}

/**
 * Display user message in chat
 */
function displayUserMessage(message) {
    const messagesContainer = document.getElementById("chatMessages");
    const messageEl = document.createElement("div");
    messageEl.className = "chat-message user-message";
    messageEl.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Display bot message in chat
 */
function displayBotMessage(message) {
    const messagesContainer = document.getElementById("chatMessages");
    const messageEl = document.createElement("div");
    messageEl.className = "chat-message bot-message";
    messageEl.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Load chat history
 */
async function loadChatHistory() {
    try {
        const token = getToken();
        const response = await getChatHistory(token);
        
        if (response.success && response.data) {
            const messages = response.data;
            const messagesContainer = document.getElementById("chatMessages");
            
            // Clear existing messages except the initial welcome
            const existingMessages = messagesContainer.querySelectorAll(".chat-message");
            if (existingMessages.length > 1) {
                existingMessages.forEach((el, index) => {
                    if (index > 0) el.remove();
                });
            }
            
            // Load previous messages
            messages.slice(-10).forEach(msg => { // Show last 10 messages
                displayUserMessage(msg.userMessage);
                displayBotMessage(msg.botResponse);
            });
        }
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
}

/**
 * Send suggestion
 */
function sendSuggestion(text) {
    const chatInput = document.getElementById("chatInput");
    chatInput.value = text;
    chatInput.focus();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
