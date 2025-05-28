const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; 

const router = express.Router();
const { enviarEmailVerificacaoInstituicao, enviarEmailVerificacaoPessoa } = require('./emailService');
const e = require('express');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
    rejectUnauthorized: false
  }
});

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.usuario = usuario; 
        next();
    });
}

router.post('/registerIB', (req, res) => {
    let { nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc } = req.body;

    if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !telInc) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    cnpjInc = cnpjInc.replace(/\D/g, '');

    const checkSql = `SELECT * FROM instituicao_beneficiaria WHERE emailInc = ? OR cnpjInc = ?`;
    db.query(checkSql, [emailInc, cnpjInc], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Erro ao verificar duplicidade:', checkErr);
            return res.status(500).json({ error: 'Erro ao verificar duplicidade.' });
        }

        if (checkResults.length > 0) {
            const jaExiste = checkResults[0];
            if (jaExiste.emailInc === emailInc) {
                return res.status(409).json({ error: '❌ E-mail já cadastrado.' });
            } else if (jaExiste.cnpjInc === cnpjInc) {
                return res.status(409).json({ error: '❌ CNPJ já cadastrado.' });
            }
        }

        const insertSql = `INSERT INTO instituicao_beneficiaria 
            (nameInc, emailInc, passwordInc, cnpjInc, locationInc, verificada, telInc) 
            VALUES (?, ?, ?, ?, ?, 0, ?)`;

        db.query(insertSql, [nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc], (err, results) => {
            if (err) {
                console.error('Erro ao criar instituição:', err);
                return res.status(500).json({ error: 'Erro ao cadastrar instituição.' });
            } else {
                enviarEmailVerificacaoInstituicao(emailInc, nameInc);
                return res.status(201).json({ message: '✅ Cadastro realizado! Verifique seu e-mail.' });
            }
        });
    });
});


router.post('/registerdonor', (req, res) => {
    const { namedonor, emaildonor, passworddonor } = req.body;

    if (!namedonor || !emaildonor || !passworddonor) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const checkSql = `SELECT * FROM doador WHERE emaildonor = ?`;
    db.query(checkSql, [emaildonor], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Erro ao verificar duplicidade:', checkErr);
            return res.status(500).json({ error: 'Erro ao verificar duplicidade.' });
        }

        if (checkResults.length > 0) {
            const jaExiste = checkResults[0];
            if (jaExiste.emaildonor === emaildonor) {
                return res.status(409).json({ error: '❌ E-mail já cadastrado.' });
            }
        }

    const sql = `INSERT INTO doador (namedonor, emaildonor, passworddonor) 
               VALUES (?, ?, ?)`;
    db.query(sql, [namedonor, emaildonor, passworddonor], (err, results) => {
        if (err) {
            console.error('Erro ao criar a conta', err);
        } else {

            res.status(201).send('Cadastro realizado!');
        }
    });
});
});

router.get('/instituicao', autenticarToken, (req, res) => {
    const { id, email, cnpj } = req.query;

    if (id) {
        const sql = 'SELECT * FROM instituicao_Beneficiaria WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar instituição por ID:', err);
                return res.status(500).send('Erro no servidor');
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Instituição não encontrada' });
            }

            return res.json(results[0]);
        });
    }

    else if (email || cnpj) {
        const cleanCnpj = cnpj ? cnpj.replace(/\D/g, '') : null;

        const sql = `
            SELECT * FROM instituicao_Beneficiaria
            WHERE email = ? OR cnpj = ?
        `;

        db.query(sql, [email || null, cleanCnpj || null], (err, results) => {
            if (err) {
                console.error('Erro ao verificar e-mail/CNPJ:', err);
                return res.status(500).send('Erro no servidor');
            }

            if (results.length > 0) {
                const match = results[0];
                const msg = match.email === email
                    ? '❌ E-mail já cadastrado.'
                    : '❌ CNPJ já cadastrado.';

                return res.status(200).json({ exists: true, message: msg });
            }

            return res.status(200).json({ exists: false });
        });
    }

    else {
        return res.status(400).json({ error: 'Parâmetro inválido. Forneça id, email ou cnpj.' });
    }
});

router.get('/pessoa', autenticarToken, (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID não fornecido' });
    }

    const sql = 'SELECT * FROM Pessoa_Beneficiaria WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pessoa:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        
        res.json(results[0]);
    });
});


