import express from 'express';
const router = express.Router();
import autenticarToken from './authMiddleware.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import db from '../db.js';
const secretKey = process.env.JWT_SECRET; 
const baseUrl = process.env.BASE_URL;
import { enviarEmailVerificacaoPessoa } from './emailService.js';
import { enviarEmailVerificacaoInstituicao } from './emailService.js';

router.get('/recuperaremail/:tipo/:email', (req, res) => {
  const { tipo, email } = req.params;

  let tabela, campoEmail;

  switch (tipo) {
    case 'instituicao':
      tabela = 'instituicao_beneficiaria';
      campoEmail = 'emailInc';
      break;
    case 'doador':
      tabela = 'doador';
      campoEmail = 'emaildonor';
      break;
    case 'pessoa':
      tabela = 'pessoa_beneficiaria';
      campoEmail = 'emailPer';
      break;
    default:
      return res.status(400).json({ mensagem: 'Tipo de usuário inválido' });
  }

  const sql = `SELECT * FROM ${tabela} WHERE ${campoEmail} = ?`;

  db.query(sql, [email], (err, resultado) => {
    if (err) {
      console.error('Erro ao buscar e-mail:', err);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: 'E-mail não encontrado' });
    }

    res.status(200).json({ mensagem: 'Usuário encontrado', dados: resultado[0] });
  });
});

router.post('/enviar-recuperacao', async (req, res) => {
  const { email, tipo } = req.body;

  if (!email || !tipo) {
    return res.status(400).json({ mensagem: 'Email e tipo são obrigatórios' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const linkVerificacao = `${baseUrl}/recuperarsenha.html?email=${encodeURIComponent(email)}&tipo=${encodeURIComponent(tipo)}`;
    const li = linkVerificacao.replace(/\/$/, ''); 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <p>Olá, recebemos uma solicitação de recuperação de senha.</p>
        <p>Para continuar, clique no link abaixo:</p>
        <a href="${li}">Redefinir Senha</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensagem: 'E-mail de recuperação enviado com sucesso' });

  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro);
    res.status(500).json({ mensagem: 'Erro ao enviar o e-mail de recuperação' });
  }
});

router.put('/atualizar-senha', async (req, res) => {
  const { email, tipo, novaSenha } = req.body;
  const chave = process.env.JWT_SECRET;
  if (!email || !tipo || !novaSenha) {
    return res.status(400).json({ mensagem: 'Email, tipo e nova senha são obrigatórios' });
  }

  let tabela, campoSenha, campoEmail;

  if (tipo === 'instituicao') {
    tabela = 'instituicao_beneficiaria';
    campoSenha = 'passwordInc';
    campoEmail = 'emailInc';
  } else if (tipo === 'doador') {
    tabela = 'doador';
    campoSenha = 'passworddonor';
    campoEmail = 'emaildonor';
  }else if (tipo === 'pessoa') {
    tabela = 'pessoa_beneficiaria';
    campoSenha = 'passwordPer';
    campoEmail = 'emailPer';
  } else {
    return res.status(400).json({ mensagem: 'Tipo de usuário inválido' });
  }

  const sql = `UPDATE ${tabela} SET ${campoSenha} = AES_ENCRYPT(?, ?) WHERE ${campoEmail} = ?`;

  db.query(sql, [novaSenha, chave, email], (err, resultado) => {
    if (err) {
      console.error('Erro ao atualizar a senha:', err);
      return res.status(500).json({ mensagem: 'Erro no servidor ao atualizar a senha' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.status(200).json({ mensagem: 'Senha atualizada com sucesso' });
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
  const chave = process.env.JWT_SECRET;
  if (userType === "instituicao") {
    db.query('SELECT * FROM instituicao_beneficiaria WHERE emailInc = ? AND passwordInc = AES_ENCRYPT(?, ?)', [email, password, chave], (err, result1) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      handleLogin('emailInc', 'instituicao', result1, res);
    });
  } else if (userType === "pessoa") {
    db.query('SELECT * FROM pessoa_beneficiaria WHERE emailPer = ? AND passwordPer = AES_ENCRYPT(?, ?)', [email, password, chave], (err, result2) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      handleLogin('emailPer', 'pessoa', result2, res);
    });
  } else if (userType === "doador") {
    db.query('SELECT * FROM doador WHERE emaildonor = ? AND passworddonor = AES_ENCRYPT(?, ?)', [email, password, chave], (err, result3) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      handleLogin('emaildonor', 'doador', result3, res);
    });
  } else {
    return res.status(400).json({ error: 'Tipo de usuário não reconhecido' });
  }
});


export default router;