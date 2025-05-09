// src/middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Extended request interface with user property
interface ExtendedNextApiRequest extends NextApiRequest {
  user?: any; // Consider using a more specific type for your user data
}

export function authenticate(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function isAdmin(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  authenticate(req, res, () => {
    // After authentication, check if user has admin role
    // Before (in middleware/auth.ts)
    if (req.user && req.user.rol === 'admin') {  // This is correct
      next();
    } else {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
  });
}