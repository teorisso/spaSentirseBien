import { Document } from 'mongoose';

export interface IProfessional extends Document {
    name: string;
    email: string;
    phone: string;
    specialties: string[];
    schedule: {
        day: number;
        startTime: string;
        endTime: string;
    }[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
} 