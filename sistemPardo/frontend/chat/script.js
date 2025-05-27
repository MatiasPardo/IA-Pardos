
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const responseDiv = document.getElementById('response');

    sendBtn.addEventListener('click', async () => {
        const prompt = userInput.value.trim();
        if (!prompt) return;

        responseDiv.innerText = 'Enviando...';

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            responseDiv.innerText = data.reply || 'Sin respuesta.';
        } catch (error) {
            console.error('Error:', error);
            responseDiv.innerText = 'Error al contactar el backend.';
        }
    });
});
