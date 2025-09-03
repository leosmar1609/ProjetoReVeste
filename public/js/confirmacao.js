// pagamento.js
document.addEventListener("DOMContentLoaded", () => {
  const btnConfirmar = document.getElementById("btnConfirmarPagamento");

  // Recupera o idPedido da URL
  const urlParams = new URLSearchParams(window.location.search);
  const idPedido = urlParams.get("id");
   const idDoador = urlParams.get("idDoador") || null; // <-- aqui


  if (!btnConfirmar) return;

  btnConfirmar.addEventListener("click", async () => {
    const confirmar = confirm("Você realmente deseja confirmar a doação?");
    if (!confirmar) return;

    try {
      const response = await fetch("./auth/pedidosup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idPedido, status: "Pendente" }),
      });

      if (response.ok) {
        alert("Doação confirmada! O recebimento será confirmado em breve.");
        // Redireciona para a página anterior com o id
        window.location.href = `dd8372783hasd738WA.html?id=${idDoador}`;
      } else {
        const resData = await response.json();
        alert(
          `Erro ao atualizar o pedido: ${
            resData.mensagem || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao enviar atualização:", error);
      alert("Erro ao confirmar a doação. Tente novamente mais tarde.");
    }
  });
});
