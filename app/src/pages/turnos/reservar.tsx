import React from 'react';
import { useSession } from 'next-auth/react';
import ProtectedLayout from '@/components/ProtectedLayout';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';
import TurnoForm from '@/components/turnos/TurnoForm';
import servicios from '@/data/servicios';

export default function ReservarTurnoPage() {
    // Obtener todos los servicios de todas las categorías
    const todosLosServicios = servicios.reduce((acc, categoria) => {
        return [...acc, ...categoria.services];
    }, [] as any[]);

    return (
        <ProtectedLayout>
            <PageHero 
                title="Reservar Turno"
                description="Selecciona el servicio y la fecha que mejor te convenga."
            />

            <main className="bg-white font-roboto py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <TurnoForm services={todosLosServicios} />
                    </motion.div>
                </div>
            </main>
        </ProtectedLayout>
    );
} 