document.getElementById('registerForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cnpj = document.getElementById('cnpj').value;
    const location = document.getElementById('location').value;
    const history = document.getElementById('history').value;

    const response = await fetch('/auth/registerIB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, cnpj, location, history })
    });

    const data = await response.json();
    alert(data.message || data.error);
});