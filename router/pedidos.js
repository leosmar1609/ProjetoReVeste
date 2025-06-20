import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import db from '../db.js';

router.delete('/deletepedido', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
  }

  try {
    const [resultado] = await db.query('DELETE FROM pedidos WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    res.status(200).json({ mensagem: 'Pedido deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/pedidosup', async (req, res) => {
  const { id, status } = req.body;

  if (!status) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const [resultado] = await db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    res.status(200).json({ mensagem: 'Pedido atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar o pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/confirmar-recebimento', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
  }

  const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
  const status = 'Concluído';

  try {
    const [resultado] = await db.query(sql, [status, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    res.status(200).json({ mensagem: 'Recebimento confirmado com sucesso' });
  } catch (err) {
    console.error('Erro ao confirmar recebimento do pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/cancelar-pedido', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ mensagem: 'ID do pedido é obrigatório' });
  }

  const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
  const status = 'Cancelado';

  try {
    const [resultado] = await db.query(sql, [status, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    res.status(200).json({ mensagem: 'Pedido cancelado com sucesso' });
  } catch (err) {
    console.error('Erro ao cancelar o pedido:', err);
    res.status(500).send('Erro no servidor');
  }
});

export default router;