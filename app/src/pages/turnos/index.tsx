import ProtectedLayout from '@/components/ProtectedLayout';
import TurnosList from '@/components/TurnosList';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';

export default function TurnosPage() {
    return (
        <ProtectedLayout>
            <PageHero 
                title="Mis Turnos"
                description="Gestiona tus turnos y reservas de manera fácil y rápida."
            />

            <main className="bg-white font-roboto py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <TurnosList />
                    </motion.div>
                </div>
            </main>
        </ProtectedLayout>
    );
} 