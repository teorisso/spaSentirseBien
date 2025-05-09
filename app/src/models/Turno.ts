// src/models/Turno.ts
import mongoose, { Schema, Model } from 'mongoose';
import { ITurno } from '@/types/turno';

const TurnoSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    duration: { type: Number, required: true, default: 60 },
    status: {
        type: String,
        enum: ['pendiente', 'confirmado', 'cancelado', 'completado'],
        default: 'pendiente'
    },
    notas: { type: String }
}, {
    timestamps: true
});

export const Turno: Model<ITurno> =
    mongoose.models.Turno ||
    mongoose.model<ITurno>('Turno', TurnoSchema);
