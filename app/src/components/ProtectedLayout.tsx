import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedLayoutProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedLayout({ children, requireAdmin = false }: ProtectedLayoutProps) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/signin');
        }

        if (!isLoading && requireAdmin && !isAdmin) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || (requireAdmin && !isAdmin)) {
        return null;
    }

    return <>{children}</>;
} 