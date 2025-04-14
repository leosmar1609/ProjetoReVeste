document.getElementById('registerForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const nameInc = document.getElementById('nameInc').value;
    const emailInc = document.getElementById('emailInc').value;
    const passwordInc = document.getElementById('passwordInc').value;
    const cnpjInc = document.getElementById('cnpjInc').value;
    const locationInc = document.getElementById('locationInc').value;
    const historyInc = document.getElementById('historyInc').value;

    const response = await fetch('http://localhost:3000/auth/registerIB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc })
    });

    const data = await response.json();
    alert(data.message || data.error);
});