const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const chatsRoutes = require('./routes/chats');

const app = express();
const port = process.env.PORT || 3000;

// Configuración CORS
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

console.log("Ollama URL:", process.env.OLLAMA_URL || 'http://ollama:11434');

// Rutas
app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api/chats', chatsRoutes);

// Iniciar servidor
const server = app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});

// Configuración de timeouts
server.timeout = 600000; // 10 minutos
server.keepAliveTimeout = 600000;
server.headersTimeout = 610000;