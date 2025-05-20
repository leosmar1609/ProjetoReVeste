document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");

  if (!idPerfil || !formAlterar) return;

  formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idPerfil;
    const nameDoador = document.getElementById("inputName").value.trim();
    const emailDoador = document.getElementById("inputEmail").value.trim();
    const passwordDoador = document.getElementById("inputPassword").value.trim();


    if (!nameDoador || !emailDoador || !passwordDoador ) {
      msgModal.style.color = "red";
      msgModal.textContent = "Preencha todos os campos.";
      return;
    }

    try {
      const res = await fetch(`./auth/doadorup/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, namedonor, emaildonor, passworddonor}),
      });

      const resultado = await res.json();

      if (res.ok) {
        msgModal.style.color = "green";
        msgModal.textContent = "Dados atualizados com sucesso!";
        document.getElementById("nameDoador").textContent = namedonor;
        document.getElementById("emailDoador").textContent = emaildonor;
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
