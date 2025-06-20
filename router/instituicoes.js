import express from 'express';
const router = express.Router();
import path from 'path';
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { enviarEmailVerificacaoInstituicao } from './emailService.js';
import db from '../db.js';

router.post('/registerIB', async (req, res) => {
  let { nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc } = req.body;

  if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !telInc) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  cnpjInc = cnpjInc.replace(/\D/g, '');
  const chave = process.env.JWT_SECRET;

  try {
    const checkSql = `SELECT * FROM instituicao_beneficiaria WHERE emailInc = ? OR cnpjInc = ?`;
    const [checkResults] = await db.query(checkSql, [emailInc, cnpjInc]);

    if (checkResults.length > 0) {
      const jaExiste = checkResults[0];
      if (jaExiste.emailInc === emailInc) {
        return res.status(409).json({ error: '❌ E-mail já cadastrado.' });
      } else if (jaExiste.cnpjInc === cnpjInc) {
        return res.status(409).json({ error: '❌ CNPJ já cadastrado.' });
      }
    }

    const insertSql = `
      INSERT INTO instituicao_beneficiaria 
      (nameInc, emailInc, passwordInc, cnpjInc, locationInc, verificada, telInc) 
      VALUES (?, ?, AES_ENCRYPT(?, ?), ?, ?, 0, ?)
    `;

    await db.query(insertSql, [nameInc, emailInc, passwordInc, chave, cnpjInc, locationInc, telInc]);

    enviarEmailVerificacaoInstituicao(emailInc, nameInc);
    return res.status(201).json({ message: '✅ Cadastro realizado! Verifique seu e-mail.' });

  } catch (err) {
    console.error('Erro ao criar instituição:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar instituição.' });
  }
});

router.get('/instituicao', autenticarToken, async (req, res) => {
  const { id, email, cnpj } = req.query;

  try {
    if (id) {
      const sql = 'SELECT * FROM instituicao_Beneficiaria WHERE id = ?';
      const [results] = await db.query(sql, [id]);

      if (results.length === 0) {
        return res.status(404).json({ error: 'Instituição não encontrada' });
      }

      return res.json(results[0]);
    } 
    
    else if (email || cnpj) {
      const cleanCnpj = cnpj ? cnpj.replace(/\D/g, '') : null;

      const sql = `
        SELECT * FROM instituicao_Beneficiaria
        WHERE emailInc = ? OR cnpjInc = ?
      `;

      const [results] = await db.query(sql, [email || null, cleanCnpj || null]);

      if (results.length > 0) {
        const match = results[0];
        const msg = match.emailInc === email
          ? '❌ E-mail já cadastrado.'
          : '❌ CNPJ já cadastrado.';

        return res.status(200).json({ exists: true, message: msg });
      }

      return res.status(200).json({ exists: false });
    } 
    
    else {
      return res.status(400).json({ error: 'Parâmetro inválido. Forneça id, email ou cnpj.' });
    }
  } catch (err) {
    console.error('Erro na consulta da instituição:', err);
    return res.status(500).send('Erro no servidor');
  }
});

router.get('/verificar-emailIB', async (req, res) => {
  const token = req.query.token;

  if (!token) return res.status(400).send('Token ausente.');
  const htmlPath = path.resolve('./router/enviado.html');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const emailInc = decoded.email;

    const sql = 'UPDATE instituicao_beneficiaria SET verificada = 1 WHERE emailInc = ?';
    await db.query(sql, [emailInc]);

    res.sendFile(htmlPath);
  } catch (err) {
    return res.status(401).send('Token inválido ou expirado.');
  }
});

router.post('/cadastrar-itemI', async (req, res) => {
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

  try {
    await db.query(sql, [name_item, description, quantity_item, category, urgencia_enum, locate, idInt]);
    res.status(201).json({ message: 'Pedido realizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro interno ao criar o pedido.' });
  }
});

router.get('/pedidosI', async (req, res) => {
  const id = req.query.id;

  try {
    const sql = 'SELECT * FROM Pedidos WHERE instituicao_id = ?';
    const [results] = await db.query(sql, [id]);

    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.delete('/deleteinstituicao', autenticarToken, async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID da instituição é obrigatório' });
  }

  try {
    await db.query('DELETE FROM Pedidos WHERE instituicao_id = ?', [id]);

    const [resultado] = await db.query('DELETE FROM instituicao_beneficiaria WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Instituição não encontrada' });
    }

    res.status(200).json({ mensagem: 'Instituição deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar instituição e pedidos:', err);
    res.status(500).send('Erro ao excluir instituição');
  }
});

router.put('/beneficiarioup/:id', autenticarToken, async (req, res) => {
  const id = req.params.id;
  const { nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc } = req.body;
  const chave = process.env.JWT_SECRET;

  if (!id || !nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !telInc) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const [resultadosBusca] = await db.query(
      `SELECT CONVERT(AES_DECRYPT(passwordInc, ?) USING utf8mb4) AS senha FROM instituicao_beneficiaria WHERE id = ?`,
      [chave, id]
    );

    if (resultadosBusca.length === 0) {
      return res.status(404).json({ mensagem: 'Instituição não encontrada' });
    }

    const senhaAtual = resultadosBusca[0].senha;

    if (passwordInc !== senhaAtual) {
      return res.status(401).json({ mensagem: '❌ A senha atual está incorreta. Tente novamente.' });
    }

    const [resultado] = await db.query(
      `UPDATE instituicao_beneficiaria SET nameInc = ?, emailInc = ?, cnpjInc = ?, locationInc = ?, telInc = ? WHERE id = ?`,
      [nameInc, emailInc, cnpjInc, locationInc, telInc, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Instituição não encontrada' });
    }

    res.status(200).json({ mensagem: '✅ Instituição atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar instituição:', err);
    res.status(500).json({ mensagem: 'Erro no servidor ao atualizar dados' });
  }
});

export default router;