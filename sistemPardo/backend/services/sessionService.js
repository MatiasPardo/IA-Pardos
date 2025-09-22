const { generateId } = require('../utils/auth');

class SessionService {
    constructor() {
        this.sessions = new Map();
    }

    createSession(model = 'pardos-assistant:latest') {
        const sessionId = generateId();
        this.sessions.set(sessionId, {
            messages: [],
            model,
            createdAt: new Date()
        });
        return sessionId;
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    addMessage(sessionId, userMessage, assistantMessage) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.messages.push(
                { role: 'Usuario', content: userMessage },
                { role: 'Asistente', content: assistantMessage }
            );
            // Limitar a últimos 20 mensajes
            if (session.messages.length > 20) {
                session.messages = session.messages.slice(-20);
            }
        }
    }

    getContext(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return '';
        
        return session.messages.map(msg => 
            `${msg.role}: ${msg.content}`
        ).join('\n');
    }
}

module.exports = new SessionService();