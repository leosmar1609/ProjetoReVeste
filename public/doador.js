document.addEventListener('DOMContentLoaded', async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`./auth/pedidos?id=${id}`);
        const pedidos = await response.json();

        const listaPedidos = document.getElementById("listaPedidos");

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        } else {
            for (const pedido of pedidos) {
                const card = document.createElement("div");
                card.classList.add("card-pedido");

                let nomeDoador = "Desconhecido";

                try {
                    if (pedido.pessoa_beneficiaria_id) {
                        const resPessoa = await fetch(`./auth/pessoa?id=${pedido.pessoa_beneficiaria_id}`);
                        const pessoaData = await resPessoa.json();

                        if (pessoaData.length > 0 && pessoaData[0].namePer) {
                            nomeDoador = pessoaData[0].namePer;
                        }
                    } else if (pedido.instituicao_id) {
                        const resInst = await fetch(`./auth/instituicao?id=${pedido.instituicao_id}`);
                        const instData = await resInst.json();

                        if (instData.length > 0 && instData[0].nameInc) {
                            nomeDoador = instData[0].nameInc;
                        }
                    }
                } catch (err) {
                    console.warn("Erro ao buscar nome do doador:", err);
                }

                card.innerHTML = `
                    <h3>${pedido.name_item}</h3>
                    <p><strong>Feito por:</strong> ${nomeDoador}</p>
                    <p><strong>Descrição:</strong> ${pedido.description}</p>
                    <p><strong>Quantidade:</strong> ${pedido.quantity_item}</p>
                    <p><strong>Categoria:</strong> ${pedido.category}</p>
                    <p><strong>Urgência:</strong> ${pedido.urgencia_enum}</p>
                    <p><strong>Localização:</strong> ${pedido.locate}</p>
                    <p><strong>Data do pedido:</strong> ${pedido.opened_at}</p>
                `;

                listaPedidos.appendChild(card);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        document.getElementById("listaPedidos").innerHTML = "<p>Erro ao carregar os pedidos.</p>";
    }
});