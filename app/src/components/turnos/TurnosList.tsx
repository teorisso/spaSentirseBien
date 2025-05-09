import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ITurno } from '@/types/turno';
import { apiRequest } from '@/lib/apiClient';

interface TurnosListProps {
    appointments: ITurno[];
}

export default function TurnosList({ appointments }: TurnosListProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleCancelAppointment = async (appointmentId: string) => {
        if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiRequest(`/api/turnos/${appointmentId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'cancelado' })
            });

            // Actualizar la lista localmente
            const updatedAppointments = appointments.map(appointment =>
                appointment._id === appointmentId
                    ? { ...appointment, status: 'cancelado' }
                    : appointment
            );
            // Notificar al componente padre del cambio
            // TODO: Implementar callback para actualizar la lista en el componente padre
        } catch (error) {
            setError('Error al cancelar el turno');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmado':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            case 'completado':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No tienes turnos reservados</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {appointments.map(appointment => (
                <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {appointment.service.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Profesional: {appointment.professional.name}
                            </p>
                        </div>
                        <span className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${getStatusColor(appointment.status)}
                        `}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Fecha</p>
                            <p className="mt-1 text-sm text-gray-900">
                                {format(parseISO(appointment.fecha), 'EEEE d MMMM yyyy', { locale: es })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Hora</p>
                            <p className="mt-1 text-sm text-gray-900">
                                {format(parseISO(`${appointment.fecha}T${appointment.hora}`), 'HH:mm')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Duración</p>
                            <p className="mt-1 text-sm text-gray-900">
                                {appointment.duration} minutos
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Precio</p>
                            <p className="mt-1 text-sm text-gray-900">
                                ${appointment.service.price}
                            </p>
                        </div>
                    </div>

                    {appointment.notas && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">Notas</p>
                            <p className="mt-1 text-sm text-gray-900">{appointment.notas}</p>
                        </div>
                    )}

                    {appointment.status === 'pendiente' && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => handleCancelAppointment(appointment._id)}
                                disabled={loading}
                                className={`
                                    px-4 py-2 rounded-md text-sm font-medium
                                    ${loading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                                    }
                                `}
                            >
                                {loading ? 'Cancelando...' : 'Cancelar Turno'}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
} 