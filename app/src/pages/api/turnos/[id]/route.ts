// src/pages/api/turnos/[id]/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect                from '../../../../lib/dbConnect';
import { authenticate }         from '../../../../middleware/auth';
import { Turno }                from '../../../../models/Turno';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Autenticación
    await new Promise<void>((resolve) =>
        authenticate(req as any, res, resolve)
    );
    const user = (req as any).user;
    if (!user || user.rol !== 'user')
        return res.status(401).json({ error: 'No autorizado' });

    await dbConnect();
    const { id } = req.query as { id: string };

    switch (req.method) {
        case 'PATCH': {
            const { date, service, status } = req.body;
            const updates: any = {};
            if (date)    updates.date    = new Date(date);
            if (service) updates.service = service;
            if (status)  updates.status  = status;

            const updated = await Turno.findOneAndUpdate(
                { _id: id, userId: user.id },
                updates,
                { new: true }
            );
            if (!updated) return res.status(404).json({ error: 'No existe turno' });
            return res.status(200).json(updated);
        }

        case 'DELETE': {
            const deleted = await Turno.findOneAndDelete({
                _id: id, userId: user.id
            });
            if (!deleted) return res.status(404).json({ error: 'No existe turno' });
            return res.status(200).json({ message: 'Turno cancelado' });
        }

        default:
            res.setHeader('Allow', ['PATCH','DELETE']);
            return res.status(405).end(`Method ${req.method} No permitido`);
    }
}
