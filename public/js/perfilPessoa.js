// perfil.js

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const idUsuarioLogado = localStorage.getItem("idUsuarioLogado");

  if (!idPerfil) {
    alert("ID do perfil não informado.");
    return;
  }

  const modalEditar = document.getElementById("modalEditar");
  const btnAlterar = document.getElementById("btnAlterar");
  const fecharModal = document.getElementById("fecharModal");
  const msgModal = document.getElementById("msgModal");

  try {
    const response = await fetch(`./auth/pessoa?id=${idPerfil}`);
    const dados = await response.json();

    if (dados.length === 0) {
      alert("Perfil não encontrado.");
      return;
    }

    const pessoa = dados[0];

    // Preenche informações visíveis
    document.getElementById("namePer").textContent = pessoa.namePer;
    document.getElementById("emailPer").textContent = pessoa.emailPer;
    document.getElementById("historyPer").textContent = pessoa.historyPer;

    // Se for o dono do perfil
    if (idUsuarioLogado === String(pessoa.id)) {
      document.getElementById("botoesApenasDono").style.display = "block";

      // Preenche campos do formulário
      document.getElementById("inputName").value = pessoa.namePer || "";
      document.getElementById("inputEmail").value = pessoa.emailPer || "";
      document.getElementById("inputCpf").value = pessoa.cpfPer || "";
      document.getElementById("inputHistory").value = pessoa.historyPer || "";
      document.getElementById("inputPassword").value = pessoa.passwordPer || "";

      // Abertura e fechamento do modal
      btnAlterar.addEventListener("click", () => {
        msgModal.textContent = "";
        msgModal.style.color = "";
        modalEditar.classList.add("active");
      });

      fecharModal.addEventListener("click", () => {
        modalEditar.classList.remove("active");
      });

      window.addEventListener("click", (e) => {
        if (e.target === modalEditar) {
          modalEditar.classList.remove("active");
        }
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
    alert("Erro ao carregar os dados do perfil.");
  }
});
