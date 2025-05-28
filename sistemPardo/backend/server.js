
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
const ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';

// Only allow frontend origin
const allowedOrigins = ['http://localhost', 'http://127.0.0.1', 'http://ec2-3-145-106-227.us-east-2.compute.amazonaws.com', 'https://pardos.com.ar', 'https://www.pardos.com.ar', 'http://3.145.106.227'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    console.log('Received prompt:');
    console.log(prompt);
    try {
        const response = await fetch(ollamaUrl + "/api/generate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'pardos-assistant:latest',
                prompt: `Un persona consulta: ${prompt}`,
                stream: false
            })
        });

        const rawText = await response.text();

        try {
            const data = JSON.parse(rawText);
            res.json({ reply: data.response || 'Sin respuesta procesable.' });
            console.log('Response from Ollama:')
            console.log(data); 
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            res.status(500).json({ error: 'Respuesta inválida del modelo', raw: rawText });
        }
    } catch (error) {
        console.error('Error al contactar Ollama:', error);
        res.status(500).json({ error: 'Error al contactar Ollama' });
    }
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
