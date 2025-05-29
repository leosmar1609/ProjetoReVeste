document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recuperarForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tipo = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;

    try {
      // Primeiro, verifica se o e-mail existe
      const resposta = await fetch(`./auth/recuperaremail/${tipo}/${email}`);

      if (!resposta.ok) {
        console.log('Nenhum dado retornado do banco.');
        alert('Usuário não encontrado.');
        return;
      }

      const dados = await resposta.json();
      console.log('Resposta do banco:', dados);

      // Agora, envia o e-mail de recuperação
      const enviarEmail = await fetch('./auth/enviar-recuperacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, tipo })
      });

      const resultado = await enviarEmail.json();

      if (enviarEmail.ok) {
        alert('Email de recuperação enviado com sucesso!');
      } else {
        alert(`Erro ao enviar e-mail: ${resultado.mensagem}`);
      }

    } catch (erro) {
      console.error('Erro ao fazer requisição:', erro);
      alert('Erro ao conectar com o servidor');
    }
  });
});
