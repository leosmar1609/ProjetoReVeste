import express from 'express';

import pessoasFisicasRoutes from './pessoasFisicas.js';
import instituicoesRoutes from './instituicoes.js';
import doadorRoutes from './doador.js';
import pedidosRoutes from './pedidos.js';
import rotasGerais from './rotasGerais.js';
import { enviarEmailVerificacaoPessoa } from './emailService.js';
import { enviarEmailVerificacaoInstituicao } from './emailService.js';

const router = express.Router();

router.use(pessoasFisicasRoutes);
router.use(instituicoesRoutes);
router.use(doadorRoutes);
router.use(pedidosRoutes);
router.use(rotasGerais);
router.use(enviarEmailVerificacaoPessoa);
router.use(enviarEmailVerificacaoInstituicao);

export default router;