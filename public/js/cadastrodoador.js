document.getElementById('registerFormDoador').addEventListener('submit', async(e) => {
    e.preventDefault();

    const messageElement = document.getElementById("messageDoador");

    const namedonor = document.getElementById('namedonor').value;
    const emaildonor = document.getElementById('emaildonor').value;
    const passworddonor = document.getElementById('passworddonor').value;

    const response = await fetch('./auth/registerdonor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namedonor, emaildonor, passworddonor })
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