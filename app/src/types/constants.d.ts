export const HORARIO_INICIO = '09:00';
export const HORARIO_FIN = '18:00';

export const DIAS_FESTIVOS = [
    '2024-01-01', // Año Nuevo
    '2024-02-12', // Carnaval
    '2024-02-13', // Carnaval
    '2024-03-24', // Día Nacional de la Memoria
    '2024-03-28', // Jueves Santo
    '2024-03-29', // Viernes Santo
    '2024-03-31', // Domingo de Pascua
    '2024-04-02', // Día del Veterano y de los Caídos en la Guerra de Malvinas
    '2024-05-01', // Día del Trabajador
    '2024-05-25', // Día de la Revolución de Mayo
    '2024-06-17', // Día Paso a la Inmortalidad del General Martín Miguel de Güemes
    '2024-06-20', // Día Paso a la Inmortalidad del General Manuel Belgrano
    '2024-07-09', // Día de la Independencia
    '2024-08-17', // Paso a la Inmortalidad del General José de San Martín
    '2024-10-12', // Día del Respeto a la Diversidad Cultural
    '2024-11-20', // Día de la Soberanía Nacional
    '2024-12-08', // Día de la Inmaculada Concepción de María
    '2024-12-25', // Navidad
];

export const STATUS_COLORS = {
    pendiente: 'yellow',
    confirmado: 'green',
    cancelado: 'red',
    completado: 'blue'
} as const;

export const STATUS_LABELS = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    completado: 'Completado'
} as const;

export const ROLES = {
    user: 'Usuario',
    admin: 'Administrador',
    professional: 'Profesional'
} as const;

export const DAYS_OF_WEEK = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
} as const; 