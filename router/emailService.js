import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const baseUrl = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true
});

function enviarEmailVerificacaoPessoa(emailPer, namePer) {
  const token = jwt.sign({ email: emailPer }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const linkVerificacao = `${baseUrl}/verificar-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailPer,
    subject: 'Verifique seu e-mail',
    html: `
      <h2>Olá, ${namePer}!</h2>
      <p>Obrigado por se cadastrar. Clique no link abaixo para verificar seu e-mail:</p>
      <a href="${linkVerificacao}">Verificar e-mail</a>
      <p>Este link expira em 1 hora.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail de verificação (Pessoa):', error);
    } else {
      console.log('E-mail de verificação enviado para pessoa: ' + info.response);
    }
  });
}

function enviarEmailVerificacaoInstituicao(emailInc, nameInc) {
  const token = jwt.sign({ email: emailInc }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const linkVerificacaoI = `${baseUrl}/verificar-emailIB?token=${token}`;

  const mailOptionsI = {
    from: process.env.EMAIL_USER,
    to: emailInc,
    subject: 'Verifique seu e-mail',
    html: `
      <h2>Olá, ${nameInc}!</h2>
      <p>Obrigado por se cadastrar. Clique no link abaixo para verificar seu e-mail:</p>
      <a href="${linkVerificacaoI}">Verificar e-mail</a>
      <p>Este link expira em 1 hora.</p>
    `
  };

  transporter.sendMail(mailOptionsI, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail de verificação (Instituição):', error);
    } else {
      console.log('E-mail de verificação enviado para instituição: ' + info.response);
    }
  });
}

export { enviarEmailVerificacaoPessoa, enviarEmailVerificacaoInstituicao };
