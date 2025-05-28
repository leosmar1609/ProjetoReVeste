document.getElementById('registerFormDoador').addEventListener('submit', async(e) => {
    e.preventDefault();

    const messageElement = document.getElementById("messageDoador");

    const namedonor = document.getElementById('namedonor').value;
    const emaildonor = document.getElementById('emaildonor').value;
    const passworddonor = document.getElementById('passworddonor').value;
    const emailRegex = /^[a-zA-Z]{3}[a-zA-Z0-9._]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    if (!emailRegex.test(emaildonor)) {
            messageElement.innerText = "❌ E-mail inválido.";
            messageElement.style.color = "red";
            return;
        }
        if (!senhaRegex.test(passworddonor)) {
            messageElement.innerText = "❌ A senha deve ter no mínimo 6 caracteres, incluindo letra maiúscula, minúscula e caractere especial.";
            messageElement.style.color = "red";
            return;
        }
        messageElement.innerText = "⏳ Enviando dados...";
        messageElement.style.color = "black";

    try {
        const response = await fetch('./auth/registerdonor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namedonor, emaildonor, passworddonor })
        });

        if (!response.ok) {
            messageElement.innerText = "❌ E-mail já cadastrado.";
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
            window.location.href = './login.html';
        }, 1000);

    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        messageElement.innerText = "❌ Erro ao enviar o formulário.";
        messageElement.style.color = "red";
    }
});
