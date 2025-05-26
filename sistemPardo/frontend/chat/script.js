document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  async function handleUserInput() {
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    chatMessages.innerHTML += `<div><strong>Vos:</strong> ${userInput}</div>`;
    chatMessages.innerHTML += `<div><em>Matías está escribiendo...</em></div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      });

      if (!response.ok) {
        throw new Error('Error al contactar el backend');
      }

      const data = await response.json();
      const lastTyping = chatMessages.querySelector('em');
      if (lastTyping) lastTyping.remove();

      chatMessages.innerHTML += `<div><strong>Matías:</strong> ${data.reply}</div>`;
    } catch (error) {
      const lastTyping = chatMessages.querySelector('em');
      if (lastTyping) lastTyping.remove();
      chatMessages.innerHTML += `<div><strong>Matías:</strong> Hubo un error al obtener la respuesta.</div>`;
      console.error(error);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleUserInput();
    }
  });

  chatSend.addEventListener("click", handleUserInput);
});