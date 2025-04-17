document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const messageElement = document.getElementById("message");

    if (loginForm) {
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

                if (response.ok) {
                    messageElement.innerText = "✅ Login realizado com sucesso!";
                    messageElement.style.color = "green";

                    setTimeout(() => {
                        // Redirecionar para a página específica do tipo de usuário
                        window.location.href = `${userType}Dashboard.html?id=${data.id}`;
                    }, 2000);
                } else {
                    messageElement.innerText = "❌ " + data.error;
                    messageElement.style.color = "red";
                }
            } catch (error) {
                messageElement.innerText = "❌ Erro ao conectar ao servidor.";
                messageElement.style.color = "red";
                console.error("Erro:", error);
            }
        });
    } else {
        console.error("Erro: Formulário não encontrado!");
    }
});