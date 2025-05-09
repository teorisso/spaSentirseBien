import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import { Turno } from '@/models/Turno';
import { validations } from '@/lib/validations';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'ID de turno no proporcionado' });
    }

    try {
        await dbConnect();

        const turno = await Turno.findById(id)
            .populate('service', 'name duration price')
            .populate('professional', 'name');

        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        // Verificar que el usuario sea el propietario del turno
        if (turno.userId.toString() !== session.user?.id) {
            return res.status(403).json({ message: 'No tienes permiso para modificar este turno' });
        }

        if (req.method === 'GET') {
            res.status(200).json(turno);
        } else if (req.method === 'PUT') {
            const { status } = req.body;

            // Solo permitir cancelar turnos pendientes
            if (status === 'cancelado' && turno.status !== 'pendiente') {
                return res.status(400).json({ 
                    message: 'Solo se pueden cancelar turnos pendientes' 
                });
            }

            // Validar que no se intente cancelar un turno pasado
            if (status === 'cancelado') {
                const fechaResult = validations.validarFecha(turno.date);
                if (!fechaResult.isValid) {
                    return res.status(400).json({ 
                        message: 'No se pueden cancelar turnos pasados' 
                    });
                }
            }

            turno.status = status;
            await turno.save();

            res.status(200).json(turno);
        } else if (req.method === 'DELETE') {
            // Solo permitir eliminar turnos cancelados
            if (turno.status !== 'cancelado') {
                return res.status(400).json({ 
                    message: 'Solo se pueden eliminar turnos cancelados' 
                });
            }

            await Turno.findByIdAndDelete(id);
            res.status(204).end();
        } else {
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('Error al manejar turno:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
} 