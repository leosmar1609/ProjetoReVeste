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
        'Content-Type': 'application/json',
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
    document.getElementById("telInc").textContent = instituicao.telInc || "Não informado";

    if (idUsuarioLogado === String(instituicao.id)) {
      document.getElementById("botoesApenasDono").style.display = "block";

      btnAlterar.addEventListener("click", () => {
        document.getElementById("inputName").value = instituicao.nameInc;
        document.getElementById("inputEmail").value = instituicao.emailInc;
        document.getElementById("inputCNPJ").value = instituicao.cnpjInc;
        document.getElementById("inputHistory").value = instituicao.historyInc;
        document.getElementById("inputPassword").value = ""; 
        document.getElementById("inputAddress").value = instituicao.locationInc;

        msgModal.textContent = "";
        msgModal.style.color = "";
        modalEditar.style.display = "flex";
      });

      fecharModal.addEventListener("click", () => {
        modalEditar.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modalEditar) {
          modalEditar.style.display = "none";
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
});

document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "login.html";
});

document.getElementById("btnExcluir").addEventListener("click", async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar essa página.");
    window.location.href = "login.html";
    return;
  }

  if (confirm("Tem certeza que deseja excluir sua conta?")) {
    try {
      const response = await fetch(`./auth/deleteinstituicao?id=${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Conta excluída com sucesso.");
        localStorage.removeItem("token");
        sessionStorage.clear();
        window.location.href = "login.html";
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Erro ao conectar ao servidor.");
    }
  }
});