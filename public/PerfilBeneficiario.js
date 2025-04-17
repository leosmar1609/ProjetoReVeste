document.addEventListener('DOMContentLoaded', async() => {
    // Captura o ID da URL (ex: ?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // 🟢 Carrega os pedidos da pessoa beneficiária
    try {
        const response = await fetch(`./auth/pedidos?id=${id}`);
        const pedidos = await response.json();

        const listaPedidos = document.getElementById("listaPedidos");

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        } else {
            pedidos.forEach(pedido => {
                const item = document.createElement("div");
                item.classList.add("card-pedido");
                item.innerHTML = `
                    <h3>${pedido.name_item}</h3>
                    <p><strong>Descrição:</strong> ${pedido.description}</p>
                    <p><strong>Quantidade:</strong> ${pedido.quantity_item}</p>
                    <p><strong>Categoria:</strong> ${pedido.category}</p>
                    <p><strong>Urgência:</strong> ${pedido.urgencia_enum}</p>
                    <p><strong>Localização:</strong> ${pedido.locate}</p>
                `;
                listaPedidos.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        document.getElementById("listaPedidos").innerHTML = "<p>Erro ao carregar os pedidos.</p>";
    }
});

// 🟢 Envio do formulário de novo pedido
document.getElementById('form').addEventListener('submit', async(e) => {
    e.preventDefault();

    // Captura o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const name_item = document.getElementById("name_item").value;
    const description = document.getElementById("description").value;
    const quantity_item = document.getElementById("quantity_item").value;
    const category = document.getElementById("category").value;
    const urgencia_enum = document.getElementById("urgencia_enum").value;
    const locate = document.getElementById("locate").value;

    const response = await fetch('./auth/cadastrar-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            name_item,
            description,
            quantity_item,
            category,
            urgencia_enum,
            locate
        })
    });

    const item = await response.json();

    console.log("Item cadastrado:", item);
    // Se quiser recarregar a lista após cadastrar:
    window.location.reload();
});