import { Response } from 'express';
import { getDatabase } from '../database/connection';
import { AuthRequest } from '../middleware/auth';

export class ReportsController {
  // GET - Relatório geral (apenas gestores e admins)
  static async getOverallReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      // Verificar se é gestor ou admin
      if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Apenas gestores e administradores podem acessar relatórios' });
        return;
      }

      const db = getDatabase();

      // Estatísticas gerais
      const generalStats = await db.get(`
        SELECT 
          COUNT(DISTINCT evaluated_id) as users_evaluated,
          COUNT(*) as total_feedbacks,
          AVG(rating) as average_rating,
          MIN(rating) as lowest_rating,
          MAX(rating) as highest_rating
        FROM feedbacks
      `);

      // Feedbacks por tipo
      const feedbacksByType = await db.all(`
        SELECT 
          feedback_type,
          COUNT(*) as count,
          AVG(rating) as average_rating,
          COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive,
          COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative
        FROM feedbacks
        GROUP BY feedback_type
      `);

      // Top rated employees
      const topRated = await db.all(`
        SELECT 
          u.id,
          u.name,
          u.department,
          COUNT(f.id) as feedback_count,
          ROUND(AVG(f.rating), 2) as average_rating
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id
        WHERE u.role = 'employee'
        GROUP BY u.id
        HAVING COUNT(f.id) > 0
        ORDER BY average_rating DESC
        LIMIT 10
      `);

      // Employees needing improvement
      const needImprovement = await db.all(`
        SELECT 
          u.id,
          u.name,
          u.department,
          COUNT(f.id) as feedback_count,
          ROUND(AVG(f.rating), 2) as average_rating
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id
        WHERE u.role = 'employee'
        GROUP BY u.id
        HAVING COUNT(f.id) > 0
        ORDER BY average_rating ASC
        LIMIT 10
      `);

      res.status(200).json({
        general: generalStats,
        by_type: feedbacksByType,
        top_rated: topRated,
        need_improvement: needImprovement
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar relatório', error: (error as Error).message });
    }
  }

  // GET - Relatório por departamento (apenas para gestores do depto ou admins)
  static async getDepartmentReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Apenas gestores e administradores podem acessar relatórios' });
        return;
      }

      const { department } = req.query as { department?: string };

      if (!department) {
        res.status(400).json({ message: 'Departamento é obrigatório' });
        return;
      }

      const db = getDatabase();

      // Estatísticas do departamento
      const deptStats = await db.get(`
        SELECT 
          u.department,
          COUNT(DISTINCT u.id) as total_employees,
          COUNT(DISTINCT f.evaluated_id) as employees_evaluated,
          COUNT(f.id) as total_feedbacks,
          ROUND(AVG(f.rating), 2) as average_rating
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id
        WHERE u.department = ? AND u.role = 'employee'
        GROUP BY u.department
      `, [department]);

      // Funcionários do departamento e suas avaliações
      const employees = await db.all(`
        SELECT 
          u.id,
          u.name,
          u.department,
          COUNT(f.id) as feedback_count,
          ROUND(AVG(f.rating), 2) as average_rating,
          COUNT(CASE WHEN f.rating >= 4 THEN 1 END) as positive_count,
          COUNT(CASE WHEN f.rating <= 2 THEN 1 END) as negative_count
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id
        WHERE u.department = ? AND u.role = 'employee'
        GROUP BY u.id
        ORDER BY average_rating DESC
      `, [department]);

      // Distribuição de notas
      const ratingDistribution = await db.all(`
        SELECT 
          f.rating,
          COUNT(*) as count
        FROM feedbacks f
        WHERE f.evaluated_id IN (
          SELECT id FROM users WHERE department = ? AND role = 'employee'
        )
        GROUP BY f.rating
        ORDER BY f.rating
      `, [department]);

      res.status(200).json({
        department_stats: deptStats,
        employees,
        rating_distribution: ratingDistribution
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar relatório', error: (error as Error).message });
    }
  }

  // GET - Médias de avaliação por usuário
  static async getUserAverages(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const db = getDatabase();

      const averages = await db.all(`
        SELECT 
          u.id,
          u.name,
          u.department,
          u.role,
          COUNT(f.id) as feedback_count,
          ROUND(AVG(f.rating), 2) as average_rating,
          COUNT(CASE WHEN f.feedback_type = 'colleague' THEN 1 END) as colleague_feedbacks,
          ROUND(AVG(CASE WHEN f.feedback_type = 'colleague' THEN f.rating END), 2) as colleague_avg,
          COUNT(CASE WHEN f.feedback_type = 'manager' THEN 1 END) as manager_feedbacks,
          ROUND(AVG(CASE WHEN f.feedback_type = 'manager' THEN f.rating END), 2) as manager_avg
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id
        GROUP BY u.id
        HAVING COUNT(f.id) > 0
        ORDER BY average_rating DESC
      `);

      res.status(200).json(averages);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar médias', error: (error as Error).message });
    }
  }

  // GET - Listar todos os departamentos
  static async getDepartments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const db = getDatabase();

      const departments = await db.all(`
        SELECT DISTINCT department
        FROM users
        WHERE department IS NOT NULL
        ORDER BY department
      `);

      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar departamentos', error: (error as Error).message });
    }
  }

  // GET - Relatório de gestores (para admin)
  static async getManagersReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        res.status(403).json({ message: 'Apenas gestores e administradores podem acessar este relatório' });
        return;
      }

      const db = getDatabase();

      const managers = await db.all(`
        SELECT 
          u.id,
          u.name,
          u.department,
          COUNT(f.id) as feedback_count,
          ROUND(AVG(f.rating), 2) as average_rating,
          COUNT(CASE WHEN f.rating >= 4 THEN 1 END) as positive_count,
          COUNT(CASE WHEN f.rating <= 2 THEN 1 END) as negative_count
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id AND f.feedback_type = 'manager'
        WHERE u.role = 'manager'
        GROUP BY u.id
        ORDER BY average_rating DESC
      `);

      res.status(200).json(managers);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar relatório de gestores', error: (error as Error).message });
    }
  }

  // GET - Trending (recentes alterações)
  static async getTrendingFeedbacks(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Apenas gestores e administradores podem acessar este relatório' });
        return;
      }

      const db = getDatabase();

      const trending = await db.all(`
        SELECT 
          u.name as user_name,
          u.department,
          COUNT(f.id) as feedbacks_last_30_days,
          ROUND(AVG(f.rating), 2) as recent_average
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id 
          AND date(f.created_at) >= date('now', '-30 days')
        WHERE u.role = 'employee'
        GROUP BY u.id
        HAVING COUNT(f.id) > 0
        ORDER BY COUNT(f.id) DESC
        LIMIT 15
      `);

      res.status(200).json(trending);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar trending', error: (error as Error).message });
    }
  }

  // GET - Comparação departamentos
  static async getDepartmentsComparison(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Apenas gestores e administradores podem acessar relatórios' });
        return;
      }

      const db = getDatabase();

      const comparison = await db.all(`
        SELECT 
          u.department,
          COUNT(DISTINCT u.id) as total_employees,
          COUNT(DISTINCT f.evaluated_id) as employees_evaluated,
          COUNT(f.id) as total_feedbacks,
          ROUND(AVG(f.rating), 2) as average_rating,
          COUNT(CASE WHEN f.rating >= 4 THEN 1 END) as positive_count,
          COUNT(CASE WHEN f.rating <= 2 THEN 1 END) as negative_count
        FROM users u
        LEFT JOIN feedbacks f ON u.id = f.evaluated_id
        WHERE u.role = 'employee'
        GROUP BY u.department
        ORDER BY average_rating DESC
      `);

      res.status(200).json(comparison);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar comparação', error: (error as Error).message });
    }
  }
}
