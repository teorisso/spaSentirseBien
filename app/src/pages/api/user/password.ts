import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { compare, hash } from 'bcryptjs';
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

        const { currentPassword, newPassword } = req.body;

        // Validar datos
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Obtener usuario
        const user = await User.findById(session.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar contraseña actual
        const isValid = await compare(currentPassword, user.password);

        if (!isValid) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }

        // Encriptar nueva contraseña
        const hashedPassword = await hash(newPassword, 12);

        // Actualizar contraseña
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({ message: 'Error al actualizar contraseña' });
    }
} 