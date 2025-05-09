import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export function useAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isAuthenticated = status === 'authenticated';
    const isLoading = status === 'loading';
    const user = session?.user;

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/auth/signin');
    };

    const isAdmin = user?.rol === 'admin';

    return {
        user,
        isAuthenticated,
        isLoading,
        logout,
        isAdmin
    };
} 