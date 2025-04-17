document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const messageElement = document.getElementById("message");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const emailPer = document.getElementById("emailPer").value;
            const passwordPer = document.getElementById("passwordPer").value;

            try {
                const response = await fetch(`./auth/pessoa?emailPer=${encodeURIComponent(emailPer)}&passwordPer=${encodeURIComponent(passwordPer)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    messageElement.innerText = "✅ Login realizado com sucesso!";
                    messageElement.style.color = "green";

                    setTimeout(() => {
                        window.location.href = `PerfilDoador.html?id=${data.id}`;
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