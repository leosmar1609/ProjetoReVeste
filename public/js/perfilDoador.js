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
    const response = await fetch(`./auth/doador?id=${idPerfil}`);
    const dados = await response.json();

    if (dados.length === 0) {
      alert("Perfil não encontrado.");
      return;
    }

    const doador = dados[0];


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
    alert("Erro ao carregar os dados do perfil.");
  }
});
