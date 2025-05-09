import { addDays, isWeekend, isBefore, isAfter, parse, format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { connectDB } from './db';
import { Turno } from '@/models/Turno';
import { HORARIO_INICIO, HORARIO_FIN, DIAS_FESTIVOS } from '@/types/constants';
import { z } from 'zod';
import { ITurno } from '@/types/turno';

// Horario de trabajo del spa
const HORARIO_INICIO_OBJ = parse(HORARIO_INICIO, 'HH:mm', new Date());
const HORARIO_FIN_OBJ = parse(HORARIO_FIN, 'HH:mm', new Date());

// Días festivos 2025
const DIAS_FESTIVOS_OBJ = DIAS_FESTIVOS.map(date => parse(date, 'yyyy-MM-dd', new Date()));

// Interfaces
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

// Esquema de validación
export const turnoSchema = z.object({
    userId: z.string(),
    service: z.string(),
    professional: z.string(),
    fecha: z.string().refine((date) => {
        const result = validations.validarFecha(date);
        return result.isValid;
    }, 'Fecha inválida'),
    hora: z.string().refine((time) => {
        const result = validations.validarHorario(time);
        return result.isValid;
    }, 'Horario inválido'),
    duration: z.number().min(15).max(240),
    status: z.enum(['pendiente', 'confirmado', 'cancelado', 'completado']),
    notas: z.string().optional(),
});

// Funciones de validación
export const validations = {
    validarFecha: (fecha: string): ValidationResult => {
        const date = parse(fecha, 'yyyy-MM-dd', new Date());
        const today = new Date();
        const maxDate = addMinutes(today, 30 * 24 * 60); // 30 días

        if (isBefore(date, today)) {
            return {
                isValid: false,
                error: 'No se pueden reservar fechas pasadas'
            };
        }

        if (isAfter(date, maxDate)) {
            return {
                isValid: false,
                error: 'No se pueden reservar fechas con más de 30 días de anticipación'
            };
        }

        if (isWeekend(date)) {
            return {
                isValid: false,
                error: 'No se pueden reservar turnos los fines de semana'
            };
        }

        if (DIAS_FESTIVOS.includes(fecha)) {
            return {
                isValid: false,
                error: 'No se pueden reservar turnos en días festivos'
            };
        }

        return { isValid: true };
    },

    validarHorario: (hora: string): ValidationResult => {
        const time = parse(hora, 'HH:mm', new Date());
        const startTime = parse(HORARIO_INICIO, 'HH:mm', new Date());
        const endTime = parse(HORARIO_FIN, 'HH:mm', new Date());

        if (isBefore(time, startTime) || isAfter(time, endTime)) {
            return {
                isValid: false,
                error: 'El horario debe estar entre las 9:00 y las 18:00'
            };
        }

        return { isValid: true };
    },

    validarDisponibilidad: async (
        fecha: string,
        hora: string,
        duracion: number,
        turnosExistentes: ITurno[]
    ): Promise<ValidationResult> => {
        const turnoInicio = parse(`${fecha} ${hora}`, 'yyyy-MM-dd HH:mm', new Date());
        const turnoFin = addMinutes(turnoInicio, duracion);

        // Verificar si hay turnos que se superponen
        const haySuperposicion = turnosExistentes.some(turno => {
            if (turno.status === 'cancelado') return false;

            const inicioExistente = parse(
                `${turno.fecha} ${turno.hora}`,
                'yyyy-MM-dd HH:mm',
                new Date()
            );
            const finExistente = addMinutes(inicioExistente, turno.duration);

            return (
                (turnoInicio >= inicioExistente && turnoInicio < finExistente) ||
                (turnoFin > inicioExistente && turnoFin <= finExistente) ||
                (turnoInicio <= inicioExistente && turnoFin >= finExistente)
            );
        });

        if (haySuperposicion) {
            return {
                isValid: false,
                error: 'Ya existe un turno reservado en ese horario'
            };
        }

        return { isValid: true };
    },

    validarDuracion: (duracion: number): ValidationResult => {
        if (duracion < 15) {
            return {
                isValid: false,
                error: 'La duración mínima del servicio es de 15 minutos'
            };
        }

        if (duracion > 240) {
            return {
                isValid: false,
                error: 'La duración máxima del servicio es de 4 horas'
            };
        }

        return { isValid: true };
    }
}; 