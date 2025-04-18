document.addEventListener('DOMContentLoaded', async() => {
    // Captura o ID da URL (ex: ?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // 🟢 Carrega os pedidos da pessoa beneficiária
    try {
        const response = await fetch(`./auth/pedidosI?id=${id}`);
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
                    <p><strong>Data do pedido:</strong> ${formatarData(pedido.opened_at)}</p>
                    <p><strong>Status:</strong> ${pedido.status}</p>
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

    const response = await fetch('./auth/cadastrar-itemI', {
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