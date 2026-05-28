import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST - Login do usuário
router.post('/login', AuthController.login);

// POST - Registrar novo usuário
router.post('/register', AuthController.register);

// GET - Buscar perfil do usuário (requer autenticação)
router.get('/profile', authMiddleware, AuthController.getProfile);

// PUT - Atualizar perfil do usuário
router.put('/profile', authMiddleware, AuthController.updateProfile);

// DELETE - Fazer logout (limpar sessão)
router.delete('/logout', authMiddleware, AuthController.logout);

// DELETE - Deletar conta do usuário
router.delete('/account', authMiddleware, AuthController.deleteAccount);

export default router;
