const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

router.post('/registerIB', (req, res) => {
    const { name, email, password, cnpj, location, history } = req.body;

    if (!name || !email || !password || !cnpj || !location || !history) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO instituicao_beneficiaria (name, email, password, cnpj, location, history) 
               VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, email, password, cnpj, location, history], (err, results) => {
        if (err) {
            console.error('Erro ao criar instituição:', err);
        } else {
            console.log('Instituição criada com sucesso:', results);
        }
    });
});

module.exports = router;