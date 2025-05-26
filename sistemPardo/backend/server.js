const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(ollamaUrl+"/api/generate", {
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
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      res.status(500).json({ error: 'Respuesta inválida del modelo', raw: rawText });
    }

  } catch (error) {
    console.error('Error al contactar Ollama:', error);
    res.status(500).json({ error: 'Error interno en el backend' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en puerto ${PORT}`));