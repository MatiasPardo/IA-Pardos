const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { createToken, hashPassword } = require('../utils/auth');
const { authenticate } = require('../middleware/auth');

// Registro
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    
    if (userService.userExists(username)) {
        return res.status(400).json({ error: 'Usuario ya existe' });
    }
    
    const hashedPassword = hashPassword(password);
    userService.createUser(username, hashedPassword);
    
    res.json({ message: 'Usuario creado' });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    
    if (!userService.validateUser(username, hashedPassword)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = createToken({ username, exp: Date.now() + 24*60*60*1000 });
    res.json({ token, username });
});

// Verificar token
router.get('/verify', authenticate, (req, res) => {
    res.json({ username: req.user.username });
});

module.exports = router;