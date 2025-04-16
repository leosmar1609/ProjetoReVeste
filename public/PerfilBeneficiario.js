document.getElementById('form').addEventListener('submit', async(e) => {
    e.preventDefault();

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
            name_item,
            description,
            quantity_item,
            category,
            urgencia_enum,
            locate
        })
    });

    const item = await response.json();
})