export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface HorarioDisponible {
    startTime: string;
    endTime: string;
} 