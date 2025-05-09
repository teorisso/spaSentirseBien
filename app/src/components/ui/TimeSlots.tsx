import React from 'react';
import { format, parse, isBefore, isAfter, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { validations } from '@/lib/validations';
import { ITurno } from '@/types/turno';

interface TimeSlotsProps {
    selectedDate: Date;
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    existingAppointments: ITurno[];
    serviceDuration: number;
}

export default function TimeSlots({
    selectedDate,
    selectedTime,
    onSelectTime,
    existingAppointments,
    serviceDuration
}: TimeSlotsProps) {
    const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const generateTimeSlots = async () => {
            setLoading(true);
            const slots: string[] = [];
            const startTime = parse('09:00', 'HH:mm', new Date());
            const endTime = parse('18:00', 'HH:mm', new Date());

            let currentTime = startTime;
            while (isBefore(currentTime, endTime)) {
                const timeStr = format(currentTime, 'HH:mm');
                const result = await validations.validarDisponibilidad(
                    format(selectedDate, 'yyyy-MM-dd'),
                    timeStr,
                    serviceDuration,
                    existingAppointments
                );

                if (result.isValid) {
                    slots.push(timeStr);
                }

                currentTime = addMinutes(currentTime, 30);
            }

            setAvailableSlots(slots);
            setLoading(false);
        };

        generateTimeSlots();
    }, [selectedDate, existingAppointments, serviceDuration]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (availableSlots.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay horarios disponibles para esta fecha
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-2">
            {availableSlots.map(time => (
                <button
                    key={time}
                    onClick={() => onSelectTime(time)}
                    className={`
                        py-2 px-4 rounded-lg text-sm font-medium
                        ${selectedTime === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }
                    `}
                >
                    {format(parse(time, 'HH:mm', new Date()), 'HH:mm')}
                </button>
            ))}
        </div>
    );
} 