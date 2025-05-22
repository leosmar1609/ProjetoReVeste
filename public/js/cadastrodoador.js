document.getElementById('registerFormDoador').addEventListener('submit', async(e) => {
    e.preventDefault();

    const messageElement = document.getElementById("messageDoador");

    const namedonor = document.getElementById('namedonor').value;
    const emaildonor = document.getElementById('emaildonor').value;
    const passworddonor = document.getElementById('passworddonor').value;

    try {
        const response = await fetch('./auth/registerdonor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namedonor, emaildonor, passworddonor })
        });

        if (!response.ok) {
            messageElement.innerText = "❌ Cadastro não realizado.";
            messageElement.style.color = "red";
            return;
        }

        // Tenta obter mensagem do backend se houver JSON
        let messageText = "✅ Cadastro realizado com sucesso!";
        if (response.headers.get("content-type")?.includes("application/json")) {
            const data = await response.json();
            if (data?.message) messageText = data.message;
        }

        messageElement.innerText = messageText;
        messageElement.style.color = "green";

        // Espera 3 segundos, depois redireciona
        setTimeout(() => {
            window.location.href = '/login.html'; // ajuste o caminho se necessário
        }, 3000);

    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        messageElement.innerText = "❌ Erro ao enviar o formulário.";
        messageElement.style.color = "red";
    }
});
