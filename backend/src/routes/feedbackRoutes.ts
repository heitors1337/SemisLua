import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST - Enviar feedback
router.post('/', authMiddleware, FeedbackController.sendFeedback);

// GET - Listar usuários para avaliar
router.get('/evaluable-users', authMiddleware, FeedbackController.getEvaluableUsers);

// GET - Feedbacks recebidos
router.get('/received', authMiddleware, FeedbackController.getReceivedFeedbacks);

// GET - Estatísticas de feedback
router.get('/stats', authMiddleware, FeedbackController.getFeedbackStats);

// PUT - Atualizar feedback
router.put('/:feedbackId', authMiddleware, FeedbackController.updateFeedback);

// DELETE - Deletar feedback
router.delete('/:feedbackId', authMiddleware, FeedbackController.deleteFeedback);

export default router;
