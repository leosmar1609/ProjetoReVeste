window.addEventListener('DOMContentLoaded', async() => {
   const token = localStorage.getItem('token');

    if (!token) {
        console.warn('Token não encontrado no localStorage. Redirecionando para login.');
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id || id === "") {
        console.warn('ID do usuário não fornecido ou inválido na URL. Redirecionando para login.');
        window.location.href = 'login.html';
        return; 
    }

    try {
        const res = await fetch(`./auth/pessoa?id=${id}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!res.ok) {
            
            const errorData = await res.json().catch(() => ({ message: res.statusText })); 
            console.error(`Erro ao buscar usuário: Status ${res.status} - ${errorData.message}`);

            if (res.status === 401 || res.status === 403) {
                console.warn('Erro de autenticação/autorização. Redirecionando para login.');
                window.location.href = 'login.html';
                return;
            } else {
                window.location.href = 'login.html';
                return; 
            }
        }
        const data = await res.json();
       
    } catch (error) {
        console.error("Erro na requisição ou processamento:", error);
        window.location.href = 'login.html';
    }

    try {
        const response = await fetch(`./auth/pedidosP?id=${id}`);
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
                    <p><strong>Status:</strong> <span class="status">${pedido.status}</span></p>
                    ${pedido.status !== "Concluído" && pedido.status !== "Cancelado" && pedido.status === "Pendente"
                    ? `<button class="btn-confirmar" data-id="${pedido.id}">Confirmar recebimento</button>` 
                    : ""}
                    ${pedido.status === "Aberto" 
                    ? `<button class="btn-cancelar" data-id="${pedido.id}">Cancelar pedido</button>` 
                    : ""}
                    `;
                listaPedidos.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        document.getElementById("listaPedidos").innerHTML = "<p>Erro ao carregar os pedidos.</p>";
    }
});

document.getElementById('listaPedidos').addEventListener('click', async function(event) {
    const btn = event.target;

    if (btn.classList.contains('btn-confirmar')) {
        const pedidoId = btn.getAttribute('data-id');
        const confirmar = confirm("Tem certeza que deseja confirmar o recebimento deste item?");
        if (!confirmar) return;

        try {
            const resp = await fetch(`./auth/confirmar-recebimento`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: pedidoId })
            });

            if (resp.ok) {
                const statusSpan = btn.previousElementSibling.querySelector('.status');
                if (statusSpan) {
                    statusSpan.textContent = 'Concluído';
                }
                btn.remove();
                alert("Pedido confirmado com sucesso!");
            } else {
                alert("Erro ao confirmar pedido.");
            }
        } catch (error) {
            console.error("Erro ao confirmar:", error);
            alert("Erro ao confirmar pedido.");
        }
    }

    if (btn.classList.contains('btn-cancelar')) {
        const pedidoId = btn.getAttribute('data-id');
        const confirmar = confirm("Você realmente deseja cancelar este pedido? Essa ação não poderá ser desfeita.");
        if (!confirmar) return;

        try {
            const resp = await fetch(`./auth/cancelar-pedido`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: pedidoId })
            });

            if (resp.ok) {
                const statusSpan = btn.previousElementSibling.querySelector('.status');
                if (statusSpan) {
                    statusSpan.textContent = 'Cancelado';
                }
                btn.remove();
                alert("Pedido cancelado com sucesso!");
            } else {
                alert("Erro ao cancelar pedido.");
            }
        } catch (error) {
            console.error("Erro ao cancelar:", error);
            alert("Erro ao cancelar pedido.");
        }
    }
});

document.getElementById('form').addEventListener('submit', async(e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const name_item = document.getElementById("name_item").value;
    const description = document.getElementById("description").value;
    const quantity_item = document.getElementById("quantity_item").value;
    const category = document.getElementById("category").value;
    const urgencia_enum = document.getElementById("urgencia_enum").value;
    const locate = document.getElementById("locate").value;

    const response = await fetch('./auth/cadastrar-itemP', {
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
    const mes = String(data.getMonth() + 1).padStart(2, '0');
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

const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

userIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

document.getElementById('btnPerfil').addEventListener('click', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) {
    window.location.href = `pp73276273hasg837pp.html?id=${id}`;
  } else {
    alert("ID do usuário não encontrado na URL.");
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "login.html";
});
