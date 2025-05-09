// Horario de trabajo del spa
export const HORARIO_INICIO = '09:00';
export const HORARIO_FIN = '18:00';

// Días festivos 2025
export const DIAS_FESTIVOS = [
    '2025-01-01', // Año Nuevo
    '2025-02-24', // Carnaval
    '2025-02-25', // Carnaval
    '2025-03-24', // Día Nacional de la Memoria
    '2025-04-17', // Jueves Santo
    '2025-04-18', // Viernes Santo
    '2025-04-20', // Domingo de Pascua
    '2025-04-02', // Día del Veterano y de los Caídos en la Guerra de Malvinas
    '2025-05-01', // Día del Trabajador
    '2025-05-25', // Día de la Revolución de Mayo
    '2025-06-16', // Día Paso a la Inmortalidad del General Martín Miguel de Güemes
    '2025-06-20', // Día de la Bandera
    '2025-07-09', // Día de la Independencia
    '2025-08-17', // Día Paso a la Inmortalidad del General José de San Martín
    '2025-10-12', // Día del Respeto a la Diversidad Cultural
    '2025-11-20', // Día de la Soberanía Nacional
    '2025-12-08', // Día de la Inmaculada Concepción de María
    '2025-12-25', // Navidad
];

// Estados de turno
export const TURNO_STATUS = {
    PENDIENTE: 'pendiente',
    CONFIRMADO: 'confirmado',
    CANCELADO: 'cancelado',
    COMPLETADO: 'completado',
} as const;

// Roles de usuario
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
} as const;

// Días de la semana
export const DIAS_SEMANA = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
] as const; 