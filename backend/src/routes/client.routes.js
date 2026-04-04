import { Router } from 'express';
import { getClients, createClient, updateClient, deleteClient, classifyClient } from '../controllers/client.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas as rotas de clientes são protegidas
router.use(authMiddleware);

router.get('/', getClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.post('/:id/classify', classifyClient);

export default router;
