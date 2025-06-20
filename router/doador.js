import express from 'express';
const router = express.Router();
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import db from '../db.js';
const secretKey = process.env.JWT_SECRET; 

router.post('/registerdonor', async (req, res) => {
    const { namedonor, emaildonor, passworddonor } = req.body;

    if (!namedonor || !emaildonor || !passworddonor) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    try {
    const [checkResults] = await db.query(
      'SELECT * FROM doador WHERE emaildonor = ?',
      [emaildonor]
    );

    if (checkResults.length > 0) {
      return res.status(409).json({ error: '❌ E-mail já cadastrado.' });
    }

    const chave = process.env.JWT_SECRET;
    await db.query(
      'INSERT INTO doador (namedonor, emaildonor, passworddonor) VALUES (?, ?, AES_ENCRYPT(?, ?))',
      [namedonor, emaildonor, passworddonor, chave]
    );

    res.status(201).send('Cadastro realizado!');
  } catch (err) {
    console.error('Erro ao registrar doador:', err);
    res.status(500).json({ error: 'Erro ao registrar doador.' });
  }
});

router.get('/pedidos', async (req, res) => {
  const id = req.query.id;

  try {
    const sql = 'SELECT * FROM Pedidos';
    const [results] = await db.query(sql, [id]);

    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.get('/doador', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, secretKey);
    const id = req.query.id;

    const [results] = await db.query('SELECT * FROM doador WHERE id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Doador não encontrado' });
    }

    res.json(results[0]);
  } catch (err) {
    return res.sendStatus(403);
  }
});

router.delete('/deletedoador', autenticarToken, async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do doador é obrigatório' });
  }

  try {
    const [resultado] = await db.query('DELETE FROM doador WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Doador não encontrado' });
    }

    res.status(200).json({ mensagem: 'Doador deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar doador:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/doadorup/:id', autenticarToken, async (req, res) => {
  const id = req.params.id;
  const { nameDoador, emailDoador, passwordDoador } = req.body;
  const chave = process.env.JWT_SECRET;

  if (!nameDoador || !emailDoador || !passwordDoador) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const [resultadosBusca] = await db.query(
      `SELECT CONVERT(AES_DECRYPT(passworddonor, ?) USING utf8mb4) AS senha FROM doador WHERE id = ?`,
      [chave, id]
    );

    if (resultadosBusca.length === 0) {
      return res.status(404).json({ mensagem: 'Doador não encontrado' });
    }

    const senhaAtual = resultadosBusca[0].senha;

    if (passwordDoador !== senhaAtual) {
      return res.status(401).json({ mensagem: '❌ A senha atual está incorreta. Tente novamente.' });
    }

    const [resultado] = await db.query(
      `UPDATE doador SET namedonor = ?, emaildonor = ? WHERE id = ?`,
      [nameDoador, emailDoador, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Doador não encontrado' });
    }

    res.status(200).json({ mensagem: 'Doador atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar doador:', err);
    res.status(500).json({ mensagem: 'Erro no servidor ao atualizar dados' });
  }
});

export default router;