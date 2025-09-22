const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const { authenticate } = require('../middleware/auth');

// Obtener todos los chats del usuario
router.get('/', authenticate, (req, res) => {
    try {
        const model = req.query.model;
        const chats = chatService.getUserChats(req.user.username, model);
        res.json({ chats });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener chats' });
    }
});

// Crear nuevo chat
router.post('/', authenticate, (req, res) => {
    try {
        const { title, model } = req.body;
        const chatId = chatService.createChat(req.user.username, title, model);
        res.json({ chatId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear chat' });
    }
});

// Obtener chat específico
router.get('/:chatId', authenticate, (req, res) => {
    try {
        const model = req.query.model;
        const chat = chatService.getChat(req.user.username, req.params.chatId, model);
        if (!chat) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }
        res.json({ chat });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener chat' });
    }
});

// Eliminar chat
router.delete('/:chatId', authenticate, (req, res) => {
    try {
        const model = req.query.model;
        const deleted = chatService.deleteChat(req.user.username, req.params.chatId, model);
        if (!deleted) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar chat' });
    }
});

module.exports = router;