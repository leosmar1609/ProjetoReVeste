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

router.get('/recuperaremail/:tipo/:email', async (req, res) => {
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

  try {
    const [resultado] = await db.query(sql, [email]);

    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: 'E-mail não encontrado' });
    }

    res.status(200).json({ mensagem: 'Usuário encontrado', dados: resultado[0] });
  } catch (err) {
    console.error('Erro ao buscar e-mail:', err);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
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
  } else if (tipo === 'pessoa') {
    tabela = 'pessoa_beneficiaria';
    campoSenha = 'passwordPer';
    campoEmail = 'emailPer';
  } else {
    return res.status(400).json({ mensagem: 'Tipo de usuário inválido' });
  }

  const sql = `UPDATE ${tabela} SET ${campoSenha} = AES_ENCRYPT(?, ?) WHERE ${campoEmail} = ?`;

  try {
    const [resultado] = await db.query(sql, [novaSenha, chave, email]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.status(200).json({ mensagem: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar a senha:', err);
    res.status(500).json({ mensagem: 'Erro no servidor ao atualizar a senha' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  const chave = process.env.JWT_SECRET;

  const handleLogin = (emailCol, type, result) => {
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

  try {
    if (userType === "instituicao") {
      const [result1] = await db.query(
        'SELECT * FROM instituicao_beneficiaria WHERE emailInc = ? AND passwordInc = AES_ENCRYPT(?, ?)',
        [email, password, chave]
      );
      return handleLogin('emailInc', 'instituicao', result1);
    }

    if (userType === "pessoa") {
      const [result2] = await db.query(
        'SELECT * FROM pessoa_beneficiaria WHERE emailPer = ? AND passwordPer = AES_ENCRYPT(?, ?)',
        [email, password, chave]
      );
      return handleLogin('emailPer', 'pessoa', result2);
    }

    if (userType === "doador") {
      const [result3] = await db.query(
        'SELECT * FROM doador WHERE emaildonor = ? AND passworddonor = AES_ENCRYPT(?, ?)',
        [email, password, chave]
      );
      return handleLogin('emaildonor', 'doador', result3);
    }

    return res.status(400).json({ error: 'Tipo de usuário não reconhecido' });
  } catch (err) {
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;