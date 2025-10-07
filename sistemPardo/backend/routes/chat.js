const express = require('express');
const multer = require('multer');
const router = express.Router();
const ollamaService = require('../services/ollamaService');
const sessionService = require('../services/sessionService');
const fileService = require('../services/fileService');
const { authenticate } = require('../middleware/auth');

// Configurar multer para upload de archivos
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB max
});

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

// Upload y procesar archivo ZIP
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó archivo' });
        }

        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: 'SessionId requerido' });
        }

        // Procesar el archivo ZIP
        const fileContent = fileService.processZipFile(req.file.buffer, req.file.originalname);
        
        // Guardar contexto en la sesión
        sessionService.setFileContext(sessionId, fileContent);
        
        // Opcional: guardar en disco para persistencia
        fileService.saveFileContent(sessionId, fileContent);

        res.json({ 
            message: 'Archivo procesado correctamente',
            filename: req.file.originalname,
            filesAnalyzed: fileContent.split('===').length - 1
        });

    } catch (error) {
        console.error('Error procesando archivo:', error);
        res.status(500).json({ error: 'Error procesando archivo ZIP' });
    }
});

// Chat con contexto
router.post('/chat', authenticate, async (req, res) => {
    const { prompt, model, sessionId, chatId } = req.body;
    const selectedModel = model || 'pardos-assistant:latest';
    
    console.log('Received prompt:', prompt);
    console.log('Using model:', selectedModel);
    console.log('Session ID:', sessionId);
    console.log('Chat ID:', chatId);

    try {
        // Obtener contexto de la sesión
        const context = sessionService.getContext(sessionId);
        
        // Construir prompt con contexto
        const fullPrompt = context ? 
            `${context}\nUsuario: ${prompt}` : 
            `Usuario: ${prompt}`;

        // Generar respuesta
        const reply = await ollamaService.generateResponse(selectedModel, fullPrompt);
        
        // Guardar en sesión temporal
        if (sessionId) {
            sessionService.addMessage(sessionId, prompt, reply);
        }

        // Guardar en chat persistente
        if (chatId) {
            const chatService = require('../services/chatService');
            chatService.addMessage(req.user.username, chatId, prompt, reply, selectedModel);
        }

        res.json({ reply });
        console.log('Response sent');

    } catch (error) {
        console.error('Error al contactar Ollama:', error);
        res.status(500).json({ error: 'Error al contactar Ollama' });
    }
});

module.exports = router;