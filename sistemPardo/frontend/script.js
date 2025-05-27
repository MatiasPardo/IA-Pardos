
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            document.getElementById('response').innerText = data.message;
        })
        .catch(error => console.error('Error:', error));
});
