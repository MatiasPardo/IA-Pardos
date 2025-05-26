import requests

data = {
    "model": "llama3",
    "prompt": "¿Cuál es la capital de Francia?"
}

response = requests.post("http://localhost:11434/api/generate", json=data)
respuesta_json = response.json()

print(respuesta_json["response"])
