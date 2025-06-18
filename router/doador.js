import express from 'express';
const router = express.Router();
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import db from '../db.js';
const secretKey = process.env.JWT_SECRET; 

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
        const chave = process.env.JWT_SECRET;
    const sql = `INSERT INTO doador (namedonor, emaildonor, passworddonor) 
               VALUES (?, ?, AES_ENCRYPT(?, ?))`;
    db.query(sql, [namedonor, emaildonor, passworddonor, chave], (err, results) => {
        if (err) {
            console.error('Erro ao criar a conta', err);
        } else {

            res.status(201).send('Cadastro realizado!');
        }
    });
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
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Doador não encontrado' });
      }

      res.json(results[0]); // OK: retornando doador encontrado
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

router.put('/doadorup/:id', autenticarToken, (req, res) => {
  const id = req.params.id;
  const { nameDoador, emailDoador, passwordDoador } = req.body;
  const chave = process.env.JWT_SECRET;

  if (!nameDoador || !emailDoador || !passwordDoador) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  const buscarSenhaSQL = `
    SELECT CONVERT(AES_DECRYPT(passworddonor, ?) USING utf8mb4) AS senha
    FROM doador
    WHERE id = ?
  `;

  db.query(buscarSenhaSQL, [chave, id], (erroBusca, resultadosBusca) => {
    if (erroBusca) {
      console.error('Erro ao buscar senha do doador:', erroBusca);
      return res.status(500).json({ mensagem: 'Erro no servidor ao verificar senha' });
    }

    if (resultadosBusca.length === 0) {
      return res.status(404).json({ mensagem: 'Doador não encontrado' });
    }

    const senhaAtual = resultadosBusca[0].senha;

    if (passwordDoador !== senhaAtual) {
      return res.status(401).json({ mensagem: '❌ A senha atual está incorreta. Tente novamente.' });
    }

    const atualizarSQL = `
      UPDATE doador
      SET namedonor = ?, emaildonor = ?
      WHERE id = ?
    `;

    db.query(atualizarSQL, [nameDoador, emailDoador, id], (errAtualizar, resultado) => {
      if (errAtualizar) {
        console.error('Erro ao atualizar doador:', errAtualizar);
        return res.status(500).json({ mensagem: 'Erro no servidor ao atualizar dados' });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Doador não encontrado' });
      }

      res.status(200).json({ mensagem: 'Doador atualizado com sucesso' });
    });
  });
});


export default router;
