import express from 'express';
const router = express.Router();
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { enviarEmailVerificacaoInstituicao } from './emailService.js';
import db from '../db.js';

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
        const chave = process.env.JWT_SECRET;
        const insertSql = `INSERT INTO instituicao_beneficiaria 
            (nameInc, emailInc, passwordInc, cnpjInc, locationInc, verificada, telInc) 
            VALUES (?, ?, AES_ENCRYPT(?, ?), ?, ?, 0, ?)`;

        db.query(insertSql, [nameInc, emailInc, passwordInc,chave, cnpjInc, locationInc, telInc], (err, results) => {
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
            res.send(`/enviado.html`);
        });
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

router.put('/beneficiarioup/:id', (req, res) => {
  const id = req.params.id;
  const { nameInc, emailInc, passwordInc, cnpjInc, locationInc, telInc } = req.body;
  const chave = process.env.JWT_SECRET;

  if (!id || !nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !telInc) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  const buscarSenhaSQL = `
    SELECT CONVERT(AES_DECRYPT(passwordInc, ?) USING utf8mb4) AS senha
    FROM instituicao_beneficiaria
    WHERE id = ?
  `;

  db.query(buscarSenhaSQL, [chave, id], (erroBusca, resultadosBusca) => {
    if (erroBusca) {
      console.error('Erro ao buscar senha da instituição:', erroBusca);
      return res.status(500).json({ mensagem: 'Erro no servidor ao verificar senha' });
    }

    if (resultadosBusca.length === 0) {
      return res.status(404).json({ mensagem: 'Instituição não encontrada' });
    }

    const senhaAtual = resultadosBusca[0].senha;

    if (passwordInc !== senhaAtual) {
      return res.status(401).json({ mensagem: '❌ A senha atual está incorreta. Tente novamente.' });
    }

    const atualizarSQL = `
      UPDATE instituicao_beneficiaria
      SET nameInc = ?, emailInc = ?, cnpjInc = ?, locationInc = ?, telInc = ?
      WHERE id = ?
    `;

    db.query(atualizarSQL, [nameInc, emailInc, cnpjInc, locationInc, telInc, id], (errAtualizar, resultado) => {
      if (errAtualizar) {
        console.error('Erro ao atualizar instituição:', errAtualizar);
        return res.status(500).json({ mensagem: 'Erro no servidor ao atualizar dados' });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Instituição não encontrada' });
      }

      res.status(200).json({ mensagem: '✅ Instituição atualizada com sucesso' });
    });
  });
});

export default router;