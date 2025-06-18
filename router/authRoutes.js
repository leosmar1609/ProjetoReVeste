import express from 'express';

import pessoasFisicasRoutes from './pessoasFisicas.js';
import instituicoesRoutes from './instituicoes.js';
import doadorRoutes from './doador.js';
import pedidosRoutes from './pedidos.js';
import rotasGerais from './rotasGerais.js';

const router = express.Router();

router.use(pessoasFisicasRoutes);
router.use(instituicoesRoutes);
router.use(doadorRoutes);
router.use(pedidosRoutes);
router.use(rotasGerais);

export default router;
