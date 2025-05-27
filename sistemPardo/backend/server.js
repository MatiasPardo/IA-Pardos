
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Only allow frontend origin
const allowedOrigins = ['http://localhost', 'http://127.0.0.1', 'http://<EC2_PUBLIC_IP>', 'https://<your-domain>'];

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

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
