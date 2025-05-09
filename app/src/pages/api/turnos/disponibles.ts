import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import { Turno } from '@/models/Turno';
import { validations } from '@/lib/validations';
import { HORARIO_INICIO, HORARIO_FIN } from '@/types/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Falta la fecha' });
        }

        // Validar la fecha
        const fechaResult = validations.validarFecha(date as string);
        if (!fechaResult.isValid) {
            return res.status(400).json({ message: fechaResult.error });
        }

        await dbConnect();

        // Obtener turnos existentes para la fecha especificada
        const turnosExistentes = await Turno.find({
            fecha: date,
            status: { $ne: 'cancelado' }
        });

        // Generar horarios disponibles
        const horariosDisponibles = [];
        const horaInicio = new Date(`${date}T${HORARIO_INICIO}`);
        const horaFin = new Date(`${date}T${HORARIO_FIN}`);

        // Intervalos de 30 minutos
        for (let hora = horaInicio; hora < horaFin; hora.setMinutes(hora.getMinutes() + 30)) {
            const horaFinIntervalo = new Date(hora.getTime() + 30 * 60000);
            
            // Verificar si el intervalo está disponible
            const haySolapamiento = turnosExistentes.some(turno => {
                const turnoInicio = new Date(`${date}T${turno.hora}`);
                const turnoFin = new Date(turnoInicio.getTime() + turno.duration * 60000);
                return (
                    (hora >= turnoInicio && hora < turnoFin) ||
                    (horaFinIntervalo > turnoInicio && horaFinIntervalo <= turnoFin) ||
                    (hora <= turnoInicio && horaFinIntervalo >= turnoFin)
                );
            });

            if (!haySolapamiento) {
                horariosDisponibles.push({
                    startTime: hora.toTimeString().slice(0, 5),
                    endTime: horaFinIntervalo.toTimeString().slice(0, 5)
                });
            }
        }

        res.status(200).json(horariosDisponibles);
    } catch (error: any) {
        console.error('Error al obtener horarios disponibles:', error);
        res.status(500).json({ message: 'Error al obtener horarios disponibles' });
    }
} 