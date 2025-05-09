import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

// Check if SECRET_KEY is set
if (!SECRET_KEY) {
  // Only throw in production, use fallback in development
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is not set');
  } else {
    console.warn('Warning: Using insecure default JWT_SECRET in development environment');
  }
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY || 'clave_secreta_demo', { expiresIn: '2h' });
}

export function verifyToken(token: string): jwt.JwtPayload | string | null {
  try {
    return jwt.verify(token, SECRET_KEY || 'clave_secreta_demo');
  } catch (error) {
    return null;
  }
}