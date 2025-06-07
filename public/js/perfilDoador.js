window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idPerfil = urlParams.get("id");
  const idUsuarioLogado = localStorage.getItem("idUsuarioLogado");
  const token = localStorage.getItem("token");
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

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

if (!dados || Object.keys(dados).length === 0) {
  alert("Perfil não encontrado.");
  return;
}

    const doador = dados;
    sessionStorage.setItem("emaildonor", doador.emaildonor);
    sessionStorage.setItem("userType", tipoUsuario) || "doador";

    carregarDadosDoDoador(doador.id);
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
    window.location.href = `dd8372783hasd738WA.html?id=${id}`;
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
      const response = await fetch(`./auth/deletedoador?id=${id}`, {
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

async function carregarDadosDoDoador(idDoador) {
  try {
    const token = localStorage.getItem('token');

    const resposta = await fetch(`/doador?id=${idDoador}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      throw new Error(`Erro ${resposta.status}: ${erroTexto}`);
    }

    const texto = await resposta.text();
    if (!texto) throw new Error('Resposta vazia do servidor');

    const dados = JSON.parse(texto);

    if (!dados || !dados.namedonor || !dados.emaildonor) {
      throw new Error('Dados incompletos ou inválidos');
    }

    document.getElementById('inputName').value = dados.namedonor;
    document.getElementById('inputEmail').value = dados.emaildonor;

  } catch (erro) {
    console.error('Erro ao carregar dados:', erro.message);
    document.getElementById('msgModal').textContent = 'Erro ao carregar os dados.';
  }
}

document.getElementById("forgotPass").addEventListener("click", () => {
  const email = document.getElementById("inputEmail").value;
  const tipo = "doador";
  const msgModal = document.getElementById("msgModal");

  if (!email || !tipo) {
    alert("Por favor, informe seu e-mail.");
    return;
  }
  msgModal.textContent = "⏳ Enviando e-mail de recuperação...";
  msgModal.style.color = "black";

  fetch("./auth/enviar-recuperacao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, tipo })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      msgModal.textContent = "Instruções de redefinição de senha enviadas para o seu e-mail.";
      msgModal.style.color = "green";
    } else {
      msgModal.textContent = "Instruções de redefinição de senha enviadas para o seu e-mail.";
      msgModal.style.color = "green";
    }
  })
  .catch(error => {
    console.error("Erro ao enviar e-mail:", error);
    alert("Erro ao enviar e-mail. Tente novamente mais tarde.");
  });
});