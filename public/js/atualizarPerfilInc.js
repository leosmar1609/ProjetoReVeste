document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const formAlterar = document.getElementById("formAlterar");
  const msgModal = document.getElementById("msgModal");
  const cnpjInput = document.getElementById('inputCNPJ');
   const telInput = document.getElementById('inputTel');

  cnpjInput.addEventListener('input', () => {
        let value = cnpjInput.value.replace(/\D/g, '');

        if (value.length > 14) value = value.slice(0, 14);

        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');

        cnpjInput.value = value;
    });

        telInput.addEventListener('input', () => {
  let value = telInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito

  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

  if (value.length > 6) {
    telInput.value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
    telInput.value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    telInput.value = value;
  }
});

  if (!idPerfil || !formAlterar) return;

  formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idPerfil;
    const nameInc = document.getElementById("inputName").value.trim();
    const emailInc = document.getElementById("inputEmail").value.trim();
    const passwordInc = document.getElementById("inputPassword").value.trim();
    const cnpjRaw = document.getElementById("inputCNPJ").value.trim();
    const telInc = document.getElementById("inputTel").value.trim();
    const locationInc = document.getElementById("inputAddress").value.trim();
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

    if (!cnpjRegex.test(cnpjRaw)) {
            msgModal.innerText = "❌ CNPJ inválido. Use o formato 00.000.000/0000-00";
            msgModal.style.color = "red";
            return;
        }

        const cnpjInc = cnpjRaw.replace(/\D/g, '');
    if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc) {
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
        body: JSON.stringify({ id, nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc }),
      });

      const resultado = await res.json();

      if (res.ok) {
        msgModal.style.color = "green";
        msgModal.textContent = "Dados atualizados com sucesso!";
        document.getElementById("nameInc").textContent = nameInc;
        document.getElementById("emailInc").textContent = emailInc;
        document.getElementById("locationInc").textContent = locationInc;
        document.getElementById("cnpjInc").value = cnpjInc;
        document.getElementById("telInc").textContent = telInc;

        document.getElementById("inputPassword").value = "";

        setTimeout(() => {
          document.getElementById("modalEditar").classList.remove("active");
          msgModal.textContent = "";
          msgModal.style.color = "";
          window.location.reload();
        }, 2000);
      } else if (res.status === 401) {
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
