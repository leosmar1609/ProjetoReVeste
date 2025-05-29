document.getElementById('formRecuperarSenha').addEventListener('submit', async function(e) {
  e.preventDefault();

  const novaSenha = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const msgErro = document.getElementById('mensagemErro');
  msgErro.textContent = '';

  const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

  if (!regexSenha.test(novaSenha)) {
    msgErro.textContent = 'A senha deve conter no mínimo 6 caracteres, incluindo uma letra maiúscula, uma minúscula e um caractere especial.';
    return;
  }

  if (novaSenha !== confirmarSenha) {
    msgErro.textContent = 'As senhas não coincidem.';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const tipo = params.get('tipo');

  if (!email || !tipo) {
    msgErro.textContent = 'Link inválido ou incompleto.';
    return;
  }

  try {
    const resposta = await fetch('./auth/atualizar-senha', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, tipo, novaSenha })
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      msgErro.style.color = 'green';
      msgErro.textContent = 'Senha redefinida com sucesso! Redirecionando para o login...';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      msgErro.style.color = 'red';
      msgErro.textContent = resultado.mensagem || 'Erro ao atualizar senha.';
    }
  } catch (erro) {
    console.error('Erro:', erro);
    msgErro.style.color = 'red';
    msgErro.textContent = 'Erro ao conectar com o servidor.';
  }
});
