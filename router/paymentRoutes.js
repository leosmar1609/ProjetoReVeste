import express from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const router = express.Router();

// Config do Mercado Pago (token no .env)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Criar pagamento Pix
router.post('/pix', async (req, res) => {
  try {
    const { amount, email } = req.body;

    const payment = new Payment(client);

    const body = {
      transaction_amount: Number(amount) || 10.0,
      description: "Pagamento via Pix",
      payment_method_id: "pix",
      payer: {
        email: email || "test_user_123456@testuser.com"
      }
    };

    const response = await payment.create({ body });

    res.json({
      id: response.id,
      status: response.status,
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: response.point_of_interaction.transaction_data.ticket_url
    });
  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

export default router;
