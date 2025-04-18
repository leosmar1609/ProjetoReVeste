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
                    <p><strong>Data do pedido:</strong> ${formatarData(pedido.opened_at)}</p>
                    <p><strong>Status:</strong> ${pedido.status}</p>
                `;

                listaPedidos.appendChild(card);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        document.getElementById("listaPedidos").innerHTML = "<p>Erro ao carregar os pedidos.</p>";
    }
});

function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
}

document.getElementById('search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.card-pedido');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

// document.addEventListener("DOMContentLoaded", async function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const id = urlParams.get("id");

//     if (!id) {
//         window.location.href = "login.html";
//         return;
//     }

//     try {
//         const response = await fetch(`./auth/doador?id=${id}`);
//         const data = await response.json();

//         document.getElementById("namedonor").innerText = data[0].nome;

//     } catch (error) {
//         console.error("Erro ao buscar doador:", error);
//     }
//     if (!id || isNaN(id)) {
//         window.location.href = "login.html";
//     }
// });