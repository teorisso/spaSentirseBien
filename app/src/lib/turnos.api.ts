// src/lib/turnos.api.ts
import { apiRequest } from './apiClient';

export interface TurnoPayload {
    date: string;
    service: string;
}

export interface Turno extends TurnoPayload {
    _id:        string;
    userId:     string;
    status:     'pendiente' | 'confirmado' | 'cancelado';
    createdAt:  string;
    updatedAt:  string;
    serviceData: { _id: string; name: string; category: string };
}

// Helper para lanzar errores si el status no es OK
async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
    }
    return res.json();
}

export const getTurnos = (): Promise<Turno[]> =>
    apiRequest('/api/turnos').then(res => handleResponse<Turno[]>(res));

export const createTurno = (payload: TurnoPayload): Promise<Turno> =>
    apiRequest('/api/turnos', {
        method: 'POST',
        body: JSON.stringify(payload),
    }).then(res => handleResponse<Turno>(res));

export const updateTurno = (
    id: string,
    payload: Partial<TurnoPayload & { status: string }>
): Promise<Turno> =>
    apiRequest(`/api/turnos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    }).then(res => handleResponse<Turno>(res));

export const deleteTurno = (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/turnos/${id}`, {
        method: 'DELETE',
    }).then(res => handleResponse<{ message: string }>(res));