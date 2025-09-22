const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');
const sessionService = require('../services/sessionService');
const chatService = require('../services/chatService');
const { authenticate } = require('../middleware/auth');

// Obtener modelos
router.get('/models', authenticate, async (req, res) => {
    console.log('Consultando modelos de Ollama...');
    
    try {
        const data = await ollamaService.getModels();
        res.json(data);
        console.log('Modelos obtenidos:', data);
    } catch (error) {
        console.error('Error al contactar Ollama para modelos:', error);
        res.status(500).json({ error: 'Error al contactar Ollama' });
    }
});

// Crear nueva sesión
router.post('/session', authenticate, (req, res) => {
    const model = req.body.model || 'pardos-assistant:latest';
    const sessionId = sessionService.createSession(model);
    res.json({ sessionId });
});

// Chat con contexto
router.post('/chat', authenticate, async (req, res) => {
    const { prompt, model, sessionId, chatId } = req.body;
    const selectedModel = model || 'pardos-assistant:latest';
    
    console.log('Received prompt:', prompt);
    console.log('Using model:', selectedModel);
    console.log('Chat ID:', chatId);

    try {
        // Obtener contexto del chat si existe
        let context = '';
        if (chatId) {
            const chat = chatService.getChat(req.user.username, chatId);
            if (chat && chat.messages.length > 0) {
                context = chat.messages.slice(-5).map(m => 
                    `Usuario: ${m.message}\nAsistente: ${m.response}`
                ).join('\n');
            }
        }
        
        // Construir prompt con contexto
        const fullPrompt = context ? 
            `${context}\nUsuario: ${prompt}` : 
            `Usuario: ${prompt}`;

        // Generar respuesta
        const reply = await ollamaService.generateResponse(selectedModel, fullPrompt);
        
        // Guardar en historial de chat
        if (chatId) {
            chatService.addMessage(req.user.username, chatId, prompt, reply);
        }

        res.json({ reply });
        console.log('Response sent');

    } catch (error) {
        console.error('Error al contactar Ollama:', error);
        res.status(500).json({ error: 'Error al contactar Ollama' });
    }
});

module.exports = router;