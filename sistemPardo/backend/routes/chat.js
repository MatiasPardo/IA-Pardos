const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');
const sessionService = require('../services/sessionService');
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
    const { prompt, model, sessionId } = req.body;
    const selectedModel = model || 'pardos-assistant:latest';
    
    console.log('Received prompt:', prompt);
    console.log('Using model:', selectedModel);
    console.log('Session ID:', sessionId);

    try {
        // Obtener contexto de la sesión
        const context = sessionService.getContext(sessionId);
        
        // Construir prompt con contexto
        const fullPrompt = context ? 
            `${context}\nUsuario: ${prompt}` : 
            `Usuario: ${prompt}`;

        // Generar respuesta
        const reply = await ollamaService.generateResponse(selectedModel, fullPrompt);
        
        // Guardar en sesión
        if (sessionId) {
            sessionService.addMessage(sessionId, prompt, reply);
        }

        res.json({ reply });
        console.log('Response sent');

    } catch (error) {
        console.error('Error al contactar Ollama:', error);
        res.status(500).json({ error: 'Error al contactar Ollama' });
    }
});

module.exports = router;