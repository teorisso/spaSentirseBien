import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '../../models/User';
import dbConnect from '../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const { email, password, nombre, telefono } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Create new user
    // Note: Password hashing is handled by the pre-save middleware we created earlier
    await UserModel.create({
      email,
      password,
      nombre,
      telefono
    });

    return res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error en registro (detallado):', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Error en el servidor.' });
  }
}