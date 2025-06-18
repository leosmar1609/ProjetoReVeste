import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import db from '../db.js';

router.delete('/deletepedido', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
    }

    const sql = 'DELETE FROM pedidos WHERE id = ?';

    db.query(sql, [id], (err, resultado) => {
        if (err) {
            console.error('Erro ao deletar pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Pedido deletado com sucesso' });
    });
});

router.put('/pedidosup', (req, res) => {
    const id = req.body.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';

    db.query(sql, [status, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao atualizar o pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Pedido atualizado com sucesso' });
    });
});

router.put('/confirmar-recebimento', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    const status = 'Concluído';

    db.query(sql, [status, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao confirmar recebimento do pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Recebimento confirmado com sucesso' });
    });
});

router.put('/cancelar-pedido', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    const status = 'Cancelado';

    db.query(sql, [status, id], (err, resultado) => {
        if (err) {
            console.error('Erro ao cancelar o pedido:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

        res.status(200).json({ mensagem: 'Pedido cancelado com sucesso' });
    });
});

export default router;