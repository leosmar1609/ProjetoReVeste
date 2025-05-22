document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const messageElement = document.getElementById("messageInc");

        try {
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

            if (!response.ok) {
                messageElement.innerText = "❌ Cadastro não realizado.";
                messageElement.style.color = "red";
                return;
            }

            // Só tenta fazer o .json() se houver conteúdo
            let messageText = "✅ Cadastro realizado com sucesso!";
            if (response.headers.get("content-type")?.includes("application/json")) {
                const data = await response.json();
                if (data?.message) messageText = data.message;
            }

            messageElement.innerText = messageText;
            messageElement.style.color = "green";

            setTimeout(() => {
            window.location.href = '/login.html'; // ajuste o caminho se necessário
        }, 3000);

        } catch (error) {
            console.error("Erro ao enviar o formulário:", error);
            messageElement.innerText = "❌ Erro ao enviar o formulário.";
            messageElement.style.color = "red";
        }
    });
});
