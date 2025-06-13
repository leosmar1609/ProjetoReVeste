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
        const res = await fetch(`./auth/doador?id=${id}`, {
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
    const response = await fetch(`./auth/pedidos?id=${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const pedidos = await response.json();

    const prioridadeStatus = {
        "Aberto": 1,
        "Concluído": 2,
        "Cancelado": 2
    };

    const prioridadeUrgencia = {
        "Urgente": 1,
        "Alta": 2,
        "Média": 3,
        "Baixa": 4
    };

    const pedidosOrdenados = pedidos.sort((a, b) => {
        const prioridadeA = prioridadeStatus[a.status] || 3;
        const prioridadeB = prioridadeStatus[b.status] || 3;

        if (prioridadeA !== prioridadeB) {
            return prioridadeA - prioridadeB;
        }

        const urgenciaA = prioridadeUrgencia[a.urgencia_enum] || 5;
        const urgenciaB = prioridadeUrgencia[b.urgencia_enum] || 5;

        return urgenciaA - urgenciaB;
    });

    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";

    if (pedidosOrdenados.length === 0) {
        listaPedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
    } else {
        for (const pedido of pedidosOrdenados) {
            let nomeDoador = "Desconhecido";
            let telefoneDoador = "Não informado";
            let emailDoador = "Não informado";

            try {
                if (pedido.pessoa_beneficiaria_id) {
                    const resPessoa = await fetch(`./auth/pessoa?id=${pedido.pessoa_beneficiaria_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const pessoaData = await resPessoa.json();
                    const pessoa = Array.isArray(pessoaData) ? pessoaData[0] : pessoaData;

                    if (pessoa?.namePer) {
                        nomeDoador = pessoa.namePer;
                        telefoneDoador = pessoa.telPer || "Não informado";
                        emailDoador = pessoa.emailPer || "Não informado";
                    }

                } else if (pedido.instituicao_id) {
                    const resInst = await fetch(`./auth/instituicao?id=${pedido.instituicao_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const instData = await resInst.json();
                    const inst = Array.isArray(instData) ? instData[0] : instData;

                    if (inst?.nameInc) {
                        nomeDoador = inst.nameInc;
                        telefoneDoador = inst.telInc || "Não informado";
                        emailDoador = inst.emailInc || "Não informado";
                    }
                }
            } catch (err) {
                console.warn("Erro ao buscar nome do doador:", err);
            }

            const card = document.createElement("div");
            card.classList.add("card-pedido");

            if (pedido.status !== "Cancelado") {
    card.innerHTML = `
    <head><link rel="stylesheet" href="../css/Doador.css"></head>
        <h3>${pedido.name_item}</h3>
        <p><strong>Feito por:</strong> ${nomeDoador}</p>
        <p><strong>Telefone:</strong> ${telefoneDoador}</p>
        <p><strong>E-mail:</strong> ${emailDoador}</p>
        <p><strong>Descrição:</strong> ${pedido.description}</p>
        <p><strong>Quantidade:</strong> ${pedido.quantity_item}</p>
        <p><strong>Categoria:</strong> ${pedido.category}</p>
        <p><strong>Urgência:</strong> ${pedido.urgencia_enum}</p>
        <p><strong>Localização:</strong> ${pedido.locate}</p>
        <p><strong>Data do pedido:</strong> ${formatarData(pedido.opened_at)}</p>
        <p><strong>Status:</strong> ${pedido.status}</p>
        ${pedido.status === "Aberto" ? `
            <p>
                <button class="btn-doar"
                    data-id="${pedido.id}"
                    data-nome="${pedido.name_item}"
                    data-desc="${pedido.description}"
                    data-doador="${nomeDoador}"
                    data-telefone="${telefoneDoador}"
                    data-email="${emailDoador}"
                    data-quant="${pedido.quantity_item}"
                    data-cat="${pedido.category}"
                    data-urg="${pedido.urgencia_enum}"
                    data-loc="${pedido.locate}"
                    data-data="${pedido.opened_at}"
                    data-status="${pedido.status}"
                >Doar</button>
            </p>
        ` : ""}
    `;
} else {
    card.style.display = "none";
}

            listaPedidos.appendChild(card);
        }
    }
} catch (err) {
    console.error("Erro ao buscar pedidos:", err);
}

            try {
            document.querySelectorAll('.btn-doar').forEach(button => {
                button.addEventListener('click', () => {
                    const modal = document.getElementById("modalDoacao");
                    const modalInfo = document.getElementById("modalInfo");

                    modalInfo.innerHTML = `
                        <p><strong>Item:</strong> ${button.dataset.nome}</p>
                        <p><strong>Descrição:</strong> ${button.dataset.desc}</p>
                        <p><strong>Feito por:</strong> ${button.dataset.doador}</p>
                        <p><strong>Telefone:</strong> ${button.dataset.telefone}</p>
                        <p><strong>E-mail:</strong> ${button.dataset.email || ""}</p>
                        <p><strong>Quantidade:</strong> ${button.dataset.quant}</p>
                        <p><strong>Categoria:</strong> ${button.dataset.cat}</p>
                        <p><strong>Urgência:</strong> ${button.dataset.urg}</p>
                        <p><strong>Localização:</strong> ${button.dataset.loc}</p>
                        <p><strong>Data:</strong> ${formatarData(button.dataset.data)}</p>
                        <p><strong>Status:</strong> ${button.dataset.status}</p>
                    `;

                    modal.dataset.idPedido = button.dataset.id;
                    modal.classList.remove("hidden");
                });
            });
        }
     catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        document.getElementById("listaPedidos").innerHTML = "<p>Erro ao carregar os pedidos.</p>";
    }
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

document.getElementById('search').addEventListener('input', function () {
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


document.getElementById("fecharModal").addEventListener("click", () => {
    document.getElementById("modalDoacao").classList.add("hidden");
});


document.getElementById("confirmarDoacao").addEventListener("click", async () => {
    const idPedido = document.getElementById("modalDoacao").dataset.idPedido;

    const confirmar = confirm("Você realmente deseja confirmar a doação?");
        if (!confirmar) return;

    try {
        const response = await fetch('./auth/pedidosup', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idPedido, status: 'Pendente' })
        });

        if (response.ok) {
            alert('Doação confirmada! O recebimento será confirmado em breve.');
            location.reload(); 
        } else {
            const resData = await response.json();
            alert(`Erro ao atualizar o pedido: ${resData.mensagem || response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao enviar atualização:", error);
        alert('Erro ao confirmar a doação. Tente novamente mais tarde.');
    }

    document.getElementById("modalDoacao").classList.add("hidden");
});

const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

userIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

document.getElementById('btnPerfil').addEventListener('click', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) {
    window.location.href = `pd4983988auhd736pd.html?id=${id}`;
  } else {
    alert("ID do usuário não encontrado na URL.");
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "login.html";
});


document.addEventListener("click", (e) => {
  if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
  }
});

const modal = document.getElementById("modalDoacao");