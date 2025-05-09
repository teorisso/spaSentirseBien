import mongoose, { Schema } from 'mongoose';
import { IProfessional } from '@/types/professional';

const professionalSchema = new Schema<IProfessional>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    specialties: [{
        type: String,
        required: true
    }],
    schedule: [{
        day: {
            type: Number,
            required: true,
            min: 0,
            max: 6
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
professionalSchema.index({ email: 1 });
professionalSchema.index({ active: 1 });
professionalSchema.index({ specialties: 1 });

export const Professional = mongoose.models.Professional || mongoose.model<IProfessional>('Professional', professionalSchema); 