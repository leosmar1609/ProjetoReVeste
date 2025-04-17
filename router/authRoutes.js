const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const router = express.Router();
const { enviarEmailVerificacao } = require('../emailService');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

router.post('/registerIB', (req, res) => {
    const { nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc, verificada } = req.body;

    if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !historyInc) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO instituicao_beneficiaria (nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc, verificada) 
               VALUES (?, ?, ?, ?, ?, ?, 0)`;
    db.query(sql, [nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc, verificada], (err, results) => {
        if (err) {
            console.error('Erro ao criar instituição:', err);
        } else {
            enviarEmailVerificacao(emailInc, nameInc);
            res.status(201).send('Cadastro realizado! Verifique seu e-mail.');
        }
    });
});

router.post('/registerdonor', (req, res) => {
    const { namedonor, emaildonor, passworddonor } = req.body;

    if (!namedonor || !emaildonor || !passworddonor) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO doador (namedonor, emaildonor, passworddonor) 
               VALUES (?, ?, ?)`;
    db.query(sql, [namedonor, emaildonor, passworddonor], (err, results) => {
        if (err) {
            console.error('Erro ao criar a conta', err);
        } else {

            res.status(201).send('Cadastro realizado!');
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
    const { namePer, emailPer, passwordPer, cpfPer, historyPer, verificado } = req.body;

    if (!namePer || !emailPer || !passwordPer || !cpfPer || !historyPer) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO Pessoa_Beneficiaria (namePer, emailPer, passwordPer, cpfPer, historyPer, verificado) 
               VALUES (?, ?, ?, ?, ?, 0)`;
    db.query(sql, [namePer, emailPer, passwordPer, cpfPer, historyPer, verificado], (err, results) => {
        if (err) {
            console.error('Erro ao criar pessoa:', err);
        } else {
            enviarEmailVerificacao(emailPer, namePer);

            res.status(201).send('Cadastro realizado! Verifique seu e-mail.');
        }
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
            res.send(`<h2>E-mail verificado com sucesso!</h2><p>Você já pode acessar sua conta!</p>`);
        });
    });
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
            res.send(`<h2>E-mail verificado com sucesso!</h2><p>Você já pode acessar sua conta!</p>`);
        });
    });
});

router.get('/pessoa', (req, res) => {
    const emailPer = req.query.emailPer;
    const passwordPer = req.query.passwordPer;

    const sql = 'SELECT * FROM Pessoa_Beneficiaria WHERE emailPer = ? AND passwordPer = ?';
    db.query(sql, [emailPer, passwordPer], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pessoa:', err);
            res.status(500).json({ error: 'Erro no servidor' });
        } else if (results.length > 0) {
            res.json(results[0]); // envia só o usuário logado
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    });
});


router.post('/cadastrar-item', async(req, res) => {
    const { name_item, description, quantity_item, category, urgencia_enum, locate } = req.body;

    if (!name_item || !description || !quantity_item || !category || !urgencia_enum || !locate) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const sql = `INSERT INTO Pedidos (name_item, description, quantity_item, category, status, urgencia_enum, locate)
                VALUES (?, ?, ?, ?, 'open', ?, ?)`;
    db.query(sql, [name_item, description, quantity_item, category, urgencia_enum, locate], (err, results) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
        } else {
            res.status(201).send('Pedido realizado.');
        }
    });
});

router.get('/pedido', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT * FROM Pedidos WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedido:', err);
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;