router.post('/registerPB', (req, res) => {
    const { namePer, emailPer, passwordPer, cpfPer, telPer } = req.body;

    if (!namePer || !emailPer || !passwordPer || !cpfPer || !telPer) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const cpfLimpo = cpfPer.replace(/\D/g, '');

    const checkSql = 'SELECT * FROM pessoa_beneficiaria WHERE emailPer = ? OR cpfPer = ?';
    db.query(checkSql, [emailPer, cpfLimpo], (err, results) => {
        if (err) {
            console.error('Erro ao verificar CPF/email:', err);
            return res.status(500).json({ error: 'Erro ao verificar dados.' });
        }

        if (results.length > 0) {
            const conflictField = results[0].emailPer === emailPer ? 'E-mail' : 'CPF';
            return res.status(409).json({ error: `${conflictField} já cadastrado.` });
        }

        const insertSql = `INSERT INTO pessoa_beneficiaria (namePer, emailPer, passwordPer, cpfPer, verificado, telPer)
                           VALUES (?, ?, ?, ?, 0, ?)`;

        db.query(insertSql, [namePer, emailPer, passwordPer, cpfLimpo, telPer], (err, results) => {
            if (err) {
                console.error('Erro ao cadastrar pessoa:', err);
                return res.status(500).json({ error: 'Erro ao cadastrar pessoa.' });
            }

            enviarEmailVerificacaoPessoa(emailPer, namePer); 
            return res.status(201).json({ message: 'Cadastro realizado! Verifique seu e-mail.' });
        });
    });
});


router.get('/verificar-email', (req, res) => {
    const token = req.query.token;

    if (!token) return res.status(400).send('Token ausente.');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido ou expirado.');

        const emailPer = decoded.email;

        const sql = 'UPDATE pessoa_beneficiaria SET verificado = 1 WHERE emailPer = ?';
        db.query(sql, [emailPer], (erro, resultado) => {
            if (erro) {
                console.error('Erro ao verificar e-mail:', erro);
                return res.status(500).send('Erro interno.');
            }
            res.send(`
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-mail Verificado</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
          }

          .container {
              background-color: white;
              padding: 30px 40px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
              width: 90%;
          }

          h2 {
              color: #2e7d32;
              margin-bottom: 10px;
          }

          p {
              color: #555;
              margin-bottom: 20px;
              font-size: 16px;
          }

          a.button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #2e7d32;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              transition: background-color 0.3s ease;
          }

          a.button:hover {
              background-color: #1b5e20;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>E-mail verificado com sucesso!</h2>
          <p>Você já pode acessar sua conta.</p>
          <a class="button" href="/login.html">Clique aqui para fazer login</a>
      </div>
  </body>
  </html>
`);
        });
    });
});

router.get('/verificar-emailIB', (req, res) => {
    const token = req.query.token;

    if (!token) return res.status(400).send('Token ausente.');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido ou expirado.');

        const emailInc = decoded.email;

        const sql = 'UPDATE instituicao_beneficiaria SET verificada = 1 WHERE emailInc = ?';
        db.query(sql, [emailInc], (erro, resultado) => {
            if (erro) {
                console.error('Erro ao verificar e-mail:', erro);
                return res.status(500).send('Erro interno.');
            }
            res.send(`
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-mail Verificado</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
          }

          .container {
              background-color: white;
              padding: 30px 40px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
              width: 90%;
          }

          h2 {
              color: #2e7d32;
              margin-bottom: 10px;
          }

          p {
              color: #555;
              margin-bottom: 20px;
              font-size: 16px;
          }

          a.button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #2e7d32;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              transition: background-color 0.3s ease;
          }

          a.button:hover {
              background-color: #1b5e20;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>E-mail verificado com sucesso!</h2>
          <p>Você já pode acessar sua conta.</p>
          <a class="button" href="/login.html">Clique aqui para fazer login</a>
      </div>
  </body>
  </html>
`);
        });
    });
});


