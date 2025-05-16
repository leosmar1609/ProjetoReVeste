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
    const response = await fetch(`./auth/instituicao?id=${idPerfil}`);
    const dados = await response.json();

    if (dados.length === 0) {
      alert("Perfil não encontrado.");
      return;
    }

    const instituicao = dados[0];

    // Preenche informações visíveis
    document.getElementById("nameInc").textContent = instituicao.nameInc;
    document.getElementById("emailInc").textContent = instituicao.emailInc;
    document.getElementById("historyInc").textContent = instituicao.historyInc;
    document.getElementById("locationInc").textContent = instituicao.locationInc;
    document.getElementById("cnpjInc").textContent = instituicao.cnpjInc;

    // Se for o dono do perfil
    if (idUsuarioLogado === String(instituicao.id)) {
      document.getElementById("botoesApenasDono").style.display = "block";

      // Preenche campos do formulário
      document.getElementById("inputName").value = instituicao.nameInc || "";
      document.getElementById("inputEmail").value = instituicao.emailInc || "";
      document.getElementById("inputCNPJ").value = instituicao.cnpjInc || "";
      document.getElementById("inputHistory").value = instituicao.historyInc || "";
      document.getElementById("inputPassword").value = instituicao.passwordInc || "";
      document.getElementById("inputAddress").value = instituicao.locationInc || "";

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
