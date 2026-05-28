import { Router } from 'express';
import { ReportsController } from '../controllers/reportsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET - Relatório geral
router.get('/overall', authMiddleware, ReportsController.getOverallReport);

// GET - Relatório por departamento
router.get('/department', authMiddleware, ReportsController.getDepartmentReport);

// GET - Médias de avaliação por usuário
router.get('/averages', authMiddleware, ReportsController.getUserAverages);

// GET - Listar departamentos
router.get('/departments', authMiddleware, ReportsController.getDepartments);

// GET - Relatório de gestores
router.get('/managers', authMiddleware, ReportsController.getManagersReport);

// GET - Trending feedbacks
router.get('/trending', authMiddleware, ReportsController.getTrendingFeedbacks);

// GET - Comparação entre departamentos
router.get('/comparison', authMiddleware, ReportsController.getDepartmentsComparison);

export default router;
