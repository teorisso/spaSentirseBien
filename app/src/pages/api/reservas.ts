import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import { ServiceModel } from '../../models/Service';
import { ReservationModel } from '../../models/Reservation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const reservas = await ReservationModel.find().populate('service');
      return res.status(200).json(reservas);
    }

    if (req.method === 'POST') {
      const { userId, serviceId, date } = req.body;

      if (!userId || !serviceId || !date) {
        return res.status(400).json({ error: 'Faltan datos en el formulario.' });
      }

      try {
        // Check if service exists
        const serviceExists = await ServiceModel.findById(serviceId);
        if (!serviceExists) {
          return res.status(404).json({ error: 'El servicio seleccionado no existe.' });
        }

        // Validate date
        const reservationDate = new Date(date);
        const currentDate = new Date();

        if (isNaN(reservationDate.getTime())) {
          return res.status(400).json({ error: 'Formato de fecha inválido.' });
        }

        if (reservationDate < currentDate) {
          return res.status(400).json({ error: 'La fecha de reserva debe ser futura.' });
        }

        const nueva = await ReservationModel.create({
          userId,
          service: serviceId,
          date: reservationDate
        });

        return res.status(201).json(nueva);
      } catch (error) {
        console.error('Error al crear la reserva:', error);
        return res.status(500).json({ error: 'Error al procesar la reserva.' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    return res.status(500).json({ error: 'Error de conexión a la base de datos.' });
  }
}