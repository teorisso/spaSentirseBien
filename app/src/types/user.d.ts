import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'professional';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSession {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'professional';
} 