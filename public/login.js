document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const messageElement = document.getElementById("message");

    if (!loginForm) {
        console.error("Erro: Formulário não encontrado!");
        return;
    }

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const userType = document.getElementById("userType").value;

        try {
            const response = await fetch('./auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    userType
                })
            });

            const data = await response.json();

            if (!response.ok || !data || !data.id) {
                // Algo deu errado no login ou ID não retornado
                messageElement.innerText = "❌ Login inválido ou usuário não encontrado.";
                messageElement.style.color = "red";
                return;
            }

            // Login bem-sucedido
            messageElement.innerText = "✅ Login realizado com sucesso!";
            messageElement.style.color = "green";

            // Redireciona para a página correta com o ID
            setTimeout(() => {
                switch (userType) {
                    case "pessoa":
                        window.location.href = `pessoaBeneficiaria.html?id=${data.id}`;
                        break;
                    case "instituicao":
                        window.location.href = `instituicaoBeneficiaria.html?id=${data.id}`;
                        break;
                    case "doador":
                        window.location.href = `doador.html?id=${data.id}`;
                        break;
                    default:
                        window.location.href = "login.html";
                }
            }, 2000);

        } catch (error) {
            messageElement.innerText = "❌ Erro ao conectar ao servidor.";
            messageElement.style.color = "red";
            console.error("Erro:", error);
        }
    });
});