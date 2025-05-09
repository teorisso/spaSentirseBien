import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const { name, email } = req.body;

        // Validar datos
        if (!name || !email) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Verificar si el email ya está en uso por otro usuario
        const existingUser = await User.findOne({
            email,
            _id: { $ne: session.user._id }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        // Actualizar usuario
        const user = await User.findByIdAndUpdate(
            session.user._id,
            { name, email },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
} 