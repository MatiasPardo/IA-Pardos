const fs = require('fs');
const path = require('path');

class ChatService {
    constructor() {
        this.dataDir = '/app/data';
        this.chatsFile = path.join(this.dataDir, 'chats.json');
        this.ensureDataDir();
        this.chats = this.loadChats();
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    loadChats() {
        try {
            return JSON.parse(fs.readFileSync(this.chatsFile, 'utf8'));
        } catch {
            return {};
        }
    }

    saveChats() {
        fs.writeFileSync(this.chatsFile, JSON.stringify(this.chats, null, 2));
    }

    createChat(username, title = 'Nueva conversación', model = 'pardos-assistant:latest') {
        const chatId = Date.now().toString();
        if (!this.chats[username]) this.chats[username] = {};
        if (!this.chats[username][model]) this.chats[username][model] = {};
        
        this.chats[username][model][chatId] = {
            id: chatId,
            title,
            model,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.saveChats();
        return chatId;
    }

    getUserChats(username, model = null) {
        if (!this.chats[username]) return [];
        
        if (model) {
            return Object.values(this.chats[username][model] || {})
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        
        // Si no se especifica modelo, devolver todos
        const allChats = [];
        Object.keys(this.chats[username]).forEach(modelKey => {
            allChats.push(...Object.values(this.chats[username][modelKey] || {}));
        });
        return allChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    getChat(username, chatId, model = null) {
        if (!this.chats[username]) return null;
        
        if (model) {
            return this.chats[username][model]?.[chatId] || null;
        }
        
        // Buscar en todos los modelos
        for (const modelKey of Object.keys(this.chats[username])) {
            if (this.chats[username][modelKey][chatId]) {
                return this.chats[username][modelKey][chatId];
            }
        }
        return null;
    }

    addMessage(username, chatId, message, response, model = null) {
        const chat = this.getChat(username, chatId, model);
        if (!chat) return false;

        chat.messages.push({
            timestamp: new Date().toISOString(),
            message,
            response
        });

        chat.updatedAt = new Date().toISOString();
        
        // Auto-generar título basado en el primer mensaje
        if (chat.messages.length === 1) {
            chat.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
        }

        this.saveChats();
        return true;
    }

    deleteChat(username, chatId, model = null) {
        if (!this.chats[username]) return false;
        
        if (model) {
            if (this.chats[username][model]?.[chatId]) {
                delete this.chats[username][model][chatId];
                this.saveChats();
                return true;
            }
        } else {
            // Buscar en todos los modelos
            for (const modelKey of Object.keys(this.chats[username])) {
                if (this.chats[username][modelKey][chatId]) {
                    delete this.chats[username][modelKey][chatId];
                    this.saveChats();
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = new ChatService();