import { useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email
                })
            });

            if (!res.ok) {
                throw new Error('Error al actualizar el perfil');
            }

            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar el perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (!res.ok) {
                throw new Error('Error al actualizar la contraseña');
            }

            toast.success('Contraseña actualizada correctamente');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error('Error al actualizar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedLayout>
            <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Mi Perfil</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Actualiza tu información personal
                        </p>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="label">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900">Cambiar Contraseña</h3>
                            <form onSubmit={handleUpdatePassword} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="currentPassword" className="label">
                                        Contraseña Actual
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="input mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="label">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="label">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
} 