import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/enviar-formulario', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'Nova mensagem do formulário de contato',
      html: `
        <h3>Mensagem enviada pelo site</h3>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong> ${mensagem}</p>
      `
    });

    res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar a mensagem.' });
  }
});

export default router;