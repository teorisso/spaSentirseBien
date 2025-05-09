import { IService } from './service';
import { IProfessional } from './professional';
import { IUser } from './user';

export interface ITurno {
    _id: string;
    userId: string;
    user?: IUser;
    service: IService;
    professional: IProfessional;
    fecha: string;
    hora: string;
    duration: number;
    status: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
    notas?: string;
    createdAt: string;
    updatedAt: string;
}

export type TurnoStatus = ITurno['status']; 