import { Document } from 'mongoose';

export interface IService extends Document {
    name: string;
    description: string;
    duration: number;
    price: number;
    image?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
} 