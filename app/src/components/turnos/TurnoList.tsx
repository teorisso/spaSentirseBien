// src/components/turnos/TurnoList.tsx
import React from 'react';
import { Turno } from '../../lib/turnos.api';
import TurnoItem from './TurnoItem';

interface TurnoListProps {
    turnos: Turno[];
    onUpdate: (id: string, payload: Partial<Pick<Turno, 'status'>>) => void;
    onDelete: (id: string) => void;
}

export default function TurnoList({ turnos, onUpdate, onDelete }: TurnoListProps) {
    if (turnos.length === 0) {
        return <p className="text-center text-stone">No tienes turnos reservados.</p>;
    }
    return (
        <ul className="space-y-2">
            {turnos.map(t => (
                <TurnoItem key={t._id} turno={t} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
        </ul>
    );
}
