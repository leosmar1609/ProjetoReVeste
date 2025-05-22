document.getElementById('registerPForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const namePer = document.getElementById('namePer').value;
    const emailPer = document.getElementById('emailPer').value;
    const passwordPer = document.getElementById('passwordPer').value;
    const cpfPer = document.getElementById('cpfPer').value;
    const historyPer = document.getElementById('historyPer').value;

    const response = await fetch('./auth/registerPB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namePer, emailPer, passwordPer, cpfPer, historyPer })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = data.message || data.error;
    messageDiv.style.color = response.ok ? 'green' : 'red';
});