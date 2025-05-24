document.getElementById('registerPForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const messageElement = document.getElementById("messagePessoa");

    const namePer = document.getElementById('namePer').value;
    const emailPer = document.getElementById('emailPer').value;
    const passwordPer = document.getElementById('passwordPer').value;
    const cpfPer = document.getElementById('cpfPer').value;
    const historyPer = document.getElementById('historyPer').value;

    try {
        const response = await fetch('./auth/registerPB', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namePer, emailPer, passwordPer, cpfPer, historyPer })
        });

        if (!response.ok) {
            messageElement.innerText = "❌ Cadastro não realizado.";
            messageElement.style.color = "red";
            return;
        }

        let messageText = "✅ Cadastro realizado com sucesso!";
        if (response.headers.get("content-type")?.includes("application/json")) {
            const data = await response.json();
            if (data?.message) messageText = data.message;
        }

        messageElement.innerText = messageText;
        messageElement.style.color = "green";

        setTimeout(() => {
            window.location.href = './confirmar.html';
        }, 1000);

    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        messageElement.innerText = "❌ Erro ao enviar o formulário.";
        messageElement.style.color = "red";
    }
});
