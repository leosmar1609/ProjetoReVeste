document.getElementById('registerFormDoador').addEventListener('submit', async(e) => {
    e.preventDefault();

    const namedonor = document.getElementById('namedonor').value;
    const emaildonor = document.getElementById('emaildonor').value;
    const passworddonor = document.getElementById('passworddonor').value;

    const response = await fetch('./auth/registerdonor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namedonor, emaildonor, passworddonor })
    });

    const data = await response.json();
    alert(data.message || data.error);
});