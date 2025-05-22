require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas existentes
const authRoutes = require('./router/authRoutes');
app.use('/auth', authRoutes);

// 🔗 Nova rota para envio do formulário de contato
const emailRoutes = require('./router/emailRoutes'); // <- Certifique-se de criar esse arquivo
app.use('/api', emailRoutes);

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
