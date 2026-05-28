import { Response } from 'express';
import { getDatabase } from '../database/connection';
import { IUser, ILoginRequest, ILoginResponse } from '../types';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        res.status(400).json({ message: 'Email e senha são obrigatórios' });
        return;
      }

      const db = getDatabase();
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

      if (!user) {
        res.status(401).json({ message: 'Email ou senha incorretos' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ message: 'Email ou senha incorretos' });
        return;
      }

      const secretKey = process.env.JWT_SECRET || 'secret';
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secretKey as jwt.Secret,
        { expiresIn: process.env.JWT_EXPIRE || '24h' } as jwt.SignOptions
      );

      await db.run(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+24 hours"))',
        [user.id, token]
      );

      const userResponse: Omit<IUser, 'password'> = {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
        created_at: user.created_at
      };

      const response: ILoginResponse = {
        token,
        user: userResponse
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao fazer login', error: (error as Error).message });
    }
  }

  static async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const token = req.headers.authorization?.split(' ')[1];
      const db = getDatabase();

      await db.run('DELETE FROM sessions WHERE token = ?', [token]);

      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao fazer logout', error: (error as Error).message });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const db = getDatabase();
      const user = await db.get('SELECT id, email, name, department, role, created_at FROM users WHERE id = ?', [req.user.id]);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar perfil', error: (error as Error).message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { name, department } = req.body;
      const db = getDatabase();

      await db.run(
        'UPDATE users SET name = ?, department = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name || req.user.name, department || req.user.department, req.user.id]
      );

      const updatedUser = await db.get('SELECT id, email, name, department, role FROM users WHERE id = ?', [req.user.id]);

      res.status(200).json({ message: 'Perfil atualizado com sucesso', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar perfil', error: (error as Error).message });
    }
  }

  static async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const db = getDatabase();

      await db.run('DELETE FROM sessions WHERE user_id = ?', [req.user.id]);
      await db.run('DELETE FROM users WHERE id = ?', [req.user.id]);

      res.status(200).json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar conta', error: (error as Error).message });
    }
  }

  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, name, department } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ message: 'Email, senha e nome são obrigatórios' });
        return;
      }

      const db = getDatabase();
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);

      if (existingUser) {
        res.status(409).json({ message: 'Email já registrado' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.run(
        'INSERT INTO users (email, password, name, department, role) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, name, department || null, 'employee']
      );

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        userId: result.lastID
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao registrar usuário', error: (error as Error).message });
    }
  }
}
