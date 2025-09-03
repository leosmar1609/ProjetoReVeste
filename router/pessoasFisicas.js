import express from 'express';
const router = express.Router();
import path from 'path';
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { enviarEmailVerificacaoPessoa } from './emailService.js';
import db from '../db.js';

router.get('/pessoa', autenticarToken, async (req, res) => {
  const id = req.query.id;
  const chave = process.env.JWT_SECRET;

  if (!id) {
    return res.status(400).json({ error: 'ID não fornecido' });
  }

  const sql = `
    SELECT 
      id,
      namePer,
      emailPer,
      CONVERT(AES_DECRYPT(cpfPer, ?) USING utf8mb4) AS cpfPer,
      telPer
    FROM pessoa_beneficiaria
    WHERE id = ?
  `;

  try {
    const [results] = await db.query(sql, [chave, id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar pessoa:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.post('/registerPB', async (req, res) => {
  const { namePer, emailPer, passwordPer, cpfPer, telPer } = req.body;

  if (!namePer || !emailPer || !passwordPer || !cpfPer || !telPer) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  const cpfLimpo = cpfPer.replace(/\D/g, '');
  const chave = process.env.JWT_SECRET;

  try {
    const checkSql = 'SELECT * FROM pessoa_beneficiaria WHERE emailPer = ? OR cpfPer = AES_ENCRYPT(?, ?)';
    const [results] = await db.query(checkSql, [emailPer, cpfLimpo, chave]);

    if (results.length > 0) {
      const conflictField = results[0].emailPer === emailPer ? 'E-mail' : 'CPF';
      return res.status(409).json({ error: `${conflictField} já cadastrado.` });
    }

    const insertSql = `INSERT INTO pessoa_beneficiaria (namePer, emailPer, passwordPer, cpfPer, verificado, telPer)
                       VALUES (?, ?, AES_ENCRYPT(?, ?), AES_ENCRYPT(?, ?), 0, ?)`;

    await db.query(insertSql, [namePer, emailPer, passwordPer, chave, cpfLimpo, chave, telPer]);

    enviarEmailVerificacaoPessoa(emailPer, namePer);

    res.status(201).json({ message: 'Cadastro realizado! Verifique seu e-mail.' });
  } catch (err) {
    console.error('Erro ao cadastrar pessoa:', err);
    res.status(500).json({ error: 'Erro ao cadastrar pessoa.' });
  }
});

router.get('/verificar-email', async (req, res) => {
  const token = req.query.token;

  if (!token) return res.status(400).send('Token ausente.');
  const htmlPath = path.resolve('./router/enviado.html');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const emailPer = decoded.email;

    const sql = 'UPDATE pessoa_beneficiaria SET verificado = 1 WHERE emailPer = ?';
    await db.query(sql, [emailPer]);

    res.sendFile(htmlPath);
  } catch (err) {
    console.error('Erro ao verificar e-mail:', err);
    res.status(401).send('Token inválido ou expirado.');
  }
});

router.post('/cadastrar-itemP', async (req, res) => {
  const { id, name_item, description, quantity_item, category, urgencia_enum, locate, chave_pix, pixType } = req.body;

  if (!id || !name_item || !description || !quantity_item || !category || !urgencia_enum || !locate) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  const idInt = parseInt(id);
  if (isNaN(idInt)) {
    return res.status(400).json({ error: 'ID inválido!' });
  }

  try {
    const sql = `
      INSERT INTO Pedidos (name_item, description, quantity_item, category, status, chave_pix, pixType, urgencia_enum, locate, pessoa_beneficiaria_id)
      VALUES (?, ?, ?, ?, 'Aberto', ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [name_item, description, quantity_item, category, chave_pix, pixType, urgencia_enum, locate, idInt]);
    res.status(201).json({ message: 'Pedido realizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro interno ao criar o pedido.' });
  }
});

router.get('/pedidosP', async (req, res) => {
  const id = req.query.id;

  try {
    const sql = 'SELECT * FROM Pedidos WHERE pessoa_beneficiaria_id = ?';
    const [results] = await db.query(sql, [id]);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.delete('/deletepessoa', autenticarToken, async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID da pessoa é obrigatório' });
  }

  try {
    const sql1 = 'DELETE FROM Pedidos WHERE pessoa_beneficiaria_id = ?';
    await db.query(sql1, [id]);

    const sql2 = 'DELETE FROM pessoa_beneficiaria WHERE id = ?';
    const [resultado] = await db.query(sql2, [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).send('Erro ao excluir usuário');
  }
});

router.put('/pessoaup/:id', autenticarToken, async (req, res) => {
  const id = req.params.id;
  const { namePer, emailPer, passwordPer, telPer } = req.body;
  const chave = process.env.JWT_SECRET;

  if (!id || !namePer || !emailPer || !passwordPer || !telPer) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const sqlSelect = `
      SELECT CONVERT(AES_DECRYPT(passwordPer, ?) USING utf8mb4) AS senha
      FROM pessoa_beneficiaria
      WHERE id = ?
    `;
    const [results] = await db.query(sqlSelect, [chave, id]);

    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada' });
    }

    const senhaCorreta = results[0].senha;

    if (passwordPer !== senhaCorreta) {
      return res.status(403).json({ mensagem: 'Senha incorreta' });
    }

    const sqlUpdate = `
      UPDATE pessoa_beneficiaria
      SET namePer = ?, emailPer = ?, telPer = ?
      WHERE id = ?
    `;
    const [resultado] = await db.query(sqlUpdate, [namePer, emailPer, telPer, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada' });
    }

    res.status(200).json({ mensagem: 'Pessoa atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar pessoa:', err);
    res.status(500).send('Erro no servidor');
  }
});

export default router;