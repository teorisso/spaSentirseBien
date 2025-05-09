import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/');
            }
        } catch (error) {
            setError('Ocurrió un error al iniciar sesión');
        }
    };

    return (
        <>
            <PageHero 
                title="Iniciar Sesión"
                description="Ingresa a tu cuenta para reservar tus turnos y acceder a todos los beneficios de Sentirse Bien."
            />

            <main className="bg-white font-roboto py-16">
                <div className="max-w-md mx-auto px-4">
                    <motion.div 
                        className="bg-[#F5F9F8] p-8 rounded-xl shadow-lg border border-[#B6D5C8]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#436E6C] mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full p-3 rounded-md border border-[#B6D5C8] focus:outline-none focus:ring-2 focus:ring-[#436E6C] text-[#436E6C]"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#436E6C] mb-1">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full p-3 rounded-md border border-[#B6D5C8] focus:outline-none focus:ring-2 focus:ring-[#436E6C] text-[#436E6C]"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#436E6C] text-white py-3 rounded-md hover:bg-[#5A9A98] transition-colors duration-300 font-medium"
                            >
                                Iniciar Sesión
                            </button>

                            <div className="text-center text-sm text-[#436E6C]">
                                <Link href="/auth/register" className="hover:text-[#5A9A98] transition-colors duration-300">
                                    ¿No tienes una cuenta? Regístrate
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>
        </>
    );
} 