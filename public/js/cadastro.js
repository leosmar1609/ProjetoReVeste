document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const messageElement = document.getElementById("messageInc");
    const cnpjInput = document.getElementById('cnpjInc');

    cnpjInput.addEventListener('input', () => {
        let value = cnpjInput.value.replace(/\D/g, '');

        if (value.length > 14) value = value.slice(0, 14);

        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');

        cnpjInput.value = value;
    });

    const telInput = document.getElementById('telInc');

telInput.addEventListener('input', () => {
    let value = telInput.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length >= 11) {
        telInput.value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length >= 7) {
        telInput.value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length >= 3) {
        telInput.value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        telInput.value = value;
    }
});

    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    const emailRegex = /^[a-zA-Z]{3}[a-zA-Z0-9._]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const telRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInc = document.getElementById('nameInc').value;
        const emailInc = document.getElementById('emailInc').value;
        const passwordInc = document.getElementById('passwordInc').value;
        const cnpjMasked = cnpjInput.value;
        const cleanCnpj = cnpjMasked.replace(/\D/g, '');
        const locationInc = document.getElementById('locationInc').value;
        const telInc = document.getElementById('telInc').value;

        if (!telRegex.test(telInc)) {
            messageElement.innerText = "❌ Telefone inválido. Use o formato (00) 00000-0000.";
            messageElement.style.color = "red";
            return;
        }

        if (!cnpjRegex.test(cnpjMasked)) {
            messageElement.innerText = "❌ CNPJ inválido. Use o formato 00.000.000/0000-00";
            messageElement.style.color = "red";
            return;
        }

        if (!senhaRegex.test(passwordInc)) {
            messageElement.innerText = "❌ A senha deve conter ao menos 6 caracteres, incluindo maiúscula, minúscula e símbolo.";
            messageElement.style.color = "red";
            return;
        }

        if (!emailRegex.test(emailInc)) {
            messageElement.innerText = "❌ E-mail inválido.";
            messageElement.style.color = "red";
            return;
        }

        try {
            const res = await fetch(`/instituicao?email=${emailInc}&cnpj=${cleanCnpj}`);
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    messageElement.innerText = data.message || "❌ E-mail ou CNPJ já cadastrados.";
                    messageElement.style.color = "red";
                    return;
                }
            }

            const response = await fetch('/auth/registerIB', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nameInc,
                    emailInc,
                    passwordInc,
                    cnpjInc: cleanCnpj,
                    locationInc,
                    telInc
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
