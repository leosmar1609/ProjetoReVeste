document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const messageElement = document.getElementById("messageInc");
    const cnpjInput = document.getElementById('cnpjInc');

    // Máscara de CNPJ ao digitar
    cnpjInput.addEventListener('input', () => {
        let value = cnpjInput.value.replace(/\D/g, '');

        if (value.length > 14) value = value.slice(0, 14);

        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');

        cnpjInput.value = value;
    });

    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInc = document.getElementById('nameInc').value;
        const emailInc = document.getElementById('emailInc').value;
        const passwordInc = document.getElementById('passwordInc').value;
        const cnpjMasked = cnpjInput.value;
        const cleanCnpj = cnpjMasked.replace(/\D/g, '');
        const locationInc = document.getElementById('locationInc').value;
        const historyInc = document.getElementById('historyInc').value;

        // Validação CNPJ
        if (!cnpjRegex.test(cnpjMasked)) {
            messageElement.innerText = "❌ CNPJ inválido. Use o formato 00.000.000/0000-00";
            messageElement.style.color = "red";
            return;
        }

        // Validação senha
        if (!senhaRegex.test(passwordInc)) {
            messageElement.innerText = "❌ A senha deve conter ao menos 6 caracteres, incluindo maiúscula, minúscula e símbolo.";
            messageElement.style.color = "red";
            return;
        }

        try {
            // Verifica se o email ou CNPJ já existem
            const res = await fetch(`/instituicao?email=${emailInc}&cnpj=${cleanCnpj}`);
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    messageElement.innerText = data.message || "❌ E-mail ou CNPJ já cadastrados.";
                    messageElement.style.color = "red";
                    return;
                }
            }

            // Envia dados para cadastro
            const response = await fetch('/auth/registerIB', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nameInc,
                    emailInc,
                    passwordInc,
                    cnpjInc: cleanCnpj,
                    locationInc,
                    historyInc
                })
            });

            if (!response.ok) {
                const data = await response.json();
                messageElement.innerText = data.message || "❌ Erro ao realizar cadastro.";
                messageElement.style.color = "red";
                return;
            }

            messageElement.innerText = "✅ Cadastro realizado com sucesso!";
            messageElement.style.color = "green";

            setTimeout(() => {
                window.location.href = './confirmar.html';
            }, 1000);

        } catch (error) {
            console.error("Erro no envio:", error);
            messageElement.innerText = "❌ Erro ao enviar formulário.";
            messageElement.style.color = "red";
        }
    });
});
