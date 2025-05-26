document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const messageElement = document.getElementById("message");

    if (!loginForm) {
        console.error("Erro: Formulário de login não encontrado!");
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
            console.log("Resposta da API de login:", data);

            if (!response.ok || !data || !data.id || !data.token) {
                messageElement.innerText = "❌ Dados inválidos ou email não verificado. Verifique seu e-mail";
                messageElement.style.color = "red";
                return;
            }

            localStorage.setItem('token', data.token);
            console.log("Token salvo no localStorage:", data.token);

            messageElement.innerText = "✅ Login realizado com sucesso!";
            messageElement.style.color = "green";

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
            console.error("Erro no processo de login:", error);
        }
    });
});
