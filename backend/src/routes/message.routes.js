import { Router } from 'express';
import { generateMessage, getMessageHistory } from '../controllers/message.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate', generateMessage);
router.get('/history', getMessageHistory);

export default router;
