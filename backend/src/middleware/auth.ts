import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { IUser, IAuthRequest } from '../types';

export interface AuthRequest extends Request {
  user?: IUser;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    const secretKey: Secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secretKey) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
}
