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
            fileContext: null,
            createdAt: new Date()
        });
        return sessionId;
    }

    setFileContext(sessionId, fileContext) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.fileContext = fileContext;
        }
    }

    getFileContext(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? session.fileContext : null;
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
        
        let context = '';
        
        // Agregar contexto del archivo si existe
        if (session.fileContext) {
            context += `CONTEXTO DE ARCHIVO:\n${session.fileContext}\n\n`;
        }
        
        // Agregar historial de mensajes
        context += session.messages.map(msg => 
            `${msg.role}: ${msg.content}`
        ).join('\n');
        
        return context;
    }
}

module.exports = new SessionService();