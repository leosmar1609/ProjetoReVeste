document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");

  if (!idPerfil || !formAlterar) return;

  formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idPerfil;
    const nameInc = document.getElementById("inputName").value.trim();
    const emailInc = document.getElementById("inputEmail").value.trim();
    const passwordInc = document.getElementById("inputPassword").value.trim();
    const cnpjInc = document.getElementById("inputCNPJ").value.trim();
    const historyInc = document.getElementById("inputHistory").value.trim();
    const locationInc = document.getElementById("inputAddress").value.trim();

    if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !historyInc || !locationInc) {
      msgModal.style.color = "red";
      msgModal.textContent = "Preencha todos os campos.";
      return;
    }

    try {
      const res = await fetch(`./auth/beneficiarioup/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, nameInc, emailInc, passwordInc, cnpjInc, historyInc , locationInc }),
      });

      const resultado = await res.json();

      if (res.ok) {
        msgModal.style.color = "green";
        msgModal.textContent = "Dados atualizados com sucesso!";
        document.getElementById("nameInc").textContent = nameInc;
        document.getElementById("emailInc").textContent = emailInc;
        document.getElementById("historyInc").textContent = historyInc;
        document.getElementById("locationInc").textContent = locationInc;
        document.getElementById("cnpjInc").value = cnpjInc;

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
