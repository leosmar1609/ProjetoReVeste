document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");
  const cpfInput = document.getElementById('inputCpf');

  if (!idPerfil || !formAlterar) return;

  cpfInput.addEventListener('input', () => {
        let value = cpfInput.value.replace(/\D/g, ''); 

        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 9) {
            cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
        } else if (value.length > 3) {
            cpfInput.value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
        } else {
            cpfInput.value = value;
        }
    });

  formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idPerfil;
    const namePer = document.getElementById("inputName").value.trim();
    const emailPer = document.getElementById("inputEmail").value.trim();
    const passwordPer = document.getElementById("inputPassword").value.trim();
    const cpfRaw = document.getElementById("inputCpf").value.trim();
    const telPer = document.getElementById("inputTel").value.trim();
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (!cpfRegex.test(cpfRaw)) {
            messageElement.innerText = "❌ CPF inválido. Use o formato 000.000.000-00.";
            messageElement.style.color = "red";
            return;
        }
        const cpfPer = cpfRaw.replace(/[.-]/g, '');

    if (!namePer || !emailPer || !passwordPer || !cpfPer) {
      msgModal.style.color = "red";
      msgModal.textContent = "Preencha todos os campos.";
      return;
    }

    try {
      const res = await fetch(`./auth/pessoaup/${idPerfil}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, namePer, emailPer, passwordPer, cpfPer, telPer }),
      });

      const resultado = await res.json();

      if (res.ok) {
        msgModal.style.color = "green";
        msgModal.textContent = "Dados atualizados com sucesso!";
        document.getElementById("namePer").textContent = namePer;
        document.getElementById("emailPer").textContent = emailPer;
        document.getElementById("telPer").textContent = telPer || "Não informado";

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
