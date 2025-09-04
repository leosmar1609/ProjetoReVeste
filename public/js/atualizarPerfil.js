document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");
  const cpfInput = document.getElementById('inputCpf');
  const telInput = document.getElementById('inputTel');
  const token = localStorage.getItem("token");

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

    telInput.addEventListener('input', () => {
  let value = telInput.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 6) {
    telInput.value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
    telInput.value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    telInput.value = value;
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
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ id, namePer, emailPer, passwordPer, telPer }),
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
          window.location.reload();
        }, 2000);
        
      } else if (res.status === 403) {
        msgModal.style.color = "red";
      msgModal.textContent = "❌ Senha incorreta. Tente novamente.";
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
