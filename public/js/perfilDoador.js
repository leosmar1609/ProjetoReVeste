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
    const response = await fetch(`./auth/doador?id=${idPerfil}`, {
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

    const doador = dados;


    document.getElementById("nameDoador").textContent = doador.namedonor;
    document.getElementById("emailDoador").textContent = doador.emaildonor;



    if (idUsuarioLogado === String(doador.id)) {
      document.getElementById("botoesApenasDono").style.display = "block";


      document.getElementById("inputName").value = doador.namedonor || "";
      document.getElementById("inputEmail").value = doador.emaildonor || "";
      document.getElementById("inputPassword").value = doador.passworddonor || "";


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
  }
});


document.getElementById('btnVoltar').addEventListener('click', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) {
    window.location.href = `doador.html?id=${id}`;
  }
   else {
    alert("ID do usuário não encontrado na URL.");
  }
});


document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "login.html";
});