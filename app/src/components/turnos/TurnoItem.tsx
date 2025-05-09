// src/components/turnos/TurnoItem.tsx
import React from 'react';
import { Turno } from '../../lib/turnos.api';

interface TurnoItemProps {
    turno: Turno;
    onUpdate: (id: string, payload: Partial<Pick<Turno, 'status'>>) => void;
    onDelete: (id: string) => void;
}

export default function TurnoItem({ turno, onUpdate, onDelete }: TurnoItemProps) {
    const formattedDate = new Date(turno.date).toLocaleString('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <li className="flex justify-between items-center border-b py-2">
            <div>
                <p className="font-semibold">{turno.serviceData.name}</p>
                <p className="text-sm text-stone">{formattedDate}</p>
                <p className="text-sm capitalize">{turno.status}</p>
            </div>
            <div className="flex gap-2">
                {turno.status !== 'cancelado' && (
                    <button
                        onClick={() => onUpdate(turno._id, { status: 'cancelado' })}
                        className="px-3 py-1 bg-stone text-white rounded hover:bg-stone/80 text-sm"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    onClick={() => onDelete(turno._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                    Eliminar
                </button>
            </div>
        </li>
    );
}
