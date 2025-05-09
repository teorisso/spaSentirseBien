'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'exito' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMensaje(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        await login(data.token, data.user);
        const userRole = data.user?.rol;

        setTimeout(() => {
          if (String(userRole).toLowerCase() === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/reserva');
          }
        }, 300);
      } else {
        setMensaje(data.error || 'Error en login');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error de conexión. Intente nuevamente.');
      setTipoMensaje('error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHero 
        title="Iniciar Sesión"
        description="Ingresa a tu cuenta para reservar tus turnos y acceder a todos los beneficios de Sentirse Bien."
      />

      <main className="py-16 px-4 bg-white font-roboto flex justify-center">
        <div className="bg-[#F5F9F8] p-8 rounded-xl shadow-md w-full max-w-lg text-[#436E6C]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#436E6C] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full p-3 rounded-md border border-[#B6D5C8] focus:outline-none focus:ring-2 focus:ring-[#436E6C]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#436E6C] mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-md border border-[#B6D5C8] focus:outline-none focus:ring-2 focus:ring-[#436E6C]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#436E6C] text-white py-3 rounded-md hover:bg-[#5A9A98] transition disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
            </button>

            {mensaje && (
              <div
                className={`text-sm px-4 py-2 rounded-md mt-2 ${
                  tipoMensaje === 'exito'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {mensaje}
              </div>
            )}

            <div className="text-center text-sm text-[#436E6C]">
              <Link href="/registro" className="hover:text-[#5A9A98] transition-colors duration-300">
                ¿No tienes una cuenta? Regístrate
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}