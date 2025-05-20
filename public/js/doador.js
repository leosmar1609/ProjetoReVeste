document.addEventListener('DOMContentLoaded', async() => {
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
                        const resPessoa = await fetch(`./auth/pessoa?id=${pedido.pessoa_beneficiaria_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const pessoaData = await resPessoa.json();
                        console.log("Dados da pessoa:", pessoaData);

                        if (Array.isArray(pessoaData) && pessoaData.length > 0 && pessoaData[0].namePer) {
                            nomeDoador = pessoaData[0].namePer;
                        } else if (pessoaData.namePer) {
                            nomeDoador = pessoaData.namePer;
                        }
                    } else if (pedido.instituicao_id) {
                        const resInst = await fetch(`./auth/instituicao?id=${pedido.instituicao_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const instData = await resInst.json();
                        console.log("Dados da instituição:", instData);

                        if (Array.isArray(instData) && instData.length > 0 && instData[0].nameInc) {
                            nomeDoador = instData[0].nameInc;
                        } else if (instData.nameInc) {
                            nomeDoador = instData.nameInc;
                        }
                    }
                } catch (err) {
                    console.warn("Erro ao buscar nome do doador:", err);
                }

                // Preenchendo o conteúdo do card
                 card.innerHTML = `
    <head>
        <link rel="stylesheet" href="../css/Doador.css">
    </head>
    <h3>${pedido.name_item}</h3>
    <p><strong>Feito por:</strong> ${nomeDoador}</p>
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
                data-quant="${pedido.quantity_item}"
                data-cat="${pedido.category}"
                data-urg="${pedido.urgencia_enum}"
                data-loc="${pedido.locate}"
                data-data="${pedido.opened_at}"
                data-status="${pedido.status}"
            >Doar</button>
        </p>` : ""
    }
`;

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

// Formatação da data
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
            // Atualiza a página ou o card (opcional)
            location.reload(); // ou atualize o card manualmente
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
    window.location.href = `perfilDoador.html?id=${id}`;
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

function initMapWithEndereco(endereco) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: endereco }, function(results, status) {
        if (status === 'OK') {
            const localizacao = results[0].geometry.location;

            const mapa = new google.maps.Map(document.getElementById("mapaModal"), {
                center: localizacao,
                zoom: 15,
            });

            new google.maps.Marker({
                position: localizacao,
                map: mapa,
                title: "Local da doação",
            });
        } else {
            console.error("Erro ao geocodificar o endereço:", status);
        }
    });
}

const modal = document.getElementById("modalDoacao");

const observer = new MutationObserver(() => {
  if (!modal.classList.contains("hidden")) {
    const endereco = modal.querySelector("p:nth-child(7)")?.textContent.split(":")[1]?.trim();
    if (endereco) {
      setTimeout(() => {
          initMapWithEndereco(endereco);
        }, 500); // Pequeno atraso para garantir que o DOM esteja pronto
      }
    }
  });

observer.observe(modal, { attributes: true, attributeFilter: ['class'] });