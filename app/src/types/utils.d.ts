export type Status = 'pendiente' | 'confirmado' | 'cancelado' | 'completado';

export type Role = 'user' | 'admin' | 'professional';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface Schedule {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
}

export interface ApiError {
    message: string;
    status: number;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 