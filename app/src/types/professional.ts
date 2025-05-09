export interface IProfessional {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
} 