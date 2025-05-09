import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import { Turno } from '@/models/Turno';
import { validations } from '@/lib/validations';
import mongoose from 'mongoose';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const session = await getServerSession(req, res, authOptions) as Session & { user: { id: string } };

        if (!session) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        await dbConnect();

        const { service, fecha, hora, notas } = req.body;

        if (!service || !fecha || !hora) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Validar fecha usando las validaciones existentes
        const fechaResult = validations.validarFecha(fecha);
        if (!fechaResult.isValid) {
            return res.status(400).json({ message: fechaResult.error });
        }

        // Validar horario usando las validaciones existentes
        const horarioResult = validations.validarHorario(hora);
        if (!horarioResult.isValid) {
            return res.status(400).json({ message: horarioResult.error });
        }

        // Verificar disponibilidad usando las validaciones existentes
        const turnosExistentes = await Turno.find({
            fecha: fecha,
            status: { $ne: 'cancelado' }
        });

        const disponibilidadResult = await validations.validarDisponibilidad(
            fecha,
            hora,
            60, // Duración por defecto de 60 minutos
            turnosExistentes
        );

        if (!disponibilidadResult.isValid) {
            return res.status(400).json({ message: disponibilidadResult.error });
        }

        // Crear el nuevo turno
        const turno = await Turno.create({
            userId: new mongoose.Types.ObjectId(session.user.id),
            service: new mongoose.Types.ObjectId(service),
            fecha: fecha,
            hora: hora,
            duration: 60, // Duración por defecto de 60 minutos
            notas: notas,
            status: 'pendiente'
        });

        return res.status(201).json({ message: 'Turno reservado exitosamente', turno });
    } catch (error) {
        console.error('Error al reservar turno:', error);
        return res.status(500).json({ message: 'Error al reservar el turno' });
    }
} 