document.getElementById('registerForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const messageElement = document.getElementById("messageInc");

    const nameInc = document.getElementById('nameInc').value;
    const emailInc = document.getElementById('emailInc').value;
    const passwordInc = document.getElementById('passwordInc').value;
    const cnpjInc = document.getElementById('cnpjInc').value;
    const locationInc = document.getElementById('locationInc').value;
    const historyInc = document.getElementById('historyInc').value;

    const response = await fetch('./auth/registerIB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc })
    });

    const data = await response.json();
    
            if (!response.ok) {
                messageElement.innerText = "❌ Cadastro não realizado.";
                messageElement.style.color = "red";
                return;
            }
            messageElement.innerText = "✅ Cadastro realizado com sucesso!";
            messageElement.style.color = "green";
});