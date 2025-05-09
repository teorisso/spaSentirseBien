import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../middleware/auth';
import dbConnect from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Extended request interface with user property
interface ExtendedNextApiRequest extends NextApiRequest {
  user?: {
    _id: string;
    [key: string]: any;
  };
}

// Handler for HTTP methods
async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB
  await dbConnect();
  const db = mongoose.connection.db;

  // Check if db is initialized
  if (!db) {
    return res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const userId = new ObjectId(req.user._id);

  try {
    // GET request - retrieve user profile
    if (req.method === 'GET') {
      const user = await db.collection('users').findOne({ _id: userId }, {
        projection: {
          password: 0,  // Exclude password from results
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.status(200).json(user);
    }

    // PUT request - update user profile
    if (req.method === 'PUT') {
      const { nombre, email, telefono, direccion } = req.body;

      // Validate required fields
      if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios' });
      }

      // Check if email is already used by another user
      if (email !== req.user.email) {
        const existingUser = await db.collection('users').findOne({
          email,
          _id: { $ne: userId }
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Este correo electrónico ya está en uso' });
        }
      }

      // Update user data
      const updateData = {
        nombre,
        email,
        telefono: telefono || '',
        direccion: direccion || '',
        updated_at: new Date()
      };

      const result = await db.collection('users').findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        { returnDocument: 'after', projection: { password: 0 } }
      );

      if (!result) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.status(200).json(result);
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error('Error en API de perfil:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
  // No need to close connection as dbConnect handles connection caching
}

// Wrap the handler with authentication middleware
export default function profileEndpoint(req: ExtendedNextApiRequest, res: NextApiResponse) {
  authenticate(req, res, () => handler(req, res));
}