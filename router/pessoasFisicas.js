import express from 'express';
const router = express.Router();
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { enviarEmailVerificacaoPessoa } from './emailService.js';
import db from '../db.js';

router.get('/pessoa', autenticarToken, (req, res) => {
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
        FROM Pessoa_Beneficiaria
        WHERE id = ?
    `;

    db.query(sql, [chave, id], (err, results) => {
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
    const chave = process.env.JWT_SECRET;
    const checkSql = 'SELECT * FROM pessoa_beneficiaria WHERE emailPer = ? OR cpfPer = AES_ENCRYPT(?, ?)';
    db.query(checkSql, [emailPer, cpfLimpo, chave], (err, results) => {
        if (err) {
            console.error('Erro ao verificar CPF/email:', err);
            return res.status(500).json({ error: 'Erro ao verificar dados.' });
        }

        if (results.length > 0) {
            const conflictField = results[0].emailPer === emailPer ? 'E-mail' : 'CPF';
            return res.status(409).json({ error: `${conflictField} já cadastrado.` });
        }
        
        const insertSql = `INSERT INTO pessoa_beneficiaria (namePer, emailPer, passwordPer, cpfPer, verificado, telPer)
                           VALUES (?, ?, AES_ENCRYPT(?, ?), AES_ENCRYPT(?, ?), 0, ?)`;

        db.query(insertSql, [namePer, emailPer, passwordPer, chave, cpfLimpo, chave, telPer], (err, results) => {
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
            res.send(`/enviado.html`);
        });
    });
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

router.put('/pessoaup/:id', (req, res) => {
  const id = req.params.id;
  const { namePer, emailPer, passwordPer, telPer } = req.body;
  const chave = process.env.JWT_SECRET;

  if (!id || !namePer || !emailPer || !passwordPer || !telPer) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  const sqlSelect = `
    SELECT CONVERT(AES_DECRYPT(passwordPer, ?) USING utf8mb4) AS senha
    FROM pessoa_beneficiaria
    WHERE id = ?
  `;

  db.query(sqlSelect, [chave, id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar senha atual:', err);
      return res.status(500).send('Erro no servidor');
    }

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

    db.query(sqlUpdate, [namePer, emailPer, telPer, id], (err, resultado) => {
      if (err) {
        console.error('Erro ao atualizar pessoa:', err);
        return res.status(500).send('Erro no servidor');
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Pessoa não encontrada' });
      }

      res.status(200).json({ mensagem: 'Pessoa atualizada com sucesso' });
    });
  });
});

export default router;