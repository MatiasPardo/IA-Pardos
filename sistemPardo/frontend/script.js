
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      console.log(`Navigating to ${link.href}`);
    });
  });

  const openChat = document.getElementById("open-chat");
  const chatBox = document.getElementById("chat-box");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  const responses = [
    { keywords: ["quarkus"], answer: "Tengo 3 años de experiencia usando Quarkus en proyectos productivos." },
    { keywords: ["java"], answer: "Trabajo con Java desde hace más de 9 años." },
    { keywords: ["spring", "springboot"], answer: "Tengo 4 años de experiencia usando Spring Boot." },
    { keywords: ["nest"], answer: "Uso Nest.js desde hace 1 año." },
    { keywords: ["nosql"], answer: "Trabajo con bases NoSQL desde hace entre 4 y 5 años, principalmente MongoDB." },
    { keywords: ["sql"], answer: "Tengo experiencia con SQL desde hace más de 3 años." },
    { keywords: ["python"], answer: "He usado Python en proyectos académicos y personales, especialmente para clasificación de imágenes con RNA." },
    { keywords: ["react"], answer: "Conozco React y lo utilicé en algunos proyectos universitarios." },
    { keywords: ["contactar", "contactarse", "telegram", "contacto"], answer: "Podés escribirme directamente por Telegram: <a href='https://t.me/mattpardo' target='_blank'>@mattpardo</a>." }
  ];

  function handleUserInput() {
    const userInput = chatInput.value.toLowerCase().trim();
    if (!userInput) return;

    chatMessages.innerHTML += `<div><strong>Vos:</strong> ${userInput}</div>`;
    let answered = false;
    for (const entry of responses) {
      for (const keyword of entry.keywords) {
        if (userInput.includes(keyword)) {
          chatMessages.innerHTML += `<div><strong>IA:</strong> ${entry.answer}</div>`;
          answered = true;
          break;
        }
      }
      if (answered) break;
    }

    if (!answered) {
      chatMessages.innerHTML += `<div><strong>IA:</strong> No tengo una respuesta precisa para eso. Algunas cosas que podés preguntarme son:<ul>
        <li>¿Cuánta experiencia tenés en Java?</li>
        <li>¿Qué es lo que hiciste con Quarkus?</li>
        <li>¿Cómo te contacto?</li>
        <li>¿Qué sabés de DevOps?</li>
        <li>¿Tenés experiencia con React?</li>
        </ul></div>`;
    }

    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (openChat && chatBox) {
    openChat.addEventListener("click", () => {
      chatBox.classList.toggle("hidden");
    });
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleUserInput();
      }
    });
  }

  if (chatSend) {
    chatSend.addEventListener("click", handleUserInput);
  }
});
