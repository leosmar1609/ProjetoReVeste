const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function enviarEmailVerificacao(emailPer, namePer) {
    // Gerar token válido por 1 hora
    const token = jwt.sign({ email: emailPer }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const linkVerificacao = `http://localhost:4000/auth/verificar-email?token=${token}`;

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
            console.error('Erro ao enviar e-mail de verificação:', error);
        } else {
            console.log('E-mail de verificação enviado: ' + info.response);
        }
    });
}

module.exports = { enviarEmailVerificacao };