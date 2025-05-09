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

    if (req.method === 'GET') {
        try {
            await dbConnect();
            const turnos = await Turno.find({ userId: session.user?.id })
                .populate('service', 'name duration price')
                .populate('professional', 'name')
                .sort({ date: 1, startTime: 1 });
            
            res.status(200).json(turnos);
        } catch (error: any) {
            console.error('Error al obtener turnos:', error);
            res.status(500).json({ message: 'Error al obtener los turnos' });
        }
    } else if (req.method === 'POST') {
        try {
            const { service, professional, date, startTime, endTime, duration, notes } = req.body;

            // Validar fecha
            const fechaResult = validations.validarFecha(date);
            if (!fechaResult.isValid) {
                return res.status(400).json({ message: fechaResult.error });
            }

            // Validar horario
            const horarioResult = validations.validarHorario(startTime);
            if (!horarioResult.isValid) {
                return res.status(400).json({ message: horarioResult.error });
            }

            // Validar duración
            const duracionResult = validations.validarDuracion(duration);
            if (!duracionResult.isValid) {
                return res.status(400).json({ message: duracionResult.error });
            }

            // Validar disponibilidad
            const disponibilidadResult = await validations.validarDisponibilidad(
                date,
                startTime,
                endTime,
                professional
            );

            if (!disponibilidadResult.isValid) {
                return res.status(400).json({ message: disponibilidadResult.error });
            }

            await dbConnect();

            const turno = new Turno({
                userId: session.user?.id,
                service,
                professional,
                date,
                startTime,
                endTime,
                duration,
                notes,
                status: 'pendiente'
            });

            await turno.save();

            // Obtener el turno completo con los datos poblados
            const turnoCompleto = await Turno.findById(turno._id)
                .populate('service', 'name duration price')
                .populate('professional', 'name');

            res.status(201).json(turnoCompleto);
        } catch (error: any) {
            console.error('Error al crear turno:', error);
            res.status(500).json({ message: 'Error al crear el turno' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 