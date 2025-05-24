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
     const response = await fetch(`./auth/pessoa?id=${idPerfil}`, {
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

    const pessoa = dados;

    document.getElementById("namePer").textContent = pessoa.namePer;
    document.getElementById("emailPer").textContent = pessoa.emailPer;
    document.getElementById("historyPer").textContent = pessoa.historyPer;

    if (idUsuarioLogado === String(pessoa.id)) {
      document.getElementById("botoesApenasDono").style.display = "block";

      document.getElementById("inputName").value = pessoa.namePer || "";
      document.getElementById("inputEmail").value = pessoa.emailPer || "";
      document.getElementById("inputCpf").value = pessoa.cpfPer || "";
      document.getElementById("inputHistory").value = pessoa.historyPer || "";
      document.getElementById("inputPassword").value = pessoa.passwordPer || "";

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
    window.location.href = `pessoaBeneficiaria.html?id=${id}`;
  } else {
    alert("ID do usuário não encontrado na URL.");
  }
});

document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "login.html";
});
