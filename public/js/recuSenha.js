document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recuperarForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tipo = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const messageElement = document.getElementById("mensagem");

    try {
      const resposta = await fetch(`./auth/recuperaremail/${tipo}/${email}`);

      if (!resposta.ok) {
        console.log('Nenhum dado retornado do banco.');
        alert('Usuário não encontrado.');
        return;
      }

      const dados = await resposta.json();
      console.log('Resposta do banco:', dados);

      messageElement.innerText = "⏳ Enviando dados...";
      messageElement.style.color = "black";

      const enviarEmail = await fetch('./auth/enviar-recuperacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, tipo })
      });

      const resultado = await enviarEmail.json();

      if (enviarEmail.ok) {
        messageElement.innerText = 'Email de recuperação enviado com sucesso!';
        messageElement.style.color = "green";
      } else {
        messageElement.innerText = `Erro ao enviar e-mail: ${resultado.mensagem}`;
        messageElement.style.color = "red";
      }

    } catch (erro) {
      console.error('Erro ao fazer requisição:', erro);
      alert('Erro ao conectar com o servidor');
    }
  });
});