router.post('/login', (req, res) => {
  const { email, password, userType } = req.body;

  const handleLogin = (emailCol, type, result, res) => {
    if (result.length > 0) {
      const user = result[0];

      if ((type === "instituicao" && user.verificada === 0) || 
          (type === "pessoa" && user.verificado === 0)) {
        if (type === "instituicao") enviarEmailVerificacaoInstituicao(email);
        else if (type === "pessoa") enviarEmailVerificacaoPessoa(email);

        return res.status(401).json({ error: `Usuário ainda não verificado para ${type}` });
      }

      const payload = {
        id: user.id || user[emailCol],
        userType: type,
        email: user[emailCol]
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      return res.json({ tipo: type, id: user.id || user[emailCol], token: token });
    }

    return res.status(401).json({ error: `Usuário ou senha inválidos para ${type}` });
  };

  if (userType === "instituicao") {
    db.query('SELECT * FROM instituicao_beneficiaria WHERE emailInc = ? AND passwordInc = ?', [email, password], (err, result1) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      handleLogin('emailInc', 'instituicao', result1, res);
    });
  } else if (userType === "pessoa") {
    db.query('SELECT * FROM pessoa_beneficiaria WHERE emailPer = ? AND passwordPer = ?', [email, password], (err, result2) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      handleLogin('emailPer', 'pessoa', result2, res);
    });
  } else if (userType === "doador") {
    db.query('SELECT * FROM doador WHERE emaildonor = ? AND passworddonor = ?', [email, password], (err, result3) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      handleLogin('emaildonor', 'doador', result3, res);
    });
  } else {
    return res.status(400).json({ error: 'Tipo de usuário não reconhecido' });
  }
});


router.post('/cadastrar-itemP', async(req, res) => {
    const { id, name_item, description, quantity_item, category, urgencia_enum, locate } = req.body;

    if (!id || !name_item || !description || !quantity_item || !category || !urgencia_enum || !locate) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const idInt = parseInt(id);
    if (isNaN(idInt)) {
        return res.status(400).json({ error: 'ID inválido!' });
    }

    const sql = `
        INSERT INTO Pedidos (name_item, description, quantity_item, category, status, urgencia_enum, locate, pessoa_beneficiaria_id)
        VALUES (?, ?, ?, ?, 'Aberto', ?, ?, ?)
    `;

    db.query(sql, [name_item, description, quantity_item, category, urgencia_enum, locate, idInt], (err, results) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
            res.status(500).json({ error: 'Erro interno ao criar o pedido.' });
        } else {
            res.status(201).json({ message: 'Pedido realizado com sucesso.' });
        }
    });
});

router.post('/cadastrar-itemI', async(req, res) => {
    const { id, name_item, description, quantity_item, category, urgencia_enum, locate } = req.body;

    if (!id || !name_item || !description || !quantity_item || !category || !urgencia_enum || !locate) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const idInt = parseInt(id);
    if (isNaN(idInt)) {
        return res.status(400).json({ error: 'ID inválido!' });
    }

    const sql = `
        INSERT INTO Pedidos (name_item, description, quantity_item, category, status, urgencia_enum, locate, instituicao_id)
        VALUES (?, ?, ?, ?, 'Aberto', ?, ?, ?)
    `;

    db.query(sql, [name_item, description, quantity_item, category, urgencia_enum, locate, idInt], (err, results) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
            res.status(500).json({ error: 'Erro interno ao criar o pedido.' });
        } else {
            res.status(201).json({ message: 'Pedido realizado com sucesso.' });
        }
    });
});


router.get('/pedidosP', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT * FROM Pedidos WHERE pessoa_beneficiaria_id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedido:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

router.get('/pedidosI', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT * FROM Pedidos WHERE instituicao_id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedido:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

router.get('/pedidos', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT * FROM Pedidos';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedido:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

router.get('/doador', (req, res) => {
     const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
    const id = req.query.id;
    const sql = 'SELECT * FROM doador WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar doador:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results[0]);
        }
    });
});
});

router.delete('/deletedoador', autenticarToken, (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do doador é obrigatório' });
    }

    const sql = 'DELETE FROM doador WHERE id = ?';

    db.query(sql, [id], (err, resultado) => {
        if (err) {
            console.error('Erro ao deletar doador:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Doador não encontrado' });
        }

        res.status(200).json({ mensagem: 'Doador deletado com sucesso' });
    });
});


