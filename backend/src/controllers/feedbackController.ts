import { Response } from 'express';
import { getDatabase } from '../database/connection';
import { IFeedback } from '../types';
import { AuthRequest } from '../middleware/auth';

export class FeedbackController {
  // POST - Enviar feedback para um colega ou gestor
  static async sendFeedback(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { evaluated_id, rating, comment, is_anonymous, feedback_type } = req.body as Partial<IFeedback>;

      if (!evaluated_id || !rating) {
        res.status(400).json({ message: 'ID do avaliado e nota são obrigatórios' });
        return;
      }

      if (rating < 1 || rating > 5) {
        res.status(400).json({ message: 'Nota deve ser entre 1 e 5' });
        return;
      }

      if (req.user.id === evaluated_id) {
        res.status(400).json({ message: 'Não é possível avaliar a si mesmo' });
        return;
      }

      const db = getDatabase();

      // Verificar se o usuário avaliado existe
      const evaluatedUser = await db.get('SELECT id FROM users WHERE id = ?', [evaluated_id]);
      if (!evaluatedUser) {
        res.status(404).json({ message: 'Usuário avaliado não encontrado' });
        return;
      }

      // Verificar se já há feedback do mesmo avaliador para o mesmo avaliado neste mês
      const existingFeedback = await db.get(
        `SELECT id FROM feedbacks 
         WHERE evaluator_id = ? AND evaluated_id = ? AND feedback_type = ? 
         AND date(created_at) >= date('now', 'start of month')`,
        [req.user.id, evaluated_id, feedback_type || 'colleague']
      );

      if (existingFeedback) {
        res.status(400).json({ message: 'Você já forneceu feedback para esta pessoa este mês' });
        return;
      }

      const result = await db.run(
        `INSERT INTO feedbacks (evaluator_id, evaluated_id, rating, comment, is_anonymous, feedback_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, evaluated_id, rating, comment || null, is_anonymous ? 1 : 0, feedback_type || 'colleague']
      );

      res.status(201).json({
        message: 'Feedback enviado com sucesso',
        feedbackId: result.lastID
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao enviar feedback', error: (error as Error).message });
    }
  }

  // GET - Listar usuários para avaliar (colegas ou gestores)
  static async getEvaluableUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { type } = req.query as { type?: string };
      const db = getDatabase();

      let query = 'SELECT id, name, department, role FROM users WHERE id != ?';
      const params: any[] = [req.user.id];

      if (type === 'managers') {
        query += ' AND role = ?';
        params.push('manager');
      }

      query += ' ORDER BY name';
      const users = await db.all(query, params);

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: (error as Error).message });
    }
  }

  // GET - Obter feedbacks recebidos pelo usuário
  static async getReceivedFeedbacks(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const db = getDatabase();
      const feedbacks = await db.all(
        `SELECT f.id, f.rating, f.comment, f.feedback_type, f.created_at, 
                CASE WHEN f.is_anonymous = 1 THEN 'Anônimo' ELSE u.name END as evaluator_name
         FROM feedbacks f
         LEFT JOIN users u ON f.evaluator_id = u.id
         WHERE f.evaluated_id = ?
         ORDER BY f.created_at DESC`,
        [req.user.id]
      );

      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar feedbacks', error: (error as Error).message });
    }
  }

  // GET - Obter estatísticas de feedback do usuário
  static async getFeedbackStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const db = getDatabase();
      
      const stats = await db.get(
        `SELECT 
          COUNT(*) as total_feedbacks,
          AVG(rating) as average_rating,
          MIN(rating) as lowest_rating,
          MAX(rating) as highest_rating,
          SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positive_count,
          SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END) as negative_count
         FROM feedbacks
         WHERE evaluated_id = ?`,
        [req.user.id]
      );

      const byType = await db.all(
        `SELECT 
          feedback_type,
          COUNT(*) as count,
          AVG(rating) as average
         FROM feedbacks
         WHERE evaluated_id = ?
         GROUP BY feedback_type`,
        [req.user.id]
      );

      res.status(200).json({
        ...stats,
        by_type: byType
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar estatísticas', error: (error as Error).message });
    }
  }

  // DELETE - Deletar um feedback (apenas o avaliador)
  static async deleteFeedback(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { feedbackId } = req.params;
      const db = getDatabase();

      const feedback = await db.get('SELECT evaluator_id FROM feedbacks WHERE id = ?', [feedbackId]);

      if (!feedback) {
        res.status(404).json({ message: 'Feedback não encontrado' });
        return;
      }

      if (feedback.evaluator_id !== req.user.id) {
        res.status(403).json({ message: 'Você não tem permissão para deletar este feedback' });
        return;
      }

      await db.run('DELETE FROM feedbacks WHERE id = ?', [feedbackId]);

      res.status(200).json({ message: 'Feedback deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar feedback', error: (error as Error).message });
    }
  }

  // PUT - Atualizar um feedback (apenas o avaliador)
  static async updateFeedback(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { feedbackId } = req.params;
      const { rating, comment } = req.body;

      if (!rating) {
        res.status(400).json({ message: 'Nota é obrigatória' });
        return;
      }

      if (rating < 1 || rating > 5) {
        res.status(400).json({ message: 'Nota deve ser entre 1 e 5' });
        return;
      }

      const db = getDatabase();
      const feedback = await db.get('SELECT evaluator_id FROM feedbacks WHERE id = ?', [feedbackId]);

      if (!feedback) {
        res.status(404).json({ message: 'Feedback não encontrado' });
        return;
      }

      if (feedback.evaluator_id !== req.user.id) {
        res.status(403).json({ message: 'Você não tem permissão para atualizar este feedback' });
        return;
      }

      await db.run(
        'UPDATE feedbacks SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [rating, comment || null, feedbackId]
      );

      const updated = await db.get('SELECT * FROM feedbacks WHERE id = ?', [feedbackId]);

      res.status(200).json({
        message: 'Feedback atualizado com sucesso',
        feedback: updated
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar feedback', error: (error as Error).message });
    }
  }
}
