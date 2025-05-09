// src/pages/reserva.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TurnosLayout from '../components/turnos/TurnosLayout';
import TurnoForm from '../components/turnos/TurnoForm';
import { toast } from 'react-hot-toast';
import servicios from '@/data/servicios';
import { IProfessional } from '@/types/professional';

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

export default function ReservaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [professionals, setProfessionals] = useState<IProfessional[]>([]);

    // Obtener todos los servicios de todas las categorías
    const services: Service[] = servicios.reduce((acc: Service[], categoria) => {
        const categoriaServices = categoria.services.map(servicio => ({
            _id: servicio.name,
            name: servicio.name,
            price: parseInt(servicio.price.replace('$', '')),
            duration: 60 // Duración por defecto de 60 minutos
        }));
        return [...acc, ...categoriaServices];
    }, []);

    useEffect(() => {
        // Obtener profesionales al cargar la página
        const fetchProfesionales = async () => {
            try {
                const res = await fetch('/api/profesionales');
                const data = await res.json();
                setProfessionals(data);
            } catch (error) {
                toast.error('Error al cargar profesionales');
            }
        };
        fetchProfesionales();
    }, []);

    return (
        <TurnosLayout
            title="Reservar un turno"
            description="Elige servicio y fecha"
        >
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <TurnoForm
                services={services}
                professionals={professionals}
            />
        </TurnosLayout>
    );
}