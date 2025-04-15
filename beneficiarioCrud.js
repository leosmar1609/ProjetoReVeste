// const express = require('express');
// const mysql = require('mysql2');
// require('dotenv').config();
// const jwt = require('jsonwebtoken');

// const router = express.Router();
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });
// // CRUD para Instituicao_Beneficiaria
// // Criar (Create)
//✅
// router.post('/registerIB', (req, res) => {
//     const { nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc } = req.body;

//     if (!nameInc || !emailInc || !passwordInc || !cnpjInc || !locationInc || !historyInc) {
//         return res.status(400).json({ error: 'Preencha todos os campos!' });
//     }

//     const sql = `INSERT INTO instituicao_beneficiaria (nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc) 
//                VALUES (?, ?, ?, ?, ?, ?)`;
//     db.query(sql, [nameInc, emailInc, passwordInc, cnpjInc, locationInc, historyInc], (err, results) => {
//         if (err) {
//             console.error('Erro ao criar instituição:', err);
//         } else {
//             console.log('Instituição criada com sucesso:', results);
//         }
//     });
// });
//✅
// // Ler (Read)
// router.get('/instituicao', (req, res) => {
//     const id = req.query.id;
//     const sql = 'SELECT * FROM Instituicao_Beneficiaria WHERE id = ?';
//     db.query(sql, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao buscar instituição:', err);
//             res.status(500).send('Erro no servidor');
//         } else {
//             res.json(results);
//         }
//     });
// });

// // Atualizar (Update)
// function updateInstituicao(id, name, email, password, cnpj, location, history) {
//     const sql = `UPDATE Instituicao_Beneficiaria SET name = ?, email = ?, password = ?, cnpj = ?, location = ?, history = ? 
//                WHERE id = ?`;
//     connection.query(sql, [name, email, password, cnpj, location, history, id], (err, results) => {
//         if (err) {
//             console.error('Erro ao atualizar instituição:', err);
//         } else {
//             console.log('Instituição atualizada com sucesso:', results);
//         }
//     });
// }

// // Deletar (Delete)
// function deleteInstituicao(id) {
//     const sql = 'DELETE FROM Instituicao_Beneficiaria WHERE id = ?';
//     connection.query(sql, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao deletar instituição:', err);
//         } else {
//             console.log('Instituição deletada com sucesso:', results);
//         }
//     });
// }
//✅
// // CRUD para Pessoa_Beneficiaria
// // Criar (Create)
// router.post('/registerPB', (req, res) => {
// const { namePer, emailPer, passwordPer, cpfPer, historyPer } = req.body;

// if (!namePer || !emailPer || !passwordPer || !cpfPer || !historyPer) {
//     return res.status(400).json({ error: 'Preencha todos os campos!' });
// }

// const sql = `INSERT INTO Pessoa_Beneficiaria (namePer, emailPer, passwordPer, cpfPer, historyPer) 
//                VALUES (?, ?, ?, ?, ?)`;
// db.query(sql, [namePer, emailPer, passwordPer, cpfPer, historyPer], (err, results) => {
//     if (err) {
//         console.error('Erro ao criar pessoa:', err);
//     } else {
//         console.log('Pessoa criada com sucesso:', results);
//     }
// });
//✅
// // Ler (Read)
// router.get('/pessoa', (req, res) => {
//     const id = req.query.id;
//     const sql = 'SELECT * FROM Pessoa_Beneficiaria WHERE id = ?';
//     db.query(sql, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao buscar instituição:', err);
//             res.status(500).send('Erro no servidor');
//         } else {
//             res.json(results);
//         }
//     });
// });

// // Atualizar (Update)
// function updatePessoa(id, name, email, password, cpf, history, instituicao_beneficiaria_id) {
//     const sql = `UPDATE Pessoa_Beneficiaria SET name = ?, email = ?, password = ?, cpf = ?, history = ?, instituicao_beneficiaria_id = ? 
//                WHERE id = ?`;
//     connection.query(sql, [name, email, password, cpf, history, instituicao_beneficiaria_id, id], (err, results) => {
//         if (err) {
//             console.error('Erro ao atualizar pessoa:', err);
//         } else {
//             console.log('Pessoa atualizada com sucesso:', results);
//         }
//     });
// }

// // Deletar (Delete)
// function deletePessoa(id) {
//     const sql = 'DELETE FROM Pessoa_Beneficiaria WHERE id = ?';
//     connection.query(sql, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao deletar pessoa:', err);
//         } else {
//             console.log('Pessoa deletada com sucesso:', results);
//         }
//     });
// }

// // CRUD para Pedidos
// // Criar (Create)
// function createPedido(name_item, description, quantity_item, category, status, urgencia_enum, locate, pessoa_beneficiaria_id, instituicao_id) {
//     const sql = `INSERT INTO Pedidos (name_item, description, quantity_item, category, status, urgencia_enum, locate, pessoa_beneficiaria_id, instituicao_id) 
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     connection.query(sql, [name_item, description, quantity_item, category, status, urgencia_enum, locate, pessoa_beneficiaria_id, instituicao_id], (err, results) => {
//         if (err) {
//             console.error('Erro ao criar pedido:', err);
//         } else {
//             console.log('Pedido criado com sucesso:', results);
//         }
//     });
// }

// // Ler (Read)
// function getPedidoById(id) {
//     const sql = 'SELECT * FROM Pedidos WHERE id = ?';
//     connection.query(sql, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao buscar pedido:', err);
//         } else {
//             console.log('Pedido encontrado:', results);
//         }
//     });
// }

// // Atualizar (Update)
// function updatePedido(id, name_item, description, quantity_item, category, status, urgencia_enum, locate, pessoa_beneficiaria_id, instituicao_id) {
//     const sql = `UPDATE Pedidos SET name_item = ?, description = ?, quantity_item = ?, category = ?, status = ?, urgencia_enum = ?, locate = ?, pessoa_beneficiaria_id = ?, instituicao_id = ? 
//                WHERE id = ?`;
//     connection.query(sql, [name_item, description, quantity_item, category, status, urgencia_enum, locate, pessoa_beneficiaria_id, instituicao_id, id], (err, results) => {
//         if (err) {
//             console.error('Erro ao atualizar pedido:', err);
//         } else {
//             console.log('Pedido atualizado com sucesso:', results);
//         }
//     });
// }

// // Deletar (Delete)
// function deletePedido(id) {
//     const sql = 'DELETE FROM Pedidos WHERE id = ?';
//     connection.query(sql, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao deletar pedido:', err);
//         } else {
//             console.log('Pedido deletado com sucesso:', results);
//         }
//     });
// }

// // Fechando a conexão (caso deseje)
// function closeConnection() {
//     connection.end((err) => {
//         if (err) {
//             console.error('Erro ao fechar a conexão:', err);
//         } else {
//             console.log('Conexão fechada com sucesso.');
//         }
//     });
// }

// module.exports = {
//     createInstituicao,
//     getInstituicaoById,
//     updateInstituicao,
//     deleteInstituicao,
//     createPessoa,
//     getPessoaById,
//     updatePessoa,
//     deletePessoa,
//     createPedido,
//     getPedidoById,
//     updatePedido,
//     deletePedido,
//     closeConnection
// };