router.delete('/deleteinstituicao', autenticarToken, (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID da instituição é obrigatório' });
    }

    const sql1 = 'DELETE FROM Pedidos WHERE instituicao_id = ?';
    db.query(sql1, [id], (err1) => {
        if (err1) {
            console.error('Erro ao deletar pedidos da instituição:', err1);
            return res.status(500).send('Erro ao excluir pedidos da instituição');
        }

        const sql2 = 'DELETE FROM instituicao_beneficiaria WHERE id = ?';
        db.query(sql2, [id], (err2, resultado) => {
            if (err2) {
                console.error('Erro ao deletar instituição:', err2);
                return res.status(500).send('Erro ao excluir instituição');
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Instituição não encontrada' });
            }

            res.status(200).json({ mensagem: 'Instituição deletada com sucesso' });
        });
    });
});

router.delete('/deletepessoa', autenticarToken, (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID da pessoa é obrigatório' });
    }

    const sql1 = 'DELETE FROM Pedidos WHERE pessoa_beneficiaria_id = ?';
    db.query(sql1, [id], (err1) => {
        if (err1) {
            console.error('Erro ao deletar pedidos do usuário:', err1);
            return res.status(500).send('Erro ao excluir pedidos do usuário');
        }

        const sql2 = 'DELETE FROM pessoa_beneficiaria WHERE id = ?';
        db.query(sql2, [id], (err2, resultado) => {
            if (err2) {
                console.error('Erro ao deletar usuário:', err2);
                return res.status(500).send('Erro ao excluir usuário');
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }

            res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
    });
});
});

router.delete('/deletepedido', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
    }

    const sql = 'DELETE FROM pedidos WHERE id = ?';

    db.query(sql, [id], (err, resultado) => {
        if (err) {
            console.error('Erro ao deletar pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Pedido deletado com sucesso' });
    });
});

router.put('/doadorup/:id', autenticarToken, (req, res) => {
    const id = req.params.id;
    const { nameDoador, emailDoador, passwordDoador } = req.body;

    if (!nameDoador || !emailDoador || !passwordDoador) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
    }

    const sql = 'UPDATE doador SET namedonor = ?, emaildonor = ?, passworddonor = ? WHERE id = ?';

    db.query(sql, [nameDoador, emailDoador, passwordDoador, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao atualizar doador:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Doador não encontrado' });
        }

        res.status(200).json({ mensagem: 'Doador atualizado com sucesso' });
    });
});

router.put('/pessoaup/:id', (req, res) => {
  const id = req.params.id;
  const { namePer, emailPer, passwordPer, cpfPer, telPer } = req.body;

  if (!id || !namePer || !emailPer || !passwordPer || !cpfPer || !telPer) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  const sql = `
    UPDATE pessoa_beneficiaria
    SET namePer = ?, emailPer = ?, passwordPer = ?, cpfPer = ?, telPer = ?
    WHERE id = ?
  `;

  db.query(sql, [namePer, emailPer, passwordPer, cpfPer, telPer, id], (err, resultado) => {
    if (err) {
      console.error('Erro ao atualizar pessoaup:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada' });
    }

    res.status(200).json({ mensagem: 'Pessoa atualizada com sucesso' });
  });
});


router.put('/beneficiarioup/:id', (req, res) => {
    const id = req.params.id;
    const { nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc } = req.body;

    if (!id || !nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !telInc) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
    }

    const sql = 'UPDATE instituicao_beneficiaria SET nameInc = ?, emailInc = ?, passwordInc = ?, cnpjInc = ?, locationInc = ?, telInc = ? WHERE id = ?';

    db.query(sql, [nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao atualizar beneficiário:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Instituição não encontrado' });
        }

        res.status(200).json({ mensagem: 'Instituição atualizada com sucesso' });
    });
});


router.put('/pedidosup', (req, res) => {
    const id = req.body.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';

    db.query(sql, [status, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao atualizar o pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Pedido atualizado com sucesso' });
    });
});

router.put('/confirmar-recebimento', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    const status = 'Fechado';

    db.query(sql, [status, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao confirmar recebimento do pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Recebimento confirmado com sucesso' });
    });
});

router.put('/cancelar-pedido', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    const status = 'Cancelado';

    db.query(sql, [status, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao cancelar o pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Pedido cancelado com sucesso' });
    });
});


module.exports = router;