document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('cpfPer');

    // Aplica a máscara ao digitar
    cpfInput.addEventListener('input', () => {
        let value = cpfInput.value.replace(/\D/g, ''); // Remove não numéricos

        // Limita a 11 dígitos
        if (value.length > 11) value = value.slice(0, 11);

        // Aplica formatação de CPF
        if (value.length > 9) {
            cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
        } else if (value.length > 3) {
            cpfInput.value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
        } else {
            cpfInput.value = value;
        }
    });

    // Lida com envio do formulário
    document.getElementById('registerPForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const messageElement = document.getElementById("messagePessoa");

        const namePer = document.getElementById('namePer').value;
        const emailPer = document.getElementById('emailPer').value;
        const passwordPer = document.getElementById('passwordPer').value;
        const cpfRaw = document.getElementById('cpfPer').value;
        const historyPer = document.getElementById('historyPer').value;

        // Validação do CPF com pontos e traço
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpfRaw)) {
            messageElement.innerText = "❌ CPF inválido. Use o formato 000.000.000-00.";
            messageElement.style.color = "red";
            return;
        }

        // Remove pontuação para envio ao backend
        const cpfPer = cpfRaw.replace(/[.-]/g, '');

        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
        if (!senhaRegex.test(passwordPer)) {
            messageElement.innerText = "❌ A senha deve ter no mínimo 6 caracteres, incluindo letra maiúscula, minúscula e caractere especial.";
            messageElement.style.color = "red";
            return;
        }

            messageElement.innerText = "⏳ Enviando dados...";
            messageElement.style.color = "black";

        try {
            const response = await fetch('./auth/registerPB', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ namePer, emailPer, passwordPer, cpfPer, historyPer })
            });

            if (!response.ok) {
                messageElement.innerText = "❌ Cadastro não realizado. CPF ou e-mail já cadastrados.";
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
});
