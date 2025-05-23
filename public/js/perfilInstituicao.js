document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const idUsuarioLogado = localStorage.getItem("idUsuarioLogado");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar essa página.");
    window.location.href = "login.html";
    return;
  }

  if (!idPerfil) {
    alert("ID do perfil não informado.");
    return;
  }

  const modalEditar = document.getElementById("modalEditar");
  const btnAlterar = document.getElementById("btnAlterar");
  const fecharModal = document.getElementById("fecharModal");
  const msgModal = document.getElementById("msgModal");

  try {
    const response = await fetch(`./auth/instituicao?id=${idPerfil}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      alert("Token inválido ou expirado. Faça login novamente.");
      window.location.href = "login.html";
      return;
    }

    const dados = await response.json();
console.log('Dados recebidos:', dados);

if (!dados || Object.keys(dados).length === 0) {
  alert("Perfil não encontrado.");
  return;
}

    const instituicao = dados;

    document.getElementById("nameInc").textContent = instituicao.nameInc;
    document.getElementById("emailInc").textContent = instituicao.emailInc;
    document.getElementById("historyInc").textContent = instituicao.historyInc;
    document.getElementById("locationInc").textContent = instituicao.locationInc;
    document.getElementById("cnpjInc").textContent = instituicao.cnpjInc;

    if (idUsuarioLogado === String(instituicao.id)) {
      document.getElementById("botoesApenasDono").style.display = "block";

      document.getElementById("inputName").value = instituicao.nameInc || "";
      document.getElementById("inputEmail").value = instituicao.emailInc || "";
      document.getElementById("inputCNPJ").value = instituicao.cnpjInc || "";
      document.getElementById("inputHistory").value = instituicao.historyInc || "";
      document.getElementById("inputPassword").value = instituicao.passwordInc || "";
      document.getElementById("inputAddress").value = instituicao.locationInc || "";

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
document.getElementById('btnVoltar').addEventListener('click', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) {
    window.location.href = `instituicaoBeneficiaria.html?id=${id}`;
  }
}
);
document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "login.html";
});
