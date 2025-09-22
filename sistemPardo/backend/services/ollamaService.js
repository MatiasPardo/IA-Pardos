const fetch = require('node-fetch');

class OllamaService {
    constructor() {
        this.ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
    }

    async getModels() {
        const response = await fetch(this.ollamaUrl + "/api/tags");
        
        if (!response.ok) {
            throw new Error(`Error HTTP de Ollama: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    }

    async generateResponse(model, prompt) {
        const response = await fetch(this.ollamaUrl + "/api/generate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt,
                stream: false
            })
        });

        const rawText = await response.text();
        let data;
        
        try {
            data = JSON.parse(rawText);
        } catch (parseError) {
            throw new Error('Respuesta inválida del modelo');
        }

        if (!response.ok) {
            throw new Error('Error del modelo');
        }

        return data.response || 'Sin respuesta procesable.';
    }
}

module.exports = new OllamaService();