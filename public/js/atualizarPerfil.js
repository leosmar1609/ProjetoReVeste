// atualizarPerfil.js

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");

  if (!idPerfil || !formAlterar) return;

  formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idPerfil;
    const namePer = document.getElementById("inputName").value.trim();
    const emailPer = document.getElementById("inputEmail").value.trim();
    const passwordPer = document.getElementById("inputPassword").value.trim();
    const cpfPer = document.getElementById("inputCpf").value.trim();
    const historyPer = document.getElementById("inputHistory").value.trim();

    if (!namePer || !emailPer || !passwordPer || !cpfPer || !historyPer) {
      msgModal.style.color = "red";
      msgModal.textContent = "Preencha todos os campos.";
      return;
    }

    try {
      const res = await fetch(`./auth/pessoaup/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, namePer, emailPer, passwordPer, cpfPer, historyPer }),
      });

      const resultado = await res.json();

      if (res.ok) {
        msgModal.style.color = "green";
        msgModal.textContent = "Dados atualizados com sucesso!";
        document.getElementById("namePer").textContent = namePer;
        document.getElementById("emailPer").textContent = emailPer;
        document.getElementById("historyPer").textContent = historyPer;

        document.getElementById("inputPassword").value = "";

        setTimeout(() => {
          document.getElementById("modalEditar").classList.remove("active");
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
