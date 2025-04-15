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
    const { nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc } = req.body;

    if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !historyInc) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO instituicao_beneficiaria (nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc) 
               VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc], (err, results) => {
        if (err) {
            console.error('Erro ao criar instituição:', err);
        } else {
            console.log('Instituição criada com sucesso:', results);
        }
    });
});

router.get('/instituicao', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT * FROM Instituicao_Beneficiaria WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar instituição:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

router.post('/registerPB', (req, res) => {
    const { namePer, emailPer, passwordPer, cpfPer, historyPer } = req.body;

    if (!namePer || !emailPer || !passwordPer || !cpfPer || !historyPer) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO Pessoa_Beneficiaria (namePer, emailPer, passwordPer, cpfPer, historyPer) 
               VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [namePer, emailPer, passwordPer, cpfPer, historyPer], (err, results) => {
        if (err) {
            console.error('Erro ao criar pessoa:', err);
        } else {
            console.log('Pessoa criada com sucesso:', results);
        }
    });
});

router.get('/pessoa', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT * FROM Pessoa_Beneficiaria WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar instituição:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;