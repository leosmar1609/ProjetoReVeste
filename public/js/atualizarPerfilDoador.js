document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");

  if (!idPerfil || !formAlterar) return;

  formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idPerfil;
    const nameDoador = document.getElementById("inputName")?.value.trim();
    const emailDoador = document.getElementById("inputEmail")?.value.trim();
    const passwordDoador = document.getElementById("inputPassword")?.value.trim();

    if (!nameDoador || !emailDoador || !passwordDoador) {
      msgModal.style.color = "red";
      msgModal.textContent = "Preencha todos os campos.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailDoador)) {
      msgModal.style.color = "red";
      msgModal.textContent = "Digite um e-mail válido.";
      return;
    }

    if (passwordDoador.length < 6) {
      msgModal.style.color = "red";
      msgModal.textContent = "A senha deve ter pelo menos 6 caracteres.";
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      msgModal.style.color = "red";
      msgModal.textContent = "Usuário não autenticado.";
      return;
    }

    try {
      const res = await fetch(`./auth/doadorup/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ nameDoador, emailDoador, passwordDoador }),
      });

      const resultado = await res.json();

      if (res.ok) {
        msgModal.style.color = "green";
        msgModal.textContent = "Dados atualizados com sucesso!";

        const nomeExibido = document.getElementById("nameDoador");
        const emailExibido = document.getElementById("emailDoador");

        if (nomeExibido) nomeExibido.textContent = nameDoador;
        if (emailExibido) emailExibido.textContent = emailDoador;

        document.getElementById("inputPassword").value = "";

        setTimeout(() => {
          const modal = document.getElementById("modalEditar");
          if (modal) modal.classList.remove("active");

          msgModal.textContent = "";
          msgModal.style.color = "";
        }, 2000);
      } else {
        msgModal.style.color = "red";
        msgModal.textContent = resultado.mensagem || "Erro ao atualizar dados.";
      }
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      msgModal.style.color = "red";
      msgModal.textContent = "Erro ao conectar ao servidor.";
    }
  });
});
