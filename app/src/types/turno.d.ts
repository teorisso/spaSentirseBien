import { Document } from 'mongoose';

export interface ITurno extends Document {
    userId: string;
    service: string;
    professional: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    notes?: string;
    status: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
    createdAt: Date;
    updatedAt: Date;
}

export interface TurnoWithDetails extends Omit<ITurno, 'service' | 'professional'> {
    service: {
        _id: string;
        name: string;
        duration: number;
        price: number;
    };
    professional: {
        _id: string;
        name: string;
    };
} 