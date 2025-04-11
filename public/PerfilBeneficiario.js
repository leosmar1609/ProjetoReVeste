//adicioanmento dos cards de pedidos ja criados na tela do beneficiarip
// precisa ajustar conforme o banco

// n faço a minima ideia se os ids estão assim, n tenho bola de cristal
app.post('/cadastrar-item', async (req, res) => {
    const { name_item, description, quantity_item, category, urgencia_enum, locate } = req.body;

    const novoItem = await db.insertItem({ name_item, description, quantity_item, category, urgencia_enum, locate });
  
    res.json(novoItem); 
  });
  


document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    const response = await fetch('/cadastrar-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    const item = await response.json();
  
    adicionarCardNaTela(item);
    e.target.reset();
    formContainer.style.display = 'none';
    header.style.display = 'flex';
  });

  function adicionarCardNaTela(item) {
    const container = document.createElement('div');
    container.className = 'card-doacao';
    container.innerHTML = `
      <h3>${item.name_item}</h3>
      <p>${item.description}</p>
      <p><strong>Quantidade:</strong> ${item.quantity_item}</p>
      <p><strong>Categoria:</strong> ${item.category}</p>
      <p><strong>Urgência:</strong> ${item.urgencia_enum}</p>
      <p><strong>Localização:</strong> ${item.locate}</p>
    `;
    document.body.appendChild(container); 
  }
  