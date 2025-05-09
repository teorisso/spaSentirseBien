import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { User } from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { name, email, password } = req.body;

        // Validar datos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe una cuenta con este email' });
        }

        // Encriptar contraseña
        const hashedPassword = await hash(password, 12);

        // Crear usuario
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        // Eliminar la contraseña del objeto de respuesta
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
} 